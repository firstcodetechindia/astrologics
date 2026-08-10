import { SIGNS } from "./constants";
import { computeVimshottari } from "./dasha";
import { buildHouses, houseOfPlanet } from "./houses";
import { buildInsights } from "./interpret";
import { degreeInSign, lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { nakshatraFromLongitude } from "./nakshatra";
import { calculateLagna, getSiderealPlanets } from "./planets";
import type { BirthInput, KundliResult, PlanetPosition } from "./types";
import { detectYogas } from "./yogas";

export function parseBirthDateTime(input: BirthInput): Date {
  const [y, m, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const offset = input.timezoneOffsetMinutes ?? 330; // IST default
  // Convert local civil time to UTC
  const utcMs = Date.UTC(y, m - 1, d, hh, mm, 0) - offset * 60 * 1000;
  return new Date(utcMs);
}

export function computeKundli(input: BirthInput): KundliResult {
  const date = parseBirthDateTime(input);
  const ayanamsa = lahiriAyanamsaFromDate(date);
  const { planets: rawPlanets } = getSiderealPlanets(date, ayanamsa);
  const lagnaLon = calculateLagna(date, input.lat, input.lon, ayanamsa);
  const lagnaSign = signIndexFromLongitude(lagnaLon);

  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const nak = nakshatraFromLongitude(p.longitude);
    const signIndex = signIndexFromLongitude(p.longitude);
    return {
      id: p.id,
      name: p.name,
      longitude: p.longitude,
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      degreeInSign: degreeInSign(p.longitude),
      house: houseOfPlanet(p.longitude, lagnaLon),
      nakshatraIndex: nak.index,
      nakshatra: nak.name,
      pada: nak.pada,
    };
  });

  const moon = planets.find((p) => p.id === "moon")!;
  const sun = planets.find((p) => p.id === "sun")!;
  const moonNak = nakshatraFromLongitude(moon.longitude);
  const houses = buildHouses(lagnaLon);
  const dasha = computeVimshottari(moon.longitude, date);
  const yogas = detectYogas(planets, lagnaSign);
  const insights = buildInsights(lagnaSign, planets);

  return {
    input,
    ayanamsa,
    lagna: {
      signIndex: lagnaSign,
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      degree: degreeInSign(lagnaLon),
    },
    moonRashi: {
      en: moon.sign.en,
      hi: moon.sign.hi,
      signIndex: moon.signIndex,
    },
    sunRashi: {
      en: sun.sign.en,
      hi: sun.sign.hi,
      signIndex: sun.signIndex,
    },
    nakshatra: moonNak,
    planets,
    houses,
    yogas,
    dasha,
    insights,
    computedAt: new Date().toISOString(),
  };
}
