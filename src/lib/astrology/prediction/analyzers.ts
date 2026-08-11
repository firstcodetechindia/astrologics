/**
 * Multi-factor topic analyzers.
 * Consume kundliResult only — never recalculate planets/lagna/dasha.
 */
import type { KundliResult } from "../types";
import {
  aspectsOnHouse,
  d10Lagna,
  d10PlanetSign,
  d9Lagna,
  d9PlanetSign,
  dashaActivates,
  dashaActivatesHouse,
  dashaPlanetIds,
  dashaTimingWindow,
  dignityStrength,
  dusthana,
  factor,
  finalizeTopic,
  houseLord,
  kendra,
  occupants,
  planetById,
  transitOnHouse,
  yogasForTopic,
} from "./helpers";
import type { PredictionFactor, TopicPrediction } from "./types";

function lordFactors(
  k: KundliResult,
  house: number,
  roleEn: string,
  roleHi: string
): PredictionFactor[] {
  const lord = houseLord(k, house);
  if (!lord) return [];
  const dig = dignityStrength(lord);
  const out: PredictionFactor[] = [
    factor({
      category: "lord",
      type: dig.polarity === "neutral" ? "supporting" : dig.polarity,
      strength: dig.strength,
      label: {
        en: `${roleEn} (${lord.name.en}) dignity`,
        hi: `${roleHi} (${lord.name.hi}) बल`,
      },
      detail: {
        en: `${lord.name.en} rules house ${house}, sits in house ${lord.house} / ${lord.sign.en}. ${dig.note.en}`,
        hi: `${lord.name.hi} भाव ${house} का स्वामी, भाव ${lord.house} / ${lord.sign.hi} में। ${dig.note.hi}`,
      },
    }),
  ];
  if (dusthana(lord.house)) {
    out.push(
      factor({
        category: "lord",
        type: "challenging",
        strength: "moderate",
        label: {
          en: `${roleEn} in dusthana`,
          hi: `${roleHi} दुस्थान में`,
        },
        detail: {
          en: `${lord.name.en} in house ${lord.house} can add friction or hidden effort to ${roleEn.toLowerCase()} themes.`,
          hi: `${lord.name.hi} भाव ${lord.house} में — ${roleHi} विषयों में अतिरिक्त प्रयास/बाधा संभव।`,
        },
      })
    );
  }
  if (kendra(lord.house) || [5, 9].includes(lord.house)) {
    out.push(
      factor({
        category: "lord",
        type: "supporting",
        strength: "moderate",
        label: {
          en: `${roleEn} well-placed by house`,
          hi: `${roleHi} भाव स्थान अनुकूल`,
        },
        detail: {
          en: `${lord.name.en} in house ${lord.house} is a classical support for ${roleEn.toLowerCase()}.`,
          hi: `${lord.name.hi} भाव ${lord.house} में — ${roleHi} के लिए शास्त्रीय समर्थन।`,
        },
      })
    );
  }
  if (lord.isCombust) {
    out.push(
      factor({
        category: "planet",
        type: "challenging",
        strength: "moderate",
        label: {
          en: `${roleEn} combust`,
          hi: `${roleHi} अस्त`,
        },
        detail: {
          en: `Combustion can weaken clear expression of ${roleEn.toLowerCase()} significations.`,
          hi: `अस्त होने पर ${roleHi} संकेत धुँधले पड़ सकते हैं।`,
        },
      })
    );
  }
  return out;
}

function houseOccFactors(
  k: KundliResult,
  house: number,
  roleEn: string
): PredictionFactor[] {
  return occupants(k, house).map((p) => {
    const dig = dignityStrength(p);
    const malefic = ["saturn", "mars", "rahu", "ketu"].includes(p.id);
    return factor({
      category: "house",
      type: malefic && dig.polarity !== "supporting" ? "challenging" : "supporting",
      strength: "moderate",
      label: {
        en: `${p.name.en} in ${roleEn} house`,
        hi: `${roleEn} भाव में ${p.name.hi}`,
      },
      detail: {
        en: `${p.name.en} occupies house ${house} (${p.sign.en})${p.isRetrograde ? " R" : ""}. ${dig.note.en}`,
        hi: `${p.name.hi} भाव ${house} (${p.sign.hi}) में${p.isRetrograde ? " R" : ""}। ${dig.note.hi}`,
      },
    });
  });
}

