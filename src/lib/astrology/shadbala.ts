/**
 * Shadbala (षड्बल) — six-fold planetary strength in virupas (60 virupa = 1 rupa).
 *
 * Source for rebuilt components: BPHS Shadbala Adhyaya (Santhanam),
 * with the same required-minima table used by JHora.
 * Rahu/Ketu are excluded (BPHS Shadbala is for the seven grahas).
 *
 * Rebuild status (do not treat “approx” numbers as classical):
 *   naisargika — BPHS (phase 1)
 *   dik        — BPHS/JHora (phase 2): 60×(1 − arc/180) from peak kendra longitude
 *   cheshta    — BPHS (phase 3): verses 24–25 kendra/3; Sun=Ayana (undoubled), Moon=Paksha (undoubled)
 *   drik       — BPHS/Sripathi/Raman (phase 4): sphuta drishti virupas; Drik = Pinda/4
 *   kala       — BPHS/Raman (phase 5): nine sub-balas summed
 *   sthana     — BPHS/Raman (phase 6): Uchcha + Saptavargaja + Ojayugma + Kendradi + Drekkana
 */
import * as Astronomy from "astronomy-engine";
import { SIGN_LORDS } from "./constants";
import { combustOrb, EXALTATION_POINT } from "./dignity";
import { angleDelta, angleDistance, dateToJulianDay, norm360 } from "./math";
import { sunRiseSetWindow } from "./muhurat-now";
import { tropicalLongitude } from "./planets";
import { weekdayInTimeZone } from "./timezone";
import type { PlanetPosition } from "./types";
import {
  drekkanaSignIndex,
  dwadasamsaSignIndex,
  horaSignIndex,
  navamsaSignIndex,
  rashiSignIndex,
  saptamsaSignIndex,
  trimsamsaSignIndex,
} from "./vargas";

const SHADBALA_IDS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
] as const;

export type ShadbalaPlanetId = (typeof SHADBALA_IDS)[number];
type Pid = ShadbalaPlanetId;

export type BalaMethod = "bphs" | "approx";

/** BPHS required Shadbala (virupas) = rupas × 60. */
export const REQUIRED_VIRUPA: Record<Pid, number> = {
  sun: 390, // 6.5 rupa
  moon: 360, // 6
  mars: 300, // 5
  mercury: 420, // 7
  jupiter: 390, // 6.5
  venus: 330, // 5.5
  saturn: 300, // 5
};

/**
 * BPHS Naisargika Bala: 60 × {7,6,2,3,4,5,1}/7 virupas
 * for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.
 * Natural order of brightness / inherent strength.
 */
const NAISARGIKA_SEVENTHS: Record<Pid, number> = {
  sun: 7,
  moon: 6,
  mars: 2,
  mercury: 3,
  jupiter: 4,
  venus: 5,
  saturn: 1,
};

export function naisargikaBala(id: Pid): number {
  return (60 * NAISARGIKA_SEVENTHS[id]) / 7;
}

/**
 * BPHS Dig Bala (Santhanam, Shadbala Adhyaya) — directional strength.
 * Peak kendras (full 60 virupa):
 *   Jupiter & Mercury — East  = Lagna (Asc)
 *   Sun & Mars        — South = MC (10th / meridian)
 *   Saturn            — West  = Descendant (Asc + 180°)
 *   Moon & Venus      — North = IC (MC + 180°)
 *
 * JHora / BPHS computational form (linear, not stepped houses, not cos(90°)=0):
 *   DigBala = 60 × (1 − δ/180) virupas
 *   δ = smallest ecliptic arc between planet longitude and peak kendra longitude.
 * 60 at the peak, 30 at 90°, 0 at the opposite kendra.
 */
export type DigPeakAngle = "asc" | "mc" | "dsc" | "ic";

export const DIG_PEAK_ANGLE: Record<Pid, DigPeakAngle> = {
  jupiter: "asc",
  mercury: "asc",
  sun: "mc",
  mars: "mc",
  saturn: "dsc",
  moon: "ic",
  venus: "ic",
};

export function digPeakLongitude(
  id: Pid,
  lagnaLon: number,
  mcLon: number
): number {
  switch (DIG_PEAK_ANGLE[id]) {
    case "asc":
      return norm360(lagnaLon);
    case "mc":
      return norm360(mcLon);
    case "dsc":
      return norm360(lagnaLon + 180);
    case "ic":
      return norm360(mcLon + 180);
  }
}

export function digBala(id: Pid, planetLon: number, lagnaLon: number, mcLon: number): number {
  const peak = digPeakLongitude(id, lagnaLon, mcLon);
  const delta = angleDistance(planetLon, peak); // 0…180
  return 60 * (1 - delta / 180);
}

export type ShadbalaAngles = {
  lagnaLon: number;
  mcLon: number;
  /** Required for Kala (sunrise/sunset, Hindu day, hora). */
  lat: number;
  lon: number;
  timeZone: string;
};

/**
 * BPHS Ch.27 vv.24–25 (Santhanam) — Cheshta Bala for Kuja through Shani:
 *   Cheshta Kendra = Seeghrochcha − (mean + true)/2
 *   if kendra > 6 rasis, subtract from 360°
 *   Cheshta Bala = kendra_degrees / 3   (0…60 virupa)
 *
 * Seeghrochcha: outer grahas = mean Sun; Mercury/Venus = heliocentric longitude
 * (Surya Siddhanta sheeghra; distinguishes inferior vs superior conjunction).
 * Mean longitudes: Meeus, Astronomical Algorithms (2nd ed.) Tables 25.2 / 31.A.
 *
 * Luminaries are not in v.24 (“कुजात्”). Standard BPHS/Saravali identification:
 *   Sun  Chesta = its Ayana Bala  = 60×(24+δ)/48  (Raman/JHora; δ = declination)
 *   Moon Chesta = its Paksha Bala = |Moon−Sun|/3   (0 at Amavasya, 60 at Purnima)
 */
