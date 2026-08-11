import { SIGN_LORDS } from "./constants";
import type { PlanetPosition, YogaFlag } from "./types";
import { kaalSarpDosha, mangalDosha } from "./doshas";
import { detectNeechaBhangaYogas } from "./neecha-bhanga";

function lordIdOfSign(signIndex: number): string {
  const name = SIGN_LORDS[signIndex].en.toLowerCase();
  const map: Record<string, string> = {
    mars: "mars",
    venus: "venus",
    mercury: "mercury",
    moon: "moon",
    sun: "sun",
    jupiter: "jupiter",
    saturn: "saturn",
  };
  return map[name] || name;
}

function houseLordPlanet(
  lagnaSign: number,
  house: number,
  byId: Record<string, PlanetPosition>
): PlanetPosition | undefined {
  const sign = (lagnaSign + house - 1) % 12;
  return byId[lordIdOfSign(sign)];
}

function sameSign(a?: PlanetPosition, b?: PlanetPosition) {
  return !!a && !!b && a.signIndex === b.signIndex;
}

function kendraFrom(from: PlanetPosition, other: PlanetPosition) {
  const dist = ((other.signIndex - from.signIndex + 12) % 12) + 1;
  return [1, 4, 7, 10].includes(dist);
}

function kendraHouse(h: number) {
  return [1, 4, 7, 10].includes(h);
}

/**
 * Detect classical yogas with explicit conditions.
 * Dosha-like patterns (Manglik / Kaal Sarp) are reported via dosha modules
 * and mirrored here only when present — not invented.
 */