function planetRole(
  k: KundliResult,
  id: string,
  roleEn: string,
  roleHi: string
): PredictionFactor[] {
  const p = planetById(k)[id];
  if (!p) return [];
  const dig = dignityStrength(p);
  return [
    factor({
      category: "planet",
      type: dig.polarity === "neutral" ? "supporting" : dig.polarity,
      strength: dig.strength,
      label: { en: `${roleEn} (${p.name.en})`, hi: `${roleHi} (${p.name.hi})` },
      detail: {
        en: `${p.name.en} in house ${p.house} / ${p.sign.en}. ${dig.note.en}`,
        hi: `${p.name.hi} भाव ${p.house} / ${p.sign.hi}। ${dig.note.hi}`,
      },
    }),
  ];
}

function dashaForLords(
  k: KundliResult,
  planetIds: string[],
  topicEn: string
): PredictionFactor[] {
  const out: PredictionFactor[] = [];
  for (const id of planetIds) {
    const act = dashaActivates(k, id);
    if (!act) continue;
    const p = planetById(k)[id];
    out.push(
      factor({
        category: "dasha",
        type: "supporting",
        strength: act,
        label: {
          en: `Current dasha activates ${p?.name.en || id}`,
          hi: `वर्तमान दशा ${p?.name.hi || id} को सक्रिय करती है`,
        },
        detail: {
          en: `Running periods highlight ${topicEn} themes linked to ${p?.name.en || id} (house ${p?.house ?? "—"}).`,
          hi: `चल रही दशा ${topicEn} विषयों को ${p?.name.hi || id} से जोड़ती है (भाव ${p?.house ?? "—"})।`,
        },
      })
    );
  }
  return out;
}

export function analyzeCareer(k: KundliResult): TopicPrediction {
  const h10 = houseLord(k, 10);
  const factors = {
    natalFactors: [
      factor({
        category: "natal",
        type: "neutral",
        strength: "moderate",
        label: { en: "Lagna context", hi: "लग्न संदर्भ" },
        detail: {
          en: `Ascendant ${k.lagna.sign.en} sets the whole-sign 10th as ${k.houses[9]?.sign.en}.`,
          hi: `लग्न ${k.lagna.sign.hi} — दशम राशि ${k.houses[9]?.sign.hi}।`,
        },
      }),
    ] as PredictionFactor[],
    houseFactors: houseOccFactors(k, 10, "10th"),
    lordFactors: [
      ...lordFactors(k, 10, "10th lord", "दशमेश"),
      ...lordFactors(k, 6, "6th lord", "षष्ठेश"),
      ...lordFactors(k, 2, "2nd lord", "द्वितीयेश"),
      ...lordFactors(k, 11, "11th lord", "एकादशेश"),
    ],
    planetFactors: [
      ...planetRole(k, "sun", "Career karaka Sun", "करियर कारक सूर्य"),
      ...planetRole(k, "saturn", "Karma karaka Saturn", "कर्म कारक शनि"),
      ...planetRole(k, "mercury", "Skills Mercury", "कौशल बुध"),
      ...planetRole(k, "jupiter", "Growth Jupiter", "विकास गुरु"),
    ],
    aspectFactors: aspectsOnHouse(k, 10),
    yogaFactors: yogasForTopic(k, [
      "dharma-karmadhipati",
      "raja",
      "ruchaka",
      "bhadra",
      "hamsa",
      "malavya",
      "sasa",
      "vipreet",
    ]),
    dashaFactors: [
      ...(dashaActivatesHouse(k, 10)
        ? [dashaActivatesHouse(k, 10)!]
        : []),
      ...dashaForLords(
        k,
        [h10?.id, "sun", "saturn", "mercury", "jupiter"].filter(Boolean) as string[],
        "career"
      ),
    ],
    transitFactors: [
      ...transitOnHouse(k, 10, ["jupiter", "saturn", "sun", "mars"]),
      ...transitOnHouse(k, 6, ["saturn", "mars"]),
    ],
    divisionalFactors: [] as PredictionFactor[],
  };

  const d10Lag = d10Lagna(k);
  if (d10Lag) {
    factors.divisionalFactors.push(
      factor({
        category: "divisional",
        type: "supporting",
        strength: "moderate",
        label: { en: "D10 lagna theme", hi: "D10 लग्न विषय" },
        detail: {
          en: `Dashamsa (D10) lagna ${d10Lag} — used with D1, not alone, for professional direction.`,
          hi: `दशमांश (D10) लग्न ${d10Lag} — करियर दिशा के लिए D1 के साथ, अकेले नहीं।`,
        },
      })
    );
  }
  if (h10) {
    const d10s = d10PlanetSign(k, h10.id);
    if (d10s) {
      factors.divisionalFactors.push(
        factor({
          category: "divisional",
          type: "supporting",
          strength: "moderate",
          label: { en: "10th lord in D10", hi: "D10 में दशमेश" },
          detail: {
            en: `10th lord ${h10.name.en} maps to ${d10s} in D10 — refine profession tone with D1 placement (H${h10.house}).`,
            hi: `दशमेश ${h10.name.hi} D10 में ${d10s} — D1 भाव ${h10.house} के साथ पेशेवर स्वर देखें।`,
          },
        })
      );
    }
  }

  const timing = dashaTimingWindow(
    k,
    "career",
    {
      en: "Current antardasha career window",
      hi: "वर्तमान अंतर्दशा करियर खिड़की",
    },
    [h10?.id, "sun", "saturn", "mercury", "jupiter"].filter(Boolean) as string[],
    ["rahu", "ketu"]
  );

  const themes = [
    { en: "Career growth & recognition", hi: "करियर विकास व पहचान" },
    { en: "Work pressure & competition", hi: "कार्य दबाव व प्रतिस्पर्धा" },
    { en: "Skill development", hi: "कौशल विकास" },
    { en: "Authority & responsibility", hi: "अधिकार व जिम्मेदारी" },
  ];

  return finalizeTopic({
    topic: "career",
    title: { en: "Career & Profession", hi: "करियर और पेशा" },
    themes,
    ...factors,
    timingWindows: timing ? [timing] : [],
  });
}

