import * as Astronomy from "astronomy-engine";
import { PLANET_META } from "./constants";
import { dateToJulianDay, lahiriAyanamsaFromDate, norm360 } from "./math";

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

/** Mean lunar node (Rahu) tropical longitude */
export function meanNorthNode(date: Date): number {
  const jd = dateToJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  // Meeus formula for mean longitude of ascending node
  const omega =
    125.04452 -
    1934.136261 * T +
    0.0020708 * T * T +
    (T * T * T) / 450000;
  return norm360(omega);
}

export function getSiderealPlanets(date: Date, ayanamsa: number) {
  const ids = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
  ] as const;

  type PlanetRow = {
    id: string;
    name: { en: string; hi: string };
    longitude: number;
    tropical: number;
  };

  const planets: PlanetRow[] = ids.map((id) => {
    const tropical = tropicalLongitude(BODY_MAP[id], date);
    const sidereal = norm360(tropical - ayanamsa);
    return {
      id,
      name: PLANET_META[id],
      longitude: sidereal,
      tropical,
    };
  });

  const rahuTropical = meanNorthNode(date);
  const rahu = norm360(rahuTropical - ayanamsa);
  const ketu = norm360(rahu + 180);

  planets.push(
    { id: "rahu", name: PLANET_META.rahu, longitude: rahu, tropical: rahuTropical },
    {
      id: "ketu",
      name: PLANET_META.ketu,
      longitude: ketu,
      tropical: norm360(rahuTropical + 180),
    }
  );

  return { planets, ayanamsa: lahiriAyanamsaFromDate(date) };
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

  const obliquity = 23.4392911; // mean obliquity approx
  const eps = (obliquity * Math.PI) / 180;
  const theta = (lstDeg * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;

  // Ascendant formula
  const y = Math.cos(theta);
  const x = -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  let ascTropical = (Math.atan2(y, x) * 180) / Math.PI;
  ascTropical = norm360(ascTropical);

  return norm360(ascTropical - ayanamsa);
}
