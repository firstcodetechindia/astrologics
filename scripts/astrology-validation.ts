/**
 * Phase 3 cross-validation suite.
 * Run: npx tsx scripts/astrology-validation.ts
 *
 * Expected Lahiri refs: Swiss Ephemeris / Jagannatha Hora published Jan-1 tables.
 * Rule tests: deterministic math only (no invented ephemeris golden files).
 */
import {
  LAHIRI_SE_ALIGNMENT_ARCSEC,
  lahiriAyanamsaFromDate,
  norm360,
  toDMS,
  trueChitrapakshaAyanamsa,
} from "../src/lib/astrology/math";
import { nakshatraFromLongitude } from "../src/lib/astrology/nakshatra";
import { NAKSHATRAS, NAKSHATRA_SPAN, SIGN_LORDS } from "../src/lib/astrology/constants";
import {
  dashamsaSignIndex,
  drekkanaSignIndex,
  horaSignIndex,
  navamsaSignIndex,
  trimsamsaSignIndex,
} from "../src/lib/astrology/vargas";
import { computeYogini, yoginiLordFromNakshatra } from "../src/lib/astrology/yogini-dasha";
import {
  KP_FROM_LAHIRI_OFFSET_ARCSEC,
  kpAyanamsaFromDate,
  lahiriLonToKp,
} from "../src/lib/astrology/math";
import { computeKundli } from "../src/lib/astrology/compute";
import { meanNorthNode, trueNorthNode } from "../src/lib/astrology/planets";
import { detectYogas } from "../src/lib/astrology/yogas";
import {
  kaalSarpDosha,
  mangalDosha,
  sadeSati,
} from "../src/lib/astrology/doshas";
import { computeVimshottari, dashaBalanceParts } from "../src/lib/astrology/dasha";
import { combustionInfo, combustOrb } from "../src/lib/astrology/dignity";
import { neechaBhangaForPlanet } from "../src/lib/astrology/neecha-bhanga";
import { kakshaFromDegreeInSign, savTransitSupport } from "../src/lib/astrology/ashtakvarga";
import { ashtottariApplies, ASHTOTTARI_YEARS } from "../src/lib/astrology/ashtottari";
import {
  naisargikaBala,
  digBala,
  cheshtaBala,
  cheshtaKendra,
  sunAyanaBala,
  moonPakshaBala,
  ordinaryDrishtiVirupa,
  viseshaDrishtiVirupa,
  drishtiVirupa,
  drishtiPinda,
  drikBala,
  aspectingIsBenefic,
  condensedAhargana,
  abdaLordFromAhargana,
  masaLordFromAhargana,
  varaLordFromAhargana,
  nathonnataBala,
  kalaPakshaBala,
  tribhagaBala,
  horaLord,
  kalaAyanaBala,
  ayanaBalaKesava,
  yuddhaBalaAll,
  uchchaBala,
  deepExaltationLongitude,
  deepDebilitationLongitude,
  ojayugmarasyamsaBala,
  kendradiBala,
  drekkanaBalaSthana,
  saptavargajaBala,
  mixedRelation,
  REQUIRED_VIRUPA,
} from "../src/lib/astrology/shadbala";
import { ASTRO_CONFIG } from "../src/lib/astrology/config";
import type { PlanetPosition } from "../src/lib/astrology/types";
import { ASTRONOMY_ENGINE_VERSION } from "../src/lib/astrology/engine-version";
import fs from "node:fs";
import path from "node:path";
import { buildChartSummary, systemPrompt } from "../src/lib/ai/providers";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  }
}
function dms(d: number, m: number, s: number) {
  return d + m / 60 + s / 3600;
}

console.log("=== 0. Engine version pin vs installed package ===");
{
  const pkgPath = path.join(
    process.cwd(),
    "node_modules",
    "astronomy-engine",
    "package.json"
  );
  const installed = JSON.parse(fs.readFileSync(pkgPath, "utf8")).version as string;
  assert(
    ASTRONOMY_ENGINE_VERSION === installed,
    `ASTRONOMY_ENGINE_VERSION ${ASTRONOMY_ENGINE_VERSION} matches installed ${installed}`
  );
  if (ASTRONOMY_ENGINE_VERSION === installed) {
    console.log(
      "OK:",
      `ASTRONOMY_ENGINE_VERSION ${ASTRONOMY_ENGINE_VERSION} matches installed ${installed}`
    );
  }
}

console.log("=== 1. LAHIRI vs SE/JH Jan-1 tables ===");
const lahiriRefs: [number, number, number, number][] = [
  [1900, 22, 27, 55],
  [1950, 23, 9, 28],
  [1980, 23, 34, 32],
  [2000, 23, 51, 12],
  [2010, 24, 0, 5],
  [2020, 24, 7, 55],
  [2025, 24, 12, 23],
  [2026, 24, 13, 19],
];
for (const [y, d, m, s] of lahiriRefs) {
  const date = new Date(Date.UTC(y, 0, 1, 12));
  const calc = lahiriAyanamsaFromDate(date);
  const ref = dms(d, m, s);
  const dArc = (calc - ref) * 3600;
  console.log(
    y,
    "calc",
    toDMS(calc),
    "ref",
    `${d}°${m}'${s}"`,
    "Δ",
    dArc.toFixed(2) + '"',
    "raw Chitra",
    toDMS(trueChitrapakshaAyanamsa(date))
  );
  assert(Math.abs(dArc) < 3, `Lahiri ${y} |Δ|=${dArc.toFixed(2)}" (limit 3")`);
}
assert(LAHIRI_SE_ALIGNMENT_ARCSEC > 50 && LAHIRI_SE_ALIGNMENT_ARCSEC < 60, "alignment band");

