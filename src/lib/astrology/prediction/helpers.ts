import { SIGN_LORDS } from "../constants";
import type { KundliResult, PlanetPosition } from "../types";
import type {
  FactorPolarity,
  FactorStrength,
  PredictionConfidence,
  PredictionFactor,
  PredictionTopic,
  TimingWindow,
  TopicPrediction,
} from "./types";

export function planetById(k: KundliResult): Record<string, PlanetPosition> {
  return Object.fromEntries(k.planets.map((p) => [p.id, p]));
}

export function lordIdOfSign(signIndex: number): string {
  return SIGN_LORDS[signIndex].en.toLowerCase();
}

export function houseLord(k: KundliResult, house: number): PlanetPosition | undefined {
  const h = k.houses.find((x) => x.number === house);
  if (!h) return undefined;
  return planetById(k)[lordIdOfSign(h.signIndex)];
}

export function occupants(k: KundliResult, house: number): PlanetPosition[] {
  return k.planets.filter((p) => p.house === house);
}

export function dignityStrength(p?: PlanetPosition): {
  polarity: FactorPolarity;
  strength: FactorStrength;
  note: { en: string; hi: string };
} {
  if (!p?.dignity) {
    return {
      polarity: "neutral",
      strength: "weak",
      note: { en: "Dignity unavailable", hi: "बल जानकारी अनुपलब्ध" },
    };
  }
  const kind = p.dignity.kind;
  if (kind === "exalted" || kind === "moolatrikona") {
    return {
      polarity: "supporting",
      strength: kind === "exalted" ? "very_strong" : "strong",
      note: {
        en: `${p.name.en} in ${p.dignity.label.en}`,
        hi: `${p.name.hi} — ${p.dignity.label.hi}`,
      },
    };
  }
  if (kind === "own") {
    return {
      polarity: "supporting",
      strength: "strong",
      note: {
        en: `${p.name.en} in own sign`,
        hi: `${p.name.hi} स्वराशि में`,
      },
    };
  }
  if (kind === "friendly") {
    return {
      polarity: "supporting",
      strength: "moderate",
      note: {
        en: `${p.name.en} in friendly sign`,
        hi: `${p.name.hi} मित्र राशि में`,
      },
    };
  }
  if (kind === "debilitated" || kind === "enemy") {
    return {
      polarity: "challenging",
      strength: kind === "debilitated" ? "strong" : "moderate",
      note: {
        en: `${p.name.en} in ${p.dignity.label.en}`,
        hi: `${p.name.hi} — ${p.dignity.label.hi}`,
      },
    };
  }
  return {
    polarity: "neutral",
    strength: "moderate",
    note: {
      en: `${p.name.en} in neutral dignity`,
      hi: `${p.name.hi} सामान्य स्थिति में`,
    },
  };
}

export function dusthana(house: number): boolean {
  return [6, 8, 12].includes(house);
}

