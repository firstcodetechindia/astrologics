/**
 * Lahiri / Chitrapaksha ayanamsa.
 *
 * Definition used here (validated against Swiss Ephemeris / Jagannatha Hora
 * published Jan-1 Lahiri tables for 1900–2026):
 *
 *   ayanamsa = (tropical ecliptic longitude of Spica − 180°) + Δ
 *
 * where Δ ≈ +56.47″ aligns Hipparcos-based Spica (astronomy-engine) to the
 * conventional Lahiri zero-point used by SE SIDM_LAHIRI / Indian software.
 * Raw Spica−180 alone (true geometric Chitrapaksha) runs ~57″ behind those tables.
 *
 * Applied exactly ONCE: sidereal = tropical − ayanamsa.
 */
import * as Astronomy from "astronomy-engine";
import { dateToJulianDay, norm360, toDMS } from "./math-core";

/** Hipparcos J2000 Spica (α Vir): RA 13h25m11.5793s, Dec −11°09′40.759″, ~250 ly */
const SPICA_RA_HOURS = 13 + 25 / 60 + 11.5793 / 3600;
const SPICA_DEC_DEG = -(11 + 9 / 60 + 40.759 / 3600);
const SPICA_DIST_LY = 250;

/**
 * Constant offset (degrees) from astronomy-engine Spica−180 to SE/JH Lahiri tables.
 * Empirically ~56.47″ over 1900–2026; residual typically ≤ 2″ on Jan 1 samples.
 */
export const LAHIRI_SE_ALIGNMENT_ARCSEC = 56.47;
const LAHIRI_SE_ALIGNMENT_DEG = LAHIRI_SE_ALIGNMENT_ARCSEC / 3600;

let spicaReady = false;

function ensureSpica() {
  if (spicaReady) return;
  Astronomy.DefineStar(
    Astronomy.Body.Star1,
    SPICA_RA_HOURS,
    SPICA_DEC_DEG,
    SPICA_DIST_LY
  );
  spicaReady = true;
}

/** Geometric Chitrapaksha: tropical Spica − 180° (no SE alignment). */
export function trueChitrapakshaAyanamsa(date: Date): number {
  ensureSpica();
  const time = Astronomy.MakeTime(date);
  // aberration=false matches SE Lahiri tables more closely after alignment
  const ecl = Astronomy.Ecliptic(
    Astronomy.GeoVector(Astronomy.Body.Star1, time, false)
  );
  return norm360(ecl.elon - 180);
}

/**
 * Conventional Lahiri ayanamsa for chart work (SE/JH-aligned Chitrapaksha).
 */
export function lahiriAyanamsaFromDate(date: Date): number {
  return trueChitrapakshaAyanamsa(date) + LAHIRI_SE_ALIGNMENT_DEG;
}

/**
 * Approximate offset Lahiri → Krishnamurti (KP New) ayanamsa (~5′48″).
 * SE SIDM_KRISHNAMURTI runs slightly behind Lahiri in the modern era.
 */
export const KP_FROM_LAHIRI_OFFSET_ARCSEC = 5 * 60 + 48;
const KP_FROM_LAHIRI_OFFSET_DEG = KP_FROM_LAHIRI_OFFSET_ARCSEC / 3600;

/**
 * Krishnamurti (KP New) ayanamsa ≈ Lahiri − 5′48″.
 * Used so KP tables are not silently identical to Parashari Lahiri.
 */
export function kpAyanamsaFromDate(date: Date): number {
  return lahiriAyanamsaFromDate(date) - KP_FROM_LAHIRI_OFFSET_DEG;
}

/** Convert a Lahiri sidereal longitude to KP New sidereal longitude. */
export function lahiriLonToKp(lahiriLon: number): number {
  return norm360(lahiriLon + KP_FROM_LAHIRI_OFFSET_DEG);
}

/** Fallback polynomial (IAE-style) if star vector ever fails — not primary path. */
export function lahiriAyanamsaPolynomialFallback(date: Date): number {
  const jd = dateToJulianDay(date);
  const T = (jd - 2415020.0) / 36525.0;
  return 22.460148 + 1.396042 * T + 0.00003086 * T * T;
}

export function formatAyanamsa(deg: number): string {
  return toDMS(deg);
}
