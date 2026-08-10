/**
 * Resolve an IANA timezone from civil offset / India heuristics.
 * Half-hour zones are special-cased; others use Etc/GMT (whole hours).
 */

export function timeZoneFromOffsetMinutes(offsetMinutes: number): string {
  const off = Number.isFinite(offsetMinutes) ? Math.round(offsetMinutes) : 330;
  switch (off) {
    case 330:
      return "Asia/Kolkata";
    case 345:
      return "Asia/Kathmandu";
    case 360:
      return "Asia/Dhaka";
    case 390:
      return "Asia/Yangon";
    case 420:
      return "Asia/Bangkok";
    case 480:
      return "Asia/Shanghai";
    case 540:
      return "Asia/Tokyo";
    case 0:
      return "UTC";
    case 60:
      return "Europe/Berlin";
    case 120:
      return "Europe/Helsinki";
    case -300:
      return "America/New_York";
    case -360:
      return "America/Chicago";
    case -420:
      return "America/Denver";
    case -480:
      return "America/Los_Angeles";
    case 240:
      return "Asia/Dubai";
    default: {
      const hours = Math.round(off / 60);
      if (hours === 0) return "UTC";
      // Etc/GMT signs are inverted vs UTC offset
      return hours > 0 ? `Etc/GMT-${hours}` : `Etc/GMT+${Math.abs(hours)}`;
    }
  }
}

/** Prefer India IST when coords look Indian even if offset missing. */
export function timeZoneForPlace(opts: {
  lat?: number;
  lon?: number;
  offsetMinutes?: number;
}): string {
  const lat = opts.lat;
  const lon = opts.lon;
  const off = opts.offsetMinutes;
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    (lat as number) > 6 &&
    (lat as number) < 38 &&
    (lon as number) > 68 &&
    (lon as number) < 98
  ) {
    return "Asia/Kolkata";
  }
  return timeZoneFromOffsetMinutes(off ?? 330);
}

/** Local weekday 0=Sun … 6=Sat using civil offset east of UTC. */
export function weekdayFromOffset(date: Date, offsetMinutes = 330): number {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  return shifted.getUTCDay();
}
