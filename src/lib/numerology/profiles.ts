/**
 * Numerology number profiles — structured lookup (skill: not hardcoded prose in calculators).
 * Ruling planets follow Vedic Mulank/Bhagyank tradition.
 */

export type Loc = { en: string; hi: string };

export type NumberProfile = {
  number: number;
  title: Loc;
  planet: Loc;
  traits: Loc;
  strengths: Loc;
  watchouts: Loc;
  luckyColors: Loc;
  luckyDays: Loc;
  direction: Loc;
  compatible: number[];
  challenging: number[];
};

/** Profiles for 1–9 plus master numbers 11 / 22 / 33. */
export const NUMBER_PROFILES: Record<number, NumberProfile> = {
  1: {
    number: 1,
    title: { en: "The Pioneer", hi: "अग्रणी" },
    planet: { en: "Sun", hi: "सूर्य" },
    traits: {
      en: "Independent, ambitious, leadership-oriented. Prefers to start and own initiatives.",
      hi: "स्वतंत्र, महत्वाकांक्षी, नेतृत्व-उन्मुख। स्वयं आरंभ करना पसंद।",
    },
    strengths: {
      en: "Courage, clarity of will, ability to inspire others.",
      hi: "साहस, इच्छाशक्ति की स्पष्टता, दूसरों को प्रेरित करने की क्षमता।",
    },
    watchouts: {
      en: "Ego rigidity, impatience with collaboration.",
      hi: "अहंकार की कठोरता, सहयोग में अधीरता।",
    },
    luckyColors: { en: "Gold, orange, amber", hi: "सोना, नारंगी, अंबर" },
    luckyDays: { en: "Sunday", hi: "रविवार" },
    direction: { en: "East", hi: "पूर्व" },
    compatible: [1, 2, 3, 5, 9],
    challenging: [4, 8],
  },
  2: {
    number: 2,
    title: { en: "The Diplomat", hi: "कूटनीतिज्ञ" },
    planet: { en: "Moon", hi: "चंद्र" },
    traits: {
      en: "Sensitive, cooperative, intuitive. Thrives in partnership and emotional nuance.",
      hi: "संवेदनशील, सहयोगी, अंतर्ज्ञानी। साझेदारी और भावनात्मक सूक्ष्मता में फलते हैं।",
    },
    strengths: {
      en: "Empathy, listening, peacemaking.",
      hi: "सहानुभूति, सुनना, शांति-स्थापना।",
    },
    watchouts: {
      en: "Over-dependence, mood swings, indecision.",
      hi: "अत्यधिक निर्भरता, मनोदशा, अनिर्णय।",
    },
    luckyColors: { en: "White, silver, cream", hi: "सफेद, चाँदी, क्रीम" },
    luckyDays: { en: "Monday", hi: "सोमवार" },
    direction: { en: "North-west", hi: "उत्तर-पश्चिम" },
    compatible: [1, 2, 4, 6, 8],
    challenging: [9],
  },
  3: {
    number: 3,
    title: { en: "The Communicator", hi: "संवादक" },
    planet: { en: "Jupiter", hi: "बृहस्पति" },
    traits: {
      en: "Expressive, optimistic, creative. Drawn to teaching, writing and social warmth.",
      hi: "अभिव्यक्त, आशावादी, रचनात्मक। शिक्षण, लेखन और सामाजिक गर्माहट की ओर।",
    },
    strengths: {
      en: "Wit, learning appetite, joyful presence.",
      hi: "हास्य, सीखने की भूख, आनंदमय उपस्थिति।",
    },
    watchouts: {
      en: "Scattered focus, over-promising.",
      hi: "बिखरा फोकस, अधिक वादे।",
    },
    luckyColors: { en: "Yellow, saffron, purple", hi: "पीला, केसरिया, बैंगनी" },
    luckyDays: { en: "Thursday", hi: "गुरुवार" },
    direction: { en: "North-east", hi: "उत्तर-पूर्व" },
    compatible: [1, 3, 5, 6, 9],
    challenging: [4, 8],
  },
  4: {
    number: 4,
    title: { en: "The Builder", hi: "निर्माता" },
    planet: { en: "Rahu (Uranus)", hi: "राहु (यूरेनस)" },
    traits: {
      en: "Practical, systematic, resilient. Builds lasting structures and processes.",
      hi: "व्यावहारिक, व्यवस्थित, दृढ़। स्थायी ढाँचे और प्रक्रियाएँ बनाते हैं।",
    },
    strengths: {
      en: "Discipline, reliability, long-range planning.",
      hi: "अनुशासन, विश्वसनीयता, लंबी योजना।",
    },
    watchouts: {
      en: "Rigidity, resistance to change, isolation.",
      hi: "कठोरता, परिवर्तन विरोध, अलगाव।",
    },
    luckyColors: { en: "Blue, grey, earth tones", hi: "नीला, धूसर, मिट्टी रंग" },
    luckyDays: { en: "Saturday", hi: "शनिवार" },
    direction: { en: "South", hi: "दक्षिण" },
    compatible: [2, 4, 6, 7, 8],
    challenging: [1, 5, 9],
  },
  5: {
    number: 5,
    title: { en: "The Explorer", hi: "अन्वेषक" },
    planet: { en: "Mercury", hi: "बुध" },
    traits: {
      en: "Curious, adaptable, quick-minded. Needs variety, travel and mental stimulation.",
      hi: "जिज्ञासु, अनुकूलनशील, तेज़ दिमाग। विविधता, यात्रा और मानसिक उत्तेजना चाहिए।",
    },
    strengths: {
      en: "Flexibility, networking, problem-solving under change.",
      hi: "लचीलापन, नेटवर्किंग, परिवर्तन में समस्या-समाधान।",
    },
    watchouts: {
      en: "Restlessness, unfinished projects, impulsive choices.",
      hi: "बेचैनी, अधूरे प्रोजेक्ट, आवेगपूर्ण चयन।",
    },
    luckyColors: { en: "Green, light blue", hi: "हरा, हल्का नीला" },
    luckyDays: { en: "Wednesday", hi: "बुधवार" },
    direction: { en: "North", hi: "उत्तर" },
    compatible: [1, 3, 5, 6, 9],
    challenging: [4, 8],
  },
  6: {
    number: 6,
    title: { en: "The Caregiver", hi: "पालक" },
    planet: { en: "Venus", hi: "शुक्र" },
    traits: {
      en: "Nurturing, aesthetic, responsible. Values home, beauty, harmony and duty.",
      hi: "पोषक, सौंदर्यप्रिय, जिम्मेदार। घर, सौंदर्य, सामंजस्य और कर्तव्य मूल्यवान।",
    },
    strengths: {
      en: "Loyalty, design sense, relationship stewardship.",
      hi: "निष्ठा, डिज़ाइन बोध, संबंधों की देखभाल।",
    },
    watchouts: {
      en: "Over-giving, people-pleasing, control through care.",
      hi: "अति-देना, दूसरों को खुश करने की प्रवृत्ति।",
    },
    luckyColors: { en: "Pink, white, light blue", hi: "गुलाबी, सफेद, हल्का नीला" },
    luckyDays: { en: "Friday", hi: "शुक्रवार" },
    direction: { en: "South-east", hi: "दक्षिण-पूर्व" },
    compatible: [2, 3, 5, 6, 9],
    challenging: [1, 8],
  },
  7: {
    number: 7,
    title: { en: "The Seeker", hi: "साधक" },
    planet: { en: "Ketu (Neptune)", hi: "केतु (नेप्च्यून)" },
    traits: {
      en: "Analytical, introspective, spiritually curious. Prefers depth over noise.",
      hi: "विश्लेषणात्मक, अंतर्मुखी, आध्यात्मिक रूप से जिज्ञासु। शोर से गहराई पसंद।",
    },
    strengths: {
      en: "Research skill, intuition, philosophical clarity.",
      hi: "शोध कौशल, अंतर्ज्ञान, दार्शनिक स्पष्टता।",
    },
    watchouts: {
      en: "Withdrawal, over-analysis, distrust of others.",
      hi: "अलगाव, अति-विश्लेषण, दूसरों पर अविश्वास।",
    },
    luckyColors: { en: "Violet, indigo, white", hi: "बैंगनी, नील, सफेद" },
    luckyDays: { en: "Tuesday / Saturday", hi: "मंगल / शनि" },
    direction: { en: "West", hi: "पश्चिम" },
    compatible: [4, 5, 7],
    challenging: [2, 8, 9],
  },
  8: {
    number: 8,
    title: { en: "The Achiever", hi: "उपलब्धकर्ता" },
    planet: { en: "Saturn", hi: "शनि" },
    traits: {
      en: "Ambitious, disciplined, results-focused. Drawn to authority, resources and karma themes.",
      hi: "महत्वाकांक्षी, अनुशासित, परिणाम-केंद्रित। अधिकार, संसाधन और कर्म विषयों की ओर।",
    },
    strengths: {
      en: "Endurance, organisational power, delayed but solid rewards.",
      hi: "सहनशीलता, संगठनात्मक शक्ति, विलंबित पर ठोस फल।",
    },
    watchouts: {
      en: "Workaholism, harsh self-judgment, material fixation.",
      hi: "काम की लत, कठोर आत्म-आलोचना, भौतिक आसक्ति।",
    },
    luckyColors: { en: "Dark blue, black, charcoal", hi: "गहरा नीला, काला, चारकोल" },
    luckyDays: { en: "Saturday", hi: "शनिवार" },
    direction: { en: "West", hi: "पश्चिम" },
    compatible: [2, 4, 5, 6, 8],
    challenging: [1, 3, 9],
  },
  9: {
    number: 9,
    title: { en: "The Humanitarian", hi: "मानवतावादी" },
    planet: { en: "Mars", hi: "मंगल" },
    traits: {
      en: "Passionate, idealistic, completion-oriented. Sees the big picture and serves causes.",
      hi: "जुनूनी, आदर्शवादी, पूर्णता-उन्मुख। बड़ी तस्वीर देखते हैं और कारणों की सेवा।",
    },
    strengths: {
      en: "Courage, generosity, transformative energy.",
      hi: "साहस, उदारता, रूपांतरण ऊर्जा।",
    },
    watchouts: {
      en: "Impulsiveness, emotional extremes, unfinished endings.",
      hi: "आवेग, भावनात्मक चरम, अधूरे अंत।",
    },
    luckyColors: { en: "Red, crimson, coral", hi: "लाल, क्रिमसन, कोरल" },
    luckyDays: { en: "Tuesday", hi: "मंगलवार" },
    direction: { en: "South", hi: "दक्षिण" },
    compatible: [1, 3, 5, 6, 9],
    challenging: [2, 4, 8],
  },
  11: {
    number: 11,
    title: { en: "Master Illuminator", hi: "मास्टर प्रबोधक" },
    planet: { en: "Moon (amplified)", hi: "चंद्र (प्रबल)" },
    traits: {
      en: "Heightened intuition and inspiration. A master number that channels insight to others.",
      hi: "ऊंची अंतर्ज्ञान और प्रेरणा। मास्टर अंक जो दूसरों तक अंतर्दृष्टि पहुँचाता है।",
    },
    strengths: {
      en: "Vision, spiritual sensitivity, catalytic presence.",
      hi: "दृष्टि, आध्यात्मिक संवेदनशीलता, उत्प्रेरक उपस्थिति।",
    },
    watchouts: {
      en: "Nervous tension, idealism without grounding.",
      hi: "तंत्रिका तनाव, बिना नींव का आदर्शवाद।",
    },
    luckyColors: { en: "Silver, white, electric blue", hi: "चाँदी, सफेद, इलेक्ट्रिक नीला" },
    luckyDays: { en: "Monday", hi: "सोमवार" },
    direction: { en: "North-west", hi: "उत्तर-पश्चिम" },
    compatible: [2, 4, 6, 11, 22],
    challenging: [8, 9],
  },
  22: {
    number: 22,
    title: { en: "Master Builder", hi: "मास्टर निर्माता" },
    planet: { en: "Uranus / Rahu (amplified)", hi: "यूरेनस / राहु (प्रबल)" },
    traits: {
      en: "Large-scale vision with practical execution. Builds systems that outlast a lifetime.",
      hi: "व्यावहारिक क्रियान्वयन के साथ बड़े पैमाने की दृष्टि। जीवन से आगे टिकने वाले सिस्टम।",
    },
    strengths: {
      en: "Manifestation power, organisational genius.",
      hi: "प्रकटीकरण शक्ति, संगठनात्मक प्रतिभा।",
    },
    watchouts: {
      en: "Overwhelm, burden of responsibility, burnout.",
      hi: "अभिभूत होना, जिम्मेदारी का बोझ, थकान।",
    },
    luckyColors: { en: "Deep blue, gold, grey", hi: "गहरा नीला, सोना, धूसर" },
    luckyDays: { en: "Saturday", hi: "शनिवार" },
    direction: { en: "South", hi: "दक्षिण" },
    compatible: [4, 6, 8, 11, 22],
    challenging: [1, 9],
  },
  33: {
    number: 33,
    title: { en: "Master Teacher", hi: "मास्टर शिक्षक" },
    planet: { en: "Venus / Jupiter (amplified)", hi: "शुक्र / बृहस्पति (प्रबल)" },
    traits: {
      en: "Compassionate service at scale. Rare master number of healing through teaching.",
      hi: "बड़े पैमाने पर करुणामय सेवा। शिक्षण द्वारा उपचार का दुर्लभ मास्टर अंक।",
    },
    strengths: {
      en: "Healing presence, devotion, uplift of communities.",
      hi: "उपचारात्मक उपस्थिति, भक्ति, समुदायों का उत्थान।",
    },
    watchouts: {
      en: "Self-sacrifice to exhaustion, boundary collapse.",
      hi: "थकान तक आत्म-बलिदान, सीमाओं का टूटना।",
    },
    luckyColors: { en: "Pink, green, gold", hi: "गुलाबी, हरा, सोना" },
    luckyDays: { en: "Friday / Thursday", hi: "शुक्र / गुरु" },
    direction: { en: "South-east", hi: "दक्षिण-पूर्व" },
    compatible: [3, 6, 9, 11, 33],
    challenging: [4, 8],
  },
};

export function profileFor(n: number): NumberProfile {
  if (NUMBER_PROFILES[n]) return NUMBER_PROFILES[n];
  const reduced = n > 9 ? ((n % 9) || 9) : n;
  return NUMBER_PROFILES[reduced] ?? NUMBER_PROFILES[1];
}

/** Classical planetary friendship style: friendly / neutral / enemy. */
export function compatibilityTier(
  a: number,
  b: number
): "friendly" | "neutral" | "challenging" {
  const pa = profileFor(a);
  const baseA = a > 9 && a !== 11 && a !== 22 && a !== 33 ? ((a % 9) || 9) : a;
  const baseB = b > 9 && b !== 11 && b !== 22 && b !== 33 ? ((b % 9) || 9) : b;
  if (pa.compatible.includes(baseB) || pa.compatible.includes(b)) return "friendly";
  if (pa.challenging.includes(baseB) || pa.challenging.includes(b)) return "challenging";
  if (baseA === baseB) return "friendly";
  return "neutral";
}
