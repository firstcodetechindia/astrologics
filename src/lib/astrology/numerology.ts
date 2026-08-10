/** Chaldean letter values (common Indian numerology apps). */
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

const PYTHAGOREAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

function reduce(n: number, keepMaster = true): number {
  while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

export function lifePathFromDate(isoDate: string) {
  const digits = isoDate.replace(/-/g, "");
  const total = digits.split("").reduce((s, d) => s + Number(d), 0);
  const lifePath = reduce(total);
  const [y, m, d] = isoDate.split("-").map(Number);
  const radical = reduce(sumDigits(d), false);
  return {
    date: isoDate,
    radical,
    lifePath,
    day: d,
    month: m,
    year: y,
  };
}

export function nameNumber(
  name: string,
  system: "chaldean" | "pythagorean" | "vedic" = "chaldean"
) {
  const map = system === "pythagorean" ? PYTHAGOREAN : CHALDEAN;
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  const vowels = new Set("aeiou");
  let destiny = 0;
  let soul = 0;
  let personality = 0;
  for (const ch of clean) {
    const v = map[ch] ?? 0;
    destiny += v;
    if (vowels.has(ch)) soul += v;
    else personality += v;
  }
  // Vedic: often same as Chaldean for Latin transliteration
  return {
    name,
    system,
    destiny: reduce(destiny, false),
    soulUrge: reduce(soul, false),
    personality: reduce(personality, false),
    raw: { destiny, soul, personality },
  };
}

export function digitNumberFromString(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const total = digits.split("").reduce((s, d) => s + Number(d), 0);
  return {
    input: raw,
    digits,
    compound: total,
    number: reduce(total, false),
  };
}

export function personalYear(isoDate: string, year: number) {
  const [, m, d] = isoDate.split("-").map(Number);
  const total = sumDigits(d) + sumDigits(m) + sumDigits(year);
  return {
    year,
    number: reduce(total, false),
    theme: {
      en: `Personal year ${reduce(total, false)} sets the tone for ${year}.`,
      hi: `व्यक्तिगत वर्ष ${reduce(total, false)} वर्ष ${year} का स्वर तय करता है।`,
    },
  };
}

const NUMBER_MEANING: Record<
  number,
  { title: { en: string; hi: string }; present: { en: string; hi: string }; missing: { en: string; hi: string } }
> = {
  1: {
    title: { en: "Leadership & self", hi: "नेतृत्व व स्वयं" },
    present: {
      en: "Drive to initiate, independence and personal will are active in your chart digits.",
      hi: "आरंभ करने की शक्ति, स्वतंत्रता और व्यक्तिगत इच्छा आपके अंकों में सक्रिय हैं।",
    },
    missing: {
      en: "You may grow by practising clear decisions and owning your voice more often.",
      hi: "स्पष्ट निर्णय और अपनी आवाज़ ज़्यादा अपनाने से विकास मिल सकता है।",
    },
  },
  2: {
    title: { en: "Cooperation & sensitivity", hi: "सहयोग व संवेदनशीलता" },
    present: {
      en: "Diplomacy, partnership awareness and emotional listening show up strongly.",
      hi: "कूटनीति, साझेदारी भाव और भावनात्मक सुनना प्रबल दिखता है।",
    },
    missing: {
      en: "Balance comes from patience with others and softer teamwork habits.",
      hi: "दूसरों के साथ धैर्य और नरम टीम-भाव से संतुलन आता है।",
    },
  },
  3: {
    title: { en: "Expression & creativity", hi: "अभिव्यक्ति व रचनात्मकता" },
    present: {
      en: "Communication, humour and creative spark are natural strengths.",
      hi: "संवाद, हास्य और रचनात्मक चमक स्वाभाविक शक्तियाँ हैं।",
    },
    missing: {
      en: "Writing, speaking or a creative hobby can unlock unused expression.",
      hi: "लेखन, बोलना या कोई रचनात्मक शौक अप्रयुक्त अभिव्यक्ति खोल सकता है।",
    },
  },
  4: {
    title: { en: "Order & foundation", hi: "व्यवस्था व नींव" },
    present: {
      en: "Structure, planning and steady work ethic support your goals.",
      hi: "ढाँचा, योजना और स्थिर कार्य-नीति आपके लक्ष्यों को सहारा देती है।",
    },
    missing: {
      en: "Routines and small systems help ideas become lasting results.",
      hi: "दिनचर्या और छोटे सिस्टम विचारों को स्थायी परिणाम बनाते हैं।",
    },
  },
  5: {
    title: { en: "Freedom & change", hi: "स्वतंत्रता व परिवर्तन" },
    present: {
      en: "Curiosity, adaptability and movement energise your path.",
      hi: "जिज्ञासा, अनुकूलन और गति आपके मार्ग को ऊर्जा देती है।",
    },
    missing: {
      en: "Safe new experiences keep life from feeling stuck or rigid.",
      hi: "सुरक्षित नए अनुभव जीवन को अटका या कठोर होने से बचाते हैं।",
    },
  },
  6: {
    title: { en: "Care & responsibility", hi: "देखभाल व जिम्मेदारी" },
    present: {
      en: "Home, family duty and nurturing roles feel meaningful.",
      hi: "घर, पारिवारिक कर्तव्य और पोषण भूमिकाएँ अर्थपूर्ण लगती हैं।",
    },
    missing: {
      en: "Conscious care for body and close relationships restores balance.",
      hi: "शरीर और निकट संबंधों की सचेत देखभाल संतुलन लौटाती है।",
    },
  },
  7: {
    title: { en: "Analysis & inner life", hi: "विश्लेषण व आंतरिक जीवन" },
    present: {
      en: "Study, research and spiritual curiosity come easily.",
      hi: "अध्ययन, शोध और आध्यात्मिक जिज्ञासा सहज आती है।",
    },
    missing: {
      en: "Quiet reflection or learning time deepens clarity.",
      hi: "शांत चिंतन या सीखने का समय स्पष्टता बढ़ाता है।",
    },
  },
  8: {
    title: { en: "Ambition & material mastery", hi: "महत्वाकांक्षा व भौतिक दक्षता" },
    present: {
      en: "Focus on achievement, resources and long-range plans is visible.",
      hi: "उपलब्धि, संसाधन और लंबी योजना पर फोकस दिखता है।",
    },
    missing: {
      en: "Practical money skills and patient goal-setting strengthen this plane.",
      hi: "व्यावहारिक धन कौशल और धैर्यपूर्ण लक्ष्य इसे मजबूत करते हैं।",
    },
  },
  9: {
    title: { en: "Compassion & completion", hi: "करुणा व पूर्णता" },
    present: {
      en: "Broad vision, empathy and finishing cycles are part of your pattern.",
      hi: "विस्तृत दृष्टि, सहानुभूति और चक्र पूरे करना आपके पैटर्न का भाग है।",
    },
    missing: {
      en: "Service or creative release helps close emotional loops.",
      hi: "सेवा या रचनात्मक मुक्ति भावनात्मक चक्र पूरे करने में मदद करती है।",
    },
  },
};

type PlaneId = "mental" | "emotional" | "practical" | "thought" | "will" | "action";

const PLANES: {
  id: PlaneId;
  cells: [number, number, number];
  title: { en: string; hi: string };
  strong: { en: string; hi: string };
  weak: { en: string; hi: string };
}[] = [
  {
    id: "mental",
    cells: [4, 9, 2],
    title: { en: "Mental plane (4–9–2)", hi: "मानसिक तल (4–9–2)" },
    strong: {
      en: "Thinking, imagination and idea-flow feel supported.",
      hi: "सोच, कल्पना और विचार-प्रवाह समर्थित लगते हैं।",
    },
    weak: {
      en: "Mind may scatter — journaling or focused study helps.",
      hi: "मन बिखर सकता है — जर्नल या केंद्रित अध्ययन मदद करता है।",
    },
  },
  {
    id: "emotional",
    cells: [3, 5, 7],
    title: { en: "Emotional plane (3–5–7)", hi: "भावनात्मक तल (3–5–7)" },
    strong: {
      en: "Feelings, intuition and connection express with ease.",
      hi: "भाव, अंतर्ज्ञान और जुड़ाव सहज अभिव्यक्त होते हैं।",
    },
    weak: {
      en: "Name feelings early; creative outlets keep emotions healthy.",
      hi: "भाव जल्दी नाम दें; रचनात्मक आउटलेट भावनाएँ स्वस्थ रखते हैं।",
    },
  },
  {
    id: "practical",
    cells: [8, 1, 6],
    title: { en: "Practical plane (8–1–6)", hi: "व्यावहारिक तल (8–1–6)" },
    strong: {
      en: "Getting things done and grounding ideas in reality is natural.",
      hi: "काम पूरा करना और विचारों को ज़मीन पर उतारना स्वाभाविक है।",
    },
    weak: {
      en: "Break goals into steps; finish one task before starting five.",
      hi: "लक्ष्य छोटे चरणों में तोड़ें; पाँच शुरू करने से पहले एक पूरा करें।",
    },
  },
  {
    id: "thought",
    cells: [4, 3, 8],
    title: { en: "Thought column (4–3–8)", hi: "विचार स्तंभ (4–3–8)" },
    strong: {
      en: "Planning and structured thinking support decisions.",
      hi: "योजना और संरचित सोच निर्णयों को सहारा देती है।",
    },
    weak: {
      en: "Pause before reacting — outline the next step on paper.",
      hi: "प्रतिक्रिया से पहले रुकें — अगला कदम कागज़ पर लिखें।",
    },
  },
  {
    id: "will",
    cells: [9, 5, 1],
    title: { en: "Will column (9–5–1)", hi: "संकल्प स्तंभ (9–5–1)" },
    strong: {
      en: "Determination and follow-through can be a signature strength.",
      hi: "दृढ़ता और काम पूरा करना आपकी पहचान शक्ति हो सकती है।",
    },
    weak: {
      en: "Choose fewer priorities so willpower isn’t diluted.",
      hi: "कम प्राथमिकताएँ चुनें ताकि संकल्प बिखरे नहीं।",
    },
  },
  {
    id: "action",
    cells: [2, 7, 6],
    title: { en: "Action column (2–7–6)", hi: "कर्म स्तंभ (2–7–6)" },
    strong: {
      en: "You can move from insight into helpful action.",
      hi: "आप अंतर्दृष्टि से उपयोगी कर्म की ओर बढ़ सकते हैं।",
    },
    weak: {
      en: "Pair reflection with one concrete weekly action.",
      hi: "चिंतन के साथ सप्ताह में एक ठोस कर्म जोड़ें।",
    },
  },
];

function planeStrength(grid: Record<number, number>, cells: [number, number, number]) {
  const counts = cells.map((n) => grid[n] || 0);
  const present = counts.filter((c) => c > 0).length;
  const total = counts.reduce((a, b) => a + b, 0);
  if (present === 3) return "strong" as const;
  if (present === 0) return "empty" as const;
  if (present === 1 || total <= 1) return "soft" as const;
  return "balanced" as const;
}

export function loShuGrid(isoDate: string) {
  const digits = isoDate.replace(/-/g, "").split("").map(Number);
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const d of digits) {
    if (d >= 1 && d <= 9) grid[d]++;
  }
  const birth = lifePathFromDate(isoDate);
  const lp = birth.lifePath;
  // Driver / conductor style: include reduced DOB compound once if 1–9
  if (lp >= 1 && lp <= 9) grid[lp]++;

  const present = Object.entries(grid)
    .filter(([, c]) => c > 0)
    .map(([n, c]) => {
      const num = Number(n);
      const meta = NUMBER_MEANING[num];
      return {
        number: num,
        count: c,
        title: meta.title,
        meaning: meta.present,
        intensity:
          c >= 3
            ? { en: "Very strong", hi: "बहुत प्रबल" }
            : c === 2
              ? { en: "Emphasised", hi: "विशेष बल" }
              : { en: "Present", hi: "उपस्थित" },
      };
    })
    .sort((a, b) => b.count - a.count || a.number - b.number);

  const missing = Object.entries(grid)
    .filter(([, c]) => c === 0)
    .map(([n]) => {
      const num = Number(n);
      const meta = NUMBER_MEANING[num];
      return {
        number: num,
        title: meta.title,
        meaning: meta.missing,
      };
    });

  const repeating = present.filter((p) => p.count > 1);

  const planes = PLANES.map((p) => {
    const level = planeStrength(grid, p.cells);
    return {
      id: p.id,
      title: p.title,
      cells: p.cells,
      level,
      levelLabel:
        level === "strong"
          ? { en: "Strong", hi: "मजबूत" }
          : level === "balanced"
            ? { en: "Balanced", hi: "संतुलित" }
            : level === "soft"
              ? { en: "Developing", hi: "विकसित हो रहा" }
              : { en: "Quiet / open", hi: "शांत / खुला" },
      insight: level === "strong" || level === "balanced" ? p.strong : p.weak,
      counts: p.cells.map((n) => grid[n] || 0),
    };
  });

  const strongPlanes = planes.filter((p) => p.level === "strong" || p.level === "balanced");
  const growthPlanes = planes.filter((p) => p.level === "soft" || p.level === "empty");

  const summary = {
    en:
      missing.length === 0
        ? `Your Lo Shu shows all digits 1–9 represented (Life Path ${lp}). Read emphasised numbers and planes below for where energy concentrates.`
        : `Life Path ${lp}. You show ${present.length} active numbers and ${missing.length} open arrow(s). Missing numbers are growth themes — not defects.`,
    hi:
      missing.length === 0
        ? `आपके लो शू में 1–9 सभी अंक दिखते हैं (लाइफ पाथ ${lp})। नीचे प्रबल अंक और तल देखें जहाँ ऊर्जा केंद्रित है।`
        : `लाइफ पाथ ${lp}। ${present.length} सक्रिय अंक और ${missing.length} खुले अंक। अनुपस्थित अंक दोष नहीं — विकास के विषय हैं।`,
  };

  const tip = {
    en:
      repeating.length > 0
        ? `Repeated numbers (${repeating.map((r) => r.number).join(", ")}) act like volume knobs — gifts when balanced, pressure when overused.`
        : `No heavy repeats — your grid is relatively even. Use planes below to see which life area is loudest.`,
    hi:
      repeating.length > 0
        ? `दोहराए अंक (${repeating.map((r) => r.number).join(", ")}) वॉल्यूम की तरह हैं — संतुलन में वरदान, अति में दबाव।`
        : `भारी दोहराव नहीं — ग्रिड अपेक्षाकृत सम है। नीचे के तल बताते हैं कौन-सा क्षेत्र सबसे मुखर है।`,
  };

  return {
    kind: "lo-shu" as const,
    date: isoDate,
    grid,
    lifePath: lp,
    radical: birth.radical,
    present,
    missing,
    repeating: repeating.map((r) => ({ number: r.number, count: r.count })),
    planes,
    highlightPlanes: {
      strengths: strongPlanes.slice(0, 3).map((p) => p.title),
      growth: growthPlanes.slice(0, 3).map((p) => p.title),
    },
    summary,
    tip,
  };
}

