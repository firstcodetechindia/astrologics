/**
 * Regression tests for Vedic calculation consistency.
 * Run: npx tsx scripts/astrology-regression.ts
 */
import { computeKundli } from "../src/lib/astrology/compute";
import { lahiriAyanamsaFromDate, norm360 } from "../src/lib/astrology/math";
import { nakshatraFromLongitude } from "../src/lib/astrology/nakshatra";
import {
  dashamsaSignIndex,
  navamsaSignIndex,
} from "../src/lib/astrology/vargas";
import { SIGN_LORDS } from "../src/lib/astrology/constants";

type Case = {
  name: string;
  date: string;
  time: string;
  place: string;
  lat: number;
  lon: number;
  timezoneOffsetMinutes: number;
};

const CASES: Case[] = [
  { name: "Delhi dawn", date: "1990-05-15", time: "06:30", place: "New Delhi", lat: 28.6139, lon: 77.209, timezoneOffsetMinutes: 330 },
  { name: "Mumbai night", date: "1985-12-01", time: "23:45", place: "Mumbai", lat: 19.076, lon: 72.8777, timezoneOffsetMinutes: 330 },
  { name: "London midnight", date: "2000-01-01", time: "00:00", place: "London", lat: 51.5074, lon: -0.1278, timezoneOffsetMinutes: 0 },
  { name: "NYC afternoon", date: "1978-08-20", time: "14:20", place: "New York", lat: 40.7128, lon: -74.006, timezoneOffsetMinutes: -240 },
  { name: "Varanasi noon", date: "1995-03-21", time: "12:00", place: "Varanasi", lat: 25.3176, lon: 82.9739, timezoneOffsetMinutes: 330 },
  { name: "Sydney", date: "1988-07-04", time: "09:15", place: "Sydney", lat: -33.8688, lon: 151.2093, timezoneOffsetMinutes: 600 },
  { name: "Tokyo", date: "2001-09-11", time: "08:00", place: "Tokyo", lat: 35.6762, lon: 139.6503, timezoneOffsetMinutes: 540 },
  { name: "Dubai", date: "1992-11-30", time: "18:40", place: "Dubai", lat: 25.2048, lon: 55.2708, timezoneOffsetMinutes: 240 },
  { name: "Chicago DST", date: "2010-06-15", time: "03:30", place: "Chicago", lat: 41.8781, lon: -87.6298, timezoneOffsetMinutes: -300 },
  { name: "Historical 1955", date: "1955-02-14", time: "10:10", place: "Kolkata", lat: 22.5726, lon: 88.3639, timezoneOffsetMinutes: 330 },
  { name: "Near 0 Aries tropical", date: "2024-03-20", time: "12:00", place: "Delhi", lat: 28.61, lon: 77.21, timezoneOffsetMinutes: 330 },
  { name: "Late night", date: "1999-12-31", time: "23:59", place: "Pune", lat: 18.5204, lon: 73.8567, timezoneOffsetMinutes: 330 },
  { name: "Libra lagna try", date: "1980-04-10", time: "16:00", place: "Jaipur", lat: 26.9124, lon: 75.7873, timezoneOffsetMinutes: 330 },
  { name: "Sag try", date: "1975-01-05", time: "05:00", place: "Chennai", lat: 13.0827, lon: 80.2707, timezoneOffsetMinutes: 330 },
  { name: "Cap try", date: "1968-10-22", time: "07:45", place: "Ahmedabad", lat: 23.0225, lon: 72.5714, timezoneOffsetMinutes: 330 },
  { name: "Aqu try", date: "2005-06-01", time: "22:10", place: "Bangalore", lat: 12.9716, lon: 77.5946, timezoneOffsetMinutes: 330 },
  { name: "Pisces try", date: "1993-08-08", time: "01:20", place: "Hyderabad", lat: 17.385, lon: 78.4867, timezoneOffsetMinutes: 330 },
  { name: "Scorpio try", date: "1982-02-28", time: "11:11", place: "Lucknow", lat: 26.8467, lon: 80.9462, timezoneOffsetMinutes: 330 },
  { name: "Capricorn Delhi", date: "1990-05-15", time: "00:30", place: "Delhi", lat: 28.61, lon: 77.21, timezoneOffsetMinutes: 330 },
  { name: "Aquarius Delhi", date: "1990-05-15", time: "02:00", place: "Delhi", lat: 28.61, lon: 77.21, timezoneOffsetMinutes: 330 },
  { name: "Pisces Delhi", date: "1990-05-15", time: "03:00", place: "Delhi", lat: 28.61, lon: 77.21, timezoneOffsetMinutes: 330 },
  { name: "Sagittarius Delhi", date: "1990-05-15", time: "22:00", place: "Delhi", lat: 28.61, lon: 77.21, timezoneOffsetMinutes: 330 },
];

