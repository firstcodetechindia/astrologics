import {
  DASHA_ORDER,
  DASHA_YEARS,
  NAKSHATRA_SPAN,
  PLANET_META,
} from "./constants";
import { norm360 } from "./math";
import type { DashaPeriod } from "./types";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

function planetName(id: string) {
  return PLANET_META[id] || { en: id, hi: id };
}

function formatISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Vimshottari dasha from Moon nakshatra */
export function computeVimshottari(moonLon: number, birthDate: Date) {
  const L = norm360(moonLon);
  const nakIndex = Math.floor(L / NAKSHATRA_SPAN) % 27;
  const lordId = DASHA_ORDER[nakIndex % 9];
  const elapsedInNak = L % NAKSHATRA_SPAN;
  const fractionElapsed = elapsedInNak / NAKSHATRA_SPAN;
  const totalYears = DASHA_YEARS[lordId];
  const balanceYears = totalYears * (1 - fractionElapsed);

  // Build maha dasha timeline starting from birth with remaining balance of first dasha
  const mahaList: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());
  const startLordIndex = DASHA_ORDER.indexOf(lordId);

  // First (balance) period
  const firstEnd = new Date(cursor.getTime() + balanceYears * MS_PER_YEAR);
  mahaList.push({
    planet: planetName(lordId),
    start: formatISO(cursor),
    end: formatISO(firstEnd),
  });
  cursor = firstEnd;

  for (let i = 1; i < 9; i++) {
    const id = DASHA_ORDER[(startLordIndex + i) % 9];
    const years = DASHA_YEARS[id];
    const end = new Date(cursor.getTime() + years * MS_PER_YEAR);
    mahaList.push({
      planet: planetName(id),
      start: formatISO(cursor),
      end: formatISO(end),
    });
    cursor = end;
  }

  const now = new Date();
  const currentMaha =
    mahaList.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return now.getTime() >= s && now.getTime() < e;
    }) || mahaList[0];

  currentMaha.isCurrent = true;

  // Antardasha within current maha
  const mahaPlanetId =
    Object.keys(PLANET_META).find(
      (k) => PLANET_META[k].en === currentMaha.planet.en
    ) || "venus";
  const mahaYears =
    DASHA_YEARS[mahaPlanetId as keyof typeof DASHA_YEARS] || 20;
  const mahaStart = new Date(currentMaha.start);
  const antarList: DashaPeriod[] = [];
  const startIdx = DASHA_ORDER.indexOf(
    mahaPlanetId as (typeof DASHA_ORDER)[number]
  );
  let antarCursor = new Date(mahaStart.getTime());

  for (let i = 0; i < 9; i++) {
    const id = DASHA_ORDER[(startIdx + i) % 9];
    const antarYears =
      (mahaYears * DASHA_YEARS[id]) / 120;
    const end = new Date(antarCursor.getTime() + antarYears * MS_PER_YEAR);
    antarList.push({
      planet: planetName(id),
      start: formatISO(antarCursor),
      end: formatISO(end),
    });
    antarCursor = end;
  }

  const currentAntar =
    antarList.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return now.getTime() >= s && now.getTime() < e;
    }) || antarList[0];

  currentAntar.isCurrent = true;

  return { currentMaha, currentAntar, mahaList };
}
