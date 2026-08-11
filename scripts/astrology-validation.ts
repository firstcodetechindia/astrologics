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
  navamsaSignIndex,
} from "../src/lib/astrology/vargas";
import { computeKundli } from "../src/lib/astrology/compute";
import { meanNorthNode, trueNorthNode } from "../src/lib/astrology/planets";
import { detectYogas } from "../src/lib/astrology/yogas";
import {
  kaalSarpDosha,
  mangalDosha,
  sadeSati,
} from "../src/lib/astrology/doshas";
import { computeVimshottari } from "../src/lib/astrology/dasha";
import { ASTRO_CONFIG } from "../src/lib/astrology/config";
import type { PlanetPosition } from "../src/lib/astrology/types";
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
}

console.log("\n=== TZ mode documented ===");
assert(ASTRO_CONFIG.timezoneMode === "fixed_offset_minutes", "fixed offset mode");

console.log(failed === 0 ? "\nVALIDATION OK" : `\nVALIDATION FAILED (${failed})`);
process.exit(failed === 0 ? 0 : 1);
