/**
 * Vastu scoring + Dosha flags + optional Astro-Vastu personalization.
 */

import { computeKundli } from "@/lib/astrology/compute";
import type { BirthInput } from "@/lib/astrology/types";
import {
  DIRECTIONS,
  PLACEMENT_RULES,
  directionMeta,
  remedyFor,
  ruleFor,
  type Loc,
  type VastuDirection,
  type VastuRoom,
} from "./rules";

export type RoomPlacement = {
  room: VastuRoom;
  direction: VastuDirection;
};

export type ZoneFinding = {
  room: VastuRoom;
  roomLabel: Loc;
  direction: VastuDirection;
  directionLabel: Loc;
  status: "ideal" | "acceptable" | "dosha";
  weight: number;
  scoreContribution: number;
  explanation: Loc;
  remedy: Loc;
  note: Loc;
};

export type VastuScoreResult = {
  overall: number;
  findings: ZoneFinding[];
  idealCount: number;
  doshaCount: number;
  summary: Loc;
  northConfirmed: boolean;
};

const SIGN_ELEMENT: { en: string; hi: string; element: "fire" | "earth" | "air" | "water" }[] = [
  { en: "Aries", hi: "मेष", element: "fire" },
  { en: "Taurus", hi: "वृषभ", element: "earth" },
  { en: "Gemini", hi: "मिथुन", element: "air" },
  { en: "Cancer", hi: "कर्क", element: "water" },
  { en: "Leo", hi: "सिंह", element: "fire" },
  { en: "Virgo", hi: "कन्या", element: "earth" },
  { en: "Libra", hi: "तुला", element: "air" },
  { en: "Scorpio", hi: "वृश्चिक", element: "water" },
  { en: "Sagittarius", hi: "धनु", element: "fire" },
  { en: "Capricorn", hi: "मकर", element: "earth" },
  { en: "Aquarius", hi: "कुंभ", element: "air" },
  { en: "Pisces", hi: "मीन", element: "water" },
];

const ELEMENT_LOC: Record<"fire" | "earth" | "air" | "water", Loc> = {
  fire: { en: "Fire", hi: "अग्नि" },
  earth: { en: "Earth", hi: "पृथ्वी" },
  air: { en: "Air", hi: "वायु" },
  water: { en: "Water", hi: "जल" },
};

/** Sleep / study facing hints by Lagna element. */
const ELEMENT_FACING: Record<
  "fire" | "earth" | "air" | "water",
  { sleep: Loc; study: Loc; zoneFocus: Loc }
> = {
  fire: {
    sleep: {
      en: "Prefer head toward East or South; keep South-East kitchen Agni orderly for fire-Lagna natives.",
      hi: "सिर पूर्व या दक्षिण; अग्नि लग्न हेतु दक्षिण-पूर्व रसोई व्यवस्थित रखें।",
    },
    study: {
      en: "Study facing East supports solar/fire Lagna vitality and focus.",
      hi: "पूर्व मुख अध्ययन अग्नि लग्न की ऊर्जा व एकाग्रता सहारा देता है।",
    },
    zoneFocus: {
      en: "Prioritise South-East (Agni) and East corrections for this chart.",
      hi: "इस कुंडली हेतु दक्षिण-पूर्व (अग्नि) और पूर्व सुधार प्राथमिकता।",
    },
  },
  earth: {
    sleep: {
      en: "South-West master rest suits earth Lagna; keep that corner stable and clutter-light.",
      hi: "पृथ्वी लग्न हेतु दक्षिण-पश्चिम विश्राम अनुकूल; वह कोना स्थिर व अव्यवस्था-रहित।",
    },
    study: {
      en: "West-facing study desks often feel grounding for earth Lagna.",
      hi: "पश्चिम मुख डेस्क पृथ्वी लग्न हेतु स्थिरता देती है।",
    },
    zoneFocus: {
      en: "Prioritise South-West stability and avoid loading the North-East.",
      hi: "दक्षिण-पश्चिम स्थिरता प्राथमिकता; ईशान पर भार न डालें।",
    },
  },
  air: {
    sleep: {
      en: "Air Lagna benefits from ventilated North-West guest/children zones kept light and moving.",
      hi: "वायु लग्न हेतु उत्तर-पश्चिम अतिथि/बाल कक्ष हवादार व हल्के रखें।",
    },
    study: {
      en: "North-facing study supports air-element mental agility.",
      hi: "उत्तर मुख अध्ययन वायु तत्व की मानसिक चुस्ती सहारा देता है।",
    },
    zoneFocus: {
      en: "Prioritise North-West air flow and North career/openness themes.",
      hi: "उत्तर-पश्चिम वायु प्रवाह और उत्तर करियर/खुलापन प्राथमिकता।",
    },
  },
  water: {
    sleep: {
      en: "Keep North-East calm and sacred; water Lagna thrives when Ishaan stays clean and quiet.",
      hi: "ईशान शांत व पवित्र रखें; जल लग्न तब फलता है जब ईशान साफ-सुथरा हो।",
    },
    study: {
      en: "North or East study facing helps water Lagna absorb and retain learning.",
      hi: "उत्तर या पूर्व मुख अध्ययन जल लग्न को सीखने में अवशोषण व धारण में मदद।",
    },
    zoneFocus: {
      en: "Prioritise North-East purity and water placements; avoid NE toilets/kitchens.",
      hi: "ईशान शुद्धता व जल स्थान प्राथमिकता; ईशान शौचालय/रसोई से बचें।",
    },
  },
};

