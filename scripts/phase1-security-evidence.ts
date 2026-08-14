/**
 * Phase 1 security evidence: admin uniqueness, proof auth, password gate,
 * audit redaction, KEK backup round-trip, Auth0 still off.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Pool } from "pg";
import { createKekBackup, restoreKekFromBackup } from "../src/lib/platform/secrets/kek-backup";
import { assertNoPlaintextSecret, redactRecord } from "../src/lib/platform/secrets/redact";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1]!;
    let val = m[2]!;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

  const migrate = spawnSync("npx", ["tsx", "scripts/db-migrate-platform.ts"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
  if (migrate.status !== 0) process.exit(migrate.status ?? 1);

  const url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new Error("No database URL");
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

  const staff = await pool.query(`SELECT email, role, must_change_password FROM admin_staff`);
  const proofUnauthed = await fetch("http://127.0.0.1:3000/api/admin/integrations/proof?providerId=x&secretName=api_key");
  const proofBody = await proofUnauthed.json();

  const sampleSecret = "sandbox_llm_openai_TESTKEY99";
  const auditWouldHaveBeen = redactRecord({
    secretName: "api_key",
    last4: "EY99",
    value: sampleSecret,
  });
  let leaked = false;
  try {
    assertNoPlaintextSecret({ metadata: { last4: "EY99" } }, sampleSecret);
  } catch {
    leaked = true;
  }
  let redactCaught = false;
  try {
    assertNoPlaintextSecret({ metadata: { value: sampleSecret } }, sampleSecret);
    redactCaught = false;
  } catch {
    redactCaught = true;
  }

  const passphrase = "offline-recovery-pass-OK";
  const backup = createKekBackup(passphrase);
  const restored = restoreKekFromBackup(backup, passphrase);
  const { getVaultRecoveryStatus } = await import("../src/lib/platform/secrets/kek-backup.ts");
  const status = await getVaultRecoveryStatus();

  const { resolveAuthMode } = await import("../src/lib/auth/auth0.ts");
  const authMode = await resolveAuthMode();

  const auditRows = await pool.query(
    `SELECT summary, metadata FROM integration_audit_log WHERE action = 'secret.rotate' ORDER BY created_at DESC LIMIT 5`
  );
  const auditContainsPlaintext = auditRows.rows.some((r) =>
    JSON.stringify(r).includes(sampleSecret)
  );

  await pool.end();

  const report = {
    ok:
      staff.rows.length === 1 &&
      proofUnauthed.status === 401 &&
      proofBody.error === "Unauthorized" &&
      restored.fingerprint === backup.fingerprint &&
      restored.fingerprint === status.fingerprint &&
      authMode === "otp" &&
      !leaked &&
      redactCaught &&
      !auditContainsPlaintext &&
      auditWouldHaveBeen.value !== sampleSecret,
    adminAccounts: staff.rows,
    proofUnauthenticated: { status: proofUnauthed.status, error: proofBody.error },
    kekBackup: {
      fingerprintMatch: restored.fingerprint === backup.fingerprint,
      matchesLive: restored.fingerprint === status.fingerprint,
      source: status.source,
      wrappedLooksEncrypted: backup.wrappedKek.startsWith("v1."),
    },
    auth0Mode: authMode,
    logging: {
      redactReplacesValue: auditWouldHaveBeen.value !== sampleSecret,
      assertAllowsLast4Only: !leaked,
      assertRejectsPlaintextInPayload: redactCaught,
      rotateAuditHasNoPlaintext: !auditContainsPlaintext,
    },
  };

  const outDir = path.join(process.cwd(), "scripts/fixtures/phase1-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "security-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
