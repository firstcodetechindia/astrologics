/**
 * Live muhurat helpers — Choghadiya / Hora / Rahu Kaal
 * using classic weekday-lord sequences + astronomy-engine sunrise/sunset (Delhi default).
 */

import * as Astronomy from "astronomy-engine";

type Loc = { en: string; hi: string };

/** Hora / Choghadiya planet order: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars */
const PLANETS: Loc[] = [
  { en: "Sun", hi: "सूर्य" },
  { en: "Venus", hi: "शुक्र" },
  { en: "Mercury", hi: "बुध" },
  { en: "Moon", hi: "चंद्र" },
  { en: "Saturn", hi: "शनि" },
  { en: "Jupiter", hi: "गुरु" },
  { en: "Mars", hi: "मंगल" },
];

/** Weekday lord index into PLANETS (JS: 0=Sun … 6=Sat). */
const DAY_LORD: number[] = [0, 3, 6, 2, 5, 1, 4];

/** Planet index → Choghadiya name (day cycle lords) */
const CHOGHA_BY_PLANET: Loc[] = [
  { en: "Udveg", hi: "उद्वेग" }, // Sun
  { en: "Chal", hi: "चल" }, // Venus (Char)
  { en: "Labh", hi: "लाभ" }, // Mercury
  { en: "Amrit", hi: "अमृत" }, // Moon
  { en: "Kaal", hi: "काल" }, // Saturn
  { en: "Shubh", hi: "शुभ" }, // Jupiter
  { en: "Rog", hi: "रोग" }, // Mars
];

/**
 * Day Choghadiya fixed cycle (planet-lord order).
 * Weekday sets where the day sequence begins (Sun→Udveg … Mon→Amrit …).
 */
const DAY_CHOGHA_CYCLE: Loc[] = [
  CHOGHA_BY_PLANET[0], // Udveg
  CHOGHA_BY_PLANET[1], // Chal
  CHOGHA_BY_PLANET[2], // Labh
  CHOGHA_BY_PLANET[3], // Amrit
  CHOGHA_BY_PLANET[4], // Kaal
  CHOGHA_BY_PLANET[5], // Shubh
  CHOGHA_BY_PLANET[6], // Rog
];

/**
 * Night Choghadiya uses a *different* fixed cycle than day
 * (Chal → Rog → Kaal → Labh → Udveg → Shubh → Amrit).
 * Weekday sets the night starting name:
 * Sun→Shubh, Mon→Chal, Tue→Labh, Wed→Udveg, Thu→Amrit, Fri→Rog, Sat→Kaal.
 */
const NIGHT_CHOGHA_CYCLE: Loc[] = [
  { en: "Chal", hi: "चल" },
  { en: "Rog", hi: "रोग" },
  { en: "Kaal", hi: "काल" },
  { en: "Labh", hi: "लाभ" },
  { en: "Udveg", hi: "उद्वेग" },
  { en: "Shubh", hi: "शुभ" },
  { en: "Amrit", hi: "अमृत" },
];

/** Index into NIGHT_CHOGHA_CYCLE for each weekday (0=Sun … 6=Sat). */
const NIGHT_START_INDEX: number[] = [5, 0, 3, 4, 6, 1, 2];

/** Index into DAY_CHOGHA_CYCLE for each weekday (= DAY_LORD mapped). */
const DAY_START_INDEX: number[] = [0, 3, 6, 2, 5, 1, 4];

function choghaPlanet(name: Loc): Loc {
  const i = CHOGHA_BY_PLANET.findIndex((c) => c.en === name.en);
  return i >= 0 ? PLANETS[i] : PLANETS[0];
}

/** Rahu Kaal daytime slot (1–8) by weekday. */
const RAHU_SLOT: Record<number, number> = {
  0: 8,
  1: 2,
  2: 7,
  3: 5,
  4: 6,
  5: 4,
  6: 3,
};

/** Default peek location — Delhi (matches common India “today” panels). */
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

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

function formatHm(date: Date, timeZone: string) {
  const p = partsInTz(date, timeZone);
  return `${String(p.h).padStart(2, "0")}:${String(p.min).padStart(2, "0")}`;
}

function toneFor(name: string): "good" | "neutral" | "caution" {
  if (name === "Amrit" || name === "Shubh" || name === "Labh") return "good";
  if (name === "Kaal" || name === "Rog" || name === "Udveg") return "caution";
  return "neutral"; // Chal
}

