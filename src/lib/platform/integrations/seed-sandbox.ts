import { getSql } from "@/lib/db";
import { ensureProviderSlots, getProviderBySlot } from "@/lib/platform/integrations/store";
import { upsertProviderSecret, decryptProviderSecrets } from "@/lib/platform/secrets/vault";
import { isMockCredential } from "@/lib/platform/integrations/transport";
import type { IntegrationCategory } from "@/lib/platform/integrations/types";

/** Clearly fake sandbox credentials — encrypted in DB, never live vendor keys. */
export const SANDBOX_SEEDS: {
  category: IntegrationCategory;
  slotKey: string;
  secrets: Record<string, string>;
}[] = [
  {
    category: "llm",
    slotKey: "openai",
    secrets: { api_key: "sandbox_llm_openai_TESTKEY99" },
  },
  {
    category: "voice",
    slotKey: "elevenlabs",
    secrets: { api_key: "sandbox_voice_eleven_WXYZ" },
  },
  {
    category: "payment",
    slotKey: "razorpay",
    secrets: {
      key_id: "rzp_test_sandbox_keyid_ABCD",
      key_secret: "sandbox_rzp_secret_WXYZ",
      webhook_secret: "sandbox_rzp_webhook_secret_TEST",
    },
  },
  {
    category: "payment",
    slotKey: "stripe",
    secrets: {
      publishable_key: "sandbox_stripe_pk_TEST",
      secret_key: "sandbox_stripe_sk_TEST",
    },
  },
  {
    category: "sms",
    slotKey: "generic_sms",
    secrets: { api_key: "sandbox_sms_msg91_Q1W2" },
  },
  {
    category: "email",
    slotKey: "smtp",
    secrets: { username: "sandbox_smtp_user", password: "sandbox_smtp_pass_7788" },
  },
  {
    category: "whatsapp",
    slotKey: "meta_whatsapp",
    secrets: { access_token: "sandbox_wa_meta_token_4455", app_secret: "sandbox_wa_app_6677" },
  },
  {
    category: "social",
    slotKey: "meta_social",
    secrets: {
      app_id: "sandbox_meta_appid",
      app_secret: "sandbox_meta_secret_8899",
      page_access_token: "sandbox_meta_page_0011",
    },
  },
  {
    category: "auth",
    slotKey: "auth0",
    secrets: {
      domain: "sandbox.auth0.example",
      client_id: "sandbox_auth0_client",
      client_secret: "sandbox_auth0_secret_2233",
      app_secret: "sandbox_auth0_cookie_4455",
    },
  },
];

export async function seedSandboxSecrets() {
  await ensureProviderSlots();
  const seeded: { category: string; slotKey: string; last4: Record<string, string> }[] = [];
  const skippedLive: { category: string; slotKey: string }[] = [];
  for (const item of SANDBOX_SEEDS) {
    const row = await getProviderBySlot(item.category, item.slotKey);
    if (!row) continue;
    let existing: Record<string, string> = {};
    try {
      existing = await decryptProviderSecrets(String(row.id));
    } catch {
      existing = {};
    }
    const hasLive = Object.values(existing).some((v) => v && !isMockCredential(v));
    if (hasLive) {
      skippedLive.push({ category: item.category, slotKey: item.slotKey });
      continue;
    }
    const last4: Record<string, string> = {};
    for (const [name, value] of Object.entries(item.secrets)) {
      const result = await upsertProviderSecret({
        providerId: String(row.id),
        secretName: name,
        plaintext: value,
      });
      last4[name] = result.last4;
    }
    const sql = getSql();
    await sql`
      UPDATE integration_providers
      SET enabled = ${true}, sandbox_mode = ${true}, updated_at = now()
      WHERE id = ${String(row.id)}
    `;
    seeded.push({ category: item.category, slotKey: item.slotKey, last4 });
  }
  return { seeded, skippedLive };
}
