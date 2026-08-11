import { computeKundli, parseBirthDateTime } from "./compute";
import {
  kaalSarpDosha,
  mangalDosha,
  pitraDosha,
  sadeSati,
} from "./doshas";
import { ashtakootMatch } from "./matching";
import { lahiriAyanamsaFromDate, norm360, signIndexFromLongitude } from "./math";
import { computeNavamsaChart, navamsaSignIndex } from "./navamsa";
import {
  babyNameLetters,
  digitNumberFromString,
  lifePathFromDate,
  loShuGrid,
  lovePercentage,
  nameNumber,
  personalYear,
} from "./numerology";
import { computeBirthPanchang } from "./panchang";
import { computeTodayPanchang } from "./today-panchang";
import {
  charaKarakas,
  gemstoneForSign,
  ishtaDevata,
  rudrakshaForSign,
} from "./remedies";
import { kpHorary, kpRulingPlanetsNow, kpSubLord, moonPhase } from "./kp";
import type { BirthInput } from "./types";
import { SIGNS } from "./constants";
import { dailyMuhuratFor } from "./muhurat-now";

export type CalcPayload = Record<string, unknown>;

function placeDateFrom(payload: CalcPayload) {
  const lat = Number(payload.lat ?? 28.6139);
  const lon = Number(payload.lon ?? 77.209);
  const tz = String(payload.timeZone || "Asia/Kolkata");
  const dateStr = String(payload.date || "");
  let date = new Date();
  if (dateStr) {
    // Interpret as local noon in India-ish offset to avoid UTC day-shift surprises
    const [y, m, d] = dateStr.split("-").map(Number);
    if (y && m && d) {
      date = new Date(Date.UTC(y, m - 1, d, 6, 30, 0)); // ~12:00 IST
    }
  }
  return { date, lat, lon, tz, place: String(payload.place || "New Delhi, India") };
}

function birthFrom(payload: CalcPayload): BirthInput {
  return {
    name: String(payload.name || "Native"),
    gender: payload.gender as BirthInput["gender"],
    date: String(payload.date),
    time: String(payload.time || "12:00"),
    place: String(payload.place || "India"),
    lat: Number(payload.lat ?? 28.6139),
    lon: Number(payload.lon ?? 77.209),
    timezoneOffsetMinutes: Number(payload.timezoneOffsetMinutes ?? 330),
  };
}

