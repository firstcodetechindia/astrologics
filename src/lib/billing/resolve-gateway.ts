import { getProviderBySlot } from "@/lib/platform/integrations/store";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import {
  getPaymentGateway,
  preferredPaymentSlot,
} from "@/lib/platform/integrations/adapters/payment";
import { resolveTransport } from "@/lib/platform/integrations/transport";
import type { AdapterContext, PaymentGateway } from "@/lib/platform/integrations/types";

export type ResolvedGateway = {
  slotKey: string;
  gateway: PaymentGateway;
  ctx: AdapterContext;
  transport: ReturnType<typeof resolveTransport>;
};

function parseConfig(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Checkout always prefers Razorpay. Stripe is only used if Razorpay is missing. */
export async function resolvePaymentGateway(): Promise<ResolvedGateway> {
  const razorpay = await getProviderBySlot("payment", "razorpay");
  const stripe = await getProviderBySlot("payment", "stripe");
  const slot = preferredPaymentSlot(
    [razorpay ? "razorpay" : "", stripe ? "stripe" : ""].filter(Boolean)
  );
  const row = slot === "stripe" ? stripe : razorpay;
  if (!row) {
    throw new Error("No payment gateway slot is configured.");
  }
  const secrets = await decryptProviderSecrets(String(row.id));
  const ctx: AdapterContext = {
    secrets,
    config: parseConfig(String(row.config_json || "{}")),
    sandbox: Boolean(row.sandbox_mode),
  };
  const liveCred = secrets.key_id || secrets.secret_key || "";
  return {
    slotKey: String(row.slot_key),
    gateway: getPaymentGateway(String(row.slot_key)),
    ctx,
    transport: resolveTransport(ctx, liveCred),
  };
}
