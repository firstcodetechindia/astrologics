/**
 * Muhurta electional engine — multi-day pass/caution/avoid windows.
 * Follows `.cursor/skills/muhurta-electional/SKILL.md` (approved Phase 4).
 */
import { SIGNS } from "../constants";
import { signIndexFromLongitude } from "../math";
import { dailyMuhuratFor, type MuhuratWindow } from "../muhurat-now";
import { computePanchang } from "../panchang";
import { getSiderealPlanets } from "../planets";
import { resolveAyanamsa } from "../prefs";

export type Loc = { en: string; hi: string };

export type MuhurtaActivity =
  | "general_shubh"
  | "travel"
  | "marriage_talk"
  | "griha_pravesh"
  | "business_start";

export type ScoreBucket = "pass" | "caution" | "avoid";

export const MUHURTA_ACTIVITIES: {
  id: MuhurtaActivity;
  label: Loc;
}[] = [
  {
    id: "general_shubh",
    label: { en: "General auspicious work", hi: "सामान्य शुभ कार्य" },
  },
  { id: "travel", label: { en: "Travel", hi: "यात्रा" } },
  {
    id: "marriage_talk",
    label: { en: "Marriage talk / alliance", hi: "विवाह चर्चा / संबंध" },
  },
  {
    id: "griha_pravesh",
    label: { en: "Griha Pravesh / house entry", hi: "गृह प्रवेश" },
  },
  {
    id: "business_start",
    label: { en: "Business start", hi: "व्यवसाय आरंभ" },
  },
];

/** 0-based nakshatra indices — movable (Chara). */
const CHARA_NAK = new Set([6, 14, 21, 22, 23]); // Punarvasu, Swati, Shravana, Dhanishta, Shatabhisha
/** Fixed (Sthira) — stable for house/entry. */
const STHIRA_NAK = new Set([3, 11, 20, 25]); // Rohini, U.Phalguni, U.Ashadha, U.Bhadrapada
/** Popular travel-friendly set (Chara + classic travel stars). */
const TRAVEL_NAK = new Set([
  ...CHARA_NAK,
  0, // Ashwini
  4, // Mrigashira
  7, // Pushya
  12, // Hasta
  16, // Anuradha
  26, // Revati
]);

/** Rikta tithis within paksha: 4, 9, 14 (1-based within 1–15). */
function isRiktaTithi(tithiIndex1Based: number): boolean {
  const inPaksha = ((tithiIndex1Based - 1) % 15) + 1;
  return inPaksha === 4 || inPaksha === 9 || inPaksha === 14;
}

/** Harsh yogas (0-based into YOGAS list in panchang.ts). */
const HARSH_YOGA = new Set([0, 5, 8, 9, 12, 14, 16, 18, 26]);
/** Supportive yogas including Shubha (22). */
const SUPPORT_YOGA = new Set([2, 3, 4, 6, 7, 10, 11, 15, 19, 20, 21, 22, 23, 24, 25]);

const GOOD_CHOGHA = new Set(["Amrit", "Shubh", "Labh"]);
const BAD_CHOGHA = new Set(["Rog", "Udveg", "Kaal"]);

const BENEFIC_HORA = new Set(["Jupiter", "Venus", "Mercury", "Moon"]);
const MALEFIC_HORA = new Set(["Saturn", "Mars"]);

const MAX_DAYS = 14;

export type Factor = {
  class: "hard" | "soft" | "support";
  basedOn: Loc;
};

export type ScoredWindow = {
  date: string;
  start: string;
  end: string;
  startMs: number;
  endMs: number;
  grain: "day_choghadiya";
  choghadiya: Loc;
  hora: Loc;
  score: ScoreBucket;
  factors: Factor[];
  basedOn: Loc;
  panchang: {
    tithi: Loc;
    nakshatra: Loc;
    yoga: Loc;
    karana: Loc;
    weekday: Loc;
  };
};

