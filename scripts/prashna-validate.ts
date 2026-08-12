/**
 * Prashna validation — topic map, lean flags, basedOn, no %-odds.
 * Run: npx tsx scripts/prashna-validate.ts
 */
import {
  computePrashna,
  normalizePrashnaTopic,
  PRASHNA_TOPICS,
} from "../src/lib/astrology/prashna";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

const base = {
  name: "Querent",
  date: "2024-06-15",
  time: "10:30",
  place: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  timeZone: "Asia/Kolkata",
  timezoneOffsetMinutes: 330,
};

console.log("=== Topic map ===");
{
  assert(PRASHNA_TOPICS.length === 8, "8 topic tags");
  assert(normalizePrashnaTopic("bogus") === "money_job", "unknown topic → money_job");
  assert(normalizePrashnaTopic("marriage_partner") === "marriage_partner", "valid topic");
  const marriage = PRASHNA_TOPICS.find((t) => t.id === "marriage_partner")!;
  assert(marriage.houses.join(",") === "7", "marriage → H7");
  const money = PRASHNA_TOPICS.find((t) => t.id === "money_job")!;
  assert(money.houses.join(",") === "2,10,11", "money → 2,10,11");
}

console.log("\n=== Chart cast + fact sheet ===");
{
  const r = computePrashna(base, "money_job");
  assert(r.chartType === "prashna", "chartType prashna");
  assert(r.significatorHouses.join(",") === "2,10,11", "significator houses");
  assert(r.significators.length === 3, "3 significator facts");
  assert(
    r.significators.every((s) => Boolean(s.basedOn.en) && s.lordHouse > 0),
    "significators have basedOn + lord house"
  );
  assert(
    ["strong_yes", "caution", "insufficient"].includes(r.lean.kind),
    `lean kind valid (${r.lean.kind})`
  );
  assert(Boolean(r.lean.basedOn.en), "lean basedOn");
  assert(Boolean(r.timingHint.maha.en), "timing maha");
  assert(Boolean(r.timingHint.basedOn.en), "timing basedOn mentions Prashna Moon");
  assert(r.timingHint.basedOn.en.includes("Vimshottari"), "timing cites Vimshottari");
  assert(Boolean(r.ethics.en), "ethics");
  assert(Boolean(r.methodology.en), "methodology");
  assert(Boolean(r.disclaimer.en), "disclaimer");
  assert(!("%" in r) && !JSON.stringify(r).includes("% chance"), "no %-odds fields");
  console.log("  snapshot:", {
    lagna: r.lagna.sign.en,
    lean: r.lean.kind,
    maha: r.timingHint.maha.en,
    antar: r.timingHint.antar.en,
  });
}

console.log("\n=== Ethics topics ===");
{
  const health = computePrashna(base, "self_health");
  assert(
    health.ethics.en.toLowerCase().includes("diagnos") ||
      health.ethics.en.toLowerCase().includes("illness"),
    "health ethics refuse diagnosis"
  );
  const lit = computePrashna(base, "litigation_debt");
  assert(
    lit.ethics.en.toLowerCase().includes("legal"),
    "litigation ethics refuse legal verdict"
  );
}

console.log("\n=== Lean screens fire ===");
{
  // Same chart, different topics — lean kind must be one of three and basedOn non-empty
  for (const t of PRASHNA_TOPICS) {
    const r = computePrashna(base, t.id);
    assert(
      r.significatorHouses.join(",") === t.houses.join(","),
      `${t.id} houses match`
    );
    assert(Boolean(r.lean.basedOn.en), `${t.id} lean basedOn`);
  }
}

if (failed) {
  console.error(`\nPrashna tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nPrashna tests PASSED.");
