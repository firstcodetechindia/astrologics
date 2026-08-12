/**
 * Sade Sati tracker validation.
 * Run: npx tsx scripts/sade-sati-validate.ts
 */
import {
  sadePhaseForSigns,
  trackSadeSati,
} from "../src/lib/astrology/sade-sati-tracker";
import { sadeSati } from "../src/lib/astrology/doshas";
import { computeKundli } from "../src/lib/astrology/compute";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

console.log("=== Phase mapping (Moon Aries = 0) ===");
// 12th from Aries = Pisces (11), same = 0, 2nd = Taurus (1)
assert(sadePhaseForSigns(0, 11) === 1, "Saturn Pisces → phase 1 rising");
assert(sadePhaseForSigns(0, 0) === 2, "Saturn Aries → phase 2 peak");
assert(sadePhaseForSigns(0, 1) === 3, "Saturn Taurus → phase 3 setting");
assert(sadePhaseForSigns(0, 2) === null, "Saturn Gemini → not Sade Sati");

console.log("\n=== Tracker structure ===");
{
  const t = trackSadeSati(0, new Date("2024-06-15T12:00:00Z"));
  assert(t.natalMoonSign.index === 0, "moon Aries");
  assert(t.dhaiyaEnabled === false, "dhaiya off");
  assert(Boolean(t.methodology.en), "methodology present");
  assert(Boolean(t.disclaimer.en), "disclaimer present");
  assert(Boolean(t.basedOn.en), "basedOn present");
  if (t.active) {
    assert(t.phase === 1 || t.phase === 2 || t.phase === 3, "phase 1–3 when active");
    assert(Boolean(t.currentWindow?.start), "currentWindow when active");
    assert(t.fullCycle.length >= 1, "fullCycle segments when active/nearby");
  }
  console.log("  snapshot:", {
    active: t.active,
    phase: t.phase,
    saturn: t.saturnSign.en,
    window: t.currentWindow,
    cycleLen: t.fullCycle.length,
  });
}

console.log("\n=== doshas.sadeSati delegates to tracker ===");
{
  const s = sadeSati(0, new Date("2020-01-15T12:00:00Z"), {
    includeWindow: true,
  });
  assert("tracker" in s, "includes tracker");
  assert(Array.isArray(s.fullCycle), "fullCycle array");
  assert(s.phase === s.tracker.phaseKey, "phaseKey sync");
}

console.log("\n=== Kundli integration ===");
{
  const k = computeKundli({
    name: "SS",
    date: "1990-05-15",
    time: "06:30",
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
  });
  const ss = k.doshas.sadeSati as {
    fullCycle?: unknown[];
    basedOn?: { en: string };
    tracker?: { dhaiyaEnabled: boolean };
  };
  assert(Boolean(ss?.basedOn?.en), "kundli sadeSati has basedOn");
  assert(Array.isArray(ss?.fullCycle), "kundli sadeSati has fullCycle");
  assert(ss?.tracker?.dhaiyaEnabled === false, "dhaiya still off on kundli");
}

if (failed) {
  console.error(`\nSade Sati tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nSade Sati tests PASSED.");
