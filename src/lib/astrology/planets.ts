import * as Astronomy from "astronomy-engine";
import { ASTRO_CONFIG } from "./config";
import { PLANET_META } from "./constants";
import {
  angleDelta,
  dateToJulianDay,
  lahiriAyanamsaFromDate,
  norm360,
} from "./math";

const BODY_MAP: Record<string, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mars: Astronomy.Body.Mars,
  mercury: Astronomy.Body.Mercury,
  jupiter: Astronomy.Body.Jupiter,
  venus: Astronomy.Body.Venus,
  saturn: Astronomy.Body.Saturn,
};

function tropicalLongitude(body: Astronomy.Body, date: Date): number {
  const time = Astronomy.MakeTime(date);
  if (body === Astronomy.Body.Moon) {
    const moon = Astronomy.EclipticGeoMoon(time);
    return norm360(moon.lon);
  }
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return norm360(ecl.elon);
}

/** Mean lunar ascending node (Rahu) — Meeus, tropical. */
export function meanNorthNode(date: Date): number {
  const jd = dateToJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const omega =
    125.04452 -
    1934.136261 * T +
    0.0020708 * T * T +
    (T * T * T) / 450000;
  return norm360(omega);
}

/**
 * True (osculating) lunar ascending node — EXPERIMENTAL.
 * Interpolates between astronomy-engine ascending-node events.
 * Not validated as bit-exact vs Swiss Ephemeris true node; default remains mean.
 */
export function trueNorthNode(date: Date): number {
  const tMs = date.getTime();
  let node = Astronomy.SearchMoonNode(
    Astronomy.MakeTime(new Date(tMs - 40 * 86400_000))
  );
  let prevAsc: { ms: number; lon: number } | null = null;
  let nextAsc: { ms: number; lon: number } | null = null;

  for (let i = 0; i < 8; i++) {
    if (node.kind === Astronomy.NodeEventKind.Ascending) {
      const moon = Astronomy.EclipticGeoMoon(node.time);
      const ms = node.time.date.getTime();
      const row = { ms, lon: norm360(moon.lon) };
      if (ms <= tMs) prevAsc = row;
      if (ms > tMs && !nextAsc) {
        nextAsc = row;
        break;
      }
    }
    node = Astronomy.NextMoonNode(node);
  }

  if (prevAsc && nextAsc) {
    const f = (tMs - prevAsc.ms) / (nextAsc.ms - prevAsc.ms);
    const delta = angleDelta(prevAsc.lon, nextAsc.lon);
    return norm360(prevAsc.lon + delta * f);
  }
  if (prevAsc) return prevAsc.lon;
  if (nextAsc) return nextAsc.lon;
  return meanNorthNode(date);
}

export function northNodeTropical(
  date: Date,
  mode: "mean" | "true" = ASTRO_CONFIG.nodeMode
): number {
  return mode === "true" ? trueNorthNode(date) : meanNorthNode(date);
}

export type RawPlanet = {
  id: string;
  name: { en: string; hi: string };
  longitude: number;
  tropical: number;
  isRetrograde: boolean;
  /** Sidereal longitudinal speed °/day (negative ⇒ retrograde). */
  speed: number;
};

export function getSiderealPlanets(
  date: Date,
  ayanamsa: number,
  nodeMode: "mean" | "true" = ASTRO_CONFIG.nodeMode
) {
  const ids = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
  ] as const;

  const earlier = new Date(date.getTime() - 24 * 3600_000);

  const planets: RawPlanet[] = ids.map((id) => {
    const tropical = tropicalLongitude(BODY_MAP[id], date);
    const tropicalPrev = tropicalLongitude(BODY_MAP[id], earlier);
    const sidereal = norm360(tropical - ayanamsa);
    const speed = angleDelta(tropicalPrev, tropical); // °/day tropical≈sidereal rate
    let isRetrograde = false;
    if (id !== "sun" && id !== "moon") {
      isRetrograde = speed < 0;
    }
    return {
      id,
      name: PLANET_META[id],
      longitude: sidereal,
      tropical,
      isRetrograde,
      speed,
    };
  });

  const rahuTropical = northNodeTropical(date, nodeMode);
  const rahuTropicalPrev = northNodeTropical(earlier, nodeMode);
  const rahu = norm360(rahuTropical - ayanamsa);
  const ketu = norm360(rahu + 180);
  const nodeSpeed = angleDelta(rahuTropicalPrev, rahuTropical);

  planets.push(
    {
      id: "rahu",
      name: PLANET_META.rahu,
      longitude: rahu,
      tropical: rahuTropical,
      isRetrograde: true,
      speed: nodeSpeed,
    },
    {
      id: "ketu",
      name: PLANET_META.ketu,
      longitude: ketu,
      tropical: norm360(rahuTropical + 180),
      isRetrograde: true,
      speed: nodeSpeed,
    }
  );

  return {
    planets,
    ayanamsa: lahiriAyanamsaFromDate(date),
    nodeMode,
  };
}

/**
 * Sidereal ascendant (Lagna) using local sidereal time & obliquity.
 * Returns sidereal ecliptic longitude of Ascendant.
 */
export function calculateLagna(
  date: Date,
  lat: number,
  lon: number,
  ayanamsa: number
): number {
  const time = Astronomy.MakeTime(date);
  const gast = Astronomy.SiderealTime(time); // hours
  const lstHours = gast + lon / 15;
  const lstDeg = norm360(lstHours * 15);

  // Mean obliquity of ecliptic (IAU 2000 approx) for date
  const T = (dateToJulianDay(date) - 2451545.0) / 36525.0;
  const obliquity =
    23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  const eps = (obliquity * Math.PI) / 180;
  const theta = (lstDeg * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;

  const y = Math.cos(theta);
  const x = -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  let ascTropical = (Math.atan2(y, x) * 180) / Math.PI;
  ascTropical = norm360(ascTropical);

  return norm360(ascTropical - ayanamsa);
}
