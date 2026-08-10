import type { PlanetPosition, YogaFlag } from "./types";

export function detectYogas(
  planets: PlanetPosition[],
  lagnaSign: number
): YogaFlag[] {
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]));
  const flags: YogaFlag[] = [];

  const moon = byId.moon;
  const jupiter = byId.jupiter;
  const saturn = byId.saturn;
  const mars = byId.mars;
  const venus = byId.venus;
  const sun = byId.sun;
  const rahu = byId.rahu;
  const ketu = byId.ketu;

  // Gaja Kesari: Jupiter in kendra from Moon (1/4/7/10 from Moon)
  if (moon && jupiter) {
    const fromMoon = ((jupiter.signIndex - moon.signIndex + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(fromMoon)) {
      flags.push({
        id: "gaja-kesari",
        name: { en: "Gaja Kesari Yoga", hi: "गज केसरी योग" },
        level: "positive",
        meaning: {
          en: "Jupiter in a kendra from Moon — supports wisdom, reputation, and steady growth.",
          hi: "चंद्र से केंद्र में गुरु — बुद्धि, प्रतिष्ठा और स्थिर उन्नति का संकेत।",
        },
      });
    }
  }

  // Budha-Aditya: Sun + Mercury same sign
  if (sun && byId.mercury && sun.signIndex === byId.mercury.signIndex) {
    flags.push({
      id: "budha-aditya",
      name: { en: "Budha-Aditya Yoga", hi: "बुधादित्य योग" },
      level: "positive",
      meaning: {
        en: "Sun with Mercury — sharp intellect, communication skill, and analytical ability.",
        hi: "सूर्य के साथ बुध — तीव्र बुद्धि, संचार कौशल और विश्लेषण क्षमता।",
      },
    });
  }

  // Manglik: Mars in 1,4,7,8,12
  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) {
    flags.push({
      id: "manglik",
      name: { en: "Manglik Indication", hi: "मांगलिक संकेत" },
      level: "challenge",
      meaning: {
        en: "Mars occupies a sensitive house — relationship timing and temperament need mindful handling. Full matching & remedies via consultation.",
        hi: "मंगल संवेदनशील भाव में — संबंधों के समय और स्वभाव पर ध्यान दें। पूर्ण मिलान व उपाय परामर्श से।",
      },
    });
  }

  // Kaal Sarp rough: all planets between Rahu-Ketu axis (simplified)
  if (rahu && ketu) {
    const others = planets.filter((p) => !["rahu", "ketu"].includes(p.id));
    const r = rahu.longitude;
    const k = ketu.longitude;
    const allOneSide = others.every((p) => isBetween(p.longitude, r, k));
    if (allOneSide) {
      flags.push({
        id: "kaal-sarp",
        name: { en: "Kaal Sarp Pattern", hi: "कालसर्प योग संकेत" },
        level: "challenge",
        meaning: {
          en: "Planets clustered on one side of the Rahu–Ketu axis — life may feel intense or karmic; guidance helps unlock timing.",
          hi: "राहु-केतु अक्ष के एक ओर ग्रह — जीवन तीव्र/कर्मिक लग सकता है; मार्गदर्शन समय खोलने में सहायक।",
        },
      });
    }
  }

  // Raja yoga hint: lords of 9 and 10 together (approx via venus/jupiter/saturn in kendra/trikona)
  if (jupiter && [1, 4, 5, 7, 9, 10].includes(jupiter.house)) {
    flags.push({
      id: "guru-kendra",
      name: { en: "Jupiter Support", hi: "गुरु बल" },
      level: "positive",
      meaning: {
        en: "Jupiter in a strong house — dharma, mentors, and expansion themes are supported.",
        hi: "गुरु बलवान भाव में — धर्म, मार्गदर्शक और विस्तार के योग समर्थित।",
      },
    });
  }

  if (venus && [1, 4, 5, 7, 10].includes(venus.house)) {
    flags.push({
      id: "shukra-shubha",
      name: { en: "Venus Grace", hi: "शुक्र अनुग्रह" },
      level: "positive",
      meaning: {
        en: "Venus well-placed — comfort, arts, relationships, and aesthetic sense can flourish.",
        hi: "शुक्र शुभ स्थान में — सुख, कला, संबंध और सौंदर्य बोध पनप सकते हैं।",
      },
    });
  }

  if (saturn && [6, 8, 12].includes(saturn.house)) {
    flags.push({
      id: "shani-dusthana",
      name: { en: "Saturn Challenge House", hi: "शनि चुनौती भाव" },
      level: "challenge",
      meaning: {
        en: "Saturn in a dusthana — patience, discipline, and structured effort become key growth tools.",
        hi: "शनि दुस्थान में — धैर्य, अनुशासन और व्यवस्थित प्रयास विकास की कुंजी।",
      },
    });
  }

  // Lagna strength note
  flags.push({
    id: "lagna-focus",
    name: {
      en: `Lagna in focus`,
      hi: `लग्न केंद्र`,
    },
    level: "neutral",
    meaning: {
      en: `Your Ascendant sign index ${lagnaSign + 1} shapes vitality and life approach. Personalized lagna remedies available on consult.`,
      hi: `आपका लग्न (संकेत ${lagnaSign + 1}) ऊर्जा और जीवन दृष्टिकोण गढ़ता है। व्यक्तिगत लग्न उपाय परामर्श पर उपलब्ध।`,
    },
  });

  return flags.slice(0, 6);
}

function isBetween(lon: number, a: number, b: number): boolean {
  // Check if lon lies on the shorter arc from a toward b going forward
  const start = a;
  const end = b;
  if (start < end) return lon >= start && lon <= end;
  return lon >= start || lon <= end;
}
