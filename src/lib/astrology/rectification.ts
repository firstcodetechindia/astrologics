/**
 * Birth-time rectification via Vimshottari dasha alignment to dated life events.
 * Follows `.cursor/skills/birth-time-rectification/SKILL.md` (approved Phase 5).
 */
import { SIGN_LORDS, SIGNS } from "./constants";
import { computeVimshottari } from "./dasha";
import { houseOfPlanet } from "./houses";
import { signIndexFromLongitude } from "./math";
import { calculateLagna, getSiderealPlanets } from "./planets";
import { resolveAyanamsa, type AyanamsaId } from "./prefs";
import type { BirthInput } from "./types";
import { parseBirthDateTime } from "./timezone";

export type Loc = { en: string; hi: string };

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

export const LIFE_EVENT_DOMAINS: {
  id: LifeEventDomain;
  label: Loc;
  houses: number[];
}[] = [
  { id: "job_started", label: { en: "Job started", hi: "नौकरी शुरू" }, houses: [10, 6, 11] },
  { id: "promotion", label: { en: "Promotion", hi: "पदोन्नति" }, houses: [10, 11, 6] },
  { id: "job_loss", label: { en: "Job loss", hi: "नौकरी छूटना" }, houses: [10, 8, 12] },
  { id: "business_started", label: { en: "Business started", hi: "व्यवसाय आरंभ" }, houses: [10, 7, 11] },
  { id: "retirement", label: { en: "Retirement", hi: "सेवानिवृत्ति" }, houses: [10, 12, 8] },
  { id: "engagement", label: { en: "Engagement", hi: "सगाई" }, houses: [7, 11, 2] },
  { id: "marriage", label: { en: "Marriage", hi: "विवाह" }, houses: [7, 2, 11] },
  { id: "divorce", label: { en: "Divorce / separation", hi: "तलाक / विच्छेद" }, houses: [7, 8, 12] },
  { id: "childbirth", label: { en: "Childbirth", hi: "संतान जन्म" }, houses: [5, 9, 2] },
  { id: "bereavement", label: { en: "Bereavement", hi: "शोक" }, houses: [8, 12, 2] },
  { id: "property_bought", label: { en: "Property bought", hi: "संपत्ति खरीद" }, houses: [4, 12, 11] },
  { id: "vehicle_bought", label: { en: "Vehicle bought", hi: "वाहन खरीद" }, houses: [4, 11, 12] },
  { id: "big_financial_gain", label: { en: "Big financial gain", hi: "बड़ा आर्थिक लाभ" }, houses: [11, 2, 8] },
  { id: "relocation", label: { en: "Relocation", hi: "स्थान परिवर्तन" }, houses: [4, 3, 12] },
  { id: "health_crisis", label: { en: "Health crisis", hi: "गंभीर स्वास्थ्य" }, houses: [6, 8, 12] },
  { id: "accident_injury", label: { en: "Accident / injury", hi: "दुर्घटना / चोट" }, houses: [8, 6, 12] },
  { id: "legal_case", label: { en: "Legal case", hi: "मुकदमा" }, houses: [6, 8, 12] },
  { id: "foreign_travel", label: { en: "Foreign travel", hi: "विदेश यात्रा" }, houses: [12, 9, 3] },
  { id: "education_milestone", label: { en: "Education milestone", hi: "शिक्षा मील-पत्थर" }, houses: [4, 5, 9] },
];

const DOMAIN_HOUSES: Record<LifeEventDomain, number[]> = Object.fromEntries(
  LIFE_EVENT_DOMAINS.map((d) => [d.id, d.houses])
) as Record<LifeEventDomain, number[]>;

export type EventMatchDetail = {
  date: string;
  domain: LifeEventDomain;
  matched: boolean;
  basedOn: Loc;
};

export type RectificationCandidate = {
  offsetMinutes: number;
  time: string;
  ascendantSign: Loc;
  ascendantSignIndex: number;
  matched: number;
  /** Event-match ratio 0–1 — not “% true birth time”. */
  score: number;
  eventDetails?: EventMatchDetail[];
};

