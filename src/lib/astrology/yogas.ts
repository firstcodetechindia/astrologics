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
      basedOn: {
        en: `Jupiter in ${jupiter.sign.en} (H${jupiter.house}) · Moon in ${moon.sign.en} (H${moon.house}) · kendra from Moon`,
        hi: `गुरु ${jupiter.sign.hi} (भाव ${jupiter.house}) · चंद्र ${moon.sign.hi} (भाव ${moon.house}) · चंद्र से केंद्र`,
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
      basedOn: {
        en: `Sun + Mercury in ${sun!.sign.en} (H${sun!.house})${mercury?.isCombust ? " · Mercury combust note" : ""}`,
        hi: `सूर्य + बुध ${sun!.sign.hi} में (भाव ${sun!.house})${mercury?.isCombust ? " · बुध अस्त नोट" : ""}`,
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
      basedOn: {
        en: `Moon + Mars in ${moon!.sign.en} (H${moon!.house})`,
        hi: `चंद्र + मंगल ${moon!.sign.hi} में (भाव ${moon!.house})`,
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
        basedOn: {
          en: `${p.name.en} in ${p.sign.en} H${p.house} (own/exalt) · kendra from Lagna`,
          hi: `${p.name.hi} ${p.sign.hi} भाव ${p.house} (स्व/उच्च) · लग्न से केंद्र`,
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
        basedOn: {
          en: `9th lord ${l9.name.en} (${l9.sign.en} H${l9.house}) · 10th lord ${l10.name.en} (${l10.sign.en} H${l10.house})`,
          hi: `नवमेश ${l9.name.hi} (${l9.sign.hi} भाव ${l9.house}) · दशमेश ${l10.name.hi} (${l10.sign.hi} भाव ${l10.house})`,
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
            basedOn: {
              en: `H${kh} lord ${lk.name.en} + H${th} lord ${lt.name.en} in ${lk.sign.en} (H${lk.house})`,
              hi: `${kh} भावेश ${lk.name.hi} + ${th} भावेश ${lt.name.hi} ${lk.sign.hi} में (भाव ${lk.house})`,
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
    const via211 = !!(l2 && l11 && sameSign(l2, l11));
    flags.push({
      id: "dhana",
      name: { en: "Dhana Yoga", hi: "धन योग" },
      level: "positive",
      meaning: {
        en: "Rule: 2nd+11th lords conjoined, and/or 5th+9th lords conjoined. Wealth themes may strengthen when dasha supports.",
        hi: "नियम: द्वितीय+एकादशेश युति, और/या पंचम+नवमेश युति। दशा समर्थन पर धन विषय बल पा सकते हैं।",
      },
      basedOn: via211
        ? {
            en: `2nd lord ${l2!.name.en} + 11th lord ${l11!.name.en} in ${l2!.sign.en}`,
            hi: `द्वितीयेश ${l2!.name.hi} + एकादशेश ${l11!.name.hi} ${l2!.sign.hi} में`,
          }
        : {
            en: `5th lord ${l5!.name.en} + 9th lord ${l9!.name.en} in ${l5!.sign.en}`,
            hi: `पंचमेश ${l5!.name.hi} + नवमेश ${l9!.name.hi} ${l5!.sign.hi} में`,
          },
    });
  }

  // Vipreet Raja: dusthana lords in dusthana (6/8/12)
  const dust = [6, 8, 12] as const;
  let vipreetLord: PlanetPosition | undefined;
  for (const h of dust) {
    const lord = houseLordPlanet(lagnaSign, h, byId);
    if (lord && dust.includes(lord.house as 6 | 8 | 12)) {
      vipreetLord = lord;
      break;
    }
  }
  if (vipreetLord) {
    flags.push({
      id: "vipreet-raja",
      name: { en: "Vipreet Raja Yoga", hi: "विपरीत राज योग" },
      level: "positive",
      meaning: {
        en: "Rule: A dusthana lord (6/8/12) occupies a dusthana. Classically can turn adversity into rise — results need full chart confirmation.",
        hi: "नियम: दुस्थानेश (6/8/12) दुस्थान में। विपरीत परिस्थितियों से उन्नति का शास्त्रीय संकेत — पूर्ण कुंडली से पुष्टि करें।",
      },
      basedOn: {
        en: `${vipreetLord.name.en} (dusthana lord) in house ${vipreetLord.house} · ${vipreetLord.sign.en}`,
        hi: `${vipreetLord.name.hi} (दुस्थानेश) भाव ${vipreetLord.house} · ${vipreetLord.sign.hi}`,
      },
    });
  }

  // Amala Yoga: benefic in 10th from Lagna or Moon (Jupiter/Venus/Mercury/Moon; Moon only from Lagna)
  const benefics = [jupiter, venus, mercury].filter(Boolean) as PlanetPosition[];
  for (const b of benefics) {
    if (b.house === 10) {
      flags.push({
        id: "amala-lagna",
        name: { en: "Amala Yoga (from Lagna)", hi: "अमल योग (लग्न से)" },
        level: "positive",
        meaning: {
          en: "Rule: A natural benefic occupies the 10th from Lagna. Reputation and clean professional image are classically supported.",
          hi: "नियम: लग्न से दशम में शुभ ग्रह। प्रतिष्ठा व शुद्ध व्यावसायिक छवि का शास्त्रीय समर्थन।",
        },
        basedOn: {
          en: `${b.name.en} in 10th from Lagna (${b.sign.en})`,
          hi: `${b.name.hi} लग्न से दशम (${b.sign.hi})`,
        },
      });
      break;
    }
  }
  if (moon) {
    const fromMoon10 = planets.find((p) => {
      if (!["jupiter", "venus", "mercury"].includes(p.id)) return false;
      const dist = ((p.signIndex - moon.signIndex + 12) % 12) + 1;
      return dist === 10;
    });
    if (fromMoon10 && !flags.some((f) => f.id === "amala-lagna")) {
      flags.push({
        id: "amala-moon",
        name: { en: "Amala Yoga (from Moon)", hi: "अमल योग (चंद्र से)" },
        level: "positive",
        meaning: {
          en: "Rule: A natural benefic occupies the 10th from the Moon. Supports virtuous fame through lunar chart.",
          hi: "नियम: चंद्र से दशम में शुभ ग्रह। चंद्र-कुंडली से सदाचारपूर्ण यश का समर्थन।",
        },
        basedOn: {
          en: `${fromMoon10.name.en} in 10th from Moon (${fromMoon10.sign.en})`,
          hi: `${fromMoon10.name.hi} चंद्र से दशम (${fromMoon10.sign.hi})`,
        },
      });
    }
  }

  // Parivartana: mutual exchange of signs between two house lords
  {
    const seen = new Set<string>();
    for (let hA = 1; hA <= 12; hA++) {
      const a = houseLordPlanet(lagnaSign, hA, byId);
      if (!a) continue;
      const hB = ((a.signIndex - lagnaSign + 12) % 12) + 1;
      if (hB === hA) continue;
      const b = houseLordPlanet(lagnaSign, hB, byId);
      if (!b || b.id === a.id) continue;
      const aInB = a.signIndex === (lagnaSign + hB - 1) % 12;
      const bInA = b.signIndex === (lagnaSign + hA - 1) % 12;
      if (!aInB || !bInA) continue;
      const key = [hA, hB].sort((x, y) => x - y).join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      flags.push({
        id: `parivartana-${key}`,
        name: { en: "Parivartana Yoga", hi: "परिवर्तन योग" },
        level: "positive",
        meaning: {
          en: `Rule: Mutual exchange between lords of houses ${hA} and ${hB}. Links the themes of those two houses strongly.`,
          hi: `नियम: भाव ${hA} व ${hB} के स्वामियों का परस्पर राशि-विनिमय। दोनों भावों के विषय दृढ़ता से जुड़ते हैं।`,
        },
        basedOn: {
          en: `${a.name.en} in H${hB} sign · ${b.name.en} in H${hA} sign (exchange ${hA}↔${hB})`,
          hi: `${a.name.hi} भाव ${hB} राशि में · ${b.name.hi} भाव ${hA} राशि में (${hA}↔${hB})`,
        },
      });
      if (flags.filter((f) => f.id.startsWith("parivartana")).length >= 2) break;
    }
  }

  // Shubha / Papa Kartari: benefics or malefics hem planets in Lagna (2nd + 12th)
  {
    const in2 = planets.filter((p) => p.house === 2 && !["rahu", "ketu"].includes(p.id));
    const in12 = planets.filter((p) => p.house === 12 && !["rahu", "ketu"].includes(p.id));
    const naturalMalefic = (id: string) =>
      ["sun", "mars", "saturn"].includes(id);
    const naturalBenefic = (id: string) =>
      ["jupiter", "venus", "mercury", "moon"].includes(id);
    if (
      in2.length > 0 &&
      in12.length > 0 &&
      in2.every((p) => naturalBenefic(p.id)) &&
      in12.every((p) => naturalBenefic(p.id))
    ) {
      flags.push({
        id: "shubha-kartari",
        name: { en: "Shubha Kartari Yoga", hi: "शुभ कर्तरी योग" },
        level: "positive",
        meaning: {
          en: "Rule: Natural benefics occupy both 2nd and 12th from Lagna, flanking the ascendant. Protective/auspicious hem for the self.",
          hi: "नियम: लग्न से द्वितीय व द्वादश दोनों में शुभ ग्रह — लग्न का शुभ घेरा।",
        },
        basedOn: {
          en: `H2: ${in2.map((p) => p.name.en).join(", ")} · H12: ${in12.map((p) => p.name.en).join(", ")}`,
          hi: `भाव 2: ${in2.map((p) => p.name.hi).join(", ")} · भाव 12: ${in12.map((p) => p.name.hi).join(", ")}`,
        },
      });
    } else if (
      in2.length > 0 &&
      in12.length > 0 &&
      in2.every((p) => naturalMalefic(p.id)) &&
      in12.every((p) => naturalMalefic(p.id))
    ) {
      flags.push({
        id: "papa-kartari",
        name: { en: "Papa Kartari Yoga", hi: "पाप कर्तरी योग" },
        level: "challenge",
        meaning: {
          en: "Rule: Natural malefics occupy both 2nd and 12th from Lagna. Pressure around the ascendant — read with dasha and dignity.",
          hi: "नियम: लग्न से द्वितीय व द्वादश दोनों में पाप ग्रह — लग्न पर दबाव; दशा व बल से पढ़ें।",
        },
        basedOn: {
          en: `H2: ${in2.map((p) => p.name.en).join(", ")} · H12: ${in12.map((p) => p.name.en).join(", ")}`,
          hi: `भाव 2: ${in2.map((p) => p.name.hi).join(", ")} · भाव 12: ${in12.map((p) => p.name.hi).join(", ")}`,
        },
      });
    }
  }

  // Adhi Yoga: benefics in 6th, 7th and 8th from Moon
  if (moon) {
    const fromMoon = (house: number) =>
      planets.filter((p) => {
        if (!["jupiter", "venus", "mercury"].includes(p.id)) return false;
        const dist = ((p.signIndex - moon.signIndex + 12) % 12) + 1;
        return dist === house;
      });
    const h6 = fromMoon(6);
    const h7 = fromMoon(7);
    const h8 = fromMoon(8);
    if (h6.length && h7.length && h8.length) {
      flags.push({
        id: "adhi",
        name: { en: "Adhi Yoga", hi: "अधि योग" },
        level: "positive",
        meaning: {
          en: "Rule: Benefics occupy 6th, 7th and 8th from the Moon. Classical indication of status and protective strength.",
          hi: "नियम: चंद्र से 6, 7, 8 में शुभ ग्रह। प्रतिष्ठा व रक्षक बल का शास्त्रीय संकेत।",
        },
        basedOn: {
          en: `From Moon — H6 ${h6.map((p) => p.name.en).join("/")} · H7 ${h7.map((p) => p.name.en).join("/")} · H8 ${h8.map((p) => p.name.en).join("/")}`,
          hi: `चंद्र से — भाव6 ${h6.map((p) => p.name.hi).join("/")} · भाव7 ${h7.map((p) => p.name.hi).join("/")} · भाव8 ${h8.map((p) => p.name.hi).join("/")}`,
        },
      });
    }
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
        basedOn: {
          en: `Moon in ${moon.sign.en} H${moon.house} · no planets in 2nd/12th or kendra from Moon`,
          hi: `चंद्र ${moon.sign.hi} भाव ${moon.house} · चंद्र से 2/12 या केंद्र में ग्रह नहीं`,
        },
      });
    }
  }

  // Mirror doshas (same rules as dosha calculators — no inventing)
  const manglik = mangalDosha(planets, lagnaSign);
  const manglikAny = Boolean(
    (manglik as { presentAny?: boolean }).presentAny ?? manglik.present
  );
  if (manglikAny && !manglik.cancelled) {
    flags.push({
      id: "manglik",
      name: { en: "Manglik Indication", hi: "मांगलिक संकेत" },
      level: "challenge",
      meaning: {
        en: `${manglik.meaning.en}`,
        hi: `${manglik.meaning.hi}`,
      },
      basedOn: {
        en: `Mars from Lagna H${(manglik as { fromLagna?: number }).fromLagna ?? manglik.house}${
          (manglik as { presentFromMoon?: boolean }).presentFromMoon
            ? ` · from Moon H${(manglik as { fromMoon?: number | null }).fromMoon}`
            : ""
        }`,
        hi: `मंगल लग्न से भाव ${(manglik as { fromLagna?: number }).fromLagna ?? manglik.house}${
          (manglik as { presentFromMoon?: boolean }).presentFromMoon
            ? ` · चंद्र से भाव ${(manglik as { fromMoon?: number | null }).fromMoon}`
            : ""
        }`,
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

  // Prefer substantive yogas; allow fuller set for Free Report
  return flags.slice(0, 20);
}
