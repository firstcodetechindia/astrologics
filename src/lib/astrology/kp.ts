import { NAKSHATRAS, NAKSHATRA_SPAN, SIGNS } from "./constants";
import { lahiriAyanamsaFromDate, norm360, signIndexFromLongitude } from "./math";
import { nakshatraFromLongitude } from "./nakshatra";
import { calculateLagna, getSiderealPlanets } from "./planets";

/** KP uses finer ayanamsa; we approximate with Lahiri for free tools. */
const SUB_LORDS = [
  "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury",
] as const;

const SUB_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17] as const;
const SUB_TOTAL = 120;

export function kpSubLord(longitude: number) {
  const lon = norm360(longitude);
  const nak = nakshatraFromLongitude(lon);
  const posInNak = lon % NAKSHATRA_SPAN;
  // Vimshottari proportional subs within nakshatra
  let acc = 0;
  const startLordIdx = NAKSHATRAS[nak.index].lord.en.toLowerCase();
  const lordKey =
    startLordIdx === "ketu"
      ? "ketu"
      : startLordIdx === "venus"
        ? "venus"
        : startLordIdx === "sun"
          ? "sun"
          : startLordIdx === "moon"
            ? "moon"
            : startLordIdx === "mars"
              ? "mars"
              : startLordIdx === "rahu"
                ? "rahu"
                : startLordIdx === "jupiter"
                  ? "jupiter"
                  : startLordIdx === "saturn"
                    ? "saturn"
                    : "mercury";
  let idx = SUB_LORDS.indexOf(lordKey as (typeof SUB_LORDS)[number]);
  if (idx < 0) idx = 0;

  for (let i = 0; i < 9; i++) {
    const li = (idx + i) % 9;
    const span = (SUB_YEARS[li] / SUB_TOTAL) * NAKSHATRA_SPAN;
    if (posInNak < acc + span) {
      return {
        signIndex: signIndexFromLongitude(lon),
        sign: SIGNS[signIndexFromLongitude(lon)],
        starLord: NAKSHATRAS[nak.index].lord,
        nakshatra: nak.name,
        subLord: {
          en: SUB_LORDS[li].charAt(0).toUpperCase() + SUB_LORDS[li].slice(1),
          hi: NAKSHATRAS.find((n) => n.lord.en.toLowerCase() === SUB_LORDS[li])?.lord.hi || SUB_LORDS[li],
        },
      };
    }
    acc += span;
  }
  return {
    signIndex: signIndexFromLongitude(lon),
    sign: SIGNS[signIndexFromLongitude(lon)],
    starLord: NAKSHATRAS[nak.index].lord,
    nakshatra: nak.name,
    subLord: { en: "Mercury", hi: "बुध" },
  };
}

/** Horary number 1–249 → KP sign/star/sub (each number = 360/249 deg). */
export function kpHorary(number: number) {
  const n = Math.min(249, Math.max(1, Math.floor(number)));
  const lon = ((n - 1) + 0.5) * (360 / 249);
  return { number: n, longitude: lon, ...kpSubLord(lon) };
}

export function kpRulingPlanetsNow(asOf = new Date(), lat = 28.61, lon = 77.21) {
  const ayanamsa = lahiriAyanamsaFromDate(asOf);
  const { planets } = getSiderealPlanets(asOf, ayanamsa);
  const moon = planets.find((p) => p.id === "moon")!;
  const lagnaLon = calculateLagna(asOf, lat, lon, ayanamsa);
  const weekday = asOf.getUTCDay(); // 0 Sun
  const dayLords = [
    { en: "Sun", hi: "सूर्य" },
    { en: "Moon", hi: "चंद्र" },
    { en: "Mars", hi: "मंगल" },
    { en: "Mercury", hi: "बुध" },
    { en: "Jupiter", hi: "गुरु" },
    { en: "Venus", hi: "शुक्र" },
    { en: "Saturn", hi: "शनि" },
  ];
  return {
    asOf: asOf.toISOString(),
    dayLord: dayLords[weekday],
    moon: kpSubLord(moon.longitude),
    ascendant: kpSubLord(lagnaLon),
    ayanamsa,
  };
}

export function moonPhase(date: Date) {
  const ayanamsa = lahiriAyanamsaFromDate(date);
  const { planets } = getSiderealPlanets(date, ayanamsa);
  const sun = planets.find((p) => p.id === "sun")!;
  const moon = planets.find((p) => p.id === "moon")!;
  const elong = norm360(moon.longitude - sun.longitude);
  const illumination = (1 - Math.cos((elong * Math.PI) / 180)) / 2;
  let phase: { en: string; hi: string };
  if (elong < 22.5 || elong >= 337.5) phase = { en: "New Moon", hi: "अमावस्या" };
  else if (elong < 67.5) phase = { en: "Waxing Crescent", hi: "शुक्ल पक्ष अर्ध" };
  else if (elong < 112.5) phase = { en: "First Quarter", hi: "शुक्ल अष्टमी" };
  else if (elong < 157.5) phase = { en: "Waxing Gibbous", hi: "शुक्ल पक्ष पूर्णिमा की ओर" };
  else if (elong < 202.5) phase = { en: "Full Moon", hi: "पूर्णिमा" };
  else if (elong < 247.5) phase = { en: "Waning Gibbous", hi: "कृष्ण पक्ष" };
  else if (elong < 292.5) phase = { en: "Last Quarter", hi: "कृष्ण अष्टमी" };
  else phase = { en: "Waning Crescent", hi: "कृष्ण पक्ष अमावस्या की ओर" };

  return {
    elongation: elong,
    illumination: Math.round(illumination * 100),
    phase,
    date: date.toISOString(),
  };
}
