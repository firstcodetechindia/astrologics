/**
 * Prashna (horary) Kundli — question-time chart + significators.
 * Follows `.cursor/skills/prashna-kundli/SKILL.md` (approved Phase 4).
 */
import { computeKundli } from "../compute";
import { PLANET_META } from "../constants";
import type { BirthInput, KundliResult, PlanetPosition } from "../types";

export type Loc = { en: string; hi: string };

export type PrashnaTopic =
  | "self_health"
  | "money_job"
  | "property_vehicle"
  | "children_education"
  | "marriage_partner"
  | "travel_foreign"
  | "litigation_debt"
  | "spiritual";

export const PRASHNA_TOPICS: {
  id: PrashnaTopic;
  label: Loc;
  houses: number[];
  notes: Loc;
}[] = [
  {
    id: "self_health",
    label: { en: "Self / health", hi: "स्वयं / स्वास्थ्य" },
    houses: [1, 6],
    notes: {
      en: "6th also covers disease and enemies — not a medical diagnosis.",
      hi: "छठा भाव रोग/शत्रु भी — चिकित्सकीय निदान नहीं।",
    },
  },
  {
    id: "money_job",
    label: { en: "Money / job", hi: "धन / नौकरी" },
    houses: [2, 10, 11],
    notes: { en: "Wealth, career, gains.", hi: "धन, करियर, लाभ।" },
  },
  {
    id: "property_vehicle",
    label: { en: "Property / vehicle", hi: "संपत्ति / वाहन" },
    houses: [4],
    notes: { en: "Home and conveyances.", hi: "घर और वाहन।" },
  },
  {
    id: "children_education",
    label: { en: "Children / education", hi: "संतान / शिक्षा" },
    houses: [5],
    notes: { en: "Progeny and learning.", hi: "संतान और विद्या।" },
  },
  {
    id: "marriage_partner",
    label: { en: "Marriage / partner", hi: "विवाह / साथी" },
    houses: [7],
    notes: { en: "Partnership and marriage.", hi: "साझेदारी और विवाह।" },
  },
  {
    id: "travel_foreign",
    label: { en: "Travel / foreign", hi: "यात्रा / विदेश" },
    houses: [9, 12],
    notes: { en: "Long travel and foreign links.", hi: "दीर्घ यात्रा और विदेश।" },
  },
  {
    id: "litigation_debt",
    label: { en: "Litigation / debt", hi: "मुकदमा / ऋण" },
    houses: [6, 8],
    notes: {
      en: "Not a legal win/lose verdict — lean only.",
      hi: "कानूनी जीत/हार का फैसला नहीं — केवल झुकाव।",
    },
  },
  {
    id: "spiritual",
    label: { en: "Spiritual", hi: "आध्यात्मिक" },
    houses: [9, 12],
    notes: { en: "Dharma and detachment themes.", hi: "धर्म और वैराग्य।" },
  },
];

const LORD_NAME_TO_ID: Record<string, string> = {
  Sun: "sun",
  Moon: "moon",
  Mars: "mars",
  Mercury: "mercury",
  Jupiter: "jupiter",
  Venus: "venus",
  Saturn: "saturn",
};

const MALEFICS = new Set(["saturn", "rahu", "ketu", "mars"]);
const KENDRA = new Set([1, 4, 7, 10]);
const TRIKONA = new Set([1, 5, 9]);
const DUSTHANA = new Set([6, 8, 12]);

/** Same house or 1/7 opposition between two house numbers. */
function isConjunctOrOpposite(h1: number, h2: number): boolean {
  if (h1 === h2) return true;
  return ((h1 - h2 + 12) % 12) === 6;
}

function planetByLordName(
  planets: PlanetPosition[],
  lordEn: string
): PlanetPosition | undefined {
  const id = LORD_NAME_TO_ID[lordEn];
  return id ? planets.find((p) => p.id === id) : undefined;
}

export type SignificatorFact = {
  house: number;
  sign: Loc;
  lord: Loc;
  lordId: string;
  lordHouse: number;
  occupants: Loc[];
  basedOn: Loc;
};

export type LeanKind = "strong_yes" | "caution" | "insufficient";

export type LeanFlag = {
  kind: LeanKind;
  label: Loc;
  basedOn: Loc;
};

