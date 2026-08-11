/**
 * Avakhada Chakra — classical lookup tables from Moon Rashi / Nakshatra / Pada.
 */
import { NAKSHATRAS, SIGN_LORDS, SIGNS } from "./constants";

const VARNA_BY_RASHI = [
  { en: "Kshatriya", hi: "क्षत्रिय" }, // Aries
  { en: "Vaishya", hi: "वैश्य" },
  { en: "Shudra", hi: "शूद्र" },
  { en: "Brahmin", hi: "ब्राह्मण" },
  { en: "Kshatriya", hi: "क्षत्रिय" },
  { en: "Vaishya", hi: "वैश्य" },
  { en: "Shudra", hi: "शूद्र" },
  { en: "Brahmin", hi: "ब्राह्मण" },
  { en: "Kshatriya", hi: "क्षत्रिय" },
  { en: "Vaishya", hi: "वैश्य" },
  { en: "Shudra", hi: "शूद्र" },
  { en: "Brahmin", hi: "ब्राह्मण" },
] as const;

const VASHYA_BY_RASHI = [
  { en: "Chatushpada", hi: "चतुष्पाद" },
  { en: "Chatushpada", hi: "चतुष्पाद" },
  { en: "Manav", hi: "मानव" },
  { en: "Jalachar", hi: "जलाचर" },
  { en: "Vanachar", hi: "वनाचर" },
  { en: "Manav", hi: "मानव" },
  { en: "Manav", hi: "मानव" },
  { en: "Keeta", hi: "कीट" },
  { en: "Manav", hi: "मानव" },
  { en: "Chatushpada", hi: "चतुष्पाद" },
  { en: "Manav", hi: "मानव" },
  { en: "Jalachar", hi: "जलाचर" },
] as const;

const YONI_BY_NAK = [
  { en: "Ashwa (Horse)", hi: "अश्व" },
  { en: "Gaja (Elephant)", hi: "गज" },
  { en: "Mesh (Goat)", hi: "मेष" },
  { en: "Sarpa (Serpent)", hi: "सर्प" },
  { en: "Shwan (Dog)", hi: "श्वान" },
  { en: "Marjar (Cat)", hi: "मार्जार" },
  { en: "Mushak (Rat)", hi: "मूषक" },
  { en: "Gau (Cow)", hi: "गौ" },
  { en: "Mahish (Buffalo)", hi: "महिष" },
  { en: "Vyaghra (Tiger)", hi: "व्याघ्र" },
  { en: "Mriga (Deer)", hi: "मृग" },
  { en: "Vanar (Monkey)", hi: "वानर" },
  { en: "Nakul (Mongoose)", hi: "नकुल" },
  { en: "Simha (Lion)", hi: "सिंह" }, // Chitra shares with sometimes Mesh — classical: Vyaghra for Chitra often; using common tables
  { en: "Mahish (Buffalo)", hi: "महिष" },
  { en: "Vyaghra (Tiger)", hi: "व्याघ्र" },
  { en: "Mriga (Deer)", hi: "मृग" },
  { en: "Mriga (Deer)", hi: "मृग" },
  { en: "Shwan (Dog)", hi: "श्वान" },
  { en: "Vanar (Monkey)", hi: "वानर" },
  { en: "Nakula (Mongoose)", hi: "नकुल" },
  { en: "Vanar (Monkey)", hi: "वानर" },
  { en: "Simha (Lion)", hi: "सिंह" },
  { en: "Ashwa (Horse)", hi: "अश्व" },
  { en: "Simha (Lion)", hi: "सिंह" },
  { en: "Gau (Cow)", hi: "गौ" },
  { en: "Gaja (Elephant)", hi: "गज" },
] as const;

/** Deva / Manushya / Rakshasa by nakshatra index 0–26 */
const GANA_BY_NAK: ("Deva" | "Manushya" | "Rakshasa")[] = [
  "Deva",
  "Manushya",
  "Rakshasa",
  "Manushya",
  "Deva",
  "Manushya",
  "Deva",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
  "Rakshasa",
  "Deva",
  "Rakshasa",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
  "Rakshasa",
  "Rakshasa",
  "Manushya",
  "Manushya",
  "Deva",
];

