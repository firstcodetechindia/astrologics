/**
 * Auth0 — official SDK, feature-flagged OFF.
 *
 * Custom authorize/token code was removed. PKCE, state, nonce, and ID-token
 * verification are handled by @auth0/nextjs-auth0 (which uses openid-client).
 * Credentials still come from the Super Admin vault, not .env.
 *
 * Dummy OTP remains the live login path until the flag is flipped.
 */
import { createHash } from "node:crypto";
import { AUTH0_FLAG_KEY, getFeatureFlag } from "@/lib/platform/feature-flags";
import { decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { getProviderBySlot } from "@/lib/platform/integrations/store";
import { isMockCredential } from "@/lib/platform/integrations/transport";
import { siteConfig } from "@/lib/site-config";

export type AuthMode = "otp" | "auth0";

export type Auth0VaultConfig = {
  domain: string;
  clientId: string;
  clientSecret: string;
  appSecret: string;
  callbackPath: string;
};

export async function getAuth0VaultConfig(): Promise<Auth0VaultConfig | null> {
  const row = await getProviderBySlot("auth", "auth0");
  if (!row) return null;
  const secrets = await decryptProviderSecrets(String(row.id));
  let config: Record<string, unknown> = {};
  try {
    config = JSON.parse(String(row.config_json || "{}")) as Record<string, unknown>;
  } catch {
    config = {};
  }
  const domain = (secrets.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const clientId = secrets.client_id || "";
  const clientSecret = secrets.client_secret || "";
  const appSecret = secrets.app_secret || "";
  if (!domain || !clientId || !clientSecret || !appSecret) return null;
  const mock =
    isMockCredential(domain) ||
    isMockCredential(clientId) ||
    isMockCredential(clientSecret) ||
    isMockCredential(appSecret);
  if (mock) return null;
  return {
    domain,
    clientId,
    clientSecret,
    appSecret,
    callbackPath: String(config.callback_path || "/api/auth/callback"),
  };
}

export async function isAuth0Enabled(): Promise<boolean> {
  try {
    const flag = await getFeatureFlag(AUTH0_FLAG_KEY);
    if (!flag) return false;
    const cfg = await getAuth0VaultConfig();
    return Boolean(cfg);
  } catch {
    return false;
  }
}

export async function resolveAuthMode(): Promise<AuthMode> {
  return (await isAuth0Enabled()) ? "auth0" : "otp";
}

function cookieSecret(appSecret: string): string {
  if (/^[0-9a-fA-F]{64}$/.test(appSecret)) return appSecret;
  return createHash("sha256").update(appSecret).digest("hex");
}

export async function getAuth0Client() {
  if (!(await isAuth0Enabled())) {
    throw new Error("Auth0 is feature-flagged OFF. Dummy OTP remains the active login path.");
  }
  const cfg = await getAuth0VaultConfig();
  if (!cfg) {
    throw new Error("Auth0 credentials are missing from the vault.");
  }
  const { Auth0Client } = await import("@auth0/nextjs-auth0/server");
  return new Auth0Client({
    domain: cfg.domain,
    clientId: cfg.clientId,
    clientSecret: cfg.clientSecret,
    secret: cookieSecret(cfg.appSecret),
    appBaseUrl: siteConfig.siteUrl,
    routes: {
      login: "/api/auth/login",
      callback: "/api/auth/callback",
    },
  });
}
