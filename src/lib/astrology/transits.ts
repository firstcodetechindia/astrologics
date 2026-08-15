/**
 * Deterministic transit engine — positions from the same ephemeris pipeline.
 * AI must only interpret these values, never invent them.
 *
 * Ashtakvarga overlay (when natal context is passed): unreduced SAV of the
 * occupied house-from-Lagna plus Prastara kaksha (3°45′) bindu of the
 * transiting graha. Shodhana is not used for transit timing.
 */
import {
  assessTransitKaksha,
  savTransitSupport,
  type KakshaSlice,
} from "./ashtakvarga";
import { SIGNS } from "./constants";
import { houseOfPlanet } from "./houses";
import { lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { getSiderealPlanets } from "./planets";
import type { PlanetPosition } from "./types";

export type TransitAshtakContext = {
  lagnaSignIndex: number;
  planetSigns: Record<string, number>;
  /** Unreduced Sarvashtakvarga, index 0 = house 1 from Lagna. */
  sarva: number[];
};

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
  savBindus?: number;
  savSupport?: boolean;
  kaksha?: KakshaSlice;
  kakshaBindu?: boolean | null;
  ashtakTone?: "supporting" | "challenging" | "mixed" | "no_bav";
};

export type TransitSnapshot = {
  asOf: string;
  ayanamsa: number;
  planets: TransitPlanet[];
};

export function computeTransits(
  asOf: Date,
  natalLagnaLon: number,
  natalMoonLon: number,
  ashtak?: TransitAshtakContext
): TransitSnapshot {
  const ayanamsa = lahiriAyanamsaFromDate(asOf);
  const { planets } = getSiderealPlanets(asOf, ayanamsa);
  return {
    asOf: asOf.toISOString(),
    ayanamsa,
    planets: planets.map((p) => {
      const signIndex = signIndexFromLongitude(p.longitude);
      const degreeInSign = ((p.longitude % 30) + 30) % 30;
      const houseFromLagna = houseOfPlanet(p.longitude, natalLagnaLon);
      const base: TransitPlanet = {
        id: p.id,
        name: p.name,
        absoluteLongitude: p.longitude,
        signIndex,
        sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
        degreeInSign,
        isRetrograde: p.isRetrograde,
        speed: p.speed,
        houseFromLagna,
        houseFromMoon: houseOfPlanet(p.longitude, natalMoonLon),
      };
      if (!ashtak) return base;
      const savBindus = ashtak.sarva[houseFromLagna - 1] ?? 0;
      const note = assessTransitKaksha({
        transitingPlanet: p.id,
        houseFromLagna,
        degreeInSign,
        lagnaSignIndex: ashtak.lagnaSignIndex,
        planetSigns: ashtak.planetSigns,
        savBindus,
      });
      return {
        ...base,
        savBindus: note.savBindus,
        savSupport: note.savSupport,
        kaksha: note.kaksha,
        kakshaBindu: note.kakshaBindu,
        ashtakTone: note.tone,
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
      savBindus: t.savBindus,
      savSupport: t.savSupport ?? (t.savBindus != null ? savTransitSupport(t.savBindus) : undefined),
      kaksha: t.kaksha,
      kakshaBindu: t.kakshaBindu,
    };
  });
}