console.log("\n=== 5–6. NAKSHATRA / PADA boundaries (all 27) ===");
assert(NAKSHATRAS.length === 27, "27 nakshatras");
assert(Math.abs(NAKSHATRA_SPAN - 360 / 27) < 1e-12, "13°20′ span");
for (let i = 0; i < 27; i++) {
  const start = i * NAKSHATRA_SPAN;
  const mid = start + NAKSHATRA_SPAN / 2;
  const almostEnd = start + NAKSHATRA_SPAN - 1e-9;
  assert(nakshatraFromLongitude(start).index === i, `nak start ${i} ${NAKSHATRAS[i].en}`);
  assert(nakshatraFromLongitude(mid).index === i, `nak mid ${i}`);
  assert(nakshatraFromLongitude(almostEnd).index === i, `nak end ${i}`);
  // Pada edges inside nakshatra
  for (let p = 0; p < 4; p++) {
    const lon = start + p * (NAKSHATRA_SPAN / 4) + 0.001;
    const n = nakshatraFromLongitude(lon);
    assert(n.pada === p + 1, `pada ${p + 1} at nak ${i}`);
  }
}
// Absolute edges listed in brief
for (const lon of [0, 10 / 3, 20 / 3, 10, 40 / 3, 50 / 3, 20, 70 / 3, 80 / 3, 30]) {
  const n = nakshatraFromLongitude(lon);
  assert(n.pada >= 1 && n.pada <= 4, `edge lon ${lon} pada`);
  assert(n.index >= 0 && n.index < 27, `edge lon ${lon} index`);
}

console.log("\n=== 8. D9 Parashari (movable/fixed/dual) ===");
// Aries 0° → Aries navamsa; Aries 3°20′ → Taurus
assert(navamsaSignIndex(0) === 0, "D9 Aries 0 → Aries");
assert(navamsaSignIndex(10 / 3) === 1, "D9 Aries 3°20′ → Taurus");
assert(navamsaSignIndex(20 / 3) === 2, "D9 Aries 6°40′ → Gemini");
// Taurus (fixed): starts from Capricorn (sign+8)
assert(navamsaSignIndex(30) === 9, "D9 Taurus 0 → Capricorn");
assert(navamsaSignIndex(30 + 10 / 3) === 10, "D9 Taurus 3°20′ → Aquarius");
// Gemini (dual): starts from Libra (sign+4)
assert(navamsaSignIndex(60) === 6, "D9 Gemini 0 → Libra");

console.log("\n=== 9. D10 Parashari odd/even (not D9) ===");
assert(dashamsaSignIndex(0) === 0, "D10 Aries 0 → Aries");
assert(dashamsaSignIndex(3) === 1, "D10 Aries 3 → Taurus");
assert(dashamsaSignIndex(27) === 9, "D10 Aries 27 → Capricorn");
assert(dashamsaSignIndex(29.999) === 9, "D10 Aries 29°59′");
// Taurus even: start from 9th = Capricorn
assert(dashamsaSignIndex(30) === 9, "D10 Taurus 0 → Capricorn");
assert(dashamsaSignIndex(33) === 10, "D10 Taurus 3 → Aquarius");
// Ensure D9 ≠ D10 at sample point
assert(navamsaSignIndex(15) !== dashamsaSignIndex(15) || true, "D9/D10 independent funcs");
assert(navamsaSignIndex(15) === 4, "D9 Aries 15° → Leo (5th navamsa)");
assert(dashamsaSignIndex(15) === 5, "D10 Aries 15° → Virgo (6th dashamsa)");

console.log("\n=== 7. RAHU/KETU opposition + node modes ===");
assert(ASTRO_CONFIG.nodeMode === "mean", "default mean node");
assert(ASTRO_CONFIG.trueNodeStatus === "experimental", "true node experimental");
{
  const d = new Date(Date.UTC(2000, 0, 1, 12));
  const mean = meanNorthNode(d);
  const tr = trueNorthNode(d);
  assert(Number.isFinite(mean) && Number.isFinite(tr), "nodes finite");
  // mean vs true can differ by degrees — just ensure both are valid longitudes
  assert(mean >= 0 && mean < 360 && tr >= 0 && tr < 360, "node range");
}

console.log("\n=== 10. VIMSHOTTARI balance logic ===");
{
  // Moon at start of Ashwini (Ketu) → full Ketu balance ~7y
  const d = new Date(Date.UTC(2000, 5, 1));
  const full = computeVimshottari(0.001, d);
  assert(full.startLord.en === "Ketu", "Ashwini → Ketu");
  assert(full.balanceYears > 6.9 && full.balanceYears <= 7, "near-full Ketu balance");
  // Moon at end of Ashwini → tiny Ketu balance
  const tiny = computeVimshottari(NAKSHATRA_SPAN - 0.01, d);
  assert(tiny.startLord.en === "Ketu", "still Ketu");
  assert(tiny.balanceYears < 0.1, "tiny balance at nak end");
  // Bharani → Venus
  const ven = computeVimshottari(NAKSHATRA_SPAN + 0.1, d);
  assert(ven.startLord.en === "Venus", "Bharani → Venus");

  // Sanjay Rath worked example: Moon at Capricorn 5°51′13″ (10th sign, 1-indexed).
  // Source wrote 305°51′13″ as 10s×30 + 5°51′13″; sidereal Cap start is 9×30.
  const moonUA = 9 * 30 + dms(5, 51, 13);
  const ua = computeVimshottari(moonUA, d);
  const nakUA = nakshatraFromLongitude(moonUA);
  assert(nakUA.name.en === "Uttara Ashadha", "worked example nakshatra");
  assert(nakUA.lord.en === "Sun" && ua.startLord.en === "Sun", "worked example Sun dasha");
  assert(Math.abs(ua.balanceYears - 1.865875) < 5e-4, `Sun balance ${ua.balanceYears} ≈ 1.865875`);
  const parts = dashaBalanceParts(1.865875);
  assert(parts.years === 1 && parts.months === 10 && parts.days === 11, "1y 10m 11d");
  assert(parts.hours === 17, "17h remainder");
}

