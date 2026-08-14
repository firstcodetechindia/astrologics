import { computeTodayPanchang } from "@/lib/astrology/today-panchang";

export type HinduFestival = {
  id: string;
  masa: string;
  paksha: "Shukla" | "Krishna";
  /** 0 Pratipada … 7 Ashtami … 14 Purnima/Amavasya */
  tithiInPaksha: number;
  /** When two Purnimas map to the same masa name, pin the festival to these naks. */
  purnimaNakshatra?: string[];
  en: string;
  hi: string;
};

/**
 * Tithi festivals keyed to Amanta masa from lunarMasaAt (Purnima-nakshatra).
 * Not Gregorian MM-DD. Same Panchang engine as /panchang.
 */
export const HINDU_TITHI_FESTIVALS: HinduFestival[] = [
  { id: "rama-navami", masa: "Chaitra", paksha: "Shukla", tithiInPaksha: 8, en: "Rama Navami", hi: "राम नवमी" },
  { id: "hanuman-jayanti", masa: "Chaitra", paksha: "Shukla", tithiInPaksha: 14, en: "Hanuman Jayanti", hi: "हनुमान जयंती" },
  { id: "guru-purnima", masa: "Ashadha", paksha: "Shukla", tithiInPaksha: 14, en: "Guru Purnima", hi: "गुरु पूर्णिमा" },
  { id: "raksha-bandhan", masa: "Shravana", paksha: "Shukla", tithiInPaksha: 14, en: "Raksha Bandhan", hi: "रक्षा बंधन" },
  { id: "janmashtami", masa: "Bhadrapada", paksha: "Krishna", tithiInPaksha: 7, en: "Janmashtami", hi: "जन्माष्टमी" },
  { id: "ganesh-chaturthi", masa: "Bhadrapada", paksha: "Shukla", tithiInPaksha: 3, en: "Ganesh Chaturthi", hi: "गणेश चतुर्थी" },
  { id: "navaratri-start", masa: "Ashwina", paksha: "Shukla", tithiInPaksha: 0, purnimaNakshatra: ["Revati", "Ashwini"], en: "Sharad Navaratri begins", hi: "शरद नवरात्रि आरंभ" },
  { id: "dussehra", masa: "Ashwina", paksha: "Shukla", tithiInPaksha: 9, en: "Dussehra", hi: "दशहरा" },
  { id: "diwali", masa: "Ashwina", paksha: "Krishna", tithiInPaksha: 14, en: "Diwali", hi: "दीपावली" },
  { id: "holi", masa: "Phalguna", paksha: "Shukla", tithiInPaksha: 14, en: "Holi / Holika Dahan", hi: "होली / होलिका दहन" },
  { id: "maha-shivaratri", masa: "Magha", paksha: "Krishna", tithiInPaksha: 13, en: "Maha Shivaratri", hi: "महाशिवरात्रि" },
];

export function hinduFestivalOnDate(ymd: string, locale: "en" | "hi" = "en") {
  const p = computeTodayPanchang({ date: ymd, timeZone: "Asia/Kolkata" });
  const masaId = p.limbs.masa.id;
  const paksha = p.limbs.paksha.id;
  const tithiInPaksha = p.limbs.tithiInPaksha;
  const hit = HINDU_TITHI_FESTIVALS.find((f) => {
    if (f.masa !== masaId || f.paksha !== paksha || f.tithiInPaksha !== tithiInPaksha) return false;
    if (f.purnimaNakshatra?.length) {
      return f.purnimaNakshatra.includes(p.limbs.masa.purnimaNakshatra);
    }
    return true;
  });
  return {
    ymd,
    masaId,
    masa: p.limbs.masa.name,
    paksha,
    tithiInPaksha,
    tithiIndex: p.limbs.tithi.index,
    tithiName: p.limbs.tithi.name,
    purnimaNakshatra: p.limbs.masa.purnimaNakshatra,
    festival: hit
      ? { id: hit.id, name: locale === "hi" ? hit.hi : hit.en, en: hit.en, hi: hit.hi }
      : null,
  };
}
