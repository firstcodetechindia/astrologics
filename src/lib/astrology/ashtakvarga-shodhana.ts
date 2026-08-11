/**
 * Ashtakavarga Shodhana — Trikona + Ekadhipatya reduction + Shodhya Pinda.
 * Pure additive layer on top of raw computeAshtakvarga().
 */
import type { AshtakvargaResult } from "./ashtakvarga";

export const TRIKONA_GROUPS: readonly (readonly [number, number, number])[] = [
  [0, 4, 8],
  [1, 5, 9],
  [2, 6, 10],
  [3, 7, 11],
];

export const DUAL_LORDSHIP_PAIRS: readonly {
  lord: string;
  signs: readonly [number, number];
}[] = [
  { lord: "mars", signs: [0, 7] },
  { lord: "venus", signs: [1, 6] },
  { lord: "mercury", signs: [2, 5] },
  { lord: "jupiter", signs: [8, 11] },
  { lord: "saturn", signs: [9, 10] },
];

/** Trikona Shodhana on a 12-sign bindu array (index = sign 0–11). */
export function trikonaShodhana(bindus: readonly number[]): number[] {
  const result = [...bindus];
  for (const group of TRIKONA_GROUPS) {
    const values = group.map((i) => bindus[i] ?? 0);
    if (values.some((v) => v === 0)) {
      for (const i of group) result[i] = 0;
    } else {
      const min = Math.min(...values);
      for (const i of group) result[i] = (result[i] ?? 0) - min;
    }
  }
  return result;
}

/**
 * Ekadhipatya: for dual-lordship pairs, reduce vacant/occupied signs.
 * `occupiedSigns` = set of sign indices that have at least one natal planet.
 */
export function ekadhipatyaShodhana(
  bindus: readonly number[],
  occupiedSigns: ReadonlySet<number>
): number[] {
  const result = [...bindus];
  for (const { signs } of DUAL_LORDSHIP_PAIRS) {
    const [a, b] = signs;
    const aOcc = occupiedSigns.has(a);
    const bOcc = occupiedSigns.has(b);
    if (aOcc && !bOcc) result[b] = 0;
    else if (!aOcc && bOcc) result[a] = 0;
    else if (!aOcc && !bOcc) {
      const min = Math.min(result[a] ?? 0, result[b] ?? 0);
      result[a] = (result[a] ?? 0) - min;
      result[b] = (result[b] ?? 0) - min;
    }
    // both occupied: leave as-is (classical both-occupied rule variants differ)
  }
  return result;
}

/** House-indexed (from lagna) → sign-indexed for shodhana, then back. */
function houseToSign(
  byHouse: number[],
  lagnaSign: number
): number[] {
  const bySign = Array.from({ length: 12 }, () => 0);
  for (let h = 0; h < 12; h++) {
    const sign = (lagnaSign + h) % 12;
    bySign[sign] = byHouse[h] ?? 0;
  }
  return bySign;
}

function signToHouse(bySign: number[], lagnaSign: number): number[] {
  return Array.from({ length: 12 }, (_, h) => {
    const sign = (lagnaSign + h) % 12;
    return bySign[sign] ?? 0;
  });
}

export type AshtakvargaShodhanaResult = AshtakvargaResult & {
  shodhana: {
    bhinna: Record<string, number[]>;
    sarva: number[];
    total: number;
  };
};

export function applyAshtakvargaShodhana(
  raw: AshtakvargaResult,
  opts: {
    lagnaSignIndex: number;
    /** Planet id → sign index */
    planetSigns: Record<string, number>;
  }
): AshtakvargaShodhanaResult {
  const occupied = new Set<number>(Object.values(opts.planetSigns));
  const bhinnaReduced: Record<string, number[]> = {};
  const sarva = Array.from({ length: 12 }, () => 0);

  for (const [planet, byHouse] of Object.entries(raw.bhinna)) {
    const bySign = houseToSign(byHouse, opts.lagnaSignIndex);
    const afterTri = trikonaShodhana(bySign);
    const afterEka = ekadhipatyaShodhana(afterTri, occupied);
    const reducedHouse = signToHouse(afterEka, opts.lagnaSignIndex);
    bhinnaReduced[planet] = reducedHouse;
    for (let i = 0; i < 12; i++) sarva[i] += reducedHouse[i];
  }

  const total = sarva.reduce((a, b) => a + b, 0);
  return {
    ...raw,
    shodhana: { bhinna: bhinnaReduced, sarva, total },
  };
}