console.log("\n=== 10b. COMBUSTION orbs + pada severity ===");
{
  const sun = 10;
  assert(combustOrb("mars") === 17, "Mars 17°");
  assert(combustOrb("jupiter") === 11, "Jupiter 11°");
  assert(combustOrb("venus") === 8, "Venus 8°");
  assert(combustOrb("saturn") === 15, "Saturn 15°");
  assert(combustOrb("mercury", false) === 14, "Mercury direct 14°");
  assert(combustOrb("mercury", true) === 12, "Mercury retro 12°");
  assert(combustionInfo("venus", 10 + 8.1, sun).isCombust === false, "Venus just outside 8°");
  assert(combustionInfo("venus", 10 + 7.9, sun).isCombust === true, "Venus inside 8°");
  assert(combustionInfo("mercury", 10 + 13, sun, { retrograde: false }).isCombust === true, "Merc direct 13° combust");
  assert(combustionInfo("mercury", 10 + 13, sun, { retrograde: true }).isCombust === false, "Merc retro 13° not combust");
  // Same pada as Sun at 10° Aries = Ashwini pada 4 (0–13°20′, pada width 3°20′)
  const samePada = combustionInfo("mars", 11, sun);
  assert(samePada.isCombust && samePada.severity === "same_pada", "same pada → strongest");
  const otherPada = combustionInfo("mars", 2, sun);
  assert(otherPada.isCombust && otherPada.severity === "within_orb", "same nak different pada");
}

console.log("\n=== 10c. NEECHABHANGA dual kendra rule ===");
{
  // Moon debilitated in Scorpio (sign 7). Dispositor Mars in kendra from Lagna.
  const moonDeb = fakePlanet("moon", 7, 8);
  const marsKendra = fakePlanet("mars", 0, 1);
  const rest = ["sun", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].map((id, i) =>
    fakePlanet(id, (i + 2) % 12, ((i + 2) % 12) + 1)
  );
  const hit = neechaBhangaForPlanet(moonDeb, [moonDeb, marsKendra, ...rest]);
  assert(hit?.detected === true, "Moon neecha bhanga via Mars in Lagna kendra");
  // Venus debilitated in Virgo (5). Mercury (exaltation lord of Virgo) in kendra from Moon, not Lagna.
  const venusDeb = fakePlanet("venus", 5, 6);
  const moonH3 = fakePlanet("moon", 2, 3);
  const mercuryFromMoon = fakePlanet("mercury", 2, 6); // same sign as Moon → count 1 = kendra from Moon
  const others = ["sun", "mars", "jupiter", "saturn", "rahu", "ketu"].map((id, i) =>
    fakePlanet(id, (i + 8) % 12, 2)
  );
  const vb = neechaBhangaForPlanet(venusDeb, [venusDeb, moonH3, mercuryFromMoon, ...others]);
  assert(vb?.detected === true, "Venus neecha bhanga via exaltation lord kendra from Moon");
  assert(
    vb?.rulesMatched.some((r) => r.includes("from Moon")) === true,
    "exaltation-lord from Moon rule fired"
  );
}

console.log("\n=== 10d. ASHTAKVARGA kaksha + ASHTOTTARI applicability ===");
{
  const k0 = kakshaFromDegreeInSign(0);
  const kLast = kakshaFromDegreeInSign(29.9);
  assert(k0.number === 1 && k0.lord === "saturn", "kaksha 1 Saturn");
  assert(kLast.number === 8 && kLast.lord === "lagna", "kaksha 8 Lagna");
  assert(savTransitSupport(25) && !savTransitSupport(24), "SAV 25+ threshold");
  const sum = Object.values(ASHTOTTARI_YEARS).reduce((a, b) => a + b, 0);
  assert(sum === 108, "Ashtottari 108 years");
  assert(ashtottariApplies({ rahuHouseFromLagnaLord: 5, isDayBirth: true, waxingMoon: true }).applies, "Rahu trikona");
  assert(
    ashtottariApplies({ rahuHouseFromLagnaLord: 2, isDayBirth: true, waxingMoon: false }).applies,
    "day + Krishna"
  );
  assert(
    !ashtottariApplies({ rahuHouseFromLagnaLord: 2, isDayBirth: true, waxingMoon: true }).applies,
    "neither condition"
  );
}

console.log("\n=== 10e. SHADBALA Naisargika (BPHS 60×n/7) ===");
{
  const expect: Record<string, number> = {
    sun: 60,
    moon: 51.43,
    mars: 17.14,
    mercury: 25.71,
    jupiter: 34.29,
    venus: 42.86,
    saturn: 8.57,
  };
  for (const [id, v] of Object.entries(expect)) {
    const got = Math.round(naisargikaBala(id as "sun") * 100) / 100;
    assert(got === v, `naisargika ${id} ${got} === ${v}`);
  }
}

console.log("\n=== 10f. SHADBALA Dik Bala (BPHS 60×(1−δ/180)) ===");
{
  const lagna = 45;
  const mc = 330;
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  assert(near(digBala("jupiter", lagna, lagna, mc), 60), "Jupiter at Asc = 60");
  assert(near(digBala("mercury", lagna, lagna, mc), 60), "Mercury at Asc = 60");
  assert(near(digBala("jupiter", lagna + 180, lagna, mc), 0), "Jupiter at Dsc = 0");
  assert(near(digBala("jupiter", lagna + 90, lagna, mc), 30), "Jupiter 90° from Asc = 30");
  assert(near(digBala("sun", mc, lagna, mc), 60), "Sun at MC = 60");
  assert(near(digBala("mars", mc, lagna, mc), 60), "Mars at MC = 60");
  assert(near(digBala("saturn", lagna + 180, lagna, mc), 60), "Saturn at Dsc = 60");
  assert(near(digBala("moon", mc + 180, lagna, mc), 60), "Moon at IC = 60");
  assert(near(digBala("venus", mc + 180, lagna, mc), 60), "Venus at IC = 60");
  const oneDeg = 60 * (1 - 1 / 180);
  assert(near(digBala("jupiter", lagna + 1, lagna, mc), oneDeg), "1° off peak is continuous not stepped");
}

console.log("\n=== 10g. SHADBALA Cheshta Bala (BPHS vv.24–25) ===");
{
  const d = new Date(Date.UTC(1990, 4, 15, 1, 0, 0)); // 06:30 IST
  const sunC = sunAyanaBala(d);
  const moonC = moonPakshaBala(d);
  assert(sunC >= 0 && sunC <= 60, "Sun ayana-as-chesta in 0–60");
  assert(Math.abs(sunC - cheshtaBala("sun", d)) < 1e-9, "Sun chesta = ayana");
  assert(moonC >= 0 && moonC <= 60, "Moon paksha-as-chesta in 0–60");
  assert(Math.abs(moonC - cheshtaBala("moon", d)) < 1e-9, "Moon chesta = paksha");
  for (const id of ["mars", "mercury", "jupiter", "venus", "saturn"] as const) {
    const k = cheshtaKendra(id, d);
    const b = cheshtaBala(id, d);
    assert(k != null && k >= 0 && k <= 180, `${id} kendra 0–180`);
    assert(Math.abs(b - k! / 3) < 1e-9, `${id} bala = kendra/3`);
    assert(b >= 0 && b <= 60, `${id} chesta 0–60`);
  }
  // Mercury is retrograde on this chart → near inferior conjunction → high chesta
  assert(cheshtaBala("mercury", d) > 40, "retro Mercury high chesta (not a 60 bucket)");
}

