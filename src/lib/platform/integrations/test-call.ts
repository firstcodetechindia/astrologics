import { getAdapter } from "./adapters";
import { recordUsage } from "./store";
import type { IntegrationCategory, TestCallResult } from "./types";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { getProviderById } from "./store";

function parseConfig(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function runProviderTest(providerId: string): Promise<TestCallResult> {
  const row = await getProviderById(providerId);
  if (!row) {
    throw new Error("Provider not found");
  }
  const category = String(row.category) as IntegrationCategory;
  const slotKey = String(row.slot_key);
  const adapter = getAdapter(category, slotKey);
  if (!adapter) {
    throw new Error(`No adapter for ${category}/${slotKey}`);
  }
  const secrets = await decryptProviderSecrets(providerId);
  const result = await adapter.testConnection({
    secrets,
    config: parseConfig(String(row.config_json || "{}")),
    sandbox: Boolean(row.sandbox_mode),
  });
  await recordUsage(providerId, "test_calls", 1, {
    ok: result.ok,
    transport: result.transport,
  });
  if (category === "llm") {
    await recordUsage(providerId, "requests", result.ok ? 1 : 0, { source: "test" });
  }
  return result;
}

/** One live/mock test per category — used for Phase 1 evidence. */
export async function runCategorySmokeTests(
  providers: { id: string; category: string; slot_key: string; is_primary: boolean }[]
): Promise<TestCallResult[]> {
  const seen = new Set<string>();
  const results: TestCallResult[] = [];
  const ordered = [...providers].sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
  for (const p of ordered) {
    if (seen.has(p.category)) continue;
    seen.add(p.category);
    results.push(await runProviderTest(p.id));
  }
  return results;
}