function julianCentury(date: Date): number {
  return (dateToJulianDay(date) - 2451545.0) / 36525;
}

/** Mean geometric longitude of the Sun, Meeus AA 2nd ed. §25.2. */
export function meanSunLongitude(date: Date): number {
  const T = julianCentury(date);
  return norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
}

/** Mean heliocentric longitudes, Meeus AA 2nd ed. Table 31.A. */
const MEEUS_MEAN_L0: Record<"mars" | "jupiter" | "saturn", [number, number, number]> = {
  mars: [355.433275, 19140.2993313, 0.00000261],
  jupiter: [34.351484, 3034.9056746, -0.00008501],
  saturn: [50.077471, 1222.1137943, 0.00021004],
};

function meanPlanetLongitude(id: "mars" | "jupiter" | "saturn", date: Date): number {
  const T = julianCentury(date);
  const [a, b, c] = MEEUS_MEAN_L0[id];
  return norm360(a + b * T + c * T * T);
}

function heliocentricLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.HelioVector(body, date);
  return norm360(Astronomy.Ecliptic(vec).elon);
}

function circularMid(a: number, b: number): number {
  return norm360(a + angleDelta(a, b) / 2);
}

function fold180(deg: number): number {
  const n = norm360(deg);
  return n > 180 ? 360 - n : n;
}

function obliquityDeg(date: Date): number {
  const T = julianCentury(date);
  return 23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
}

/** Sun declination from tropical longitude (ecliptic latitude ≈ 0). */
export function sunDeclinationDeg(date: Date): number {
  const lon = (tropicalLongitude(Astronomy.Body.Sun, date) * Math.PI) / 180;
  const eps = (obliquityDeg(date) * Math.PI) / 180;
  return (Math.asin(Math.sin(eps) * Math.sin(lon)) * 180) / Math.PI;
}

/**
 * Kesava Daivajna Ayana formula (Raman Art. 75; BPHS Kala Ayana):
 *   60 × (24 + signed_kranti) / 48
 * Signed kranti (north +): Sun/Mars/Jupiter/Venus as-is; Moon/Saturn reversed;
 * Mercury always additive (|δ|). Clamp kranti to ±24°.
 * Sun is doubled only in Kala Bala, not in Cheshta.
 */
export function ayanaBalaKesava(
  id: Pid,
  declinationDeg: number,
  opts?: { doubleSun?: boolean }
): number {
  let k = declinationDeg;
  if (id === "mercury") k = Math.abs(k);
  else if (id === "moon" || id === "saturn") k = -k;
  k = Math.max(-24, Math.min(24, k));
  const base = (60 * (24 + k)) / 48;
  const v = Math.max(0, Math.min(60, base));
  if (id === "sun" && opts?.doubleSun) return v * 2;
  return v;
}

/** Ayana Bala of the Sun (used as Sun’s Cheshta). Undoubled 0…60. Kala doubles this. */
export function sunAyanaBala(date: Date): number {
  return ayanaBalaKesava("sun", sunDeclinationDeg(date), { doubleSun: false });
}

/** Paksha Bala of the Moon (used as Moon’s Cheshta). */
export function moonPakshaBala(date: Date): number {
  const sun = tropicalLongitude(Astronomy.Body.Sun, date);
  const moon = tropicalLongitude(Astronomy.Body.Moon, date);
  return angleDistance(moon, sun) / 3;
}

const INNER: Record<string, Astronomy.Body> = {
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
};

const OUTER = ["mars", "jupiter", "saturn"] as const;

export function cheshtaKendra(id: Pid, date: Date): number | null {
  if (id === "sun" || id === "moon") return null;
  const body = (
    {
      mars: Astronomy.Body.Mars,
      mercury: Astronomy.Body.Mercury,
      jupiter: Astronomy.Body.Jupiter,
      venus: Astronomy.Body.Venus,
      saturn: Astronomy.Body.Saturn,
    } as const
  )[id];
  const trueLon = tropicalLongitude(body, date);
  const meanSun = meanSunLongitude(date);
  let seeghra: number;
  let madhya: number;
  if (id === "mercury" || id === "venus") {
    seeghra = heliocentricLongitude(INNER[id], date);
    madhya = meanSun;
  } else {
    seeghra = meanSun;
    madhya = meanPlanetLongitude(id as (typeof OUTER)[number], date);
  }
  const mid = circularMid(madhya, trueLon);
  return fold180(seeghra - mid);
}

export function cheshtaBala(id: Pid, date: Date): number {
  if (id === "sun") return sunAyanaBala(date);
  if (id === "moon") return moonPakshaBala(date);
  const kendra = cheshtaKendra(id, date);
  if (kendra == null) return 0;
  return kendra / 3;
}

/**
 * Sthana Bala — five positional sub-balas.
 * Raman, Graha and Bhava Balas Ch.III Art. 18 (Sripathi/BPHS computational form):
 *   (1) Ochchabala  (2) Saptavargaja  (3) Ojayugmarasyamsa  (4) Kendra  (5) Drekkana
 * Not the 4-group condensations that drop Drekkana or merge Kendra+Oja.
 */

export type SthanaBreakdown = {
  uchcha: number;
  saptavargaja: number;
  ojayugma: number;
  kendradi: number;
  drekkana: number;
  total: number;
};

export function deepExaltationLongitude(id: Pid): number {
  const e = EXALTATION_POINT[id]!;
  return e.sign * 30 + e.degree;
}

