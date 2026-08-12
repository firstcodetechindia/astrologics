/**
 * Varshphal validation — Muntha, solar return residual, citations.
 * Run: npx tsx scripts/varshphal-validate.ts
 */
import {
  computeMuntha,
  computeVarshphal,
  findSolarReturn,
} from "../src/lib/astrology/varshphal";
import { computeKundli } from "../src/lib/astrology/compute";
import { parseBirthDateTime } from "../src/lib/astrology/timezone";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

console.log("=== Muntha advance ===");
{
  // Natal Aries (0), 0 years → Aries; 1 year → Taurus; 12 → Aries
  assert(computeMuntha(0, 0, 0).signIndex === 0, "year 0 Muntha = natal lagna");
  assert(computeMuntha(1, 0, 0).signIndex === 1, "year 1 Muntha +1");
  assert(computeMuntha(12, 0, 0).signIndex === 0, "year 12 wraps");
  assert(computeMuntha(5, 0, 3).houseFromVarshaLagna === 3, "Muntha house from Varsha Lagna");
  assert(Boolean(computeMuntha(3, 4, 1).basedOn.en), "Muntha basedOn present");
}

console.log("\n=== Solar return residual ===");
{
  const input = {
    name: "VP",
    date: "1990-05-15",
    time: "06:30",
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
    timezoneOffsetMinutes: 330,
  };
  const k = computeKundli(input);
  const birth = parseBirthDateTime(input);
  const sunLon = k.planets.find((p) => p.id === "sun")!.longitude;
  const { instant, residualDeg } = findSolarReturn(
    sunLon,
    birth,
    2024,
    "lahiri"
  );
  assert(Math.abs(residualDeg) < 0.01, `solar return |Δ|<0.01° (got ${residualDeg})`);
  assert(instant.getUTCFullYear() === 2024, "return in target year");
}

console.log("\n=== Full Varshphal fact sheet ===");
{
  const k = computeKundli({
    name: "VP",
    date: "1990-05-15",
    time: "06:30",
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
  });
  const vp = k.varshphal as ReturnType<typeof computeVarshphal>;
  assert(Boolean(vp?.varshaLagna?.basedOn?.en), "varshaLagna basedOn");
  assert(Boolean(vp?.muntha?.basedOn?.en), "muntha basedOn");
  assert(Boolean(vp?.varsheshwara?.basedOn?.en), "varsheshwara basedOn");
  assert(vp.varsheshwara.rule === "simplified_muntha_vs_asc_lord", "simplified rule id");
  assert(vp.sahams.length >= 2, "at least 2 sahams");
  assert(
    vp.sahams.every((s) => s.formula && s.basedOn),
    "sahams have formula + basedOn"
  );
  assert(Boolean(vp.methodology?.en), "methodology");
  assert(Boolean(vp.disclaimer?.en), "disclaimer");
  assert(typeof vp.solarReturnResidualDeg === "number", "residual logged");
  console.log("  snapshot:", {
    year: vp.targetYear,
    lagna: vp.varshaLagna.sign.en,
    muntha: vp.muntha.sign.en,
    yearLord: vp.varsheshwara.name.en,
    residual: vp.solarReturnResidualDeg,
  });
}

if (failed) {
  console.error(`\nVarshphal tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nVarshphal tests PASSED.");