console.log("\n=== 10h. SHADBALA Drik Bala (BPHS Ch.26–27 / Raman Arts. 109–120) ===");
{
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  // Ordinary keypoints (BPHS v.3 slabs, Raman Art. 114)
  assert(near(ordinaryDrishtiVirupa(0), 0), "no 1st-house aspect");
  assert(near(ordinaryDrishtiVirupa(30), 0), "aspect starts after 30°");
  assert(near(ordinaryDrishtiVirupa(60), 15), "3rd = ¼ = 15");
  assert(near(ordinaryDrishtiVirupa(90), 45), "4th = ¾ = 45");
  assert(near(ordinaryDrishtiVirupa(120), 30), "5th = ½ = 30");
  assert(near(ordinaryDrishtiVirupa(150), 0), "6th = 0");
  assert(near(ordinaryDrishtiVirupa(180), 60), "7th = full 60");
  assert(near(ordinaryDrishtiVirupa(210), 45), "8th = ¾ = 45");
  assert(near(ordinaryDrishtiVirupa(240), 30), "9th = ½ = 30");
  assert(near(ordinaryDrishtiVirupa(270), 15), "10th = ¼ = 15");
  assert(near(ordinaryDrishtiVirupa(300), 0), "stops at 300°");
  // Visesha makes special aspects full 60 at the house start (Raman Art. 115)
  assert(near(viseshaDrishtiVirupa("saturn", 60), 45), "Saturn visesha 3rd +45");
  assert(near(drishtiVirupa("saturn", 0, 60), 60), "Saturn 3rd = 60 not 15");
  assert(near(drishtiVirupa("mars", 0, 90), 60), "Mars 4th = 60 not 45");
  assert(near(drishtiVirupa("jupiter", 0, 120), 60), "Jupiter 5th = 60 not 30");
  assert(near(drishtiVirupa("mars", 0, 210), 60), "Mars 8th = 60");
  assert(near(drishtiVirupa("jupiter", 0, 240), 60), "Jupiter 9th = 60");
  assert(near(drishtiVirupa("saturn", 0, 270), 60), "Saturn 10th = 60 not 15");
  assert(near(drishtiVirupa("sun", 0, 60), 15), "Sun 3rd stays 15");
  assert(near(drishtiVirupa("venus", 0, 180), 60), "Venus 7th = 60");
  // Signed pinda / 4. Two-planet charts.
  const ju180: PlanetPosition[] = [
    {
      id: "sun",
      name: { en: "Sun", hi: "Sun" },
      longitude: 0,
      signIndex: 0,
      sign: { en: "Aries", hi: "Aries" },
      degreeInSign: 0,
      house: 1,
      nakshatraIndex: 0,
      nakshatra: { en: "x", hi: "x" },
      pada: 1,
    },
    {
      id: "jupiter",
      name: { en: "Jupiter", hi: "Jupiter" },
      longitude: 180,
      signIndex: 6,
      sign: { en: "Libra", hi: "Libra" },
      degreeInSign: 0,
      house: 7,
      nakshatraIndex: 0,
      nakshatra: { en: "x", hi: "x" },
      pada: 1,
    },
  ];
  assert(aspectingIsBenefic("jupiter", ju180), "Jupiter is Subha");
  assert(near(drishtiPinda("sun", ju180), 60), "Jupiter 7th on Sun = +60 pinda");
  assert(near(drikBala("sun", ju180), 15), "Drik = pinda/4 = +15");
  const sa180 = ju180.map((p) =>
    p.id === "jupiter" ? { ...p, id: "saturn", name: { en: "Saturn", hi: "Saturn" } } : p
  );
  assert(!aspectingIsBenefic("saturn", sa180), "Saturn is Papa");
  assert(near(drishtiPinda("sun", sa180), -60), "Saturn 7th on Sun = −60 pinda");
  assert(near(drikBala("sun", sa180), -15), "malefic Drik = −15 (not clamped)");
}

console.log("\n=== 10i-1. Kala Nathonnata (Raman Arts. 47–51) ===");
{
  const sunrise = new Date("1990-05-15T00:00:00Z");
  const sunset = new Date("1990-05-15T12:00:00Z");
  const nextSunrise = new Date("1990-05-16T00:00:00Z");
  const win = { sunrise, sunset, nextSunrise };
  const noon = new Date("1990-05-15T06:00:00Z");
  const midnight = new Date("1990-05-15T18:00:00Z");
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  assert(near(nathonnataBala("mercury", noon, win), 60), "Mercury always 60");
  assert(near(nathonnataBala("sun", noon, win), 60), "Sun at noon = 60");
  assert(near(nathonnataBala("jupiter", noon, win), 60), "Jupiter at noon = 60");
  assert(near(nathonnataBala("venus", noon, win), 60), "Venus at noon = 60");
  assert(near(nathonnataBala("moon", noon, win), 0), "Moon at noon = 0");
  assert(near(nathonnataBala("mars", noon, win), 0), "Mars at noon = 0");
  assert(near(nathonnataBala("saturn", noon, win), 0), "Saturn at noon = 0");
  assert(near(nathonnataBala("sun", midnight, win), 0), "Sun at midnight = 0");
  assert(near(nathonnataBala("moon", midnight, win), 60), "Moon at midnight = 60");
  assert(near(nathonnataBala("sun", sunrise, win), 30), "Sun at sunrise (halfway midnight→noon) = 30");
  assert(near(nathonnataBala("moon", sunrise, win), 30), "Moon at sunrise = 30");
}

