import type { KundliResult, LifeInsight } from "./types";
import type { TopicPrediction } from "./prediction/types";

/**
 * Build user-facing insights from multi-factor predictions (not single-planet templates).
 */
export function buildInsightsFromPredictions(k: KundliResult): LifeInsight[] {
  const p = k.predictions;
  if (!p) return [];

  const map = (area: string, t: TopicPrediction): LifeInsight => ({
    area,
    title: t.title,
    text: {
      en: formatInsightEn(t),
      hi: formatInsightHi(t),
    },
  });

  return [
    map("current_period", p.currentPeriod),
    map("career", p.career),
    map("marriage", p.marriage),
    map("finance", p.finance),
    map("education", p.education),
    map("business", p.business),
    map("family", p.family),
  ];
}

function formatInsightEn(t: TopicPrediction): string {
  const conf = t.confidence.replace("_", " ");
  const sup = t.supportingFactors
    .slice(0, 3)
    .map((f) => f.label.en)
    .join("; ");
  const chal = t.challengingFactors
    .slice(0, 2)
    .map((f) => f.label.en)
    .join("; ");
  const timing = t.timingWindows[0];
  let text = t.summary.en;
  if (sup) text += ` Supporting: ${sup}.`;
  if (chal) text += ` Challenging: ${chal}.`;
  if (timing) {
    text += ` Timing note: ${timing.label.en} (${timing.windowStart} → ${timing.windowEnd}, ${timing.strength}).`;
  }
  text += ` Indication strength: ${conf}.`;
  return text;
}

function formatInsightHi(t: TopicPrediction): string {
  const conf = t.confidence;
  const confHi: Record<string, string> = {
    very_strong: "बहुत मजबूत",
    strong: "मजबूत",
    moderate: "मध्यम",
    weak: "कमजोर",
    insufficient_data: "अपर्याप्त डेटा",
  };
  const sup = t.supportingFactors
    .slice(0, 3)
    .map((f) => f.label.hi)
    .join("; ");
  const chal = t.challengingFactors
    .slice(0, 2)
    .map((f) => f.label.hi)
    .join("; ");
  let text = t.summary.hi;
  if (sup) text += ` अनुकूल: ${sup}।`;
  if (chal) text += ` चुनौती: ${chal}।`;
  if (t.timingWindows[0]) {
    const w = t.timingWindows[0];
    text += ` समय: ${w.label.hi} (${w.windowStart} → ${w.windowEnd})।`;
  }
  text += ` संकेत बल: ${confHi[conf] || conf}।`;
  return text;
}

/** Legacy stub — predictions now drive insights via buildInsightsFromPredictions. */
export function buildInsights(): LifeInsight[] {
  return [];
}
