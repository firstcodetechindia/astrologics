/**
 * Jaimini Chara Dasha — sign-based periods from Lagna.
 */
import { SIGN_LORDS, SIGNS } from "./constants";
import type { PlanetPosition } from "./types";

const MS_YEAR = 365.25 * 86400_000;

export type CharaPeriod = {
  signIndex: number;
  sign: { en: string; hi: string };
  lord: { en: string; hi: string };
  years: number;
  start: string;
  end: string;
  isCurrent?: boolean;
};

function jaiminiLord(
  signIndex: number,
  planets: PlanetPosition[]
): { id: string; name: { en: string; hi: string } } {
  const deg = (id: string) =>
    planets.find((p) => p.id === id)?.degreeInSign;

  if (signIndex === 7) {
    // Scorpio: Mars vs Ketu
    const mars = deg("mars");
    const ketu = deg("ketu");
    if (mars != null && ketu != null && ketu > mars) {
      return { id: "ketu", name: { en: "Ketu", hi: "केतु" } };
    }
    return { id: "mars", name: SIGN_LORDS[7] };
  }
  if (signIndex === 10) {
    // Aquarius: Saturn vs Rahu
    const sat = deg("saturn");
    const rahu = deg("rahu");
    if (sat != null && rahu != null && rahu > sat) {
      return { id: "rahu", name: { en: "Rahu", hi: "राहु" } };
    }
    return { id: "saturn", name: SIGN_LORDS[10] };
  }
  return {
    id: SIGN_LORDS[signIndex].en.toLowerCase(),
    name: SIGN_LORDS[signIndex],
  };
}

function forwardDist(from: number, to: number): number {
  const d = ((to - from) % 12 + 12) % 12;
  return d === 0 ? 12 : d;
}

function backwardDist(from: number, to: number): number {
  const d = ((from - to) % 12 + 12) % 12;
  return d === 0 ? 12 : d;
}

/** Years for a sign dasha = distance of lord from sign (odd forward / even backward) − 1, min 1. */
function charaYears(
  signIndex: number,
  planets: PlanetPosition[]
): number {
  const lord = jaiminiLord(signIndex, planets);
  const lordPlanet = planets.find((p) => p.id === lord.id);
  const lordSign = lordPlanet?.signIndex ?? signIndex;
  const odd = signIndex % 2 === 0; // 0=Aries odd-footed in 0-based even index
  const dist = odd
    ? forwardDist(signIndex, lordSign)
    : backwardDist(signIndex, lordSign);
  return Math.max(1, dist - 1);
}

export function computeCharaDasha(
  lagnaSignIndex: number,
  planets: PlanetPosition[],
  birth: Date,
  asOf: Date = new Date()
): { periods: CharaPeriod[]; current: CharaPeriod | null } {
  const periods: CharaPeriod[] = [];
  let cursor = birth.getTime();
  // Sequence: start from lagna, move forward through signs
  for (let i = 0; i < 12; i++) {
    const signIndex = (lagnaSignIndex + i) % 12;
    const years = charaYears(signIndex, planets);
    const start = new Date(cursor);
    const end = new Date(cursor + years * MS_YEAR);
    const lord = jaiminiLord(signIndex, planets);
    periods.push({
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      lord: lord.name,
      years,
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      isCurrent: asOf >= start && asOf < end,
    });
    cursor = end.getTime();
  }
  return {
    periods,
    current: periods.find((p) => p.isCurrent) ?? null,
  };
}
