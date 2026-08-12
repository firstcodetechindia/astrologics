/**
 * Structured chart fact-sheet — authoritative facts the AI may cite.
 * Derived once from KundliResult; never invented by the model.
 */
import { createHash } from "node:crypto";
import type { BirthInput, KundliResult } from "@/lib/astrology/types";

export type PlanetFact = {
  id: string;
  name: string;
  sign: string;
  house: number;
  degreeInSign: number;
  degreeRounded: number;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
};

export type ChartFactSheet = {
  key: string;
  computedAt: string;
  input: {
    name: string;
    date: string;
    time: string;
    place: string;
    lat: number;
    lon: number;
    timeZone?: string;
    timezoneOffsetMinutes?: number;
  };
  settings: {
    ayanamsa: string;
    ayanamsaDegrees: number;
    nodeType: string;
    houseSystem: string;
    timeZone: string;
  };
  lagna: { sign: string; degree: number; degreeRounded: number };
  sun: { sign: string };
  moon: { sign: string; nakshatra: string; pada: number; lord: string };
  planets: PlanetFact[];
  /** "mars:Leo", "sun:Taurus" */
  planetSignKeys: string[];
  /** Allowed English sign names present on the chart */
  signsPresent: string[];
  dasha: {
    currentMaha: string;
    currentAntar: string;
    currentPratyantar?: string;
    mahaLords: string[];
    antarLords: string[];
  };
  yogas: string[];
  doshas: { manglik: boolean; kaalSarp: boolean; sadeSati?: boolean };
};

const PLANET_ALIASES: Record<string, string[]> = {
  sun: ["sun", "surya", "ravi"],
  moon: ["moon", "chandra", "soma"],
  mars: ["mars", "mangal", "kuja"],
  mercury: ["mercury", "budha", "budh"],
  jupiter: ["jupiter", "guru", "brihaspati"],
  venus: ["venus", "shukra"],
  saturn: ["saturn", "shani"],
  rahu: ["rahu", "north node"],
  ketu: ["ketu", "south node"],
};

export function birthFingerprint(
  input: Pick<
    BirthInput,
    | "date"
    | "time"
    | "lat"
    | "lon"
    | "timezoneOffsetMinutes"
    | "timeZone"
    | "ayanamsa"
    | "houseSystem"
    | "nodeMode"
  >
): string {
  const payload = {
    date: input.date,
    time: (input.time || "12:00").slice(0, 5),
    lat: Number(Number(input.lat).toFixed(5)),
    lon: Number(Number(input.lon).toFixed(5)),
    tz: input.timeZone || "",
    off: input.timezoneOffsetMinutes ?? null,
    aya: input.ayanamsa ?? "lahiri",
    house: input.houseSystem ?? "whole_sign",
    node: input.nodeMode ?? "mean",
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}

export function buildFactSheet(k: KundliResult): ChartFactSheet {
  const key = birthFingerprint(k.input);
  const planets: PlanetFact[] = k.planets.map((p) => ({
    id: p.id,
    name: p.name.en,
    sign: p.sign.en,
    house: p.house,
    degreeInSign: p.degreeInSign,
    degreeRounded: Math.round(p.degreeInSign),
    nakshatra: p.nakshatra.en,
    pada: p.pada,
    retrograde: Boolean(p.isRetrograde),
  }));

  const planetSignKeys = planets.map(
    (p) => `${p.id}:${p.sign}`.toLowerCase()
  );
  const signsPresent = Array.from(
    new Set([
      k.lagna.sign.en,
      k.sunRashi.en,
      k.moonRashi.en,
      ...planets.map((p) => p.sign),
      ...k.houses.map((h) => h.sign.en),
    ])
  );

  const mahaLords = (k.dasha.mahaList || []).map((d) => d.planet.en);
  const antarLords = (k.dasha.antarList || []).map((d) => d.planet.en);

  return {
    key,
    computedAt: k.computedAt || new Date().toISOString(),
    input: {
      name: k.input.name,
      date: k.input.date,
      time: k.input.time,
      place: k.input.place,
      lat: k.input.lat,
      lon: k.input.lon,
      timeZone: k.input.timeZone ?? k.settings.timeZone,
      timezoneOffsetMinutes:
        k.input.timezoneOffsetMinutes ?? k.settings.timezoneOffsetMinutes,
    },
    settings: {
      ayanamsa: String(k.settings.ayanamsa),
      ayanamsaDegrees: k.settings.ayanamsaDegrees ?? k.ayanamsa,
      nodeType: k.settings.nodeType,
      houseSystem: String(k.settings.houseSystem),
      timeZone: k.settings.timeZone ?? "Asia/Kolkata",
    },
    lagna: {
      sign: k.lagna.sign.en,
      degree: k.lagna.degree,
      degreeRounded: Math.round(k.lagna.degree),
    },
    sun: { sign: k.sunRashi.en },
    moon: {
      sign: k.moonRashi.en,
      nakshatra: k.nakshatra.name.en,
      pada: k.nakshatra.pada,
      lord: k.nakshatra.lord.en,
    },
    planets,
    planetSignKeys,
    signsPresent,
    dasha: {
      currentMaha: k.dasha.currentMaha.planet.en,
      currentAntar: k.dasha.currentAntar.planet.en,
      currentPratyantar: k.dasha.currentPratyantar?.planet.en,
      mahaLords: mahaLords.length
        ? mahaLords
        : [k.dasha.currentMaha.planet.en],
      antarLords: antarLords.length
        ? antarLords
        : [k.dasha.currentAntar.planet.en],
    },
    yogas: k.yogas.map((y) => y.name.en),
    doshas: {
      manglik: k.doshas.manglik.present,
      kaalSarp: k.doshas.kaalSarp.present,
      sadeSati: k.doshas.sadeSati?.present,
    },
  };
}

/** Canonical JSON for equality tests (stable key order via rebuild). */
export function factSheetDigest(sheet: ChartFactSheet): string {
  const stable = {
    key: sheet.key,
    lagna: sheet.lagna.sign,
    sun: sheet.sun.sign,
    moon: `${sheet.moon.sign}|${sheet.moon.nakshatra}|${sheet.moon.pada}`,
    planets: sheet.planets.map(
      (p) => `${p.id}:${p.sign}:H${p.house}:${p.degreeRounded}:${p.nakshatra}:p${p.pada}`
    ),
    dasha: `${sheet.dasha.currentMaha}/${sheet.dasha.currentAntar}`,
    ayanamsa: Number(sheet.settings.ayanamsaDegrees.toFixed(4)),
  };
  return createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

export function planetIdFromAlias(token: string): string | null {
  const t = token.toLowerCase().trim();
  for (const [id, aliases] of Object.entries(PLANET_ALIASES)) {
    if (aliases.includes(t)) return id;
  }
  return null;
}

export { PLANET_ALIASES };
