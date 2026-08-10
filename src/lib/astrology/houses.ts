import { HOUSE_THEMES, SIGN_LORDS, SIGNS } from "./constants";
import { signIndexFromLongitude } from "./math";
import type { HouseInfo } from "./types";

/** Whole-sign houses from Lagna (standard for many Vedic readings) */
export function buildHouses(lagnaLongitude: number): HouseInfo[] {
  const lagnaSign = signIndexFromLongitude(lagnaLongitude);
  return Array.from({ length: 12 }, (_, i) => {
    const signIndex = (lagnaSign + i) % 12;
    return {
      number: i + 1,
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      lord: {
        en: SIGN_LORDS[signIndex].en,
        hi: SIGN_LORDS[signIndex].hi,
      },
      summary: {
        en: HOUSE_THEMES[i].en,
        hi: HOUSE_THEMES[i].hi,
      },
    };
  });
}

export function houseOfPlanet(
  planetLon: number,
  lagnaLon: number
): number {
  const pSign = signIndexFromLongitude(planetLon);
  const lSign = signIndexFromLongitude(lagnaLon);
  return ((pSign - lSign + 12) % 12) + 1;
}
