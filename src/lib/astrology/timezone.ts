/**
 * IANA timezone helpers — historical offsets at the birth instant via
 * runtime Intl / OS tzdata (not a fixed modern civil offset).
 */
import type { BirthInput } from "./types";

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

/** Prefer India IST zone when coords look Indian even if offset missing. */
export function timeZoneForPlace(opts: {
  lat?: number;
  lon?: number;
  offsetMinutes?: number;
  timeZone?: string;
}): string {
  if (opts.timeZone && opts.timeZone.trim()) return opts.timeZone.trim();
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

/** Parse Intl timeZoneName like GMT+05:30 / GMT+05:21:10 → minutes (float). */
export function parseGmtOffsetToMinutes(name: string): number | null {
  const m = name.match(
    /(?:GMT|UTC)([+-])(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?/i
  );
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const h = Number(m[2]);
  const mi = Number(m[3] || 0);
  const s = Number(m[4] || 0);
  return sign * (h * 60 + mi + s / 60);
}

/**
 * Civil UTC offset (minutes east of UTC) that IANA assigns to `timeZone`
 * at the given instant.
 */
export function getIanaOffsetMinutes(date: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const parsed = parseGmtOffsetToMinutes(name);
    if (parsed != null && Number.isFinite(parsed)) return parsed;
  } catch {
    /* fall through */
  }
  return 330;
}

/**
 * Convert a local civil wall-clock at `timeZone` to a UTC Date, using the
 * IANA offset that applied on that calendar date (iterates for DST edges).
 */
export function localCivilToUtc(opts: {
  year: number;
  month: number; // 1–12
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  timeZone: string;
}): Date {
  const hh = opts.hour ?? 0;
  const mm = opts.minute ?? 0;
  const ss = opts.second ?? 0;
  const asIfUtc = Date.UTC(
    opts.year,
    opts.month - 1,
    opts.day,
    hh,
    mm,
    ss
  );

  let utcMs = asIfUtc;
  for (let i = 0; i < 4; i++) {
    const offMin = getIanaOffsetMinutes(new Date(utcMs), opts.timeZone);
    const next = asIfUtc - offMin * 60_000;
    if (Math.abs(next - utcMs) < 0.5) {
      utcMs = next;
      break;
    }
    utcMs = next;
  }
  return new Date(utcMs);
}

/** Local weekday 0=Sun … 6=Sat using civil offset east of UTC. */
export function weekdayFromOffset(date: Date, offsetMinutes = 330): number {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  return shifted.getUTCDay();
}

/** Local weekday using IANA zone at the instant. */
export function weekdayInTimeZone(date: Date, timeZone: string): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[wd] ?? weekdayFromOffset(date, getIanaOffsetMinutes(date, timeZone));
}

/** Resolve IANA zone + effective offset for a birth input. */
export function resolveBirthTimeZone(input: BirthInput): {
  timeZone: string;
  offsetMinutes: number;
  instant: Date;
} {
  const [y, m, d] = input.date.split("-").map(Number);
  const parts = input.time.split(":").map(Number);
  const hh = parts[0] ?? 0;
  const mm = parts[1] ?? 0;
  const ss = parts[2] ?? 0;

  const timeZone = timeZoneForPlace({
    lat: input.lat,
    lon: input.lon,
    offsetMinutes: input.timezoneOffsetMinutes,
    timeZone: input.timeZone,
  });

  try {
    const instant = localCivilToUtc({
      year: y,
      month: m,
      day: d,
      hour: hh,
      minute: mm,
      second: ss,
      timeZone,
    });
    const offsetMinutes = getIanaOffsetMinutes(instant, timeZone);
    return { timeZone, offsetMinutes, instant };
  } catch {
    const offset = input.timezoneOffsetMinutes ?? 330;
    const utcMs = Date.UTC(y, m - 1, d, hh, mm, ss) - offset * 60 * 1000;
    return {
      timeZone,
      offsetMinutes: offset,
      instant: new Date(utcMs),
    };
  }
}

export function parseBirthDateTime(input: BirthInput): Date {
  return resolveBirthTimeZone(input).instant;
}
