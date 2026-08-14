import type { AdapterContext, ProviderAdapter, TestCallResult } from "../types";
import { resolveTransport } from "../transport";

export const auth0Adapter: ProviderAdapter = {
  category: "auth",
  slotKey: "auth0",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const domain = (ctx.secrets.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    const transport = resolveTransport(ctx, ctx.secrets.client_secret || domain);
    if (transport === "mock" || !domain) {
      return {
        ok: true,
        category: "auth",
        slotKey: "auth0",
        sandbox: ctx.sandbox,
        transport: "mock",
        latencyMs: 2,
        message:
          "Auth0 slot is wired. Feature flag remains OFF — dummy OTP is still the live login path.",
        details: { domain: domain || null, flag: "auth0_enabled defaults false" },
      };
    }
    const t0 = Date.now();
    const res = await fetch(`https://${domain}/.well-known/openid-configuration`);
    const latencyMs = Date.now() - t0;
    const ok = res.ok;
    return {
      ok,
      category: "auth",
      slotKey: "auth0",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: ok
        ? "Auth0 OIDC discovery succeeded. Login stays OTP until you flip the feature flag."
        : `Auth0 discovery returned ${res.status}`,
      details: { domain, httpStatus: res.status },
    };
  },
};
