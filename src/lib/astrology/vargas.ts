import { SIGNS, SIGN_LORDS } from "./constants";
import { degreeInSign, norm360, signIndexFromLongitude } from "./math";
import { nakshatraFromLongitude } from "./nakshatra";

export type VargaPlanet = {
  id: string;
  name: { en: string; hi: string };
  longitude: number;
  signIndex: number;
  sign: { en: string; hi: string };
  lord: { en: string; hi: string };
  degreeInSign: number;
  /** Degree within the varga sign (0–30), mapped from segment. */
  vargaDegree: number;
  vargottama?: boolean;
  nakshatra: { en: string; hi: string };
  pada: number;
};

export type DivisionalChart = {
  code: "D9" | "D10";
  name: { en: string; hi: string };
  lagna: {
    signIndex: number;
    sign: { en: string; hi: string };
    lord: { en: string; hi: string };
    vargaDegree: number;
  };
  planets: VargaPlanet[];
};

/** Navamsa (D9): each 3°20′ = 10/3° maps to a sign. Parashari. */
export function navamsaSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const NAVAMSA = 10 / 3; // 3°20′ exactly
  const part = Math.min(8, Math.floor((lon % 30) / NAVAMSA)); // 0-8
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = sign;
  else if (fixed.includes(sign)) start = (sign + 8) % 12;
  else start = (sign + 4) % 12; // dual
  return (start + part) % 12;
}

/**
 * Dashamsa (D10): each 3° (30°/10) maps to a sign. Parashari:
 * - Odd signs (Aries=0, Gemini=2, …): count from same sign
 * - Even signs (Taurus=1, …): count from 9th from the sign
 * Does NOT reuse D9 logic.
 */
export function dashamsaSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const part = Math.min(9, Math.floor((lon % 30) / 3)); // 0–9
  const start = sign % 2 === 0 ? sign : (sign + 8) % 12;
  return (start + part) % 12;
}

function vargaDegreeInSegment(lon: number, segmentDeg: number): number {
  const inSign = norm360(lon) % 30;
  const within = inSign % segmentDeg;
  return (within / segmentDeg) * 30;
}

function mapVargaPlanet(
  p: { id: string; name: { en: string; hi: string }; longitude: number },
  signIndex: number,
  segmentDeg: number,
  d1SignIndex: number
): VargaPlanet {
  const nak = nakshatraFromLongitude(p.longitude);
  return {
    id: p.id,
    name: p.name,
    longitude: p.longitude,
    signIndex,
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    lord: { en: SIGN_LORDS[signIndex].en, hi: SIGN_LORDS[signIndex].hi },
    degreeInSign: degreeInSign(p.longitude),
    vargaDegree: vargaDegreeInSegment(p.longitude, segmentDeg),
    vargottama: signIndex === d1SignIndex,
    nakshatra: nak.name,
    pada: nak.pada,
  };
}

export function computeNavamsaChart(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
): DivisionalChart {
  const lagnaD9 = navamsaSignIndex(lagnaLon);
  return {
    code: "D9",
    name: { en: "Navamsa (D9)", hi: "नवमांश (D9)" },
    lagna: {
      signIndex: lagnaD9,
      sign: { en: SIGNS[lagnaD9].en, hi: SIGNS[lagnaD9].hi },
      lord: { en: SIGN_LORDS[lagnaD9].en, hi: SIGN_LORDS[lagnaD9].hi },
      vargaDegree: vargaDegreeInSegment(lagnaLon, 10 / 3),
    },
    planets: planets.map((p) =>
      mapVargaPlanet(
        p,
        navamsaSignIndex(p.longitude),
        10 / 3,
        signIndexFromLongitude(p.longitude)
      )
    ),
  };
}

export function computeDashamsaChart(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
): DivisionalChart {
  const lagnaD10 = dashamsaSignIndex(lagnaLon);
  return {
    code: "D10",
    name: { en: "Dashamsa (D10)", hi: "दशमांश (D10)" },
    lagna: {
      signIndex: lagnaD10,
      sign: { en: SIGNS[lagnaD10].en, hi: SIGNS[lagnaD10].hi },
      lord: { en: SIGN_LORDS[lagnaD10].en, hi: SIGN_LORDS[lagnaD10].hi },
      vargaDegree: vargaDegreeInSegment(lagnaLon, 3),
    },
    planets: planets.map((p) =>
      mapVargaPlanet(
        p,
        dashamsaSignIndex(p.longitude),
        3,
        signIndexFromLongitude(p.longitude)
      )
    ),
  };
}

/** @deprecated Use computeNavamsaChart — kept for import compatibility */
export { computeNavamsaChart as computeNavamsa };