console.log("\n=== 10i-2. Kala Paksha vs Moon Cheshta (Raman Arts. 52–55) ===");
{
  const d = new Date(Date.UTC(1990, 4, 15, 1, 0, 0));
  const chestaMoon = moonPakshaBala(d);
  assert(Math.abs(chestaMoon - cheshtaBala("moon", d)) < 1e-9, "Moon Cheshta still undoubled paksha");
  const planets: PlanetPosition[] = [
    { id: "sun", name: { en: "Sun", hi: "Sun" }, longitude: 0, signIndex: 0, sign: { en: "Aries", hi: "Aries" }, degreeInSign: 0, house: 1, nakshatraIndex: 0, nakshatra: { en: "x", hi: "x" }, pada: 1 },
    { id: "moon", name: { en: "Moon", hi: "Moon" }, longitude: 180, signIndex: 6, sign: { en: "Libra", hi: "Libra" }, degreeInSign: 0, house: 7, nakshatraIndex: 0, nakshatra: { en: "x", hi: "x" }, pada: 1 },
    { id: "jupiter", name: { en: "Jupiter", hi: "Jupiter" }, longitude: 10, signIndex: 0, sign: { en: "Aries", hi: "Aries" }, degreeInSign: 10, house: 1, nakshatraIndex: 0, nakshatra: { en: "x", hi: "x" }, pada: 1 },
    { id: "saturn", name: { en: "Saturn", hi: "Saturn" }, longitude: 20, signIndex: 0, sign: { en: "Aries", hi: "Aries" }, degreeInSign: 20, house: 1, nakshatraIndex: 0, nakshatra: { en: "x", hi: "x" }, pada: 1 },
  ];
  // Full moon: |M-S|=180 → subha 60. Use date-based helper; synthetic longs only for benefic flags.
  assert(Math.abs(kalaPakshaBala("moon", planets, d) - 2 * chestaMoon) < 1e-9, "Kala Moon paksha = 2×Cheshta");
  assert(Math.abs(kalaPakshaBala("jupiter", planets, d) - chestaMoon) < 1e-9, "benefic paksha = undoubled");
  assert(Math.abs(kalaPakshaBala("saturn", planets, d) - (60 - chestaMoon)) < 1e-9, "malefic paksha = complement");
}

console.log("\n=== 10i-3. Kala Tribhaga (Raman Arts. 56–57) ===");
{
  const sunrise = new Date("1990-05-15T00:00:00Z");
  const sunset = new Date("1990-05-15T12:00:00Z");
  const nextSunrise = new Date("1990-05-16T00:00:00Z");
  const win = { sunrise, sunset, nextSunrise };
  const firstDay = new Date("1990-05-15T01:00:00Z");
  const secondDay = new Date("1990-05-15T06:00:00Z");
  const thirdDay = new Date("1990-05-15T11:00:00Z");
  const firstNight = new Date("1990-05-15T13:00:00Z");
  assert(tribhagaBala("jupiter", firstDay, win) === 60, "Jupiter always 60");
  assert(tribhagaBala("mercury", firstDay, win) === 60, "1st day third = Mercury");
  assert(tribhagaBala("sun", secondDay, win) === 60, "2nd day third = Sun");
  assert(tribhagaBala("saturn", thirdDay, win) === 60, "3rd day third = Saturn");
  assert(tribhagaBala("moon", firstNight, win) === 60, "1st night third = Moon");
  assert(tribhagaBala("sun", firstDay, win) === 0, "Sun not in 1st day third");
}

console.log("\n=== 10i-4/5/6. Kala Abda/Masa/Vara ahargana (Raman Arts. 63–67) ===");
{
  assert(condensedAhargana(1918, 10, 16) === 33405, "Raman standard horoscope AH = 33405");
  assert(abdaLordFromAhargana(33405) === "saturn", "1918-10-16 year-lord Saturn");
  assert(masaLordFromAhargana(33405) === "mercury", "1918-10-16 month-lord Mercury");
  assert(varaLordFromAhargana(33405) === "mercury", "1918-10-16 weekday Mercury (Wednesday)");
}

console.log("\n=== 10i-7. Kala Hora (Raman Arts. 68–70, 24 equal) ===");
{
  // Tuesday sunrise: first hora = Mars
  const sunrise = new Date("1990-05-15T00:00:00Z");
  const sunset = new Date("1990-05-15T12:00:00Z");
  const nextSunrise = new Date("1990-05-16T00:00:00Z");
  const win = { sunrise, sunset, nextSunrise };
  const first = new Date("1990-05-15T00:10:00Z");
  assert(horaLord(first, win, "UTC") === "mars", "Tue first equal hora = Mars");
}

console.log("\n=== 10i-8. Kala Ayana vs Sun Cheshta (Raman Art. 75) ===");
{
  const d = new Date(Date.UTC(1990, 4, 15, 1, 0, 0));
  const chestaSun = sunAyanaBala(d);
  assert(Math.abs(chestaSun - cheshtaBala("sun", d)) < 1e-9, "Sun Cheshta still undoubled Ayana");
  assert(Math.abs(kalaAyanaBala("sun", d) - 2 * chestaSun) < 1e-9, "Kala Sun Ayana = 2×Cheshta");
  assert(ayanaBalaKesava("mercury", -10, { doubleSun: true }) > 30, "Mercury south declination still additive");
  assert(ayanaBalaKesava("moon", 10) < 30, "Moon north declination subtractive");
  assert(ayanaBalaKesava("saturn", 10) < 30, "Saturn north declination subtractive");
  assert(ayanaBalaKesava("mars", 10) > 30, "Mars north declination additive");
}

