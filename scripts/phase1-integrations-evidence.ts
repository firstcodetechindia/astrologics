/**
 * Phase 1 evidence: migrate, seed sandbox keys, prove ciphertext vs UI mask,
 * run one test call per integration category.
 *
 * Usage: npx tsx scripts/phase1-integrations-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Pool } from "pg";

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

  const { seedSandboxSecrets } = await import(
    "../src/lib/platform/integrations/seed-sandbox.ts"
  );
  const { runProviderTest } = await import(
    "../src/lib/platform/integrations/test-call.ts"
  );
  const { getProviderBySlot } = await import(
    "../src/lib/platform/integrations/store.ts"
  );
  const { looksLikeCiphertext } = await import(
    "../src/lib/platform/secrets/envelope.ts"
  );
  const { decryptSecret } = await import("../src/lib/platform/secrets/vault.ts");
  const { AUTH0_FLAG_KEY, getFeatureFlag } = await import(
    "../src/lib/platform/feature-flags.ts"
  );
  const { resolveAuthMode } = await import("../src/lib/auth/auth0.ts");
  const { countAdminStaff, createFirstSuperAdmin } = await import(
    "../src/lib/auth/admin-session.ts"
  );

  const seeded = await seedSandboxSecrets();

  let adminBootstrap: { created: boolean; email: string } | null = null;
  if ((await countAdminStaff()) === 0) {
    const email = "phase1-admin@cosmicgyan.local";
    const password = process.env.PHASE1_EVIDENCE_ADMIN_PASSWORD || "Phase1Admin!vault";
    await createFirstSuperAdmin({
      email,
      password,
      displayName: "Phase 1 Super Admin",
      mustChangePassword: true,
    });
    adminBootstrap = { created: true, email };
    console.error(
      `Created Super Admin ${email}. Password is PHASE1_EVIDENCE_ADMIN_PASSWORD or the local default used for this evidence run.`
    );
  }

  const proofTargets: {
    category: string;
    slotKey: string;
    secretName: string;
  }[] = [
    { category: "llm", slotKey: "openai", secretName: "api_key" },
    { category: "payment", slotKey: "razorpay", secretName: "key_secret" },
    { category: "email", slotKey: "smtp", secretName: "password" },
  ];

  const url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new Error("No database URL");
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

  const proofs = [];
  try {
    for (const t of proofTargets) {
      const provider = await getProviderBySlot(t.category as never, t.slotKey);
      if (!provider) continue;
      const q = await pool.query(
        `SELECT s.secret_name, s.ciphertext, s.last4, p.slot_key, p.category
         FROM integration_secrets s
         JOIN integration_providers p ON p.id = s.provider_id
         WHERE p.id = $1 AND s.secret_name = $2`,
        [provider.id, t.secretName]
      );
      const row = q.rows[0];
      if (!row) continue;
      const decrypted = await decryptSecret(row.ciphertext);
      proofs.push({
        category: row.category,
        slotKey: row.slot_key,
        secretName: row.secret_name,
        rawDbCiphertext: row.ciphertext,
        ciphertextLooksEncrypted: looksLikeCiphertext(row.ciphertext),
        plaintextInCiphertextColumn: row.ciphertext.includes("sandbox_"),
        uiMasked: `•••• ${row.last4}`,
        storedLast4: row.last4,
        decryptedLast4: decrypted.slice(-4),
        roundTripLast4Matches: decrypted.slice(-4) === row.last4,
        decryptedLength: decrypted.length,
      });
    }
  } finally {
    await pool.end();
  }

  const tests = [];
  for (const item of seeded.seeded) {
    const provider = await getProviderBySlot(item.category as never, item.slotKey);
    if (!provider) continue;
    tests.push(await runProviderTest(String(provider.id)));
  }

  const report = {
    ok: proofs.every((p) => p.ciphertextLooksEncrypted && p.roundTripLast4Matches && !p.plaintextInCiphertextColumn) &&
      tests.every((t) => t.ok),
    auth0: {
      flag: await getFeatureFlag(AUTH0_FLAG_KEY),
      activeLoginPath: await resolveAuthMode(),
    },
    adminBootstrap,
    seeded: seeded.seeded,
    skippedLive: seeded.skippedLive,
    proofs,
    tests,
  };

  const outDir = path.join(process.cwd(), "scripts/fixtures/phase1-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "report.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nWrote ${outFile}`);
  if (!report.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
