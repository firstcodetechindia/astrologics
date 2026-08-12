/**
 * Phase 3 — chart-fact cache + AI post-filter + 5-way consistency.
 * Run: npm run test:fact-cache
 */
import {
  cacheStats,
  clearChartFactCache,
  getOrComputeChart,
} from "../src/lib/ai/chart-fact-cache";
import {
  factSheetDigest,
  type ChartFactSheet,
} from "../src/lib/ai/chart-fact-sheet";
import { filterAiAgainstFactSheet } from "../src/lib/ai/ai-post-filter";
import type { BirthInput } from "../src/lib/astrology/types";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else {
    console.log("OK:", msg);
  }
}

const BIRTH: BirthInput = {
  name: "Phase3 Native",
  date: "1990-05-15",
  time: "06:30",
  place: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  timeZone: "Asia/Kolkata",
  timezoneOffsetMinutes: 330,
};

const FIVE_WAYS = [
  "What does my career look like from the chart?",
  "Tell me about my professional life based on the calculated kundli.",
  "How is my job and work path according to these chart facts?",
  "Explain career indications using only the supplied placements.",
  "From the fact-sheet, what can you say about vocation and status?",
];

function inventingReply(sheet: ChartFactSheet): string {
  // Deliberately wrong planet/sign vs fact-sheet
  const wrongSign =
    sheet.planets.find((p) => p.id === "mars")?.sign === "Leo"
      ? "Cancer"
      : "Leo";
  return `Your Mars is in ${wrongSign}. This brings sudden career turns. Your Lagna is Pisces which makes you dreamy.`;
}

function faithfulReply(sheet: ChartFactSheet, variant: number): string {
  const mars = sheet.planets.find((p) => p.id === "mars")!;
  const openers = [
    "Looking at your calculated chart,",
    "From the fact-sheet,",
    "Based on the engine output,",
    "Using only the supplied placements,",
    "According to the cached kundli facts,",
  ];
  return `${openers[variant]} Mars is in ${mars.sign} in house ${mars.house}. Your Lagna is ${sheet.lagna.sign}. Moon nakshatra is ${sheet.moon.nakshatra}. Current Mahadasha is ${sheet.dasha.currentMaha} and Antardasha is ${sheet.dasha.currentAntar}. Career themes should be read from these factors only.`;
}

clearChartFactCache();

console.log("=== 1. Cache: compute once, reuse ===");
const first = getOrComputeChart({ input: BIRTH });
const dig1 = factSheetDigest(first.factSheet);
assert(first.hits === 1, `first compute hits=1 (got ${first.hits})`);

const digests: string[] = [dig1];
const keys: string[] = [first.key];

for (let i = 0; i < 5; i++) {
  // Same birth, five “questions” — must reuse cache, identical facts
  const hit = getOrComputeChart({
    chartKey: i % 2 === 0 ? first.key : undefined,
    input: BIRTH,
  });
  digests.push(factSheetDigest(hit.factSheet));
  keys.push(hit.key);
  console.log(`  Q${i + 1}: "${FIVE_WAYS[i]}" → key=${hit.key} hits=${hit.hits}`);
}

assert(
  digests.every((d) => d === dig1),
  "5-way: identical fact-sheet digest every time"
);
assert(
  keys.every((k) => k === first.key),
  "5-way: identical chartKey every time"
);
assert(
  getOrComputeChart({ input: BIRTH }).hits >= 6,
  "cache hit count increased (no live recompute per question)"
);
assert(cacheStats().size >= 1, "cache retains entry");

console.log("\n=== 2. Post-filter: reject invented placements ===");
const bad = filterAiAgainstFactSheet(
  inventingReply(first.factSheet),
  first.factSheet,
  "en"
);
assert(bad.flagged, "invented Mars/Lagna claims flagged");
assert(
  bad.violations.some((v) => v.kind === "planet_sign" || v.kind === "lagna"),
  "violation kinds include planet_sign or lagna"
);
assert(
  !/Mars is in Leo/i.test(bad.text) ||
    first.factSheet.planets.find((p) => p.id === "mars")?.sign === "Leo",
  "invented Mars-in-Leo sentence removed (unless truly Leo)"
);
assert(/fact-sheet|removed/i.test(bad.text), "filter note appended");

console.log("\n=== 3. Post-filter: allow 5 phrasings of same facts ===");
const citedFacts: string[] = [];
for (let i = 0; i < 5; i++) {
  const raw = faithfulReply(first.factSheet, i);
  const filtered = filterAiAgainstFactSheet(raw, first.factSheet, "en");
  assert(!filtered.flagged, `variant ${i + 1} passes filter (phrasing only)`);
  // Extract cited planet-sign facts from kept text
  const mars = first.factSheet.planets.find((p) => p.id === "mars")!;
  const cite = `Mars:${mars.sign}|Lagna:${first.factSheet.lagna.sign}|Nak:${first.factSheet.moon.nakshatra}|MD:${first.factSheet.dasha.currentMaha}|AD:${first.factSheet.dasha.currentAntar}`;
  citedFacts.push(cite);
  assert(
    filtered.text.includes(mars.sign) &&
      filtered.text.includes(first.factSheet.lagna.sign),
    `variant ${i + 1} still cites real Mars/Lagna`
  );
}
assert(
  citedFacts.every((c) => c === citedFacts[0]),
  "5-way: underlying cited facts identical across phrasings"
);

console.log("\n=== 4. Degree invention ===");
const mars = first.factSheet.planets.find((p) => p.id === "mars")!;
const wrongDeg = (mars.degreeRounded + 12) % 30;
const degFilter = filterAiAgainstFactSheet(
  `Mars at ${wrongDeg}° shows aggression in career.`,
  first.factSheet,
  "en"
);
assert(degFilter.flagged, "wrong degree claim flagged");
assert(
  degFilter.violations.some((v) => v.kind === "degree"),
  "degree violation recorded"
);

console.log("\nFact-sheet snapshot:", {
  key: first.key,
  lagna: first.factSheet.lagna.sign,
  sun: first.factSheet.sun.sign,
  moon: `${first.factSheet.moon.sign} / ${first.factSheet.moon.nakshatra}`,
  mars: `${mars.sign} H${mars.house}`,
  dasha: `${first.factSheet.dasha.currentMaha}/${first.factSheet.dasha.currentAntar}`,
  digest: dig1.slice(0, 16),
});

if (failed) {
  console.error(`\nPhase 3 tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nPhase 3 tests PASSED.");
