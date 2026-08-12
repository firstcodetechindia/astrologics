/**
 * Muhurta electional validation — range cap, scoring buckets, basedOn.
 * Run: npx tsx scripts/muhurta-validate.ts
 */
import {
  computeMuhurtaElectional,
  normalizeActivity,
  MUHURTA_ACTIVITIES,
} from "../src/lib/astrology/muhurta";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

console.log("=== Activity map ===");
{
  assert(MUHURTA_ACTIVITIES.length === 5, "5 activities");
  assert(normalizeActivity("bogus") === "general_shubh", "unknown → general_shubh");
  assert(normalizeActivity("travel") === "travel", "travel ok");
}

console.log("\n=== Range cap + grain ===");
{
  const r = computeMuhurtaElectional({
    startDate: "2024-06-01",
    endDate: "2024-07-20", // >14 days
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
    timezoneOffsetMinutes: 330,
    activity: "general_shubh",
  });
  assert(r.daysScanned === 14, `capped to 14 days (got ${r.daysScanned})`);
  assert(r.endDate === "2024-06-14", `end clamped to ${r.endDate}`);
  assert(r.windows.length === 14 * 8, `8 daytime chogha × 14 (got ${r.windows.length})`);
  assert(r.windows.every((w) => w.grain === "day_choghadiya"), "day_choghadiya grain");
}

console.log("\n=== Scoring buckets + basedOn ===");
{
  const r = computeMuhurtaElectional({
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
    timezoneOffsetMinutes: 330,
    activity: "travel",
  });
  assert(
    r.summary.pass + r.summary.caution + r.summary.avoid === r.windows.length,
    "summary counts match windows"
  );
  assert(
    r.windows.every((w) => ["pass", "caution", "avoid"].includes(w.score)),
    "only pass/caution/avoid"
  );
  assert(
    r.windows.every((w) => Boolean(w.basedOn.en) && w.factors.length >= 0),
    "basedOn present"
  );
  const hasHard = r.windows.some((w) =>
    w.factors.some((f) => f.class === "hard")
  );
  assert(hasHard, "at least one hard factor in 3-day sample (Rahu/Vishti likely)");
  assert(Boolean(r.methodology.en), "methodology");
  assert(Boolean(r.disclaimer.en), "disclaimer");
  assert(!JSON.stringify(r).match(/%\s*(chance|odds|luck|success)/i), "no %-odds fields");
  assert(r.natalFilter === false, "natal filter off by default");
  console.log("  snapshot:", r.summary, { topPass: r.topPass.length });
}

console.log("\n=== Natal filter toggle ===");
{
  const off = computeMuhurtaElectional({
    startDate: "2024-06-10",
    endDate: "2024-06-10",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
    timezoneOffsetMinutes: 330,
    activity: "general_shubh",
    natalFilter: true,
    // missing natal moon → filter not applied
  });
  assert(off.natalFilter === false, "natalFilter true without moon → not applied");

  const on = computeMuhurtaElectional({
    startDate: "2024-06-10",
    endDate: "2024-06-11",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
    timezoneOffsetMinutes: 330,
    activity: "general_shubh",
    natalFilter: true,
    natalMoonSignIndex: 0, // Aries
  });
  assert(on.natalFilter === true, "natal filter on with moon sign");
  const natalHit = on.windows.some((w) =>
    w.factors.some((f) => f.basedOn.en.includes("Natal filter"))
  );
  // May or may not hit in 2 days — just ensure when hit it's hard avoid
  if (natalHit) {
    assert(
      on.windows
        .filter((w) => w.factors.some((f) => f.basedOn.en.includes("Natal filter")))
        .every((w) => w.score === "avoid"),
      "natal filter hits → avoid"
    );
  } else {
    console.log("OK: natal filter armed (no 8th hit in sample — acceptable)");
  }
}

console.log("\n=== Activity profiles run ===");
{
  for (const a of MUHURTA_ACTIVITIES) {
    const r = computeMuhurtaElectional({
      startDate: "2024-08-01",
      endDate: "2024-08-01",
      lat: 28.6139,
      lon: 77.209,
      timeZone: "Asia/Kolkata",
      timezoneOffsetMinutes: 330,
      activity: a.id,
    });
    assert(r.activity === a.id, `${a.id} activity tag`);
    assert(r.windows.length === 8, `${a.id} 8 daytime windows`);
  }
}

if (failed) {
  console.error(`\nMuhurta tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nMuhurta tests PASSED.");