export function deepDebilitationLongitude(id: Pid): number {
  return norm360(deepExaltationLongitude(id) + 180);
}

/**
 * 1. Uchcha Bala (Raman Art. 20; BPHS: lon − neecha, fold from 180°, ÷3).
 * 60 at deep exaltation, 0 at deep debilitation. Continuous, not sign-lump.
 * Reuses dignity.EXALTATION_POINT (already validated in this project).
 */
export function uchchaBala(id: Pid, longitude: number): number {
  return angleDistance(longitude, deepDebilitationLongitude(id)) / 3;
}

type NatRel = "friend" | "neutral" | "enemy";

/** Raman Art. 24 Naisargika (permanent) relations. */
const NAISARGIKA_REL: Record<Pid, Record<Pid, NatRel>> = {
  sun: {
    sun: "friend",
    moon: "friend",
    mars: "friend",
    mercury: "neutral",
    jupiter: "friend",
    venus: "enemy",
    saturn: "enemy",
  },
  moon: {
    sun: "friend",
    moon: "friend",
    mars: "neutral",
    mercury: "friend",
    jupiter: "neutral",
    venus: "neutral",
    saturn: "neutral",
  },
  mars: {
    sun: "friend",
    moon: "friend",
    mars: "friend",
    mercury: "enemy",
    jupiter: "friend",
    venus: "neutral",
    saturn: "neutral",
  },
  mercury: {
    sun: "friend",
    moon: "enemy",
    mars: "neutral",
    mercury: "friend",
    jupiter: "neutral",
    venus: "friend",
    saturn: "neutral",
  },
  jupiter: {
    sun: "friend",
    moon: "friend",
    mars: "friend",
    mercury: "enemy",
    jupiter: "friend",
    venus: "enemy",
    saturn: "neutral",
  },
  venus: {
    sun: "enemy",
    moon: "enemy",
    mars: "neutral",
    mercury: "friend",
    jupiter: "neutral",
    venus: "friend",
    saturn: "friend",
  },
  saturn: {
    sun: "enemy",
    moon: "enemy",
    mars: "enemy",
    mercury: "friend",
    jupiter: "neutral",
    venus: "friend",
    saturn: "friend",
  },
};

type MixedRel = "adhimitra" | "mitra" | "sama" | "satru" | "adhisatru";

function tatkalikaFriend(fromSign: number, otherSign: number): boolean {
  const h = ((otherSign - fromSign + 12) % 12) + 1;
  return h === 2 || h === 3 || h === 4 || h === 10 || h === 11 || h === 12;
}

/** Raman Art. 26 Panchadha Maitri. */
export function mixedRelation(fromId: Pid, otherId: Pid, planets: PlanetPosition[]): MixedRel {
  const a = planets.find((p) => p.id === fromId);
  const b = planets.find((p) => p.id === otherId);
  if (!a || !b) return "sama";
  const tempFriend = tatkalikaFriend(a.signIndex, b.signIndex);
  const nat = NAISARGIKA_REL[fromId][otherId];
  if (tempFriend && nat === "friend") return "adhimitra";
  if (tempFriend && nat === "enemy") return "sama";
  if (tempFriend && nat === "neutral") return "mitra";
  if (!tempFriend && nat === "enemy") return "adhisatru";
  if (!tempFriend && nat === "friend") return "sama";
  return "satru"; // temp enemy + nat neutral
}

const SAPTA_VIRUPA: Record<MixedRel, number> = {
  adhimitra: 22.5,
  mitra: 15,
  sama: 7.5,
  satru: 3.75,
  adhisatru: 1.875,
};

/**
 * BPHS moolatrikona degree spans in D1 only (Raman Art. 30: 45 in moolatrikona Rasi,
 * never in the other six vargas). Moon: whole Taurus as moolatrikona rasi.
 */
const MOOLA_D1: Record<Pid, { sign: number; fromDeg: number; toDeg: number }> = {
  sun: { sign: 4, fromDeg: 0, toDeg: 20 },
  moon: { sign: 1, fromDeg: 0, toDeg: 30 },
  mars: { sign: 0, fromDeg: 0, toDeg: 12 },
  mercury: { sign: 5, fromDeg: 16, toDeg: 20 },
  jupiter: { sign: 8, fromDeg: 0, toDeg: 10 },
  venus: { sign: 6, fromDeg: 0, toDeg: 15 },
  saturn: { sign: 10, fromDeg: 0, toDeg: 20 },
};

function inMoolatrikonaD1(id: Pid, longitude: number): boolean {
  const m = MOOLA_D1[id];
  const sign = rashiSignIndex(longitude);
  if (sign !== m.sign) return false;
  const deg = norm360(longitude) % 30;
  return deg >= m.fromDeg && deg < m.toDeg;
}

const SAPTA_VARGA_FN: Array<(lon: number) => number> = [
  rashiSignIndex,
  horaSignIndex,
  drekkanaSignIndex,
  saptamsaSignIndex,
  navamsaSignIndex,
  dwadasamsaSignIndex,
  trimsamsaSignIndex,
];

function lordOfSign(signIndex: number): Pid {
  return houseLordId(signIndex) as Pid;
}

function saptavargaScore(id: Pid, vargaSign: number, isD1: boolean, longitude: number, planets: PlanetPosition[]): number {
  const lord = lordOfSign(vargaSign);
  if (isD1 && inMoolatrikonaD1(id, longitude)) return 45;
  if (lord === id) return 30;
  return SAPTA_VIRUPA[mixedRelation(id, lord, planets)];
}

