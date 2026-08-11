import { SIGN_LORDS, SIGNS } from "./constants";
import { dateToJulianDay, norm360, signIndexFromLongitude } from "./math";
import * as Astronomy from "astronomy-engine";

export type HouseCuspSet = {
  system: "placidus" | "sripati";
  /** Sidereal ecliptic longitude of cusps 1..12 (index 0 = house 1). */
  cusps: number[];
  ascendant: number;
  mc: number;
};

function obliquityRad(date: Date): number {
  const T = (dateToJulianDay(date) - 2451545.0) / 36525.0;
  const obliquity =
    23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  return (obliquity * Math.PI) / 180;
}

export function localSiderealDegrees(date: Date, lon: number): number {
  const time = Astronomy.MakeTime(date);
  const gast = Astronomy.SiderealTime(time);
  return norm360((gast + lon / 15) * 15);
}

export function tropicalMC(ramcDeg: number, eps: number): number {
  const ramc = (ramcDeg * Math.PI) / 180;
  const y = Math.sin(ramc);
  const x = Math.cos(ramc) * Math.cos(eps);
  return norm360((Math.atan2(y, x) * 180) / Math.PI);
}

export function tropicalAscendant(
  ramcDeg: number,
  lat: number,
  eps: number
): number {
  const theta = (ramcDeg * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const y = Math.cos(theta);
  const x = -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return norm360((Math.atan2(y, x) * 180) / Math.PI);
}

/**
 * Sripati / Porphyry Bhav Chalit cusps — standard in Indian Kundli software.
 * House midpoints from Asc & MC; cusps = midpoints between madhyas.
 */
export function computeSripatiCusps(
  date: Date,
  lat: number,
  lon: number,
  ayanamsa: number
): HouseCuspSet {
  const ramc = localSiderealDegrees(date, lon);
  const eps = obliquityRad(date);
  const asc = norm360(tropicalAscendant(ramc, lat, eps) - ayanamsa);
  const mc = norm360(tropicalMC(ramc, eps) - ayanamsa);

  const madhya = new Array<number>(12);
  madhya[0] = asc;
  madhya[9] = mc;
  madhya[3] = norm360(asc + 180);
  madhya[6] = norm360(mc + 180);

  const arcMC_Asc = norm360(asc - mc);
  madhya[10] = norm360(mc + arcMC_Asc / 3);
  madhya[11] = norm360(mc + (2 * arcMC_Asc) / 3);

  const arcAsc_IC = norm360(madhya[3] - asc);
  madhya[1] = norm360(asc + arcAsc_IC / 3);
  madhya[2] = norm360(asc + (2 * arcAsc_IC) / 3);

  const arcIC_DSC = norm360(madhya[6] - madhya[3]);
  madhya[4] = norm360(madhya[3] + arcIC_DSC / 3);
  madhya[5] = norm360(madhya[3] + (2 * arcIC_DSC) / 3);

  const arcDSC_MC = norm360(madhya[9] - madhya[6]);
  madhya[7] = norm360(madhya[6] + arcDSC_MC / 3);
  madhya[8] = norm360(madhya[6] + (2 * arcDSC_MC) / 3);

  const cusps = madhya.map((m, i) => {
    const prev = madhya[(i + 11) % 12];
    return norm360(prev + norm360(m - prev) / 2);
  });

  return { system: "sripati", cusps, ascendant: asc, mc };
}

/** Placidus house cusp 11/12/2/3 in tropical ecliptic longitude. */
function placidusHouseCusp(
  ramc: number,
  lat: number,
  eps: number,
  house: 2 | 3 | 11 | 12
): number {
  const latR = (lat * Math.PI) / 180;
  let lon = norm360(ramc + ({ 11: 30, 12: 60, 2: 120, 3: 150 } as const)[house]);

  for (let iter = 0; iter < 25; iter++) {
    const lonR = (lon * Math.PI) / 180;
    const decl = Math.asin(Math.sin(eps) * Math.sin(lonR));
    let cosHA = -Math.tan(latR) * Math.tan(decl);
    cosHA = Math.max(-0.999999, Math.min(0.999999, cosHA));
    const haDeg = (Math.acos(cosHA) * 180) / Math.PI;

    let desiredRA: number;
    if (house === 11) desiredRA = norm360(ramc + haDeg / 3);
    else if (house === 12) desiredRA = norm360(ramc + (2 * haDeg) / 3);
    else if (house === 2) desiredRA = norm360(ramc + 180 - (2 * haDeg) / 3);
    else desiredRA = norm360(ramc + 180 - haDeg / 3);

    const raR = (desiredRA * Math.PI) / 180;
    const y = Math.sin(raR) * Math.cos(eps) + Math.tan(decl) * Math.sin(eps);
    const x = Math.cos(raR);
    const next = norm360((Math.atan2(y, x) * 180) / Math.PI);
    const delta = Math.abs(((next - lon + 540) % 360) - 180);
    lon = next;
    if (delta < 0.0005) break;
  }
  return lon;
}

/** Placidus cusps for KP — Asc/MC angular, Placidus intermediates. */
export function computePlacidusCusps(
  date: Date,
  lat: number,
  lon: number,
  ayanamsa: number
): HouseCuspSet {
  const ramc = localSiderealDegrees(date, lon);
  const eps = obliquityRad(date);
  const asc = norm360(tropicalAscendant(ramc, lat, eps) - ayanamsa);
  const mc = norm360(tropicalMC(ramc, eps) - ayanamsa);
  const cusps = new Array<number>(12);

  cusps[0] = asc;
  cusps[9] = mc;
  cusps[6] = norm360(asc + 180);
  cusps[3] = norm360(mc + 180);

  if (Math.abs(lat) >= 66) {
    // Polar: fall back to Sripati intermediates
    return { ...computeSripatiCusps(date, lat, lon, ayanamsa), system: "placidus" };
  }

  cusps[10] = norm360(placidusHouseCusp(ramc, lat, eps, 11) - ayanamsa);
  cusps[11] = norm360(placidusHouseCusp(ramc, lat, eps, 12) - ayanamsa);
  cusps[1] = norm360(placidusHouseCusp(ramc, lat, eps, 2) - ayanamsa);
  cusps[2] = norm360(placidusHouseCusp(ramc, lat, eps, 3) - ayanamsa);
  cusps[4] = norm360(cusps[1] + 180);
  cusps[5] = norm360(cusps[2] + 180);
  cusps[7] = norm360(cusps[10] + 180);
  cusps[8] = norm360(cusps[11] + 180);

  return { system: "placidus", cusps, ascendant: asc, mc };
}

export function houseFromCusps(longitude: number, cusps: number[]): number {
  const lon = norm360(longitude);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const span = norm360(b - a);
    const d = norm360(lon - a);
    if (d < span || Math.abs(span) < 1e-9) return i + 1;
  }
  return 1;
}

export function cuspSignMeta(cuspLon: number) {
  const signIndex = signIndexFromLongitude(cuspLon);
  return {
    signIndex,
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    lord: { en: SIGN_LORDS[signIndex].en, hi: SIGN_LORDS[signIndex].hi },
    degree: cuspLon % 30,
    longitude: cuspLon,
  };
}