export function analyzeBusiness(k: KundliResult): TopicPrediction {
  const h7 = houseLord(k, 7);
  const h10 = houseLord(k, 10);
  return finalizeTopic({
    topic: "business",
    title: { en: "Business & Enterprise", hi: "व्यवसाय और उद्यम" },
    themes: [
      { en: "Partnership vs solo enterprise", hi: "साझेदारी बनाम एकल उद्यम" },
      { en: "Client/market dealing", hi: "ग्राहक/बाजार व्यवहार" },
      { en: "Cashflow & gains", hi: "नकदी प्रवाह व लाभ" },
    ],
    natalFactors: [],
    houseFactors: [
      ...houseOccFactors(k, 7, "7th"),
      ...houseOccFactors(k, 10, "10th"),
      ...houseOccFactors(k, 11, "11th"),
    ],
    lordFactors: [
      ...lordFactors(k, 7, "7th lord", "सप्तमेश"),
      ...lordFactors(k, 10, "10th lord", "दशमेश"),
      ...lordFactors(k, 2, "2nd lord", "द्वितीयेश"),
      ...lordFactors(k, 11, "11th lord", "एकादशेश"),
    ],
    planetFactors: [
      ...planetRole(k, "mercury", "Commerce Mercury", "वाणिज्य बुध"),
      ...planetRole(k, "jupiter", "Expansion Jupiter", "विस्तार गुरु"),
      ...planetRole(k, "venus", "Value Venus", "मूल्य शुक्र"),
      ...planetRole(k, "mars", "Drive Mars", "ऊर्जा मंगल"),
    ],
    aspectFactors: [...aspectsOnHouse(k, 7), ...aspectsOnHouse(k, 10)],
    yogaFactors: yogasForTopic(k, ["dhana", "raja", "budha-aditya", "chandra-mangal"]),
    dashaFactors: [
      ...(dashaActivatesHouse(k, 7) ? [dashaActivatesHouse(k, 7)!] : []),
      ...dashaForLords(
        k,
        [h7?.id, h10?.id, "mercury", "jupiter", "venus", "mars"].filter(Boolean) as string[],
        "business"
      ),
    ],
    transitFactors: transitOnHouse(k, 7, ["jupiter", "saturn", "mercury"]),
    divisionalFactors: d10Lagna(k)
      ? [
          factor({
            category: "divisional",
            type: "supporting",
            strength: "moderate",
            label: { en: "D10 professional frame", hi: "D10 पेशेवर ढाँचा" },
            detail: {
              en: `D10 lagna ${d10Lagna(k)} supports reading enterprise style with D1 7th/10th — not a success guarantee.`,
              hi: `D10 लग्न ${d10Lagna(k)} — D1 के 7/10 के साथ उद्यम शैली; सफलता की गारंटी नहीं।`,
            },
          }),
        ]
      : [],
    timingWindows: (() => {
      const w = dashaTimingWindow(
        k,
        "business",
        { en: "Business-activation antardasha", hi: "व्यवसाय-सक्रिय अंतर्दशा" },
        [h7?.id, "mercury", "jupiter", "venus"].filter(Boolean) as string[],
        ["saturn"]
      );
      return w ? [w] : [];
    })(),
  });
}

