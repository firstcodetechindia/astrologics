/**
 * Tajika Varshphal (annual chart) — solar return on astronomy-engine.
 * Follows `.cursor/skills/varshphal/SKILL.md` (approved Phase 4).
 */
import { SIGNS, SIGN_LORDS } from "../constants";
import { combustionInfo, planetDignity } from "../dignity";
import { degreeInSign, signIndexFromLongitude } from "../math";
import { calculateLagna, getSiderealPlanets } from "../planets";
import { resolveAyanamsa, type AyanamsaId } from "../prefs";
import type { BirthInput, PlanetPosition } from "../types";
import { parseBirthDateTime } from "../timezone";

export type Loc = { en: string; hi: string };

function sunLonAt(date: Date, ayanamsaId: AyanamsaId): number {
  const ayan = resolveAyanamsa(date, ayanamsaId);
  const { planets } = getSiderealPlanets(date, ayan);
  return planets.find((p) => p.id === "sun")?.longitude ?? 0;
}

/** Binary-search solar return within target calendar year (UTC). */
export function findSolarReturn(
  natalSunLon: number,
  birth: Date,
  targetYear: number,
  ayanamsaId: AyanamsaId = "lahiri"
): { instant: Date; residualDeg: number } {
  const birthMd = `${String(birth.getUTCMonth() + 1).padStart(2, "0")}-${String(birth.getUTCDate()).padStart(2, "0")}`;
  let lo =
    new Date(`${targetYear}-${birthMd}T00:00:00Z`).getTime() - 2 * 86400_000;
  let hi = lo + 5 * 86400_000;
  let best = new Date((lo + hi) / 2);
  let bestAbs = 999;
  for (let i = 0; i < 48; i++) {
    const mid = new Date((lo + hi) / 2);
    const lon = sunLonAt(mid, ayanamsaId);
    const diff = ((lon - natalSunLon + 540) % 360) - 180;
    if (Math.abs(diff) < bestAbs) {
      bestAbs = Math.abs(diff);
      best = mid;
    }
    if (Math.abs(diff) < 0.0005) {
      return { instant: mid, residualDeg: diff };
    }
    if (diff > 0) hi = mid.getTime();
    else lo = mid.getTime();
  }
  const finalLon = sunLonAt(best, ayanamsaId);
  const residual = ((finalLon - natalSunLon + 540) % 360) - 180;
  return { instant: best, residualDeg: residual };
}

export type MunthaResult = {
  signIndex: number;
  sign: Loc;
  houseFromVarshaLagna: number;
  completedYearsOfAge: number;
  basedOn: Loc;
};

/** Muntha advances one sign per completed year from natal lagna. */
export function computeMuntha(
  completedYears: number,
  natalAscSign: number,
  varshaAscSign: number
): MunthaResult {
  const years = Math.max(0, completedYears);
  const signIndex = (natalAscSign + (years % 12)) % 12;
  const houseFromVarshaLagna = ((signIndex - varshaAscSign + 12) % 12) + 1;
  return {
    signIndex,
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    houseFromVarshaLagna,
    completedYearsOfAge: years,
    basedOn: {
      en: `Natal Lagna ${SIGNS[natalAscSign].en} + ${years} completed years → ${SIGNS[signIndex].en}; house ${houseFromVarshaLagna} from Varsha Lagna`,
      hi: `जन्म लग्न ${SIGNS[natalAscSign].hi} + ${years} पूर्ण वर्ष → ${SIGNS[signIndex].hi}; वर्ष लग्न से भाव ${houseFromVarshaLagna}`,
    },
  };
}

const LORD_EN_TO_ID: Record<string, string> = {
  Mars: "mars",
  Venus: "venus",
  Mercury: "mercury",
  Moon: "moon",
  Sun: "sun",
  Jupiter: "jupiter",
  Saturn: "saturn",
};

function lordMeta(signIndex: number) {
  const lord = SIGN_LORDS[signIndex];
  return {
    id: LORD_EN_TO_ID[lord.en] ?? lord.en.toLowerCase(),
    name: { en: lord.en, hi: lord.hi },
  };
}

function dignityScore(
  planetId: string,
  signIndex: number,
  lon: number,
  sunLon: number
): number {
  const dig = planetDignity(planetId, signIndex);
  let score = 0;
  if (dig.exalted) score += 3;
  else if (dig.ownSign || dig.moolatrikona) score += 2;
  else if (dig.debilitated) score -= 2;
  if (combustionInfo(planetId, lon, sunLon).isCombust) score -= 3;
  return score;
}