export type RectificationResult = {
  best: RectificationCandidate;
  candidates: RectificationCandidate[];
  confidence: "low" | "medium" | "high";
  reasoning: Loc;
  lagnaCaution: boolean;
  lagnaCautionNote: Loc | null;
  meta: {
    windowMinutes: number;
    stepMinutes: number;
    eventCount: number;
    methodology: Loc;
    disclaimer: Loc;
  };
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

function domainLabel(domain: LifeEventDomain): Loc {
  return (
    LIFE_EVENT_DOMAINS.find((d) => d.id === domain)?.label ?? {
      en: domain,
      hi: domain,
    }
  );
}

function scoreCandidate(
  input: BirthInput,
  time: string,
  events: LifeEvent[],
  ayanamsaId: AyanamsaId,
  withDetails: boolean
): Omit<RectificationCandidate, "offsetMinutes"> {
  const date = parseBirthDateTime({ ...input, time });
  const ayanamsa = resolveAyanamsa(date, ayanamsaId);
  const { planets: raw } = getSiderealPlanets(date, ayanamsa);
  const lagnaLon = calculateLagna(date, input.lat, input.lon, ayanamsa);
  const lagnaSign = signIndexFromLongitude(lagnaLon);
  const moon = raw.find((p) => p.id === "moon");
  const empty: Omit<RectificationCandidate, "offsetMinutes"> = {
    time,
    ascendantSign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
    ascendantSignIndex: lagnaSign,
    matched: 0,
    score: 0,
    eventDetails: withDetails ? [] : undefined,
  };
  if (!moon) return empty;

  const dasha = computeVimshottari(moon.longitude, date);

  const houseOf = (planetId: string) => {
    const p = raw.find((x) => x.id === planetId);
    if (!p) return 0;
    return houseOfPlanet(p.longitude, lagnaLon);
  };

  let matched = 0;
  const eventDetails: EventMatchDetail[] = [];

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
    const mahaEn = maha?.planet.en;
    const antarEn = antar?.planet.en;
    const lordIds = [enToId(mahaEn), enToId(antarEn)].filter(
      Boolean
    ) as string[];

    const needed = DOMAIN_HOUSES[ev.domain] ?? [];
    let hitHow = "";
    const hit = lordIds.some((id) => {
      const h = houseOf(id);
      if (needed.includes(h)) {
        hitHow = `${id} occupies H${h}`;
        return true;
      }
      for (const nh of needed) {
        const houseSign = (lagnaSign + (nh - 1)) % 12;
        if (lordIdFromSign(houseSign) === id) {
          hitHow = `${id} rules H${nh}`;
          return true;
        }
      }
      return false;
    });
    if (hit) matched += 1;

    if (withDetails) {
      const label = domainLabel(ev.domain);
      eventDetails.push({
        date: ev.date,
        domain: ev.domain,
        matched: hit,
        basedOn: {
          en: hit
            ? `${label.en} ${ev.date}: maha ${mahaEn ?? "—"} / antar ${antarEn ?? "—"} → ${hitHow} (houses ${needed.join(",")})`
            : `${label.en} ${ev.date}: maha ${mahaEn ?? "—"} / antar ${antarEn ?? "—"} — no link to houses ${needed.join(",")}`,
          hi: hit
            ? `${label.hi} ${ev.date}: महा ${mahaEn ?? "—"} / अंतर ${antarEn ?? "—"} → ${hitHow}`
            : `${label.hi} ${ev.date}: महा ${mahaEn ?? "—"} / अंतर ${antarEn ?? "—"} — भाव ${needed.join(",")} से मेल नहीं`,
        },
      });
    }
  }

  return {
    time,
    ascendantSign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
    ascendantSignIndex: lagnaSign,
    matched,
    score: events.length ? matched / events.length : 0,
    eventDetails: withDetails ? eventDetails : undefined,
  };
}

