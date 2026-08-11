/**
 * Parashari Varga (divisional) charts — BPHS mapping rules.
 * D1 is the Rashi chart (no division). All others divide degree-in-sign.
 */
import { SIGN_LORDS, SIGNS } from "./constants";
import { degreeInSign, norm360, signIndexFromLongitude } from "./math";
import { nakshatraFromLongitude } from "./nakshatra";

export type VargaCode =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D7"
  | "D9"
  | "D10"
  | "D12"
  | "D16"
  | "D20"
  | "D24"
  | "D27"
  | "D30"
  | "D40"
  | "D45"
  | "D60";

export type VargaPlanet = {
  id: string;
  name: { en: string; hi: string };
  longitude: number;
  signIndex: number;
  sign: { en: string; hi: string };
  lord: { en: string; hi: string };
  degreeInSign: number;
  vargaDegree: number;
  vargottama?: boolean;
  nakshatra: { en: string; hi: string };
  pada: number;
};

export type DivisionalChart = {
  code: VargaCode;
  name: { en: string; hi: string };
  purpose: { en: string; hi: string };
  lagna: {
    signIndex: number;
    sign: { en: string; hi: string };
    lord: { en: string; hi: string };
    vargaDegree: number;
  };
  planets: VargaPlanet[];
};

const NAMES: Record<VargaCode, { en: string; hi: string; purpose: { en: string; hi: string } }> = {
  D1: {
    en: "Lagna / Rashi (D1)",
    hi: "लग्न / राशि (D1)",
    purpose: { en: "Overall life", hi: "समग्र जीवन" },
  },
  D2: {
    en: "Hora (D2)",
    hi: "होरा (D2)",
    purpose: { en: "Wealth & income", hi: "धन व आय" },
  },
  D3: {
    en: "Drekkana (D3)",
    hi: "द्रेष्काण (D3)",
    purpose: { en: "Siblings & courage", hi: "सहोदर व साहस" },
  },
  D4: {
    en: "Chaturthamsa (D4)",
    hi: "चतुर्थांश (D4)",
    purpose: { en: "Property & fortune", hi: "संपत्ति व भाग्य" },
  },
  D7: {
    en: "Saptamsa (D7)",
    hi: "सप्तमांश (D7)",
    purpose: { en: "Children & progeny", hi: "संतान" },
  },
  D9: {
    en: "Navamsa (D9)",
    hi: "नवमांश (D9)",
    purpose: { en: "Marriage & dharma", hi: "विवाह व धर्म" },
  },
  D10: {
    en: "Dasamsa (D10)",
    hi: "दशमांश (D10)",
    purpose: { en: "Career & status", hi: "करियर व प्रतिष्ठा" },
  },
  D12: {
    en: "Dwadasamsa (D12)",
    hi: "द्वादशांश (D12)",
    purpose: { en: "Parents & lineage", hi: "माता-पिता" },
  },
  D16: {
    en: "Shodasamsa (D16)",
    hi: "षोडशांश (D16)",
    purpose: { en: "Vehicles & comforts", hi: "वाहन व सुख" },
  },
  D20: {
    en: "Vimsamsa (D20)",
    hi: "विंशांश (D20)",
    purpose: { en: "Spiritual progress", hi: "आध्यात्मिक प्रगति" },
  },
  D24: {
    en: "Chaturvimsamsa (D24)",
    hi: "चतुर्विंशांश (D24)",
    purpose: { en: "Education & learning", hi: "शिक्षा" },
  },
  D27: {
    en: "Saptavimsamsa (D27)",
    hi: "सप्तविंशांश (D27)",
    purpose: { en: "Strength & weakness", hi: "बल व दुर्बलता" },
  },
  D30: {
    en: "Trimsamsa (D30)",
    hi: "त्रिंशांश (D30)",
    purpose: { en: "Misfortunes & challenges", hi: "अशुभ व चुनौतियाँ" },
  },
  D40: {
    en: "Khavedamsa (D40)",
    hi: "खवेदांश (D40)",
    purpose: { en: "Auspicious effects", hi: "शुभ फल" },
  },
  D45: {
    en: "Akshavedamsa (D45)",
    hi: "अक्षवेदांश (D45)",
    purpose: { en: "General well-being", hi: "सामान्य कल्याण" },
  },
  D60: {
    en: "Shastiamsa (D60)",
    hi: "षष्ट्यांश (D60)",
    purpose: { en: "Karma refinement", hi: "कर्म सूक्ष्म दृष्टि" },
  },
};