/**
 * 2. Saptavargaja Bala (Raman Arts. 27–30).
 * Vargas: D1 Rasi, D2 Hora, D3 Drekkana, D7 Saptamsa, D9 Navamsa, D12 Dwadasamsa, D30 Trimsamsa.
 * Reuses vargas.ts mappers — not recomputed. Virupas: Raman 45 / 30 / 22.5 / 15 / 7.5 / 3.75 / 1.875
 * (BPHS verse integers 45/30/20/15/10/4/2 are the same scale, rounded; we follow Raman as in Drik/Kala).
 */
export function saptavargajaBala(id: Pid, longitude: number, planets: PlanetPosition[]): number {
  return SAPTA_VARGA_FN.reduce((sum, fn, i) => sum + saptavargaScore(id, fn(longitude), i === 0, longitude, planets), 0);
}

const OJA_ODD: Pid[] = ["sun", "mars", "mercury", "jupiter", "saturn"];

function isOddRasi(signIndex: number): boolean {
  return signIndex % 2 === 0; // Aries=0 is the 1st (odd) sign
}

/**
 * 3. Ojayugmarasyamsa (Raman Art. 31).
 * Moon/Venus: 15 in even Rasi, 15 in even Navamsa. Others: 15 in odd Rasi, 15 in odd Navamsa.
 */
export function ojayugmarasyamsaBala(id: Pid, longitude: number): number {
  const wantOdd = OJA_ODD.includes(id);
  const rasi = rashiSignIndex(longitude);
  const nav = navamsaSignIndex(longitude);
  const rasiHit = wantOdd ? isOddRasi(rasi) : !isOddRasi(rasi);
  const navHit = wantOdd ? isOddRasi(nav) : !isOddRasi(nav);
  return (rasiHit ? 15 : 0) + (navHit ? 15 : 0);
}

/**
 * 4. Kendradi / Kendra Bala (Raman Arts. 32–35). Parasara: whole-sign from Lagna, not Bhava.
 * Kendra 1/4/7/10 = 60; Panapara 2/5/8/11 = 30; Apoklima 3/6/9/12 = 15.
 */
export function kendradiBala(house: number): number {
  const h = ((house - 1) % 12) + 1;
  if (h === 1 || h === 4 || h === 7 || h === 10) return 60;
  if (h === 2 || h === 5 || h === 8 || h === 11) return 30;
  return 15;
}

/**
 * 5. Drekkana Bala (Raman Arts. 36–39; BPHS quarter-rupa = 15).
 * Male (Su/Ju/Ma) 1st 0–10°; hermaphrodite (Sa/Me) 2nd 10–20°; female (Mo/Ve) 3rd 20–30°.
 * Worked example uses 15, not 60. (BPHS English “male, female, eunuch / 1st, 2nd, 3rd”
 * disagrees with Raman’s middle=hermaphrodite; we follow Raman’s explicit Arts. 36–39 + example.)
 */
export function drekkanaBalaSthana(id: Pid, longitude: number): number {
  const deg = norm360(longitude) % 30;
  const third = deg < 10 ? 0 : deg < 20 ? 1 : 2;
  if ((id === "sun" || id === "jupiter" || id === "mars") && third === 0) return 15;
  if ((id === "saturn" || id === "mercury") && third === 1) return 15;
  if ((id === "moon" || id === "venus") && third === 2) return 15;
  return 0;
}

export function sthanaBreakdown(id: Pid, planets: PlanetPosition[]): SthanaBreakdown {
  const p = planets.find((x) => x.id === id);
  if (!p) {
    return { uchcha: 0, saptavargaja: 0, ojayugma: 0, kendradi: 0, drekkana: 0, total: 0 };
  }
  const uchcha = uchchaBala(id, p.longitude);
  const saptavargaja = saptavargajaBala(id, p.longitude, planets);
  const ojayugma = ojayugmarasyamsaBala(id, p.longitude);
  const kendradi = kendradiBala(p.house);
  const drekkana = drekkanaBalaSthana(id, p.longitude);
  return {
    uchcha,
    saptavargaja,
    ojayugma,
    kendradi,
    drekkana,
    total: uchcha + saptavargaja + ojayugma + kendradi + drekkana,
  };
}

export function sthanaBala(id: Pid, planets: PlanetPosition[]): number {
  return sthanaBreakdown(id, planets).total;
}

/**
 * Kala Bala — nine temporal sub-balas (Raman, Graha and Bhava Balas Ch.V Arts. 46–78;
 * BPHS Shadbala Adhyaya / Santhanam, the same nine-fold split — not the 5- or 6-group
 * condensations some later summaries use):
 *   1. Nathonnata (Divaratri)
 *   2. Paksha
 *   3. Tribhaga
 *   4. Abda (Varsha / year-lord)
 *   5. Masa (month-lord)
 *   6. Vara (Dina / weekday-lord)
 *   7. Hora
 *   8. Ayana
 *   9. Yuddha
 *
 * Sunrise/sunset: reused from muhurat-now sunRiseSetWindow (astronomy-engine SearchRiseSet).
 * Paksha vs Phase 3 Moon-Cheshta: same |Moon−Sun|/3 helper; Cheshta stays undoubled;
 * Kala doubles it for the Moon only (Raman Art. 55c).
 * Ayana vs Phase 3 Sun-Cheshta: same Kesava 60×(24+δ)/48 on Sun declination;
 * Cheshta stays undoubled; Kala doubles the Sun (Raman Art. 75). Other grahas use
 * their own declination with the same formula.
 */

export type KalaBreakdown = {
  nathonnata: number;
  paksha: number;
  tribhaga: number;
  abda: number;
  masa: number;
  vara: number;
  hora: number;
  ayana: number;
  yuddha: number;
  total: number;
};

