/**
 * Apply places schema (pg_trgm + places table + indexes).
 * Run: npx tsx scripts/db-migrate-places.ts
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

  const sqlPath = path.join(process.cwd(), "scripts/sql/001_places.sql");
  const body = fs.readFileSync(sqlPath, "utf8");

  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  const t0 = performance.now();
  try {
    await pool.query(body);
    const ext = await pool.query(
      `SELECT extname FROM pg_extension WHERE extname = 'pg_trgm'`
    );
    const tables = await pool.query(
      `SELECT to_regclass('public.places') AS places`
    );
    const indexes = await pool.query(
      `SELECT indexname FROM pg_indexes WHERE tablename = 'places' ORDER BY indexname`
    );
    console.log(
      JSON.stringify(
        {
          ok: true,
          ms: Math.round(performance.now() - t0),
          pg_trgm: ext.rowCount === 1,
          places: Boolean(tables.rows[0]?.places),
          indexes: indexes.rows.map((r) => r.indexname),
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
