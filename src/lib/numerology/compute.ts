/**
 * Numerology calculation layer — Chaldean, Pythagorean, Vedic Mulank/Bhagyank, Lo Shu.
 * Pure numbers + structured facts; profiles supply interpretation.
 * Spec: .cursor/skills/numerology/SKILL.md
 */

import {
  compatibilityTier,
  profileFor,
  type Loc,
  type NumberProfile,
} from "./profiles";

/** Chaldean (no 9 — sacred/complete). */
const CHALDEAN: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8,
};

/** Pythagorean sequential A–Z → 1–9. */
const PYTHAGOREAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set("aeiou");

/** Lo Shu layout: 4-9-2 / 3-5-7 / 8-1-6 */
export const LO_SHU_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const;

const ARROWS: { id: string; cells: [number, number, number]; title: Loc; meaning: Loc }[] = [
  {
    id: "mental",
    cells: [4, 9, 2],
    title: { en: "Mental plane", hi: "मानसिक तल" },
    meaning: {
      en: "Thinking, imagination and idea flow are supported when 4–9–2 are all present.",
      hi: "4–9–2 सभी होने पर सोच, कल्पना और विचार-प्रवाह समर्थित।",
    },
  },
  {
    id: "emotional",
    cells: [3, 5, 7],
    title: { en: "Emotional plane", hi: "भावनात्मक तल" },
    meaning: {
      en: "Feelings, intuition and connection express with ease when 3–5–7 are present.",
      hi: "3–5–7 होने पर भाव, अंतर्ज्ञान और जुड़ाव सहज।",
    },
  },
  {
    id: "practical",
    cells: [8, 1, 6],
    title: { en: "Practical plane", hi: "व्यावहारिक तल" },
    meaning: {
      en: "Getting things done and grounding ideas is natural when 8–1–6 are present.",
      hi: "8–1–6 होने पर काम पूरा करना और विचारों को ज़मीन पर उतारना सहज।",
    },
  },
  {
    id: "thought",
    cells: [4, 3, 8],
    title: { en: "Thought column", hi: "विचार स्तंभ" },
    meaning: {
      en: "Planning and structured thinking support decisions (4–3–8).",
      hi: "योजना और संरचित सोच निर्णयों को सहारा देती है (4–3–8)।",
    },
  },
  {
    id: "will",
    cells: [9, 5, 1],
    title: { en: "Will column", hi: "संकल्प स्तंभ" },
    meaning: {
      en: "Determination and follow-through (9–5–1) can be a signature strength.",
      hi: "दृढ़ता और काम पूरा करना (9–5–1) पहचान शक्ति हो सकती है।",
    },
  },
  {
    id: "action",
    cells: [2, 7, 6],
    title: { en: "Action column", hi: "कर्म स्तंभ" },
    meaning: {
      en: "Moving from insight into helpful action (2–7–6).",
      hi: "अंतर्दृष्टि से उपयोगी कर्म की ओर बढ़ना (2–7–6)।",
    },
  },
  {
    id: "diag-success",
    cells: [4, 5, 6],
    title: { en: "Success diagonal", hi: "सफलता विकर्ण" },
    meaning: {
      en: "Ambition aligned with heart and home (4–5–6) favours lasting achievement.",
      hi: "हृदय और घर से जुड़ी महत्वाकांक्षा (4–5–6) स्थायी उपलब्धि को अनुकूल।",
    },
  },
  {
    id: "diag-prosperity",
    cells: [2, 5, 8],
    title: { en: "Prosperity diagonal", hi: "समृद्धि विकर्ण" },
    meaning: {
      en: "Sensitivity, adaptability and material mastery (2–5–8) support prosperity themes.",
      hi: "संवेदनशीलता, अनुकूलन और भौतिक दक्षता (2–5–8) समृद्धि विषयों को सहारा।",
    },
  },
];