let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  }
}

// Nakshatra / pada boundaries
for (const lon of [0, 13 + 1 / 3, 26 + 2 / 3, 30, 120, 359.999]) {
  const n = nakshatraFromLongitude(lon);
  assert(n.pada >= 1 && n.pada <= 4, `pada range at ${lon}`);
  assert(n.index >= 0 && n.index < 27, `nak index at ${lon}`);
}

// D9 / D10 segment edges
for (const edge of [0, 3 + 1 / 3, 6 + 2 / 3, 10, 13 + 1 / 3, 20, 26 + 2 / 3, 29.999]) {
  const lon = 30 + edge; // Taurus degrees
  assert(navamsaSignIndex(lon) >= 0 && navamsaSignIndex(lon) < 12, `D9 ${edge}`);
  assert(dashamsaSignIndex(lon) >= 0 && dashamsaSignIndex(lon) < 12, `D10 ${edge}`);
}

// House lords for all 12 lagna
for (let lagna = 0; lagna < 12; lagna++) {
  for (let h = 0; h < 12; h++) {
    const sign = (lagna + h) % 12;
    assert(!!SIGN_LORDS[sign].en, `lord L${lagna} H${h + 1}`);
  }
}

const seenLagna = new Set<number>();

for (const c of CASES) {
  const k = computeKundli({ ...c, name: c.name });
  seenLagna.add(k.lagna.signIndex);

  assert(k.settings.zodiac === "sidereal", `${c.name} zodiac`);
  assert(k.settings.ayanamsa === "lahiri", `${c.name} ayanamsa`);
  assert(k.settings.nodeType === "mean", `${c.name} node label mean`);
  assert(!!k.divisionalCharts?.D9, `${c.name} D9`);
  assert(!!k.divisionalCharts?.D10, `${c.name} D10`);
  assert(!!k.transits, `${c.name} transits`);
  assert(k.planets.length === 9, `${c.name} 9 planets`);

  // Ketu opposite Rahu
  const rahu = k.planets.find((p) => p.id === "rahu")!;
  const ketu = k.planets.find((p) => p.id === "ketu")!;
  const opp = Math.abs(norm360(rahu.longitude + 180) - ketu.longitude);
  assert(opp < 1e-6 || opp > 360 - 1e-6, `${c.name} ketu opposite`);

  for (const p of k.planets) {
    const si = Math.floor(norm360(p.longitude) / 30);
    assert(si === p.signIndex, `${c.name} ${p.id} sign`);
    assert(p.degreeInSign >= 0 && p.degreeInSign < 30, `${c.name} ${p.id} deg`);
    assert(p.house >= 1 && p.house <= 12, `${c.name} ${p.id} house`);
    assert(p.speed != null, `${c.name} ${p.id} speed`);
    assert(p.combustionDistance != null, `${c.name} ${p.id} combust dist`);
    // house matches whole-sign from lagna
    const expectHouse = ((p.signIndex - k.lagna.signIndex + 12) % 12) + 1;
    assert(p.house === expectHouse, `${c.name} ${p.id} house match`);
  }

  // Moon → dasha lord consistency
  const moon = k.planets.find((p) => p.id === "moon")!;
  const nak = nakshatraFromLongitude(moon.longitude);
  assert(nak.index === k.nakshatra.index, `${c.name} moon nak`);
  assert(k.dasha.startLord?.en === nak.lord.en, `${c.name} dasha start lord`);
  assert(k.dasha.balanceYears != null && k.dasha.balanceYears > 0, `${c.name} balance`);
  assert(!!k.dasha.currentMaha && !!k.dasha.currentAntar, `${c.name} current dasha`);

  // Same lagna longitude used for D9
  const d9 = k.divisionalCharts!.D9 as { lagna: { signIndex: number } };
  assert(d9.lagna.signIndex === navamsaSignIndex(k.lagna.longitude), `${c.name} D9 lagna`);

  const ayan = lahiriAyanamsaFromDate(new Date(`${c.date}T00:00:00Z`));
  assert(ayan > 20 && ayan < 28, `${c.name} ayan range ${ayan}`);
}

console.log("Unique Lagna signs covered:", [...seenLagna].sort((a, b) => a - b).join(","));
console.log(failed === 0 ? `OK — ${CASES.length} charts` : `FAILED ${failed}`);
process.exit(failed === 0 ? 0 : 1);
