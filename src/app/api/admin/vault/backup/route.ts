import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import {
  createKekBackup,
  persistKekFingerprintAndBackupStamp,
  getVaultRecoveryStatus,
  restoreKekFromBackup,
  type KekBackupFile,
} from "@/lib/platform/secrets/kek-backup";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "vault:rotate");
  if ("response" in auth) return auth.response;
  const status = await getVaultRecoveryStatus();
  return NextResponse.json({ ok: true, status });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "vault:rotate");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    passphrase?: string;
    backup?: KekBackupFile;
  };

  if (body.action === "verify-backup") {
    if (!body.backup || !body.passphrase) {
      return NextResponse.json({ ok: false, error: "backup and passphrase required" }, { status: 400 });
    }
    try {
      const restored = restoreKekFromBackup(body.backup, body.passphrase);
      const status = await getVaultRecoveryStatus();
      return NextResponse.json({
        ok: true,
        matchesLiveKey: restored.fingerprint === status.fingerprint,
        fingerprint: restored.fingerprint,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Verify failed";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
  }

  const passphrase = String(body.passphrase || "");
  try {
    const backup = createKekBackup(passphrase);
    await persistKekFingerprintAndBackupStamp(true);
    await writeAuditLog({
      actor: auth.staff,
      action: "vault.kek_backup",
      entityType: "vault_meta",
      entityId: "default",
      summary: "Passphrase-wrapped KEK backup downloaded",
      metadata: { fingerprintPrefix: backup.fingerprint.slice(0, 12) },
    });
    return NextResponse.json({ ok: true, backup });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Backup failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