export function runCalculator(slug: string, payload: CalcPayload) {
  switch (slug) {
    case "moon-sign":
    case "sun-sign":
    case "nakshatra":
    case "lagna":
    case "vimshottari-dasha":
    case "birth-chart-lite": {
      const k = computeKundli(birthFrom(payload));
      if (slug === "moon-sign")
        return { moonRashi: k.moonRashi, nakshatra: k.nakshatra };
      if (slug === "sun-sign") {
        const tropical = signIndexFromLongitude(
          norm360(k.planets.find((p) => p.id === "sun")!.longitude + k.ayanamsa)
        );
        return {
          vedic: k.sunRashi,
          westernApprox: { en: SIGNS[tropical].en, hi: SIGNS[tropical].hi, signIndex: tropical },
          ayanamsa: k.ayanamsa,
        };
      }
      if (slug === "nakshatra") return { nakshatra: k.nakshatra, moonRashi: k.moonRashi };
      if (slug === "lagna") return { lagna: k.lagna, ayanamsa: k.ayanamsa };
      if (slug === "vimshottari-dasha") return { dasha: k.dasha, nakshatra: k.nakshatra };
      return {
        lagna: k.lagna,
        moonRashi: k.moonRashi,
        sunRashi: k.sunRashi,
        nakshatra: k.nakshatra,
        planets: k.planets,
      };
    }

    case "navamsa": {
      const k = computeKundli(birthFrom(payload));
      return k.divisionalCharts?.D9 ?? computeNavamsaChart(k.planets, k.lagna.longitude);
    }

    case "dashamsa":
    case "d10": {
      const k = computeKundli(birthFrom(payload));
      return k.divisionalCharts?.D10;
    }

    case "transits": {
      const k = computeKundli(birthFrom(payload));
      return k.transits;
    }

    case "moon-phase": {
      const input = birthFrom(payload);
      const date = parseBirthDateTime(input);
      const phase = moonPhase(date);
      let compare = null;
      if (payload.date2) {
        const d2 = parseBirthDateTime({
          ...input,
          date: String(payload.date2),
          time: String(payload.time2 || "12:00"),
        });
        compare = moonPhase(d2);
      }
      return { phase, compare };
    }

    case "mangal-dosha": {
      const k = computeKundli(birthFrom(payload));
      return mangalDosha(k.planets, k.lagna.signIndex);
    }
    case "kaal-sarp-dosha": {
      const k = computeKundli(birthFrom(payload));
      return kaalSarpDosha(k.planets);
    }
    case "pitra-dosha": {
      const k = computeKundli(birthFrom(payload));
      return pitraDosha(k.planets);
    }
    case "sade-sati": {
      const k = computeKundli(birthFrom(payload));
      return sadeSati(k.moonRashi.signIndex, new Date(), { includeWindow: true });
    }

    case "kundli-matching": {
      const boy = computeKundli(
        birthFrom({
          ...payload,
          name: payload.boyName || "Boy",
          date: payload.boyDate,
          time: payload.boyTime || "12:00",
          place: payload.boyPlace || payload.place,
          lat: payload.boyLat ?? payload.lat,
          lon: payload.boyLon ?? payload.lon,
          timezoneOffsetMinutes:
            payload.boyTimezoneOffsetMinutes ??
            payload.timezoneOffsetMinutes ??
            330,
        })
      );
      const girl = computeKundli(
        birthFrom({
          ...payload,
          name: payload.girlName || "Girl",
          date: payload.girlDate,
          time: payload.girlTime || "12:00",
          place: payload.girlPlace || payload.place,
          lat: payload.girlLat ?? payload.lat,
          lon: payload.girlLon ?? payload.lon,
          timezoneOffsetMinutes:
            payload.girlTimezoneOffsetMinutes ??
            payload.timezoneOffsetMinutes ??
            330,
        })
      );
      const match = ashtakootMatch(
        boy.nakshatra.index,
        girl.nakshatra.index,
        boy.moonRashi.signIndex,
        girl.moonRashi.signIndex
      );
      return {
        ...match,
        boy: { name: boy.input.name, moon: boy.moonRashi, nakshatra: boy.nakshatra },
        girl: { name: girl.input.name, moon: girl.moonRashi, nakshatra: girl.nakshatra },
      };
    }

    case "love-calculator":
      return lovePercentage(String(payload.name1 || ""), String(payload.name2 || ""));

    case "atmakaraka": {
      const k = computeKundli(birthFrom(payload));
      return { karakas: charaKarakas(k.planets) };
    }

    case "ishta-devata": {
      const k = computeKundli(birthFrom(payload));
      const karakas = charaKarakas(k.planets);
      const atma = k.planets.find((p) => p.name.en === karakas[0].planet.en)!;
      const d9Sign = navamsaSignIndex(atma.longitude);
      return { atmakaraka: karakas[0], ...ishtaDevata(d9Sign) };
    }

    case "kp-horary":
      return kpHorary(Number(payload.number || 1));

    case "kp-sub-lord": {
      const k = computeKundli(birthFrom(payload));
      return {
        lagna: kpSubLord(k.lagna.longitude),
        planets: k.planets.map((p) => ({
          id: p.id,
          name: p.name,
          ...kpSubLord(p.longitude),
        })),
      };
    }

    case "kp-ruling-planets":
      return kpRulingPlanetsNow(
        new Date(),
        Number(payload.lat ?? 28.61),
        Number(payload.lon ?? 77.21)
      );

    case "gemstone": {
      const k = computeKundli(birthFrom(payload));
      return {
        byLagna: gemstoneForSign(k.lagna.signIndex),
        byMoon: gemstoneForSign(k.moonRashi.signIndex),
      };
    }

    case "rudraksha": {
      const k = computeKundli(birthFrom(payload));
      return {
        byLagna: rudrakshaForSign(k.lagna.signIndex),
        byMoon: rudrakshaForSign(k.moonRashi.signIndex),
      };
    }

    case "baby-name": {
      const k = computeKundli(birthFrom(payload));
      return {
        moonRashi: k.moonRashi,
        nakshatra: k.nakshatra,
        letters: babyNameLetters(k.nakshatra.index),
        note: {
          en: "Suggested starting syllables from the birth nakshatra (Namkaran tradition). Choose a meaningful name that begins with one of these sounds.",
          hi: "जन्म नक्षत्र से सुझाए आरंभ अक्षर (नामकरण परंपरा)। इनमें से किसी ध्वनि से शुरू होने वाला अर्थपूर्ण नाम चुनें।",
        },
      };
    }

    case "birth-panchang":
      return computeBirthPanchang(
        String(payload.date),
        String(payload.time || "12:00"),
        Number(payload.timezoneOffsetMinutes ?? 330)
      );

    case "today-panchang":
    case "daily-panchang": {
      const { date, lat, lon, tz, place } = placeDateFrom(payload);
      const ymd = String(payload.date || date.toISOString().slice(0, 10));
      return computeTodayPanchang({
        date: ymd,
        lat,
        lon,
        place,
        timeZone: tz,
        timezoneOffsetMinutes: Number(payload.timezoneOffsetMinutes ?? 330),
      });
    }

    case "choghadiya": {
      const { date, lat, lon, tz, place } = placeDateFrom(payload);
      const m = dailyMuhuratFor(date, tz, lat, lon);
      return {
        place,
        date: String(payload.date || date.toISOString().slice(0, 10)),
        sunrise: m.meta.sunrise,
        sunset: m.meta.sunset,
        current: m.choghadiya,
        currentTone: m.choghadiyaTone,
        day: m.dayChoghadiya,
        night: m.nightChoghadiya,
        rahuKaal: m.rahuKaal,
      };
    }

    case "gowri-panchangam": {
      const { date, lat, lon, tz, place } = placeDateFrom(payload);
      const m = dailyMuhuratFor(date, tz, lat, lon);
      return {
        place,
        date: String(payload.date || date.toISOString().slice(0, 10)),
        sunrise: m.meta.sunrise,
        sunset: m.meta.sunset,
        day: m.dayGowri,
        night: m.nightGowri,
        rahuKaal: m.rahuKaal,
      };
    }

    case "rahu-kaal": {
      const { date, lat, lon, tz, place } = placeDateFrom(payload);
      const m = dailyMuhuratFor(date, tz, lat, lon);
      return {
        place,
        date: String(payload.date || date.toISOString().slice(0, 10)),
        sunrise: m.meta.sunrise,
        sunset: m.meta.sunset,
        rahuKaal: m.rahuKaal,
        tip: {
          en: "Avoid starting important work, travel, or ceremonies during Rahu Kaal.",
          hi: "राहु काल में महत्वपूर्ण कार्य, यात्रा या संस्कार शुरू करने से बचें।",
        },
      };
    }

    case "hora": {
      const { date, lat, lon, tz, place } = placeDateFrom(payload);
      const m = dailyMuhuratFor(date, tz, lat, lon);
      return {
        place,
        date: String(payload.date || date.toISOString().slice(0, 10)),
        sunrise: m.meta.sunrise,
        sunset: m.meta.sunset,
        current: m.hora,
        horas: m.horas,
        rahuKaal: m.rahuKaal,
      };
    }

    case "ayanamsa": {
      const input = birthFrom({ ...payload, time: payload.time || "12:00" });
      const date = parseBirthDateTime(input);
      const ayanamsa = lahiriAyanamsaFromDate(date);
      return {
        date: input.date,
        ayanamsa,
        note: {
          en: "Lahiri (Chitrapaksha) approximation used on this site.",
          hi: "इस साइट पर लाहिरी (चित्रपक्ष) सन्निकटन।",
        },
      };
    }

    case "life-path":
      return lifePathFromDate(String(payload.date));

    case "name-numerology":
      return nameNumber(
        String(payload.name || ""),
        (payload.system as "chaldean" | "pythagorean" | "vedic") || "chaldean"
      );

    case "mobile-number":
    case "vehicle-number":
    case "house-number":
      return {
        ...digitNumberFromString(String(payload.value || payload.number || "")),
        kind: slug,
      };

    case "business-name":
      return nameNumber(String(payload.name || ""), "chaldean");

    case "personal-year":
      return personalYear(String(payload.date), Number(payload.year || new Date().getFullYear()));

    case "lo-shu-grid":
      return loShuGrid(String(payload.date));

    case "love-compatibility-num": {
      const a = lifePathFromDate(String(payload.date1));
      const b = lifePathFromDate(String(payload.date2));
      const diff = Math.abs(a.lifePath - b.lifePath);
      return {
        person1: a,
        person2: b,
        harmony: diff <= 2 || diff === 9 - 1 ? "strong" : diff <= 4 ? "moderate" : "growth",
      };
    }

    case "name-correction": {
      const birth = lifePathFromDate(String(payload.date));
      const current = nameNumber(String(payload.name || ""));
      const harmony = current.destiny === birth.lifePath || current.destiny === birth.radical;
      return {
        birth,
        current,
        harmony,
        advice: {
          en: harmony
            ? "Name number already resonates with birth numbers."
            : "Name correction is personal — consult before legal changes.",
          hi: harmony
            ? "नाम अंक जन्म अंकों से मेल खाता है।"
            : "नाम सुधार व्यक्तिगत है — कानूनी बदलाव से पहले सलाह लें।",
        },
      };
    }

    default:
      throw new Error(`Unknown calculator: ${slug}`);
  }
}
