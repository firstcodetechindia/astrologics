import {
  DASHA_ORDER,
  DASHA_YEARS,
  NAKSHATRA_SPAN,
  PLANET_META,
} from "./constants";
import { norm360 } from "./math";
import type { DashaPeriod } from "./types";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const CYCLE_YEARS = 120;

function planetName(id: string) {
  return PLANET_META[id] || { en: id, hi: id };
}

function formatISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function idFromPlanetName(nameEn: string): string {
  return (
    Object.keys(PLANET_META).find((k) => PLANET_META[k].en === nameEn) ||
    "venus"
  );
}

/**
 * Classical antar lengths inside a mahadasha:
 * antarYears = (mahaYears * antarLordYears) / 120
 */
function antarDurationsMs(mahaPlanetId: string, mahaSpanMs: number): {
  id: string;
  ms: number;
}[] {
  const startIdx = DASHA_ORDER.indexOf(
    mahaPlanetId as (typeof DASHA_ORDER)[number]
  );
  const mahaYears = DASHA_YEARS[mahaPlanetId as (typeof DASHA_ORDER)[number]];
  const fullMahaMs = mahaYears * MS_PER_YEAR;
  const scale = mahaSpanMs / fullMahaMs; // 1 for full maha; <1 for balance remnant

  const rows: { id: string; ms: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const id = DASHA_ORDER[(startIdx + i) % 9];
    const antarYears = (mahaYears * DASHA_YEARS[id]) / CYCLE_YEARS;
    rows.push({ id, ms: antarYears * MS_PER_YEAR * scale });
  }
  // Snap total to exact span
  const sum = rows.reduce((a, r) => a + r.ms, 0);
  if (sum > 0 && Math.abs(sum - mahaSpanMs) > 1) {
    rows[rows.length - 1].ms += mahaSpanMs - sum;
  }
  return rows;
}

/**
 * For the first (balance) mahadasha: skip antars already elapsed before birth,
 * then emit remaining antars inside the balance window.
 *
 * elapsedBeforeBirthMs = fullMahaMs - balanceMs
 */
function buildBalanceAntars(
  mahaPlanetId: string,
  birth: Date,
  balanceMs: number
): DashaPeriod[] {
  const mahaYears = DASHA_YEARS[mahaPlanetId as (typeof DASHA_ORDER)[number]];
  const fullMahaMs = mahaYears * MS_PER_YEAR;
  const elapsedBefore = Math.max(0, fullMahaMs - balanceMs);

  const startIdx = DASHA_ORDER.indexOf(
    mahaPlanetId as (typeof DASHA_ORDER)[number]
  );
  const list: DashaPeriod[] = [];
  let consumed = 0;
  let cursor = birth.getTime();
  const endLimit = birth.getTime() + balanceMs;

  for (let i = 0; i < 9; i++) {
    const id = DASHA_ORDER[(startIdx + i) % 9];
    const antarFullMs =
      ((mahaYears * DASHA_YEARS[id]) / CYCLE_YEARS) * MS_PER_YEAR;
    const antarStartAbs = consumed;
    const antarEndAbs = consumed + antarFullMs;
    consumed = antarEndAbs;

    if (antarEndAbs <= elapsedBefore) continue; // fully before birth

    const remainingStart = Math.max(antarStartAbs, elapsedBefore);
    const remainingEnd = antarEndAbs;
    const portionMs = remainingEnd - remainingStart;
    if (portionMs <= 0) continue;

    const startMs = cursor;
    const endMs = Math.min(cursor + portionMs, endLimit);
    list.push({
      planet: planetName(id),
      start: formatISO(new Date(startMs)),
      end: formatISO(new Date(endMs)),
    });
    cursor = endMs;
    if (cursor >= endLimit - 1) break;
  }

  if (list.length) {
    list[list.length - 1].end = formatISO(new Date(endLimit));
  }
  return list;
}