const DASHA_ZONE_HINT: Record<string, Loc> = {
  sun: {
    en: "Sun dasha — emphasise East entrance light, clarity and leadership zones.",
    hi: "सूर्य दशा — पूर्व द्वार प्रकाश, स्पष्टता और नेतृत्व क्षेत्र पर बल।",
  },
  moon: {
    en: "Moon dasha — keep North-West and water areas calm; emotional comfort at home.",
    hi: "चंद्र दशा — उत्तर-पश्चिम व जल क्षेत्र शांत; घर में भावनात्मक आराम।",
  },
  mars: {
    en: "Mars dasha — order the South-East kitchen fire carefully; avoid anger clutter near stove.",
    hi: "मंगल दशा — दक्षिण-पूर्व रसोई अग्नि सावधानी से; चूल्हे पास क्रोध अव्यवस्था न रखें।",
  },
  mercury: {
    en: "Mercury dasha — tidy the study (West/North) for learning, docs and communication.",
    hi: "बुध दशा — अध्ययन (पश्चिम/उत्तर) सीखने, दस्तावेज़ व संवाद हेतु व्यवस्थित।",
  },
  jupiter: {
    en: "Jupiter dasha — strengthen pooja/North-East and keep Brahmasthan open for wisdom flow.",
    hi: "गुरु दशा — पूजा/ईशान मजबूत करें; ज्ञान प्रवाह हेतु ब्रह्मस्थान खुला।",
  },
  venus: {
    en: "Venus dasha — beautify living/dining harmony; soft colours, pleasant scent, ordered SW rest.",
    hi: "शुक्र दशा — बैठक/भोजन सामंजस्य; नरम रंग, सुगंध, व्यवस्थित दक्षिण-पश्चिम विश्राम।",
  },
  saturn: {
    en: "Saturn dasha — stabilise South-West, clear storage debt, patient non-structural fixes first.",
    hi: "शनि दशा — दक्षिण-पश्चिम स्थिर; भंडारण ऋण साफ; पहले धैर्यपूर्ण गैर-संरचनात्मक सुधार।",
  },
  rahu: {
    en: "Rahu dasha — avoid overloading SW with chaos; conscious order beats exotic “quick fixes”.",
    hi: "राहु दशा — दक्षिण-पश्चिम में अराजकता का भार न डालें; सचेत व्यवस्था विचित्र त्वरित उपायों से बेहतर।",
  },
  ketu: {
    en: "Ketu dasha — simplify sacred NE and center; less clutter, more silence.",
    hi: "केतु दशा — पवित्र ईशान व केंद्र सरल; कम अव्यवस्था, अधिक मौन।",
  },
};

function classify(
  room: VastuRoom,
  direction: VastuDirection
): "ideal" | "acceptable" | "dosha" {
  const rule = ruleFor(room);
  if (rule.ideal.includes(direction)) return "ideal";
  if (rule.avoid.includes(direction)) return "dosha";
  return "acceptable";
}

function pointsFor(status: "ideal" | "acceptable" | "dosha") {
  if (status === "ideal") return 100;
  if (status === "acceptable") return 62;
  return 22;
}

