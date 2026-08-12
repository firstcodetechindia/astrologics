/**
 * Birth-time rectification validation.
 * Run: npx tsx scripts/rectify-validate.ts
 */
import {
  rectifyBirthTime,
  isLifeEventDomain,
  LIFE_EVENT_DOMAINS,
} from "../src/lib/astrology/rectification";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

const birth = {
  name: "Rectify Test",
  date: "1992-08-15",
  time: "10:30",
  place: "Mumbai",
  lat: 19.076,
  lon: 72.8777,
  timezoneOffsetMinutes: 330,
  timeZone: "Asia/Kolkata",
};

const events = [
  { date: "2015-06-01", domain: "job_started" as const },
  { date: "2018-11-12", domain: "marriage" as const },
  { date: "2021-03-20", domain: "childbirth" as const },
];

console.log("=== Domains ===");
{
  assert(LIFE_EVENT_DOMAINS.length >= 15, "domain catalog present");
  assert(isLifeEventDomain("marriage"), "marriage domain");
  assert(!isLifeEventDomain("not_a_domain"), "rejects unknown domain");
}

console.log("\n=== Min events ===");
{
  let threw = false;
  try {
    rectifyBirthTime(birth, events.slice(0, 2));
  } catch {
    threw = true;
  }
  assert(threw, "rejects <3 events");
}

console.log("\n=== Ranking + meta ===");
{
  const r = rectifyBirthTime(birth, events, {
    windowMinutes: 30,
    stepMinutes: 5,
  });
  assert(Boolean(r.best.time), "best time");
  assert(typeof r.best.score === "number", "score is number");
  assert(r.best.score >= 0 && r.best.score <= 1, "score is match ratio 0–1");
  assert(r.candidates.length >= 1, "candidates");
  assert(r.candidates[0]!.score >= r.candidates[r.candidates.length - 1]!.score, "sorted by score");
  assert(["low", "medium", "high"].includes(r.confidence), "confidence band");
  assert(r.meta.windowMinutes === 30, "window meta");
  assert(r.meta.stepMinutes === 5, "step meta");
  assert(r.meta.eventCount === 3, "eventCount");
  assert(Boolean(r.meta.methodology.en), "methodology");
  assert(Boolean(r.meta.disclaimer.en), "disclaimer");
  assert(r.reasoning.en.includes("event-match") || r.reasoning.en.includes("events"), "reasoning cites events");
  assert(
    r.reasoning.en.includes("not") && r.reasoning.en.toLowerCase().includes("birth time"),
    "reasoning clarifies not true birth time %"
  );
  assert(Array.isArray(r.best.eventDetails), "per-event details on best");
  assert(
    r.best.eventDetails!.every((e) => Boolean(e.basedOn.en)),
    "each event has basedOn"
  );
  assert(typeof r.lagnaCaution === "boolean", "lagnaCaution flag");
  console.log("  snapshot:", {
    best: r.best.time,
    lagna: r.best.ascendantSign.en,
    matched: `${r.best.matched}/${r.meta.eventCount}`,
    confidence: r.confidence,
    lagnaCaution: r.lagnaCaution,
  });
}

console.log("\n=== Confidence thresholds ===");
{
  const many = [
    ...events,
    { date: "2016-01-10", domain: "promotion" as const },
    { date: "2019-05-01", domain: "property_bought" as const },
  ];
  const r = rectifyBirthTime(birth, many, { windowMinutes: 20, stepMinutes: 5 });
  if (r.best.score >= 0.75) {
    assert(r.confidence === "high", "high when score≥0.75 and ≥5 events");
  } else if (r.best.score >= 0.5) {
    assert(
      r.confidence === "medium" || r.confidence === "high",
      "medium/high when score≥0.5"
    );
  } else {
    assert(r.confidence === "low", "low when score<0.5");
  }
  console.log("OK: confidence rule applied →", r.confidence, r.best.score);
}

if (failed) {
  console.error(`\nRectify tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nRectify tests PASSED.");