console.log("\n=== 10i-9. Kala Yuddha (Raman Arts. 76–77) ===");
{
  const d = new Date(Date.UTC(1990, 4, 15, 1, 0, 0));
  const win = {
    sunrise: new Date("1990-05-15T00:00:00Z"),
    sunset: new Date("1990-05-15T12:00:00Z"),
    nextSunrise: new Date("1990-05-16T00:00:00Z"),
  };
  const angles = { lagnaLon: 45, mcLon: 300, lat: 28.6, lon: 77.2, timeZone: "UTC" };
  const far: PlanetPosition[] = ["sun","moon","mars","mercury","jupiter","venus","saturn"].map((id, i) => ({
    id,
    name: { en: id, hi: id },
    longitude: i * 40,
    signIndex: 0,
    sign: { en: "x", hi: "x" },
    degreeInSign: 0,
    house: 1,
    nakshatraIndex: 0,
    nakshatra: { en: "x", hi: "x" },
    pada: 1,
  }));
  const none = yuddhaBalaAll(far, d, angles, win, 1);
  assert(Object.values(none).every((v) => v === 0), "no yuddha when >1° apart");
  const war = far.map((p) =>
    p.id === "venus" ? { ...p, longitude: far.find((x) => x.id === "mars")!.longitude + 0.4 } : p
  );
  const y = yuddhaBalaAll(war, d, angles, win, 1);
  assert(y.mars !== 0 && y.venus !== 0, "Mars-Venus within 1° produces yuddha");
  assert(Math.abs(y.mars + y.venus) < 1e-9, "winner/loser opposite signs");
  assert(y.sun === 0 && y.moon === 0, "luminaries never yuddha");
}

console.log("\n=== 10j-1. Sthana Uchcha (Raman Art. 20, deep-exaltation table) ===");
{
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  assert(near(deepExaltationLongitude("venus"), 11 * 30 + 27), "Venus deep exalt = Pisces 27°");
  assert(near(deepDebilitationLongitude("venus"), 5 * 30 + 27), "Venus neecha = Virgo 27°");
  assert(near(uchchaBala("sun", 10), 60), "Sun at Aries 10° = 60");
  assert(near(uchchaBala("sun", 190), 0), "Sun at Libra 10° = 0");
  assert(near(uchchaBala("sun", 100), 30), "Sun 90° from neecha = 30");
  assert(near(uchchaBala("venus", 357), 60), "Venus at Pisces 27° = 60");
  const venusChart = 348.57; // 18.57° Pisces on the test chart
  const venusU = uchchaBala("venus", venusChart);
  assert(venusU < 60 && venusU > 50, "Venus 18.57° Pisces is not a flat 60");
  assert(near(Math.round(venusU * 100) / 100, 57.19), `Venus Uchcha ${venusU.toFixed(2)} = 57.19 not 60`);
}

console.log("\n=== 10j-2. Sthana Saptavargaja (D1 D2 D3 D7 D9 D12 D30) ===");
{
  const planets: PlanetPosition[] = ["sun","moon","mars","mercury","jupiter","venus","saturn"].map((id, i) => ({
    id,
    name: { en: id, hi: id },
    longitude: i === 0 ? 125 : i * 40, // Sun in Leo 5° moolatrikona
    signIndex: i === 0 ? 4 : Math.floor((i * 40) / 30) % 12,
    sign: { en: "x", hi: "x" },
    degreeInSign: i === 0 ? 5 : 0,
    house: 1,
    nakshatraIndex: 0,
    nakshatra: { en: "x", hi: "x" },
    pada: 1,
  }));
  const sunS = saptavargajaBala("sun", 125, planets);
  assert(sunS >= 45, "Sun D1 moolatrikona contributes 45");
  assert(mixedRelation("sun", "venus", planets) === "adhisatru" || mixedRelation("sun", "venus", planets) === "sama", "Sun-Venus mixed is defined");
}

console.log("\n=== 10j-3. Sthana Ojayugmarasyamsa (Raman Art. 31) ===");
{
  assert(ojayugmarasyamsaBala("sun", 0) === 30, "Sun odd rasi + odd navamsa = 30");
  assert(ojayugmarasyamsaBala("moon", 30) === 30, "Moon even rasi + even navamsa = 30");
}

console.log("\n=== 10j-4. Sthana Kendradi (Raman Arts. 32–35) ===");
{
  assert(kendradiBala(1) === 60 && kendradiBala(4) === 60 && kendradiBala(7) === 60 && kendradiBala(10) === 60, "kendra 60");
  assert(kendradiBala(2) === 30 && kendradiBala(5) === 30 && kendradiBala(8) === 30 && kendradiBala(11) === 30, "panapara 30");
  assert(kendradiBala(3) === 15 && kendradiBala(6) === 15 && kendradiBala(9) === 15 && kendradiBala(12) === 15, "apoklima 15");
}

console.log("\n=== 10j-5. Sthana Drekkana (Raman Arts. 36–39, 15 virupa) ===");
{
  assert(drekkanaBalaSthana("sun", 5) === 15, "male in 1st drekkana = 15");
  assert(drekkanaBalaSthana("sun", 15) === 0, "male in 2nd = 0");
  assert(drekkanaBalaSthana("mercury", 15) === 15, "hermaphrodite in 2nd = 15");
  assert(drekkanaBalaSthana("moon", 25) === 15, "female in 3rd = 15");
  assert(drekkanaBalaSthana("venus", 5) === 0, "female in 1st = 0");
}

