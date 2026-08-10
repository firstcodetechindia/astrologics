/**
 * Full daily Panchang payload — sunrise/sunset, moonrise/moonset,
 * limbs, inauspicious windows, tarabalam, and planetary table.
 */

import * as Astronomy from "astronomy-engine";
import { NAKSHATRAS, SIGNS } from "./constants";
import { computeKundli } from "./compute";
import { degreeInSign, signIndexFromLongitude } from "./math";
import { dailyMuhuratFor } from "./muhurat-now";
import { nakshatraFromLongitude } from "./nakshatra";
import { computePanchang } from "./panchang";
import { calculateLagna, getSiderealPlanets } from "./planets";
import { lahiriAyanamsaFromDate } from "./math";
import type { KundliResult } from "./types";

type Loc = { en: string; hi: string };

const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

/** Daytime 1–8 slot index by weekday (0=Sun). */
const YAMAGANDA_SLOT: Record<number, number> = {
  0: 5,
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 7,
  6: 6,
};
const GULIKA_SLOT: Record<number, number> = {
  0: 7,
  1: 6,
  2: 5,
  3: 4,
  4: 3,
  5: 2,
  6: 1,
};
/** Kaalvela / Ardhayaam daytime slot */
const KAALVELA_SLOT: Record<number, number> = {
  0: 4,
  1: 3,
  2: 2,
  3: 1,
  4: 7,
  5: 6,
  6: 5,
};

const SHAKA_YEAR_NAMES: Loc[] = [
  { en: "Prabhava", hi: "प्रभव" },
  { en: "Vibhava", hi: "विभव" },
  { en: "Shukla", hi: "शुक्ल" },
  { en: "Pramoda", hi: "प्रमोद" },
  { en: "Prajapati", hi: "प्रजापति" },
  { en: "Angirasa", hi: "अंगिरस" },
  { en: "Shrimukha", hi: "श्रीमुख" },
  { en: "Bhava", hi: "भव" },
  { en: "Yuva", hi: "युव" },
  { en: "Dhata", hi: "धाता" },
  { en: "Ishvara", hi: "ईश्वर" },
  { en: "Bahudhanya", hi: "बहुधान्य" },
  { en: "Pramathi", hi: "प्रमाथी" },
  { en: "Vikrama", hi: "विक्रम" },
  { en: "Vrisha", hi: "वृष" },
  { en: "Chitrabhanu", hi: "चित्रभानु" },
  { en: "Svabhanu", hi: "स्वभानु" },
  { en: "Tarana", hi: "तारण" },
  { en: "Parthiva", hi: "पार्थिव" },
  { en: "Vyaya", hi: "व्यय" },
  { en: "Sarvajit", hi: "सर्वजित" },
  { en: "Sarvadhari", hi: "सर्वधारी" },
  { en: "Virodhi", hi: "विरोधी" },
  { en: "Vikriti", hi: "विकृति" },
  { en: "Khara", hi: "खर" },
  { en: "Nandana", hi: "नंदन" },
  { en: "Vijaya", hi: "विजय" },
  { en: "Jaya", hi: "जय" },
  { en: "Manmatha", hi: "मन्मथ" },
  { en: "Durmukhi", hi: "दुर्मुखी" },
  { en: "Hemalambi", hi: "हेमलंबी" },
  { en: "Vilambi", hi: "विलंबी" },
  { en: "Vikari", hi: "विकारी" },
  { en: "Sharvari", hi: "शार्वरी" },
  { en: "Plava", hi: "प्लव" },
  { en: "Shubhakrit", hi: "शुभकृत" },
  { en: "Shobhakrit", hi: "शोभनकृत" },
  { en: "Krodhi", hi: "क्रोधी" },
  { en: "Vishvavasu", hi: "विश्वावसु" },
  { en: "Parabhava", hi: "पराभव" },
  { en: "Plavanga", hi: "प्लवंग" },
  { en: "Kilaka", hi: "कीलक" },
  { en: "Saumya", hi: "सौम्य" },
  { en: "Sadharana", hi: "साधारण" },
  { en: "Virodhikrit", hi: "विरोधकृत" },
  { en: "Paridhavi", hi: "परिधावी" },
  { en: "Pramadi", hi: "प्रमादी" },
  { en: "Ananda", hi: "आनंद" },
  { en: "Rakshasa", hi: "राक्षस" },
  { en: "Nala", hi: "नल" },
  { en: "Pingala", hi: "पिंगल" },
  { en: "Kalayukta", hi: "कालयुक्त" },
  { en: "Siddharthi", hi: "सिद्धार्थी" },
  { en: "Raudra", hi: "रौद्र" },
  { en: "Durmati", hi: "दुर्मति" },
  { en: "Dundubhi", hi: "दुंदुभि" },
  { en: "Rudhirodgari", hi: "रुधिरोद्गारी" },
  { en: "Raktakshi", hi: "रक्ताक्षी" },
  { en: "Krodhana", hi: "क्रोधन" },
  { en: "Akshaya", hi: "अक्षय" },
];

