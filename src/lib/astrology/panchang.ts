import { NAKSHATRAS, NAKSHATRA_SPAN } from "./constants";
import { dateToJulianDay, lahiriAyanamsaFromDate, norm360 } from "./math";
import { getSiderealPlanets } from "./planets";
import { nakshatraFromLongitude } from "./nakshatra";

const TITHIS = [
  { en: "Pratipada", hi: "प्रतिपदा" },
  { en: "Dwitiya", hi: "द्वितीया" },
  { en: "Tritiya", hi: "तृतीया" },
  { en: "Chaturthi", hi: "चतुर्थी" },
  { en: "Panchami", hi: "पंचमी" },
  { en: "Shashthi", hi: "षष्ठी" },
  { en: "Saptami", hi: "सप्तमी" },
  { en: "Ashtami", hi: "अष्टमी" },
  { en: "Navami", hi: "नवमी" },
  { en: "Dashami", hi: "दशमी" },
  { en: "Ekadashi", hi: "एकादशी" },
  { en: "Dwadashi", hi: "द्वादशी" },
  { en: "Trayodashi", hi: "त्रयोदशी" },
  { en: "Chaturdashi", hi: "चतुर्दशी" },
  { en: "Purnima / Amavasya", hi: "पूर्णिमा / अमावस्या" },
] as const;

const YOGAS = [
  { en: "Vishkambha", hi: "विष्कम्भ" },
  { en: "Priti", hi: "प्रीति" },
  { en: "Ayushman", hi: "आयुष्मान" },
  { en: "Saubhagya", hi: "सौभाग्य" },
  { en: "Shobhana", hi: "शोभन" },
  { en: "Atiganda", hi: "अतिगण्ड" },
  { en: "Sukarma", hi: "सुकर्म" },
  { en: "Dhriti", hi: "धृति" },
  { en: "Shoola", hi: "शूल" },
  { en: "Ganda", hi: "गण्ड" },
  { en: "Vriddhi", hi: "वृद्धि" },
  { en: "Dhruva", hi: "ध्रुव" },
  { en: "Vyaghata", hi: "व्याघात" },
  { en: "Harshana", hi: "हर्षण" },
  { en: "Vajra", hi: "वज्र" },
  { en: "Siddhi", hi: "सिद्धि" },
  { en: "Vyatipata", hi: "व्यतीपात" },
  { en: "Variyan", hi: "वरीयान" },
  { en: "Parigha", hi: "परिघ" },
  { en: "Shiva", hi: "शिव" },
  { en: "Siddha", hi: "सिद्ध" },
  { en: "Sadhya", hi: "साध्य" },
  { en: "Shubha", hi: "शुभ" },
  { en: "Shukla", hi: "शुक्ल" },
  { en: "Brahma", hi: "ब्रह्म" },
  { en: "Indra", hi: "इन्द्र" },
  { en: "Vaidhriti", hi: "वैधृति" },
] as const;

const KARANAS = [
  { en: "Bava", hi: "बव" },
  { en: "Balava", hi: "बालव" },
  { en: "Kaulava", hi: "कौलव" },
  { en: "Taitila", hi: "तैतिल" },
  { en: "Gara", hi: "गर" },
  { en: "Vanija", hi: "वणिज" },
  { en: "Vishti", hi: "विष्टि" },
  { en: "Shakuni", hi: "शकुनि" },
  { en: "Chatushpada", hi: "चतुष्पाद" },
  { en: "Naga", hi: "नाग" },
  { en: "Kimstughna", hi: "किंस्तुघ्न" },
] as const;

const WEEKDAYS = [
  { en: "Sunday", hi: "रविवार" },
  { en: "Monday", hi: "सोमवार" },
  { en: "Tuesday", hi: "मंगलवार" },
  { en: "Wednesday", hi: "बुधवार" },
  { en: "Thursday", hi: "गुरुवार" },
  { en: "Friday", hi: "शुक्रवार" },
  { en: "Saturday", hi: "शनिवार" },
] as const;

function karanaIndex(tithiElongation: number): number {
  const half = Math.floor(norm360(tithiElongation) / 6);
  if (half === 0) return 10; // Kimstughna
  if (half >= 57) return 7 + (half - 57); // Shakuni, Chatushpada, Naga
  return (half - 1) % 7;
}

export function computePanchang(date: Date) {
  const ayanamsa = lahiriAyanamsaFromDate(date);
  const { planets } = getSiderealPlanets(date, ayanamsa);
  const sun = planets.find((p) => p.id === "sun")!;
  const moon = planets.find((p) => p.id === "moon")!;

  const elongation = norm360(moon.longitude - sun.longitude);
  const tithiIndex = Math.floor(elongation / 12); // 0-29
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiInPaksha = tithiIndex % 15;

  const yogaLon = norm360(sun.longitude + moon.longitude);
  const yogaIndex = Math.floor(yogaLon / NAKSHATRA_SPAN) % 27;
  const moonNak = nakshatraFromLongitude(moon.longitude);

  // Approximate weekday from Julian day (0 = Mon in JS Date — use UTC day)
  const weekday = date.getUTCDay();

  return {
    date: date.toISOString(),
    ayanamsa,
    weekday: WEEKDAYS[weekday],
    paksha: {
      en: paksha === "Shukla" ? "Shukla (waxing)" : "Krishna (waning)",
      hi: paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष",
      id: paksha,
    },
    tithi: {
      index: tithiIndex + 1,
      name: TITHIS[tithiInPaksha],
      degree: elongation % 12,
    },
    nakshatra: moonNak,
    yoga: {
      index: yogaIndex + 1,
      name: YOGAS[yogaIndex],
    },
    karana: {
      name: KARANAS[karanaIndex(elongation)],
    },
    sunLongitude: sun.longitude,
    moonLongitude: moon.longitude,
  };
}

export function computeBirthPanchang(isoDate: string, time = "12:00", tz = 330) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm, 0) - tz * 60 * 1000;
  return computePanchang(new Date(utcMs));
}

export function julianDayHint(date: Date) {
  return dateToJulianDay(date);
}

export { NAKSHATRAS };
