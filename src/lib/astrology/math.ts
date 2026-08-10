/** Normalize degrees to 0–360 */
export function norm360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

/** Lahiri ayanamsa approximation (degrees) */
export function lahiriAyanamsaFromDate(date: Date): number {
  const jd = dateToJulianDay(date);
  const t = (jd - 2451545.0) / 365.25;
  // Lahiri at J2000 ≈ 23.85°; annual precession ≈ 50.29"
  return 23.85 + (50.29 / 3600) * t;
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