function partsInTz(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    y: Number(map.year),
    m: Number(map.month),
    d: Number(map.day),
    h: Number(map.hour),
    min: Number(map.minute),
    sec: Number(map.second),
    weekday: weekdayMap[map.weekday] ?? 0,
  };
}

function formatHm(date: Date | null, timeZone: string): string {
  if (!date) return "—";
  const p = partsInTz(date, timeZone);
  return `${String(p.h).padStart(2, "0")}:${String(p.min).padStart(2, "0")}`;
}

function formatHmAmPm(date: Date | null, timeZone: string): string {
  if (!date) return "—";
  const p = partsInTz(date, timeZone);
  const h24 = p.h;
  const am = h24 < 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(p.min).padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

/** Local civil noon as UTC Date for a YMD in the given offset (minutes east of UTC). */
export function noonForYmd(ymd: string, tzOffsetMinutes = 330): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0) - tzOffsetMinutes * 60_000);
}

function dayBoundsLocal(ymd: string, timeZone: string, tzOffsetMinutes: number) {
  const noon = noonForYmd(ymd, tzOffsetMinutes);
  // Approximate local midnight → next midnight via noon ± 12h
  const start = new Date(noon.getTime() - 12 * 3600_000);
  const end = new Date(noon.getTime() + 12 * 3600_000);
  void timeZone;
  return { start, end, noon };
}

function searchRiseSet(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  direction: 1 | -1,
  start: Date,
  limitDays: number
): Date | null {
  const r = Astronomy.SearchRiseSet(body, observer, direction, start, limitDays);
  return r ? r.date : null;
}