export function isLifeEventDomain(v: string): v is LifeEventDomain {
  return LIFE_EVENT_DOMAINS.some((d) => d.id === v);
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
  const invalid = events.find((e) => !isLifeEventDomain(e.domain));
  if (invalid) {
    throw new Error(`Unknown event domain: ${invalid.domain}`);
  }

  const window = opts?.windowMinutes ?? 60;
  const step = opts?.stepMinutes ?? 2;
  const ayanamsaId = opts?.ayanamsa ?? "lahiri";
  const base = parseTimeMinutes(input.time);
  const candidates: RectificationCandidate[] = [];

  for (let off = -window; off <= window; off += step) {
    const time = toHHMM(base + off);
    const scored = scoreCandidate(input, time, events, ayanamsaId, false);
    candidates.push({ offsetMinutes: off, ...scored });
  }

  candidates.sort(
    (a, b) =>
      b.score - a.score || Math.abs(a.offsetMinutes) - Math.abs(b.offsetMinutes)
  );

  const bestLite = candidates[0]!;
  // Re-score best with per-event basedOn details
  const bestDetailed = scoreCandidate(
    input,
    bestLite.time,
    events,
    ayanamsaId,
    true
  );
  const best: RectificationCandidate = {
    offsetMinutes: bestLite.offsetMinutes,
    ...bestDetailed,
  };

  let confidence: RectificationResult["confidence"] = "low";
  if (best.score >= 0.75 && events.length >= 5) confidence = "high";
  else if (best.score >= 0.5 && events.length >= 3) confidence = "medium";

  const top = candidates.slice(0, 15);
  const second = top[1];
  const lagnaCaution = Boolean(
    second &&
      second.ascendantSignIndex !== best.ascendantSignIndex &&
      Math.abs(best.score - second.score) <= 0.1
  );

  return {
    best,
    candidates: top,
    confidence,
    reasoning: {
      en: `Best match ${best.time} (${best.offsetMinutes >= 0 ? "+" : ""}${best.offsetMinutes} min) explained ${best.matched}/${events.length} events via Vimshottari dasha lords (event-match ratio ${(best.score * 100).toFixed(0)}% of events — not “% true birth time”). Confidence: ${confidence}.`,
      hi: `सर्वोत्तम समय ${best.time} (${best.offsetMinutes} मिनट) — ${best.matched}/${events.length} घटनाएँ दशा स्वामियों से मेल (घटना-मेल अनुपात, “सही जन्म समय %” नहीं)। विश्वसनीयता: ${confidence}।`,
    },
    lagnaCaution,
    lagnaCautionNote: lagnaCaution
      ? {
          en: `Caution: top candidates have different Lagnas (${best.ascendantSign.en} vs ${second!.ascendantSign.en}) with near-equal scores — confirm with records or an astrologer.`,
          hi: `सावधानी: शीर्ष उम्मीदवारों की लग्न भिन्न (${best.ascendantSign.hi} बनाम ${second!.ascendantSign.hi}) और स्कोर लगभग समान — अभिलेख या ज्योतिषी से पुष्टि करें।`,
        }
      : null,
    meta: {
      windowMinutes: window,
      stepMinutes: step,
      eventCount: events.length,
      methodology: {
        en: "Sweep approximate birth time ± window; score Vimshottari maha/antar lords vs event domain houses (occupy or rule). Heuristic alignment aid — not certificate-grade proof.",
        hi: "अनुमानित जन्म समय ± विंडो; विंशोत्तरी महा/अंतर स्वामी बनाम घटना भाव। अनुमानित संरेखण — प्रमाण-पत्र स्तर नहीं।",
      },
      disclaimer: {
        en: "Prefer hospital/birth records when available. Not medical, legal or forensic timing. Low confidence means weak or ambiguous event alignment.",
        hi: "उपलब्ध हो तो अस्पताल/जन्म अभिलेख प्राथमिक। चिकित्सकीय/कानूनी/फोरेंसिक समय नहीं। कम विश्वसनीयता = कमज़ोर या अस्पष्ट घटना मेल।",
      },
    },
  };
}