const NADI_BY_NAK: ("Adi" | "Madhya" | "Antya")[] = [
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
  "Adi",
  "Madhya",
  "Antya",
];

const PAYA_BY_LORD: Record<string, { en: string; hi: string }> = {
  sun: { en: "Gold", hi: "स्वर्ण" },
  moon: { en: "Silver", hi: "रजत" },
  mars: { en: "Copper", hi: "ताम्र" },
  mercury: { en: "Iron", hi: "लोह" },
  jupiter: { en: "Gold", hi: "स्वर्ण" },
  venus: { en: "Silver", hi: "रजत" },
  saturn: { en: "Iron", hi: "लोह" },
  rahu: { en: "Iron", hi: "लोह" },
  ketu: { en: "Iron", hi: "लोह" },
};

/** First syllable suggestions by pada (simplified classical namakshar). */
const NAME_LETTERS: string[][] = [
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
  ["Du", "Tha", "Jha", "Da"],
  ["De", "Do", "Cha", "Chi"],
];

const GANA_LABEL = {
  Deva: { en: "Deva", hi: "देव" },
  Manushya: { en: "Manushya", hi: "मनुष्य" },
  Rakshasa: { en: "Rakshasa", hi: "राक्षस" },
} as const;

const NADI_LABEL = {
  Adi: { en: "Adi (Vata)", hi: "आदि" },
  Madhya: { en: "Madhya (Pitta)", hi: "मध्य" },
  Antya: { en: "Antya (Kapha)", hi: "अंत्य" },
} as const;

export type AvakhadaResult = {
  varna: { en: string; hi: string };
  vashya: { en: string; hi: string };
  yoni: { en: string; hi: string };
  gana: { en: string; hi: string };
  nadi: { en: string; hi: string };
  paya: { en: string; hi: string };
  charan: number;
  nameAlphabet: string;
  moonSign: { en: string; hi: string };
  nakshatra: { en: string; hi: string };
  nakshatraLord: { en: string; hi: string };
  moonSignLord: { en: string; hi: string };
};

export function computeAvakhada(opts: {
  moonSignIndex: number;
  nakshatraIndex: number;
  pada: number;
}): AvakhadaResult {
  const ni = ((opts.nakshatraIndex % 27) + 27) % 27;
  const pada = Math.min(4, Math.max(1, opts.pada));
  const lordKey = NAKSHATRAS[ni].lord.en.toLowerCase();
  const gana = GANA_BY_NAK[ni];
  const nadi = NADI_BY_NAK[ni];
  const letters = NAME_LETTERS[ni] || ["A", "I", "U", "E"];

  return {
    varna: VARNA_BY_RASHI[opts.moonSignIndex],
    vashya: VASHYA_BY_RASHI[opts.moonSignIndex],
    yoni: YONI_BY_NAK[ni],
    gana: GANA_LABEL[gana],
    nadi: NADI_LABEL[nadi],
    paya: PAYA_BY_LORD[lordKey] || { en: "Iron", hi: "लोह" },
    charan: pada,
    nameAlphabet: letters[pada - 1] || letters[0],
    moonSign: {
      en: SIGNS[opts.moonSignIndex].en,
      hi: SIGNS[opts.moonSignIndex].hi,
    },
    nakshatra: {
      en: NAKSHATRAS[ni].en,
      hi: NAKSHATRAS[ni].hi,
    },
    nakshatraLord: {
      en: NAKSHATRAS[ni].lord.en,
      hi: NAKSHATRAS[ni].lord.hi,
    },
    moonSignLord: {
      en: SIGN_LORDS[opts.moonSignIndex].en,
      hi: SIGN_LORDS[opts.moonSignIndex].hi,
    },
  };
}
