/**
 * Jaimini special points: Arudha Lagna, Upapada, Atmakaraka, Karakamsha.
 */
import { SIGN_LORDS, SIGNS } from "./constants";
import type { PlanetPosition } from "./types";
import { computeAllVargas } from "./vargas";

function jaiminiLordId(signIndex: number, planets: PlanetPosition[]): string {
  const deg = (id: string) => planets.find((p) => p.id === id)?.degreeInSign;
  if (signIndex === 7) {
    const mars = deg("mars");
    const ketu = deg("ketu");
    if (mars != null && ketu != null && ketu > mars) return "ketu";
    return "mars";
  }
  if (signIndex === 10) {
    const sat = deg("saturn");
    const rahu = deg("rahu");
    if (sat != null && rahu != null && rahu > sat) return "rahu";
    return "saturn";
  }
  return SIGN_LORDS[signIndex].en.toLowerCase();
}

export function calculateArudhaPada(
  houseSignIndex: number,
  planets: PlanetPosition[]
): number {
  const lord = jaiminiLordId(houseSignIndex, planets);
  const lordPos = planets.find((p) => p.id === lord);
  const lordSign = lordPos?.signIndex ?? houseSignIndex;
  const distance = (((lordSign - houseSignIndex) % 12) + 12) % 12;
  const raw = (lordSign + distance) % 12;
  const offset = (((raw - houseSignIndex) % 12) + 12) % 12;
  if (offset === 0) return (houseSignIndex + 9) % 12;
  if (offset === 6) return (houseSignIndex + 3) % 12;
  return raw;
}

export function calculateArudhaLagna(
  ascSignIndex: number,
  planets: PlanetPosition[]
): number {
  return calculateArudhaPada(ascSignIndex, planets);
}

export function calculateUpapadaLagna(
  ascSignIndex: number,
  planets: PlanetPosition[]
): number {
  return calculateArudhaPada((ascSignIndex + 11) % 12, planets);
}

const AK_CANDIDATES = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

export function calculateAtmakaraka(
  planets: PlanetPosition[]
): { id: string; name: { en: string; hi: string }; degreeInSign: number } | null {
  let best: PlanetPosition | null = null;
  for (const id of AK_CANDIDATES) {
    const p = planets.find((x) => x.id === id);
    if (!p) continue;
    if (!best || p.degreeInSign > best.degreeInSign) best = p;
  }
  if (!best) return null;
  return { id: best.id, name: best.name, degreeInSign: best.degreeInSign };
}

export type JaiminiPoints = {
  arudhaLagna: { signIndex: number; sign: { en: string; hi: string } };
  upapadaLagna: { signIndex: number; sign: { en: string; hi: string } };
  atmakaraka: {
    id: string;
    name: { en: string; hi: string };
    degreeInSign: number;
  } | null;
  /** Sign of Atmakaraka in D9 (Karakamsha). */
  karakamsha: { signIndex: number; sign: { en: string; hi: string } } | null;
};

export function computeJaiminiPoints(
  lagnaSignIndex: number,
  planets: PlanetPosition[],
  lagnaLon: number
): JaiminiPoints {
  const al = calculateArudhaLagna(lagnaSignIndex, planets);
  const ul = calculateUpapadaLagna(lagnaSignIndex, planets);
  const ak = calculateAtmakaraka(planets);

  let karakamsha: JaiminiPoints["karakamsha"] = null;
  if (ak) {
    const vargas = computeAllVargas(planets, lagnaLon);
    const d9 = vargas.D9;
    const akD9 = d9?.planets?.find((p) => p.id === ak.id);
    if (akD9) {
      karakamsha = {
        signIndex: akD9.signIndex,
        sign: { en: SIGNS[akD9.signIndex].en, hi: SIGNS[akD9.signIndex].hi },
      };
    }
  }

  return {
    arudhaLagna: {
      signIndex: al,
      sign: { en: SIGNS[al].en, hi: SIGNS[al].hi },
    },
    upapadaLagna: {
      signIndex: ul,
      sign: { en: SIGNS[ul].en, hi: SIGNS[ul].hi },
    },
    atmakaraka: ak,
    karakamsha,
  };
}
