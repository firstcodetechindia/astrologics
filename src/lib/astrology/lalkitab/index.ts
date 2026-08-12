/**
 * Lal Kitab report — Pakka Ghar, Andha, Rin, house notes, Tier-1 remedies.
 * Follows `.cursor/skills/lal-kitab/SKILL.md` (approved Phase 4 methodology).
 * Uses whole-sign D1 houses from the kundli fact-sheet — no second ephemeris.
 */
import type { PlanetPosition } from "../types";

/** Classical Lal Kitab fixed houses (Pakka Ghar). */
export const PAKKA_GHAR: Record<string, number> = {
  sun: 1,
  moon: 4,
  mars: 3,
  mercury: 7,
  jupiter: 2,
  venus: 6,
  saturn: 8,
  rahu: 12,
  ketu: 6,
};

const HOUSE_THEME: Record<number, { en: string; hi: string }> = {
  1: {
    en: "Self, body, status, and how life begins.",
    hi: "स्वयं, शरीर, प्रतिष्ठा और जीवन की शुरुआत।",
  },
  2: {
    en: "Wealth, speech, family resources.",
    hi: "धन, वाणी, पारिवारिक संसाधन।",
  },
  3: {
    en: "Courage, siblings, short efforts.",
    hi: "साहस, सहोदर, छोटे प्रयास।",
  },
  4: {
    en: "Home, mother, inner peace, property.",
    hi: "घर, माता, आंतरिक शांति, संपत्ति।",
  },
  5: {
    en: "Children, intellect, creative merit.",
    hi: "संतान, बुद्धि, रचनात्मक पुण्य।",
  },
  6: {
    en: "Service, debts, rivals, daily struggle.",
    hi: "सेवा, ऋण, प्रतिद्वंद्व, दैनिक संघर्ष।",
  },
  7: {
    en: "Partnership, marriage, public dealings.",
    hi: "साझेदारी, विवाह, सार्वजनिक व्यवहार।",
  },
  8: {
    en: "Transformation, occult, sudden change.",
    hi: "परिवर्तन, गुप्त विषय, अचानक बदलाव।",
  },
  9: {
    en: "Dharma, father/teachers, long journeys.",
    hi: "धर्म, पिता/गुरु, लंबी यात्राएँ।",
  },
  10: {
    en: "Career, karma, public standing.",
    hi: "कैरियर, कर्म, सामाजिक प्रतिष्ठा।",
  },
  11: {
    en: "Gains, networks, fulfillment of desires.",
    hi: "लाभ, नेटवर्क, इच्छाओं की पूर्ति।",
  },
  12: {
    en: "Expenses, foreign, liberation themes.",
    hi: "व्यय, विदेश, मोक्ष/त्याग विषय।",
  },
};