export function analyzeMarriage(k: KundliResult): TopicPrediction {
  const h7 = houseLord(k, 7);
  const venus = planetById(k)["venus"];
  const factors = {
    natalFactors: [] as PredictionFactor[],
    houseFactors: houseOccFactors(k, 7, "7th"),
    lordFactors: lordFactors(k, 7, "7th lord", "सप्तमेश"),
    planetFactors: [
      ...planetRole(k, "venus", "Relationship karaka Venus", "संबंध कारक शुक्र"),
      ...planetRole(k, "jupiter", "Spouse/support Jupiter", "जीवनसाथी/समर्थन गुरु"),
      ...planetRole(k, "moon", "Emotional Moon", "भावनात्मक चंद्र"),
    ],
    aspectFactors: aspectsOnHouse(k, 7),
    yogaFactors: yogasForTopic(k, ["gaja-kesari", "malavya", "manglik", "kemadruma"]),
    dashaFactors: [
      ...(dashaActivatesHouse(k, 7) ? [dashaActivatesHouse(k, 7)!] : []),
      ...dashaForLords(
        k,
        [h7?.id, "venus", "jupiter", "moon"].filter(Boolean) as string[],
        "relationship"
      ),
    ],
    transitFactors: [
      ...transitOnHouse(k, 7, ["jupiter", "saturn", "venus"]),
      ...transitOnHouse(k, 5, ["jupiter", "venus"]),
    ],
    divisionalFactors: [] as PredictionFactor[],
  };

  const d9l = d9Lagna(k);
  if (d9l) {
    factors.divisionalFactors.push(
      factor({
        category: "divisional",
        type: "supporting",
        strength: "moderate",
        label: { en: "D9 lagna (relationship depth)", hi: "D9 लग्न (संबंध गहराई)" },
        detail: {
          en: `Navamsa lagna ${d9l} — combine with D1 7th/Venus; D9 does not replace D1.`,
          hi: `नवमांश लग्न ${d9l} — D1 सप्तम/शुक्र के साथ; D9, D1 का विकल्प नहीं।`,
        },
      })
    );
  }
  if (venus) {
    const d9v = d9PlanetSign(k, "venus");
    if (d9v) {
      factors.divisionalFactors.push(
        factor({
          category: "divisional",
          type: "supporting",
          strength: "moderate",
          label: { en: "Venus in D9", hi: "D9 में शुक्र" },
          detail: {
            en: `Venus in D9 sign ${d9v} (D1 house ${venus.house}) — partnership tone refinement.`,
            hi: `D9 में शुक्र ${d9v} (D1 भाव ${venus.house}) — साझेदारी स्वर का सूक्ष्म पाठ।`,
          },
        })
      );
    }
  }
  if (k.doshas.manglik.present) {
    factors.natalFactors.push(
      factor({
        category: "dosha",
        type: "challenging",
        strength: "moderate",
        label: { en: "Manglik indication (Lagna method)", hi: "मांगलिक संकेत (लग्न पद्धति)" },
        detail: {
          en: `${k.doshas.manglik.meaning.en} Not a prediction of suffering — review cancellations and dasha timing.`,
          hi: `${k.doshas.manglik.meaning.hi} कष्ट की भविष्यवाणी नहीं — दोष निवारण व दशा जाँचें।`,
        },
      })
    );
  }

  // Timing: only when multiple independent supports (7th lord / Venus / Jupiter dasha)
  const d = dashaPlanetIds(k);
  const timingSupports = [h7?.id, "venus", "jupiter"].filter(
    (id) => id && (d.maha === id || d.antar === id || d.pratyantar === id)
  ) as string[];
  const timing =
    timingSupports.length >= 2
      ? dashaTimingWindow(
          k,
          "marriage",
          {
            en: "More favorable relationship window (multi-factor dasha)",
            hi: "अधिक अनुकूल संबंध खिड़की (बहु-कारक दशा)",
          },
          timingSupports,
          ["saturn", "rahu"]
        )
      : timingSupports.length === 1
        ? {
            ...dashaTimingWindow(
              k,
              "marriage",
              {
                en: "Potential relationship activation (single dasha factor — weak alone)",
                hi: "संभावित संबंध सक्रियता (एकल दशा — अकेले कमजोर)",
              },
              timingSupports,
              []
            )!,
            strength: "weak" as const,
          }
        : null;

  return finalizeTopic({
    topic: "marriage",
    title: { en: "Marriage & Partnership", hi: "विवाह और साझेदारी" },
    themes: [
      { en: "Partnership style", hi: "साझेदारी शैली" },
      { en: "Relationship timing tendencies", hi: "संबंध समय प्रवृत्तियाँ" },
      { en: "Harmony vs effort themes", hi: "सामंजस्य बनाम प्रयास" },
    ],
    ...factors,
    timingWindows: timing ? [timing] : [],
  });
}