/**
 * Find sunrise/sunset bracketing `date` for the observer.
 * Day = last sunrise → next sunset (or last sunset if after sunset, night continues).
 */
/** Sunrise → sunset → next sunrise bracketing `date`. Used by muhurat and Kala Bala. */
export function sunRiseSetWindow(date: Date, lat: number, lon: number) {
  const observer = new Astronomy.Observer(lat, lon, 0);
  // Search back ~1.2 days for previous sunrise, forward for sunset / next sunrise
  const rise =
    Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1,
      new Date(date.getTime() - 20 * 3600_000),
      2
    ) ?? null;
  const setAfterRise = rise
    ? Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, rise.date, 1)
    : null;
  const nextRise = rise
    ? Astronomy.SearchRiseSet(
        Astronomy.Body.Sun,
        observer,
        +1,
        new Date(rise.date.getTime() + 60_000),
        1
      )
    : null;

  // Fallback approx if engine fails
  if (!rise || !setAfterRise || !nextRise) {
    const approxRise = new Date(date);
    approxRise.setUTCHours(0, 30, 0, 0); // ~06:00 IST rough
    const approxSet = new Date(date);
    approxSet.setUTCHours(12, 30, 0, 0);
    const approxNext = new Date(approxRise.getTime() + 24 * 3600_000);
    return { sunrise: approxRise, sunset: approxSet, nextSunrise: approxNext };
  }

  let sunrise = rise.date;
  let sunset = setAfterRise.date;
  let nextSunrise = nextRise.date;

  // If we're past this sunset, the active night started at this sunset;
  // if we're before this sunrise (shouldn't happen often), step back once more.
  if (date < sunrise) {
    const prev = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1,
      new Date(sunrise.getTime() - 30 * 3600_000),
      1
    );
    if (prev) {
      nextSunrise = sunrise;
      sunrise = prev.date;
      const s = Astronomy.SearchRiseSet(
        Astronomy.Body.Sun,
        observer,
        -1,
        sunrise,
        1
      );
      if (s) sunset = s.date;
    }
  }

  return { sunrise, sunset, nextSunrise };
}

/** Weekday lord for the Vedic day that started at `sunrise` (local TZ). */
function weekdayAt(sunrise: Date, timeZone: string) {
  return partsInTz(sunrise, timeZone).weekday;
}

export function liveMuhuratNow(
  date = new Date(),
  timeZone = "Asia/Kolkata",
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON
) {
  const p = partsInTz(date, timeZone);
  const { sunrise, sunset, nextSunrise } = sunRiseSetWindow(date, lat, lon);
  const dayLord = DAY_LORD[weekdayAt(sunrise, timeZone)];

  const isDay = date >= sunrise && date < sunset;
  const periodStart = isDay ? sunrise : sunset;
  const periodEnd = isDay ? sunset : nextSunrise;
  const periodMs = Math.max(periodEnd.getTime() - periodStart.getTime(), 1);
  const elapsed = Math.max(0, date.getTime() - periodStart.getTime());
  const slot = Math.min(7, Math.floor((elapsed / periodMs) * 8));

  const weekday = weekdayAt(sunrise, timeZone);
  // Day & night use different fixed cycles; weekday only picks the start index.
  const choghadiya = isDay
    ? DAY_CHOGHA_CYCLE[(DAY_START_INDEX[weekday] + slot) % 7]
    : NIGHT_CHOGHA_CYCLE[(NIGHT_START_INDEX[weekday] + slot) % 7];
  const choghadiyaTone = toneFor(choghadiya.en);

  // Planetary hora — 12 equal day parts + 12 equal night parts (not clock hours)
  const dayMs = Math.max(sunset.getTime() - sunrise.getTime(), 1);
  const nightMs = Math.max(nextSunrise.getTime() - sunset.getTime(), 1);
  let horaSlot: number;
  if (isDay) {
    const dayHoraMs = dayMs / 12;
    horaSlot = Math.min(
      11,
      Math.floor((date.getTime() - sunrise.getTime()) / dayHoraMs)
    );
  } else {
    const nightHoraMs = nightMs / 12;
    horaSlot =
      12 +
      Math.min(
        11,
        Math.floor((date.getTime() - sunset.getTime()) / nightHoraMs)
      );
  }
  const hora = PLANETS[(dayLord + horaSlot) % 7];

  // Rahu Kaal — 8th of daytime only
  const rahuSlot = RAHU_SLOT[weekdayAt(sunrise, timeZone)] ?? 2;
  const slotMs = dayMs / 8;
  const rahuStart = new Date(sunrise.getTime() + (rahuSlot - 1) * slotMs);
  const rahuEnd = new Date(rahuStart.getTime() + slotMs);
  const inRahu = date >= rahuStart && date < rahuEnd;

  return {
    timeZone,
    clock: `${String(p.h).padStart(2, "0")}:${String(p.min).padStart(2, "0")}:${String(p.sec).padStart(2, "0")}`,
    clockShort: `${String(p.h).padStart(2, "0")}:${String(p.min).padStart(2, "0")}`,
    hora,
    choghadiya,
    choghadiyaTone,
    rahuKaal: {
      start: formatHm(rahuStart, timeZone),
      end: formatHm(rahuEnd, timeZone),
      label: {
        en: `${formatHm(rahuStart, timeZone)} – ${formatHm(rahuEnd, timeZone)}`,
        hi: `${formatHm(rahuStart, timeZone)} – ${formatHm(rahuEnd, timeZone)}`,
      },
      active: inRahu,
    },
    meta: {
      sunrise: formatHm(sunrise, timeZone),
      sunset: formatHm(sunset, timeZone),
      isDay,
      slot: slot + 1,
    },
  };
}