/** Tier-1 cultural/behavioral remedies — not medical advice. */
const TIER1_REMEDY: Record<string, { en: string; hi: string }> = {
  sun: {
    en: "Offer water to the Sun at sunrise when possible; support elders with dignity. Cultural practice — not medical advice.",
    hi: "संभव हो तो सूर्योदय पर अर्घ्य दें; बड़ों का सम्मान करें। सांस्कृतिक अभ्यास — चिकित्सा सलाह नहीं।",
  },
  moon: {
    en: "Keep a calm night routine; offer milk/white sweets in charity when advised. Cultural practice — not medical advice.",
    hi: "रात का शांत दिनचर्या रखें; सलाह पर दूध/सफ़ेद मिठाई दान। सांस्कृतिक अभ्यास — चिकित्सा सलाह नहीं।",
  },
  mars: {
    en: "Channel energy into disciplined exercise; avoid needless conflict. Cultural practice — not medical advice.",
    hi: "ऊर्जा को अनुशासित व्यायाम में लगाएँ; अनावश्यक संघर्ष से बचें।",
  },
  mercury: {
    en: "Prefer clear truthful speech; donate green/educational items if customary. Cultural practice — not medical advice.",
    hi: "स्पष्ट सत्य वाणी; परंपरा अनुसार हरित/शिक्षा दान।",
  },
  jupiter: {
    en: "Support teachers/students; yellow sweets or books in charity if customary. Cultural practice — not medical advice.",
    hi: "गुरु/विद्यार्थियों का सहयोग; पीले मिष्ठान/पुस्तक दान यदि प्रचलित हो।",
  },
  venus: {
    en: "Keep relationship spaces clean; white/fragrant offerings if customary. Cultural practice — not medical advice.",
    hi: "संबंध स्थान स्वच्छ रखें; श्वेत/सुगंधित अर्पण यदि प्रचलित हो।",
  },
  saturn: {
    en: "Serve the needy; iron/black sesame charity traditions carefully if customary. Cultural practice — not medical advice.",
    hi: "जरूरतमंदों की सेवा; लौह/काले तिल दान परंपरा सावधानी से।",
  },
  rahu: {
    en: "Reduce intoxicants/chaos; keep promises; blue/grey charity items if customary. Cultural practice — not medical advice.",
    hi: "नशा/अव्यवस्था कम करें; वचन निभाएँ; नीला/धूसर दान यदि प्रचलित हो।",
  },
  ketu: {
    en: "Practice simplicity and short spiritual discipline; multi-color/dog-feeding customs vary by lineage — confirm with an astrologer.",
    hi: "सादगी व छोटी साधना; परंपराएँ वंशानुसार भिन्न — ज्योतिषी से पुष्टि करें।",
  },
};

export type LalBasedOn = { en: string; hi: string };

export type LalKitabPlanetRow = {
  id: string;
  name: { en: string; hi: string };
  house: number;
  pakkaGhar: number;
  inPakkaGhar: boolean;
  strength: { en: string; hi: string };
  houseTheme: { en: string; hi: string };
  basedOn: LalBasedOn;
};

export type LalAndhaFlag = {
  id: string;
  planetId: string;
  name: { en: string; hi: string };
  house: number;
  ruleId: "andha_dusthana";
  reason: { en: string; hi: string };
  basedOn: LalBasedOn;
};

export type LalRinFlag = {
  id: "pitri" | "nari" | "dev" | "maatru";
  name: { en: string; hi: string };
  present: boolean;
  note: { en: string; hi: string };
  basedOn: LalBasedOn;
};

export type LalRemedy = {
  id: string;
  forPlanet: string;
  tier: 1;
  trigger: "andha" | "rin" | "out_of_pakka";
  text: { en: string; hi: string };
  basedOn: LalBasedOn;
};

export type LalKitabChart = {
  methodology: {
    en: string;
    hi: string;
  };
  houseSystem: "whole_sign_d1";
  planets: LalKitabPlanetRow[];
  /** @deprecated use andha — kept for older UI */
  blindPlanets: {
    id: string;
    name: { en: string; hi: string };
    reason: { en: string; hi: string };
  }[];
  andha: LalAndhaFlag[];
  debts: LalRinFlag[];
  rin: LalRinFlag[];
  houseNotes: {
    planetId: string;
    house: number;
    theme: { en: string; hi: string };
    basedOn: LalBasedOn;
  }[];
  remedies: LalRemedy[];
};

function houseFrom(base: number, offset: number): number {
  return ((base - 1 + offset) % 12) + 1;
}

function maatruAfflicted(
  moonHouse: number,
  malefics: { id: string; house: number }[]
): boolean {
  for (const m of malefics) {
    if (m.house === moonHouse) return true;
    if (m.house === houseFrom(moonHouse, 0)) return true; // same
    if (m.house === houseFrom(moonHouse, 6)) return true; // 7th from Moon
  }
  return false;
}