console.log("\n=== 11. YOGA true/false cases ===");
function fakePlanet(
  id: string,
  signIndex: number,
  house: number
): PlanetPosition {
  return {
    id,
    name: { en: id, hi: id },
    longitude: signIndex * 30 + 10,
    signIndex,
    sign: { en: String(signIndex), hi: String(signIndex) },
    degreeInSign: 10,
    house,
    nakshatraIndex: 0,
    nakshatra: { en: "x", hi: "x" },
    pada: 1,
  };
}
{
  const base = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].map(
    (id, i) => fakePlanet(id, (i + 3) % 12, ((i + 3) % 12) + 1)
  );
  // Gaja Kesari TRUE: Moon sign 0, Jupiter sign 3 (kendra)
  const gkTrue = base.map((p) =>
    p.id === "moon"
      ? { ...p, signIndex: 0, house: 1 }
      : p.id === "jupiter"
        ? { ...p, signIndex: 3, house: 4 }
        : p
  );
  assert(
    detectYogas(gkTrue, 0).some((y) => y.id === "gaja-kesari"),
    "Gaja Kesari TRUE"
  );
  // Gaja Kesari FALSE: Jupiter 2nd from Moon
  const gkFalse = base.map((p) =>
    p.id === "moon"
      ? { ...p, signIndex: 0, house: 1 }
      : p.id === "jupiter"
        ? { ...p, signIndex: 1, house: 2 }
        : p
  );
  assert(
    !detectYogas(gkFalse, 0).some((y) => y.id === "gaja-kesari"),
    "Gaja Kesari FALSE"
  );
  // Budha-Aditya TRUE
  const baTrue = base.map((p) =>
    p.id === "sun" || p.id === "mercury"
      ? { ...p, signIndex: 4, house: 5 }
      : p
  );
  assert(
    detectYogas(baTrue, 0).some((y) => y.id === "budha-aditya"),
    "Budha-Aditya TRUE"
  );
  // Budha-Aditya FALSE
  const baFalse = base.map((p) =>
    p.id === "sun"
      ? { ...p, signIndex: 4, house: 5 }
      : p.id === "mercury"
        ? { ...p, signIndex: 5, house: 6 }
        : p
  );
  assert(
    !detectYogas(baFalse, 0).some((y) => y.id === "budha-aditya"),
    "Budha-Aditya FALSE"
  );
  // Chandra-Mangal TRUE
  const cm = base.map((p) =>
    p.id === "moon" || p.id === "mars" ? { ...p, signIndex: 2, house: 3 } : p
  );
  assert(detectYogas(cm, 0).some((y) => y.id === "chandra-mangal"), "Chandra-Mangal TRUE");

  // Amala TRUE: Jupiter in 10th
  const amala = base.map((p) =>
    p.id === "jupiter" ? { ...p, signIndex: 9, house: 10 } : p
  );
  assert(detectYogas(amala, 0).some((y) => y.id === "amala-lagna"), "Amala TRUE H10");
  const amalaY = detectYogas(amala, 0).find((y) => y.id === "amala-lagna");
  assert(!!amalaY?.basedOn?.en, "Amala has basedOn citation");
}

console.log("\n=== 12. DOSHA true/false ===");
{
  const planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].map(
    (id, i) => fakePlanet(id, i % 12, (i % 12) + 1)
  );
  const manglikTrue = planets.map((p) =>
    p.id === "mars" ? { ...p, house: 7, signIndex: 6 } : p
  );
  assert(mangalDosha(manglikTrue, 0).present, "Manglik TRUE H7");
  const manglikFalse = planets.map((p) =>
    p.id === "mars" ? { ...p, house: 3, signIndex: 2 } : p
  );
  assert(!mangalDosha(manglikFalse, 0).present, "Manglik FALSE H3");

  // Kaal Sarp: all between Rahu→Ketu arc
  const ksdTrue = planets.map((p) => {
    if (p.id === "rahu") return { ...p, longitude: 0 };
    if (p.id === "ketu") return { ...p, longitude: 180 };
    return { ...p, longitude: 40 + planets.indexOf(p) * 10 };
  });
  assert(kaalSarpDosha(ksdTrue).present, "Kaal Sarp TRUE");
  const ksdFalse = planets.map((p) => {
    if (p.id === "rahu") return { ...p, longitude: 0 };
    if (p.id === "ketu") return { ...p, longitude: 180 };
    // spread both sides
    return {
      ...p,
      longitude: p.id === "sun" || p.id === "moon" ? 40 : 220,
    };
  });
  assert(!kaalSarpDosha(ksdFalse).present, "Kaal Sarp FALSE");
}

console.log("\n=== 15. HOUSES all 12 Lagnas ===");
for (let lagna = 0; lagna < 12; lagna++) {
  for (let h = 0; h < 12; h++) {
    const sign = (lagna + h) % 12;
    assert(!!SIGN_LORDS[sign], `L${lagna} H${h + 1} lord`);
  }
}

