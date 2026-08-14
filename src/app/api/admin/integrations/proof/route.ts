import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getRawCiphertextSample } from "@/lib/platform/secrets/vault";
import { looksLikeCiphertext } from "@/lib/platform/secrets/envelope";
import { decryptSecret } from "@/lib/platform/secrets/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Evidence helper: returns the raw ciphertext stored in Postgres vs the
 * masked UI fields. Never returns full plaintext — only last 4 after decrypt
 * to prove round-trip without exposing the key.
 */
export async function GET(req: Request) {
  const auth = await requirePermission(req, "vault:read");
  if ("response" in auth) return auth.response;
  const url = new URL(req.url);
  const providerId = url.searchParams.get("providerId");
  const secretName = url.searchParams.get("secretName");
  if (!providerId || !secretName) {
    return NextResponse.json(
      { ok: false, error: "providerId and secretName are required" },
      { status: 400 }
    );
  }
  const row = await getRawCiphertextSample(providerId, secretName);
  if (!row) {
    return NextResponse.json({ ok: false, error: "Secret not found" }, { status: 404 });
  }
  const ciphertext = String(row.ciphertext);
  const last4Stored = String(row.last4);
  let last4FromDecrypt = "";
  let decryptOk = false;
  try {
    const plain = await decryptSecret(ciphertext);
    last4FromDecrypt = plain.slice(-4);
    decryptOk = last4FromDecrypt === last4Stored;
  } catch {
    decryptOk = false;
  }
  return NextResponse.json({
    ok: true,
    secretName: String(row.secret_name),
    storedLast4: last4Stored,
    uiMasked: `•••• ${last4Stored}`,
    rawDbCiphertext: ciphertext,
    ciphertextLooksEncrypted: looksLikeCiphertext(ciphertext),
    plaintextAbsentFromDb: !ciphertext.includes("sandbox_") && looksLikeCiphertext(ciphertext),
    decryptRoundTripLast4Matches: decryptOk,
    decryptedLast4: last4FromDecrypt,
  });
}
