/**
 * Classical Bhinnashtakvarga / Sarvashtakvarga (BPHS bindu tables).
 * Houses 1–12 counted from each of 8 kakshyas (7 planets + Lagna).
 */
import { PLANET_META, SIGNS } from "./constants";

const PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
] as const;

type PlanetId = (typeof PLANETS)[number];

/**
 * For contributor P, from each kakshya, which houses (1–12) receive a bindu.
 * Source: standard BPHS Ashtakvarga tables used by Indian software.
 */
const ASHTAK_TABLES: Record<PlanetId, Record<string, number[]>> = {
  sun: {
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [3, 5, 6, 9, 10, 11, 12],
    jupiter: [5, 6, 9, 11],
    venus: [6, 7, 12],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [3, 4, 6, 10, 11, 12],
  },
  moon: {
    sun: [3, 6, 7, 8, 10, 11],
    moon: [1, 3, 6, 7, 10, 11],
    mars: [2, 3, 5, 6, 9, 10, 11],
    mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    jupiter: [1, 4, 7, 8, 10, 11, 12],
    venus: [3, 4, 5, 7, 9, 10, 11],
    saturn: [3, 5, 6, 11],
    lagna: [3, 6, 10, 11],
  },
  mars: {
    sun: [3, 5, 6, 10, 11],
    moon: [3, 6, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [3, 5, 6, 11],
    jupiter: [6, 10, 11, 12],
    venus: [6, 8, 11, 12],
    saturn: [1, 4, 7, 8, 9, 10, 11],
    lagna: [1, 3, 6, 10, 11],
  },
  mercury: {
    sun: [5, 6, 9, 11, 12],
    moon: [2, 4, 6, 8, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    jupiter: [6, 8, 11, 12],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  jupiter: {
    sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    moon: [2, 5, 7, 9, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    venus: [2, 5, 6, 9, 10, 11],
    saturn: [3, 5, 6, 12],
    lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  venus: {
    sun: [8, 11, 12],
    moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    mars: [3, 5, 6, 9, 11, 12],
    mercury: [3, 5, 6, 9, 11],
    jupiter: [5, 8, 9, 10, 11],
    venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    saturn: [3, 4, 5, 8, 9, 10, 11],
    lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  saturn: {
    sun: [1, 2, 4, 7, 8, 10, 11],
    moon: [3, 6, 11],
    mars: [3, 5, 6, 10, 11, 12],
    mercury: [6, 8, 9, 10, 11, 12],
    jupiter: [5, 6, 11, 12],
    venus: [6, 11, 12],
    saturn: [3, 5, 6, 11],
    lagna: [1, 3, 4, 6, 10, 11, 12],
  },
};

export type AshtakvargaResult = {
  /** Bhinnashtakvarga: planet → 12 house bindus (index 0 = house 1) */
  bhinna: Record<string, number[]>;
  /** Sarvashtakvarga: 12 house totals */
  sarva: number[];
  /** Total bindus across chart (typically ~337) */
  total: number;
  houses: {
    number: number;
    bindus: number;
    sign: { en: string; hi: string };
    strength: "strong" | "average" | "weak";
  }[];
};

/**
 * Compute Ashtakvarga from sign indices (0–11) of planets + lagna.
 */
export function computeAshtakvarga(opts: {
  lagnaSignIndex: number;
  /** Map planet id → sign index */
  planetSigns: Record<string, number>;
}): AshtakvargaResult {
  const refs: Record<string, number> = {
    sun: opts.planetSigns.sun,
    moon: opts.planetSigns.moon,
    mars: opts.planetSigns.mars,
    mercury: opts.planetSigns.mercury,
    jupiter: opts.planetSigns.jupiter,
    venus: opts.planetSigns.venus,
    saturn: opts.planetSigns.saturn,
    lagna: opts.lagnaSignIndex,
  };

  const bhinna: Record<string, number[]> = {};
  const sarva = Array.from({ length: 12 }, () => 0);

  for (const contributor of PLANETS) {
    const points = Array.from({ length: 12 }, () => 0);
    const table = ASHTAK_TABLES[contributor];
    for (const [refKey, refSign] of Object.entries(refs)) {
      if (refSign == null || Number.isNaN(refSign)) continue;
      const houses = table[refKey] || [];
      for (const h of houses) {
        // House h from ref → absolute sign
        const targetSign = (refSign + (h - 1)) % 12;
        points[targetSign] += 1;
      }
    }
    // Re-index points by house from Lagna (house 1 = lagna sign)
    const byHouse = Array.from({ length: 12 }, (_, i) => {
      const sign = (opts.lagnaSignIndex + i) % 12;
      return points[sign];
    });
    bhinna[contributor] = byHouse;
    for (let i = 0; i < 12; i++) sarva[i] += byHouse[i];
  }

  const total = sarva.reduce((a, b) => a + b, 0);
  const houses = sarva.map((bindus, i) => {
    const signIndex = (opts.lagnaSignIndex + i) % 12;
    return {
      number: i + 1,
      bindus,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      strength:
        bindus >= 30 ? ("strong" as const) : bindus <= 24 ? ("weak" as const) : ("average" as const),
    };
  });

  return {
    bhinna: Object.fromEntries(
      PLANETS.map((p) => [
        p,
        bhinna[p],
      ])
    ),
    sarva,
    total,
    houses,
  };
}

export function ashtakPlanetLabel(id: string, locale: "en" | "hi") {
  return PLANET_META[id]?.[locale] ?? id;
}

/** 8 kakshas of 3°45′ within each rasi (BPHS transit-timing subdivision). */
export const KAKSHA_SPAN_DEG = 3.75;
export const KAKSHA_LORDS = [
  "saturn",
  "jupiter",
  "mars",
  "sun",
  "venus",
  "mercury",
  "moon",
  "lagna",
] as const;

export function kakshaFromDegreeInSign(degreeInSign: number) {
  const d = ((degreeInSign % 30) + 30) % 30;
  const index = Math.min(7, Math.floor(d / KAKSHA_SPAN_DEG + 1e-12));
  return {
    number: index + 1,
    lord: KAKSHA_LORDS[index],
    startDeg: index * KAKSHA_SPAN_DEG,
    endDeg: (index + 1) * KAKSHA_SPAN_DEG,
  };
}

/** Classical SAV transit threshold: 25+ bindus considered supportive. */
export function savTransitSupport(bindus: number) {
  return bindus >= 25;
}