function buildFullAntars(
  mahaPlanetId: string,
  start: Date,
  spanMs: number
): DashaPeriod[] {
  const rows = antarDurationsMs(mahaPlanetId, spanMs);
  const list: DashaPeriod[] = [];
  let cursor = start.getTime();
  for (const row of rows) {
    const end = cursor + row.ms;
    list.push({
      planet: planetName(row.id),
      start: formatISO(new Date(cursor)),
      end: formatISO(new Date(end)),
    });
    cursor = end;
  }
  if (list.length) {
    list[list.length - 1].end = formatISO(new Date(start.getTime() + spanMs));
  }
  return list;
}

function buildPratyantars(
  antarPlanetId: string,
  mahaPlanetId: string,
  start: Date,
  spanMs: number
): DashaPeriod[] {
  // Pratyantar sequence starts from the antardasha lord;
  // lengths proportional within the antar span (same 9-lord cycle).
  void mahaPlanetId;
  return buildFullAntars(antarPlanetId, start, spanMs);
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
  const balanceMs = balanceYears * MS_PER_YEAR;

  const mahaList: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());
  const startLordIndex = DASHA_ORDER.indexOf(lordId);

  const firstEnd = new Date(cursor.getTime() + balanceMs);
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

  const mahaPlanetId = idFromPlanetName(currentMaha.planet.en);
  const mahaStart = new Date(currentMaha.start);
  const mahaEnd = new Date(currentMaha.end);
  const mahaSpanMs = Math.max(mahaEnd.getTime() - mahaStart.getTime(), 1);

  const isBalanceMaha =
    currentMaha.start === mahaList[0].start &&
    currentMaha.end === mahaList[0].end;

  const antarList = isBalanceMaha
    ? buildBalanceAntars(mahaPlanetId, mahaStart, mahaSpanMs)
    : buildFullAntars(mahaPlanetId, mahaStart, mahaSpanMs);

  const currentAntar =
    antarList.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return now.getTime() >= s && now.getTime() < e;
    }) || antarList[0];

  if (currentAntar) currentAntar.isCurrent = true;

  const antarPlanetId = idFromPlanetName(
    currentAntar?.planet.en || mahaPlanetId
  );
  const antarStart = new Date(currentAntar?.start || currentMaha.start);
  const antarEnd = new Date(currentAntar?.end || currentMaha.end);
  const antarSpanMs = Math.max(antarEnd.getTime() - antarStart.getTime(), 1);
  const pratyantarList = buildPratyantars(
    antarPlanetId,
    mahaPlanetId,
    antarStart,
    antarSpanMs
  );

  const currentPratyantar =
    pratyantarList.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return now.getTime() >= s && now.getTime() < e;
    }) || pratyantarList[0];

  if (currentPratyantar) currentPratyantar.isCurrent = true;

  return {
    currentMaha,
    currentAntar: currentAntar || currentMaha,
    currentPratyantar: currentPratyantar || currentAntar || currentMaha,
    mahaList,
    antarList,
    pratyantarList,
    balanceYears: Number(balanceYears.toFixed(4)),
    startLord: planetName(lordId),
  };
}

/**
 * Classical dasha remainder breakdown: 1 year = 12 months, 1 month = 30 days.
 * Used to match published worked examples (not tropical 365.25-day civil time).
 */
export function dashaBalanceParts(years: number) {
  const y = Math.max(0, years);
  const wholeYears = Math.floor(y);
  let rem = (y - wholeYears) * 12;
  const months = Math.floor(rem + 1e-12);
  rem = (rem - months) * 30;
  const days = Math.floor(rem + 1e-12);
  rem = (rem - days) * 24;
  const hours = Math.floor(rem + 1e-12);
  rem = (rem - hours) * 60;
  const minutes = Math.floor(rem + 1e-12);
  rem = (rem - minutes) * 60;
  const seconds = rem;
  return { years: wholeYears, months, days, hours, minutes, seconds };
}
