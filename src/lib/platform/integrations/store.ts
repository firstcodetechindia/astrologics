import { getSql, hasDatabaseUrl } from "@/lib/db";
import { PROVIDER_SLOTS, CATEGORY_LABELS, slotSpec } from "@/lib/platform/integrations/catalog";
import type {
  IntegrationCategory,
  ProviderPublicView,
  SecretPublicView,
} from "@/lib/platform/integrations/types";
import { INTEGRATION_CATEGORIES } from "@/lib/platform/integrations/types";
import { maskSecret } from "@/lib/platform/secrets/envelope";
import { listProviderSecretsPublic } from "@/lib/platform/secrets/vault";

export { CATEGORY_LABELS };

let slotsReady = false;

export async function ensureProviderSlots() {
  if (!hasDatabaseUrl()) {
    throw new Error("Database is not configured");
  }
  if (slotsReady) return;
  const sql = getSql();
  const counted = await sql`SELECT count(*)::int AS n FROM integration_providers`;
  if (Number(counted[0]?.n) >= PROVIDER_SLOTS.length) {
    slotsReady = true;
    return;
  }
  for (const slot of PROVIDER_SLOTS) {
    const config = defaultConfig(slot.slotKey, slot.category);
    await sql`
      INSERT INTO integration_providers (
        category, slot_key, display_name, enabled, sandbox_mode, is_primary, config_json
      )
      VALUES (
        ${slot.category},
        ${slot.slotKey},
        ${slot.displayName},
        ${false},
        ${slot.sandboxDefault},
        ${Boolean(slot.isPrimary)},
        ${JSON.stringify(config)}
      )
      ON CONFLICT (category, slot_key)
      DO UPDATE SET
        display_name = EXCLUDED.display_name,
        is_primary = EXCLUDED.is_primary
    `;
  }
  slotsReady = true;
}

function defaultConfig(slotKey: string, category: string): Record<string, unknown> {
  if (category === "llm" && slotKey === "openai") {
    return { model: "gpt-4o-mini", rpm: 60, tpm: 80000 };
  }
  if (category === "llm" && slotKey === "anthropic") {
    return { model: "claude-sonnet-4-5", rpm: 40 };
  }
  if (category === "sms") {
    return { provider_kind: "msg91", sender_id: "CGYAN" };
  }
  if (slotKey === "auth0") {
    return { callback_path: "/api/auth/callback" };
  }
  if (slotKey === "smtp") {
    return { port: 587, secure: "starttls" };
  }
  return {};
}

export async function listProvidersPublic(): Promise<ProviderPublicView[]> {
  await ensureProviderSlots();
  const sql = getSql();
  const rows = await sql`
    SELECT id, category, slot_key, display_name, enabled, sandbox_mode, is_primary,
           config_json, created_at, updated_at
    FROM integration_providers
    ORDER BY category, is_primary DESC, display_name
  `;
  const secretRows = await sql`
    SELECT provider_id, secret_name, last4, rotated_at
    FROM integration_secrets
  `;
  const usageRows = await sql`
    SELECT provider_id, metric, COALESCE(SUM(quantity), 0)::float AS quantity
    FROM integration_usage
    WHERE occurred_at > now() - interval '30 days'
    GROUP BY provider_id, metric
  `;
  const secretsByProvider = new Map<string, typeof secretRows>();
  for (const s of secretRows) {
    const id = String(s.provider_id);
    const list = secretsByProvider.get(id) || [];
    list.push(s);
    secretsByProvider.set(id, list);
  }
  const usageByProvider = new Map<string, { metric: string; quantity: number }[]>();
  for (const u of usageRows) {
    const id = String(u.provider_id);
    const list = usageByProvider.get(id) || [];
    list.push({ metric: String(u.metric), quantity: Number(u.quantity) });
    usageByProvider.set(id, list);
  }
  const views = rows.map((row) =>
    toPublicViewSync(row, secretsByProvider.get(String(row.id)) || [], usageByProvider.get(String(row.id)) || [])
  );
  const catRank = new Map(INTEGRATION_CATEGORIES.map((c, i) => [c, i]));
  views.sort((a, b) => {
    const ca = catRank.get(a.category) ?? 99;
    const cb = catRank.get(b.category) ?? 99;
    if (ca !== cb) return ca - cb;
    if (a.isPrimary !== b.isPrimary) return Number(b.isPrimary) - Number(a.isPrimary);
    return a.displayName.localeCompare(b.displayName);
  });
  return views;
}