export type MuhurtaElectionalResult = {
  activity: MuhurtaActivity;
  activityLabel: Loc;
  place: string;
  lat: number;
  lon: number;
  timeZone: string;
  startDate: string;
  endDate: string;
  daysScanned: number;
  grain: Loc;
  natalFilter: boolean;
  windows: ScoredWindow[];
  summary: {
    pass: number;
    caution: number;
    avoid: number;
  };
  topPass: ScoredWindow[];
  methodology: Loc;
  disclaimer: Loc;
};

function parseYmd(ymd: string): { y: number; m: number; d: number } | null {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

/** Local civil noon as UTC Date for sun-window lookup (same trick as placeDateFrom). */
function noonProbe(ymd: string, offsetMinutes: number): Date {
  const p = parseYmd(ymd)!;
  return new Date(Date.UTC(p.y, p.m - 1, p.d, 12, 0, 0) - offsetMinutes * 60_000);
}

function addDaysYmd(ymd: string, days: number): string {
  const p = parseYmd(ymd)!;
  const dt = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return dt.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  const a = parseYmd(start)!;
  const b = parseYmd(end)!;
  const ms =
    Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d);
  return Math.floor(ms / 86400_000);
}

function overlaps(
  a0: number,
  a1: number,
  b0: number,
  b1: number
): boolean {
  return a0 < b1 && b0 < a1;
}

function horaAt(
  horas: MuhuratWindow[],
  midMs: number
): MuhuratWindow | undefined {
  return horas.find((h) => midMs >= h.startMs && midMs < h.endMs);
}

function moonSignAt(ms: number): number {
  const date = new Date(ms);
  const ayan = resolveAyanamsa(date, "lahiri");
  const { planets } = getSiderealPlanets(date, ayan);
  const moon = planets.find((p) => p.id === "moon");
  return moon ? signIndexFromLongitude(moon.longitude) : 0;
}

function houseFrom(transitSign: number, natalSign: number): number {
  return ((transitSign - natalSign + 12) % 12) + 1;
}

function aggregate(factors: Factor[]): ScoreBucket {
  const hard = factors.filter((f) => f.class === "hard").length;
  const soft = factors.filter((f) => f.class === "soft").length;
  const support = factors.filter((f) => f.class === "support").length;
  if (hard > 0) return "avoid";
  if (soft > 0 && support === 0) return "caution";
  if (support >= soft) return "pass";
  return "caution";
}

