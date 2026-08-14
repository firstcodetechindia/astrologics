/**
 * Apply platform integrations schema (vault, admin, providers, audit).
 * Run: npx tsx scripts/db-migrate-platform.ts
 */
import fs from "node:fs";
import path from "node:path";
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
  const url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new Error("No database URL in env");

  const files = [
    "scripts/sql/002_platform_integrations.sql",
    "scripts/sql/003_vault_admin_hardening.sql",
    "scripts/sql/004_billing.sql",
    "scripts/sql/005_billing_credit_notes.sql",
    "scripts/sql/006_comms.sql",
    "scripts/sql/007_ai_chat.sql",
    "scripts/sql/008_astrologer_personas.sql",
    "scripts/sql/009_social_queue.sql",
  ];
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  const t0 = performance.now();
  try {
    for (const rel of files) {
      const sqlPath = path.join(process.cwd(), rel);
      await pool.query(fs.readFileSync(sqlPath, "utf8"));
    }
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'admin_staff',
          'vault_meta',
          'integration_providers',
          'integration_secrets',
          'integration_audit_log',
          'billing_settings',
          'payments',
          'invoices',
          'commission_ledger',
          'payout_batches',
          'credit_notes',
          'message_templates',
          'automation_rules',
          'ai_personas',
          'chat_flows',
          'chat_conversations',
          'consult_sessions',
          'consult_ratings',
          'astrologer_client_notes',
          'social_posts'
        )
      ORDER BY table_name
    `);
    console.log(
      JSON.stringify(
        {
          ok: true,
          ms: Math.round(performance.now() - t0),
          tables: tables.rows.map((r) => r.table_name),
        },
        null,
        2
      )
    );
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
