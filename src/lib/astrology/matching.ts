import { NAKSHATRAS, SIGN_LORDS } from "./constants";

/** Ashtakoot (36-point) Gun Milan from Moon nakshatra + Moon rashi. */

export interface KootaScore {
  id: string;
  name: { en: string; hi: string };
  max: number;
  score: number;
  note: { en: string; hi: string };
}

/** Classical Varna by Moon rashi (0=Aries … 11=Pisces): Brahmin=4 … Shudra=1 */
const RASHI_VARNA = [2, 3, 4, 4, 2, 3, 1, 1, 2, 3, 4, 4]; // Kshatriya, Vaishya, Brahmin…

/** Classical Gana by nakshatra (1=Deva, 2=Manushya, 3=Rakshasa) */
const NAK_GANA = [
  1, 2, 3, 2, 1, 2, 1, 1, 3, 3, 2, 2, 1, 3, 1, 3, 1, 3, 3, 2, 2, 1, 3, 3, 2, 2, 1,
];

/** Classical Nadi by nakshatra (1=Adi, 2=Madhya, 3=Antya) */
const NAK_NADI = [
  1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,
];

/** Classical Yoni index 0–13 by nakshatra */
const NAK_YONI = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12,
];

/** Enemy yoni pairs (symmetric) */
const YONI_ENEMY = new Set([
  "0-5",
  "5-0",
  "1-7",
  "7-1",
  "2-8",
  "8-2",
  "3-9",
  "9-3",
  "4-10",
  "10-4",
  "6-11",
  "11-6",
  "12-13",
  "13-12",
]);

/** Vashya class by Moon rashi: 1=Chatushpada, 2=Manava, 3=Jalachara, 4=Vanacara, 5=Keeta */
const RASHI_VASHYA = [1, 1, 2, 3, 2, 2, 2, 4, 1, 5, 2, 3];

function planetKeyFromLord(signIndex: number): string {
  return SIGN_LORDS[signIndex].en.toLowerCase();
}

/** Permanent friendship (simplified classical) */
const FRIENDS: Record<string, string[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
};

const ENEMIES: Record<string, string[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
};

