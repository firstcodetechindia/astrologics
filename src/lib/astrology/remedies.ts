import { PLANET_META, SIGN_LORDS, SIGNS } from "./constants";

const GEM_BY_PLANET: Record<string, { en: string; hi: string; wear: { en: string; hi: string } }> = {
  sun: {
    en: "Ruby",
    hi: "माणिक",
    wear: { en: "Gold, ring finger, Sunday morning", hi: "सोना, अनामिका, रविवार सुबह" },
  },
  moon: {
    en: "Pearl",
    hi: "मोती",
    wear: { en: "Silver, little finger, Monday", hi: "चाँदी, कनिष्ठा, सोमवार" },
  },
  mars: {
    en: "Red Coral",
    hi: "मूंगा",
    wear: { en: "Gold/copper, ring finger, Tuesday", hi: "सोना/तांबा, अनामिका, मंगलवार" },
  },
  mercury: {
    en: "Emerald",
    hi: "पन्ना",
    wear: { en: "Gold, little finger, Wednesday", hi: "सोना, कनिष्ठा, बुधवार" },
  },
  jupiter: {
    en: "Yellow Sapphire",
    hi: "पुखराज",
    wear: { en: "Gold, index finger, Thursday", hi: "सोना, तर्जनी, गुरुवार" },
  },
  venus: {
    en: "Diamond / White Sapphire",
    hi: "हीरा / सफेद पुखराज",
    wear: { en: "Silver/platinum, middle finger, Friday", hi: "चाँदी, मध्यमा, शुक्रवार" },
  },
  saturn: {
    en: "Blue Sapphire",
    hi: "नीलम",
    wear: { en: "Silver, middle finger, Saturday — only after expert check", hi: "चाँदी, मध्यमा, शनिवार — विशेषज्ञ सलाह के बाद" },
  },
  rahu: {
    en: "Hessonite (Gomed)",
    hi: "गोमेद",
    wear: { en: "Silver, middle finger — expert guidance advised", hi: "चाँदी, मध्यमा — विशेषज्ञ सलाह आवश्यक" },
  },
  ketu: {
    en: "Cat's Eye",
    hi: "लहसुनिया",
    wear: { en: "Silver, middle/little finger — expert guidance advised", hi: "चाँदी — विशेषज्ञ सलाह आवश्यक" },
  },
};

const RUDRAKSHA_BY_PLANET: Record<string, { mukhi: number; en: string; hi: string }> = {
  sun: { mukhi: 1, en: "1 Mukhi", hi: "एक मुखी" },
  moon: { mukhi: 2, en: "2 Mukhi", hi: "दो मुखी" },
  mars: { mukhi: 3, en: "3 Mukhi", hi: "तीन मुखी" },
  mercury: { mukhi: 4, en: "4 Mukhi", hi: "चार मुखी" },
  jupiter: { mukhi: 5, en: "5 Mukhi", hi: "पाँच मुखी" },
  venus: { mukhi: 6, en: "6 Mukhi", hi: "छह मुखी" },
  saturn: { mukhi: 7, en: "7 Mukhi", hi: "सात मुखी" },
  rahu: { mukhi: 8, en: "8 Mukhi", hi: "आठ मुखी" },
  ketu: { mukhi: 9, en: "9 Mukhi", hi: "नौ मुखी" },
};

const SIGN_TO_PLANET_KEY = [
  "mars",
  "venus",
  "mercury",
  "moon",
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "saturn",
  "jupiter",
] as const;

export function gemstoneForSign(signIndex: number) {
  const planet = SIGN_TO_PLANET_KEY[signIndex];
  return {
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    lord: SIGN_LORDS[signIndex],
    planet: PLANET_META[planet],
    gem: GEM_BY_PLANET[planet],
    disclaimer: {
      en: "Gemstones can strengthen or disturb — confirm with a full chart reading.",
      hi: "रत्न लाभ या हानि दोनों कर सकते हैं — पूर्ण कुंडली से पुष्टि करें।",
    },
  };
}

export function rudrakshaForSign(signIndex: number) {
  const planet = SIGN_TO_PLANET_KEY[signIndex];
  return {
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    planet: PLANET_META[planet],
    bead: RUDRAKSHA_BY_PLANET[planet],
    disclaimer: {
      en: "Choose after personal chart review when possible.",
      hi: "संभव हो तो व्यक्तिगत कुंडली देखने के बाद चुनें।",
    },
  };
}

/** Simplified Jaimini: Atmakaraka = highest degree planet (7 chara karakas excl. nodes often). */
export function charaKarakas(
  planets: { id: string; name: { en: string; hi: string }; degreeInSign: number; longitude: number }[]
) {
  const seven = planets.filter((p) =>
    ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"].includes(p.id)
  );
  const ranked = [...seven].sort((a, b) => b.degreeInSign - a.degreeInSign);
  const labels = [
    { en: "Atmakaraka (soul)", hi: "आत्माकारक" },
    { en: "Amatyakaraka (career)", hi: "अमात्यकारक" },
    { en: "Bhratrikaraka (siblings)", hi: "भ्रातृकारक" },
    { en: "Matrikaraka (mother)", hi: "मातृकारक" },
    { en: "Putrakaraka (children)", hi: "पुत्रकारक" },
    { en: "Gnatikaraka (obstacles)", hi: "ज्ञातिकारक" },
    { en: "Darakaraka (spouse)", hi: "दाराकारक" },
  ];
  return ranked.map((p, i) => ({
    karaka: labels[i],
    planet: p.name,
    degreeInSign: p.degreeInSign,
  }));
}

/** Ishta Devata from Karakamsa — simplified: Atmakaraka's navamsa sign deity. */
export function ishtaDevata(atmakarakaSignIndex: number) {
  const deities = [
    { en: "Sri Rama / Kartikeya", hi: "श्री राम / कार्तिकेय" },
    { en: "Gauri / Lakshmi", hi: "गौरी / लक्ष्मी" },
    { en: "Vishnu / Narayana", hi: "विष्णु / नारायण" },
    { en: "Shiva / Durga", hi: "शिव / दुर्गा" },
    { en: "Surya Narayana", hi: "सूर्य नारायण" },
    { en: "Vishnu", hi: "विष्णु" },
    { en: "Lakshmi / Indrani", hi: "लक्ष्मी / इंद्राणी" },
    { en: "Narayana / Kartikeya", hi: "नारायण / कार्तिकेय" },
    { en: "Dattatreya / Indra", hi: "दत्तात्रेय / इन्द्र" },
    { en: "Vishnu / Kali", hi: "विष्णु / काली" },
    { en: "Ganesha / Kali", hi: "गणेश / काली" },
    { en: "Durga / Saraswati", hi: "दुर्गा / सरस्वती" },
  ];
  return {
    sign: { en: SIGNS[atmakarakaSignIndex].en, hi: SIGNS[atmakarakaSignIndex].hi },
    deity: deities[atmakarakaSignIndex],
    note: {
      en: "Simplified Karakamsa method — confirm with a Jaimini scholar for puja practice.",
      hi: "सरलीकृत कारकअंश विधि — पूजा हेतु विशेषज्ञ पुष्टि लें।",
    },
  };
}
