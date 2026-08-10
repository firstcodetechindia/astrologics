export const SIGNS = [
  { en: "Aries", hi: "मेष" },
  { en: "Taurus", hi: "वृषभ" },
  { en: "Gemini", hi: "मिथुन" },
  { en: "Cancer", hi: "कर्क" },
  { en: "Leo", hi: "सिंह" },
  { en: "Virgo", hi: "कन्या" },
  { en: "Libra", hi: "तुला" },
  { en: "Scorpio", hi: "वृश्चिक" },
  { en: "Sagittarius", hi: "धनु" },
  { en: "Capricorn", hi: "मकर" },
  { en: "Aquarius", hi: "कुम्भ" },
  { en: "Pisces", hi: "मीन" },
] as const;

export const SIGN_LORDS = [
  { en: "Mars", hi: "मंगल" },
  { en: "Venus", hi: "शुक्र" },
  { en: "Mercury", hi: "बुध" },
  { en: "Moon", hi: "चंद्र" },
  { en: "Sun", hi: "सूर्य" },
  { en: "Mercury", hi: "बुध" },
  { en: "Venus", hi: "शुक्र" },
  { en: "Mars", hi: "मंगल" },
  { en: "Jupiter", hi: "गुरु" },
  { en: "Saturn", hi: "शनि" },
  { en: "Saturn", hi: "शनि" },
  { en: "Jupiter", hi: "गुरु" },
] as const;

export const NAKSHATRAS = [
  { en: "Ashwini", hi: "अश्विनी", lord: { en: "Ketu", hi: "केतु" } },
  { en: "Bharani", hi: "भरणी", lord: { en: "Venus", hi: "शुक्र" } },
  { en: "Krittika", hi: "कृत्तिका", lord: { en: "Sun", hi: "सूर्य" } },
  { en: "Rohini", hi: "रोहिणी", lord: { en: "Moon", hi: "चंद्र" } },
  { en: "Mrigashira", hi: "मृगशिरा", lord: { en: "Mars", hi: "मंगल" } },
  { en: "Ardra", hi: "आर्द्रा", lord: { en: "Rahu", hi: "राहु" } },
  { en: "Punarvasu", hi: "पुनर्वसु", lord: { en: "Jupiter", hi: "गुरु" } },
  { en: "Pushya", hi: "पुष्य", lord: { en: "Saturn", hi: "शनि" } },
  { en: "Ashlesha", hi: "आश्लेषा", lord: { en: "Mercury", hi: "बुध" } },
  { en: "Magha", hi: "मघा", lord: { en: "Ketu", hi: "केतु" } },
  { en: "Purva Phalguni", hi: "पूर्व फाल्गुनी", lord: { en: "Venus", hi: "शुक्र" } },
  { en: "Uttara Phalguni", hi: "उत्तर फाल्गुनी", lord: { en: "Sun", hi: "सूर्य" } },
  { en: "Hasta", hi: "हस्त", lord: { en: "Moon", hi: "चंद्र" } },
  { en: "Chitra", hi: "चित्रा", lord: { en: "Mars", hi: "मंगल" } },
  { en: "Swati", hi: "स्वाति", lord: { en: "Rahu", hi: "राहु" } },
  { en: "Vishakha", hi: "विशाखा", lord: { en: "Jupiter", hi: "गुरु" } },
  { en: "Anuradha", hi: "अनुराधा", lord: { en: "Saturn", hi: "शनि" } },
  { en: "Jyeshtha", hi: "ज्येष्ठा", lord: { en: "Mercury", hi: "बुध" } },
  { en: "Mula", hi: "मूल", lord: { en: "Ketu", hi: "केतु" } },
  { en: "Purva Ashadha", hi: "पूर्वाषाढ़ा", lord: { en: "Venus", hi: "शुक्र" } },
  { en: "Uttara Ashadha", hi: "उत्तराषाढ़ा", lord: { en: "Sun", hi: "सूर्य" } },
  { en: "Shravana", hi: "श्रवण", lord: { en: "Moon", hi: "चंद्र" } },
  { en: "Dhanishta", hi: "धनिष्ठा", lord: { en: "Mars", hi: "मंगल" } },
  { en: "Shatabhisha", hi: "शतभिषा", lord: { en: "Rahu", hi: "राहु" } },
  { en: "Purva Bhadrapada", hi: "पूर्व भाद्रपद", lord: { en: "Jupiter", hi: "गुरु" } },
  { en: "Uttara Bhadrapada", hi: "उत्तर भाद्रपद", lord: { en: "Saturn", hi: "शनि" } },
  { en: "Revati", hi: "रेवती", lord: { en: "Mercury", hi: "बुध" } },
] as const;

export const PLANET_META: Record<
  string,
  { en: string; hi: string }
> = {
  sun: { en: "Sun", hi: "सूर्य" },
  moon: { en: "Moon", hi: "चंद्र" },
  mars: { en: "Mars", hi: "मंगल" },
  mercury: { en: "Mercury", hi: "बुध" },
  jupiter: { en: "Jupiter", hi: "गुरु" },
  venus: { en: "Venus", hi: "शुक्र" },
  saturn: { en: "Saturn", hi: "शनि" },
  rahu: { en: "Rahu", hi: "राहु" },
  ketu: { en: "Ketu", hi: "केतु" },
};

export const HOUSE_THEMES = [
  { en: "Self, body, vitality", hi: "स्वयं, शरीर, ऊर्जा" },
  { en: "Wealth, speech, family", hi: "धन, वाणी, परिवार" },
  { en: "Siblings, courage, short travel", hi: "भाई-बहन, साहस, लघु यात्रा" },
  { en: "Home, mother, emotions", hi: "घर, माता, भावनाएँ" },
  { en: "Children, creativity, intellect", hi: "संतान, रचनात्मकता, बुद्धि" },
  { en: "Health, service, routines", hi: "स्वास्थ्य, सेवा, दिनचर्या" },
  { en: "Partnership, marriage, contracts", hi: "साझेदारी, विवाह, अनुबंध" },
  { en: "Longevity, transformation, occult", hi: "आयु, परिवर्तन, गुप्त ज्ञान" },
  { en: "Fortune, dharma, higher learning", hi: "भाग्य, धर्म, उच्च शिक्षा" },
  { en: "Career, status, public life", hi: "करियर, प्रतिष्ठा, सार्वजनिक जीवन" },
  { en: "Gains, networks, aspirations", hi: "लाभ, नेटवर्क, आकांक्षाएँ" },
  { en: "Expenses, losses, liberation", hi: "व्यय, हानि, मोक्ष" },
] as const;

/** Vimshottari dasha years in order starting from Ketu */
export const DASHA_ORDER = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
] as const;

export const DASHA_YEARS: Record<(typeof DASHA_ORDER)[number], number> = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};

export const NAKSHATRA_SPAN = 360 / 27; // 13°20'
