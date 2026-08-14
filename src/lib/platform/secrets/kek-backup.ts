import { createHash, randomBytes, scryptSync } from "node:crypto";
import { encryptUtf8, decryptUtf8, getWrappingKey } from "./envelope";
import { getSql } from "@/lib/db";

const VAULT_ID = "default";

export type KekBackupFile = {
  version: 1;
  createdAt: string;
  fingerprint: string;
  salt: string;
  wrappedKek: string;
  algorithm: "scrypt-aes-256-gcm";
};

export function kekFingerprint(kek: Buffer): string {
  return createHash("sha256").update(kek).digest("hex");
}

function passphraseKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, 32, { N: 16384, r: 8, p: 1 });
}

export function createKekBackup(passphrase: string): KekBackupFile {
  if (passphrase.trim().length < 16) {
    throw new Error("Backup passphrase must be at least 16 characters.");
  }
  const kek = getWrappingKey();
  const salt = randomBytes(16);
  const wrapKey = passphraseKey(passphrase, salt);
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    fingerprint: kekFingerprint(kek),
    salt: salt.toString("base64url"),
    wrappedKek: encryptUtf8(kek.toString("base64url"), wrapKey),
    algorithm: "scrypt-aes-256-gcm",
  };
}

export function restoreKekFromBackup(
  file: KekBackupFile,
  passphrase: string
): { fingerprint: string; kekBase64Url: string } {
  const salt = Buffer.from(file.salt, "base64url");
  const wrapKey = passphraseKey(passphrase, salt);
  const kekB64 = decryptUtf8(file.wrappedKek, wrapKey);
  const kek = Buffer.from(kekB64, "base64url");
  const fingerprint = kekFingerprint(kek);
  if (file.fingerprint && file.fingerprint !== fingerprint) {
    throw new Error("Backup fingerprint mismatch — wrong file or corrupted KEK.");
  }
  return { fingerprint, kekBase64Url: kekB64 };
}

export async function persistKekFingerprintAndBackupStamp(downloaded: boolean) {
  const sql = getSql();
  const fingerprint = kekFingerprint(getWrappingKey());
  if (downloaded) {
    await sql`
      UPDATE vault_meta
      SET kek_fingerprint = ${fingerprint}, backup_downloaded_at = now()
      WHERE id = ${VAULT_ID}
    `;
  } else {
    await sql`
      UPDATE vault_meta
      SET kek_fingerprint = ${fingerprint}
      WHERE id = ${VAULT_ID}
    `;
  }
  return fingerprint;
}

export async function getVaultRecoveryStatus() {
  const sql = getSql();
  const rows = await sql`
    SELECT kek_fingerprint, backup_downloaded_at, algorithm, created_at
    FROM vault_meta
    WHERE id = ${VAULT_ID}
    LIMIT 1
  `;
  const row = rows[0];
  const live = kekFingerprint(getWrappingKey());
  return {
    fingerprint: live,
    storedFingerprint: row?.kek_fingerprint ? String(row.kek_fingerprint) : null,
    fingerprintMatches: row?.kek_fingerprint ? String(row.kek_fingerprint) === live : false,
    backupDownloadedAt: row?.backup_downloaded_at
      ? String(row.backup_downloaded_at)
      : null,
    backupRecorded: Boolean(row?.backup_downloaded_at),
    source: process.env.SECRETS_WRAP_KEY
      ? "SECRETS_WRAP_KEY env"
      : "local .vault/wrap.key",
  };
}