export function kendra(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

export function trikona(house: number): boolean {
  return [1, 5, 9].includes(house);
}

export function factor(
  partial: Omit<PredictionFactor, "id"> & { id?: string }
): PredictionFactor {
  return {
    id:
      partial.id ||
      `${partial.category}-${partial.label.en}`.replace(/\s+/g, "-").toLowerCase(),
    ...partial,
  };
}

/** Does current maha/antar planet id match? */
export function dashaPlanetIds(k: KundliResult): {
  maha: string;
  antar: string;
  pratyantar?: string;
} {
  const nameToId = (en: string) =>
    k.planets.find((p) => p.name.en === en)?.id || en.toLowerCase();
  return {
    maha: nameToId(k.dasha.currentMaha.planet.en),
    antar: nameToId(k.dasha.currentAntar.planet.en),
    pratyantar: k.dasha.currentPratyantar
      ? nameToId(k.dasha.currentPratyantar.planet.en)
      : undefined,
  };
}

/** Dasha activates a planet if maha/antar/pratyantar is that planet. */
export function dashaActivates(k: KundliResult, planetId: string): FactorStrength | null {
  const d = dashaPlanetIds(k);
  if (d.maha === planetId && d.antar === planetId) return "very_strong";
  if (d.maha === planetId) return "strong";
  if (d.antar === planetId) return "strong";
  if (d.pratyantar === planetId) return "moderate";
  return null;
}

/** Dasha activates a house if dasha planet owns or occupies it. */
export function dashaActivatesHouse(
  k: KundliResult,
  house: number
): PredictionFactor | null {
  const d = dashaPlanetIds(k);
  const lord = houseLord(k, house);
  const byId = planetById(k);
  const hits: string[] = [];
  for (const [role, id] of [
    ["Mahadasha", d.maha],
    ["Antardasha", d.antar],
    ["Pratyantardasha", d.pratyantar],
  ] as const) {
    if (!id) continue;
    if (lord?.id === id) hits.push(`${role} is ${house}th lord`);
    if (byId[id]?.house === house) hits.push(`${role} planet occupies ${house}th`);
  }
  if (!hits.length) return null;
  return factor({
    category: "dasha",
    type: "supporting",
    strength: hits.length >= 2 ? "strong" : "moderate",
    label: {
      en: `Dasha activates house ${house}`,
      hi: `दशा भाव ${house} को सक्रिय करती है`,
    },
    detail: {
      en: hits.join("; "),
      hi: hits.join("; "),
    },
  });
}

export type TransitPlanet = {
  id: string;
  sign: { en: string; hi: string };
  houseFromLagna: number;
  houseFromMoon: number;
  isRetrograde: boolean;
};

export function transitPlanets(k: KundliResult): TransitPlanet[] {
  const tr = k.transits as { planets?: TransitPlanet[] } | undefined;
  return tr?.planets || [];
}

export function transitOnHouse(
  k: KundliResult,
  house: number,
  planetIds: string[]
): PredictionFactor[] {
  const out: PredictionFactor[] = [];
  for (const t of transitPlanets(k)) {
    if (!planetIds.includes(t.id)) continue;
    if (t.houseFromLagna !== house) continue;
    const supportive = ["jupiter", "venus", "mercury", "moon"].includes(t.id);
    out.push(
      factor({
        category: "transit",
        type: supportive ? "supporting" : "challenging",
        strength: t.id === "jupiter" || t.id === "saturn" ? "strong" : "moderate",
        label: {
          en: `${t.id} transit on house ${house}`,
          hi: `${t.id} गोचर भाव ${house} पर`,
        },
        detail: {
          en: `${t.sign.en}${t.isRetrograde ? " (R)" : ""} from Lagna — read with natal + dasha, not alone.`,
          hi: `लग्न से ${t.sign.hi}${t.isRetrograde ? " (R)" : ""} — अकेले नहीं, जन्म कुंडली + दशा के साथ देखें।`,
        },
      })
    );
  }
  return out;
}

export function aspectsOnHouse(k: KundliResult, house: number): PredictionFactor[] {
  return (k.aspects || [])
    .filter((a) => a.toHouse === house)
    .slice(0, 6)
    .map((a) => {
      const benefic = ["jupiter", "venus", "mercury", "moon"].includes(a.fromId);
      return factor({
        category: "aspect",
        type: benefic ? "supporting" : "challenging",
        strength: "moderate",
        label: {
          en: `${a.fromName.en} ${a.aspect}th aspect on house ${house}`,
          hi: `${a.fromName.hi} की ${a.aspect}वीं दृष्टि भाव ${house} पर`,
        },
        detail: {
          en: a.label.en,
          hi: a.label.hi,
        },
      });
    });
}

export function yogasForTopic(
  k: KundliResult,
  ids: string[]
): PredictionFactor[] {
  return k.yogas
    .filter((y) => ids.some((id) => y.id.includes(id) || y.id === id))
    .map((y) =>
      factor({
        category: "yoga",
        type: y.level === "challenge" ? "challenging" : "supporting",
        strength: "moderate",
        label: y.name,
        detail: {
          en: `${y.meaning.en} (Natal yoga — activation depends on dasha/transit.)`,
          hi: `${y.meaning.hi} (जन्म योग — सक्रियता दशा/गोचर पर निर्भर।)`,
        },
      })
    );
}

export function splitPolarity(factors: PredictionFactor[]): {
  supporting: PredictionFactor[];
  challenging: PredictionFactor[];
} {
  return {
    supporting: factors.filter((f) => f.type === "supporting"),
    challenging: factors.filter((f) => f.type === "challenging"),
  };
}

function strengthScore(s: FactorStrength): number {
  return { very_strong: 4, strong: 3, moderate: 2, weak: 1 }[s];
}

/**
 * Qualitative confidence from independent supporting vs challenging factors.
 * Not a scientific probability.
 */
export function computeConfidence(
  supporting: PredictionFactor[],
  challenging: PredictionFactor[]
): { confidence: PredictionConfidence; hasConflict: boolean } {
  if (!supporting.length && !challenging.length) {
    return { confidence: "insufficient_data", hasConflict: false };
  }
  const s =
    supporting.reduce((a, f) => a + strengthScore(f.strength), 0) /
    Math.max(supporting.length, 1);
  const c =
    challenging.reduce((a, f) => a + strengthScore(f.strength), 0) /
    Math.max(challenging.length, 1);
  const hasConflict =
    supporting.length >= 1 &&
    challenging.length >= 1 &&
    Math.abs(s - c) <= 1.5;

  const net = supporting.reduce((a, f) => a + strengthScore(f.strength), 0) -
    challenging.reduce((a, f) => a + strengthScore(f.strength), 0) * 0.85;
  const independent = new Set([
    ...supporting.map((f) => f.category),
    ...challenging.map((f) => f.category),
  ]).size;

  if (independent < 2 && Math.abs(net) < 3) {
    return { confidence: "weak", hasConflict };
  }
  if (hasConflict) {
    return {
      confidence: net >= 2 ? "moderate" : "weak",
      hasConflict: true,
    };
  }
  if (net >= 8 && independent >= 3) return { confidence: "very_strong", hasConflict };
  if (net >= 5) return { confidence: "strong", hasConflict };
  if (net >= 2) return { confidence: "moderate", hasConflict };
  return { confidence: "weak", hasConflict };
}

export function dashaTimingWindow(
  k: KundliResult,
  topic: PredictionTopic,
  label: { en: string; hi: string },
  supportingIds: string[],
  challengingIds: string[]
): TimingWindow | null {
  const start = k.dasha.currentAntar.start;
  const end = k.dasha.currentAntar.end;
  if (!start || !end) return null;
  const d = dashaPlanetIds(k);
  const hits = [d.maha, d.antar, d.pratyantar].filter(Boolean) as string[];
  const supportHits = hits.filter((id) => supportingIds.includes(id));
  const challengeHits = hits.filter((id) => challengingIds.includes(id));
  if (!supportHits.length && !challengeHits.length) return null;
  const strength: FactorStrength =
    supportHits.length >= 2
      ? "strong"
      : supportHits.length === 1
        ? "moderate"
        : "weak";
  return {
    topic,
    windowStart: start,
    windowEnd: end,
    strength,
    label,
    supportingFactors: supportHits.map((id) => `dasha:${id}`),
    challengingFactors: challengeHits.map((id) => `dasha:${id}`),
  };
}

export function finalizeTopic(
  partial: Omit<
    TopicPrediction,
    "supportingFactors" | "challengingFactors" | "confidence" | "hasConflict" | "summary"
  > & { summary?: TopicPrediction["summary"] }
): TopicPrediction {
  const all = [
    ...partial.natalFactors,
    ...partial.houseFactors,
    ...partial.lordFactors,
    ...partial.planetFactors,
    ...partial.aspectFactors,
    ...partial.yogaFactors,
    ...partial.dashaFactors,
    ...partial.transitFactors,
    ...partial.divisionalFactors,
  ];
  const { supporting, challenging } = splitPolarity(all);
  const { confidence, hasConflict } = computeConfidence(supporting, challenging);

  const summary =
    partial.summary ||
    defaultSummary(partial.topic, supporting, challenging, confidence, hasConflict);

  return {
    ...partial,
    supportingFactors: supporting,
    challengingFactors: challenging,
    confidence,
    hasConflict,
    summary,
  };
}

function defaultSummary(
  topic: PredictionTopic,
  supporting: PredictionFactor[],
  challenging: PredictionFactor[],
  confidence: PredictionConfidence,
  hasConflict: boolean
): { en: string; hi: string } {
  const confLabel = {
    very_strong: "Very strong",
    strong: "Strong",
    moderate: "Moderate",
    weak: "Weak",
    insufficient_data: "Insufficient data",
  }[confidence];
  const confHi = {
    very_strong: "बहुत मजबूत",
    strong: "मजबूत",
    moderate: "मध्यम",
    weak: "कमजोर",
    insufficient_data: "अपर्याप्त डेटा",
  }[confidence];

  if (confidence === "insufficient_data") {
    return {
      en: `For ${topic}, not enough independent calculated factors were available for a clear multi-factor reading.`,
      hi: `${topic} के लिए स्पष्ट बहु-कारक पढ़ने हेतु पर्याप्त स्वतंत्र गणना कारक नहीं मिले।`,
    };
  }

  if (hasConflict) {
    return {
      en: `Your chart shows both supportive (${supporting.length}) and challenging (${challenging.length}) ${topic} indicators. Confidence: ${confLabel}. This often means opportunity with effort, delay, or careful timing — not a one-sided result.`,
      hi: `कुंडली में ${topic} के अनुकूल (${supporting.length}) और चुनौतीपूर्ण (${challenging.length}) दोनों संकेत हैं। विश्वास: ${confHi}। अक्सर अवसर के साथ प्रयास/देरी/समय-सावधानी का मिश्रण।`,
    };
  }

  if (supporting.length > challenging.length) {
    return {
      en: `Multiple calculated factors lean supportive for ${topic} (confidence: ${confLabel}). Progress still depends on dasha timing and effort — not guaranteed outcomes.`,
      hi: `${topic} के लिए कई गणना कारक अनुकूल झुकाव दिखाते हैं (विश्वास: ${confHi})। प्रगति दशा-समय और प्रयास पर निर्भर — सुनिश्चित परिणाम नहीं।`,
    };
  }

  return {
    en: `Challenging factors currently outweigh supports for ${topic} (confidence: ${confLabel}). Traditional Jyotish treats this as a call for patience and structure, not doom.`,
    hi: `${topic} में चुनौती कारक अभी समर्थन से अधिक हैं (विश्वास: ${confHi})। पारंपरिक ज्योतिष इसे धैर्य व संरचना का संकेत मानता है, विनाश नहीं।`,
  };
}

export function d10PlanetSign(k: KundliResult, planetId: string): string | null {
  const d10 = k.divisionalCharts?.D10 as
    | { planets?: { id: string; sign: { en: string } }[] }
    | undefined;
  return d10?.planets?.find((p) => p.id === planetId)?.sign.en ?? null;
}

export function d9PlanetSign(k: KundliResult, planetId: string): string | null {
  const d9 = k.divisionalCharts?.D9 as
    | { planets?: { id: string; sign: { en: string } }[] }
    | undefined;
  return d9?.planets?.find((p) => p.id === planetId)?.sign.en ?? null;
}

export function d10Lagna(k: KundliResult): string | null {
  const d10 = k.divisionalCharts?.D10 as
    | { lagna?: { sign?: { en?: string } } }
    | undefined;
  return d10?.lagna?.sign?.en ?? null;
}

export function d9Lagna(k: KundliResult): string | null {
  const d9 = k.divisionalCharts?.D9 as
    | { lagna?: { sign?: { en?: string } } }
    | undefined;
  return d9?.lagna?.sign?.en ?? null;
}