export type MuhuratWindow = {
  index: number;
  start: string;
  end: string;
  startMs: number;
  endMs: number;
  name: Loc;
  planet: Loc;
  tone: "good" | "neutral" | "caution";
  active: boolean;
};

export const CHOGHADIYA_MEANINGS: Record<
  string,
  { tone: "good" | "neutral" | "caution"; blurb: Loc }
> = {
  Amrit: {
    tone: "good",
    blurb: {
      en: "Nectar — the best window. Excellent for any important task.",
      hi: "अमृत — सर्वोत्तम खंड। किसी भी महत्वपूर्ण कार्य के लिए उत्तम।",
    },
  },
  Shubh: {
    tone: "good",
    blurb: {
      en: "Auspicious — favourable for new starts, ceremonies, and study.",
      hi: "शुभ — नए आरंभ, संस्कार और अध्ययन के लिए अनुकूल।",
    },
  },
  Labh: {
    tone: "good",
    blurb: {
      en: "Gain — favourable for business, trade, and financial work.",
      hi: "लाभ — व्यापार, लेन-देन और धन संबंधी कार्यों के लिए अनुकूल।",
    },
  },
  Chal: {
    tone: "neutral",
    blurb: {
      en: "Movable — neutral; suited for travel and routine activity.",
      hi: "चल — सामान्य; यात्रा और नियमित कार्यों के लिए ठीक।",
    },
  },
  Udveg: {
    tone: "caution",
    blurb: {
      en: "Restlessness — a tense window. Avoid important work.",
      hi: "उद्वेग — तनावपूर्ण खंड। महत्वपूर्ण कार्य से बचें।",
    },
  },
  Rog: {
    tone: "caution",
    blurb: {
      en: "Sickness — avoid important work, especially health-related matters.",
      hi: "रोग — महत्वपूर्ण कार्य से बचें, विशेषकर स्वास्थ्य संबंधी।",
    },
  },
  Kaal: {
    tone: "caution",
    blurb: {
      en: "Destructive — the most inauspicious window. Avoid all important work.",
      hi: "काल — सबसे अशुभ खंड। सभी महत्वपूर्ण कार्यों से बचें।",
    },
  },
};

/** Gowri (South Indian) quality names cycling with weekday start. */
const GOWRI_NAMES: Loc[] = [
  { en: "Amrita", hi: "अमृत" },
  { en: "Siddha", hi: "सिद्ध" },
  { en: "Udyoga", hi: "उद्योग" },
  { en: "Labha", hi: "लाभ" },
  { en: "Dhana", hi: "धन" },
  { en: "Shubha", hi: "शुभ" },
  { en: "Roga", hi: "रोग" },
  { en: "Mrityu", hi: "मृत्यु" },
];

function gowriTone(name: string): "good" | "neutral" | "caution" {
  if (
    name === "Amrita" ||
    name === "Shubha" ||
    name === "Labha" ||
    name === "Udyoga" ||
    name === "Siddha" ||
    name === "Dhana"
  )
    return "good";
  return "caution";
}