export function analyzeFinance(k: KundliResult): TopicPrediction {
  const h2 = houseLord(k, 2);
  const h11 = houseLord(k, 11);
  return finalizeTopic({
    topic: "finance",
    title: { en: "Finance & Resources", hi: "वित्त और संसाधन" },
    themes: [
      { en: "Income & speech/resources", hi: "आय व वाणी/संसाधन" },
      { en: "Gains & networks", hi: "लाभ व नेटवर्क" },
      { en: "Savings vs sudden expense", hi: "बचत बनाम अचानक व्यय" },
      { en: "Speculation caution (5th/8th)", hi: "सट्टा सावधानी (5/8)" },
    ],
    natalFactors: [],
    houseFactors: [
      ...houseOccFactors(k, 2, "2nd"),
      ...houseOccFactors(k, 11, "11th"),
      ...houseOccFactors(k, 8, "8th"),
      ...houseOccFactors(k, 5, "5th"),
    ],
    lordFactors: [
      ...lordFactors(k, 2, "2nd lord", "द्वितीयेश"),
      ...lordFactors(k, 11, "11th lord", "एकादशेश"),
      ...lordFactors(k, 9, "9th lord", "नवमेश"),
      ...lordFactors(k, 8, "8th lord", "अष्टमेश"),
    ],
    planetFactors: [
      ...planetRole(k, "jupiter", "Wealth karaka Jupiter", "धन कारक गुरु"),
      ...planetRole(k, "venus", "Comfort Venus", "सुख शुक्र"),
    ],
    aspectFactors: [...aspectsOnHouse(k, 2), ...aspectsOnHouse(k, 11)],
    yogaFactors: yogasForTopic(k, ["dhana", "gaja-kesari", "chandra-mangal", "budha-aditya"]),
    dashaFactors: [
      ...(dashaActivatesHouse(k, 2) ? [dashaActivatesHouse(k, 2)!] : []),
      ...(dashaActivatesHouse(k, 11) ? [dashaActivatesHouse(k, 11)!] : []),
      ...dashaForLords(
        k,
        [h2?.id, h11?.id, "jupiter", "venus"].filter(Boolean) as string[],
        "finance"
      ),
    ],
    transitFactors: [
      ...transitOnHouse(k, 2, ["jupiter", "venus", "saturn"]),
      ...transitOnHouse(k, 11, ["jupiter", "saturn"]),
      ...transitOnHouse(k, 8, ["saturn", "rahu"]),
    ],
    divisionalFactors: [],
    timingWindows: (() => {
      const w = dashaTimingWindow(
        k,
        "finance",
        { en: "Resource-focused antardasha", hi: "संसाधन-केंद्रित अंतर्दशा" },
        [h2?.id, h11?.id, "jupiter", "venus"].filter(Boolean) as string[],
        ["saturn"]
      );
      return w ? [w] : [];
    })(),
  });
}

export function analyzeEducation(k: KundliResult): TopicPrediction {
  const h5 = houseLord(k, 5);
  const h9 = houseLord(k, 9);
  return finalizeTopic({
    topic: "education",
    title: { en: "Education & Learning", hi: "शिक्षा और अधिगम" },
    themes: [
      { en: "Learning style", hi: "सीखने की शैली" },
      { en: "Higher studies", hi: "उच्च शिक्षा" },
      { en: "Concentration & skill", hi: "एकाग्रता व कौशल" },
    ],
    natalFactors: [],
    houseFactors: [
      ...houseOccFactors(k, 4, "4th"),
      ...houseOccFactors(k, 5, "5th"),
      ...houseOccFactors(k, 9, "9th"),
    ],
    lordFactors: [
      ...lordFactors(k, 5, "5th lord", "पंचमेश"),
      ...lordFactors(k, 9, "9th lord", "नवमेश"),
      ...lordFactors(k, 4, "4th lord", "चतुर्थेश"),
    ],
    planetFactors: [
      ...planetRole(k, "mercury", "Intellect Mercury", "बुद्धि बुध"),
      ...planetRole(k, "jupiter", "Wisdom Jupiter", "ज्ञान गुरु"),
      ...planetRole(k, "moon", "Mind Moon", "मन चंद्र"),
    ],
    aspectFactors: [...aspectsOnHouse(k, 5), ...aspectsOnHouse(k, 9)],
    yogaFactors: yogasForTopic(k, ["budha-aditya", "hamsa", "gaja-kesari"]),
    dashaFactors: dashaForLords(
      k,
      [h5?.id, h9?.id, "mercury", "jupiter", "moon"].filter(Boolean) as string[],
      "education"
    ),
    transitFactors: transitOnHouse(k, 5, ["jupiter", "mercury", "saturn"]),
    divisionalFactors: [],
    timingWindows: [],
  });
}