const CELL_THEME: Record<number, Loc> = {
  1: { en: "Willpower & leadership", hi: "संकल्प व नेतृत्व" },
  2: { en: "Intuition & diplomacy", hi: "अंतर्ज्ञान व कूटनीति" },
  3: { en: "Creativity & expression", hi: "रचनात्मकता व अभिव्यक्ति" },
  4: { en: "Order & foundation", hi: "व्यवस्था व नींव" },
  5: { en: "Freedom & change", hi: "स्वतंत्रता व परिवर्तन" },
  6: { en: "Care & responsibility", hi: "देखभाल व जिम्मेदारी" },
  7: { en: "Analysis & inner life", hi: "विश्लेषण व आंतरिक जीवन" },
  8: { en: "Ambition & material mastery", hi: "महत्वाकांक्षा व भौतिक दक्षता" },
  9: { en: "Compassion & completion", hi: "करुणा व पूर्णता" },
};

export function reduceNumber(n: number, keepMaster = true): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9 && !(keepMaster && (x === 11 || x === 22 || x === 33))) {
    x = String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

/** Parse ISO `YYYY-MM-DD` → day/month/year. */
export function parseIsoDate(isoDate: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/**
 * Vedic Mulank (day only) + Bhagyank (all DDMMYYYY digits).
 * Bhagyank preserves master 11/22; Mulank is single digit.
 */
export function vedicFromDate(isoDate: string) {
  const p = parseIsoDate(isoDate);
  if (!p) throw new Error("Invalid date");
  const mulank = reduceNumber(sumDigits(p.d), false);
  const digitStr = `${String(p.d).padStart(2, "0")}${String(p.m).padStart(2, "0")}${p.y}`;
  const digitSum = digitStr.split("").reduce((s, ch) => s + Number(ch), 0);
  const bhagyank = reduceNumber(digitSum, true);
  return {
    date: isoDate,
    day: p.d,
    month: p.m,
    year: p.y,
    mulank,
    bhagyank,
    digitSum,
    mulankProfile: profileFor(mulank),
    bhagyankProfile: profileFor(bhagyank),
  };
}

export type NameSystem = "chaldean" | "pythagorean";

export function nameNumbers(name: string, system: NameSystem) {
  const map = system === "pythagorean" ? PYTHAGOREAN : CHALDEAN;
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  let destiny = 0;
  let soul = 0;
  let personality = 0;
  const letterValues: { letter: string; value: number }[] = [];
  for (const ch of clean) {
    const v = map[ch] ?? 0;
    letterValues.push({ letter: ch.toUpperCase(), value: v });
    destiny += v;
    if (VOWELS.has(ch)) soul += v;
    else personality += v;
  }
  // Chaldean/Pythagorean: preserve master numbers on name totals per skill.
  return {
    name: name.trim(),
    system,
    expression: reduceNumber(destiny, true),
    soulUrge: reduceNumber(soul, true),
    personality: reduceNumber(personality, true),
    raw: { destiny, soul, personality },
    letterValues,
    expressionProfile: profileFor(reduceNumber(destiny, true)),
    soulProfile: profileFor(reduceNumber(soul, true)),
    personalityProfile: profileFor(reduceNumber(personality, true)),
  };
}

export function loShuFromDate(isoDate: string) {
  const p = parseIsoDate(isoDate);
  if (!p) throw new Error("Invalid date");
  const digitStr = `${String(p.d).padStart(2, "0")}${String(p.m).padStart(2, "0")}${p.y}`;
  const grid: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };
  for (const ch of digitStr) {
    const d = Number(ch);
    if (d >= 1 && d <= 9) grid[d]++;
  }

  const present = (Object.keys(grid) as unknown as string[])
    .map(Number)
    .filter((n) => grid[n] > 0)
    .sort((a, b) => a - b);
  const missing = (Object.keys(grid) as unknown as string[])
    .map(Number)
    .filter((n) => grid[n] === 0)
    .sort((a, b) => a - b);

  const arrows = ARROWS.map((a) => {
    const counts = a.cells.map((n) => grid[n]);
    const complete = counts.every((c) => c > 0);
    return {
      ...a,
      counts,
      complete,
      status: complete
        ? ({ en: "Active arrow", hi: "सक्रिय तीर" } as Loc)
        : ({ en: "Incomplete", hi: "अधूरा" } as Loc),
    };
  });

  const activeArrows = arrows.filter((a) => a.complete);
  const weakPlanes = arrows.filter((a) => !a.complete && a.cells.every((n) => grid[n] === 0));

  return {
    date: isoDate,
    digitStr,
    grid,
    present,
    missing,
    arrows,
    activeArrows,
    weakPlanes,
    cellThemes: CELL_THEME,
    summary: {
      en:
        missing.length === 0
          ? "All digits 1–9 appear in your birth date grid — a full Lo Shu pattern. Emphasised cells and active arrows show where energy concentrates."
          : `Your Lo Shu shows ${present.length} active numbers and ${missing.length} missing. Missing numbers are growth themes — not defects.`,
      hi:
        missing.length === 0
          ? "आपके जन्म तिथि ग्रिड में 1–9 सभी अंक हैं — पूर्ण लो शू पैटर्न। प्रबल कोशिकाएँ और सक्रिय तीर बताते हैं ऊर्जा कहाँ केंद्रित है।"
          : `आपके लो शू में ${present.length} सक्रिय अंक और ${missing.length} अनुपस्थित। अनुपस्थित अंक दोष नहीं — विकास के विषय हैं।`,
    } as Loc,
  };
}

export type NumerologyReport = {
  name: string;
  date: string;
  vedic: ReturnType<typeof vedicFromDate>;
  chaldean: ReturnType<typeof nameNumbers>;
  pythagorean: ReturnType<typeof nameNumbers>;
  loShu: ReturnType<typeof loShuFromDate>;
  nameVsDestiny: {
    chaldeanVsBhagyank: ReturnType<typeof compatibilityTier>;
    pythagoreanVsBhagyank: ReturnType<typeof compatibilityTier>;
  };
  personalYear: { year: number; number: number; profile: NumberProfile };
};

export function buildNumerologyReport(name: string, isoDate: string): NumerologyReport {
  const vedic = vedicFromDate(isoDate);
  const chaldean = nameNumbers(name, "chaldean");
  const pythagorean = nameNumbers(name, "pythagorean");
  const loShu = loShuFromDate(isoDate);
  const year = new Date().getFullYear();
  const pyTotal = sumDigits(vedic.day) + sumDigits(vedic.month) + sumDigits(year);
  const personalYearNum = reduceNumber(pyTotal, false);

  return {
    name: name.trim(),
    date: isoDate,
    vedic,
    chaldean,
    pythagorean,
    loShu,
    nameVsDestiny: {
      chaldeanVsBhagyank: compatibilityTier(chaldean.expression, vedic.bhagyank),
      pythagoreanVsBhagyank: compatibilityTier(pythagorean.expression, vedic.bhagyank),
    },
    personalYear: {
      year,
      number: personalYearNum,
      profile: profileFor(personalYearNum),
    },
  };
}

export function compatibilityReport(a: number, b: number) {
  const tier = compatibilityTier(a, b);
  const pa = profileFor(a);
  const pb = profileFor(b);
  return {
    a,
    b,
    tier,
    label: {
      friendly: { en: "Friendly / supportive", hi: "मित्र / सहायक" },
      neutral: { en: "Neutral / workable", hi: "तटस्थ / कामचलाऊ" },
      challenging: { en: "Challenging / growth edge", hi: "चुनौतीपूर्ण / विकास किनारा" },
    }[tier] as Loc,
    note: {
      en: `${pa.title.en} (${pa.planet.en}) with ${pb.title.en} (${pb.planet.en}) — ${tier} dynamic. Use as reflective guidance, not fate.`,
      hi: `${pa.title.hi} (${pa.planet.hi}) व ${pb.title.hi} (${pb.planet.hi}) — ${tier === "friendly" ? "मित्र" : tier === "challenging" ? "चुनौतीपूर्ण" : "तटस्थ"} गति। यह चिंतन मार्गदर्शन है, नियति नहीं।`,
    } as Loc,
  };
}
