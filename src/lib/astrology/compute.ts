import { computeGrahaDrishti } from "./aspects";
import { computeAshtakvarga } from "./ashtakvarga";
import { applyAshtakvargaShodhana } from "./ashtakvarga-shodhana";
import { computeAvakhada } from "./avakhada";
import { computeCharaDasha } from "./chara-dasha";
import { ASTRO_CONFIG } from "./config";
import { SIGNS } from "./constants";
import { astronomyEngineVersion } from "./engine-version";
import { computeVimshottari } from "./dasha";
import { computeYogini } from "./yogini-dasha";
import { combustionInfo, planetDignity } from "./dignity";
import { kaalSarpDosha, mangalDosha, pitraDosha, sadeSati } from "./doshas";
import { ephemerisCapabilityNotes } from "./ephemeris";
import {
  computePlacidusCusps,
  computeSripatiCusps,
  cuspSignMeta,
  houseFromCusps,
} from "./house-systems";
import { buildHouses, houseOfPlanet } from "./houses";
import { buildInsightsFromPredictions } from "./interpret";
import { computeJaiminiPoints } from "./jaimini";
import { buildKpChart } from "./kp";
import {
  degreeInSign,
  signIndexFromLongitude,
} from "./math";
import { nakshatraFromLongitude } from "./nakshatra";
import { computePanchang } from "./panchang";
import { calculateLagna, getSiderealPlanets } from "./planets";
import { resolveAyanamsa, type AyanamsaId, type HouseSystemId } from "./prefs";
import { buildPredictionBundle } from "./prediction";
import { computeShadbala } from "./shadbala";
import { computeTransits } from "./transits";
import type { BirthInput, KundliResult, PlanetPosition } from "./types";
import { computeAllVargas } from "./vargas";
import { detectYogas } from "./yogas";
import { createLalKitabChart } from "./lalkitab";
import { computeVarshphal } from "./varshphal";
import {
  parseBirthDateTime,
  resolveBirthTimeZone,
} from "./timezone";

function formatOffset(totalMinutes: number): string {
  const whole = Math.floor(totalMinutes);
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  const frac = totalMinutes - whole;
  const s = Math.round(frac * 60);
  if (s) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Re-export for callers that historically imported from compute. */
export { parseBirthDateTime, resolveBirthTimeZone };

function chartReliability(
  input: BirthInput,
  tzMeta: { timeZone: string; offsetMinutes: number }
): KundliResult["reliability"] {
  const reasons: { en: string; hi: string }[] = [];
  const hasCoords =
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lon) &&
    !(input.lat === 0 && input.lon === 0);
  const hasTime = /^\d{1,2}:\d{2}/.test(input.time || "");
  const hasPlace = Boolean(input.place?.trim());

  if (hasCoords)
    reasons.push({
      en: "Birthplace coordinates available",
      hi: "जन्मस्थान निर्देशांक उपलब्ध",
    });
  else
    reasons.push({
      en: "Coordinates missing or default — lagna may be approximate",
      hi: "निर्देशांक अनुपलब्ध — लग्न अनुमानित हो सकता है",
    });

  const offLabel =
    tzMeta.offsetMinutes >= 0
      ? `UTC+${formatOffset(tzMeta.offsetMinutes)}`
      : `UTC-${formatOffset(Math.abs(tzMeta.offsetMinutes))}`;
  if (tzMeta.timeZone)
    reasons.push({
      en: `Timezone: IANA ${tzMeta.timeZone} at birth → ${offLabel}`,
      hi: `टाइमज़ोन: जन्म पर IANA ${tzMeta.timeZone} → ${offLabel}`,
    });
  else
    reasons.push({
      en: `Timezone defaulted via IANA Asia/Kolkata → ${offLabel}`,
      hi: `टाइमज़ोन डिफ़ॉल्ट IANA Asia/Kolkata → ${offLabel}`,
    });

  if (hasTime)
    reasons.push({
      en: "Birth time provided (needed for lagna & houses)",
      hi: "जन्म समय उपलब्ध (लग्न व भावों के लिए आवश्यक)",
    });
  else
    reasons.push({
      en: "Birth time incomplete",
      hi: "जन्म समय अधूरा",
    });

  if (input.birthTimeApproximate) {
    reasons.push({
      en: "Birth time marked approximate — Lagna, houses, and house-based yogas/doshas may flip near sign boundaries; prefer Moon/Nakshatra themes or rectification.",
      hi: "जन्म समय अनुमानित चिह्नित — लग्न, भाव व भाव-आधारित योग/दोष राशि सीमा पर बदल सकते हैं; चंद्र/नक्षत्र या समय-सुधार को प्राथमिकता दें।",
    });
  }

  if (hasPlace)
    reasons.push({
      en: `Place: ${input.place}`,
      hi: `स्थान: ${input.place}`,
    });

  for (const note of ephemerisCapabilityNotes()) {
    reasons.push({ en: note, hi: note });
  }

  let level: "high" | "moderate" | "limited" = "limited";
  // IANA zone is always resolved from place/coords; treat as available when coords exist.
  if (hasCoords && hasTime) level = "high";
  else if (hasCoords || hasTime) level = "moderate";
  if (input.birthTimeApproximate && level === "high") level = "moderate";

  return { level, reasons };
}

