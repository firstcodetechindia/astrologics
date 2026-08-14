/**
 * Envelope encryption for the Super Admin secrets vault.
 *
 * Vendor API keys are encrypted with a random data-encryption key (DEK).
 * The DEK is encrypted with a wrapping key (KEK).
 *
 * KEK sources (in order):
 *   1. SECRETS_WRAP_KEY env — wrapping key only, never a vendor secret
 *   2. Local file `.vault/wrap.key` (gitignored) for development
 *
 * Ciphertext format: v1.<iv_b64url>.<ciphertext_b64url>.<tag_b64url>
 */
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ALGO = "aes-256-gcm";
const VERSION = "v1";
const LOCAL_WRAP_PATH = path.join(process.cwd(), ".vault", "wrap.key");

export class VaultLockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VaultLockedError";
  }
}

function normalizeKek(raw: string): Buffer {
  const trimmed = raw.trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }
  const asUrl = Buffer.from(trimmed, "base64url");
  if (asUrl.length === 32) return asUrl;
  const asB64 = Buffer.from(trimmed, "base64");
  if (asB64.length === 32) return asB64;
  return createHash("sha256").update(trimmed).digest();
}

export function getWrappingKey(): Buffer {
  const fromEnv = process.env.SECRETS_WRAP_KEY?.trim();
  if (fromEnv) return normalizeKek(fromEnv);

  const isHosted = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  if (isHosted) {
    throw new VaultLockedError(
      "SECRETS_WRAP_KEY is required in production. It is the vault wrapping key only — vendor API keys stay in the Super Admin panel."
    );
  }

  if (fs.existsSync(LOCAL_WRAP_PATH)) {
    return normalizeKek(fs.readFileSync(LOCAL_WRAP_PATH, "utf8"));
  }

  fs.mkdirSync(path.dirname(LOCAL_WRAP_PATH), { recursive: true });
  const generated = randomBytes(32).toString("base64url");
  fs.writeFileSync(LOCAL_WRAP_PATH, generated, { mode: 0o600 });
  return Buffer.from(generated, "base64url");
}

export function encryptUtf8(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString("base64url"),
    encrypted.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

export function decryptUtf8(blob: string, key: Buffer): string {
  const parts = blob.split(".");
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new Error("Unrecognized ciphertext format");
  }
  const iv = Buffer.from(parts[1]!, "base64url");
  const data = Buffer.from(parts[2]!, "base64url");
  const tag = Buffer.from(parts[3]!, "base64url");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function generateDek(): Buffer {
  return randomBytes(32);
}

export function last4OfSecret(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.slice(-4);
}

export function maskSecret(last4: string): string {
  if (!last4) return "••••";
  return `•••• ${last4}`;
}

export function looksLikeCiphertext(value: string): boolean {
  return /^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}
