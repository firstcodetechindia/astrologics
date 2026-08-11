/**
 * Classical Vedic Graha Drishti (whole-sign aspects).
 * Separate from Western aspect angles.
 */

import type { PlanetPosition } from "./types";

export type GrahaAspect = {
  fromId: string;
  fromName: { en: string; hi: string };
  toHouse: number;
  aspect: number; // 3,4,5,7,8,9,10
  label: { en: string; hi: string };
};

/** Houses aspected from a planet's house (1-based house numbers). */
function aspectOffsets(planetId: string): number[] {
  const id = planetId.toLowerCase();
  // All grahas aspect 7th
  const base = [7];
  if (id === "mars") return [...base, 4, 8];
  if (id === "jupiter") return [...base, 5, 9];
  if (id === "saturn") return [...base, 3, 10];
  // Rahu/Ketu often treated like Jupiter in some schools — we stick to 7th only
  // for clarity (document in UI)
  return base;
}

function houseFrom(planetHouse: number, offset: number): number {
  return ((planetHouse - 1 + (offset - 1)) % 12) + 1;
}

export function computeGrahaDrishti(planets: PlanetPosition[]): GrahaAspect[] {
  const aspects: GrahaAspect[] = [];
  for (const p of planets) {
    if (p.id === "ketu") continue; // Ketu traditionally does not cast full graha drishti
    const offsets = aspectOffsets(p.id);
    for (const asp of offsets) {
      const target = houseFrom(p.house, asp);
      aspects.push({
        fromId: p.id,
        fromName: p.name,
        toHouse: target,
        aspect: asp,
        label: {
          en: `${p.name.en} ${asp}th aspect → House ${target}`,
          hi: `${p.name.hi} ${asp}वीं दृष्टि → भाव ${target}`,
        },
      });
    }
  }
  return aspects;
}

/** Which planets aspect a given house (by Graha Drishti). */
export function aspectsOnHouse(
  aspects: GrahaAspect[],
  house: number
): GrahaAspect[] {
  return aspects.filter((a) => a.toHouse === house);
}
