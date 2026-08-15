/**
 * Chart-placement facts for Observatory detail — SAME functions Kundli uses
 * (getSiderealPlanets, tropicalLongitude, Lahiri ayanamsa, nakshatra).
 * Does not call computeKundli (no houses/yogas/interpretation).
 */
import * as Astronomy from "astronomy-engine";
import { SIGNS } from "./constants";
import { lahiriAyanamsaFromDate } from "./math";
import { degreeInSign, signIndexFromLongitude } from "./math-core";
import { nakshatraFromLongitude } from "./nakshatra";
import { getSiderealPlanets, tropicalLongitude } from "./planets";
import type { ObservatoryBody, ObservatoryBodyId } from "./observatory-ephemeris";

export type ObservatoryChartPlacement = {
  available: boolean;
  vedicGraha: boolean;
  sign: { en: string; hi: string };
  degreeInSign: number;
  longitude: number;
  nakshatra: { en: string; hi: string };
  pada: number;
  isRetrograde: boolean | null;
  note?: { en: string; hi: string };
};

/** Sidereal orbital periods — IAU-class reference constants, not engine output. */
export const ORBITAL_PERIOD_DAYS: Partial<Record<ObservatoryBodyId, number>> = {
  moon: 27.321661,
  mercury: 87.969,
  venus: 224.701,
  earth: 365.256,
  mars: 686.98,
  jupiter: 4332.589,
  saturn: 10759.22,
  uranus: 30685.4,
  neptune: 60189,
};

const OUTER_BODY: Record<"uranus" | "neptune", Astronomy.Body> = {
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
};

export function queryObservatoryChartPlacement(
  date: Date,
  bodyId: ObservatoryBodyId
): ObservatoryChartPlacement {
  const ayanamsa = lahiriAyanamsaFromDate(date);

  if (bodyId === "earth") {
    return {
      available: false,
      vedicGraha: false,
      sign: { en: "—", hi: "—" },
      degreeInSign: 0,
      longitude: 0,
      nakshatra: { en: "—", hi: "—" },
      pada: 0,
      isRetrograde: null,
      note: {
        en: "Earth is the observer in a geocentric chart, not one of the nine grahas.",
        hi: "पृथ्वी जियोसेंट्रिक कुंडली में द्रष्टा है, नौ ग्रहों में नहीं।",
      },
    };
  }

  if (bodyId === "uranus" || bodyId === "neptune") {
    const tropical = tropicalLongitude(OUTER_BODY[bodyId], date);
    const longitude = ((tropical - ayanamsa) % 360 + 360) % 360;
    const nak = nakshatraFromLongitude(longitude);
    const sign = SIGNS[signIndexFromLongitude(longitude)];
    return {
      available: true,
      vedicGraha: false,
      sign: { en: sign.en, hi: sign.hi },
      degreeInSign: degreeInSign(longitude),
      longitude,
      nakshatra: nak.name,
      pada: nak.pada,
      isRetrograde: null,
      note: {
        en: "Not a classical Vedic graha. Sign/nakshatra use the same Lahiri subtraction as Kundli; Uranus/Neptune are omitted from the nine-graha chart.",
        hi: "शास्त्रीय वैदिक ग्रह नहीं। राशि/नक्षत्र कुंडली वाला लाहिरी घटाव है; अरुण-वरुण नौ-ग्रह कुंडली में नहीं आते।",
      },
    };
  }

  const { planets } = getSiderealPlanets(date, ayanamsa);
  const p = planets.find((row) => row.id === bodyId);
  if (!p) {
    return {
      available: false,
      vedicGraha: false,
      sign: { en: "—", hi: "—" },
      degreeInSign: 0,
      longitude: 0,
      nakshatra: { en: "—", hi: "—" },
      pada: 0,
      isRetrograde: null,
    };
  }
  const nak = nakshatraFromLongitude(p.longitude);
  const sign = SIGNS[signIndexFromLongitude(p.longitude)];
  return {
    available: true,
    vedicGraha: true,
    sign: { en: sign.en, hi: sign.hi },
    degreeInSign: degreeInSign(p.longitude),
    longitude: p.longitude,
    nakshatra: nak.name,
    pada: nak.pada,
    isRetrograde: bodyId === "sun" || bodyId === "moon" ? null : p.isRetrograde,
  };
}

export function formatAu(distanceAu: number, hi: boolean) {
  if (distanceAu <= 0) return hi ? "केंद्र" : "at origin";
  if (distanceAu < 0.01) return `${(distanceAu * 149597870.7).toFixed(0)} km`;
  return `${distanceAu.toFixed(3)} AU`;
}

export function bodyById(
  bodies: ObservatoryBody[],
  id: ObservatoryBodyId
): ObservatoryBody | undefined {
  return bodies.find((b) => b.id === id);
}