export type VarshphalResult = {
  targetYear: number;
  completedYearsOfAge: number;
  solarReturnAt: string;
  solarReturnResidualDeg: number;
  varshaLagna: {
    signIndex: number;
    sign: Loc;
    degree: number;
    longitude: number;
    basedOn: Loc;
  };
  muntha: MunthaResult;
  /** Simplified Tajika year-lord screen (not full Panchavargi). */
  varsheshwara: {
    id: string;
    name: Loc;
    rule: "simplified_muntha_vs_asc_lord";
    basedOn: Loc;
  };
  planets: PlanetPosition[];
  sahams: {
    id: string;
    name: Loc;
    longitude: number;
    sign: Loc;
    formula: Loc;
    basedOn: Loc;
  }[];
  methodology: Loc;
  disclaimer: Loc;
};

function norm360(x: number) {
  return ((x % 360) + 360) % 360;
}

export function computeVarshphal(opts: {
  input: BirthInput;
  natalSunLongitude: number;
  natalAscSignIndex: number;
  targetYear?: number;
}): VarshphalResult {
  const birth = parseBirthDateTime(opts.input);
  const targetYear = opts.targetYear ?? new Date().getUTCFullYear();
  const ayanamsaId = opts.input.ayanamsa ?? "lahiri";
  const { instant: sr, residualDeg } = findSolarReturn(
    opts.natalSunLongitude,
    birth,
    targetYear,
    ayanamsaId
  );
  const ayan = resolveAyanamsa(sr, ayanamsaId);
  const { planets: raw } = getSiderealPlanets(sr, ayan, opts.input.nodeMode);
  const lagnaLon = calculateLagna(sr, opts.input.lat, opts.input.lon, ayan);
  const lagnaSign = signIndexFromLongitude(lagnaLon);
  const completedYears = targetYear - birth.getUTCFullYear();
  const muntha = computeMuntha(
    Math.max(0, completedYears),
    opts.natalAscSignIndex,
    lagnaSign
  );

  const planets: PlanetPosition[] = raw.map((p) => {
    const signIndex = signIndexFromLongitude(p.longitude);
    return {
      id: p.id,
      name: p.name,
      longitude: p.longitude,
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      degreeInSign: degreeInSign(p.longitude),
      house: ((signIndex - lagnaSign + 12) % 12) + 1,
      nakshatraIndex: 0,
      nakshatra: { en: "", hi: "" },
      pada: 1,
      isRetrograde: p.isRetrograde,
      speed: p.speed,
    };
  });

  const sun = planets.find((p) => p.id === "sun")!;
  const moon = planets.find((p) => p.id === "moon")!;

  const munthaCand = lordMeta(muntha.signIndex);
  const ascCand = lordMeta(lagnaSign);
  const munthaPlanet = planets.find((p) => p.id === munthaCand.id);
  const ascPlanet = planets.find((p) => p.id === ascCand.id);
  const munthaScore = munthaPlanet
    ? dignityScore(
        munthaCand.id,
        munthaPlanet.signIndex,
        munthaPlanet.longitude,
        sun.longitude
      )
    : 0;
  const ascScore = ascPlanet
    ? dignityScore(
        ascCand.id,
        ascPlanet.signIndex,
        ascPlanet.longitude,
        sun.longitude
      )
    : 0;

  // Prefer Muntha lord; switch to Asc lord only if clearly stronger / less combust
  const pickAsc = ascCand.id !== munthaCand.id && ascScore >= munthaScore + 2;
  const varsheshwara = {
    id: pickAsc ? ascCand.id : munthaCand.id,
    name: pickAsc ? ascCand.name : munthaCand.name,
    rule: "simplified_muntha_vs_asc_lord" as const,
    basedOn: {
      en: pickAsc
        ? `Chose Varsha Lagna lord ${ascCand.name.en} (score ${ascScore}) over Muntha lord ${munthaCand.name.en} (score ${munthaScore}) — simplified screen, not full Tajika Panchavargi`
        : `Muntha lord ${munthaCand.name.en} (score ${munthaScore}); Asc lord ${ascCand.name.en} (score ${ascScore}) — simplified Varsheshwara`,
      hi: pickAsc
        ? `वर्ष लग्न स्वामी ${ascCand.name.hi} चुना (स्कोर ${ascScore}) बनाम मुंथा स्वामी ${munthaCand.name.hi} (${munthaScore}) — सरलीकृत`
        : `मुंथा स्वामी ${munthaCand.name.hi} (स्कोर ${munthaScore}); लग्न स्वामी ${ascCand.name.hi} (${ascScore}) — सरलीकृत वर्षेश्वर`,
    },
  };

  // Day/night for Punya: use local-ish day via UTC hour proxy at return
  // Classical: day chart if Sun above horizon — approximate with 06–18 UTC band for residual;
  // better: use return hour at birth longitude offset
  const tzMin = opts.input.timezoneOffsetMinutes ?? 330;
  const localHour =
    (sr.getUTCHours() * 60 + sr.getUTCMinutes() + tzMin + 1440 * 5) % 1440;
  const dayBirth = localHour >= 6 * 60 && localHour < 18 * 60;

  // Punya Saham: day Moon−Sun+Asc; night Sun−Moon+Asc
  const punyaLon = dayBirth
    ? norm360(moon.longitude - sun.longitude + lagnaLon)
    : norm360(sun.longitude - moon.longitude + lagnaLon);
  // Mitra Saham (friendship lot): Asc + Moon − Sun
  const mitraLon = norm360(lagnaLon + moon.longitude - sun.longitude);

  const sahamDefs = [
    {
      id: "punya",
      name: { en: "Punya Saham", hi: "पुण्य सहाम" },
      lon: punyaLon,
      formula: {
        en: dayBirth
          ? "Day: Moon − Sun + Asc"
          : "Night: Sun − Moon + Asc",
        hi: dayBirth
          ? "दिन: चंद्र − सूर्य + लग्न"
          : "रात्रि: सूर्य − चंद्र + लग्न",
      },
    },
    {
      id: "mitra",
      name: { en: "Mitra Saham", hi: "मित्र सहाम" },
      lon: mitraLon,
      formula: {
        en: "Asc + Moon − Sun",
        hi: "लग्न + चंद्र − सूर्य",
      },
    },
  ];

  return {
    targetYear,
    completedYearsOfAge: Math.max(0, completedYears),
    solarReturnAt: sr.toISOString(),
    solarReturnResidualDeg: Number(residualDeg.toFixed(6)),
    varshaLagna: {
      signIndex: lagnaSign,
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      degree: degreeInSign(lagnaLon),
      longitude: lagnaLon,
      basedOn: {
        en: `Ascendant at solar return ${sr.toISOString()} @ lat ${opts.input.lat}, lon ${opts.input.lon}`,
        hi: `सूर्य वापसी ${sr.toISOString()} पर लग्न @ अक्षांश ${opts.input.lat}`,
      },
    },
    muntha,
    varsheshwara,
    planets,
    sahams: sahamDefs.map((s) => {
      const si = signIndexFromLongitude(s.lon);
      return {
        id: s.id,
        name: s.name,
        longitude: s.lon,
        sign: { en: SIGNS[si].en, hi: SIGNS[si].hi },
        formula: s.formula,
        basedOn: {
          en: `${s.formula.en} → ${SIGNS[si].en} ${degreeInSign(s.lon).toFixed(2)}°`,
          hi: `${s.formula.hi} → ${SIGNS[si].hi}`,
        },
      };
    }),
    methodology: {
      en: "Varshphal = solar return (sidereal Sun = natal Sun) + Varsha Lagna + Muntha + simplified Varsheshwara. Annual overlay — not a replacement for birth chart / Vimshottari.",
      hi: "वर्षफल = सूर्य वापसी (सायन सूर्य = जन्म सूर्य) + वर्ष लग्न + मुंथा + सरलीकृत वर्षेश्वर। वार्षिक परत — जन्म कुंडली/विंशोत्तरी का विकल्प नहीं।",
    },
    disclaimer: {
      en: "Timing guidance only. Not medical, legal, or financial advice. Confirm important decisions with a qualified astrologer.",
      hi: "केवल समय-संकेत। चिकित्सा/कानूनी/वित्तीय सलाह नहीं। महत्वपूर्ण निर्णयों हेतु योग्य ज्योतिषी से पुष्टि करें।",
    },
  };
}