export function detectYogas(
  planets: PlanetPosition[],
  lagnaSign: number
): YogaFlag[] {
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]));
  const flags: YogaFlag[] = [];

  const moon = byId.moon;
  const jupiter = byId.jupiter;
  const mars = byId.mars;
  const venus = byId.venus;
  const sun = byId.sun;
  const mercury = byId.mercury;
  const saturn = byId.saturn;

  // Gaja Kesari: Jupiter in kendra from Moon
  if (moon && jupiter && kendraFrom(moon, jupiter)) {
    flags.push({
      id: "gaja-kesari",
      name: { en: "Gaja Kesari Yoga", hi: "गज केसरी योग" },
      level: "positive",
      meaning: {
        en: "Rule: Jupiter in a kendra (1/4/7/10) from the Moon. Supports wisdom, reputation, and steady growth when other factors agree.",
        hi: "नियम: चंद्र से केंद्र (1/4/7/10) में गुरु। अन्य कारकों के साथ बुद्धि, प्रतिष्ठा और स्थिर उन्नति का संकेत।",
      },
    });
  }

  // Budha-Aditya: Sun + Mercury same sign
  if (sameSign(sun, mercury)) {
    flags.push({
      id: "budha-aditya",
      name: { en: "Budha-Aditya Yoga", hi: "बुधादित्य योग" },
      level: "positive",
      meaning: {
        en: "Rule: Sun and Mercury in the same sign. Supports intellect, communication, and analytical skill (Mercury combustion can modify results).",
        hi: "नियम: सूर्य और बुध एक ही राशि में। बुद्धि व संचार समर्थित (बुध अस्त होने पर परिणाम बदल सकते हैं)।",
      },
    });
  }

  // Chandra Mangal: Moon + Mars same sign
  if (sameSign(moon, mars)) {
    flags.push({
      id: "chandra-mangal",
      name: { en: "Chandra-Mangal Yoga", hi: "चंद्र-मंगल योग" },
      level: "positive",
      meaning: {
        en: "Rule: Moon and Mars together. Traditionally linked with drive, enterprise, and money motivation — tone depends on house and dignity.",
        hi: "नियम: चंद्र और मंगल साथ। उद्यम व धन प्रेरणा से जुड़ा; भाव और बल पर स्वर निर्भर।",
      },
    });
  }

  // Panch Mahapurusha (simplified: planet in own/exalt in kendra)
  const maha: {
    id: string;
    planet: PlanetPosition | undefined;
    own: number[];
    exalt: number;
    name: { en: string; hi: string };
  }[] = [
    {
      id: "ruchaka",
      planet: mars,
      own: [0, 7],
      exalt: 9,
      name: { en: "Ruchaka Yoga (Mars)", hi: "रुचक योग (मंगल)" },
    },
    {
      id: "bhadra",
      planet: mercury,
      own: [2, 5],
      exalt: 5,
      name: { en: "Bhadra Yoga (Mercury)", hi: "भद्र योग (बुध)" },
    },
    {
      id: "hamsa",
      planet: jupiter,
      own: [8, 11],
      exalt: 3,
      name: { en: "Hamsa Yoga (Jupiter)", hi: "हंस योग (गुरु)" },
    },
    {
      id: "malavya",
      planet: venus,
      own: [1, 6],
      exalt: 11,
      name: { en: "Malavya Yoga (Venus)", hi: "मालव्य योग (शुक्र)" },
    },
    {
      id: "sasa",
      planet: saturn,
      own: [9, 10],
      exalt: 6,
      name: { en: "Sasa Yoga (Saturn)", hi: "शश योग (शनि)" },
    },
  ];

  for (const y of maha) {
    const p = y.planet;
    if (!p || !kendraHouse(p.house)) continue;
    if (y.own.includes(p.signIndex) || p.signIndex === y.exalt) {
      flags.push({
        id: y.id,
        name: y.name,
        level: "positive",
        meaning: {
          en: `Rule: ${p.name.en} in kendra from Lagna in own or exaltation sign (house ${p.house}, ${p.sign.en}). A Panch Mahapurusha indication.`,
          hi: `नियम: ${p.name.hi} लग्न से केंद्र में स्वराशि/उच्च (भाव ${p.house}, ${p.sign.hi})। पंच महापुरुष संकेत।`,
        },
      });
    }
  }

  // Dharma-Karmadhipati: 9th & 10th lords conjoined or mutual kendra
  const l9 = houseLordPlanet(lagnaSign, 9, byId);
  const l10 = houseLordPlanet(lagnaSign, 10, byId);
  if (l9 && l10) {
    const together = sameSign(l9, l10);
    const mutualKendra = kendraFrom(l9, l10);
    if (together || mutualKendra) {
      flags.push({
        id: "dharma-karmadhipati",
        name: { en: "Dharma-Karmadhipati Yoga", hi: "धर्म-कर्माधिपति योग" },
        level: "positive",
        meaning: {
          en: together
            ? `Rule: 9th lord (${l9.name.en}) and 10th lord (${l10.name.en}) conjoined. Links fortune/dharma with career.`
            : `Rule: 9th lord (${l9.name.en}) and 10th lord (${l10.name.en}) in mutual kendra. Supports purposeful career growth.`,
          hi: together
            ? `नियम: नवमेश (${l9.name.hi}) व दशमेश (${l10.name.hi}) युति। भाग्य/धर्म और करियर जुड़ते हैं।`
            : `नियम: नवमेश (${l9.name.hi}) व दशमेश (${l10.name.hi}) परस्पर केंद्र में। उद्देश्यपूर्ण करियर समर्थन।`,
        },
      });
    }
  }

  // Raja yoga hint: kendra lord + trikona lord together
  for (const kh of [1, 4, 7, 10] as const) {
    for (const th of [1, 5, 9] as const) {
      if (kh === th) continue;
      const lk = houseLordPlanet(lagnaSign, kh, byId);
      const lt = houseLordPlanet(lagnaSign, th, byId);
      if (lk && lt && sameSign(lk, lt) && lk.id !== lt.id) {
        const id = `raja-${kh}-${th}`;
        if (!flags.some((f) => f.id.startsWith("raja-"))) {
          flags.push({
            id,
            name: { en: "Raja Yoga (kendra–trikona lords)", hi: "राज योग (केंद्र–त्रिकोणेश)" },
            level: "positive",
            meaning: {
              en: `Rule: Lord of house ${kh} (${lk.name.en}) with lord of house ${th} (${lt.name.en}) in ${lk.sign.en}. Classical raja-yoga combination.`,
              hi: `नियम: ${kh} भावेश (${lk.name.hi}) व ${th} भावेश (${lt.name.hi}) ${lk.sign.hi} में साथ। शास्त्रीय राजयोग।`,
            },
          });
        }
      }
    }
  }

  // Dhana yoga: 2nd & 11th lords together OR 5th & 9th lords together
  const l2 = houseLordPlanet(lagnaSign, 2, byId);
  const l11 = houseLordPlanet(lagnaSign, 11, byId);
  const l5 = houseLordPlanet(lagnaSign, 5, byId);
  if ((l2 && l11 && sameSign(l2, l11)) || (l5 && l9 && sameSign(l5, l9))) {
    flags.push({
      id: "dhana",
      name: { en: "Dhana Yoga", hi: "धन योग" },
      level: "positive",
      meaning: {
        en: "Rule: 2nd+11th lords conjoined, and/or 5th+9th lords conjoined. Wealth themes may strengthen when dasha supports.",
        hi: "नियम: द्वितीय+एकादशेश युति, और/या पंचम+नवमेश युति। दशा समर्थन पर धन विषय बल पा सकते हैं।",
      },
    });
  }

  // Vipreet Raja: dusthana lords in dusthana (6/8/12)
  const dust = [6, 8, 12] as const;
  let vipreet = false;
  for (const h of dust) {
    const lord = houseLordPlanet(lagnaSign, h, byId);
    if (lord && dust.includes(lord.house as 6 | 8 | 12)) {
      vipreet = true;
      break;
    }
  }
  if (vipreet) {
    flags.push({
      id: "vipreet-raja",
      name: { en: "Vipreet Raja Yoga", hi: "विपरीत राज योग" },
      level: "positive",
      meaning: {
        en: "Rule: A dusthana lord (6/8/12) occupies a dusthana. Classically can turn adversity into rise — results need full chart confirmation.",
        hi: "नियम: दुस्थानेश (6/8/12) दुस्थान में। विपरीत परिस्थितियों से उन्नति का शास्त्रीय संकेत — पूर्ण कुंडली से पुष्टि करें।",
      },
    });
  }

  // Kemadruma: Moon with no planets in 2nd/12th from Moon (ignore Sun; nodes optional)
  if (moon) {
    const companions = planets.filter((p) => {
      if (p.id === "moon" || p.id === "sun") return false;
      const dist = ((p.signIndex - moon.signIndex + 12) % 12) + 1;
      return dist === 2 || dist === 12 || dist === 1;
    });
    const hasKendraPlanet = planets.some((p) => {
      if (p.id === "moon" || p.id === "sun") return false;
      return kendraFrom(moon, p);
    });
    if (companions.length === 0 && !hasKendraPlanet) {
      flags.push({
        id: "kemadruma",
        name: { en: "Kemadruma Yoga", hi: "केमद्रुम योग" },
        level: "challenge",
        meaning: {
          en: "Rule: Moon isolated (no planets in 2nd/12th from Moon, and no kendra support from other planets). Mind may feel unsupported — cancellation yogas often apply; verify fully.",
          hi: "नियम: चंद्र एकाकी (चंद्र से 2/12 में ग्रह नहीं, केंद्र समर्थन नहीं)। मन अकेला लग सकता है — दोष निवारण अक्सर लागू; पूर्ण जाँच करें।",
        },
      });
    }
  }

  // Mirror doshas (same rules as dosha calculators — no inventing)
  const manglik = mangalDosha(planets, lagnaSign);
  if (manglik.present) {
    flags.push({
      id: "manglik",
      name: { en: "Manglik Indication", hi: "मांगलिक संकेत" },
      level: "challenge",
      meaning: {
        en: `${manglik.meaning.en} Methodology: Mars from Lagna in houses 1, 2, 4, 7, 8, or 12.`,
        hi: `${manglik.meaning.hi} पद्धति: लग्न से मंगल भाव 1, 2, 4, 7, 8 या 12।`,
      },
    });
  }

  const ksd = kaalSarpDosha(planets);
  if (ksd.present) {
    flags.push({
      id: "kaal-sarp",
      name: { en: "Kaal Sarp Pattern", hi: "कालसर्प योग संकेत" },
      level: "challenge",
      meaning: {
        en: ksd.meaning.en,
        hi: ksd.meaning.hi,
      },
    });
  }

  const { yogaFlags: nbFlags } = detectNeechaBhangaYogas(planets, lagnaSign);
  flags.push(...nbFlags);

  // Prefer substantive yogas; no always-on filler
  return flags.slice(0, 12);
}