function buildEightWindows(
  start: Date,
  end: Date,
  nameAt: (i: number) => Loc,
  planetAt: (i: number) => Loc,
  toneAt: (name: string) => "good" | "neutral" | "caution",
  now: Date,
  timeZone: string
): MuhuratWindow[] {
  const ms = Math.max(end.getTime() - start.getTime(), 1);
  const slotMs = ms / 8;
  return Array.from({ length: 8 }, (_, i) => {
    const s = new Date(start.getTime() + i * slotMs);
    const e = new Date(start.getTime() + (i + 1) * slotMs);
    const name = nameAt(i);
    return {
      index: i + 1,
      start: formatHm(s, timeZone),
      end: formatHm(e, timeZone),
      startMs: s.getTime(),
      endMs: e.getTime(),
      name,
      planet: planetAt(i),
      tone: toneAt(name.en),
      active: now >= s && now < e,
    };
  });
}

/**
 * Full-day muhurat tables for a city/date — used by Choghadiya, Hora, Rahu Kaal, Gowri tools.
 * No birth chart required.
 */
export function dailyMuhuratFor(
  date = new Date(),
  timeZone = "Asia/Kolkata",
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON
) {
  const { sunrise, sunset, nextSunrise } = sunRiseSetWindow(date, lat, lon);
  const weekday = weekdayAt(sunrise, timeZone);
  const dayLord = DAY_LORD[weekday];
  const dayStart = DAY_START_INDEX[weekday];
  const nightStart = NIGHT_START_INDEX[weekday];

  const dayChoghadiya = buildEightWindows(
    sunrise,
    sunset,
    (i) => DAY_CHOGHA_CYCLE[(dayStart + i) % 7],
    (i) => choghaPlanet(DAY_CHOGHA_CYCLE[(dayStart + i) % 7]),
    toneFor,
    date,
    timeZone
  );
  const nightChoghadiya = buildEightWindows(
    sunset,
    nextSunrise,
    (i) => NIGHT_CHOGHA_CYCLE[(nightStart + i) % 7],
    (i) => choghaPlanet(NIGHT_CHOGHA_CYCLE[(nightStart + i) % 7]),
    toneFor,
    date,
    timeZone
  );

  // Gowri: 8 named qualities; start index shifts with weekday
  const gowriStart = weekdayAt(sunrise, timeZone) % 8;
  const dayGowri = buildEightWindows(
    sunrise,
    sunset,
    (i) => GOWRI_NAMES[(gowriStart + i) % 8],
    (i) => PLANETS[(dayLord + i) % 7],
    gowriTone,
    date,
    timeZone
  );
  const nightGowri = buildEightWindows(
    sunset,
    nextSunrise,
    (i) => GOWRI_NAMES[(gowriStart + i + 4) % 8],
    (i) => PLANETS[(dayLord + 4 + i) % 7],
    gowriTone,
    date,
    timeZone
  );

  // 12 day + 12 night horas
  const dayMs = Math.max(sunset.getTime() - sunrise.getTime(), 1);
  const nightMs = Math.max(nextSunrise.getTime() - sunset.getTime(), 1);
  const dayHoraMs = dayMs / 12;
  const nightHoraMs = nightMs / 12;
  const horas: MuhuratWindow[] = [];
  for (let i = 0; i < 12; i++) {
    const s = new Date(sunrise.getTime() + i * dayHoraMs);
    const e = new Date(sunrise.getTime() + (i + 1) * dayHoraMs);
    const planet = PLANETS[(dayLord + i) % 7];
    horas.push({
      index: i + 1,
      start: formatHm(s, timeZone),
      end: formatHm(e, timeZone),
      startMs: s.getTime(),
      endMs: e.getTime(),
      name: planet,
      planet,
      tone:
        planet.en === "Jupiter" ||
        planet.en === "Venus" ||
        planet.en === "Mercury" ||
        planet.en === "Moon"
          ? "good"
          : planet.en === "Sun"
            ? "neutral"
            : "caution",
      active: date >= s && date < e,
    });
  }
  for (let i = 0; i < 12; i++) {
    const s = new Date(sunset.getTime() + i * nightHoraMs);
    const e = new Date(sunset.getTime() + (i + 1) * nightHoraMs);
    const planet = PLANETS[(dayLord + 12 + i) % 7];
    horas.push({
      index: 13 + i,
      start: formatHm(s, timeZone),
      end: formatHm(e, timeZone),
      startMs: s.getTime(),
      endMs: e.getTime(),
      name: planet,
      planet,
      tone:
        planet.en === "Jupiter" ||
        planet.en === "Venus" ||
        planet.en === "Mercury" ||
        planet.en === "Moon"
          ? "good"
          : planet.en === "Sun"
            ? "neutral"
            : "caution",
      active: date >= s && date < e,
    });
  }

  const rahuSlot = RAHU_SLOT[weekdayAt(sunrise, timeZone)] ?? 2;
  const slotMs = dayMs / 8;
  const rahuStart = new Date(sunrise.getTime() + (rahuSlot - 1) * slotMs);
  const rahuEnd = new Date(rahuStart.getTime() + slotMs);

  // Abhijit = 8th of 15 daytime muhurtas (classical midday lucky slot)
  const muhurtaMs = dayMs / 15;
  const abhijitStart = new Date(sunrise.getTime() + 7 * muhurtaMs);
  const abhijitEnd = new Date(sunrise.getTime() + 8 * muhurtaMs);

  const allChog = [...dayChoghadiya, ...nightChoghadiya];
  const activeIdx = allChog.findIndex((w) => w.active);
  const timeline = {
    previous: activeIdx > 0 ? allChog[activeIdx - 1] : null,
    current: activeIdx >= 0 ? allChog[activeIdx] : null,
    next:
      activeIdx >= 0 && activeIdx < allChog.length - 1
        ? allChog[activeIdx + 1]
        : null,
  };

  const fmtDur = (ms: number) => {
    // Average length of one of 8 equal windows (match list intervals, not day total)
    const mins = Math.round(ms / 8 / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { en: `${h}h ${m}m`, hi: `${h}घं ${m}मि` };
  };

  const live = liveMuhuratNow(date, timeZone, lat, lon);
  const weekdayNames: Loc[] = [
    { en: "Sunday", hi: "रविवार" },
    { en: "Monday", hi: "सोमवार" },
    { en: "Tuesday", hi: "मंगलवार" },
    { en: "Wednesday", hi: "बुधवार" },
    { en: "Thursday", hi: "गुरुवार" },
    { en: "Friday", hi: "शुक्रवार" },
    { en: "Saturday", hi: "शनिवार" },
  ];

  return {
    ...live,
    place: { lat, lon },
    weekday: weekdayNames[weekdayAt(sunrise, timeZone)],
    dayChoghadiya,
    nightChoghadiya,
    dayGowri,
    nightGowri,
    horas,
    timeline,
    dayDuration: fmtDur(dayMs),
    nightDuration: fmtDur(nightMs),
    abhijit: {
      start: formatHm(abhijitStart, timeZone),
      end: formatHm(abhijitEnd, timeZone),
      active: date >= abhijitStart && date < abhijitEnd,
    },
    rahuKaal: {
      ...live.rahuKaal,
      start: formatHm(rahuStart, timeZone),
      end: formatHm(rahuEnd, timeZone),
      label: {
        en: `${formatHm(rahuStart, timeZone)} – ${formatHm(rahuEnd, timeZone)}`,
        hi: `${formatHm(rahuStart, timeZone)} – ${formatHm(rahuEnd, timeZone)}`,
      },
      active: date >= rahuStart && date < rahuEnd,
    },
  };
}

/** Next 7 days of day/night Choghadiya (start times) for week table. */
export function weekChoghadiya(
  from = new Date(),
  timeZone = "Asia/Kolkata",
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON,
  days = 7
) {
  const rows: {
    dateKey: string;
    label: Loc;
    day: MuhuratWindow[];
    night: MuhuratWindow[];
  }[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(from.getTime() + i * 86400000);
    // Noon-ish for stable day window
    const noon = new Date(d);
    const p = partsInTz(noon, timeZone);
    const localNoon = new Date(
      Date.UTC(p.y, p.m - 1, p.d, 6, 30, 0)
    );
    const m = dailyMuhuratFor(localNoon, timeZone, lat, lon);
    const weekdayShort = [
      { en: "Sun", hi: "रवि" },
      { en: "Mon", hi: "सोम" },
      { en: "Tue", hi: "मंगल" },
      { en: "Wed", hi: "बुध" },
      { en: "Thu", hi: "गुरु" },
      { en: "Fri", hi: "शुक्र" },
      { en: "Sat", hi: "शनि" },
    ][weekdayAt(
      // reuse sunrise weekday via first day window
      new Date(m.dayChoghadiya[0]?.startMs ?? localNoon.getTime()),
      timeZone
    )];

    rows.push({
      dateKey: `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`,
      label: {
        en: `${weekdayShort.en}, ${p.d} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][p.m - 1]}`,
        hi: `${weekdayShort.hi}, ${p.d}/${p.m}`,
      },
      day: m.dayChoghadiya,
      night: m.nightChoghadiya,
    });
  }
  return rows;
}
