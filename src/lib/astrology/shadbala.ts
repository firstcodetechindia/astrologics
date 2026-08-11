/**
 * Classical Shadbala (six-fold strength) — Virupas.
 * Adapted for Vedic PlanetPosition[] (astronomy-engine sidereal).
 * Dig/Kala/Cheshta are practical approximations suitable for product use.
 */
import { SIGN_LORDS } from "./constants";
import type { PlanetPosition } from "./types";

const SHADBALA_IDS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
] as const;

type Pid = (typeof SHADBALA_IDS)[number];

const REQUIRED: Record<Pid, number> = {
  sun: 390,
  moon: 360,
  mars: 300,
  mercury: 420,
  jupiter: 390,
  venus: 330,
  saturn: 300,
};

const NAISARGIKA: Record<Pid, number> = {
  sun: 60,
  moon: 51.43,
  mars: 17.14,
  mercury: 25.71,
  jupiter: 34.29,
  venus: 42.86,
  saturn: 8.57,
};

const DIG_HOUSE: Record<Pid, number> = {
  jupiter: 1,
  mercury: 1,
  sun: 10,
  mars: 10,
  saturn: 7,
  moon: 4,
  venus: 4,
};

const EXALT: Record<Pid, number> = {
  sun: 0,
  moon: 1,
  mars: 9,
  mercury: 5,
  jupiter: 3,
  venus: 11,
  saturn: 6,
};

const DEBIL: Record<Pid, number> = {
  sun: 6,
  moon: 7,
  mars: 3,
  mercury: 11,
  jupiter: 9,
  venus: 5,
  saturn: 0,
};

const OWN: Record<Pid, number[]> = {
  sun: [4],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
};

function digBala(id: Pid, house: number): number {
  const strong = DIG_HOUSE[id];
  const dist = Math.min(
    Math.abs(house - strong),
    12 - Math.abs(house - strong)
  );
  return Math.max(0, 60 - dist * 10);
}

function sthanaBala(id: Pid, p: PlanetPosition): number {
  let v = 7.5;
  if (OWN[id].includes(p.signIndex)) v = 30;
  if (p.signIndex === EXALT[id]) v = 60;
  if (p.signIndex === DEBIL[id]) v = 0;
  if (p.dignity?.moolatrikona) v = Math.max(v, 45);
  return v;
}

function cheshtaBala(p: PlanetPosition): number {
  if (p.isRetrograde) return 60;
  const speed = Math.abs(p.speed ?? 0);
  if (speed > 1) return 45;
  if (speed > 0.5) return 30;
  return 15;
}

function kalaBala(date: Date, id: Pid): number {
  const hour = date.getUTCHours();
  const dayPlanet: Pid[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
  const weekday = date.getUTCDay();
  const lord = dayPlanet[weekday]!;
  let v = id === lord ? 45 : 15;
  const isDay = hour >= 6 && hour < 18;
  if (isDay && (id === "sun" || id === "jupiter" || id === "mars")) v += 15;
  if (!isDay && (id === "moon" || id === "venus" || id === "saturn")) v += 15;
  return Math.min(60, v);
}

function drikBala(planets: PlanetPosition[], id: Pid): number {
  const target = planets.find((p) => p.id === id);
  if (!target) return 0;
  let score = 30;
  for (const other of planets) {
    if (other.id === id || other.id === "rahu" || other.id === "ketu") continue;
    const houseDiff =
      ((other.house - target.house + 12) % 12) + 1;
    // Benefic aspect-ish: 5,7,9 from Jupiter/Venus/Mercury
    const benefic = ["jupiter", "venus", "mercury", "moon"].includes(other.id);
    if ([5, 7, 9].includes(houseDiff) && benefic) score += 8;
    if ([6, 8].includes(houseDiff) && ["mars", "saturn", "sun"].includes(other.id))
      score -= 8;
  }
  return Math.max(0, Math.min(60, score));
}

export type PlanetShadbala = {
  id: string;
  name: { en: string; hi: string };
  sthana: number;
  dig: number;
  kala: number;
  cheshta: number;
  naisargika: number;
  drik: number;
  totalVirupas: number;
  rupas: number;
  required: number;
  isStrong: boolean;
};

export function computeShadbala(
  planets: PlanetPosition[],
  date: Date
): { planets: PlanetShadbala[]; strongest: string | null } {
  const rows: PlanetShadbala[] = [];
  for (const id of SHADBALA_IDS) {
    const p = planets.find((x) => x.id === id);
    if (!p) continue;
    const sthana = sthanaBala(id, p);
    const dig = digBala(id, p.house);
    const kala = kalaBala(date, id);
    const cheshta = cheshtaBala(p);
    const naisargika = NAISARGIKA[id];
    const drik = drikBala(planets, id);
    const total = sthana + dig + kala + cheshta + naisargika + drik;
    rows.push({
      id,
      name: p.name,
      sthana: round1(sthana),
      dig: round1(dig),
      kala: round1(kala),
      cheshta: round1(cheshta),
      naisargika: round1(naisargika),
      drik: round1(drik),
      totalVirupas: round1(total),
      rupas: round1(total / 60),
      required: REQUIRED[id],
      isStrong: total >= REQUIRED[id],
    });
  }
  rows.sort((a, b) => b.totalVirupas - a.totalVirupas);
  return { planets: rows, strongest: rows[0]?.id ?? null };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** House lord strength helper used by rectification scoring. */
export function houseLordId(signIndex: number): string {
  const lord = SIGN_LORDS[signIndex]?.en.toLowerCase() ?? "mars";
  const map: Record<string, string> = {
    mars: "mars",
    venus: "venus",
    mercury: "mercury",
    moon: "moon",
    sun: "sun",
    jupiter: "jupiter",
    saturn: "saturn",
  };
  return map[lord] ?? "mars";
}