export function analyzeFamily(k: KundliResult): TopicPrediction {
  return finalizeTopic({
    topic: "family",
    title: { en: "Family & Home", hi: "परिवार और घर" },
    themes: [
      { en: "Home & emotional base", hi: "घर व भावनात्मक आधार" },
      { en: "Family resources", hi: "पारिवारिक संसाधन" },
      { en: "Father/dharma axis (9th)", hi: "पिता/धर्म अक्ष (9)" },
    ],
    natalFactors: [],
    houseFactors: [
      ...houseOccFactors(k, 2, "2nd"),
      ...houseOccFactors(k, 4, "4th"),
      ...houseOccFactors(k, 9, "9th"),
    ],
    lordFactors: [
      ...lordFactors(k, 2, "2nd lord", "द्वितीयेश"),
      ...lordFactors(k, 4, "4th lord", "चतुर्थेश"),
      ...lordFactors(k, 9, "9th lord", "नवमेश"),
    ],
    planetFactors: [
      ...planetRole(k, "moon", "Mind/home Moon", "मन/घर चंद्र"),
      ...planetRole(k, "sun", "Father/authority Sun", "पिता/प्राधिकार सूर्य"),
    ],
    aspectFactors: aspectsOnHouse(k, 4),
    yogaFactors: yogasForTopic(k, ["gaja-kesari", "kemadruma"]),
    dashaFactors: [
      ...(dashaActivatesHouse(k, 4) ? [dashaActivatesHouse(k, 4)!] : []),
      ...dashaForLords(k, ["moon", "sun"], "family"),
    ],
    transitFactors: transitOnHouse(k, 4, ["jupiter", "saturn", "moon"]),
    divisionalFactors: [],
    timingWindows: [],
  });
}

export function analyzeChildren(k: KundliResult): TopicPrediction {
  const h5 = houseLord(k, 5);
  return finalizeTopic({
    topic: "children",
    title: { en: "Children & Creativity", hi: "संतान और रचनात्मकता" },
    themes: [
      { en: "Creativity & progeny themes", hi: "रचनात्मकता व संतान विषय" },
      { en: "Mentoring / teaching joy", hi: "मार्गदर्शन / शिक्षण आनंद" },
    ],
    natalFactors: [
      factor({
        category: "natal",
        type: "neutral",
        strength: "weak",
        label: { en: "No guaranteed outcomes", hi: "कोई सुनिश्चित परिणाम नहीं" },
        detail: {
          en: "Traditional Jyotish reads tendencies only — not number, gender, or medical outcomes of children.",
          hi: "पारंपरिक ज्योतिष केवल प्रवृत्तियाँ पढ़ता है — संतान संख्या/लिंग/चिकित्सा परिणाम नहीं।",
        },
      }),
    ],
    houseFactors: houseOccFactors(k, 5, "5th"),
    lordFactors: lordFactors(k, 5, "5th lord", "पंचमेश"),
    planetFactors: planetRole(k, "jupiter", "Putra karaka Jupiter", "पुत्र कारक गुरु"),
    aspectFactors: aspectsOnHouse(k, 5),
    yogaFactors: yogasForTopic(k, ["gaja-kesari", "hamsa"]),
    dashaFactors: dashaForLords(
      k,
      [h5?.id, "jupiter"].filter(Boolean) as string[],
      "children/creativity"
    ),
    transitFactors: transitOnHouse(k, 5, ["jupiter", "saturn"]),
    divisionalFactors: [],
    timingWindows: [],
  });
}