function partOf(lon: number, n: number): number {
  const inSign = norm360(lon) % 30;
  return Math.min(n - 1, Math.floor(inSign / (30 / n)));
}

/** Odd signs in 0-index: 0,2,4,6,8,10 */
function isOddSign(sign: number) {
  return sign % 2 === 0;
}

export function rashiSignIndex(longitude: number): number {
  return signIndexFromLongitude(longitude);
}

/** D2 Hora — Sun (Leo) / Moon (Cancer) only. */
export function horaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const deg = norm360(longitude) % 30;
  const firstHalf = deg < 15;
  if (isOddSign(sign)) return firstHalf ? 4 : 3; // Leo : Cancer
  return firstHalf ? 3 : 4; // Cancer : Leo
}

/** D3 Drekkana — 0–10 same, 10–20 5th, 20–30 9th. */
export function drekkanaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 3);
  return (sign + part * 4) % 12;
}

/** D4 Chaturthamsa — 7°30′, from sign then 4th, 7th, 10th. */
export function chaturthamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 4);
  return (sign + part * 3) % 12;
}

/** D7 Saptamsa — odd from same, even from 7th. */
export function saptamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 7);
  const start = isOddSign(sign) ? sign : (sign + 6) % 12;
  return (start + part) % 12;
}

export function navamsaSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const NAVAMSA = 10 / 3;
  const part = Math.min(8, Math.floor((lon % 30) / NAVAMSA));
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = sign;
  else if (fixed.includes(sign)) start = (sign + 8) % 12;
  else start = (sign + 4) % 12;
  return (start + part) % 12;
}

export function dashamsaSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const part = Math.min(9, Math.floor((lon % 30) / 3));
  const start = sign % 2 === 0 ? sign : (sign + 8) % 12;
  return (start + part) % 12;
}

/** D12 Dwadasamsa — 2°30′ sequential from same sign. */
export function dwadasamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  return (sign + partOf(longitude, 12)) % 12;
}

/** D16 — movable from Aries, fixed Leo, dual Sagittarius. */
export function shodasamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 16);
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = 0;
  else if (fixed.includes(sign)) start = 4;
  else start = 8;
  return (start + part) % 12;
}

/** D20 — movable Aries, fixed Sagittarius, dual Leo. */
export function vimsamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 20);
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = 0;
  else if (fixed.includes(sign)) start = 8;
  else start = 4;
  return (start + part) % 12;
}

/** D24 — odd from Leo, even from Cancer. */
export function chaturvimsamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 24);
  const start = isOddSign(sign) ? 4 : 3;
  return (start + part) % 12;
}

/** D27 Nakshatramsa — sequential from same sign. */
export function saptavimsamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  return (sign + partOf(longitude, 27)) % 12;
}

/**
 * D30 Trimsamsa — irregular planet-ruled segments → ruler's sign.
 * Odd: Ma 5°, Sa 5°, Ju 8°, Me 7°, Ve 5°
 * Even: Ve 5°, Me 7°, Ju 8°, Sa 5°, Ma 5°
 */
export function trimsamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const deg = norm360(longitude) % 30;
  if (isOddSign(sign)) {
    if (deg < 5) return 0; // Mars → Aries
    if (deg < 10) return 10; // Saturn → Aquarius
    if (deg < 18) return 8; // Jupiter → Sagittarius
    if (deg < 25) return 2; // Mercury → Gemini
    return 6; // Venus → Libra
  }
  if (deg < 5) return 1; // Venus → Taurus
  if (deg < 12) return 5; // Mercury → Virgo
  if (deg < 20) return 11; // Jupiter → Pisces
  if (deg < 25) return 9; // Saturn → Capricorn
  return 7; // Mars → Scorpio
}

