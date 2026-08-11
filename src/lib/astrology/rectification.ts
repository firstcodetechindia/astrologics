/**
 * Birth-time rectification via Vimshottari dasha alignment to dated life events.
 */
import { SIGN_LORDS, SIGNS } from "./constants";
import { computeVimshottari } from "./dasha";
import { houseOfPlanet } from "./houses";
import { signIndexFromLongitude } from "./math";
import { calculateLagna, getSiderealPlanets } from "./planets";
import { resolveAyanamsa, type AyanamsaId } from "./prefs";
import type { BirthInput } from "./types";

export type LifeEventDomain =
  | "job_started"
  | "promotion"
  | "job_loss"
  | "business_started"
  | "retirement"
  | "engagement"
  | "marriage"
  | "divorce"
  | "childbirth"
  | "bereavement"
  | "property_bought"
  | "vehicle_bought"
  | "big_financial_gain"
  | "relocation"
  | "health_crisis"
  | "accident_injury"
  | "legal_case"
  | "foreign_travel"
  | "education_milestone";

export type LifeEvent = { date: string; domain: LifeEventDomain };

const DOMAIN_HOUSES: Record<LifeEventDomain, number[]> = {
  job_started: [10, 6, 11],
  promotion: [10, 11, 6],
  job_loss: [10, 8, 12],
  business_started: [10, 7, 11],
  retirement: [10, 12, 8],
  engagement: [7, 11, 2],
  marriage: [7, 2, 11],
  divorce: [7, 8, 12],
  childbirth: [5, 9, 2],
  bereavement: [8, 12, 2],
  property_bought: [4, 12, 11],
  vehicle_bought: [4, 11, 12],
  big_financial_gain: [11, 2, 8],
  relocation: [4, 3, 12],
  health_crisis: [6, 8, 12],
  accident_injury: [8, 6, 12],
  legal_case: [6, 8, 12],
  foreign_travel: [12, 9, 3],
  education_milestone: [4, 5, 9],
};

export type RectificationCandidate = {
  offsetMinutes: number;
  time: string;
  ascendantSign: { en: string; hi: string };
  matched: number;
  score: number;
};

export type RectificationResult = {
  best: RectificationCandidate;
  candidates: RectificationCandidate[];
  confidence: "low" | "medium" | "high";
  reasoning: { en: string; hi: string };
};

function toHHMM(totalMinutes: number): string {
  const m = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function parseTimeMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function lordIdFromSign(signIndex: number): string {
  return SIGN_LORDS[signIndex].en.toLowerCase();
}

function enToId(en?: string): string | null {
  if (!en) return null;
  const map: Record<string, string> = {
    Sun: "sun",
    Moon: "moon",
    Mars: "mars",
    Mercury: "mercury",
    Jupiter: "jupiter",
    Venus: "venus",
    Saturn: "saturn",
    Rahu: "rahu",
    Ketu: "ketu",
  };
  return map[en] ?? null;
}

function scoreCandidate(
  input: BirthInput,
  time: string,
  events: LifeEvent[],
  ayanamsaId: AyanamsaId
): Omit<RectificationCandidate, "offsetMinutes"> {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const offset = input.timezoneOffsetMinutes ?? 330;
  const utcMs =
    Date.UTC(y, mo - 1, d, hh ?? 0, mm ?? 0, 0) - offset * 60 * 1000;
  const date = new Date(utcMs);
  const ayanamsa = resolveAyanamsa(date, ayanamsaId);
  const { planets: raw } = getSiderealPlanets(date, ayanamsa);
  const lagnaLon = calculateLagna(date, input.lat, input.lon, ayanamsa);
  const lagnaSign = signIndexFromLongitude(lagnaLon);
  const moon = raw.find((p) => p.id === "moon");
  if (!moon) {
    return {
      time,
      ascendantSign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      matched: 0,
      score: 0,
    };
  }
  const dasha = computeVimshottari(moon.longitude, date);

  const houseOf = (planetId: string) => {
    const p = raw.find((x) => x.id === planetId);
    if (!p) return 0;
    return houseOfPlanet(p.longitude, lagnaLon);
  };

  let matched = 0;
  for (const ev of events) {
    const at = new Date(ev.date + "T12:00:00Z").getTime();
    const maha = dasha.mahaList.find((p) => {
      const s = new Date(p.start).getTime();
      const e = new Date(p.end).getTime();
      return s <= at && at < e;
    });
    const antar = dasha.antarList?.find((p) => {
      const s = new Date(p.start).getTime();
      const e = new Date(p.end).getTime();
      return s <= at && at < e;
    });
    const lordIds = [
      maha ? enToId(maha.planet.en) : null,
      antar ? enToId(antar.planet.en) : null,
    ].filter(Boolean) as string[];

    const needed = DOMAIN_HOUSES[ev.domain];
    const hit = lordIds.some((id) => {
      const h = houseOf(id);
      if (needed.includes(h)) return true;
      for (const nh of needed) {
        const houseSign = (lagnaSign + (nh - 1)) % 12;
        if (lordIdFromSign(houseSign) === id) return true;
      }
      return false;
    });
    if (hit) matched += 1;
  }

  return {
    time,
    ascendantSign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
    matched,
    score: events.length ? matched / events.length : 0,
  };
}

export function rectifyBirthTime(
  input: BirthInput,
  events: LifeEvent[],
  opts?: {
    windowMinutes?: number;
    stepMinutes?: number;
    ayanamsa?: AyanamsaId;
  }
): RectificationResult {
  if (events.length < 3) {
    throw new Error(
      "Rectification needs at least 3 dated life events for a reliable signal."
    );
  }
  const window = opts?.windowMinutes ?? 60;
  const step = opts?.stepMinutes ?? 2;
  const ayanamsaId = opts?.ayanamsa ?? "lahiri";
  const base = parseTimeMinutes(input.time);
  const candidates: RectificationCandidate[] = [];

  for (let off = -window; off <= window; off += step) {
    const time = toHHMM(base + off);
    const scored = scoreCandidate(input, time, events, ayanamsaId);
    candidates.push({ offsetMinutes: off, ...scored });
  }

  candidates.sort(
    (a, b) =>
      b.score - a.score || Math.abs(a.offsetMinutes) - Math.abs(b.offsetMinutes)
  );
  const best = candidates[0]!;
  let confidence: RectificationResult["confidence"] = "low";
  if (best.score >= 0.75 && events.length >= 5) confidence = "high";
  else if (best.score >= 0.5 && events.length >= 3) confidence = "medium";

  return {
    best,
    candidates: candidates.slice(0, 15),
    confidence,
    reasoning: {
      en: `Best match ${best.time} (${best.offsetMinutes >= 0 ? "+" : ""}${best.offsetMinutes} min) explained ${best.matched}/${events.length} events via Vimshottari dasha lords. Confidence: ${confidence}.`,
      hi: `सर्वोत्तम समय ${best.time} (${best.offsetMinutes} मिनट) — ${best.matched}/${events.length} घटनाएँ दशा स्वामियों से मेल। विश्वसनीयता: ${confidence}।`,
    },
  };
}