export function analyzeForeignTravel(k: KundliResult): TopicPrediction {
  const h12 = houseLord(k, 12);
  const h9 = houseLord(k, 9);
  return finalizeTopic({
    topic: "foreign_travel",
    title: { en: "Foreign Travel & Settlement", hi: "विदेश यात्रा और बसना" },
    themes: [
      { en: "Travel / long journeys", hi: "यात्रा / लंबी यात्राएँ" },
      { en: "Settlement vs temporary stay", hi: "बसना बनाम अस्थायी प्रवास" },
      { en: "Cross-cultural exposure", hi: "अंतर-सांस्कृतिक अनुभव" },
    ],
    natalFactors: [
      factor({
        category: "natal",
        type: "neutral",
        strength: "moderate",
        label: {
          en: "Travel ≠ settlement",
          hi: "यात्रा ≠ बसना",
        },
        detail: {
          en: "12th/Rahu can show travel or residence abroad; 9th shows dharma/long journeys. They are read separately.",
          hi: "12/राहु यात्रा या विदेश वास दिखा सकते हैं; 9 धर्म/लंबी यात्रा। अलग-अलग पढ़ें।",
        },
      }),
    ],
    houseFactors: [
      ...houseOccFactors(k, 12, "12th"),
      ...houseOccFactors(k, 9, "9th"),
      ...houseOccFactors(k, 7, "7th"),
    ],
    lordFactors: [
      ...lordFactors(k, 12, "12th lord", "व्ययेश"),
      ...lordFactors(k, 9, "9th lord", "नवमेश"),
      ...lordFactors(k, 7, "7th lord", "सप्तमेश"),
    ],
    planetFactors: [
      ...planetRole(k, "rahu", "Foreign/edge Rahu", "विदेश/सीमा राहु"),
      ...planetRole(k, "moon", "Movement Moon", "गति चंद्र"),
    ],
    aspectFactors: aspectsOnHouse(k, 12),
    yogaFactors: [],
    dashaFactors: dashaForLords(
      k,
      [h12?.id, h9?.id, "rahu", "moon"].filter(Boolean) as string[],
      "foreign themes"
    ),
    transitFactors: [
      ...transitOnHouse(k, 12, ["jupiter", "saturn", "rahu"]),
      ...transitOnHouse(k, 9, ["jupiter", "saturn"]),
    ],
    divisionalFactors: [],
    timingWindows: (() => {
      const w = dashaTimingWindow(
        k,
        "foreign_travel",
        { en: "Travel/settlement-sensitive dasha", hi: "यात्रा/बसना-संवेदनशील दशा" },
        [h12?.id, "rahu", "moon"].filter(Boolean) as string[],
        []
      );
      return w ? [w] : [];
    })(),
  });
}

export function analyzeSpirituality(k: KundliResult): TopicPrediction {
  return finalizeTopic({
    topic: "spirituality",
    title: { en: "Spirituality & Inner Life", hi: "आध्यात्मिकता और अंतःजीवन" },
    themes: [
      { en: "Dharma & meaning", hi: "धर्म व अर्थ" },
      { en: "Detachment & inner work", hi: "वैराग्य व आंतरिक साधना" },
      { en: "Devotion / insight", hi: "भक्ति / अंतर्दृष्टि" },
    ],
    natalFactors: [],
    houseFactors: [
      ...houseOccFactors(k, 9, "9th"),
      ...houseOccFactors(k, 12, "12th"),
      ...houseOccFactors(k, 5, "5th"),
    ],
    lordFactors: [
      ...lordFactors(k, 9, "9th lord", "नवमेश"),
      ...lordFactors(k, 12, "12th lord", "व्ययेश"),
    ],
    planetFactors: [
      ...planetRole(k, "jupiter", "Dharma Jupiter", "धर्म गुरु"),
      ...planetRole(k, "ketu", "Moksha Ketu", "मोक्ष केतु"),
      ...planetRole(k, "moon", "Bhakti mind Moon", "भक्ति मन चंद्र"),
    ],
    aspectFactors: aspectsOnHouse(k, 9),
    yogaFactors: yogasForTopic(k, ["gaja-kesari", "hamsa"]),
    dashaFactors: dashaForLords(k, ["jupiter", "ketu", "moon"], "spirituality"),
    transitFactors: transitOnHouse(k, 9, ["jupiter", "saturn", "ketu"]),
    divisionalFactors: d9Lagna(k)
      ? [
          factor({
            category: "divisional",
            type: "supporting",
            strength: "weak",
            label: { en: "D9 dharma tone", hi: "D9 धर्म स्वर" },
            detail: {
              en: `D9 lagna ${d9Lagna(k)} — gentle secondary cue with D1 9th/12th.`,
              hi: `D9 लग्न ${d9Lagna(k)} — D1 के 9/12 के साथ हल्का द्वितीय संकेत।`,
            },
          }),
        ]
      : [],
    timingWindows: [],
  });
}

