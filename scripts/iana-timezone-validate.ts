/**
 * Phase 1 validation: IANA historical TZ vs fixed IST (330).
 * Run: npx tsx scripts/iana-timezone-validate.ts
 */
import {
  getIanaOffsetMinutes,
  localCivilToUtc,
  parseBirthDateTime,
  resolveBirthTimeZone,
} from "../src/lib/astrology/timezone";
import { ASTRO_CONFIG } from "../src/lib/astrology/config";
import { SILENT_SETTINGS } from "../src/lib/astrology/silent-settings";
import { computeKundli } from "../src/lib/astrology/compute";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

function fixedIstUtc(y: number, m: number, d: number, hh: number, mm: number) {
  return new Date(Date.UTC(y, m - 1, d, hh, mm, 0) - 330 * 60_000);
}

function main() {
  assert(
    ASTRO_CONFIG.timezoneMode === "iana_historical",
    "ASTRO_CONFIG.timezoneMode is iana_historical"
  );
  assert(SILENT_SETTINGS.length === 5, "five silent settings documented");

  // Pre-standard Kolkata LMT ≈ +05:21:10 → not 330
  const y1900 = localCivilToUtc({
    year: 1900,
    month: 6,
    day: 15,
    hour: 12,
    minute: 0,
    timeZone: "Asia/Kolkata",
  });
  const fixed1900 = fixedIstUtc(1900, 6, 15, 12, 0);
  const delta1900Min = (fixed1900.getTime() - y1900.getTime()) / 60_000;
  console.log(`1900-06-15 12:00 Kolkata: IANA ${y1900.toISOString()} vs fixed IST ${fixed1900.toISOString()} (Δ ${delta1900Min.toFixed(2)} min)`);
  assert(
    Math.abs(Math.abs(delta1900Min) - (330 - (5 * 60 + 21 + 10 / 60))) < 2,
    "1900 Asia/Kolkata differs from fixed IST by ~LMT gap (~8.8 min)"
  );

  // WWII wartime +06:30 in Asia/Kolkata
  const wartime = localCivilToUtc({
    year: 1941,
    month: 10,
    day: 1,
    hour: 12,
    minute: 0,
    timeZone: "Asia/Kolkata",
  });
  const fixedWartime = fixedIstUtc(1941, 10, 1, 12, 0);
  const deltaWar = (fixedWartime.getTime() - wartime.getTime()) / 60_000;
  console.log(
    `1941-10-01 12:00 Kolkata: IANA ${wartime.toISOString()} vs fixed IST ${fixedWartime.toISOString()} (Δ ${deltaWar.toFixed(2)} min)`
  );
  assert(
    Math.abs(deltaWar - 60) < 1,
    "1941 wartime Asia/Kolkata is +06:30 (1h vs fixed IST)"
  );

  // Modern IST: IANA must match fixed 330
  const modern = resolveBirthTimeZone({
    name: "Test",
    date: "1990-08-15",
    time: "10:30",
    place: "Delhi",
    lat: 28.6139,
    lon: 77.209,
    timeZone: "Asia/Kolkata",
  });
  assert(
    Math.abs(modern.offsetMinutes - 330) < 0.01,
    "1990 Delhi offset is +05:30"
  );
  const modernFixed = fixedIstUtc(1990, 8, 15, 10, 30);
  assert(
    Math.abs(modern.instant.getTime() - modernFixed.getTime()) < 1,
    "1990 Delhi IANA matches fixed IST wall time"
  );

  const kundli = computeKundli({
    name: "Phase1",
    date: "1941-10-01",
    time: "12:00",
    place: "Kolkata",
    lat: 22.5726,
    lon: 88.3639,
    timeZone: "Asia/Kolkata",
  });
  assert(
    kundli.settings.timezoneMode === "iana_historical",
    "chart.settings.timezoneMode logged"
  );
  assert(
    kundli.settings.timeZone === "Asia/Kolkata",
    "chart.settings.timeZone logged"
  );
  assert(
    Math.abs(kundli.settings.timezoneOffsetMinutes - 390) < 0.1,
    "1941 chart effective offset ~390 (+06:30)"
  );
  assert(
    kundli.settings.ayanamsaDegrees > 0,
    "ayanamsa degrees logged on chart"
  );
  assert(
    kundli.settings.nodeType === "mean",
    "default node is mean"
  );
  assert(
    kundli.settings.houseSystemByChart.kp === "placidus",
    "KP house system locked to placidus"
  );
  assert(
    kundli.settings.dayBoundary === "sunrise",
    "day boundary locked to sunrise"
  );

  // parseBirthDateTime export path
  const p = parseBirthDateTime({
    name: "x",
    date: "1950-01-01",
    time: "00:00",
    place: "Mumbai",
    lat: 19.076,
    lon: 72.8777,
  });
  assert(!Number.isNaN(p.getTime()), "parseBirthDateTime works without explicit timeZone");

  const off = getIanaOffsetMinutes(new Date("1950-06-15T06:30:00Z"), "Asia/Kolkata");
  assert(Math.abs(off - 330) < 0.01, "1950 sample offset minutes = 330");

  console.log("\nAll Phase 1 IANA / silent-settings checks passed.");
}

main();