export function createLalKitabChart(planets: PlanetPosition[]): LalKitabChart {
  const rows: LalKitabPlanetRow[] = planets
    .filter((p) => PAKKA_GHAR[p.id] != null)
    .map((p) => {
      const pakka = PAKKA_GHAR[p.id];
      const inPakka = p.house === pakka;
      return {
        id: p.id,
        name: p.name,
        house: p.house,
        pakkaGhar: pakka,
        inPakkaGhar: inPakka,
        strength: inPakka
          ? {
              en: "In Pakka Ghar — native strength supported",
              hi: "पक्का घर में — स्वाभाविक बल समर्थित",
            }
          : {
              en: "Away from Pakka Ghar — needs care / Tier-1 remedy consideration",
              hi: "पक्का घर से बाहर — देखभाल / Tier-1 उपाय विचार",
            },
        houseTheme: HOUSE_THEME[p.house] ?? {
          en: `House ${p.house} themes.`,
          hi: `भाव ${p.house} विषय।`,
        },
        basedOn: {
          en: `${p.name.en} in house ${p.house}; Pakka Ghar ${pakka}`,
          hi: `${p.name.hi} भाव ${p.house}; पक्का घर ${pakka}`,
        },
      };
    });

  const andha: LalAndhaFlag[] = rows
    .filter(
      (p) =>
        ["saturn", "rahu", "ketu"].includes(p.id) &&
        [6, 8, 12].includes(p.house)
    )
    .map((p) => ({
      id: `andha-${p.id}-h${p.house}`,
      planetId: p.id,
      name: p.name,
      house: p.house,
      ruleId: "andha_dusthana" as const,
      reason: {
        en: `${p.name.en} in house ${p.house} (6/8/12) — Andha-candidate per v1 screen.`,
        hi: `${p.name.hi} भाव ${p.house} (6/8/12) — Andha उम्मीदवार (v1)।`,
      },
      basedOn: {
        en: `${p.name.en} house ${p.house}`,
        hi: `${p.name.hi} भाव ${p.house}`,
      },
    }));

  const sun = rows.find((p) => p.id === "sun");
  const moon = rows.find((p) => p.id === "moon");
  const saturn = rows.find((p) => p.id === "saturn");
  const venus = rows.find((p) => p.id === "venus");
  const jupiter = rows.find((p) => p.id === "jupiter");
  const jupiterPlanet = planets.find((p) => p.id === "jupiter");
  const malefics = rows.filter((p) =>
    ["saturn", "rahu", "ketu"].includes(p.id)
  );

  const pitriPresent = Boolean(
    sun && [1, 9].includes(sun.house) && saturn && saturn.house === 5
  );
  const nariPresent = Boolean(venus && [8, 12].includes(venus.house));
  const devPresent = Boolean(
    (jupiter && [8, 12].includes(jupiter.house)) ||
      jupiterPlanet?.isCombust === true
  );
  const maatruPresent = Boolean(
    moon &&
      [6, 8, 12].includes(moon.house) &&
      maatruAfflicted(moon.house, malefics)
  );

  const rin: LalRinFlag[] = [
    {
      id: "pitri",
      name: { en: "Pitri Rin", hi: "पितृ ऋण" },
      present: pitriPresent,
      note: {
        en: pitriPresent
          ? "Sun in 1/9 with Saturn in 5 — ancestral/father-line debt screen."
          : "Pitri Rin screen not triggered.",
        hi: pitriPresent
          ? "सूर्य 1/9 व शनि 5 — पितृ ऋण स्क्रीन।"
          : "पितृ ऋण स्क्रीन सक्रिय नहीं।",
      },
      basedOn: {
        en: `Sun H${sun?.house ?? "—"}, Saturn H${saturn?.house ?? "—"}`,
        hi: `सूर्य भाव ${sun?.house ?? "—"}, शनि भाव ${saturn?.house ?? "—"}`,
      },
    },
    {
      id: "nari",
      name: { en: "Nari Rin", hi: "नारी ऋण" },
      present: nariPresent,
      note: {
        en: nariPresent
          ? "Venus in 8/12 — relationship/women-related debt screen."
          : "Nari Rin screen not triggered.",
        hi: nariPresent
          ? "शुक्र 8/12 — नारी ऋण स्क्रीन।"
          : "नारी ऋण स्क्रीन सक्रिय नहीं।",
      },
      basedOn: {
        en: `Venus H${venus?.house ?? "—"}`,
        hi: `शुक्र भाव ${venus?.house ?? "—"}`,
      },
    },
    {
      id: "dev",
      name: { en: "Dev Rin", hi: "देव ऋण" },
      present: devPresent,
      note: {
        en: devPresent
          ? "Jupiter in 8/12 or combust — spiritual/teacher debt screen."
          : "Dev Rin screen not triggered.",
        hi: devPresent
          ? "गुरु 8/12 या अस्त — देव ऋण स्क्रीन।"
          : "देव ऋण स्क्रीन सक्रिय नहीं।",
      },
      basedOn: {
        en: `Jupiter H${jupiter?.house ?? "—"}; combust=${Boolean(jupiterPlanet?.isCombust)}`,
        hi: `गुरु भाव ${jupiter?.house ?? "—"}; अस्त=${Boolean(jupiterPlanet?.isCombust)}`,
      },
    },
    {
      id: "maatru",
      name: { en: "Maatru Rin", hi: "मातृ ऋण" },
      present: maatruPresent,
      note: {
        en: maatruPresent
          ? "Moon in 6/8/12 with Saturn/Rahu/Ketu in same house or 7th from Moon."
          : "Maatru Rin screen not triggered.",
        hi: maatruPresent
          ? "चंद्र 6/8/12 व शनि/राहु/केतु उसी भाव या चंद्र से सप्तम।"
          : "मातृ ऋण स्क्रीन सक्रिय नहीं।",
      },
      basedOn: {
        en: `Moon H${moon?.house ?? "—"}; malefics ${malefics.map((m) => `${m.id}:H${m.house}`).join(", ") || "none"}`,
        hi: `चंद्र भाव ${moon?.house ?? "—"}`,
      },
    },
  ];

  const houseNotes = rows.map((p) => ({
    planetId: p.id,
    house: p.house,
    theme: p.houseTheme,
    basedOn: p.basedOn,
  }));

  const remedies: LalRemedy[] = [];
  const pushRemedy = (
    planetId: string,
    trigger: LalRemedy["trigger"],
    basedOn: LalBasedOn
  ) => {
    if (remedies.some((r) => r.forPlanet === planetId && r.trigger === trigger))
      return;
    const text = TIER1_REMEDY[planetId];
    if (!text) return;
    remedies.push({
      id: `t1-${trigger}-${planetId}`,
      forPlanet: planetId,
      tier: 1,
      trigger,
      text,
      basedOn,
    });
  };

  for (const a of andha) {
    pushRemedy(a.planetId, "andha", a.basedOn);
  }
  for (const d of rin.filter((r) => r.present)) {
    const planetId =
      d.id === "pitri"
        ? "saturn"
        : d.id === "nari"
          ? "venus"
          : d.id === "dev"
            ? "jupiter"
            : "moon";
    pushRemedy(planetId, "rin", d.basedOn);
  }
  // Out of Pakka — prioritize Saturn/Rahu/Ketu, then others
  const priority = ["saturn", "rahu", "ketu", "sun", "moon", "mars", "mercury", "jupiter", "venus"];
  for (const id of priority) {
    const row = rows.find((p) => p.id === id);
    if (row && !row.inPakkaGhar) {
      pushRemedy(id, "out_of_pakka", row.basedOn);
    }
  }

  return {
    methodology: {
      en: "Lal Kitab houses use the same whole-sign D1 houses; Pakka Ghar and Rin are rule tables, not a second ephemeris.",
      hi: "लाल किताब भाव वही पूर्ण-राशि D1 भाव उपयोग करते हैं; पक्का घर व ऋण नियम-तालिकाएँ हैं, दूसरा इफेमेरिस नहीं।",
    },
    houseSystem: "whole_sign_d1",
    planets: rows,
    blindPlanets: andha.map((a) => ({
      id: a.planetId,
      name: a.name,
      reason: a.reason,
    })),
    andha,
    debts: rin,
    rin,
    houseNotes,
    remedies,
  };
}
