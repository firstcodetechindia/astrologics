/** Multi-factor prediction types — qualitative only, no fake %. */

export type FactorStrength = "very_strong" | "strong" | "moderate" | "weak";

export type FactorPolarity = "supporting" | "challenging" | "neutral";

export type PredictionConfidence =
  | "very_strong"
  | "strong"
  | "moderate"
  | "weak"
  | "insufficient_data";

export type PredictionTopic =
  | "career"
  | "business"
  | "marriage"
  | "finance"
  | "education"
  | "family"
  | "children"
  | "foreign_travel"
  | "spirituality"
  | "current_period";

export type PredictionFactor = {
  id: string;
  category:
    | "natal"
    | "house"
    | "lord"
    | "planet"
    | "aspect"
    | "yoga"
    | "dasha"
    | "transit"
    | "divisional"
    | "dosha";
  type: FactorPolarity;
  strength: FactorStrength;
  label: { en: string; hi: string };
  detail: { en: string; hi: string };
};

export type TimingWindow = {
  topic: PredictionTopic;
  windowStart: string;
  windowEnd: string;
  strength: FactorStrength;
  label: { en: string; hi: string };
  supportingFactors: string[];
  challengingFactors: string[];
};

export type TopicPrediction = {
  topic: PredictionTopic;
  title: { en: string; hi: string };
  themes: { en: string; hi: string }[];
  natalFactors: PredictionFactor[];
  houseFactors: PredictionFactor[];
  lordFactors: PredictionFactor[];
  planetFactors: PredictionFactor[];
  aspectFactors: PredictionFactor[];
  yogaFactors: PredictionFactor[];
  dashaFactors: PredictionFactor[];
  transitFactors: PredictionFactor[];
  divisionalFactors: PredictionFactor[];
  supportingFactors: PredictionFactor[];
  challengingFactors: PredictionFactor[];
  timingWindows: TimingWindow[];
  confidence: PredictionConfidence;
  hasConflict: boolean;
  summary: { en: string; hi: string };
};

export type PredictionBundle = {
  career: TopicPrediction;
  business: TopicPrediction;
  marriage: TopicPrediction;
  finance: TopicPrediction;
  education: TopicPrediction;
  family: TopicPrediction;
  children: TopicPrediction;
  foreignTravel: TopicPrediction;
  spirituality: TopicPrediction;
  currentPeriod: TopicPrediction;
};