export function scoreVastuPlan(
  placements: RoomPlacement[],
  opts?: { northConfirmed?: boolean }
): VastuScoreResult {
  const northConfirmed = opts?.northConfirmed ?? false;
  const findings: ZoneFinding[] = [];
  let weighted = 0;
  let weightSum = 0;

  for (const p of placements) {
    const rule = ruleFor(p.room);
    const status = classify(p.room, p.direction);
    const pts = pointsFor(status);
    const contrib = pts * rule.weight;
    weighted += contrib;
    weightSum += rule.weight * 100;

    const dir = directionMeta(p.direction);
    const explanation: Loc =
      status === "ideal"
        ? {
            en: `${rule.label.en} in ${dir.label.en} matches classical Vastu (ideal).`,
            hi: `${rule.label.hi} का ${dir.label.hi} में स्थान शास्त्रीय वास्तु से मेल खाता है (आदर्श)।`,
          }
        : status === "dosha"
          ? {
              en: `${rule.label.en} in ${dir.label.en} is flagged as a Vastu Dosha against classical placement rules.`,
              hi: `${rule.label.hi} का ${dir.label.hi} में स्थान शास्त्रीय नियमों के विरुद्ध वास्तु दोष चिह्नित है।`,
            }
          : {
              en: `${rule.label.en} in ${dir.label.en} is workable but not the classical ideal.`,
              hi: `${rule.label.hi} का ${dir.label.hi} में स्थान कामचलाऊ है, शास्त्रीय आदर्श नहीं।`,
            };

    findings.push({
      room: p.room,
      roomLabel: rule.label,
      direction: p.direction,
      directionLabel: dir.label,
      status,
      weight: rule.weight,
      scoreContribution: Math.round(pts),
      explanation,
      remedy: remedyFor(p.room, p.direction),
      note: rule.note,
    });
  }

  const overall =
    weightSum > 0 ? Math.round(Math.min(100, Math.max(0, (weighted / weightSum) * 100))) : 0;
  const idealCount = findings.filter((f) => f.status === "ideal").length;
  const doshaCount = findings.filter((f) => f.status === "dosha").length;

  const summary: Loc = {
    en:
      findings.length === 0
        ? "Add room placements to see your Vastu score and zone-by-zone findings."
        : `Overall Vastu score ${overall}/100 from ${findings.length} zone(s): ${idealCount} ideal, ${doshaCount} Dosha flag(s). Score summarises the list below — read each zone for remedies.`,
    hi:
      findings.length === 0
        ? "वास्तु स्कोर और क्षेत्र-वार निष्कर्ष देखने हेतु कक्ष स्थान जोड़ें।"
        : `कुल वास्तु स्कोर ${overall}/100 — ${findings.length} क्षेत्र: ${idealCount} आदर्श, ${doshaCount} दोष। स्कोर नीचे की सूची का सार है — प्रत्येक क्षेत्र के उपाय पढ़ें।`,
  };

  return {
    overall,
    findings,
    idealCount,
    doshaCount,
    summary,
    northConfirmed,
  };
}

export type AstroVastuInsight = {
  lagnaSign: Loc;
  lagnaElement: Loc;
  elementId: "fire" | "earth" | "air" | "water";
  sleepHint: Loc;
  studyHint: Loc;
  zoneFocus: Loc;
  currentDasha?: { planet: Loc; hint: Loc };
};

export function buildAstroVastuInsight(input: BirthInput): AstroVastuInsight | null {
  try {
    const k = computeKundli(input);
    const sign = SIGN_ELEMENT[k.lagna.signIndex];
    if (!sign) return null;
    const facing = ELEMENT_FACING[sign.element];
    const current = k.dasha?.currentMaha;
    const planetEn = current?.planet.en?.toLowerCase() ?? "";
    const planetKey = planetEn.includes("sun")
      ? "sun"
      : planetEn.includes("moon")
        ? "moon"
        : planetEn.includes("mars")
          ? "mars"
          : planetEn.includes("mercury")
            ? "mercury"
            : planetEn.includes("jupiter")
              ? "jupiter"
              : planetEn.includes("venus")
                ? "venus"
                : planetEn.includes("saturn")
                  ? "saturn"
                  : planetEn.includes("rahu")
                    ? "rahu"
                    : planetEn.includes("ketu")
                      ? "ketu"
                      : "";

    return {
      lagnaSign: { en: sign.en, hi: sign.hi },
      lagnaElement: ELEMENT_LOC[sign.element],
      elementId: sign.element,
      sleepHint: facing.sleep,
      studyHint: facing.study,
      zoneFocus: facing.zoneFocus,
      currentDasha:
        current && planetKey
          ? {
              planet: current.planet,
              hint: DASHA_ZONE_HINT[planetKey] ?? {
                en: `Current Mahadasha: ${current.planet.en} — keep remedies gentle and zone-specific.`,
                hi: `वर्तमान महादशा: ${current.planet.hi} — उपाय हल्के और क्षेत्र-विशिष्ट रखें।`,
              },
            }
          : current
            ? {
                planet: current.planet,
                hint: {
                  en: `Current Mahadasha: ${current.planet.en} — keep remedies gentle and zone-specific.`,
                  hi: `वर्तमान महादशा: ${current.planet.hi} — उपाय हल्के और क्षेत्र-विशिष्ट रखें।`,
                },
              }
            : undefined,
    };
  } catch {
    return null;
  }
}

export { DIRECTIONS, PLACEMENT_RULES };
