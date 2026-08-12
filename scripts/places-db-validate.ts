/**
 * Validate Postgres + pg_trgm places search.
 * Run: npm run test:places:db
 */
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2]!;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]!]) process.env[m[1]!] = val;
  }
}

async function main() {
  loadEnvLocal();
  const { searchPlacesDb, PLACES_SIMILARITY_THRESHOLD, PLACES_WORD_SIMILARITY_THRESHOLD } =
    await import("../src/lib/places/places-search-db");

  console.log("Thresholds:", {
    similarity: PLACES_SIMILARITY_THRESHOLD,
    wordSimilarity: PLACES_WORD_SIMILARITY_THRESHOLD,
  });

  // warm
  await searchPlacesDb("delhi", 5);

  const fold = (s: string) =>
    s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

  for (const q of ["delhi", "bombay", "firozbad"] as const) {
    const { hits, meta } = await searchPlacesDb(q, 10);
    console.log(`\n=== ${q} (${Math.round(meta.queryMs)} ms) ===`);
    hits.slice(0, 5).forEach((h, i) => {
      console.log(
        `${i + 1}. ${h.name} | ${h.state} | ${h.feature_code} | pop=${h.population}`
      );
    });
  }

  const delhi = await searchPlacesDb("delhi", 10);
  const delhiOk = delhi.hits
    .slice(0, 3)
    .some((h) => {
      const n = fold(h.name);
      return n === "delhi" || n === "new delhi";
    });
  const bombay = await searchPlacesDb("bombay", 10);
  const mumbaiOk = bombay.hits.some((h) => fold(h.name) === "mumbai");
  const typo = await searchPlacesDb("firozbad", 10);
  const firozOk = typo.hits.some((h) => fold(h.name).includes("firozabad"));

  console.log("\nCHECK delhi metro:", delhiOk ? "PASS" : "FAIL", delhi.hits[0]?.name);
  console.log("CHECK bombay→Mumbai:", mumbaiOk ? "PASS" : "FAIL", bombay.hits[0]?.name);
  console.log(
    "CHECK firozbad→Firozabad:",
    firozOk ? "PASS" : "FAIL",
    typo.hits[0]?.name
  );

  if (!delhiOk || !mumbaiOk || !firozOk) process.exit(1);
  console.log("\nAll DB place-search checks PASSED.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