export function ashtakootMatch(
  boyNak: number,
  girlNak: number,
  boyMoonSign?: number,
  girlMoonSign?: number
) {
  const boyRashi =
    typeof boyMoonSign === "number"
      ? boyMoonSign
      : Math.floor((boyNak * 4) / 9) % 12;
  const girlRashi =
    typeof girlMoonSign === "number"
      ? girlMoonSign
      : Math.floor((girlNak * 4) / 9) % 12;

  const scores: KootaScore[] = [];

  // 1. Varna (1) — girl varna should not be higher than boy
  const bv = RASHI_VARNA[boyRashi];
  const gv = RASHI_VARNA[girlRashi];
  const varnaScore = gv <= bv ? 1 : 0;
  scores.push({
    id: "varna",
    name: { en: "Varna", hi: "वर्ण" },
    max: 1,
    score: varnaScore,
    note: {
      en: varnaScore
        ? "Compatible social temperament (by Moon rashi)."
        : "Mild mismatch — often overlooked alone.",
      hi: varnaScore
        ? "सामाजिक स्वभाव अनुकूल (चंद्र राशि से)।"
        : "हल्का अंतर — अकेले निर्णायक नहीं।",
    },
  });

  // 2. Vashya (2)
  const bva = RASHI_VASHYA[boyRashi];
  const gva = RASHI_VASHYA[girlRashi];
  let vashyaScore = 0;
  if (bva === gva) vashyaScore = 2;
  else if (
    (bva === 2 && [1, 3, 5].includes(gva)) ||
    (bva === 1 && gva === 5) ||
    (bva === 3 && gva === 1)
  )
    vashyaScore = 1;
  else vashyaScore = 0;
  scores.push({
    id: "vashya",
    name: { en: "Vashya", hi: "वश्य" },
    max: 2,
    score: vashyaScore,
    note: {
      en: "Mutual influence and comfort (Moon-sign vashya).",
      hi: "परस्पर प्रभाव और सहजता (चंद्र राशि वश्य)।",
    },
  });

  // 3. Tara (3) — counting from girl's nakshatra to boy's
  const taraCount = ((boyNak - girlNak + 27) % 27) + 1;
  const taraGroup = ((taraCount - 1) % 9) + 1;
  const taraScore =
    [1, 2, 4, 6, 8, 9].includes(taraGroup)
      ? 3
      : taraGroup === 3 || taraGroup === 5
        ? 1.5
        : 0;
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
  const by = NAK_YONI[boyNak];
  const gy = NAK_YONI[girlNak];
  let yoniScore = 2;
  if (by === gy) yoniScore = 4;
  else if (YONI_ENEMY.has(`${by}-${gy}`)) yoniScore = 0;
  else yoniScore = 3;
  scores.push({
    id: "yoni",
    name: { en: "Yoni", hi: "योनि" },
    max: 4,
    score: yoniScore,
    note: {
      en: "Physical and instinctive compatibility (classical yoni).",
      hi: "शारीरिक व सहज अनुकूलता (शास्त्रीय योनि)।",
    },
  });

  // 5. Graha Maitri (5) — Moon-sign lords
  const bl = planetKeyFromLord(boyRashi);
  const gl = planetKeyFromLord(girlRashi);
  let grahaScore = 0;
  if (bl === gl) grahaScore = 5;
  else if (FRIENDS[bl]?.includes(gl) && FRIENDS[gl]?.includes(bl)) grahaScore = 4;
  else if (FRIENDS[bl]?.includes(gl) || FRIENDS[gl]?.includes(bl)) grahaScore = 3;
  else if (ENEMIES[bl]?.includes(gl) || ENEMIES[gl]?.includes(bl)) grahaScore = 0;
  else grahaScore = 1;
  scores.push({
    id: "grahaMaitri",
    name: { en: "Graha Maitri", hi: "ग्रह मैत्री" },
    max: 5,
    score: grahaScore,
    note: {
      en: `Mental rapport via Moon-sign lords (${SIGN_LORDS[boyRashi].en}–${SIGN_LORDS[girlRashi].en}).`,
      hi: `चंद्र राशि स्वामियों से मानसिक मेल (${SIGN_LORDS[boyRashi].hi}–${SIGN_LORDS[girlRashi].hi})।`,
    },
  });

  // 6. Gana (6)
  const bg = NAK_GANA[boyNak];
  const gg = NAK_GANA[girlNak];
  let ganaScore = 0;
  if (bg === gg) ganaScore = 6;
  else if ((bg === 1 && gg === 2) || (bg === 2 && gg === 1)) ganaScore = 5;
  else if ((bg === 2 && gg === 3) || (bg === 3 && gg === 2)) ganaScore = 1;
  else ganaScore = 0; // Deva–Rakshasa
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

  // 7. Bhakoot (7) — Moon sign distance boy → girl
  const diff = ((girlRashi - boyRashi + 12) % 12) + 1;
  const badBhakoot = [2, 6, 8, 12];
  const bhakootScore = badBhakoot.includes(diff) ? 0 : 7;
  scores.push({
    id: "bhakoot",
    name: { en: "Bhakoot", hi: "भकूट" },
    max: 7,
    score: bhakootScore,
    note: {
      en: `Moon-sign count ${diff} from boy to girl (true Moon rashis).`,
      hi: `लड़के से लड़की चंद्र राशि गणना ${diff} (वास्तविक चंद्र राशि)।`,
    },
  });

  // 8. Nadi (8)
  const bn = NAK_NADI[boyNak];
  const gn = NAK_NADI[girlNak];
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
  if (total >= 24) verdict = { en: "Good match", hi: "अच्छा मेल" };
  else if (total >= 18)
    verdict = {
      en: "Average — review with an astrologer",
      hi: "मध्यम — ज्योतिषी से जाँचें",
    };
  else
    verdict = {
      en: "Low score — deeper chart analysis advised",
      hi: "कम अंक — गहन कुंडली विश्लेषण चाहिए",
    };

  return {
    boyNakshatra: NAKSHATRAS[boyNak],
    girlNakshatra: NAKSHATRAS[girlNak],
    boyMoonSign: boyRashi,
    girlMoonSign: girlRashi,
    scores,
    total,
    max,
    percent: Math.round((total / max) * 100),
    verdict,
  };
}
