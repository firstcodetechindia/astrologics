import { NAKSHATRAS } from "./constants";

/** Ashtakoot (36-point) Gun Milan from Moon nakshatra indices (0–26). */
export interface KootaScore {
  id: string;
  name: { en: string; hi: string };
  max: number;
  score: number;
  note: { en: string; hi: string };
}

function varna(n: number): number {
  // Brahmin, Kshatriya, Vaishya, Shudra by nakshatra groups
  const map = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3];
  return map[n] ?? 4;
}

function vashya(n: number): number {
  // Simplified animal/class groups 1-5
  const map = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2];
  return map[n] ?? 1;
}

function yoni(n: number): number {
  return n % 14; // 14 yoni pairs cycle
}

function gan(n: number): number {
  // Deva, Manushya, Rakshasa
  const map = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
  return map[n] ?? 2;
}

function nadi(n: number): number {
  // Adi, Madhya, Antya repeating
  return (n % 3) + 1;
}

function rashiFromNak(n: number): number {
  // Approximate Moon sign from nakshatra (classical mapping)
  return Math.floor((n * 4) / 9) % 12;
}

export function ashtakootMatch(boyNak: number, girlNak: number) {
  const scores: KootaScore[] = [];

  // 1. Varna (1)
  const bv = varna(boyNak);
  const gv = varna(girlNak);
  const varnaScore = gv <= bv ? 1 : 0;
  scores.push({
    id: "varna",
    name: { en: "Varna", hi: "वर्ण" },
    max: 1,
    score: varnaScore,
    note: {
      en: varnaScore ? "Compatible social temperament." : "Mild mismatch — often overlooked alone.",
      hi: varnaScore ? "सामाजिक स्वभाव अनुकूल।" : "हल्का अंतर — अकेले निर्णायक नहीं।",
    },
  });

  // 2. Vashya (2)
  const bva = vashya(boyNak);
  const gva = vashya(girlNak);
  let vashyaScore = 0;
  if (bva === gva) vashyaScore = 2;
  else if (Math.abs(bva - gva) === 1) vashyaScore = 1;
  scores.push({
    id: "vashya",
    name: { en: "Vashya", hi: "वश्य" },
    max: 2,
    score: vashyaScore,
    note: {
      en: "Mutual influence and comfort level.",
      hi: "परस्पर प्रभाव और सहजता।",
    },
  });

  // 3. Tara (3) — counting from girl's nakshatra
  const taraCount = ((boyNak - girlNak + 27) % 27) + 1;
  const taraGroup = ((taraCount - 1) % 9) + 1;
  const goodTara = [1, 2, 4, 6, 8, 9];
  const taraScore = goodTara.includes(taraGroup) ? 3 : taraGroup === 3 || taraGroup === 5 ? 1.5 : 0;
  scores.push({
    id: "tara",
    name: { en: "Tara", hi: "तारा" },
    max: 3,
    score: taraScore,
    note: {
      en: `Birth-star count ${taraCount} (group ${taraGroup}).`,
      hi: `जन्म नक्षत्र गणना ${taraCount} (समूह ${taraGroup})।`,
    },
  });

  // 4. Yoni (4)
  const by = yoni(boyNak);
  const gy = yoni(girlNak);
  let yoniScore = 4;
  if (by === gy) yoniScore = 4;
  else if (Math.abs(by - gy) === 7) yoniScore = 0; // enemy pair approx
  else yoniScore = 2;
  scores.push({
    id: "yoni",
    name: { en: "Yoni", hi: "योनि" },
    max: 4,
    score: yoniScore,
    note: {
      en: "Physical and instinctive compatibility.",
      hi: "शारीरिक व सहज अनुकूलता।",
    },
  });

  // 5. Graha Maitri (5) — by Moon rashi lords friendship (simplified)
  const br = rashiFromNak(boyNak);
  const gr = rashiFromNak(girlNak);
  const lord = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // planet ids by sign
  const friends: Record<number, number[]> = {
    0: [0, 1, 4],
    1: [0, 1, 5],
    2: [2, 3, 5],
    3: [1, 3, 5],
    4: [0, 2, 4],
    5: [1, 3, 5],
    6: [2, 4, 6],
  };
  const bl = lord[br];
  const gl = lord[gr];
  let grahaScore = 0;
  if (bl === gl) grahaScore = 5;
  else if (friends[bl]?.includes(gl)) grahaScore = 4;
  else grahaScore = 1;
  scores.push({
    id: "grahaMaitri",
    name: { en: "Graha Maitri", hi: "ग्रह मैत्री" },
    max: 5,
    score: grahaScore,
    note: {
      en: "Mental rapport via Moon-sign lords.",
      hi: "चंद्र राशि स्वामियों से मानसिक मेल।",
    },
  });

  // 6. Gana (6)
  const bg = gan(boyNak);
  const gg = gan(girlNak);
  let ganaScore = 0;
  if (bg === gg) ganaScore = 6;
  else if ((bg === 1 && gg === 2) || (bg === 2 && gg === 1)) ganaScore = 5;
  else if ((bg === 2 && gg === 3) || (bg === 3 && gg === 2)) ganaScore = 1;
  else ganaScore = 0;
  scores.push({
    id: "gana",
    name: { en: "Gana", hi: "गण" },
    max: 6,
    score: ganaScore,
    note: {
      en: "Temperament group: Deva / Manushya / Rakshasa.",
      hi: "स्वभाव गण: देव / मनुष्य / राक्षस।",
    },
  });

  // 7. Bhakoot (7) — Moon sign distance
  const diff = ((gr - br + 12) % 12) + 1;
  const badBhakoot = [2, 6, 8, 12];
  const bhakootScore = badBhakoot.includes(diff) ? 0 : 7;
  scores.push({
    id: "bhakoot",
    name: { en: "Bhakoot", hi: "भकूट" },
    max: 7,
    score: bhakootScore,
    note: {
      en: `Moon-sign count ${diff} from boy to girl.`,
      hi: `लड़के से लड़की चंद्र राशि गणना ${diff}।`,
    },
  });

  // 8. Nadi (8)
  const bn = nadi(boyNak);
  const gn = nadi(girlNak);
  const nadiScore = bn === gn ? 0 : 8;
  scores.push({
    id: "nadi",
    name: { en: "Nadi", hi: "नाड़ी" },
    max: 8,
    score: nadiScore,
    note: {
      en: nadiScore
        ? "Different nadi — favourable for progeny themes."
        : "Same nadi — classical dosha; seek expert review.",
      hi: nadiScore
        ? "भिन्न नाड़ी — संतान विषय में अनुकूल माना जाता है।"
        : "समान नाड़ी — शास्त्रीय दोष; विशेषज्ञ सलाह लें।",
    },
  });

  const total = scores.reduce((s, k) => s + k.score, 0);
  const max = 36;
  let verdict: { en: string; hi: string };
  if (total >= 24)
    verdict = { en: "Good match", hi: "अच्छा मेल" };
  else if (total >= 18)
    verdict = { en: "Average — review with an astrologer", hi: "मध्यम — ज्योतिषी से जाँचें" };
  else
    verdict = { en: "Low score — deeper chart analysis advised", hi: "कम अंक — गहन कुंडली विश्लेषण चाहिए" };

  return {
    boyNakshatra: NAKSHATRAS[boyNak],
    girlNakshatra: NAKSHATRAS[girlNak],
    scores,
    total,
    max,
    percent: Math.round((total / max) * 100),
    verdict,
  };
}