export function computeKundli(input: BirthInput): KundliResult {
  if (
    !input.date ||
    !input.time ||
    !Number.isFinite(input.lat) ||
    !Number.isFinite(input.lon)
  ) {
    throw new Error(
      "Unable to calculate your birth chart accurately. Please verify your birth date, time and place of birth."
    );
  }

  const tzMeta = resolveBirthTimeZone(input);
  const date = tzMeta.instant;
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Unable to calculate your birth chart accurately. Please verify your birth date, time and place of birth."
    );
  }

  const ayanamsaId: AyanamsaId = input.ayanamsa ?? ASTRO_CONFIG.ayanamsa;
  const houseSystemId: HouseSystemId =
    input.houseSystem ?? ASTRO_CONFIG.houseSystem;
  const nodeMode = input.nodeMode ?? ASTRO_CONFIG.nodeMode;
  const ayanamsa = resolveAyanamsa(date, ayanamsaId);
  const { planets: rawPlanets } = getSiderealPlanets(date, ayanamsa, nodeMode);
  const lagnaLon = calculateLagna(date, input.lat, input.lon, ayanamsa);
  const lagnaSign = signIndexFromLongitude(lagnaLon);

  const sunRaw = rawPlanets.find((p) => p.id === "sun");
  const sunLon = sunRaw?.longitude ?? 0;

  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const nak = nakshatraFromLongitude(p.longitude);
    const signIndex = signIndexFromLongitude(p.longitude);
    const dignity = planetDignity(p.id, signIndex);
    const combust = combustionInfo(p.id, p.longitude, sunLon, {
      retrograde: p.isRetrograde,
    });
    const house = houseOfPlanet(p.longitude, lagnaLon);
    return {
      id: p.id,
      name: p.name,
      longitude: p.longitude,
      absoluteLongitude: p.longitude,
      signIndex,
      sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
      degreeInSign: degreeInSign(p.longitude),
      house,
      nakshatraIndex: nak.index,
      nakshatra: nak.name,
      pada: nak.pada,
      isRetrograde: p.isRetrograde,
      speed: Number(p.speed.toFixed(4)),
      isCombust: combust.isCombust,
      combustionDistance: Number(combust.combustionDistance.toFixed(4)),
      combustionSeverity: combust.severity,
      dignity,
    };
  });

  // Optional cusp-based house assignment for Sripati / Placidus primary view
  if (houseSystemId === "sripati" || houseSystemId === "placidus") {
    const cusps =
      houseSystemId === "placidus"
        ? computePlacidusCusps(date, input.lat, input.lon, ayanamsa)
        : computeSripatiCusps(date, input.lat, input.lon, ayanamsa);
    for (const p of planets) {
      p.house = houseFromCusps(p.longitude, cusps.cusps);
    }
  }

  const moon = planets.find((p) => p.id === "moon")!;
  const sun = planets.find((p) => p.id === "sun")!;
  const moonNak = nakshatraFromLongitude(moon.longitude);
  const houses = buildHouses(lagnaLon);
  const dasha = computeVimshottari(moon.longitude, date);
  const yogini = computeYogini(moon.longitude, date);
  const yogas = detectYogas(planets, lagnaSign);
  const aspects = computeGrahaDrishti(planets);
  const manglik = mangalDosha(planets, lagnaSign);
  const kaalSarp = kaalSarpDosha(planets);
  const sade = sadeSati(moon.signIndex, new Date(), { includeWindow: true });
  const pitra = pitraDosha(planets);

  const vargas = computeAllVargas(planets, lagnaLon);

  const panchang = computePanchang(date, {
    timezoneOffsetMinutes: tzMeta.offsetMinutes,
  });

  const avakhada = computeAvakhada({
    moonSignIndex: moon.signIndex,
    nakshatraIndex: moonNak.index,
    pada: moonNak.pada,
  });

  const planetSigns: Record<string, number> = {};
  for (const p of planets) planetSigns[p.id] = p.signIndex;
  const ashtakRaw = computeAshtakvarga({
    lagnaSignIndex: lagnaSign,
    planetSigns,
  });
  const ashtakvarga = applyAshtakvargaShodhana(ashtakRaw, {
    lagnaSignIndex: lagnaSign,
    planetSigns,
  });
  const transits = computeTransits(new Date(), lagnaLon, moon.longitude, {
    lagnaSignIndex: lagnaSign,
    planetSigns,
    sarva: ashtakRaw.sarva,
  });

  const sripati = computeSripatiCusps(date, input.lat, input.lon, ayanamsa);
  const shadbala = computeShadbala(planets, date, {
    lagnaLon,
    mcLon: sripati.mc,
    lat: input.lat,
    lon: input.lon,
    timeZone: tzMeta.timeZone,
  });
  const charaDasha = computeCharaDasha(lagnaSign, planets, date);
  const jaimini = computeJaiminiPoints(lagnaSign, planets, lagnaLon);

  const bhavChalit = {
    system: "sripati" as const,
    cusps: sripati.cusps.map((c, i) => ({
      house: i + 1,
      ...cuspSignMeta(c),
    })),
    mc: cuspSignMeta(sripati.mc),
    planets: planets.map((p) => ({
      id: p.id,
      name: p.name,
      longitude: p.longitude,
      signIndex: p.signIndex,
      sign: p.sign,
      rashiHouse: p.house,
      bhavHouse: houseFromCusps(p.longitude, sripati.cusps),
      isRetrograde: p.isRetrograde,
    })),
  };

  const kp = buildKpChart({
    date,
    lat: input.lat,
    lon: input.lon,
    ayanamsa,
    planets,
    lagnaLon,
    timezoneOffsetMinutes: tzMeta.offsetMinutes,
  });

  const partial: KundliResult = {
    input,
    ayanamsa,
    settings: {
      zodiac: "sidereal",
      ayanamsa: ayanamsaId,
      ayanamsaDegrees: Number(ayanamsa.toFixed(6)),
      houseSystem: houseSystemId === "whole_sign" ? "whole-sign" : houseSystemId,
      houseSystemByChart: { ...ASTRO_CONFIG.houseSystemByChart },
      nodeType: nodeMode,
      ephemerisEngine: ASTRO_CONFIG.ephemerisEngine,
      ephemerisEngineVersion: astronomyEngineVersion(),
      dayBoundary: ASTRO_CONFIG.dayBoundary,
      timezoneMode: ASTRO_CONFIG.timezoneMode,
      timeZone: tzMeta.timeZone,
      timezoneOffsetMinutes: Number(tzMeta.offsetMinutes.toFixed(4)),
      birthTimeApproximate: Boolean(input.birthTimeApproximate),
    },
    lagna: {
      signIndex: lagnaSign,
      sign: { en: SIGNS[lagnaSign].en, hi: SIGNS[lagnaSign].hi },
      degree: degreeInSign(lagnaLon),
      longitude: lagnaLon,
    },
    moonRashi: {
      en: moon.sign.en,
      hi: moon.sign.hi,
      signIndex: moon.signIndex,
    },
    sunRashi: {
      en: sun.sign.en,
      hi: sun.sign.hi,
      signIndex: sun.signIndex,
    },
    nakshatra: moonNak,
    planets,
    houses,
    aspects,
    yogas,
    doshas: {
      manglik,
      kaalSarp,
      sadeSati: {
        ...sade,
        present: sade.active,
        meaning: sade.phaseLabel,
      },
      pitra: {
        ...pitra,
        present: pitra.present,
        meaning: pitra.meaning,
      },
    },
    dasha: {
      currentMaha: dasha.currentMaha,
      currentAntar: dasha.currentAntar,
      currentPratyantar: dasha.currentPratyantar,
      mahaList: dasha.mahaList,
      antarList: dasha.antarList,
      pratyantarList: dasha.pratyantarList,
      balanceYears: dasha.balanceYears,
      startLord: dasha.startLord,
    },
    yoginiDasha: yogini,
    charaDasha,
    shadbala,
    jaimini,
    varshphal: computeVarshphal({
      input,
      natalSunLongitude: sun.longitude,
      natalAscSignIndex: lagnaSign,
    }),
    lalkitab: createLalKitabChart(planets),
    divisionalCharts: vargas,
    panchang,
    avakhada,
    ashtakvarga,
    bhavChalit,
    kp,
    transits,
    insights: [],
    reliability: chartReliability(input, tzMeta),
    computedAt: new Date().toISOString(),
  };

  const predictions = buildPredictionBundle(partial);
  partial.predictions = predictions;
  partial.insights = buildInsightsFromPredictions(partial);

  return partial;
}
