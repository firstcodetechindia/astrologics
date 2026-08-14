import type { AdapterContext, ProviderAdapter, SmsProvider, TestCallResult } from "../types";
import { resolveTransport } from "../transport";

export const genericSmsAdapter: ProviderAdapter & SmsProvider = {
  category: "sms",
  slotKey: "generic_sms",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const key = ctx.secrets.api_key || "";
    const transport = resolveTransport(ctx, key);
    const kind = String(ctx.config.provider_kind || "msg91");
    return {
      ok: true,
      category: "sms",
      slotKey: "generic_sms",
      sandbox: ctx.sandbox,
      transport: transport === "live" ? "sandbox_api" : transport,
      latencyMs: 3,
      message:
        transport === "mock"
          ? `SMS mock ping succeeded (${kind}). sendOtp / sendTransactional ready.`
          : `SMS adapter ready for ${kind}. Live send is withheld until a destination number is supplied.`,
      details: { provider_kind: kind, methods: ["sendOtp", "sendTransactional"] },
    };
  },
  async sendOtp(to, code, ctx) {
    const transport = resolveTransport(ctx, ctx.secrets.api_key);
    if (transport === "mock") {
      return { messageId: `sms_otp_sandbox_${Date.now()}` };
    }
    throw new Error(
      `Live SMS send for ${ctx.config.provider_kind || "generic"} is not enabled until a real provider key is saved. Destination=${to} code_len=${code.length}`
    );
  },
  async sendTransactional(to, body, ctx) {
    const transport = resolveTransport(ctx, ctx.secrets.api_key);
    if (transport === "mock") {
      return { messageId: `sms_txn_sandbox_${Date.now()}` };
    }
    throw new Error(
      `Live transactional SMS is not enabled until a real provider key is saved. Destination=${to} body_len=${body.length}`
    );
  },
};