export type PrashnaResult = {
  chartType: "prashna";
  topic: PrashnaTopic;
  topicLabel: Loc;
  askedAt: { date: string; time: string; place: string };
  lagna: KundliResult["lagna"];
  moonRashi: KundliResult["moonRashi"];
  nakshatra: KundliResult["nakshatra"];
  significatorHouses: number[];
  significators: SignificatorFact[];
  lean: LeanFlag;
  timingHint: {
    maha: Loc;
    antar: Loc;
    window: { start: string; end: string };
    basedOn: Loc;
  };
  planets: PlanetPosition[];
  houses: KundliResult["houses"];
  settings: KundliResult["settings"];
  ethics: Loc;
  methodology: Loc;
  disclaimer: Loc;
};

function evaluateLordLean(
  lord: PlanetPosition,
  malefics: PlanetPosition[]
): { strong: boolean; caution: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const inKendraTrikona =
    KENDRA.has(lord.house) || TRIKONA.has(lord.house);
  const inDusthana = DUSTHANA.has(lord.house);
  const combust = lord.isCombust === true;

  const afflicted = malefics.some((m) => {
    if (m.id === lord.id) return false;
    return isConjunctOrOpposite(m.house, lord.house);
  });

  if (inDusthana) reasons.push(`lord in dusthana H${lord.house}`);
  if (combust) reasons.push("lord combust");
  if (afflicted) {
    const who = malefics
      .filter((m) => m.id !== lord.id && isConjunctOrOpposite(m.house, lord.house))
      .map((m) => `${m.name.en}@H${m.house}`)
      .join(", ");
    reasons.push(`malefic contact (${who})`);
  }

  const caution = inDusthana || combust || afflicted;
  const strong = inKendraTrikona && !caution;
  if (strong) {
    reasons.push(`lord in kendra/trikona H${lord.house}, unafflicted`);
  } else if (!caution && !inKendraTrikona) {
    reasons.push(`lord in H${lord.house} — neither strong nor caution screen`);
  }

  return { strong, caution, reasons };
}

export function normalizePrashnaTopic(raw: unknown): PrashnaTopic {
  const s = String(raw || "money_job");
  if (PRASHNA_TOPICS.some((t) => t.id === s)) return s as PrashnaTopic;
  return "money_job";
}

/**
 * Cast Prashna at question instant/place; topic drives significator houses.
 * Optional birth chart comparison is out of band — not mixed into math here.
 */
