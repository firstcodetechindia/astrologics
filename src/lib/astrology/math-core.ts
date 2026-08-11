/** Core angle/date helpers with no ephemeris dependency (avoids import cycles). */

/** Normalize degrees to 0–360 */
export function norm360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function dateToJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    (date.getUTCHours() +
      date.getUTCMinutes() / 60 +
      date.getUTCSeconds() / 3600) /
      24;

  let year = y;
  let month = m;
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    d +
    B -
    1524.5
  );
}

export function signIndexFromLongitude(lon: number): number {
  return Math.floor(norm360(lon) / 30);
}

export function degreeInSign(lon: number): number {
  return norm360(lon) % 30;
}

export function toDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/** Shortest signed angular separation (b − a), −180…+180 */
export function angleDelta(a: number, b: number): number {
  let d = norm360(b) - norm360(a);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/** Absolute angular distance 0…180 */
export function angleDistance(a: number, b: number): number {
  return Math.abs(angleDelta(a, b));
}