function sunMoonForDay(
  ymd: string,
  lat: number,
  lon: number,
  timeZone: string,
  tzOffsetMinutes: number
) {
  const { start, noon } = dayBoundsLocal(ymd, timeZone, tzOffsetMinutes);
  const observer = new Astronomy.Observer(lat, lon, 0);

  // Find sunrise closest to this civil day
  let sunrise =
    searchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(start.getTime() - 6 * 3600_000), 2) ??
    null;
  // Prefer sunrise whose local calendar day matches ymd
  if (sunrise) {
    const p = partsInTz(sunrise, timeZone);
    const key = `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
    if (key !== ymd) {
      const alt = searchRiseSet(
        Astronomy.Body.Sun,
        observer,
        +1,
        new Date(sunrise.getTime() + 60_000),
        1.5
      );
      if (alt) {
        const p2 = partsInTz(alt, timeZone);
        const key2 = `${p2.y}-${String(p2.m).padStart(2, "0")}-${String(p2.d).padStart(2, "0")}`;
        if (key2 === ymd) sunrise = alt;
      }
    }
  }

  const sunset = sunrise
    ? searchRiseSet(Astronomy.Body.Sun, observer, -1, sunrise, 1)
    : searchRiseSet(Astronomy.Body.Sun, observer, -1, noon, 1);

  const moonrise =
    searchRiseSet(
      Astronomy.Body.Moon,
      observer,
      +1,
      new Date(start.getTime() - 2 * 3600_000),
      1.5
    ) ?? null;
  let moonriseDay = moonrise;
  if (moonriseDay) {
    const p = partsInTz(moonriseDay, timeZone);
    const key = `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
    if (key !== ymd) {
      const next = searchRiseSet(
        Astronomy.Body.Moon,
        observer,
        +1,
        new Date(moonriseDay.getTime() + 60_000),
        1.2
      );
      if (next) {
        const p2 = partsInTz(next, timeZone);
        const key2 = `${p2.y}-${String(p2.m).padStart(2, "0")}-${String(p2.d).padStart(2, "0")}`;
        moonriseDay = key2 === ymd ? next : null;
      } else moonriseDay = null;
    }
  }

  const moonsetSearchFrom = moonriseDay ?? start;
  let moonset =
    searchRiseSet(Astronomy.Body.Moon, observer, -1, moonsetSearchFrom, 1.5) ??
    null;
  if (moonset) {
    const p = partsInTz(moonset, timeZone);
    const key = `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
    if (key !== ymd) {
      // Moonset may fall on previous/next calendar day — try from day start
      const alt = searchRiseSet(
        Astronomy.Body.Moon,
        observer,
        -1,
        new Date(start.getTime() - 2 * 3600_000),
        1.5
      );
      if (alt) {
        const p2 = partsInTz(alt, timeZone);
        const key2 = `${p2.y}-${String(p2.m).padStart(2, "0")}-${String(p2.d).padStart(2, "0")}`;
        moonset = key2 === ymd ? alt : null;
      } else moonset = null;
    }
  }

  return { sunrise, sunset, moonrise: moonriseDay, moonset, noon };
}

function formatFromTo(
  start: Date,
  end: Date,
  timeZone: string,
  ymd: string
): { from: string; to: string; startHm: string; endHm: string; start: string; end: string } {
  const [yy, mm, dd] = ymd.split("-");
  const short = `${dd}-${mm}-${yy.slice(2)}`;
  const startAmpm = formatHmAmPm(start, timeZone);
  const endAmpm = formatHmAmPm(end, timeZone);
  return {
    from: `${short} ${startAmpm}`,
    to: `${short} ${endAmpm}`,
    start: startAmpm,
    end: endAmpm,
    startHm: formatHm(start, timeZone),
    endHm: formatHm(end, timeZone),
  };
}

function slotWindow(
  sunrise: Date,
  sunset: Date,
  slot1to8: number,
  timeZone: string,
  ymd: string
) {
  const dayMs = Math.max(sunset.getTime() - sunrise.getTime(), 1);
  const slotMs = dayMs / 8;
  const start = new Date(sunrise.getTime() + (slot1to8 - 1) * slotMs);
  const end = new Date(start.getTime() + slotMs);
  return {
    ...formatFromTo(start, end, timeZone, ymd),
    startMs: start.getTime(),
    endMs: end.getTime(),
  };
}

function findLimbEnd(
  from: Date,
  getKey: (d: Date) => number,
  current: number,
  maxHours = 36
): Date | null {
  const endLimit = new Date(from.getTime() + maxHours * 3600_000);
  if (getKey(endLimit) === current) return null;
  let lo = from.getTime();
  let hi = endLimit.getTime();
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (getKey(new Date(mid)) === current) lo = mid;
    else hi = mid;
  }
  return new Date(hi);
}

function tarabalamForMoon(moonNakIndex: number): Loc[] {
  const goodTara = new Set([2, 4, 6, 8, 9]); // Sampat…Parama Mitra
  const out: Loc[] = [];
  for (let i = 0; i < 27; i++) {
    const diff = (moonNakIndex - i + 27) % 27;
    const tara = (diff % 9) + 1;
    if (goodTara.has(tara)) {
      out.push({ en: NAKSHATRAS[i].en, hi: NAKSHATRAS[i].hi });
    }
  }
  return out;
}

function chandrabalamForMoon(moonSignIndex: number): Loc[] {
  // Favourable: 1, 3, 6, 7, 10, 11 from Moon (classical Chandra Bala rashis)
  const favOffsets = [0, 2, 5, 6, 9, 10];
  const signs = favOffsets.map((o) => {
    const i = (moonSignIndex + o) % 12;
    return { en: SIGNS[i].en, hi: SIGNS[i].hi };
  });
  return signs;
}

function formatDms(degInSign: number): string {
  const d = Math.floor(degInSign);
  const mf = (degInSign - d) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${d}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″`;
}

