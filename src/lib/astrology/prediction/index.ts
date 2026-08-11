import type { KundliResult } from "../types";
import {
  analyzeBusiness,
  analyzeCareer,
  analyzeChildren,
  analyzeCurrentPeriod,
  analyzeEducation,
  analyzeFamily,
  analyzeFinance,
  analyzeForeignTravel,
  analyzeMarriage,
  analyzeSpirituality,
} from "./analyzers";
import type { PredictionBundle, TopicPrediction } from "./types";

export type { PredictionBundle, PredictionFactor, TopicPrediction } from "./types";

export {
  analyzeBusiness,
  analyzeCareer,
  analyzeChildren,
  analyzeCurrentPeriod,
  analyzeEducation,
  analyzeFamily,
  analyzeFinance,
  analyzeForeignTravel,
  analyzeMarriage,
  analyzeSpirituality,
} from "./analyzers";

/** Run all topic engines on one calculated kundli (no recalculation). */
export function buildPredictionBundle(k: KundliResult): PredictionBundle {
  return {
    career: analyzeCareer(k),
    business: analyzeBusiness(k),
    marriage: analyzeMarriage(k),
    finance: analyzeFinance(k),
    education: analyzeEducation(k),
    family: analyzeFamily(k),
    children: analyzeChildren(k),
    foreignTravel: analyzeForeignTravel(k),
    spirituality: analyzeSpirituality(k),
    currentPeriod: analyzeCurrentPeriod(k),
  };
}

/** Compact text for AI — factors only, no invented data. */
export function formatPredictionsForAi(bundle: PredictionBundle): string {
  const topics: [string, TopicPrediction][] = [
    ["career", bundle.career],
    ["business", bundle.business],
    ["marriage", bundle.marriage],
    ["finance", bundle.finance],
    ["education", bundle.education],
    ["family", bundle.family],
    ["children", bundle.children],
    ["foreign_travel", bundle.foreignTravel],
    ["spirituality", bundle.spirituality],
    ["current_period", bundle.currentPeriod],
  ];

  const blocks = topics.map(([key, t]) => {
    const sup = t.supportingFactors
      .slice(0, 6)
      .map((f) => `+ [${f.strength}] ${f.label.en}: ${f.detail.en}`)
      .join("\n");
    const chal = t.challengingFactors
      .slice(0, 6)
      .map((f) => `- [${f.strength}] ${f.label.en}: ${f.detail.en}`)
      .join("\n");
    const timing = t.timingWindows
      .map(
        (w) =>
          `Window ${w.windowStart}→${w.windowEnd} (${w.strength}): ${w.label.en}`
      )
      .join("; ");
    return [
      `### ${key.toUpperCase()} — confidence: ${t.confidence}${t.hasConflict ? " (conflicting factors)" : ""}`,
      `Summary: ${t.summary.en}`,
      `Themes: ${t.themes.map((x) => x.en).join("; ")}`,
      "Supporting:",
      sup || "(none)",
      "Challenging:",
      chal || "(none)",
      timing ? `Timing: ${timing}` : "Timing: no multi-factor window",
    ].join("\n");
  });

  return [
    "=== MULTI-FACTOR PREDICTION ENGINE (authoritative factors — do not invent) ===",
    "Qualitative confidence only (very_strong/strong/moderate/weak/insufficient_data). No probability %.",
    ...blocks,
    "=== END PREDICTION FACTORS ===",
  ].join("\n\n");
}
