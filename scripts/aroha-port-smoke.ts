/**
 * Smoke validation for Aroha-port modules (1C engine depth).
 * Run: npx tsx scripts/aroha-port-smoke.ts
 */
import { computeKundli } from "../src/lib/astrology/compute";
import { synthesizeMoonSignForecast } from "../src/lib/astrology/live-horoscope";
import { fullMatchReport } from "../src/lib/astrology/matching";
import { rectifyBirthTime } from "../src/lib/astrology/rectification";

const birth = {
  name: "Test User",
  date: "1992-08-15",
  time: "10:30",
  place: "Mumbai",
  lat: 19.076,
  lon: 72.8777,
  timezoneOffsetMinutes: 330,
  ayanamsa: "lahiri" as const,
  houseSystem: "whole_sign" as const,
};

const k = computeKundli(birth);
console.assert(k.shadbala, "shadbala");
console.assert(k.charaDasha, "chara");
console.assert(k.jaimini, "jaimini");
console.assert(k.varshphal, "varshphal");
console.assert(k.lalkitab, "lalkitab");
console.assert(
  (k.ashtakvarga as { shodhana?: unknown })?.shodhana,
  "ashtak shodhana"
);

const live = synthesizeMoonSignForecast(0, "daily");
console.assert(live.scores.overall > 0, "live horoscope");

const match = fullMatchReport(k.nakshatra.index, (k.nakshatra.index + 5) % 27);
console.assert(match.dashakoota.total === 10, "dashakoota");

const rect = rectifyBirthTime(
  birth,
  [
    { date: "2015-06-01", domain: "job_started" },
    { date: "2018-11-12", domain: "marriage" },
    { date: "2021-03-20", domain: "childbirth" },
  ],
  { windowMinutes: 20, stepMinutes: 5 }
);
console.assert(rect.best.time, "rectify");

console.log("aroha-port-smoke: OK", {
  lagna: k.lagna.sign.en,
  shadbalaTop: (k.shadbala as { strongest?: string }).strongest,
  liveOverall: live.scores.overall,
  dashakoota: match.dashakoota.total,
  rect: rect.best.time,
});
