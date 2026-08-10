export type LocaleCode = "en" | "hi";

export interface BirthInput {
  name: string;
  gender?: "male" | "female" | "other";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  place: string;
  lat: number;
  lon: number;
  timezoneOffsetMinutes?: number;
}

export interface PlanetPosition {
  id: string;
  name: { en: string; hi: string };
  longitude: number;
  signIndex: number;
  sign: { en: string; hi: string };
  degreeInSign: number;
  house: number;
  nakshatraIndex: number;
  nakshatra: { en: string; hi: string };
  pada: number;
  isRetrograde?: boolean;
}

export interface HouseInfo {
  number: number;
  signIndex: number;
  sign: { en: string; hi: string };
  lord: { en: string; hi: string };
  summary: { en: string; hi: string };
}

export interface DashaPeriod {
  planet: { en: string; hi: string };
  start: string;
  end: string;
  isCurrent?: boolean;
}

export interface YogaFlag {
  id: string;
  name: { en: string; hi: string };
  level: "positive" | "challenge" | "neutral";
  meaning: { en: string; hi: string };
}

export interface LifeInsight {
  area: string;
  title: { en: string; hi: string };
  text: { en: string; hi: string };
}

export interface KundliResult {
  input: BirthInput;
  ayanamsa: number;
  lagna: {
    signIndex: number;
    sign: { en: string; hi: string };
    degree: number;
  };
  moonRashi: { en: string; hi: string; signIndex: number };
  sunRashi: { en: string; hi: string; signIndex: number };
  nakshatra: {
    index: number;
    name: { en: string; hi: string };
    pada: number;
    lord: { en: string; hi: string };
  };
  planets: PlanetPosition[];
  houses: HouseInfo[];
  yogas: YogaFlag[];
  dasha: {
    currentMaha: DashaPeriod;
    currentAntar: DashaPeriod;
    mahaList: DashaPeriod[];
  };
  insights: LifeInsight[];
  computedAt: string;
}