export type SunWindow = { sunrise: Date; sunset: Date; nextSunrise: Date };

const WEEKDAY_LORD: Pid[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

/** Chaldean hora order after the weekday lord (Raman Art. 69; Surya Siddhanta distances). */
const HORA_SEQUENCE: Pid[] = ["sun", "venus", "mercury", "moon", "saturn", "jupiter", "mars"];

/** Raman Art. 77 Bimba Parimana (minutes of arc). Sun/Moon do not yuddha. */
const DISC_MINUTES: Record<Exclude<Pid, "sun" | "moon">, number> = {
  mars: 9.4,
  mercury: 6.6,
  jupiter: 190.4,
  venus: 16.6,
  saturn: 158.0,
};

const YUDDHA_IDS = ["mars", "mercury", "jupiter", "venus", "saturn"] as const;

/** Raman Art. 63 condensed ahargana epoch: 2 May 1827, Wednesday. */
const AHARGANA_EPOCH_UTC = Date.UTC(1827, 4, 2);

function localYmd(date: Date, timeZone: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const num = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: num("year"), m: num("month"), d: num("day") };
}

/** Inclusive civil-day count from 2 May 1827. Raman Art. 63. */
export function condensedAhargana(y: number, m: number, d: number): number {
  return Math.round((Date.UTC(y, m - 1, d) - AHARGANA_EPOCH_UTC) / 86_400_000) + 1;
}

/** Remainder 1 = Wednesday (epoch weekday). Raman Arts. 63–67. */
function jsWeekdayFromAharganaRemainder(remainder: number): number {
  const r = ((remainder % 7) + 7) % 7;
  const oneBased = r === 0 ? 7 : r;
  return (3 + oneBased - 1) % 7;
}

export function abdaLordFromAhargana(ah: number): Pid {
  const r = (Math.floor(ah / 360) * 3 + 1) % 7;
  return WEEKDAY_LORD[jsWeekdayFromAharganaRemainder(r)]!;
}

export function masaLordFromAhargana(ah: number): Pid {
  const r = (Math.floor(ah / 30) * 2 + 1) % 7;
  return WEEKDAY_LORD[jsWeekdayFromAharganaRemainder(r)]!;
}

export function varaLordFromAhargana(ah: number): Pid {
  return WEEKDAY_LORD[jsWeekdayFromAharganaRemainder(ah % 7)]!;
}

function hinduDayAhargana(sunrise: Date, timeZone: string): number {
  const { y, m, d } = localYmd(sunrise, timeZone);
  return condensedAhargana(y, m, d);
}

/**
 * 1. Nathonnata / Divaratri (Raman Arts. 47–51).
 * Mercury always 60. Day grahas (Su/Ju/Ve) peak at local apparent noon
 * (midpoint of reused sunrise–sunset); night grahas (Mo/Ma/Sa) peak at midnight
 * (midpoint of sunset–next sunrise). Linear between those meridians.
 */
export function nathonnataBala(id: Pid, date: Date, win: SunWindow): number {
  if (id === "mercury") return 60;
  const sunrise = win.sunrise.getTime();
  const sunset = win.sunset.getTime();
  const nextSunrise = win.nextSunrise.getTime();
  const t = date.getTime();
  const noon = (sunrise + sunset) / 2;
  const nightMs = Math.max(nextSunrise - sunset, 1);
  const midnightAfter = sunset + nightMs / 2;
  const midnightBefore = sunrise - nightMs / 2;
  let dayBala: number;
  if (t <= noon) {
    dayBala = (60 * (t - midnightBefore)) / Math.max(noon - midnightBefore, 1);
  } else if (t <= midnightAfter) {
    dayBala = (60 * (midnightAfter - t)) / Math.max(midnightAfter - noon, 1);
  } else {
    const nextNoon = nextSunrise + (noon - sunrise);
    dayBala = (60 * (t - midnightAfter)) / Math.max(nextNoon - midnightAfter, 1);
  }
  dayBala = Math.max(0, Math.min(60, dayBala));
  const nightBala = 60 - dayBala;
  if (id === "sun" || id === "jupiter" || id === "venus") return dayBala;
  return nightBala;
}

/**
 * 2. Paksha (Raman Arts. 52–55).
 * Subha = |Moon−Sun|/3 (same helper as Moon Cheshta). Papa = 60 − subha.
 * Moon always doubled (Art. 55c). Mercury papa if combust.
 */
export function kalaPakshaBala(id: Pid, planets: PlanetPosition[], date: Date): number {
  const subha = moonPakshaBala(date);
  if (id === "moon") return 2 * subha;
  const papa = 60 - subha;
  const benefic =
    id === "jupiter" ||
    id === "venus" ||
    (id === "mercury" && aspectingIsBenefic("mercury", planets));
  return benefic ? subha : papa;
}

const DAY_TRIBHAGA: Pid[] = ["mercury", "sun", "saturn"];
const NIGHT_TRIBHAGA: Pid[] = ["moon", "venus", "mars"];

/**
 * 3. Tribhaga (Raman Arts. 56–57).
 * Day thirds (sunrise→sunset): Mercury, Sun, Saturn.
 * Night thirds (sunset→next sunrise): Moon, Venus, Mars.
 * Jupiter always 60. Only one other graha scores 60.
 */
export function tribhagaBala(id: Pid, date: Date, win: SunWindow): number {
  if (id === "jupiter") return 60;
  const t = date.getTime();
  const isDay = t >= win.sunrise.getTime() && t < win.sunset.getTime();
  const start = isDay ? win.sunrise.getTime() : win.sunset.getTime();
  const end = isDay ? win.sunset.getTime() : win.nextSunrise.getTime();
  const span = Math.max(end - start, 1);
  const third = Math.min(2, Math.max(0, Math.floor(((t - start) / span) * 3)));
  const lord = (isDay ? DAY_TRIBHAGA : NIGHT_TRIBHAGA)[third];
  return id === lord ? 60 : 0;
}

