/**
 * Sade Sati tracker — Saturn transit vs natal Moon sign.
 * Follows `.cursor/skills/sade-sati-tracker/SKILL.md` (approved).
 * Dhaiya (4th/8th) is OFF by default.
 */
import { SIGNS } from "./constants";
import { lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { getSiderealPlanets } from "./planets";

export type SadePhaseNum = 1 | 2 | 3;

export type SadeCycleSegment = {
  phase: SadePhaseNum;
  label: { en: string; hi: string };
  start: string; // YYYY-MM-DD
  end: string;
};

export type SadeSatiTracker = {
  natalMoonSign: { en: string; hi: string; index: number };
  saturnSign: { en: string; hi: string; index: number };
  asOf: string;
  active: boolean;
  phase: SadePhaseNum | null;
  /** Legacy string phase for older UI */
  phaseKey: "none" | "rising" | "peak" | "setting";
  phaseLabel: { en: string; hi: string };
  intensityHint: { en: string; hi: string };
  currentWindow: { start: string; end: string } | null;
  fullCycle: SadeCycleSegment[];
  basedOn: { en: string; hi: string };
  methodology: { en: string; hi: string };
  dhaiyaEnabled: false;
  disclaimer: { en: string; hi: string };
};

const PHASE_LABELS: Record<
  SadePhaseNum | "none",
  { en: string; hi: string; key: SadeSatiTracker["phaseKey"] }
> = {
  none: {
    en: "Not in Sade Sati now",
    hi: "अभी साढ़े साती नहीं",
    key: "none",
  },
  1: {
    en: "Rising / Pehli Sade Sati (Saturn in 12th from Moon)",
    hi: "आरंभ / पहली साढ़े साती (चंद्र से 12वें में शनि)",
    key: "rising",
  },
  2: {
    en: "Peak / Dwitiya Sade Sati (Saturn on Moon sign)",
    hi: "मध्य / दूसरी साढ़े साती (चंद्र राशि पर शनि)",
    key: "peak",
  },
  3: {
    en: "Setting / Teesri Sade Sati (Saturn in 2nd from Moon)",
    hi: "अंतिम / तीसरी साढ़े साती (चंद्र से 2रे में शनि)",
    key: "setting",
  },
};

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

/** Sidereal Saturn sign index at UTC instant. */
export function saturnSignAt(date: Date): number {
  const ayanamsa = lahiriAyanamsaFromDate(date);
  const { planets } = getSiderealPlanets(date, ayanamsa);
  const saturn = planets.find((p) => p.id === "saturn");
  if (!saturn) throw new Error("Saturn missing from ephemeris");
  return signIndexFromLongitude(saturn.longitude);
}

export function sadePhaseForSigns(
  moonSignIndex: number,
  saturnSignIndex: number
): SadePhaseNum | null {
  const twelfth = (moonSignIndex + 11) % 12;
  const first = moonSignIndex;
  const second = (moonSignIndex + 1) % 12;
  if (saturnSignIndex === twelfth) return 1;
  if (saturnSignIndex === first) return 2;
  if (saturnSignIndex === second) return 3;
  return null;
}

/**
 * Sample Saturn signs every `stepDays`, then binary-refine each sign change
 * to the UTC calendar day of ingress.
 */
function saturnIngressTimeline(
  from: Date,
  to: Date,
  stepDays = 10
): { date: string; sign: number }[] {
  const samples: { t: number; sign: number }[] = [];
  let cursor = new Date(from.getTime());
  const endMs = to.getTime();
  while (cursor.getTime() <= endMs) {
    samples.push({ t: cursor.getTime(), sign: saturnSignAt(cursor) });
    cursor = addDays(cursor, stepDays);
  }
  // Ensure end sample
  const endSign = saturnSignAt(to);
  if (!samples.length || samples[samples.length - 1].t !== to.getTime()) {
    samples.push({ t: to.getTime(), sign: endSign });
  }

  const ingresses: { date: string; sign: number }[] = [
    { date: isoDay(new Date(samples[0].t)), sign: samples[0].sign },
  ];

  for (let i = 1; i < samples.length; i++) {
    if (samples[i].sign === samples[i - 1].sign) continue;
    // Binary search for first day where sign === samples[i].sign
    let lo = samples[i - 1].t;
    let hi = samples[i].t;
    const target = samples[i].sign;
    while (hi - lo > 12 * 3600_000) {
      const mid = Math.floor((lo + hi) / 2);
      const s = saturnSignAt(new Date(mid));
      if (s === target) hi = mid;
      else lo = mid;
    }
    // Walk day-by-day from lo
    let day = new Date(lo);
    day.setUTCHours(12, 0, 0, 0);
    const limit = new Date(hi);
    limit.setUTCHours(12, 0, 0, 0);
    let found = isoDay(new Date(hi));
    while (day.getTime() <= limit.getTime() + 86400_000) {
      if (saturnSignAt(day) === target) {
        found = isoDay(day);
        break;
      }
      day = addDays(day, 1);
    }
    ingresses.push({ date: found, sign: target });
  }
  return ingresses;
}

function intensityFor(phase: SadePhaseNum | null): { en: string; hi: string } {
  if (phase === 2) {
    return {
      en: "Peak phase — often felt most strongly; read with current dasha, not as doom.",
      hi: "मध्य चरण — अक्सर सबसे अधिक अनुभव; दशा के साथ पढ़ें, भय नहीं।",
    };
  }
  if (phase === 1 || phase === 3) {
    return {
      en: "Rising/setting phase — preparatory or winding-down intensity (similar culturally).",
      hi: "आरंभ/अंतिम चरण — तैयारी या समापन तीव्रता (सांस्कृतिक रूप से समान)।",
    };
  }
  return {
    en: "Not in the three Sade Sati signs from Moon right now.",
    hi: "अभी चंद्र से साढ़े साती की तीन राशियों में नहीं।",
  };
}

/**
 * Full tracker for natal Moon sign at `asOf`.
 */
export function trackSadeSati(
  moonSignIndex: number,
  asOf = new Date()
): SadeSatiTracker {
  const satSign = saturnSignAt(asOf);
  const phase = sadePhaseForSigns(moonSignIndex, satSign);
  const labelSrc = phase == null ? PHASE_LABELS.none : PHASE_LABELS[phase];

  const scanFrom = new Date(asOf);
  scanFrom.setUTCFullYear(scanFrom.getUTCFullYear() - 14);
  const scanTo = new Date(asOf);
  scanTo.setUTCFullYear(scanTo.getUTCFullYear() + 14);

  const ingresses = saturnIngressTimeline(scanFrom, scanTo, 12);
  const asOfDay = isoDay(asOf);

  // Build segments between consecutive ingresses
  type Seg = { sign: number; start: string; end: string };
  const segs: Seg[] = [];
  for (let i = 0; i < ingresses.length; i++) {
    const start = ingresses[i].date;
    const end =
      i + 1 < ingresses.length
        ? isoDay(addDays(new Date(ingresses[i + 1].date + "T12:00:00Z"), -1))
        : isoDay(scanTo);
    segs.push({ sign: ingresses[i].sign, start, end });
  }

  const phaseOfSign = (sign: number) =>
    sadePhaseForSigns(moonSignIndex, sign);

  // Contiguous Sade Sati block containing asOf (or next upcoming)
  let blockStartIdx = -1;
  let blockEndIdx = -1;
  for (let i = 0; i < segs.length; i++) {
    if (phaseOfSign(segs[i].sign) == null) continue;
    let j = i;
    while (j + 1 < segs.length && phaseOfSign(segs[j + 1].sign) != null) j++;
    const bStart = segs[i].start;
    const bEnd = segs[j].end;
    if (asOfDay >= bStart && asOfDay <= bEnd) {
      blockStartIdx = i;
      blockEndIdx = j;
      break;
    }
    if (asOfDay < bStart && blockStartIdx < 0) {
      blockStartIdx = i;
      blockEndIdx = j;
      break;
    }
    i = j;
  }

  const fullCycle: SadeCycleSegment[] = [];
  if (blockStartIdx >= 0) {
    for (let i = blockStartIdx; i <= blockEndIdx; i++) {
      const ph = phaseOfSign(segs[i].sign);
      if (ph == null) continue;
      fullCycle.push({
        phase: ph,
        label: {
          en: PHASE_LABELS[ph].en,
          hi: PHASE_LABELS[ph].hi,
        },
        start: segs[i].start,
        end: segs[i].end,
      });
    }
  }

  let currentWindow: { start: string; end: string } | null = null;
  if (phase != null) {
    const hit = fullCycle.find((c) => c.phase === phase);
    if (hit && asOfDay >= hit.start && asOfDay <= hit.end) {
      currentWindow = { start: hit.start, end: hit.end };
    } else {
      // Fallback: find segment covering asOf
      const cover = segs.find(
        (s) => asOfDay >= s.start && asOfDay <= s.end && phaseOfSign(s.sign) != null
      );
      if (cover) currentWindow = { start: cover.start, end: cover.end };
    }
  }

  return {
    natalMoonSign: {
      en: SIGNS[moonSignIndex].en,
      hi: SIGNS[moonSignIndex].hi,
      index: moonSignIndex,
    },
    saturnSign: {
      en: SIGNS[satSign].en,
      hi: SIGNS[satSign].hi,
      index: satSign,
    },
    asOf: asOf.toISOString(),
    active: phase != null,
    phase,
    phaseKey: labelSrc.key,
    phaseLabel: { en: labelSrc.en, hi: labelSrc.hi },
    intensityHint: intensityFor(phase),
    currentWindow,
    fullCycle,
    basedOn: {
      en: `Natal Moon ${SIGNS[moonSignIndex].en}; transit Saturn ${SIGNS[satSign].en} at ${asOfDay}`,
      hi: `जन्म चंद्र ${SIGNS[moonSignIndex].hi}; गोचर शनि ${SIGNS[satSign].hi} (${asOfDay})`,
    },
    methodology: {
      en: "Sade Sati = Saturn in 12th, same, or 2nd sign from natal Moon. Phase windows from Saturn sidereal sign ingress (astronomy-engine + Lahiri). Dhaiya off.",
      hi: "साढ़े साती = जन्म चंद्र से 12वीं, समान या 2री राशि में शनि। चरण सीमा शनि सायन राशि प्रवेश से। ढैया बंद।",
    },
    dhaiyaEnabled: false,
    disclaimer: {
      en: "Results vary with dasha and chart support — not destiny. Not medical or financial advice; confirm with an astrologer for life decisions.",
      hi: "परिणाम दशा व कुंडली समर्थन से बदलते हैं — नियति नहीं। चिकित्सा/वित्तीय सलाह नहीं; जीवन निर्णयों हेतु ज्योतिषी से पुष्टि करें।",
    },
  };
}
