/**
 * Tajika Varshphal (annual chart) — solar return approximation on astronomy-engine.
 * Finds the moment Sun returns to natal sidereal longitude in the target year.
 */
import { SIGNS, SIGN_LORDS } from "../constants";
import { degreeInSign, signIndexFromLongitude } from "../math";
import { calculateLagna, getSiderealPlanets } from "../planets";
import { resolveAyanamsa, type AyanamsaId } from "../prefs";
import type { BirthInput, PlanetPosition } from "../types";

function parseBirthDateTime(input: BirthInput): Date {
  const [y, m, d] = input.date.split("-").map(Number);
  const parts = input.time.split(":").map(Number);
  const hh = parts[0] ?? 0;
  const mm = parts[1] ?? 0;
  const ss = parts[2] ?? 0;
  const offset = input.timezoneOffsetMinutes ?? 330;
  const utcMs = Date.UTC(y, m - 1, d, hh, mm, ss) - offset * 60 * 1000;
  return new Date(utcMs);
}

function sunLonAt(date: Date, ayanamsaId: AyanamsaId): number {
  const ayan = resolveAyanamsa(date, ayanamsaId);
  const { planets } = getSiderealPlanets(date, ayan);
  return planets.find((p) => p.id === "sun")?.longitude ?? 0;
}

/** Binary-search solar return within target calendar year (UTC). */
export function findSolarReturn(
  natalSunLon: number,
  birth: Date,
  targetYear: number,
  ayanamsaId: AyanamsaId = "lahiri"
): Date {
  const birthMd = `${String(birth.getUTCMonth() + 1).padStart(2, "0")}-${String(birth.getUTCDate()).padStart(2, "0")}`;
  let lo = new Date(`${targetYear}-${birthMd}T00:00:00Z`).getTime() - 2 * 86400_000;
  let hi = lo + 5 * 86400_000;
  // Expand window if needed
  for (let i = 0; i < 40; i++) {
    const mid = new Date((lo + hi) / 2);
    const lon = sunLonAt(mid, ayanamsaId);
    let diff = ((lon - natalSunLon + 540) % 360) - 180;
    if (Math.abs(diff) < 0.001) return mid;
    if (diff > 0) hi = mid.getTime();
    else lo = mid.getTime();
  }
  return new Date((lo + hi) / 2);
}

export type MunthaResult = {
  signIndex: number;
  sign: { en: string; hi: string };
  houseFromVarshaLagna: number;
};

/** Muntha advances one sign per completed year from natal lagna. */
export function computeMuntha(
  completedYears: number,
  natalAscSign: number,
  varshaAscSign: number
): MunthaResult {
  const signIndex = (natalAscSign + (completedYears % 12)) % 12;
  const houseFromVarshaLagna =
    ((signIndex - varshaAscSign + 12) % 12) + 1;
  return {
    signIndex,
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    houseFromVarshaLagna,
  };
}

export type VarshphalResult = {
  targetYear: number;
  completedYearsOfAge: number;
  solarReturnAt: string;
  varshaLagna: {
    signIndex: number;
    sign: { en: string; hi: string };
    degree: number;
    longitude: number;
  };
  muntha: MunthaResult;
  /** Year lord = strongest among Muntha lord, Asc lord, etc. (simplified). */
  varsheshwara: { id: string; name: { en: string; hi: string } };
  planets: PlanetPosition[];
  sahams: { id: string; name: { en: string; hi: string }; longitude: number; sign: { en: string; hi: string } }[];
};

function norm360(x: number) {
  return ((x % 360) + 360) % 360;
}

export function computeVarshphal(opts: {
  input: BirthInput;
  natalSunLongitude: number;
  natalAscSignIndex: number;
  targetYear?: number;
}): VarshphalResult {
  const birth = parseBirthDateTime(opts.input);
  const targetYear = opts.targetYear ?? new Date().getUTCFullYear();
  const ayanamsaId = opts.input.ayanamsa ?? "lahiri";
  const sr = findSolarReturn(
    opts.natalSunLongitude,
    birth,
    targetYear,
    ayanamsaId
  );
  const ayan = resolveAyanamsa(sr, ayanamsaId);
  const { planets: raw } = getSiderealPlanets(sr, ayan, opts.input.nodeMode);
  const lagnaLon = calculateLagna(sr, opts.input.lat, opts.input.lon, ayan);
  const lagnaSign = signIndexFromLongitude(lagnaLon);
  const completedYears = targetYear - birth.getUTCFullYear();
  const muntha = computeMuntha(
    Math.max(0, completedYears),
    opts.natalAscSignIndex,
    lagnaSign
  );

  const planets: PlanetPosition[] = raw.map((p) => {
    const signIndex = signIndexFromLongitude(p.longitude);
    return {
      id: p.id,
      name: p.name,
      longitude: p.longitude,
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      degreeInSign: degreeInSign(p.longitude),
      house: ((signIndex - lagnaSign + 12) % 12) + 1,
      nakshatraIndex: 0,
      nakshatra: { en: "", hi: "" },
      pada: 1,
      isRetrograde: p.isRetrograde,
      speed: p.speed,
    };
  });

  const munthaLord = SIGN_LORDS[muntha.signIndex];
  const ascLord = SIGN_LORDS[lagnaSign];
  // Simplified Varsheshwara: prefer Muntha lord
  const varsheshwara = {
    id: munthaLord.en.toLowerCase(),
    name: { en: munthaLord.en, hi: munthaLord.hi },
  };

  const sun = planets.find((p) => p.id === "sun")!;
  const moon = planets.find((p) => p.id === "moon")!;
  const dayBirth = sr.getUTCHours() >= 6 && sr.getUTCHours() < 18;
  // Punya Saham (day): Moon - Sun + Asc; night: Sun - Moon + Asc
  const punyaLon = dayBirth
    ? norm360(moon.longitude - sun.longitude + lagnaLon)
    : norm360(sun.longitude - moon.longitude + lagnaLon);
  const mitraLon = norm360(lagnaLon + moon.longitude - sun.longitude);
  const sahamDefs = [
    { id: "punya", name: { en: "Punya Saham", hi: "पुण्य सहाम" }, lon: punyaLon },
    { id: "mitra", name: { en: "Mitra Saham", hi: "मित्र सहाम" }, lon: mitraLon },
  ];
  void ascLord;

  return {
    targetYear,
    completedYearsOfAge: Math.max(0, completedYears),
    solarReturnAt: sr.toISOString(),
    varshaLagna: {
      signIndex: lagnaSign,
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      degree: degreeInSign(lagnaLon),
      longitude: lagnaLon,
    },
    muntha,
    varsheshwara,
    planets,
    sahams: sahamDefs.map((s) => {
      const si = signIndexFromLongitude(s.lon);
      return {
        id: s.id,
        name: s.name,
        longitude: s.lon,
        sign: { en: SIGNS[si].en, hi: SIGNS[si].hi },
      };
    }),
  };
}
