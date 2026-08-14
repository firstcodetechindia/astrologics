import { getSql } from "@/lib/db";
import {
  decryptUtf8,
  encryptUtf8,
  generateDek,
  getWrappingKey,
  last4OfSecret,
} from "@/lib/platform/secrets/envelope";
import { kekFingerprint } from "@/lib/platform/secrets/kek-backup";

const VAULT_ID = "default";

let dekCache: { key: Buffer; loadedAt: number } | null = null;
const DEK_TTL_MS = 60_000;

async function loadOrCreateDek(): Promise<Buffer> {
  if (dekCache && Date.now() - dekCache.loadedAt < DEK_TTL_MS) {
    return dekCache.key;
  }
  const sql = getSql();
  const kek = getWrappingKey();
  const rows = await sql`
    SELECT encrypted_dek FROM vault_meta WHERE id = ${VAULT_ID} LIMIT 1
  `;
  if (rows[0]?.encrypted_dek) {
    const dekB64 = decryptUtf8(String(rows[0].encrypted_dek), kek);
    const dek = Buffer.from(dekB64, "base64url");
    dekCache = { key: dek, loadedAt: Date.now() };
    const fp = kekFingerprint(kek);
    await sql`
      UPDATE vault_meta
      SET kek_fingerprint = COALESCE(kek_fingerprint, ${fp})
      WHERE id = ${VAULT_ID} AND (kek_fingerprint IS NULL OR kek_fingerprint = ${fp})
    `;
    return dek;
  }
  const dek = generateDek();
  const wrapped = encryptUtf8(dek.toString("base64url"), kek);
  const fp = kekFingerprint(kek);
  await sql`
    INSERT INTO vault_meta (id, encrypted_dek, algorithm, kek_fingerprint)
    VALUES (${VAULT_ID}, ${wrapped}, ${"aes-256-gcm"}, ${fp})
    ON CONFLICT (id) DO NOTHING
  `;
  dekCache = { key: dek, loadedAt: Date.now() };
  return dek;
}

export function invalidateDekCache() {
  dekCache = null;
}

export async function encryptSecret(plaintext: string): Promise<string> {
  const dek = await loadOrCreateDek();
  return encryptUtf8(plaintext, dek);
}

export async function decryptSecret(ciphertext: string): Promise<string> {
  const dek = await loadOrCreateDek();
  return decryptUtf8(ciphertext, dek);
}

export async function upsertProviderSecret(input: {
  providerId: string;
  secretName: string;
  plaintext: string;
}): Promise<{ last4: string }> {
  const ciphertext = await encryptSecret(input.plaintext);
  const last4 = last4OfSecret(input.plaintext);
  const sql = getSql();
  await sql`
    INSERT INTO integration_secrets (provider_id, secret_name, ciphertext, last4)
    VALUES (${input.providerId}, ${input.secretName}, ${ciphertext}, ${last4})
    ON CONFLICT (provider_id, secret_name)
    DO UPDATE SET
      ciphertext = EXCLUDED.ciphertext,
      last4 = EXCLUDED.last4,
      rotated_at = now()
  `;
  return { last4 };
}

export async function deleteProviderSecret(providerId: string, secretName: string) {
  const sql = getSql();
  await sql`
    DELETE FROM integration_secrets
    WHERE provider_id = ${providerId} AND secret_name = ${secretName}
  `;
}

export async function listProviderSecretsPublic(providerId: string) {
  const sql = getSql();
  return sql`
    SELECT secret_name, last4, rotated_at
    FROM integration_secrets
    WHERE provider_id = ${providerId}
    ORDER BY secret_name
  `;
}

export async function decryptProviderSecrets(
  providerId: string
): Promise<Record<string, string>> {
  const sql = getSql();
  const rows = await sql`
    SELECT secret_name, ciphertext
    FROM integration_secrets
    WHERE provider_id = ${providerId}
  `;
  const out: Record<string, string> = {};
  for (const row of rows) {
    out[String(row.secret_name)] = await decryptSecret(String(row.ciphertext));
  }
  return out;
}

export async function getRawCiphertextSample(providerId: string, secretName: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT secret_name, ciphertext, last4
    FROM integration_secrets
    WHERE provider_id = ${providerId} AND secret_name = ${secretName}
    LIMIT 1
  `;
  return rows[0] ?? null;
}
