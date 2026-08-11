/**
 * Classical Vedic sign dignity (exaltation / debilitation / own / moolatrikona)
 * and combustion by angular distance from the Sun.
 * Deterministic — not AI. Uses SIDEREAL sign indices.
 */

import { angleDistance } from "./math";

export type DignityKind =
  | "exalted"
  | "debilitated"
  | "own"
  | "moolatrikona"
  | "friendly"
  | "enemy"
  | "neutral";

export type Dignity = {
  kind: DignityKind;
  label: { en: string; hi: string };
  exalted: boolean;
  debilitated: boolean;
  ownSign: boolean;
  moolatrikona: boolean;
};

/** Exaltation sign index (0=Aries … 11=Pisces). */
const EXALT: Record<string, { sign: number; degree: number }> = {
  sun: { sign: 0, degree: 10 },
  moon: { sign: 1, degree: 3 },
  mars: { sign: 9, degree: 28 },
  mercury: { sign: 5, degree: 15 },
  jupiter: { sign: 3, degree: 5 },
  venus: { sign: 11, degree: 27 },
  saturn: { sign: 6, degree: 20 },
};

const DEBIL: Record<string, number> = {
  sun: 6,
  moon: 7,
  mars: 3,
  mercury: 11,
  jupiter: 9,
  venus: 5,
  saturn: 0,
};

const OWN: Record<string, number[]> = {
  sun: [4],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
};

const MOOLATRIKONA: Record<string, number> = {
  sun: 4,
  moon: 1,
  mars: 0,
  mercury: 5,
  jupiter: 8,
  venus: 6,
  saturn: 10,
};

/** Permanent friends of each planet (for temporary friendship ignore). */
const FRIENDS: Record<string, number[]> = {
  // sign lords that are friends — by planet id mapped via signs they own
  sun: [0, 7, 8, 11], // Mars, Jupiter signs (simplified: friendly signs)
  moon: [1, 2, 5],
  mars: [0, 3, 4, 8, 11],
  mercury: [1, 4, 6],
  jupiter: [0, 3, 4, 7],
  venus: [2, 5, 9, 10],
  saturn: [1, 2, 5, 6],
};

const ENEMIES: Record<string, number[]> = {
  sun: [1, 6], // Venus signs
  moon: [],
  mars: [2, 5],
  mercury: [3],
  jupiter: [2, 5, 1, 6],
  venus: [3, 4],
  saturn: [0, 3, 4, 7],
};

const LABELS: Record<DignityKind, { en: string; hi: string }> = {
  exalted: { en: "Exalted", hi: "उच्च" },
  debilitated: { en: "Debilitated", hi: "नीच" },
  own: { en: "Own sign", hi: "स्वराशि" },
  moolatrikona: { en: "Moolatrikona", hi: "मूलत्रिकोण" },
  friendly: { en: "Friendly sign", hi: "मित्र राशि" },
  enemy: { en: "Enemy sign", hi: "शत्रु राशि" },
  neutral: { en: "Neutral", hi: "सामान्य" },
};

export function planetDignity(
  planetId: string,
  signIndex: number
): Dignity {
  const id = planetId.toLowerCase();
  const base = {
    exalted: false,
    debilitated: false,
    ownSign: false,
    moolatrikona: false,
  };
  if (id === "rahu" || id === "ketu") {
    return { kind: "neutral", label: LABELS.neutral, ...base };
  }
  if (EXALT[id]?.sign === signIndex) {
    return {
      kind: "exalted",
      label: LABELS.exalted,
      ...base,
      exalted: true,
    };
  }
  if (DEBIL[id] === signIndex) {
    return {
      kind: "debilitated",
      label: LABELS.debilitated,
      ...base,
      debilitated: true,
    };
  }
  if (MOOLATRIKONA[id] === signIndex) {
    return {
      kind: "moolatrikona",
      label: LABELS.moolatrikona,
      ...base,
      moolatrikona: true,
      ownSign: OWN[id]?.includes(signIndex) ?? false,
    };
  }
  if (OWN[id]?.includes(signIndex)) {
    return { kind: "own", label: LABELS.own, ...base, ownSign: true };
  }
  if (FRIENDS[id]?.includes(signIndex)) {
    return { kind: "friendly", label: LABELS.friendly, ...base };
  }
  if (ENEMIES[id]?.includes(signIndex)) {
    return { kind: "enemy", label: LABELS.enemy, ...base };
  }
  return { kind: "neutral", label: LABELS.neutral, ...base };
}

/**
 * Classical combustion orbs (degrees of elongation from Sun).
 * Same sign alone is NOT enough.
 */
export const COMBUST_ORB: Record<string, number> = {
  moon: 12,
  mars: 17,
  mercury: 14,
  jupiter: 11,
  venus: 10,
  saturn: 15,
};

export function combustionInfo(
  planetId: string,
  planetLon: number,
  sunLon: number
): { isCombust: boolean; combustionDistance: number; orb: number | null } {
  const id = planetId.toLowerCase();
  const distance = angleDistance(planetLon, sunLon);
  if (id === "sun" || id === "rahu" || id === "ketu") {
    return { isCombust: false, combustionDistance: distance, orb: null };
  }
  const orb = COMBUST_ORB[id] ?? null;
  if (orb == null) {
    return { isCombust: false, combustionDistance: distance, orb: null };
  }
  return {
    isCombust: distance <= orb,
    combustionDistance: distance,
    orb,
  };
}

export function isCombust(
  planetId: string,
  planetLon: number,
  sunLon: number
): boolean {
  return combustionInfo(planetId, planetLon, sunLon).isCombust;
}
