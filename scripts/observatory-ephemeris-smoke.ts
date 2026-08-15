/**
 * Smoke test: Observatory 3D helper is separate from Kundli and returns finite coords.
 * npx tsx scripts/observatory-ephemeris-smoke.ts
 */
import {
  artisticRadius,
  queryObservatoryScene,
} from "../src/lib/astrology/observatory-ephemeris";
import { queryObservatoryChartPlacement } from "../src/lib/astrology/observatory-kundli";

const instant = new Date("1990-05-15T01:00:00.000Z");
const helio = queryObservatoryScene(instant, "heliocentric", true);
const geo = queryObservatoryScene(instant, "geocentric", true);

function must(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

must(helio.some((b) => b.id === "sun" && b.x === 0 && b.y === 0 && b.z === 0), "Sun at helio origin");
must(geo.some((b) => b.id === "earth" && b.x === 0 && b.y === 0 && b.z === 0), "Earth at geo origin");

const earth = helio.find((b) => b.id === "earth")!;
must(earth.distanceAu > 0.9 && earth.distanceAu < 1.1, `Earth AU ${earth.distanceAu}`);

const jup = helio.find((b) => b.id === "jupiter")!;
const nep = helio.find((b) => b.id === "neptune")!;
must(jup.distanceAu > earth.distanceAu, "Jupiter farther than Earth (helio)");
must(nep.distanceAu > jup.distanceAu, "Neptune farther than Jupiter (helio)");
must(artisticRadius(nep.distanceAu) > artisticRadius(earth.distanceAu), "log scale orders outer farther");

const moonGeo = geo.find((b) => b.id === "moon")!;
must(moonGeo.distanceAu < 0.01, `Geo Moon should be ~0.002 AU, got ${moonGeo.distanceAu}`);

for (const b of [...helio, ...geo]) {
  must(Number.isFinite(b.x) && Number.isFinite(b.y) && Number.isFinite(b.z), `${b.id} non-finite`);
}

const mars = queryObservatoryChartPlacement(instant, "mars");
must(mars.available && mars.vedicGraha, "Mars should come from getSiderealPlanets");
must(mars.sign.en.length > 0 && mars.nakshatra.en.length > 0, "Mars sign/nakshatra");
must(typeof mars.isRetrograde === "boolean", "Mars retrograde from Kundli engine");

const earthPlace = queryObservatoryChartPlacement(instant, "earth");
must(!earthPlace.available && !earthPlace.vedicGraha, "Earth is not a graha");

const uranus = queryObservatoryChartPlacement(instant, "uranus");
must(uranus.available && !uranus.vedicGraha, "Uranus placement is Lahiri, not a graha");

console.log("observatory-ephemeris smoke OK", {
  earthAu: earth.distanceAu.toFixed(4),
  jupiterAu: jup.distanceAu.toFixed(3),
  neptuneAu: nep.distanceAu.toFixed(3),
  geoMoonAu: moonGeo.distanceAu.toFixed(6),
  helioCount: helio.length,
  geoCount: geo.length,
});