/** 4–6. Abda 15 / Masa 30 / Vara 45. Raman Arts. 65–67. 360-day year, 30-day month. */
export function abdaBala(id: Pid, ah: number): number {
  return id === abdaLordFromAhargana(ah) ? 15 : 0;
}
export function masaBala(id: Pid, ah: number): number {
  return id === masaLordFromAhargana(ah) ? 30 : 0;
}
export function varaBala(id: Pid, ah: number): number {
  return id === varaLordFromAhargana(ah) ? 45 : 0;
}

/**
 * 7. Hora (Raman Arts. 68–70).
 * 24 equal horas from sunrise to next sunrise (not 12 unequal day + 12 night).
 * First hora = Hindu weekday lord at sunrise; then HORA_SEQUENCE.
 */
export function horaLord(date: Date, win: SunWindow, timeZone: string): Pid {
  const weekday = weekdayInTimeZone(win.sunrise, timeZone);
  const first = WEEKDAY_LORD[weekday]!;
  const startIdx = HORA_SEQUENCE.indexOf(first);
  const dayMs = Math.max(win.nextSunrise.getTime() - win.sunrise.getTime(), 1);
  const slot = Math.min(
    23,
    Math.max(0, Math.floor(((date.getTime() - win.sunrise.getTime()) / dayMs) * 24))
  );
  return HORA_SEQUENCE[(startIdx + slot) % 7]!;
}

export function horaBala(id: Pid, date: Date, win: SunWindow, timeZone: string): number {
  return id === horaLord(date, win, timeZone) ? 60 : 0;
}

const BODY: Record<Pid, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mars: Astronomy.Body.Mars,
  mercury: Astronomy.Body.Mercury,
  jupiter: Astronomy.Body.Jupiter,
  venus: Astronomy.Body.Venus,
  saturn: Astronomy.Body.Saturn,
};

/** Geocentric declination. Sun reuses Phase-3 ecliptic formula so Cheshta is unchanged. */
export function planetDeclinationDeg(id: Pid, date: Date): number {
  if (id === "sun") return sunDeclinationDeg(date);
  const vec = Astronomy.GeoVector(BODY[id], date, true);
  return Astronomy.EquatorFromVector(vec).dec;
}

/** 8. Ayana (Raman Arts. 71–75). Sun doubled here only. */
export function kalaAyanaBala(id: Pid, date: Date): number {
  return ayanaBalaKesava(id, planetDeclinationDeg(id, date), { doubleSun: true });
}

function kalaUptoHora(
  id: Pid,
  planets: PlanetPosition[],
  date: Date,
  win: SunWindow,
  timeZone: string,
  ah: number
): number {
  return (
    nathonnataBala(id, date, win) +
    kalaPakshaBala(id, planets, date) +
    tribhagaBala(id, date, win) +
    abdaBala(id, ah) +
    masaBala(id, ah) +
    varaBala(id, ah) +
    horaBala(id, date, win, timeZone)
  );
}

/**
 * 9. Yuddha (Raman Arts. 76–77). Non-luminaries within 1°. Winner = lesser longitude.
 * (Sthana + Dik + Kala up to Hora) difference ÷ disc-diameter difference.
 * Sthana is still approximate, so a non-zero Yuddha inherits that until Phase 6.
 */
export function yuddhaBalaAll(
  planets: PlanetPosition[],
  date: Date,
  angles: ShadbalaAngles,
  win: SunWindow,
  ah: number
): Record<Pid, number> {
  const out = Object.fromEntries(SHADBALA_IDS.map((id) => [id, 0])) as Record<Pid, number>;
  const fighters = YUDDHA_IDS.map((id) => planets.find((p) => p.id === id)).filter(
    (p): p is PlanetPosition => Boolean(p)
  );
  for (let i = 0; i < fighters.length; i++) {
    for (let j = i + 1; j < fighters.length; j++) {
      const a = fighters[i]!;
      const b = fighters[j]!;
      if (angleDistance(a.longitude, b.longitude) >= 1) continue;
      const idA = a.id as (typeof YUDDHA_IDS)[number];
      const idB = b.id as (typeof YUDDHA_IDS)[number];
      const diamDiff = Math.abs(DISC_MINUTES[idA] - DISC_MINUTES[idB]);
      if (diamDiff < 1e-9) continue;
      const agg = (id: Pid, p: PlanetPosition) =>
        sthanaBala(id, planets) +
        digBala(id, p.longitude, angles.lagnaLon, angles.mcLon) +
        kalaUptoHora(id, planets, date, win, angles.timeZone, ah);
      const winner = a.longitude < b.longitude ? a : b;
      const loser = winner === a ? b : a;
      const mag = Math.abs(agg(idA, a) - agg(idB, b)) / diamDiff;
      out[winner.id as Pid] += mag;
      out[loser.id as Pid] -= mag;
    }
  }
  return out;
}

