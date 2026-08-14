import { NAKSHATRAS, NAKSHATRA_SPAN } from "./constants";
import { dateToJulianDay, lahiriAyanamsaFromDate, norm360 } from "./math";
import { getSiderealPlanets } from "./planets";
import { nakshatraFromLongitude } from "./nakshatra";
import { weekdayFromOffset } from "./timezone";

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

export function computePanchang(
  date: Date,
  opts?: { timezoneOffsetMinutes?: number }
) {
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

  // Civil weekday for the observer offset (default IST)
  const weekday = weekdayFromOffset(
    date,
    opts?.timezoneOffsetMinutes ?? 330
  );

  let tithiName = TITHIS[tithiInPaksha] as { en: string; hi: string };
  if (tithiInPaksha === 14) {
    tithiName =
      paksha === "Shukla"
        ? { en: "Purnima", hi: "पूर्णिमा" }
        : { en: "Amavasya", hi: "अमावस्या" };
  }

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
      name: tithiName,
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

const LUNAR_MASA: { id: string; en: string; hi: string }[] = [
  { id: "Chaitra", en: "Chaitra", hi: "चैत्र" },
  { id: "Vaishakha", en: "Vaishakha", hi: "वैशाख" },
  { id: "Jyeshtha", en: "Jyeshtha", hi: "ज्येष्ठ" },
  { id: "Ashadha", en: "Ashadha", hi: "आषाढ़" },
  { id: "Shravana", en: "Shravana", hi: "श्रावण" },
  { id: "Bhadrapada", en: "Bhadrapada", hi: "भाद्रपद" },
  { id: "Ashwina", en: "Ashwina", hi: "आश्विन" },
  { id: "Kartika", en: "Kartika", hi: "कार्तिक" },
  { id: "Margashirsha", en: "Margashirsha", hi: "मार्गशीर्ष" },
  { id: "Pausha", en: "Pausha", hi: "पौष" },
  { id: "Magha", en: "Magha", hi: "माघ" },
  { id: "Phalguna", en: "Phalguna", hi: "फाल्गुन" },
];

/** Purnima Moon nakshatra → Amanta lunar month (named after that Purnima). */
const MASA_BY_PURNIMA_NAK = [
  "Ashwina",
  "Ashwina",
  "Kartika",
  "Kartika",
  "Margashirsha",
  "Margashirsha",
  "Pausha",
  "Pausha",
  "Pausha",
  "Magha",
  "Phalguna",
  "Phalguna",
  "Phalguna",
  "Chaitra",
  "Chaitra",
  "Vaishakha",
  "Vaishakha",
  "Jyeshtha",
  "Jyeshtha",
  "Ashadha",
  "Ashadha",
  "Shravana",
  "Shravana",
  "Bhadrapada",
  "Bhadrapada",
  "Bhadrapada",
  "Ashwina",
] as const;

function masaRow(id: string) {
  return LUNAR_MASA.find((m) => m.id === id) || LUNAR_MASA[0]!;
}

/**
 * Amanta lunar month named by the Purnima Moon nakshatra of this lunar month.
 * Shukla paksha → upcoming Purnima; Krishna paksha → Purnima just passed.
 * Same astronomy-engine + Lahiri stack as computePanchang — not a civil MM-DD table.
 */
export function lunarMasaAt(date: Date, opts?: { timezoneOffsetMinutes?: number }) {
  const tz = opts?.timezoneOffsetMinutes ?? 330;
  const here = computePanchang(date, { timezoneOffsetMinutes: tz });
  const tithiIndex = here.tithi.index - 1;
  const dir: 1 | -1 = tithiIndex <= 14 ? 1 : -1;
  let purnima = date;
  if (here.tithi.index !== 15) {
    let t = date.getTime();
    let found = false;
    for (let step = 0; step < 18 * 24; step += 1) {
      t += dir * 60 * 60 * 1000;
      const q = computePanchang(new Date(t), { timezoneOffsetMinutes: tz });
      if (q.tithi.index === 15) {
        purnima = new Date(t);
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error("Could not locate Purnima for lunar masa (search window 18d).");
    }
  }
  const atPurnima = computePanchang(purnima, { timezoneOffsetMinutes: tz });
  const masaId = MASA_BY_PURNIMA_NAK[atPurnima.nakshatra.index] || "Chaitra";
  const row = masaRow(masaId);
  return {
    id: row.id,
    name: { en: row.en, hi: row.hi },
    pakshaId: here.paksha.id as "Shukla" | "Krishna",
    tithiInPaksha: tithiIndex % 15,
    tithiIndex: here.tithi.index,
    purnimaNakshatra: atPurnima.nakshatra.name.en,
    method: "purnima-nakshatra" as const,
  };
}

export function computeBirthPanchang(isoDate: string, time = "12:00", tz = 330) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm, 0) - tz * 60 * 1000;
  return computePanchang(new Date(utcMs), { timezoneOffsetMinutes: tz });
}

export function julianDayHint(date: Date) {
  return dateToJulianDay(date);
}

export { NAKSHATRAS };