export async function getProviderById(id: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, category, slot_key, display_name, enabled, sandbox_mode, is_primary,
           config_json, created_at, updated_at
    FROM integration_providers
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getProviderBySlot(category: IntegrationCategory, slotKey: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, category, slot_key, display_name, enabled, sandbox_mode, is_primary,
           config_json, created_at, updated_at
    FROM integration_providers
    WHERE category = ${category} AND slot_key = ${slotKey}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function usageFor(providerId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT metric, COALESCE(SUM(quantity), 0)::float AS quantity
    FROM integration_usage
    WHERE provider_id = ${providerId}
      AND occurred_at > now() - interval '30 days'
    GROUP BY metric
  `;
  return rows.map((r) => ({
    metric: String(r.metric),
    quantity: Number(r.quantity),
  }));
}

export async function recordUsage(
  providerId: string,
  metric: string,
  quantity: number,
  metadata?: Record<string, unknown>
) {
  const sql = getSql();
  await sql`
    INSERT INTO integration_usage (provider_id, metric, quantity, metadata)
    VALUES (
      ${providerId},
      ${metric},
      ${quantity},
      ${JSON.stringify(metadata ?? {})}
    )
  `;
}

export async function updateProviderFlags(
  id: string,
  patch: {
    enabled?: boolean;
    sandboxMode?: boolean;
    config?: Record<string, unknown>;
  }
) {
  const current = await getProviderById(id);
  if (!current) throw new Error("Provider not found");
  const enabled = patch.enabled ?? Boolean(current.enabled);
  const sandbox = patch.sandboxMode ?? Boolean(current.sandbox_mode);
  let configJson = String(current.config_json || "{}");
  if (patch.config) {
    const prev = parseJson(configJson);
    configJson = JSON.stringify({ ...prev, ...patch.config });
  }
  const sql = getSql();
  await sql`
    UPDATE integration_providers
    SET enabled = ${enabled},
        sandbox_mode = ${sandbox},
        config_json = ${configJson},
        updated_at = now()
    WHERE id = ${id}
  `;
}

export async function toPublicView(row: Record<string, unknown>): Promise<ProviderPublicView> {
  const secretsRows = await listProviderSecretsPublic(String(row.id));
  const usage = await usageFor(String(row.id));
  return toPublicViewSync(row, secretsRows, usage);
}

function toPublicViewSync(
  row: Record<string, unknown>,
  secretsRows: Record<string, unknown>[],
  usage: { metric: string; quantity: number }[]
): ProviderPublicView {
  const category = String(row.category) as IntegrationCategory;
  const slotKey = String(row.slot_key);
  const spec = slotSpec(category, slotKey);
  const byName = new Map(secretsRows.map((s) => [String(s.secret_name), s]));
  const secretFields = spec?.secretFields ?? [];
  const secrets: SecretPublicView[] = secretFields.map((field) => {
    const stored = byName.get(field.name);
    const last4 = stored ? String(stored.last4) : null;
    return {
      name: field.name,
      label: field.label,
      configured: Boolean(stored),
      last4,
      masked: stored ? maskSecret(String(stored.last4)) : "Not set",
      rotatedAt: stored ? String(stored.rotated_at) : null,
    };
  });
  return {
    id: String(row.id),
    category,
    slotKey,
    displayName: spec?.displayName ?? String(row.display_name),
    description: spec?.description ?? "",
    enabled: Boolean(row.enabled),
    sandboxMode: Boolean(row.sandbox_mode),
    isPrimary: Boolean(row.is_primary),
    config: parseJson(String(row.config_json || "{}")),
    secretFields,
    configFields: spec?.configFields ?? [],
    secrets,
    usage,
  };
}

function parseJson(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
