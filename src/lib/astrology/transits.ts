/**
 * Deterministic transit engine — positions from the same ephemeris pipeline.
 * AI must only interpret these values, never invent them.
 */
import { SIGNS } from "./constants";
import { houseOfPlanet } from "./houses";
import { lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { getSiderealPlanets } from "./planets";
import type { PlanetPosition } from "./types";

export type TransitPlanet = {
  id: string;
  name: { en: string; hi: string };
  absoluteLongitude: number;
  signIndex: number;
  sign: { en: string; hi: string };
  degreeInSign: number;
  isRetrograde: boolean;
  speed: number;
  houseFromLagna: number;
  houseFromMoon: number;
};

export type TransitSnapshot = {
  asOf: string;
  ayanamsa: number;
  planets: TransitPlanet[];
};

export function computeTransits(
  asOf: Date,
  natalLagnaLon: number,
  natalMoonLon: number
): TransitSnapshot {
  const ayanamsa = lahiriAyanamsaFromDate(asOf);
  const { planets } = getSiderealPlanets(asOf, ayanamsa);
  return {
    asOf: asOf.toISOString(),
    ayanamsa,
    planets: planets.map((p) => {
      const signIndex = signIndexFromLongitude(p.longitude);
      return {
        id: p.id,
        name: p.name,
        absoluteLongitude: p.longitude,
        signIndex,
        sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
        degreeInSign: ((p.longitude % 30) + 30) % 30,
        isRetrograde: p.isRetrograde,
        speed: p.speed,
        houseFromLagna: houseOfPlanet(p.longitude, natalLagnaLon),
        houseFromMoon: houseOfPlanet(p.longitude, natalMoonLon),
      };
    }),
  };
}

/** Relative summary: which natal planets are being transited by sign. */
export function transitVsNatal(
  transits: TransitSnapshot,
  natal: PlanetPosition[]
) {
  return transits.planets.map((t) => {
    const natalSameSign = natal.filter((n) => n.signIndex === t.signIndex);
    return {
      transitPlanet: t.id,
      transitSign: t.sign,
      natalPlanetsInSign: natalSameSign.map((n) => n.id),
      houseFromLagna: t.houseFromLagna,
      houseFromMoon: t.houseFromMoon,
      isRetrograde: t.isRetrograde,
    };
  });
}
