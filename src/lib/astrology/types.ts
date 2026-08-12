export type LocaleCode = "en" | "hi";

export interface BirthInput {
  name: string;
  gender?: "male" | "female" | "other";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  place: string;
  lat: number;
  lon: number;
  /** Civil offset hint (minutes east of UTC); used to pick IANA zone when timeZone omitted. */
  timezoneOffsetMinutes?: number;
  /** IANA zone id (e.g. Asia/Kolkata). Preferred for historical offset at birth. */
  timeZone?: string;
  /** Chart ayanamsa preference (default lahiri). */
  ayanamsa?: "lahiri" | "raman" | "kp" | "true_chitra";
  /** Primary house system for display (Parashari whole-sign remains available). */
  houseSystem?: "whole_sign" | "sripati" | "placidus";
  /** Lunar node mode. */
  nodeMode?: "mean" | "true";
  /** User marked birth time as approximate (Lagna/houses less reliable). */
  birthTimeApproximate?: boolean;
}

export interface PlanetPosition {
  id: string;
  name: { en: string; hi: string };
  /** Sidereal absolute longitude 0–360 */
  longitude: number;
  absoluteLongitude?: number;
  signIndex: number;
  sign: { en: string; hi: string };
  degreeInSign: number;
  house: number;
  nakshatraIndex: number;
  nakshatra: { en: string; hi: string };
  pada: number;
  isRetrograde?: boolean;
  speed?: number;
  isCombust?: boolean;
  combustionDistance?: number;
  dignity?: {
    kind: string;
    label: { en: string; hi: string };
    exalted?: boolean;
    debilitated?: boolean;
    ownSign?: boolean;
    moolatrikona?: boolean;
  };
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
  /** Traceable chart facts for citation-style Free Report / AI. */
  basedOn?: { en: string; hi: string };
}

export interface LifeInsight {
  area: string;
  title: { en: string; hi: string };
  text: { en: string; hi: string };
}

export interface GrahaAspectInfo {
  fromId: string;
  fromName: { en: string; hi: string };
  toHouse: number;
  aspect: number;
  label: { en: string; hi: string };
}

export interface DoshaBlock {
  present: boolean;
  meaning: { en: string; hi: string };
  [key: string]: unknown;
}

export interface KundliResult {
  input: BirthInput;
  ayanamsa: number;
  settings: {
    zodiac: "sidereal";
    ayanamsa: "lahiri" | "raman" | "kp" | "true_chitra";
    /** Date-specific ayanamsa degrees used for this chart (audit). */
    ayanamsaDegrees: number;
    houseSystem: "whole-sign" | "whole_sign" | "sripati" | "placidus";
    houseSystemByChart: {
      d1: "whole_sign";
      kp: "placidus";
      bhavChalit: "sripati";
    };
    nodeType: "mean" | "true";
    ephemerisEngine: string;
    /** Resolved installed astronomy-engine version (not the package.json range). */
    ephemerisEngineVersion?: string;
    dayBoundary: "sunrise";
    timezoneMode: "iana_historical" | "fixed_offset_minutes";
    timeZone: string;
    /** Effective civil offset (minutes east of UTC) at the birth instant. */
    timezoneOffsetMinutes: number;
    /** True when the user marked birth time as approximate. */
    birthTimeApproximate?: boolean;
  };
  lagna: {
    signIndex: number;
    sign: { en: string; hi: string };
    degree: number;
    longitude: number;
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
  aspects: GrahaAspectInfo[];
  yogas: YogaFlag[];
  doshas: {
    manglik: DoshaBlock;
    kaalSarp: DoshaBlock;
    sadeSati?: DoshaBlock;
    pitra?: DoshaBlock;
  };
  dasha: {
    currentMaha: DashaPeriod;
    currentAntar: DashaPeriod;
    currentPratyantar?: DashaPeriod;
    mahaList: DashaPeriod[];
    antarList?: DashaPeriod[];
    pratyantarList?: DashaPeriod[];
    balanceYears?: number;
    startLord?: { en: string; hi: string };
  };
  /** Yogini dasha (36-year cycle) — parallel to Vimshottari. */
  yoginiDasha?: unknown;
  /** Jaimini Chara dasha. */
  charaDasha?: unknown;
  /** Shadbala planet strengths. */
  shadbala?: unknown;
  /** Jaimini AL / UL / AK / Karakamsha. */
  jaimini?: unknown;
  /** Tajika annual chart for current/target year. */
  varshphal?: unknown;
  /** Lal Kitab pakka ghar / debts / remedies. */
  lalkitab?: unknown;
  divisionalCharts?: Record<string, unknown>;
  /** Birth-moment panchang (tithi, karana, yoga, nakshatra, vara). */
  panchang?: unknown;
  /** Avakhada chakra from Moon nakshatra/rashi. */
  avakhada?: unknown;
  /** Sarvashtakvarga + Bhinnashtakvarga. */
  ashtakvarga?: unknown;
  /** Sripati Bhav Chalit (cusps + planet houses). */
  bhavChalit?: unknown;
  /** KP: Placidus cusps + sign/star/sub for lagna & planets. */
  kp?: unknown;
  transits?: unknown;
  /** Multi-factor topic analyses derived from this same kundli object. */
  predictions?: import("./prediction/types").PredictionBundle;
  insights: LifeInsight[];
  reliability: {
    level: "high" | "moderate" | "limited";
    reasons: { en: string; hi: string }[];
  };
  computedAt: string;
}
