import { SIGNS, SIGN_LORDS } from "./constants";
import { degreeInSign, norm360, signIndexFromLongitude } from "./math";
import { nakshatraFromLongitude } from "./nakshatra";

/** Navamsa (D9): each 3°20' segment maps to a sign. */
export function navamsaSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const part = Math.floor((lon % 30) / (30 / 9)); // 0-8
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(sign)) start = sign;
  else if (fixed.includes(sign)) start = (sign + 8) % 12;
  else start = (sign + 4) % 12; // dual
  return (start + part) % 12;
}

export function computeNavamsaChart(
  planets: { id: string; name: { en: string; hi: string }; longitude: number }[],
  lagnaLon: number
) {
  const lagnaD9 = navamsaSignIndex(lagnaLon);
  const positions = planets.map((p) => {
    const si = navamsaSignIndex(p.longitude);
    const nak = nakshatraFromLongitude(p.longitude);
    return {
      id: p.id,
      name: p.name,
      signIndex: si,
      sign: { en: SIGNS[si].en, hi: SIGNS[si].hi },
      lord: SIGN_LORDS[si],
      vargottama: si === signIndexFromLongitude(p.longitude),
      nakshatra: nak.name,
      pada: nak.pada,
      degreeInSign: degreeInSign(p.longitude),
    };
  });
  return {
    lagna: {
      signIndex: lagnaD9,
      sign: { en: SIGNS[lagnaD9].en, hi: SIGNS[lagnaD9].hi },
      lord: SIGN_LORDS[lagnaD9],
    },
    planets: positions,
  };
}