/** Fun name love % — nakshatra syllable style hash (entertainment). */
export function lovePercentage(name1: string, name2: string) {
  const a = name1.trim().toLowerCase();
  const b = name2.trim().toLowerCase();
  let h = 0;
  const s = a + "|" + b;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const pct = 40 + (h % 61); // 40–100
  return {
    name1: name1.trim(),
    name2: name2.trim(),
    percent: pct,
    note: {
      en: "Entertainment only — not a substitute for kundli matching.",
      hi: "केवल मनोरंजन — कुंडली मिलान का विकल्प नहीं।",
    },
  };
}

export function babyNameLetters(nakshatraIndex: number) {
  // Classical starting syllables by nakshatra (simplified)
  const syllables = [
    ["Chu", "Che", "Cho", "La"],
    ["Li", "Lu", "Le", "Lo"],
    ["A", "I", "U", "E"],
    ["O", "Va", "Vi", "Vu"],
    ["Ve", "Vo", "Ka", "Ki"],
    ["Ku", "Gha", "Ng", "Chha"],
    ["Ke", "Ko", "Ha", "Hi"],
    ["Hu", "He", "Ho", "Da"],
    ["Di", "Du", "De", "Do"],
    ["Ma", "Mi", "Mu", "Me"],
    ["Mo", "Ta", "Ti", "Tu"],
    ["Te", "To", "Pa", "Pi"],
    ["Pu", "Sha", "Na", "Tha"],
    ["Pe", "Po", "Ra", "Ri"],
    ["Ru", "Re", "Ro", "Ta"],
    ["Ti", "Tu", "Te", "To"],
    ["Na", "Ni", "Nu", "Ne"],
    ["No", "Ya", "Yi", "Yu"],
    ["Ye", "Yo", "Ba", "Bi"],
    ["Bu", "Dha", "Bha", "Dha"],
    ["Be", "Bo", "Ja", "Ji"],
    ["Ju", "Je", "Jo", "Gha"],
    ["Ga", "Gi", "Gu", "Ge"],
    ["Go", "Sa", "Si", "Su"],
    ["Se", "So", "Da", "Di"],
    ["Du", "Tha", "Jha", "Na"],
    ["De", "Do", "Cha", "Chi"],
  ];
  return syllables[nakshatraIndex] ?? ["A", "Ka", "Ma", "Ra"];
}