function samvatForYear(gregYear: number) {
  const shaka = gregYear - 78;
  const vikram = gregYear + 57;
  // Anchor: Shaka 1947 (CE 2025–26) = Vishvavasu (index 38)
  const name = SHAKA_YEAR_NAMES[((shaka + 11) % 60 + 60) % 60];
  return {
    shaka: {
      year: shaka,
      name,
      label: { en: `${shaka} ${name.en}`, hi: `${shaka} ${name.hi}` },
    },
    vikram: {
      year: vikram,
      name,
      label: { en: `${vikram} ${name.en}`, hi: `${vikram} ${name.hi}` },
    },
  };
}

export type TodayPanchangResult = ReturnType<typeof computeTodayPanchang>;

export function computeTodayPanchang(opts: {
  date: string; // YYYY-MM-DD
  lat?: number;
  lon?: number;
  place?: string;
  timeZone?: string;
  timezoneOffsetMinutes?: number;
}) {
  const lat = opts.lat ?? DEFAULT_LAT;
  const lon = opts.lon ?? DEFAULT_LON;
  const place = opts.place || "New Delhi, Delhi, India";
  const timeZone = opts.timeZone || "Asia/Kolkata";
  const tzOff = opts.timezoneOffsetMinutes ?? 330;
  const ymd = opts.date;

  const { sunrise, sunset, moonrise, moonset, noon } = sunMoonForDay(
    ymd,
    lat,
    lon,
    timeZone,
    tzOff
  );

  const moment = sunrise ?? noon;
  const panchang = computePanchang(noon);
  const localParts = partsInTz(sunrise ?? noon, timeZone);
  const weekdayNames: Loc[] = [
    { en: "Sunday", hi: "रविवार" },
    { en: "Monday", hi: "सोमवार" },
    { en: "Tuesday", hi: "मंगलवार" },
    { en: "Wednesday", hi: "बुधवार" },
    { en: "Thursday", hi: "गुरुवार" },
    { en: "Friday", hi: "शुक्रवार" },
    { en: "Saturday", hi: "शनिवार" },
  ];
  const weekday = weekdayNames[localParts.weekday];

  // Fix Purnima / Amavasya label
  let tithiName = panchang.tithi.name as Loc;
  if (panchang.tithi.index === 15 || panchang.tithi.index === 30) {
    tithiName =
      panchang.paksha.id === "Shukla"
        ? { en: "Purnima", hi: "पूर्णिमा" }
        : { en: "Amavasya", hi: "अमावस्या" };
  }

  const tithiEnd = findLimbEnd(noon, (d) => {
    const p = computePanchang(d);
    return p.tithi.index;
  }, panchang.tithi.index);

  const nakEnd = findLimbEnd(noon, (d) => {
    const p = computePanchang(d);
    return p.nakshatra.index;
  }, panchang.nakshatra.index);

  const muhurat = dailyMuhuratFor(moment, timeZone, lat, lon);
  const wd = localParts.weekday;
  const sunOk = Boolean(sunrise && sunset);

  const ashubha: {
    id: string;
    name: Loc;
    from: string;
    to: string;
    start: string;
    end: string;
    startHm: string;
    endHm: string;
  }[] = [];

  if (sunOk && sunrise && sunset) {
    const rahuSlot =
      { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 }[wd] ?? 2;
    const add = (id: string, name: Loc, slot: number) => {
      const w = slotWindow(sunrise, sunset, slot, timeZone, ymd);
      ashubha.push({
        id,
        name,
        from: w.from,
        to: w.to,
        start: w.start,
        end: w.end,
        startHm: w.startHm,
        endHm: w.endHm,
      });
    };
    add("kantaka", { en: "Kantaka / Mrityu", hi: "कंटक / मृत्यु" }, rahuSlot);
    add("rahu", { en: "Rahu Kaal", hi: "राहु काल" }, rahuSlot);
    add(
      "kaalvela",
      { en: "Kaalvela / Ardhayaam", hi: "कालवेला / अर्धयाम" },
      KAALVELA_SLOT[wd] ?? 3
    );
    add(
      "yamaghanta",
      { en: "Yamaghanta", hi: "यमघंट" },
      YAMAGANDA_SLOT[wd] ?? 5
    );
    add(
      "yamaganda",
      { en: "Yamaganda", hi: "यमगंड" },
      YAMAGANDA_SLOT[wd] ?? 5
    );
    add(
      "kulika",
      { en: "Kulika Kaal", hi: "कुलिक काल" },
      GULIKA_SLOT[wd] ?? 7
    );
    add(
      "gulika",
      { en: "Gulika Kaal", hi: "गुलिक काल" },
      GULIKA_SLOT[wd] ?? 7
    );
  }

  const moonSignIndex = signIndexFromLongitude(panchang.moonLongitude);
  const tara = tarabalamForMoon(panchang.nakshatra.index);
  const chandra = chandrabalamForMoon(moonSignIndex);

  const kundli: KundliResult = computeKundli({
    name: "Panchang",
    date: ymd,
    time: "12:00",
    place,
    lat,
    lon,
    timezoneOffsetMinutes: tzOff,
  });

  const ayanamsa = lahiriAyanamsaFromDate(noon);
  const { planets: raw } = getSiderealPlanets(noon, ayanamsa);
  const lagnaLon = calculateLagna(noon, lat, lon, ayanamsa);
  const lagnaNak = nakshatraFromLongitude(lagnaLon);
  const lagnaSign = signIndexFromLongitude(lagnaLon);

  const planetRows = [
    {
      id: "asc",
      name: { en: "Ascendant", hi: "लग्न" },
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      longitude: formatDms(degreeInSign(lagnaLon)),
      nakshatra: lagnaNak.name,
      pada: lagnaNak.pada,
    },
    ...raw.map((p) => {
      const nak = nakshatraFromLongitude(p.longitude);
      const si = signIndexFromLongitude(p.longitude);
      return {
        id: p.id,
        name: p.name,
        sign: { en: SIGNS[si].en, hi: SIGNS[si].hi },
        longitude: formatDms(degreeInSign(p.longitude)),
        nakshatra: nak.name,
        pada: nak.pada,
      };
    }),
  ];

  const gregYear = localParts.y;
  const samvat = samvatForYear(gregYear);

  return {
    date: ymd,
    place,
    lat,
    lon,
    timeZone,
    weekday,
    longDate: {
      en: noon.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone,
      }),
      hi: noon.toLocaleDateString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone,
      }),
    },
    timings: {
      sunrise: formatHmAmPm(sunrise, timeZone),
      sunset: formatHmAmPm(sunset, timeZone),
      moonrise: formatHmAmPm(moonrise, timeZone),
      moonset: formatHmAmPm(moonset, timeZone),
      sunriseHm: formatHm(sunrise, timeZone),
      sunsetHm: formatHm(sunset, timeZone),
      moonriseHm: formatHm(moonrise, timeZone),
      moonsetHm: formatHm(moonset, timeZone),
    },
    limbs: {
      tithi: {
        name: tithiName,
        until: formatHm(tithiEnd, timeZone),
        index: panchang.tithi.index,
      },
      nakshatra: {
        name: panchang.nakshatra.name,
        pada: panchang.nakshatra.pada,
        until: formatHm(nakEnd, timeZone),
        lord: panchang.nakshatra.lord,
      },
      yoga: panchang.yoga.name,
      karana: panchang.karana.name,
      paksha: {
        en: panchang.paksha.id === "Shukla" ? "Shukla" : "Krishna",
        hi: panchang.paksha.id === "Shukla" ? "शुक्ल" : "कृष्ण",
      },
      weekday,
    },
    samvat,
    ashubha,
    abhijit: muhurat.abhijit,
    tarabalam: tara,
    chandrabalam: chandra,
    planets: planetRows,
    kundli,
    ayanamsa: Number(ayanamsa.toFixed(4)),
  };
}
