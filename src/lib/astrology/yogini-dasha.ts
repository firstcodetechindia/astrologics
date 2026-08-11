/**
 * Yogini Dasha — 36-year cycle of 8 Yoginis (classical Parashari timing system).
 * Sequence keyed by Moon nakshatra at birth (same balance logic as Vimshottari).
 */
import { NAKSHATRA_SPAN } from "./constants";
import { norm360 } from "./math";
import type { DashaPeriod } from "./types";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/** Classical order starting from Mangala (1 year) … Sankata (8 years). */
export const YOGINI_ORDER = [
  "mangala",
  "pingala",
  "dhanya",
  "bhramari",
  "bhadrika",
  "ulka",
  "siddha",
  "sankata",
] as const;

export const YOGINI_YEARS: Record<(typeof YOGINI_ORDER)[number], number> = {
  mangala: 1,
  pingala: 2,
  dhanya: 3,
  bhramari: 4,
  bhadrika: 5,
  ulka: 6,
  siddha: 7,
  sankata: 8,
};

const YOGINI_META: Record<
  (typeof YOGINI_ORDER)[number],
  { en: string; hi: string; planet: { en: string; hi: string } }
> = {
  mangala: {
    en: "Mangala",
    hi: "मंगला",
    planet: { en: "Moon", hi: "चंद्र" },
  },
  pingala: {
    en: "Pingala",
    hi: "पिंगला",
    planet: { en: "Sun", hi: "सूर्य" },
  },
  dhanya: {
    en: "Dhanya",
    hi: "धन्या",
    planet: { en: "Jupiter", hi: "गुरु" },
  },
  bhramari: {
    en: "Bhramari",
    hi: "भ्रमरी",
    planet: { en: "Mars", hi: "मंगल" },
  },
  bhadrika: {
    en: "Bhadrika",
    hi: "भद्रिका",
    planet: { en: "Mercury", hi: "बुध" },
  },
  ulka: {
    en: "Ulka",
    hi: "उल्का",
    planet: { en: "Saturn", hi: "शनि" },
  },
  siddha: {
    en: "Siddha",
    hi: "सिद्धा",
    planet: { en: "Venus", hi: "शुक्र" },
  },
  sankata: {
    en: "Sankata",
    hi: "संकटा",
    planet: { en: "Rahu", hi: "राहु" },
  },
};

function formatISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function yoginiName(id: (typeof YOGINI_ORDER)[number]) {
  return { en: YOGINI_META[id].en, hi: YOGINI_META[id].hi };
}

/**
 * Birth Yogini lord from Moon nakshatra index (0–26).
 * Ashwini→Mangala, Bharani→Pingala, … cycles every 8.
 */
export function yoginiLordFromNakshatra(nakIndex: number) {
  const id = YOGINI_ORDER[((nakIndex % 27) + 27) % 27 % 8];
  return id;
}

export function computeYogini(moonLon: number, birthDate: Date) {
  const L = norm360(moonLon);
  const nakIndex = Math.floor(L / NAKSHATRA_SPAN) % 27;
  const lordId = yoginiLordFromNakshatra(nakIndex);
  const elapsedInNak = L % NAKSHATRA_SPAN;
  const fractionElapsed = elapsedInNak / NAKSHATRA_SPAN;
  const totalYears = YOGINI_YEARS[lordId];
  const balanceYears = totalYears * (1 - fractionElapsed);
  const balanceMs = balanceYears * MS_PER_YEAR;

  const mahaList: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());
  const startIdx = YOGINI_ORDER.indexOf(lordId);

  const firstEnd = new Date(cursor.getTime() + balanceMs);
  mahaList.push({
    planet: yoginiName(lordId),
    start: formatISO(cursor),
    end: formatISO(firstEnd),
  });
  cursor = firstEnd;

  // Two full 36y cycles worth of periods after balance (~16 periods shown)
  for (let i = 1; i < 16; i++) {
    const id = YOGINI_ORDER[(startIdx + i) % 8];
    const years = YOGINI_YEARS[id];
    const end = new Date(cursor.getTime() + years * MS_PER_YEAR);
    mahaList.push({
      planet: yoginiName(id),
      start: formatISO(cursor),
      end: formatISO(end),
    });
    cursor = end;
  }

  const now = new Date();
  const current =
    mahaList.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return now.getTime() >= s && now.getTime() < e;
    }) || mahaList[0];
  current.isCurrent = true;

  const currentId = YOGINI_ORDER.find(
    (id) => YOGINI_META[id].en === current.planet.en
  )!;

  return {
    system: "yogini" as const,
    cycleYears: 36,
    current,
    mahaList,
    balanceYears: Number(balanceYears.toFixed(4)),
    startLord: yoginiName(lordId),
    startLordPlanet: YOGINI_META[lordId].planet,
    currentPlanet: YOGINI_META[currentId].planet,
    nakshatraIndex: nakIndex,
  };
}