export function analyzeCurrentPeriod(k: KundliResult): TopicPrediction {
  const d = dashaPlanetIds(k);
  const byId = planetById(k);
  const maha = byId[d.maha];
  const antar = byId[d.antar];
  const natalFactors: PredictionFactor[] = [];

  if (maha) {
    const dig = dignityStrength(maha);
    natalFactors.push(
      factor({
        category: "dasha",
        type: dig.polarity === "challenging" ? "challenging" : "supporting",
        strength: "strong",
        label: {
          en: `Mahadasha: ${maha.name.en}`,
          hi: `महादशा: ${maha.name.hi}`,
        },
        detail: {
          en: `${maha.name.en} owns houses linked to its signs and sits in house ${maha.house} (${maha.sign.en}). ${dig.note.en} Period ${k.dasha.currentMaha.start} → ${k.dasha.currentMaha.end}.`,
          hi: `${maha.name.hi} भाव ${maha.house} (${maha.sign.hi}) में। ${dig.note.hi} अवधि ${k.dasha.currentMaha.start} → ${k.dasha.currentMaha.end}।`,
        },
      })
    );
  }
  if (antar) {
    const dig = dignityStrength(antar);
    natalFactors.push(
      factor({
        category: "dasha",
        type: dig.polarity === "challenging" ? "challenging" : "supporting",
        strength: "strong",
        label: {
          en: `Antardasha: ${antar.name.en}`,
          hi: `अंतर्दशा: ${antar.name.hi}`,
        },
        detail: {
          en: `${antar.name.en} in house ${antar.house} / ${antar.sign.en} colors the maha chapter. ${dig.note.en} ${k.dasha.currentAntar.start} → ${k.dasha.currentAntar.end}.`,
          hi: `${antar.name.hi} भाव ${antar.house} / ${antar.sign.hi} महादशा अध्याय को रंग देता है। ${dig.note.hi}`,
        },
      })
    );
  }

  // Relationship between maha and antar
  if (maha && antar) {
    const sameSign = maha.signIndex === antar.signIndex;
    const dist = ((antar.signIndex - maha.signIndex + 12) % 12) + 1;
    natalFactors.push(
      factor({
        category: "dasha",
        type: sameSign || [1, 5, 9].includes(dist) ? "supporting" : "neutral",
        strength: "moderate",
        label: {
          en: "Maha–Antar relationship",
          hi: "महा–अंतर संबंध",
        },
        detail: {
          en: sameSign
            ? `${maha.name.en} and ${antar.name.en} share a sign — themes concentrate.`
            : `${antar.name.en} is ${dist} signs from ${maha.name.en} — blend both house agendas (H${maha.house} + H${antar.house}).`,
          hi: sameSign
            ? `${maha.name.hi} और ${antar.name.hi} एक राशि में — विषय केंद्रित।`
            : `${antar.name.hi}, ${maha.name.hi} से ${dist} राशि — दोनों भाव एजेंडा मिलाएँ।`,
        },
      })
    );
  }

  if (k.doshas.sadeSati?.present) {
    natalFactors.push(
      factor({
        category: "dosha",
        type: "challenging",
        strength: "moderate",
        label: { en: "Sade Sati active", hi: "साढ़े साती सक्रिय" },
        detail: {
          en: `${k.doshas.sadeSati.meaning.en} Read with dasha — not as isolated doom.`,
          hi: `${k.doshas.sadeSati.meaning.hi} दशा के साथ पढ़ें — अकेला अशुभ नहीं।`,
        },
      })
    );
  }

  return finalizeTopic({
    topic: "current_period",
    title: { en: "Current Life Period", hi: "वर्तमान जीवन काल" },
    themes: [
      { en: "Activated life chapters", hi: "सक्रिय जीवन अध्याय" },
      { en: "Effort vs support balance", hi: "प्रयास बनाम समर्थन संतुलन" },
    ],
    natalFactors,
    houseFactors: [],
    lordFactors: [],
    planetFactors: [],
    aspectFactors: [],
    yogaFactors: k.yogas.slice(0, 3).map((y) =>
      factor({
        category: "yoga",
        type: y.level === "challenge" ? "challenging" : "supporting",
        strength: "weak",
        label: {
          en: `Natal yoga present: ${y.name.en}`,
          hi: `जन्म योग: ${y.name.hi}`,
        },
        detail: {
          en: `${y.meaning.en} May or may not be strongly timed now.`,
          hi: `${y.meaning.hi} अभी मजबूत समय पर हो भी सकता है, नहीं भी।`,
        },
      })
    ),
    dashaFactors: [],
    transitFactors: transitPlanetsLimited(k),
    divisionalFactors: [],
    timingWindows: [
      {
        topic: "current_period",
        windowStart: k.dasha.currentAntar.start,
        windowEnd: k.dasha.currentAntar.end,
        strength: "moderate",
        label: {
          en: "Current antardasha window",
          hi: "वर्तमान अंतर्दशा खिड़की",
        },
        supportingFactors: [`maha:${d.maha}`, `antar:${d.antar}`],
        challengingFactors: [],
      },
    ],
  });
}

function transitPlanetsLimited(k: KundliResult): PredictionFactor[] {
  const slow = ["jupiter", "saturn", "rahu", "ketu"];
  return transitOnHouse(k, 1, slow)
    .concat(transitOnHouse(k, 10, slow))
    .concat(transitOnHouse(k, 7, slow))
    .slice(0, 8);
}
