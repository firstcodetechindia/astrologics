/**
 * Lal Kitab — practical chart helpers: Pakka Ghar, blind planets, debts, remedies.
 * Deterministic rules adapted for Vedic PlanetPosition houses.
 */
import type { PlanetPosition } from "../types";
import { PLANET_META } from "../constants";

/** Classical Lal Kitab fixed houses for planets (Pakka Ghar). */
const PAKKA_GHAR: Record<string, number> = {
  sun: 1,
  moon: 4,
  mars: 3,
  mercury: 7,
  jupiter: 2,
  venus: 6,
  saturn: 8,
  rahu: 12,
  ketu: 6,
};

export type LalKitabChart = {
  planets: {
    id: string;
    name: { en: string; hi: string };
    house: number;
    pakkaGhar: number;
    inPakkaGhar: boolean;
  }[];
  blindPlanets: { id: string; name: { en: string; hi: string }; reason: { en: string; hi: string } }[];
  debts: { id: string; name: { en: string; hi: string }; present: boolean; note: { en: string; hi: string } }[];
  remedies: { id: string; forPlanet: string; text: { en: string; hi: string } }[];
};

export function createLalKitabChart(planets: PlanetPosition[]): LalKitabChart {
  const rows = planets.map((p) => {
    const pakka = PAKKA_GHAR[p.id] ?? p.house;
    return {
      id: p.id,
      name: p.name,
      house: p.house,
      pakkaGhar: pakka,
      inPakkaGhar: p.house === pakka,
    };
  });

  const blindPlanets = rows
    .filter((p) => ["rahu", "ketu", "saturn"].includes(p.id) && [6, 8, 12].includes(p.house))
    .map((p) => ({
      id: p.id,
      name: p.name,
      reason: {
        en: `${p.name.en} in house ${p.house} can act as a "blind" influence in Lal Kitab analysis.`,
        hi: `लाल किताब में ${p.name.hi} भाव ${p.house} में अंध प्रभाव दे सकता है।`,
      },
    }));

  const sun = rows.find((p) => p.id === "sun");
  const saturn = rows.find((p) => p.id === "saturn");
  const debts = [
    {
      id: "pitri",
      name: { en: "Pitri Rin", hi: "पितृ ऋण" },
      present: Boolean(sun && [9, 1].includes(sun.house) && saturn && saturn.house === 5),
      note: {
        en: "Checked via Sun/Saturn house pattern (simplified Lal Kitab pitri rin screen).",
        hi: "सूर्य/शनि भाव पैटर्न से सरलीकृत पितृ ऋण जाँच।",
      },
    },
    {
      id: "nari",
      name: { en: "Nari Rin", hi: "नारी ऋण" },
      present: Boolean(rows.find((p) => p.id === "venus" && [8, 12].includes(p.house))),
      note: {
        en: "Venus in 8/12 flagged for relationship/debt themes.",
        hi: "शुक्र 8/12 में संबंध/ऋण संकेत।",
      },
    },
  ];

  const remedies = blindPlanets.map((p) => ({
    id: `remedy-${p.id}`,
    forPlanet: p.id,
    text: {
      en: `For ${p.name.en}: keep the related Lal Kitab item clean/donate as advised by your astrologer; do not invent medical claims.`,
      hi: `${p.name.hi} के लिए लाल किताब उपाय ज्योतिषी सलाह से करें।`,
    },
  }));

  // Add generic remedy when Saturn not in pakka
  const sat = rows.find((p) => p.id === "saturn");
  if (sat && !sat.inPakkaGhar) {
    remedies.push({
      id: "saturn-pakka",
      forPlanet: "saturn",
      text: {
        en: "Saturn away from Pakka Ghar (8): emphasize discipline, service, and iron-related charity traditions carefully.",
        hi: "शनि पक्का घर (8) से बाहर: अनुशासन व सेवा पर ध्यान।",
      },
    });
  }

  void PLANET_META;
  return { planets: rows, blindPlanets, debts, remedies };
}