/** D40 — odd from Aries, even from Libra. */
export function khavedamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 40);
  const start = isOddSign(sign) ? 0 : 6;
  return (start + part) % 12;
}

/** D45 — movable Aries, fixed Leo, dual Sagittarius. */
export function akshavedamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  const part = partOf(longitude, 45);
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = 0;
  else if (fixed.includes(sign)) start = 4;
  else start = 8;
  return (start + part) % 12;
}

/** D60 — 0°30′ parts sequential from same sign. */
export function shastiamsaSignIndex(longitude: number): number {
  const sign = Math.floor(norm360(longitude) / 30);
  return (sign + partOf(longitude, 60)) % 12;
}

const MAPPERS: Record<VargaCode, (lon: number) => number> = {
  D1: rashiSignIndex,
  D2: horaSignIndex,
  D3: drekkanaSignIndex,
  D4: chaturthamsaSignIndex,
  D7: saptamsaSignIndex,
  D9: navamsaSignIndex,
  D10: dashamsaSignIndex,
  D12: dwadasamsaSignIndex,
  D16: shodasamsaSignIndex,
  D20: vimsamsaSignIndex,
  D24: chaturvimsamsaSignIndex,
  D27: saptavimsamsaSignIndex,
  D30: trimsamsaSignIndex,
  D40: khavedamsaSignIndex,
  D45: akshavedamsaSignIndex,
  D60: shastiamsaSignIndex,
};

const SEGMENTS: Record<VargaCode, number> = {
  D1: 30,
  D2: 15,
  D3: 10,
  D4: 7.5,
  D7: 30 / 7,
  D9: 10 / 3,
  D10: 3,
  D12: 2.5,
  D16: 30 / 16,
  D20: 1.5,
  D24: 30 / 24,
  D27: 30 / 27,
  D30: 1, // irregular; degree display approx
  D40: 30 / 40,
  D45: 30 / 45,
  D60: 0.5,
};

function vargaDegreeFromSeg(lon: number, segmentDeg: number): number {
  if (segmentDeg <= 0) return degreeInSign(lon);
  const inSign = norm360(lon) % 30;
  const within = inSign % segmentDeg;
  return (within / segmentDeg) * 30;
}

export function computeDivisionalChart(
  code: VargaCode,
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
): DivisionalChart {
  const mapper = MAPPERS[code];
  const meta = NAMES[code];
  const lagnaSign = mapper(lagnaLon);
  const seg = SEGMENTS[code];
  return {
    code,
    name: { en: meta.en, hi: meta.hi },
    purpose: meta.purpose,
    lagna: {
      signIndex: lagnaSign,
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      lord: { en: SIGN_LORDS[lagnaSign].en, hi: SIGN_LORDS[lagnaSign].hi },
      vargaDegree: vargaDegreeFromSeg(lagnaLon, seg),
    },
    planets: planets.map((p) => {
      const signIndex = mapper(p.longitude);
      const nak = nakshatraFromLongitude(p.longitude);
      return {
        id: p.id,
        name: p.name,
        longitude: p.longitude,
        signIndex,
        sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
        lord: { en: SIGN_LORDS[signIndex].en, hi: SIGN_LORDS[signIndex].hi },
        degreeInSign: degreeInSign(p.longitude),
        vargaDegree: vargaDegreeFromSeg(p.longitude, seg),
        vargottama: signIndex === signIndexFromLongitude(p.longitude),
        nakshatra: nak.name,
        pada: nak.pada,
      };
    }),
  };
}

export function computeAllVargas(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
): Record<VargaCode, DivisionalChart> {
  const codes = Object.keys(MAPPERS) as VargaCode[];
  const out = {} as Record<VargaCode, DivisionalChart>;
  for (const code of codes) {
    out[code] = computeDivisionalChart(code, planets, lagnaLon);
  }
  return out;
}

export function computeNavamsaChart(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
) {
  return computeDivisionalChart("D9", planets, lagnaLon);
}

export function computeDashamsaChart(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
) {
  return computeDivisionalChart("D10", planets, lagnaLon);
}

/** @deprecated Use computeNavamsaChart */
export { computeNavamsaChart as computeNavamsa };