function scoreWindow(opts: {
  activity: MuhurtaActivity;
  chog: MuhuratWindow;
  hora: MuhuratWindow | undefined;
  rahuStart: number;
  rahuEnd: number;
  panchang: ReturnType<typeof computePanchang>;
  natalFilter: boolean;
  natalMoonSignIndex: number | null;
}): { score: ScoreBucket; factors: Factor[] } {
  const { activity, chog, hora, rahuStart, rahuEnd, panchang } = opts;
  const factors: Factor[] = [];
  const mid = (chog.startMs + chog.endMs) / 2;

  // Hard: Rahu Kaal overlap
  if (overlaps(chog.startMs, chog.endMs, rahuStart, rahuEnd)) {
    factors.push({
      class: "hard",
      basedOn: {
        en: `Overlaps Rahu Kaal (${new Date(rahuStart).toISOString()}–${new Date(rahuEnd).toISOString()})`,
        hi: "राहु काल से ओवरलैप",
      },
    });
  }

  // Hard: Vishti (Bhadra) karana
  if (panchang.karana.name.en === "Vishti") {
    factors.push({
      class: "hard",
      basedOn: {
        en: "Vishti (Bhadra) karana active at window midpoint",
        hi: "खिड़की मध्य में विष्टि (भद्रा) करण",
      },
    });
  }

  // Soft: Rikta tithi
  if (isRiktaTithi(panchang.tithi.index)) {
    factors.push({
      class: "soft",
      basedOn: {
        en: `Rikta tithi: ${panchang.tithi.name.en} (#${panchang.tithi.index})`,
        hi: `रिक्त तिथि: ${panchang.tithi.name.hi}`,
      },
    });
  }

  // Soft: harsh yoga
  if (HARSH_YOGA.has(panchang.yoga.index - 1)) {
    factors.push({
      class: "soft",
      basedOn: {
        en: `Harsh yoga: ${panchang.yoga.name.en}`,
        hi: `कठोर योग: ${panchang.yoga.name.hi}`,
      },
    });
  }

  // Soft: bad Choghadiya
  if (BAD_CHOGHA.has(chog.name.en)) {
    factors.push({
      class: "soft",
      basedOn: {
        en: `Caution Choghadiya: ${chog.name.en}`,
        hi: `सावधानी चौघड़िया: ${chog.name.hi}`,
      },
    });
  }

  // Support: good Choghadiya
  if (GOOD_CHOGHA.has(chog.name.en)) {
    factors.push({
      class: "support",
      basedOn: {
        en: `Supportive Choghadiya: ${chog.name.en}`,
        hi: `सहायक चौघड़िया: ${chog.name.hi}`,
      },
    });
  }

  // Support: Shubha / supportive yoga
  if (SUPPORT_YOGA.has(panchang.yoga.index - 1)) {
    factors.push({
      class: "support",
      basedOn: {
        en: `Supportive yoga: ${panchang.yoga.name.en}`,
        hi: `सहायक योग: ${panchang.yoga.name.hi}`,
      },
    });
  }

  const nakIdx = panchang.nakshatra.index;
  const horaName = hora?.name.en ?? "";

  // Activity-specific
  if (activity === "travel") {
    if (TRAVEL_NAK.has(nakIdx)) {
      factors.push({
        class: "support",
        basedOn: {
          en: `Travel-friendly nakshatra: ${panchang.nakshatra.name.en}`,
          hi: `यात्रा-अनुकूल नक्षत्र: ${panchang.nakshatra.name.hi}`,
        },
      });
    } else if (STHIRA_NAK.has(nakIdx)) {
      factors.push({
        class: "soft",
        basedOn: {
          en: `Fixed nakshatra (less ideal for travel): ${panchang.nakshatra.name.en}`,
          hi: `स्थिर नक्षत्र (यात्रा हेतु कम अनुकूल): ${panchang.nakshatra.name.hi}`,
        },
      });
    }
  }

  if (activity === "griha_pravesh") {
    if (STHIRA_NAK.has(nakIdx)) {
      factors.push({
        class: "support",
        basedOn: {
          en: `Stable (Sthira) nakshatra: ${panchang.nakshatra.name.en}`,
          hi: `स्थिर नक्षत्र: ${panchang.nakshatra.name.hi}`,
        },
      });
    } else if (CHARA_NAK.has(nakIdx)) {
      factors.push({
        class: "soft",
        basedOn: {
          en: `Movable nakshatra (soft caution for house entry): ${panchang.nakshatra.name.en}`,
          hi: `चर नक्षत्र (गृह प्रवेश हेतु नरम सावधानी): ${panchang.nakshatra.name.hi}`,
        },
      });
    }
  }

  if (activity === "marriage_talk") {
    if (isRiktaTithi(panchang.tithi.index)) {
      // already soft from rikta; reinforce label
      factors.push({
        class: "soft",
        basedOn: {
          en: "Marriage-talk profile: Rikta tithi soft caution",
          hi: "विवाह चर्चा: रिक्त तिथि नरम सावधानी",
        },
      });
    }
    if (GOOD_CHOGHA.has(chog.name.en) && BENEFIC_HORA.has(horaName)) {
      factors.push({
        class: "support",
        basedOn: {
          en: `Benefic hora (${horaName}) with ${chog.name.en}`,
          hi: `शुभ होरा (${horaName}) + ${chog.name.hi}`,
        },
      });
    }
  }

  if (activity === "business_start") {
    if (GOOD_CHOGHA.has(chog.name.en)) {
      // already counted support for good chogha
    }
    if (horaName === "Mercury" || horaName === "Jupiter" || horaName === "Sun") {
      factors.push({
        class: "support",
        basedOn: {
          en: `Business-friendly hora: ${horaName}`,
          hi: `व्यवसाय-अनुकूल होरा: ${horaName}`,
        },
      });
    }
    if (horaName === "Saturn") {
      factors.push({
        class: "soft",
        basedOn: {
          en: "Saturn hora — soft caution for business start (not a veto)",
          hi: "शनि होरा — व्यवसाय आरंभ हेतु नरम सावधानी (वीटो नहीं)",
        },
      });
    }
  }

  if (activity === "general_shubh") {
    if (
      !isRiktaTithi(panchang.tithi.index) &&
      GOOD_CHOGHA.has(chog.name.en)
    ) {
      factors.push({
        class: "support",
        basedOn: {
          en: `Non-Rikta tithi (${panchang.tithi.name.en}) with ${chog.name.en}`,
          hi: `अ-रिक्त तिथि (${panchang.tithi.name.hi}) + ${chog.name.hi}`,
        },
      });
    }
  }

  // Generic hora soft for malefic when not already handled
  if (MALEFIC_HORA.has(horaName) && activity !== "business_start") {
    factors.push({
      class: "soft",
      basedOn: {
        en: `Malefic hora: ${horaName}`,
        hi: `पाप होरा: ${horaName}`,
      },
    });
  } else if (BENEFIC_HORA.has(horaName) && activity !== "marriage_talk") {
    factors.push({
      class: "support",
      basedOn: {
        en: `Benefic hora: ${horaName}`,
        hi: `शुभ होरा: ${horaName}`,
      },
    });
  }

  // Optional natal filter — hard avoid when transit Moon in 8th from natal Moon
  if (opts.natalFilter && opts.natalMoonSignIndex != null) {
    const tSign = moonSignAt(mid);
    const h = houseFrom(tSign, opts.natalMoonSignIndex);
    if (h === 8) {
      factors.push({
        class: "hard",
        basedOn: {
          en: `Natal filter: transit Moon in ${SIGNS[tSign].en} = 8th from natal Moon ${SIGNS[opts.natalMoonSignIndex].en}`,
          hi: `जन्म फ़िल्टर: गोचर चंद्र ${SIGNS[tSign].hi} = जन्म चंद्र ${SIGNS[opts.natalMoonSignIndex].hi} से 8वाँ`,
        },
      });
    }
  }

  return { score: aggregate(factors), factors };
}

