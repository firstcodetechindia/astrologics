import { getProviderBySlot } from "@/lib/platform/integrations/store";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { resolveTransport } from "@/lib/platform/integrations/transport";
import { smtpAdapter, sendgridAdapter } from "@/lib/platform/integrations/adapters/email";
import { genericSmsAdapter } from "@/lib/platform/integrations/adapters/sms";
import { metaWhatsappAdapter } from "@/lib/platform/integrations/adapters/whatsapp";
import type {
  AdapterContext,
  EmailProvider,
  SmsProvider,
  WhatsappProvider,
} from "@/lib/platform/integrations/types";

function parseConfig(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function ctxFor(category: "email" | "sms" | "whatsapp", slotKey: string) {
  const row = await getProviderBySlot(category, slotKey);
  if (!row) throw new Error(`No ${category}/${slotKey} slot configured.`);
  const secrets = await decryptProviderSecrets(String(row.id));
  const ctx: AdapterContext = {
    secrets,
    config: parseConfig(String(row.config_json || "{}")),
    sandbox: Boolean(row.sandbox_mode),
  };
  const liveCred =
    secrets.password || secrets.api_key || secrets.access_token || secrets.secret_key || "";
  return {
    row,
    ctx,
    transport: resolveTransport(ctx, liveCred),
    slotKey: String(row.slot_key),
    providerId: String(row.id),
  };
}

export async function resolveEmail(): Promise<{
  provider: EmailProvider;
  ctx: AdapterContext;
  transport: ReturnType<typeof resolveTransport>;
  slotKey: string;
  providerId: string;
}> {
  const smtp = await getProviderBySlot("email", "smtp");
  const sendgrid = await getProviderBySlot("email", "sendgrid");
  const slot = smtp ? "smtp" : sendgrid ? "sendgrid" : "smtp";
  const resolved = await ctxFor("email", slot);
  const provider = slot === "sendgrid" ? (sendgridAdapter as unknown as EmailProvider) : smtpAdapter;
  return { provider, ...resolved };
}

export async function resolveSms() {
  const resolved = await ctxFor("sms", "generic_sms");
  return { provider: genericSmsAdapter as SmsProvider, ...resolved };
}

export async function resolveWhatsapp() {
  const resolved = await ctxFor("whatsapp", "meta_whatsapp");
  return { provider: metaWhatsappAdapter as WhatsappProvider, ...resolved };
}
