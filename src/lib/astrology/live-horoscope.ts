/**
 * Deterministic moon-sign forecast scores from current transits.
 * LLM only narrates these scores — never invents placements.
 */
import { SIGNS } from "./constants";
import { lahiriAyanamsaFromDate } from "./math";
import { getSiderealPlanets } from "./planets";
import type { HoroscopePeriod } from "@/lib/horoscope/signs";

export type LiveHoroscopeScores = {
  signIndex: number;
  sign: { en: string; hi: string };
  period: HoroscopePeriod | "yearly";
  asOf: string;
  scores: {
    overall: number;
    love: number;
    career: number;
    money: number;
    health: number;
    family: number;
  };
  highlights: { en: string; hi: string }[];
  luckyNumber: number;
  transitNotes: { en: string; hi: string }[];
};

function clamp(n: number) {
  return Math.max(1, Math.min(100, Math.round(n)));
}

export function synthesizeMoonSignForecast(
  signIndex: number,
  period: HoroscopePeriod | "yearly" = "daily",
  asOf: Date = new Date()
): LiveHoroscopeScores {
  const ayan = lahiriAyanamsaFromDate(asOf);
  const { planets } = getSiderealPlanets(asOf, ayan);
  const moon = planets.find((p) => p.id === "moon");
  const jupiter = planets.find((p) => p.id === "jupiter");
  const saturn = planets.find((p) => p.id === "saturn");
  const venus = planets.find((p) => p.id === "venus");
  const mars = planets.find((p) => p.id === "mars");

  const houseOf = (lon: number) =>
    ((Math.floor(lon / 30) - signIndex + 12) % 12) + 1;

  const jH = jupiter ? houseOf(jupiter.longitude) : 7;
  const sH = saturn ? houseOf(saturn.longitude) : 8;
  const vH = venus ? houseOf(venus.longitude) : 5;
  const mH = mars ? houseOf(mars.longitude) : 6;
  const moonH = moon ? houseOf(moon.longitude) : 1;

  const periodBoost =
    period === "daily" ? 0 : period === "weekly" ? 2 : period === "monthly" ? 4 : 6;

  const love = clamp(55 + (vH === 1 || vH === 5 || vH === 7 ? 18 : 0) - (mH === 7 ? 10 : 0) + periodBoost);
  const career = clamp(52 + ([1, 10, 11].includes(jH) ? 20 : 0) - ([6, 8, 12].includes(sH) ? 12 : 0) + periodBoost);
  const money = clamp(50 + ([2, 11].includes(jH) ? 18 : 0) + (vH === 2 ? 10 : 0) - (sH === 2 ? 8 : 0));
  const health = clamp(58 - ([6, 8, 12].includes(mH) ? 14 : 0) + (jH === 1 ? 10 : 0));
  const family = clamp(54 + ([4, 2].includes(moonH) ? 12 : 0) + (jH === 4 ? 10 : 0));
  const overall = clamp((love + career + money + health + family) / 5);

  const highlights: { en: string; hi: string }[] = [];
  if (career >= 70)
    highlights.push({
      en: "Jupiter supports career/visibility houses this period.",
      hi: "इस अवधि में गुरु करियर/दृश्यता भावों का समर्थन करते हैं।",
    });
  if (love >= 70)
    highlights.push({
      en: "Venus aspect pattern favours relationship ease.",
      hi: "शुक्र पैटर्न संबंधों में सहजता का संकेत।",
    });
  if (saturn?.isRetrograde)
    highlights.push({
      en: "Saturn retrograde — review commitments before expanding.",
      hi: "शनि वक्री — विस्तार से पहले प्रतिबद्धताएँ जाँचें।",
    });

  const transitNotes = [
    {
      en: `Transit Moon house from your sign: ${moonH}. Jupiter H${jH}, Saturn H${sH}, Venus H${vH}.`,
      hi: `आपकी राशि से गोचर चंद्र भाव ${moonH}। गुरु H${jH}, शनि H${sH}, शुक्र H${vH}।`,
    },
  ];

  const luckyNumber = ((signIndex + asOf.getUTCDate()) % 9) + 1;

  return {
    signIndex,
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    period,
    asOf: asOf.toISOString(),
    scores: { overall, love, career, money, health, family },
    highlights,
    luckyNumber,
    transitNotes,
  };
}