export function kalaBreakdown(
  id: Pid,
  planets: PlanetPosition[],
  date: Date,
  angles: ShadbalaAngles,
  win?: SunWindow,
  yuddhaMap?: Record<Pid, number>
): KalaBreakdown {
  const window = win ?? sunRiseSetWindow(date, angles.lat, angles.lon);
  const ah = hinduDayAhargana(window.sunrise, angles.timeZone);
  const yuddha = (yuddhaMap ?? yuddhaBalaAll(planets, date, angles, window, ah))[id] ?? 0;
  const nathonnata = nathonnataBala(id, date, window);
  const paksha = kalaPakshaBala(id, planets, date);
  const tribhaga = tribhagaBala(id, date, window);
  const abda = abdaBala(id, ah);
  const masa = masaBala(id, ah);
  const vara = varaBala(id, ah);
  const hora = horaBala(id, date, window, angles.timeZone);
  const ayana = kalaAyanaBala(id, date);
  const total = nathonnata + paksha + tribhaga + abda + masa + vara + hora + ayana + yuddha;
  return { nathonnata, paksha, tribhaga, abda, masa, vara, hora, ayana, yuddha, total };
}

export function kalaBala(
  id: Pid,
  planets: PlanetPosition[],
  date: Date,
  angles: ShadbalaAngles,
  win?: SunWindow,
  yuddhaMap?: Record<Pid, number>
): number {
  return kalaBreakdown(id, planets, date, angles, win, yuddhaMap).total;
}

/**
 * Drik Bala — aspect strength received by a graha.
 *
 * Classical sources (locked before coding):
 *   BPHS Ch.26 Evaluation of Drishtis (Santhanam) vv.3–6
 *     v.3  ordinary slabs: 3rd & 10th = ¼, 5th & 9th = ½, 4th & 8th = ¾, 7th = full
 *     v.4  all grahas full 7th; Saturn special 3rd+10th; Jupiter 5th+9th; Mars 4th+8th
 *     v.5–6 sphuta (degree) drishti, not whole-sign on/off
 *   BPHS Ch.27 v.19 (Santhanam): Drik Bala is a pāda (¼) of Drishti Pinda;
 *     malefic drishtis reduce, benefic drishtis add.
 *     “Super-add entire Budha/Guru drishti” is the Bhava-Drik rule (Raman Art. 134),
 *     not graha Shadbala.
 *   B.V. Raman, Graha and Bhava Balas (1996), Arts. 109–120 (Sripathi computational form
 *     of the same BPHS sphuta rules):
 *     DK = aspected − aspecting; no aspect if DK < 30° or DK ≥ 300°.
 *     Ordinary virupas (piecewise linear through the v.3 keypoints):
 *       30–60  (DK−30)/2          → 0 at 30°, 15 at 60° (¼)
 *       60–90  (DK−60)+15         → 15 at 60°, 45 at 90° (¾)
 *       90–120 (120−DK)/2 + 30    → 45 at 90°, 30 at 120° (½)
 *       120–150 150−DK            → 30 at 120°, 0 at 150°
 *       150–180 (DK−150)×2        → 0 at 150°, 60 at 180° (full)
 *       180–300 (300−DK)/2        → 60 at 180°, 45 at 210°, 30 at 240°, 15 at 270°, 0 at 300°
 *     Visesha (Art. 115) ADDED in the special windows, then capped at 60:
 *       Mars    +15 on 4th (90–120) and 8th (210–240)  → 45+15=60 at 90°/210°
 *       Jupiter +30 on 5th (120–150) and 9th (240–270) → 30+30=60 at 120°/240°
 *       Saturn  +45 on 3rd (60–90) and 10th (270–300)  → 15+45=60 at 60°/270°
 *     Art. 116–119 signed Drishti Pinda; Art. 120 Drik Bala = Pinda / 4 (may be negative).
 *
 * Yoga-engine graha drishti (`aspects.ts`) is whole-sign house offsets for pattern
 * matching. Those booleans cannot supply virupas. Drik uses this longitudinal DK
 * curve. Special-aspect *which planets* match BPHS v.4; the *weights* do not.
 */
export function drishtiKendra(aspectingLon: number, aspectedLon: number): number {
  return norm360(aspectedLon - aspectingLon);
}

/** Ordinary (samanya) drishti in virupas from Drishti Kendra. Raman Art. 114. */
export function ordinaryDrishtiVirupa(dk: number): number {
  const x = norm360(dk);
  if (x < 30 || x >= 300) return 0;
  if (x < 60) return (x - 30) / 2;
  if (x < 90) return x - 60 + 15;
  if (x < 120) return (120 - x) / 2 + 30;
  if (x < 150) return 150 - x;
  if (x < 180) return (x - 150) * 2;
  return (300 - x) / 2;
}

/** Visesha (special) drishti added for Mars / Jupiter / Saturn. Raman Art. 115. */
export function viseshaDrishtiVirupa(id: Pid, dk: number): number {
  const x = norm360(dk);
  if (id === "mars" && ((x >= 90 && x < 120) || (x >= 210 && x < 240))) return 15;
  if (id === "jupiter" && ((x >= 120 && x < 150) || (x >= 240 && x < 270))) return 30;
  if (id === "saturn" && ((x >= 60 && x < 90) || (x >= 270 && x < 300))) return 45;
  return 0;
}

/** Combined ordinary + visesha, capped at full aspect (60 virupa). */
export function drishtiVirupa(fromId: Pid, aspectingLon: number, aspectedLon: number): number {
  const dk = drishtiKendra(aspectingLon, aspectedLon);
  return Math.min(60, ordinaryDrishtiVirupa(dk) + viseshaDrishtiVirupa(fromId, dk));
}

/**
 * Aspecting graha is Subha (+) or Papa (−). Raman Arts. 117–118:
 *   Papa: Sun, Mars, Saturn, Ksheena (Krishna / waning) Moon, combust Mercury
 *   Subha: Jupiter, Venus, Vriddha (Shukla / waxing) Moon, well-associated Mercury
 * Shukla = elongation (Moon−Sun) in (0°, 180°] including Purnima; Amavasya is Papa.
 * Mercury: combust (engine orb) = badly associated, as in Raman’s worked example.
 */
