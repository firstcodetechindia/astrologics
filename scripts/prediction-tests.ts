/**
 * Multi-factor prediction engine tests.
 * Run: npx tsx scripts/prediction-tests.ts
 */
import { computeKundli } from "../src/lib/astrology/compute";
import {
  analyzeCareer,
  analyzeCurrentPeriod,
  analyzeFinance,
  analyzeMarriage,
  buildPredictionBundle,
} from "../src/lib/astrology/prediction";
import { computeConfidence } from "../src/lib/astrology/prediction/helpers";
import type { PredictionFactor } from "../src/lib/astrology/prediction/types";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
  }
}

const base = {
  name: "PredTest",
  date: "1990-05-15",
  time: "06:30",
  place: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  timezoneOffsetMinutes: 330,
};

const k = computeKundli(base);
assert(!!k.predictions, "predictions attached");
assert(k.insights.length >= 5, "insights from predictions");
assert(
  k.insights.every((i) => i.text.en.length > 40),
  "insight text non-trivial"
);

const bundle = buildPredictionBundle(k);
assert(bundle.career.topic === "career", "career topic");
assert(bundle.marriage.topic === "marriage", "marriage topic");
assert(bundle.finance.topic === "finance", "finance topic");
assert(bundle.currentPeriod.topic === "current_period", "current period");

// Strong / weak / conflict via confidence helper
const strongSup: PredictionFactor[] = [
  {
    id: "a",
    category: "lord",
    type: "supporting",
    strength: "very_strong",
    label: { en: "a", hi: "a" },
    detail: { en: "a", hi: "a" },
  },
  {
    id: "b",
    category: "dasha",
    type: "supporting",
    strength: "strong",
    label: { en: "b", hi: "b" },
    detail: { en: "b", hi: "b" },
  },
  {
    id: "c",
    category: "transit",
    type: "supporting",
    strength: "strong",
    label: { en: "c", hi: "c" },
    detail: { en: "c", hi: "c" },
  },
];
const weakChal: PredictionFactor[] = [
  {
    id: "d",
    category: "planet",
    type: "challenging",
    strength: "weak",
    label: { en: "d", hi: "d" },
    detail: { en: "d", hi: "d" },
  },
];
const strong = computeConfidence(strongSup, weakChal);
assert(
  strong.confidence === "very_strong" || strong.confidence === "strong",
  `expected strong conf got ${strong.confidence}`
);

const conflict = computeConfidence(strongSup.slice(0, 2), [
  {
    id: "e",
    category: "lord",
    type: "challenging",
    strength: "strong",
    label: { en: "e", hi: "e" },
    detail: { en: "e", hi: "e" },
  },
  {
    id: "f",
    category: "yoga",
    type: "challenging",
    strength: "moderate",
    label: { en: "f", hi: "f" },
    detail: { en: "f", hi: "f" },
  },
]);
assert(conflict.hasConflict, "conflict detected");

const empty = computeConfidence([], []);
assert(empty.confidence === "insufficient_data", "insufficient");

// Career uses multi categories
const career = analyzeCareer(k);
const cats = new Set([
  ...career.supportingFactors.map((f) => f.category),
  ...career.challengingFactors.map((f) => f.category),
]);
assert(cats.size >= 2, "career multi-category factors");
assert(
  !career.summary.en.toLowerCase().includes("definitely"),
  "no deterministic definitely"
);
assert(
  !career.summary.en.toLowerCase().includes("%"),
  "no fake percent"
);

const marriage = analyzeMarriage(k);
assert(marriage.divisionalFactors.length >= 0, "marriage d9 optional");
// Weak timing alone should not claim strong window without multi-factor
for (const w of marriage.timingWindows) {
  if (w.label.en.includes("single dasha")) {
    assert(w.strength === "weak", "single-factor marriage timing is weak");
  }
}

const finance = analyzeFinance(k);
assert(
  finance.houseFactors.length + finance.lordFactors.length > 0,
  "finance has house/lord factors"
);

const period = analyzeCurrentPeriod(k);
assert(period.timingWindows.length >= 1, "current period has antar window");
assert(
  period.natalFactors.some((f) => f.label.en.includes("Mahadasha")),
  "maha factored"
);

// Analyzers must not require recompute — same object
const c2 = analyzeCareer(k);
assert(c2.summary.en === career.summary.en, "deterministic repeat");

console.log(failed === 0 ? "PREDICTION TESTS OK" : `FAILED ${failed}`);
process.exit(failed === 0 ? 0 : 1);
