/**
 * Bulk-import GeoNames India places into Postgres.
 * Run: npx tsx scripts/db-import-places.ts
 *
 * Source (first found):
 *   data/geonames/india_places.json
 *   data/geonames/india_places.json.gz
 *   data/geonames/india_places.jsonl
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { Pool } from "pg";

type Place = {
  id: string;
  name: string;
  ascii_name?: string;
  alternate_names?: string[];
  state?: string;
  country?: string;
  country_code?: string;
  lat: number;
  lng: number;
  timezone?: string;
  population?: number;
  feature_code?: string;
};

const BATCH = Number(process.env.PLACES_IMPORT_BATCH || 1000);

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

function readRecords(): { records: Place[]; source: string } {
  const root = process.cwd();
  const json = path.join(root, "data/geonames/india_places.json");
  const gz = path.join(root, "data/geonames/india_places.json.gz");
  const jsonl = path.join(root, "data/geonames/india_places.jsonl");

  if (fs.existsSync(json)) {
    return {
      records: JSON.parse(fs.readFileSync(json, "utf8")) as Place[],
      source: json,
    };
  }
  if (fs.existsSync(gz)) {
    const raw = zlib.gunzipSync(fs.readFileSync(gz)).toString("utf8");
    return { records: JSON.parse(raw) as Place[], source: gz };
  }
  if (fs.existsSync(jsonl)) {
    const lines = fs.readFileSync(jsonl, "utf8").split("\n").filter(Boolean);
    return {
      records: lines.map((l) => JSON.parse(l) as Place),
      source: jsonl,
    };
  }
  throw new Error("No india_places.json / .json.gz / .jsonl found");
}

async function main() {
  loadEnvLocal();
  const url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new Error("No database URL in env");

  const { records, source } = readRecords();
  console.log(
    JSON.stringify({
      event: "import_start",
      source: path.relative(process.cwd(), source),
      records: records.length,
      batch: BATCH,
    })
  );

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 4,
  });
  const t0 = performance.now();

  try {
    // Ensure schema exists
    const schema = fs.readFileSync(
      path.join(process.cwd(), "scripts/sql/001_places.sql"),
      "utf8"
    );
    await pool.query(schema);

    // Truncate for idempotent re-import
    await pool.query("TRUNCATE places");

    let inserted = 0;
    for (let i = 0; i < records.length; i += BATCH) {
      const chunk = records.slice(i, i + BATCH);
      const values: unknown[] = [];
      const placeholders: string[] = [];
      let p = 1;
      for (const r of chunk) {
        const alts = Array.isArray(r.alternate_names) ? r.alternate_names : [];
        const altsText = alts.join(" ");
        placeholders.push(
          `($${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++})`
        );
        values.push(
          String(r.id),
          r.name || "",
          r.ascii_name || r.name || "",
          alts,
          altsText,
          r.state || "",
          r.country || "India",
          r.country_code || "IN",
          Number(r.lat),
          Number(r.lng),
          r.timezone || "Asia/Kolkata",
          Math.max(0, Math.floor(Number(r.population) || 0)),
          r.feature_code || "PPL"
        );
      }

      await pool.query(
        `INSERT INTO places (
          id, name, ascii_name, alternate_names, alternate_names_text,
          state, country, country_code, lat, lng, timezone, population, feature_code
        ) VALUES ${placeholders.join(",")}`,
        values
      );
      inserted += chunk.length;
      if (inserted % 20000 === 0 || inserted === records.length) {
        console.log(
          JSON.stringify({
            event: "import_progress",
            inserted,
            of: records.length,
            elapsedMs: Math.round(performance.now() - t0),
          })
        );
      }
    }

    const count = await pool.query("SELECT COUNT(*)::int AS n FROM places");
    const delhi = await pool.query(
      `SELECT id, name, state, population, feature_code
       FROM places
       WHERE lower(ascii_name) IN ('delhi','new delhi') OR lower(name) IN ('delhi','new delhi')
       ORDER BY population DESC
       LIMIT 5`
    );
    const mumbai = await pool.query(
      `SELECT id, name, state, population,
              ('Bombay' = ANY(alternate_names) OR alternate_names_text ILIKE '%Bombay%') AS has_bombay
       FROM places
       WHERE lower(ascii_name) = 'mumbai' OR lower(name) = 'mumbai'
       LIMIT 3`
    );

    console.log(
      JSON.stringify(
        {
          event: "import_done",
          rowCount: count.rows[0]?.n,
          expected: records.length,
          match: count.rows[0]?.n === records.length,
          importMs: Math.round(performance.now() - t0),
          importSec: +((performance.now() - t0) / 1000).toFixed(1),
          spotCheck: {
            delhi: delhi.rows,
            mumbai: mumbai.rows,
          },
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