export function normalizeActivity(raw: unknown): MuhurtaActivity {
  const s = String(raw || "general_shubh");
  if (MUHURTA_ACTIVITIES.some((a) => a.id === s)) return s as MuhurtaActivity;
  return "general_shubh";
}

export function computeMuhurtaElectional(input: {
  startDate: string;
  endDate?: string;
  place?: string;
  lat?: number;
  lon?: number;
  timeZone?: string;
  timezoneOffsetMinutes?: number;
  activity?: unknown;
  /** When true, apply natal Moon 8th filter (requires natalMoonSignIndex). */
  natalFilter?: boolean;
  natalMoonSignIndex?: number | null;
}): MuhurtaElectionalResult {
  const activity = normalizeActivity(input.activity);
  const activityMeta = MUHURTA_ACTIVITIES.find((a) => a.id === activity)!;
  const lat = Number(input.lat ?? 28.6139);
  const lon = Number(input.lon ?? 77.209);
  const timeZone = String(input.timeZone || "Asia/Kolkata");
  const offset = Number(input.timezoneOffsetMinutes ?? 330);
  const place = String(input.place || "New Delhi, India");
  const natalFilter = Boolean(input.natalFilter);
  const natalMoon =
    input.natalMoonSignIndex != null && Number.isFinite(Number(input.natalMoonSignIndex))
      ? ((Number(input.natalMoonSignIndex) % 12) + 12) % 12
      : null;

  let startDate = String(input.startDate || "").slice(0, 10);
  if (!parseYmd(startDate)) {
    startDate = new Date().toISOString().slice(0, 10);
  }
  let endDate = String(input.endDate || startDate).slice(0, 10);
  if (!parseYmd(endDate) || daysBetween(startDate, endDate) < 0) {
    endDate = startDate;
  }
  if (daysBetween(startDate, endDate) > MAX_DAYS - 1) {
    endDate = addDaysYmd(startDate, MAX_DAYS - 1);
  }

  const windows: ScoredWindow[] = [];
  const dayCount = daysBetween(startDate, endDate) + 1;

  for (let i = 0; i < dayCount; i++) {
    const ymd = addDaysYmd(startDate, i);
    const probe = noonProbe(ymd, offset);
    const m = dailyMuhuratFor(probe, timeZone, lat, lon);
    const dayWindows = m.dayChoghadiya;
    if (!dayWindows.length) continue;

    const sunriseMs = dayWindows[0].startMs;
    const sunsetMs = dayWindows[dayWindows.length - 1].endMs;
    const eighth = Math.max(sunsetMs - sunriseMs, 1) / 8;
    const weekdayEn = m.weekday.en;
    const weekdayIdx = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(weekdayEn);
    const RAHU_SLOT: Record<number, number> = {
      0: 8,
      1: 2,
      2: 7,
      3: 5,
      4: 6,
      5: 4,
      6: 3,
    };
    const slot = RAHU_SLOT[weekdayIdx >= 0 ? weekdayIdx : 1] ?? 2;
    const rahuStart = sunriseMs + (slot - 1) * eighth;
    const rahuEnd = rahuStart + eighth;

    for (const chog of dayWindows) {
      const mid = (chog.startMs + chog.endMs) / 2;
      const panchang = computePanchang(new Date(mid), {
        timezoneOffsetMinutes: offset,
      });
      const hora = horaAt(m.horas, mid);
      const { score, factors } = scoreWindow({
        activity,
        chog,
        hora,
        rahuStart,
        rahuEnd,
        panchang,
        natalFilter: natalFilter && natalMoon != null,
        natalMoonSignIndex: natalMoon,
      });

      windows.push({
        date: ymd,
        start: chog.start,
        end: chog.end,
        startMs: chog.startMs,
        endMs: chog.endMs,
        grain: "day_choghadiya",
        choghadiya: chog.name,
        hora: hora?.name ?? { en: "—", hi: "—" },
        score,
        factors,
        basedOn: {
          en: factors.map((f) => `[${f.class}] ${f.basedOn.en}`).join(" · ") || "No factors",
          hi: factors.map((f) => `[${f.class}] ${f.basedOn.hi}`).join(" · ") || "कोई कारक नहीं",
        },
        panchang: {
          tithi: panchang.tithi.name,
          nakshatra: panchang.nakshatra.name,
          yoga: panchang.yoga.name,
          karana: panchang.karana.name,
          weekday: panchang.weekday,
        },
      });
    }
  }

  const summary = {
    pass: windows.filter((w) => w.score === "pass").length,
    caution: windows.filter((w) => w.score === "caution").length,
    avoid: windows.filter((w) => w.score === "avoid").length,
  };

  const topPass = windows.filter((w) => w.score === "pass").slice(0, 12);

  return {
    activity,
    activityLabel: activityMeta.label,
    place,
    lat,
    lon,
    timeZone,
    startDate,
    endDate,
    daysScanned: dayCount,
    grain: {
      en: "Primary grain: daytime Choghadiya segments (sunrise→sunset)",
      hi: "मुख्य कण: दिन चौघड़िया खंड (सूर्योदय→सूर्यास्त)",
    },
    natalFilter: natalFilter && natalMoon != null,
    windows,
    summary,
    topPass,
    methodology: {
      en: "Composes dailyMuhuratFor + computePanchang. Hard: Rahu Kaal, Vishti. Soft: Rikta, harsh yoga, Rog/Udveg/Kaal, malefic hora. Support: Amrit/Shubh/Labh, supportive yoga/nakshatra/hora. Aggregate: hard→avoid; soft without support→caution; support≥soft→pass. Cap 14 days. No luck %.",
      hi: "dailyMuhuratFor + computePanchang। कठोर: राहु काल, विष्टि। नरम: रिक्त, कठोर योग, रोग/उद्वेग/काल, पाप होरा। सहायक: अमृत/शुभ/लाभ आदि। अधिकतम 14 दिन। भाग्य-% नहीं।",
    },
    disclaimer: {
      en: "Muhurta improves traditional timing odds — not guaranteed outcomes. Not medical procedure clearance.",
      hi: "मुहूर्त पारंपरिक समय-संभावना सुधारता है — परिणाम की गारंटी नहीं। चिकित्सकीय प्रक्रिया स्वीकृति नहीं।",
    },
  };
}