export function computePrashna(
  input: BirthInput,
  topicRaw: unknown = "money_job"
): PrashnaResult {
  const topic = normalizePrashnaTopic(topicRaw);
  const topicMeta = PRASHNA_TOPICS.find((t) => t.id === topic)!;

  const chart = computeKundli({
    ...input,
    name: input.name?.trim() || "Querent",
  });

  const malefics = chart.planets.filter((p) => MALEFICS.has(p.id));

  const significators: SignificatorFact[] = topicMeta.houses.map((house) => {
    const hInfo = chart.houses[house - 1];
    const lordEn = hInfo.lord.en;
    const lordId = LORD_NAME_TO_ID[lordEn] ?? lordEn.toLowerCase();
    const lordPlanet = planetByLordName(chart.planets, lordEn);
    const occupants = chart.planets
      .filter((p) => p.house === house)
      .map((p) => p.name);

    return {
      house,
      sign: hInfo.sign,
      lord: hInfo.lord,
      lordId,
      lordHouse: lordPlanet?.house ?? 0,
      occupants,
      basedOn: {
        en: `H${house} = ${hInfo.sign.en}; lord ${lordEn} in H${lordPlanet?.house ?? "—"}; occupants: ${
          occupants.map((o) => o.en).join(", ") || "none"
        }`,
        hi: `भाव ${house} = ${hInfo.sign.hi}; स्वामी ${hInfo.lord.hi} भाव ${lordPlanet?.house ?? "—"} में; ग्रह: ${
          occupants.map((o) => o.hi).join(", ") || "कोई नहीं"
        }`,
      },
    };
  });

  const lordEvals = topicMeta.houses.map((house) => {
    const hInfo = chart.houses[house - 1];
    const lord = planetByLordName(chart.planets, hInfo.lord.en);
    if (!lord) {
      return {
        strong: false,
        caution: false,
        reasons: [`missing lord planet for H${house}`],
      };
    }
    return evaluateLordLean(lord, malefics);
  });

  const anyCaution = lordEvals.some((e) => e.caution);
  const anyStrong = lordEvals.some((e) => e.strong);
  const allReasons = lordEvals.flatMap((e) => e.reasons);

  let lean: LeanFlag;
  if (anyCaution) {
    lean = {
      kind: "caution",
      label: {
        en: "Caution lean",
        hi: "सावधानी झुकाव",
      },
      basedOn: {
        en: allReasons.join("; "),
        hi: allReasons.join("; "),
      },
    };
  } else if (anyStrong) {
    lean = {
      kind: "strong_yes",
      label: {
        en: "Strong yes lean",
        hi: "सकारात्मक झुकाव",
      },
      basedOn: {
        en: allReasons.join("; "),
        hi: allReasons.join("; "),
      },
    };
  } else {
    lean = {
      kind: "insufficient",
      label: {
        en: "Insufficient clarity",
        hi: "अपर्याप्त स्पष्टता",
      },
      basedOn: {
        en: allReasons.join("; ") || "No strong or caution screen fired",
        hi: allReasons.join("; ") || "न तो सशक्त न सावधानी स्क्रीन",
      },
    };
  }

  const maha = chart.dasha.currentMaha;
  const antar = chart.dasha.currentAntar;

  const ethicsExtra =
    topic === "self_health" || topic === "litigation_debt"
      ? {
          en: " This tool does not diagnose illness or decide legal outcomes.",
          hi: " यह उपकरण रोग निदान या कानूनी परिणाम नहीं तय करता।",
        }
      : { en: "", hi: "" };

  return {
    chartType: "prashna",
    topic,
    topicLabel: topicMeta.label,
    askedAt: {
      date: input.date,
      time: input.time,
      place: input.place,
    },
    lagna: chart.lagna,
    moonRashi: chart.moonRashi,
    nakshatra: chart.nakshatra,
    significatorHouses: [...topicMeta.houses],
    significators,
    lean,
    timingHint: {
      maha: maha.planet,
      antar: antar.planet,
      window: { start: maha.start, end: maha.end },
      basedOn: {
        en: `Vimshottari from Prashna Moon nakshatra (${chart.nakshatra.name.en}): ${maha.planet.en}/${antar.planet.en} ${maha.start}→${maha.end} — timing hint only`,
        hi: `प्रश्न चंद्र नक्षत्र (${chart.nakshatra.name.hi}) से विंशोत्तरी: ${maha.planet.hi}/${antar.planet.hi} ${maha.start}→${maha.end} — केवल समय संकेत`,
      },
    },
    planets: chart.planets,
    houses: chart.houses,
    settings: chart.settings,
    ethics: {
      en: `Prashna reads this moment’s sky for the question — not a fate rewrite.${ethicsExtra.en}`,
      hi: `प्रश्न इस क्षण के आकाश को पढ़ता है — भाग्य पुनर्लेखन नहीं।${ethicsExtra.hi}`,
    },
    methodology: {
      en: "Lahiri sidereal whole-sign Prashna Lagna; topic→house map; lean/caution screens with basedOn; no %-odds.",
      hi: "लाहिरी सायन पूर्ण-राशि प्रश्न लग्न; विषय→भाव मानचित्र; झुकाव/सावधानी basedOn सहित; %-संभावना नहीं।",
    },
    disclaimer: {
      en: "Lean / caution / insufficient only — not guarantees. Prefer birth kundli + dasha for life decisions.",
      hi: "केवल झुकाव / सावधानी / अपर्याप्त — गारंटी नहीं। जीवन निर्णयों हेतु जन्म कुंडली + दशा प्राथमिक।",
    },
  };
}

/** Topic options for UI selects. */
export function prashnaTopicOptions(): {
  id: PrashnaTopic;
  label: Loc;
}[] {
  return PRASHNA_TOPICS.map((t) => ({ id: t.id, label: t.label }));
}

/** Resolve planet display from id (tests / UI). */
export function planetLabel(id: string): Loc {
  return PLANET_META[id] ?? { en: id, hi: id };
}