export function aspectingIsBenefic(fromId: Pid, planets: PlanetPosition[]): boolean {
  if (fromId === "jupiter" || fromId === "venus") return true;
  if (fromId === "sun" || fromId === "mars" || fromId === "saturn") return false;
  if (fromId === "moon") {
    const moon = planets.find((p) => p.id === "moon");
    const sun = planets.find((p) => p.id === "sun");
    if (!moon || !sun) return false;
    const elongation = norm360(moon.longitude - sun.longitude);
    return elongation > 0 && elongation <= 180;
  }
  if (fromId === "mercury") {
    const me = planets.find((p) => p.id === "mercury");
    const sun = planets.find((p) => p.id === "sun");
    if (!me) return true;
    if (me.isCombust === true) return false;
    if (sun) {
      const orb = combustOrb("mercury", Boolean(me.isRetrograde)) ?? 14;
      if (angleDistance(me.longitude, sun.longitude) <= orb) return false;
    }
    return true;
  }
  return false;
}

/** Signed Drishti Pinda on `id` from the other six grahas. Raman Art. 119. */
export function drishtiPinda(id: Pid, planets: PlanetPosition[]): number {
  const target = planets.find((p) => p.id === id);
  if (!target) return 0;
  let pinda = 0;
  for (const other of planets) {
    if (other.id === id || other.id === "rahu" || other.id === "ketu") continue;
    if (!SHADBALA_IDS.includes(other.id as Pid)) continue;
    const v = drishtiVirupa(other.id as Pid, other.longitude, target.longitude);
    pinda += aspectingIsBenefic(other.id as Pid, planets) ? v : -v;
  }
  return pinda;
}

/** Drik Bala = Drishti Pinda / 4. Raman Art. 120; BPHS Ch.27 v.19 pāda. May be negative. */
export function drikBala(id: Pid, planets: PlanetPosition[]): number {
  return drishtiPinda(id, planets) / 4;
}

export const SHADBALA_METHODS: Record<
  "sthana" | "dig" | "kala" | "cheshta" | "naisargika" | "drik",
  BalaMethod
> = {
  naisargika: "bphs",
  dik: "bphs",
  cheshta: "bphs",
  drik: "bphs",
  kala: "bphs",
  sthana: "bphs",
};

export type PlanetShadbala = {
  id: string;
  name: { en: string; hi: string };
  sthana: number;
  sthanaParts: SthanaBreakdown;
  dig: number;
  kala: number;
  kalaParts: KalaBreakdown;
  cheshta: number;
  naisargika: number;
  drik: number;
  totalVirupas: number;
  rupas: number;
  required: number;
  isStrong: boolean;
};

export type ShadbalaResult = {
  planets: PlanetShadbala[];
  strongest: string | null;
  methods: typeof SHADBALA_METHODS;
};

export function computeShadbala(
  planets: PlanetPosition[],
  date: Date,
  angles: ShadbalaAngles
): ShadbalaResult {
    const win = sunRiseSetWindow(date, angles.lat, angles.lon);
    const ah = hinduDayAhargana(win.sunrise, angles.timeZone);
    const yuddhaMap = yuddhaBalaAll(planets, date, angles, win, ah);
    const rows: PlanetShadbala[] = [];
    for (const id of SHADBALA_IDS) {
    const p = planets.find((x) => x.id === id);
    if (!p) continue;
    const sp = sthanaBreakdown(id, planets);
    const sthana = sp.total;
    const dig = digBala(id, p.longitude, angles.lagnaLon, angles.mcLon);
    const parts = kalaBreakdown(id, planets, date, angles, win, yuddhaMap);
    const kala = parts.total;
    const cheshta = cheshtaBala(id, date);
    const naisargika = naisargikaBala(id);
    const drik = drikBala(id, planets);
    const total = sthana + dig + kala + cheshta + naisargika + drik;
    rows.push({
      id,
      name: p.name,
      sthana: round2(sthana),
      sthanaParts: {
        uchcha: round2(sp.uchcha),
        saptavargaja: round2(sp.saptavargaja),
        ojayugma: round2(sp.ojayugma),
        kendradi: round2(sp.kendradi),
        drekkana: round2(sp.drekkana),
        total: round2(sp.total),
      },
      dig: round2(dig),
      kala: round2(kala),
      kalaParts: {
        nathonnata: round2(parts.nathonnata),
        paksha: round2(parts.paksha),
        tribhaga: round2(parts.tribhaga),
        abda: round2(parts.abda),
        masa: round2(parts.masa),
        vara: round2(parts.vara),
        hora: round2(parts.hora),
        ayana: round2(parts.ayana),
        yuddha: round2(parts.yuddha),
        total: round2(parts.total),
      },
      cheshta: round2(cheshta),
      naisargika: round2(naisargika),
      drik: round2(drik),
      totalVirupas: round1(total),
      rupas: round1(total / 60),
      required: REQUIRED_VIRUPA[id],
      isStrong: total >= REQUIRED_VIRUPA[id],
    });
  }
  rows.sort((a, b) => b.totalVirupas - a.totalVirupas);
  return {
    planets: rows,
    strongest: rows[0]?.id ?? null,
    methods: { ...SHADBALA_METHODS },
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** House lord strength helper used by rectification scoring. */
export function houseLordId(signIndex: number): string {
  const lord = SIGN_LORDS[signIndex]?.en.toLowerCase() ?? "mars";
  const map: Record<string, string> = {
    mars: "mars",
    venus: "venus",
    mercury: "mercury",
    moon: "moon",
    sun: "sun",
    jupiter: "jupiter",
    saturn: "saturn",
  };
  return map[lord] ?? "mars";
}