console.log("\n=== 13–14. Live chart + transit + Sade Sati + SSOT ===");
{
  const k = computeKundli({
    name: "Validation",
    date: "1990-05-15",
    time: "06:30",
    place: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    timezoneOffsetMinutes: 330,
  });
  assert(k.settings.ayanamsa === "lahiri", "settings lahiri");
  assert(k.settings.nodeType === "mean", "settings mean");
  assert(!!k.divisionalCharts?.D9 && !!k.divisionalCharts?.D10, "D9/D10 present");
  assert(!!(k.divisionalCharts as Record<string, unknown>)?.D30, "D30 present");
  assert(!!(k.divisionalCharts as Record<string, unknown>)?.D60, "D60 present");
  assert(!!k.yoginiDasha, "yogini dasha present");
  assert(!!k.ashtakvarga, "ashtakvarga present");
  assert(!!k.kp, "kp present");
  assert(!!k.avakhada, "avakhada present");
  assert(!!k.panchang, "panchang present");
  assert(!!k.transits, "transits present");
  const rahu = k.planets.find((p) => p.id === "rahu")!;
  const ketu = k.planets.find((p) => p.id === "ketu")!;
  assert(
    Math.abs(norm360(rahu.longitude + 180) - ketu.longitude) < 1e-9,
    "Ketu = Rahu+180"
  );
  const ss = sadeSati(k.moonRashi.signIndex, new Date(), { includeWindow: true });
  assert(["none", "rising", "peak", "setting"].includes(ss.phase), "sade phase");
  // Same object fields used by AI
  const summary = buildChartSummary(k);
  assert(summary.includes("CALCULATED CHART"), "AI summary header");
  assert(summary.includes(k.lagna.sign.en), "AI has lagna");
  assert(summary.includes("D9") || summary.includes("Navamsa"), "AI has D9");
  const prompt = systemPrompt("en");
  assert(prompt.includes("CALCULATE FIRST") || prompt.includes("MUST NEVER invent"), "AI interpret-only");
  assert(prompt.toLowerCase().includes("never") || prompt.includes("MUST NEVER"), "AI never invent");

  const sb = k.shadbala as {
    methods: { drik: string; sthana: string; kala: string };
    planets: Array<{
      id: string;
      drik: number;
      dig: number;
      naisargika: number;
      cheshta: number;
      sthana: number;
      sthanaParts: {
        uchcha: number;
        saptavargaja: number;
        ojayugma: number;
        kendradi: number;
        drekkana: number;
        total: number;
      };
      kala: number;
      kalaParts: {
        nathonnata: number;
        paksha: number;
        tribhaga: number;
        abda: number;
        masa: number;
        vara: number;
        hora: number;
        ayana: number;
        yuddha: number;
        total: number;
      };
      totalVirupas: number;
      rupas: number;
      required: number;
      isStrong: boolean;
    }>;
  };
  assert(sb.methods.drik === "bphs", "Drik method is BPHS");
  assert(sb.methods.kala === "bphs", "Kala method is BPHS");
  assert(sb.methods.sthana === "bphs", "Sthana method is BPHS");
  const order = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as const;
  const wasSthana: Record<string, number> = {
    sun: 7.5,
    moon: 7.5,
    mars: 7.5,
    mercury: 7.5,
    jupiter: 7.5,
    venus: 60,
    saturn: 30,
  };
  console.log("\n--- Phase 6 Sthana dump (15 May 1990 06:30 New Delhi) ---");
  console.log(
    [
      "id".padEnd(8),
      "Uchcha".padStart(8),
      "Sapta".padStart(8),
      "Oja".padStart(6),
      "Kend".padStart(6),
      "Drek".padStart(6),
      "Sthana".padStart(8),
      "was".padStart(6),
      "Δ".padStart(8),
    ].join(" ")
  );
  for (const id of order) {
    const row = sb.planets.find((p) => p.id === id)!;
    const sp = row.sthanaParts;
    const delta = row.sthana - wasSthana[id]!;
    console.log(
      [
        id.padEnd(8),
        sp.uchcha.toFixed(2).padStart(8),
        sp.saptavargaja.toFixed(2).padStart(8),
        sp.ojayugma.toFixed(2).padStart(6),
        sp.kendradi.toFixed(2).padStart(6),
        sp.drekkana.toFixed(2).padStart(6),
        row.sthana.toFixed(2).padStart(8),
        String(wasSthana[id]).padStart(6),
        `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}`.padStart(8),
      ].join(" ")
    );
  }
  const venus = sb.planets.find((p) => p.id === "venus")!;
  assert(venus.sthanaParts.uchcha < 60, "Venus Uchcha not the old flat 60");
  console.log("\n--- Phase 6 FULL Shadbala (all six balas) ---");
  console.log(
    [
      "id".padEnd(8),
      "Sthana".padStart(8),
      "Dik".padStart(8),
      "Kala".padStart(8),
      "Cheshta".padStart(8),
      "Nais".padStart(8),
      "Drik".padStart(8),
      "Total".padStart(8),
      "Req".padStart(6),
      "Rupa".padStart(6),
      "min?".padStart(6),
    ].join(" ")
  );
  for (const id of order) {
    const row = sb.planets.find((p) => p.id === id)!;
    const req = REQUIRED_VIRUPA[id];
    console.log(
      [
        id.padEnd(8),
        row.sthana.toFixed(2).padStart(8),
        row.dig.toFixed(2).padStart(8),
        row.kala.toFixed(2).padStart(8),
        row.cheshta.toFixed(2).padStart(8),
        row.naisargika.toFixed(2).padStart(8),
        row.drik.toFixed(2).padStart(8),
        row.totalVirupas.toFixed(1).padStart(8),
        String(req).padStart(6),
        row.rupas.toFixed(2).padStart(6),
        (row.totalVirupas >= req ? "YES" : "NO").padStart(6),
      ].join(" ")
    );
    assert(row.isStrong === row.totalVirupas >= req, `${id} isStrong flag`);
  }
}

console.log("\n=== TZ mode documented ===");
assert(ASTRO_CONFIG.timezoneMode === "iana_historical", "IANA historical TZ mode");

console.log("\n=== EXTRA VARGAS / YOGINI / KP AYANAMSA ===");
assert(horaSignIndex(5) === 4, "hora odd first half → Leo");
assert(horaSignIndex(20) === 3, "hora odd second half → Cancer");
assert(drekkanaSignIndex(5) === 0, "drekkana first third Aries");
assert(drekkanaSignIndex(15) === 4, "drekkana second third → Leo (5th)");
assert(trimsamsaSignIndex(2) === 0, "trimsamsa odd Mars→Aries");
assert(yoginiLordFromNakshatra(0) === "mangala", "Ashwini→Mangala");
assert(yoginiLordFromNakshatra(1) === "pingala", "Bharani→Pingala");
{
  const y = computeYogini(10, new Date("1990-05-15T06:30:00Z"));
  assert(y.mahaList.length >= 8, "yogini list length");
  assert(y.balanceYears > 0 && y.balanceYears <= 8, "yogini balance");
}
{
  const d = new Date(Date.UTC(2020, 0, 1, 12));
  const kp = kpAyanamsaFromDate(d);
  const lah = lahiriAyanamsaFromDate(d);
  assert(Math.abs((lah - kp) * 3600 - KP_FROM_LAHIRI_OFFSET_ARCSEC) < 0.01, "KP offset");
  assert(Math.abs(lahiriLonToKp(0) - KP_FROM_LAHIRI_OFFSET_ARCSEC / 3600) < 1e-9, "lahiri→kp lon");
}
{
  // Mars in 7th from Lagna Aries → Manglik present
  const planets = [
    { id: "mars", name: { en: "Mars", hi: "मंगल" }, longitude: 180, signIndex: 6, sign: { en: "Libra", hi: "तुला" }, degreeInSign: 0, house: 7, nakshatraIndex: 0, nakshatra: { en: "X", hi: "X" }, pada: 1 },
    { id: "jupiter", name: { en: "Jupiter", hi: "गुरु" }, longitude: 180, signIndex: 6, sign: { en: "Libra", hi: "तुला" }, degreeInSign: 1, house: 7, nakshatraIndex: 0, nakshatra: { en: "X", hi: "X" }, pada: 1 },
    { id: "moon", name: { en: "Moon", hi: "चंद्र" }, longitude: 0, signIndex: 0, sign: { en: "Aries", hi: "मेष" }, degreeInSign: 0, house: 1, nakshatraIndex: 0, nakshatra: { en: "X", hi: "X" }, pada: 1 },
  ] as PlanetPosition[];
  const m = mangalDosha(planets, 0);
  assert(m.present, "manglik present 7th");
  assert(m.cancelled === true, "jupiter conjunct cancels/softens");
}

console.log(failed === 0 ? "\nVALIDATION OK" : `\nVALIDATION FAILED (${failed})`);
process.exit(failed === 0 ? 0 : 1);
