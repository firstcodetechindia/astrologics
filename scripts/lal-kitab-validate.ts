/**
 * Lal Kitab unit tests — Pakka table + Rin triggers.
 * Run: npx tsx scripts/lal-kitab-validate.ts
 */
import { createLalKitabChart, PAKKA_GHAR } from "../src/lib/astrology/lalkitab";
import { computeKundli } from "../src/lib/astrology/compute";
import type { PlanetPosition } from "../src/lib/astrology/types";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  } else console.log("OK:", msg);
}

function stubPlanet(
  id: string,
  house: number,
  extra?: Partial<PlanetPosition>
): PlanetPosition {
  return {
    id,
    name: { en: id, hi: id },
    longitude: (house - 1) * 30 + 10,
    signIndex: house - 1,
    sign: { en: "Aries", hi: "मेष" },
    degreeInSign: 10,
    house,
    nakshatraIndex: 0,
    nakshatra: { en: "Ashwini", hi: "अश्विनी" },
    pada: 1,
    ...extra,
  };
}

console.log("=== Pakka Ghar table ===");
assert(PAKKA_GHAR.sun === 1, "Sun pakka 1");
assert(PAKKA_GHAR.moon === 4, "Moon pakka 4");
assert(PAKKA_GHAR.mars === 3, "Mars pakka 3");
assert(PAKKA_GHAR.mercury === 7, "Mercury pakka 7");
assert(PAKKA_GHAR.jupiter === 2, "Jupiter pakka 2");
assert(PAKKA_GHAR.venus === 6, "Venus pakka 6");
assert(PAKKA_GHAR.saturn === 8, "Saturn pakka 8");
assert(PAKKA_GHAR.rahu === 12, "Rahu pakka 12");
assert(PAKKA_GHAR.ketu === 6, "Ketu pakka 6");

console.log("\n=== Pitri Rin ===");
{
  const planets = [
    stubPlanet("sun", 1),
    stubPlanet("moon", 4),
    stubPlanet("mars", 3),
    stubPlanet("mercury", 7),
    stubPlanet("jupiter", 2),
    stubPlanet("venus", 6),
    stubPlanet("saturn", 5),
    stubPlanet("rahu", 11),
    stubPlanet("ketu", 5),
  ];
  const lk = createLalKitabChart(planets);
  assert(lk.rin.find((r) => r.id === "pitri")?.present === true, "Pitri when Sun1 + Sat5");
  assert(lk.planets.find((p) => p.id === "sun")?.inPakkaGhar === true, "Sun in pakka");
}

console.log("\n=== Nari / Dev / Maatru ===");
{
  const planets = [
    stubPlanet("sun", 2),
    stubPlanet("moon", 8),
    stubPlanet("mars", 1),
    stubPlanet("mercury", 1),
    stubPlanet("jupiter", 12, { isCombust: false }),
    stubPlanet("venus", 8),
    stubPlanet("saturn", 8),
    stubPlanet("rahu", 2),
    stubPlanet("ketu", 8),
  ];
  const lk = createLalKitabChart(planets);
  assert(lk.rin.find((r) => r.id === "nari")?.present === true, "Nari Venus in 8");
  assert(lk.rin.find((r) => r.id === "dev")?.present === true, "Dev Jupiter in 12");
  assert(
    lk.rin.find((r) => r.id === "maatru")?.present === true,
    "Maatru Moon 8 + Saturn same house"
  );
  assert(
    lk.andha.some((a) => a.planetId === "saturn" && a.house === 8),
    "Andha Saturn in 8"
  );
  assert(lk.remedies.every((r) => r.tier === 1 && r.basedOn), "remedies Tier1 + basedOn");
  assert(Boolean(lk.methodology.en), "methodology note present");
}

console.log("\n=== Dev via combust ===");
{
  const planets = [
    stubPlanet("sun", 2),
    stubPlanet("moon", 4),
    stubPlanet("mars", 3),
    stubPlanet("mercury", 7),
    stubPlanet("jupiter", 5, { isCombust: true }),
    stubPlanet("venus", 6),
    stubPlanet("saturn", 10),
    stubPlanet("rahu", 11),
    stubPlanet("ketu", 5),
  ];
  const lk = createLalKitabChart(planets);
  assert(lk.rin.find((r) => r.id === "dev")?.present === true, "Dev when Jupiter combust");
}

console.log("\n=== Live kundli integration ===");
{
  const k = computeKundli({
    name: "LK",
    date: "1990-05-15",
    time: "06:30",
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
  });
  const lk = k.lalkitab as ReturnType<typeof createLalKitabChart>;
  assert(Boolean(lk?.planets?.length), "kundli.lalkitab populated");
  assert(lk.houseSystem === "whole_sign_d1", "houseSystem whole_sign_d1");
  assert(
    lk.planets.every((p) => p.basedOn && p.houseTheme),
    "each planet has basedOn + houseTheme"
  );
}

if (failed) {
  console.error(`\nLal Kitab tests FAILED (${failed})`);
  process.exit(1);
}
console.log("\nLal Kitab tests PASSED.");
