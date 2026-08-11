/**
 * Ratna Shastra gemstone recommendation engine.
 * Spec: .cursor/skills/gemstone-therapy/SKILL.md
 * Facts + structured lookup only — never bare "lucky gem" without reasoning.
 */

import { PLANET_META, SIGN_LORDS, SIGNS } from "./constants";
import type { KundliResult, PlanetPosition } from "./types";

export type Loc = { en: string; hi: string };
export type PlanetId =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu";

export type FocusArea = "overall" | "career" | "marriage" | "health" | "wealth";

export type WearingGuide = {
  finger: Loc;
  metal: Loc;
  day: Loc;
  minCaratNote: Loc;
};

export type GemCatalogEntry = {
  planetId: PlanetId;
  primary: Loc;
  substitute: Loc;
  substituteWeaker?: boolean;
  highRisk?: boolean;
  benefits: Loc;
  wearing: WearingGuide;
};

/** Classical permanent friendship (natural). */
export const PLANET_FRIENDS: Record<string, string[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
  rahu: ["venus", "saturn", "mercury"],
  ketu: ["mars", "jupiter"],
};

export const PLANET_ENEMIES: Record<string, string[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
  rahu: ["sun", "moon"],
  ketu: ["moon", "venus"],
};

/** Conflicting gem pairs (enemy planets) — never recommend together silently. */
export const CONFLICTING_GEM_PAIRS: [PlanetId, PlanetId][] = [
  ["sun", "saturn"],
  ["sun", "venus"],
  ["moon", "saturn"],
  ["mars", "mercury"],
  ["jupiter", "mercury"],
  ["jupiter", "venus"],
  ["sun", "rahu"],
  ["moon", "rahu"],
  ["moon", "ketu"],
];

export const GEM_CATALOG: Record<PlanetId, GemCatalogEntry> = {
  sun: {
    planetId: "sun",
    primary: { en: "Ruby (Manik)", hi: "माणिक (रूबी)" },
    substitute: { en: "Red Garnet / Red Spinel", hi: "लाल गार्नेट / रेड स्पिनेल" },
    benefits: {
      en: "Supports vitality, confidence, recognition and leadership when the Sun is a chart benefic needing strength.",
      hi: "जब सूर्य कुंडली में शुभ होकर बल चाहता है — ऊर्जा, आत्मविश्वास, मान-सम्मान और नेतृत्व में सहारा।",
    },
    wearing: {
      finger: { en: "Ring finger (right hand commonly)", hi: "अनामिका (प्रायः दाहिना हाथ)" },
      metal: { en: "Gold", hi: "सोना" },
      day: { en: "Sunday morning after sunrise", hi: "रविवार सूर्योदय के बाद" },
      minCaratNote: {
        en: "Often ~1/10 body-weight (kg) in ratti as classical ballpark — confirm with jeweller/astrologer.",
        hi: "शास्त्रीय अनुमान प्रायः शरीर भार (किग्रा) का ~1/10 रत्ती — जौहरी/ज्योतिषी से पुष्टि करें।",
      },
    },
  },
  moon: {
    planetId: "moon",
    primary: { en: "Pearl (Moti)", hi: "मोती" },
    substitute: { en: "Moonstone", hi: "मूनस्टोन" },
    benefits: {
      en: "Supports emotional balance, mind calm, nurturing and public favour when Moon needs support.",
      hi: "जब चंद्र बल चाहता है — भावनात्मक संतुलन, शांत मन, पोषण और लोकप्रियता में सहारा।",
    },
    wearing: {
      finger: { en: "Little finger", hi: "कनिष्ठा" },
      metal: { en: "Silver", hi: "चाँदी" },
      day: { en: "Monday evening / bright fortnight", hi: "सोमवार संध्या / शुक्ल पक्ष" },
      minCaratNote: {
        en: "Prefer natural pearl of suitable size for finger — not dyed/cultured as classical substitute without disclosure.",
        hi: "उंगली के अनुकूल प्राकृतिक मोती — बिना बताए रंगे/कृत्रिम को शास्त्रीय विकल्प न मानें।",
      },
    },
  },
  mars: {
    planetId: "mars",
    primary: { en: "Red Coral (Moonga)", hi: "मूंगा" },
    substitute: { en: "Carnelian", hi: "कार्नेलियन" },
    benefits: {
      en: "Supports courage, energy, property/land themes and blood vitality when Mars is beneficial and weak.",
      hi: "जब मंगल शुभ पर निर्बल हो — साहस, ऊर्जा, भूमि/संपत्ति और रक्त-शक्ति विषयों में सहारा।",
    },
    wearing: {
      finger: { en: "Ring finger", hi: "अनामिका" },
      metal: { en: "Gold or copper", hi: "सोना या तांबा" },
      day: { en: "Tuesday morning", hi: "मंगलवार सुबह" },
      minCaratNote: {
        en: "Often larger than other gems in classical practice — quality and natural origin matter more than size alone.",
        hi: "शास्त्र में प्रायः अन्य रत्नों से बड़ा — आकार से अधिक गुणवत्ता व प्राकृतिक उत्पत्ति मायने रखती है।",
      },
    },
  },
  mercury: {
    planetId: "mercury",
    primary: { en: "Emerald (Panna)", hi: "पन्ना" },
    substitute: { en: "Peridot / Green Onyx", hi: "पेरिडॉट / हरा ओनिक्स" },
    benefits: {
      en: "Supports intellect, speech, commerce, learning and nervous-system calm when Mercury needs strength.",
      hi: "जब बुध बल चाहता है — बुद्धि, वाणी, व्यापार, अध्ययन और तंत्रिका शांति में सहारा।",
    },
    wearing: {
      finger: { en: "Little finger", hi: "कनिष्ठा" },
      metal: { en: "Gold", hi: "सोना" },
      day: { en: "Wednesday morning", hi: "बुधवार सुबह" },
      minCaratNote: {
        en: "Clarity and untreated colour are critical — heavily oiled emeralds are common; ask for disclosure.",
        hi: "स्पष्टता व अनुपचारित रंग महत्वपूर्ण — तेल लगे पन्ने आम हैं; खुलासा माँगें।",
      },
    },
  },
  jupiter: {
    planetId: "jupiter",
    primary: { en: "Yellow Sapphire (Pukhraj)", hi: "पुखराज" },
    substitute: { en: "Yellow Topaz / Citrine", hi: "पीला टोपाज़ / सिट्रिन" },
    benefits: {
      en: "Supports wisdom, fortune, teachers/mentors, children and dharmic growth when Jupiter is a benefic needing support.",
      hi: "जब गुरु शुभ होकर बल चाहता है — ज्ञान, भाग्य, गुरु/मार्गदर्शक, संतान और धार्मिक विकास में सहारा।",
    },
    wearing: {
      finger: { en: "Index finger", hi: "तर्जनी" },
      metal: { en: "Gold", hi: "सोना" },
      day: { en: "Thursday morning", hi: "गुरुवार सुबह" },
      minCaratNote: {
        en: "Prefer natural yellow sapphire (corundum); citrine is a weaker substitute — disclose if used.",
        hi: "प्राकृतिक पीला पुखराज (कोरंडम) चुनें; सिट्रिन कमज़ोर विकल्प — उपयोग पर बताएँ।",
      },
    },
  },
  venus: {
    planetId: "venus",
    primary: { en: "Diamond (Heera) / White Sapphire", hi: "हीरा / सफ़ेद पुखराज" },
    substitute: { en: "White Topaz / Zircon", hi: "सफ़ेद टोपाज़ / ज़िरकॉन" },
    benefits: {
      en: "Supports harmony, arts, relationships, comfort and creative refinement when Venus needs strength.",
      hi: "जब शुक्र बल चाहता है — सामंजस्य, कला, संबंध, सुख और रचनात्मक परिष्कार में सहारा।",
    },
    wearing: {
      finger: { en: "Middle finger", hi: "मध्यमा" },
      metal: { en: "Silver, white gold or platinum", hi: "चाँदी, व्हाइट गोल्ड या प्लेटिनम" },
      day: { en: "Friday morning", hi: "शुक्रवार सुबह" },
      minCaratNote: {
        en: "White sapphire is a classical accessible alternative to diamond when budget is constrained.",
        hi: "बजट सीमित हो तो हीरे की जगह सफ़ेद पुखराज शास्त्रीय सुलभ विकल्प है।",
      },
    },
  },
  saturn: {
    planetId: "saturn",
    primary: { en: "Blue Sapphire (Neelam)", hi: "नीलम" },
    substitute: { en: "Amethyst / Lapis Lazuli", hi: "अमेथिस्ट / लैपिस लाजुली" },
    substituteWeaker: true,
    highRisk: true,
    benefits: {
      en: "Can accelerate Saturn themes (discipline, karma, longevity of results) — strong effects both ways; traditionally highest-risk gem.",
      hi: "शनि विषयों (अनुशासन, कर्म, परिणामों की दीर्घता) को तेज़ कर सकता है — दोनों दिशाओं में प्रबल; शास्त्र में सर्वाधिक जोखिम वाला रत्न।",
    },
    wearing: {
      finger: { en: "Middle finger", hi: "मध्यमा" },
      metal: { en: "Silver or iron (per tradition)", hi: "चाँदी या लोहा (परंपरा अनुसार)" },
      day: { en: "Saturday — only after trial/astrologer clearance", hi: "शनिवार — केवल परीक्षण/ज्योतिषी अनुमति के बाद" },
      minCaratNote: {
        en: "Trial period often advised before permanent wear. Substitutes are generally much weaker — never present as equivalent.",
        hi: "स्थायी पहनने से पहले परीक्षण अवधि अक्सर सलाह। विकल्प आमतौर पर बहुत कमज़ोर — समकक्ष न बताएँ।",
      },
    },
  },
  rahu: {
    planetId: "rahu",
    primary: { en: "Hessonite (Gomed)", hi: "गोमेद" },
    substitute: { en: "Orange zircon (weaker stand-in)", hi: "नारंगी ज़िरकॉन (कमज़ोर विकल्प)" },
    highRisk: true,
    benefits: {
      en: "Traditionally used to steady Rahu themes (sudden change, foreign, obsession) when Rahu needs balancing — expert judgement required.",
      hi: "जब राहु संतुलन चाहता है — अचानक परिवर्तन, विदेश, आसक्ति विषयों को स्थिर करने हेतु परंपरा में; विशेषज्ञ निर्णय आवश्यक।",
    },
    wearing: {
      finger: { en: "Middle finger", hi: "मध्यमा" },
      metal: { en: "Silver", hi: "चाँदी" },
      day: { en: "Saturday evening — after guidance", hi: "शनिवार संध्या — सलाह के बाद" },
      minCaratNote: {
        en: "Natural hessonite preferred; confirm lab authenticity.",
        hi: "प्राकृतिक गोमेद बेहतर; प्रयोगशाला प्रमाणिकता पुष्टि करें।",
      },
    },
  },
  ketu: {
    planetId: "ketu",
    primary: { en: "Cat's Eye (Lehsunia)", hi: "लहसुनिया (कैट्स आई)" },
    substitute: { en: "Chrysoberyl cat's-eye only if natural — no cheap glass", hi: "केवल प्राकृतिक क्रिसोबेरिल कैट्स-आई — सस्ता काँच नहीं" },
    highRisk: true,
    benefits: {
      en: "Traditionally linked to spiritual detachment, research and Ketu-period protection themes — chart-specific and high-caution.",
      hi: "आध्यात्मिक विरक्ति, शोध और केतु काल सुरक्षा से जुड़ा — कुंडली-विशिष्ट व उच्च सावधानी।",
    },
    wearing: {
      finger: { en: "Middle or little finger", hi: "मध्यमा या कनिष्ठा" },
      metal: { en: "Silver", hi: "चाँदी" },
      day: { en: "Tuesday or Thursday — after guidance", hi: "मंगल या गुरुवार — सलाह के बाद" },
      minCaratNote: {
        en: "Chatoyancy (eye line) must be clear in natural stone.",
        hi: "प्राकृतिक पत्थर में चटोयेंसी (आँख रेखा) स्पष्ट हो।",
      },
    },
  },
};

const SIGN_LORD_ID = [
  "mars",
  "venus",
  "mercury",
  "moon",
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "saturn",
  "jupiter",
] as const satisfies readonly PlanetId[];

const FOCUS_HOUSE: Record<Exclude<FocusArea, "overall">, number> = {
  career: 10,
  marriage: 7,
  health: 6,
  wealth: 2,
};

function planetName(id: string): Loc {
  return PLANET_META[id] ?? { en: id, hi: id };
}

function lordOfHouse(lagnaSign: number, house: number): PlanetId {
  const sign = (lagnaSign + house - 1) % 12;
  return SIGN_LORD_ID[sign];
}

function isStrongPlacement(p: PlanetPosition | undefined): boolean {
  if (!p?.dignity) return false;
  const k = p.dignity.kind;
  return (
    k === "exalted" ||
    k === "own" ||
    k === "moolatrikona" ||
    Boolean(p.dignity.exalted || p.dignity.ownSign || p.dignity.moolatrikona)
  );
}

function isWeakPlacement(p: PlanetPosition | undefined): boolean {
  if (!p) return true;
  if (p.isCombust) return true;
  if (p.dignity?.debilitated || p.dignity?.kind === "debilitated") return true;
  if (p.dignity?.kind === "enemy") return true;
  return false;
}

function relation(
  a: string,
  b: string
): "friend" | "enemy" | "neutral" {
  if (a === b) return "friend";
  if ((PLANET_ENEMIES[a] || []).includes(b)) return "enemy";
  if ((PLANET_FRIENDS[a] || []).includes(b)) return "friend";
  return "neutral";
}

export type GemTrigger =
  | "lagna_lord"
  | "dasha_lord"
  | "antar_lord"
  | "weak_benefic"
  | "focus_house_lord";

export type GemRecommendation = {
  planetId: PlanetId;
  planet: Loc;
  primary: Loc;
  substitute: Loc;
  substituteWeaker: boolean;
  highRisk: boolean;
  benefits: Loc;
  wearing: WearingGuide;
  trigger: GemTrigger;
  reason: Loc;
  contraindications: Loc[];
  status: "recommended" | "caution" | "blocked";
  priority: number;
};

export type GemConflict = {
  a: PlanetId;
  b: PlanetId;
  note: Loc;
};

export type GemstoneReport = {
  focus: FocusArea;
  recommendations: GemRecommendation[];
  conflicts: GemConflict[];
  tierNote: Loc;
  purityNote: Loc;
  consultNote: Loc;
  mantraFirst: Loc;
};

function triggerReason(
  trigger: GemTrigger,
  planetId: PlanetId,
  extra?: string
): Loc {
  const name = planetName(planetId);
  switch (trigger) {
    case "lagna_lord":
      return {
        en: `Recommended because ${name.en} is your Lagna (ascendant) lord — the primary overall-strengthening candidate.`,
        hi: `सुझाव इसलिए कि ${name.hi} आपके लग्न स्वामी हैं — कुल बल हेतु प्राथमिक उम्मीदवार।`,
      };
    case "dasha_lord":
      return {
        en: `Recommended because ${name.en} lords your current Mahadasha — timing-relevant support.`,
        hi: `सुझाव इसलिए कि ${name.hi} आपकी वर्तमान महादशा के स्वामी हैं — समय-संबंधी सहारा।`,
      };
    case "antar_lord":
      return {
        en: `Recommended because ${name.en} lords your current Antardasha — near-term timing support.`,
        hi: `सुझाव इसलिए कि ${name.hi} आपकी वर्तमान अंतर्दशा के स्वामी हैं — निकटकालिक सहारा।`,
      };
    case "weak_benefic":
      return {
        en: `Recommended because ${name.en} appears weak/debilitated/combust${extra ? ` (${extra})` : ""} and may need support if functionally benefic.`,
        hi: `सुझाव इसलिए कि ${name.hi} निर्बल/नीच/अस्त${extra ? ` (${extra})` : ""} दिखते हैं और यदि कार्यात्मक शुभ हों तो सहारा चाह सकते हैं।`,
      };
    case "focus_house_lord":
      return {
        en: `Recommended because ${name.en} rules the house linked to your focus${extra ? ` (${extra})` : ""}.`,
        hi: `सुझाव इसलिए कि ${name.hi} आपके फोकस से जुड़े भाव के स्वामी हैं${extra ? ` (${extra})` : ""}।`,
      };
  }
}

function enToPlanetId(en: string): PlanetId | null {
  const n = en.toLowerCase();
  if (n.includes("sun") || n.includes("surya")) return "sun";
  if (n.includes("moon") || n.includes("chandra")) return "moon";
  if (n.includes("mars") || n.includes("mangal")) return "mars";
  if (n.includes("mercury") || n.includes("budh")) return "mercury";
  if (n.includes("jupiter") || n.includes("guru")) return "jupiter";
  if (n.includes("venus") || n.includes("shukra")) return "venus";
  if (n.includes("saturn") || n.includes("shani")) return "saturn";
  if (n.includes("rahu")) return "rahu";
  if (n.includes("ketu")) return "ketu";
  return null;
}

/**
 * Full chart-aware gemstone recommendation (never Moon-sign-only).
 */
export function recommendGemstones(
  kundli: KundliResult,
  focus: FocusArea = "overall"
): GemstoneReport {
  const lagnaSign = kundli.lagna.signIndex;
  const byId = Object.fromEntries(
    kundli.planets.map((p) => [p.id, p])
  ) as Record<string, PlanetPosition>;

  type Cand = { planetId: PlanetId; trigger: GemTrigger; priority: number; extra?: string };
  const cands: Cand[] = [];

  const lagnaLord = SIGN_LORD_ID[lagnaSign];
  cands.push({ planetId: lagnaLord, trigger: "lagna_lord", priority: 100 });

  const mahaId = enToPlanetId(kundli.dasha?.currentMaha?.planet?.en || "");
  if (mahaId) cands.push({ planetId: mahaId, trigger: "dasha_lord", priority: 90 });

  const antarId = enToPlanetId(kundli.dasha?.currentAntar?.planet?.en || "");
  if (antarId) cands.push({ planetId: antarId, trigger: "antar_lord", priority: 80 });

  if (focus !== "overall") {
    const h = FOCUS_HOUSE[focus];
    const lord = lordOfHouse(lagnaSign, h);
    const label =
      focus === "career"
        ? "10th house / career"
        : focus === "marriage"
          ? "7th house / marriage"
          : focus === "health"
            ? "6th house / health contests"
            : "2nd house / wealth";
    cands.push({
      planetId: lord,
      trigger: "focus_house_lord",
      priority: 95,
      extra: label,
    });
  }

  for (const id of [
    "jupiter",
    "venus",
    "mercury",
    "moon",
    "sun",
    "mars",
  ] as PlanetId[]) {
    const p = byId[id];
    if (isWeakPlacement(p)) {
      const bits: string[] = [];
      if (p?.isCombust) bits.push("combust");
      if (p?.dignity?.debilitated || p?.dignity?.kind === "debilitated")
        bits.push("debilitated");
      if (p?.dignity?.kind === "enemy") bits.push("enemy sign");
      cands.push({
        planetId: id,
        trigger: "weak_benefic",
        priority: 70,
        extra: bits.join(", ") || "weak",
      });
    }
  }

  // Dedupe keeping highest priority trigger
  const best = new Map<PlanetId, Cand>();
  for (const c of cands) {
    const prev = best.get(c.planetId);
    if (!prev || c.priority > prev.priority) best.set(c.planetId, c);
  }

  const importantStrong = kundli.planets.filter(
    (p) =>
      isStrongPlacement(p) ||
      p.id === lagnaLord ||
      p.id === mahaId ||
      Number(p.house) === 1 ||
      Number(p.house) === 10 ||
      Number(p.house) === 9
  );

  const recommendations: GemRecommendation[] = [];

  for (const c of [...best.values()].sort((a, b) => b.priority - a.priority)) {
    const cat = GEM_CATALOG[c.planetId];
    if (!cat) continue;

    const contraindications: Loc[] = [];
    let status: GemRecommendation["status"] = "recommended";

    for (const strong of importantStrong) {
      if (strong.id === c.planetId) continue;
      const rel = relation(c.planetId, strong.id);
      if (rel === "enemy" && isStrongPlacement(strong)) {
        contraindications.push({
          en: `${planetName(c.planetId).en} is classically hostile to ${strong.name.en}, which is strongly/importantly placed — gem may be inappropriate without expert review.`,
          hi: `${planetName(c.planetId).hi} शास्त्र में ${strong.name.hi} से शत्रु हैं, जो यहाँ प्रबल/महत्वपूर्ण हैं — बिना विशेषज्ञ समीक्षा रत्न अनुचित हो सकता है।`,
        });
        status = "caution";
      }
    }

    // Extra caution for Neelam / nodes
    if (cat.highRisk) {
      contraindications.push({
        en: `${cat.primary.en} is traditionally high-impact — trial wear and astrologer clearance strongly advised.`,
        hi: `${cat.primary.hi} परंपरा में उच्च प्रभाव वाला है — परीक्षण पहनना और ज्योतिषी अनुमति अत्यंत आवश्यक।`,
      });
      if (status === "recommended") status = "caution";
    }

    // Block if multiple severe enemy hits vs Lagna lord / Sun when recommending Saturn
    if (
      c.planetId === "saturn" &&
      isStrongPlacement(byId.sun) &&
      (byId.sun?.house === 1 || byId.sun?.house === 9 || byId.sun?.house === 10)
    ) {
      contraindications.push({
        en: "Sun is strong and angular/trinal — classical texts often caution against Blue Sapphire in such charts.",
        hi: "सूर्य प्रबल व केंद्र/त्रिकोण में — ऐसे चार्ट में नीलम हेतु शास्त्र प्रायः सावधान करते हैं।",
      });
      status = "blocked";
    }

    recommendations.push({
      planetId: c.planetId,
      planet: planetName(c.planetId),
      primary: cat.primary,
      substitute: cat.substitute,
      substituteWeaker: Boolean(cat.substituteWeaker),
      highRisk: Boolean(cat.highRisk),
      benefits: cat.benefits,
      wearing: cat.wearing,
      trigger: c.trigger,
      reason: triggerReason(c.trigger, c.planetId, c.extra),
      contraindications,
      status,
      priority: c.priority,
    });
  }

  // Keep top actionable set (not a laundry list)
  const filtered = recommendations
    .filter((r) => r.status !== "blocked")
    .slice(0, 4);

  const conflicts: GemConflict[] = [];
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      const a = filtered[i].planetId;
      const b = filtered[j].planetId;
      const pair = CONFLICTING_GEM_PAIRS.find(
        ([x, y]) => (x === a && y === b) || (x === b && y === a)
      );
      if (pair || relation(a, b) === "enemy") {
        conflicts.push({
          a,
          b,
          note: {
            en: `Do not wear ${filtered[i].primary.en} and ${filtered[j].primary.en} together without explicit caveat — ${planetName(a).en} and ${planetName(b).en} are classically inimical.`,
            hi: `${filtered[i].primary.hi} और ${filtered[j].primary.hi} एक साथ बिना स्पष्ट चेतावनी न पहनें — ${planetName(a).hi} व ${planetName(b).hi} शास्त्र में शत्रु हैं।`,
          },
        });
      }
    }
  }

  return {
    focus,
    recommendations: filtered,
    conflicts,
    tierNote: {
      en: "Tier 2 remedy: prefer Tier 1 first (mantra, charity, lifestyle), then gemstone, then Tier 3 puja/consultation for complex cases.",
      hi: "स्तर 2 उपाय: पहले स्तर 1 (मंत्र, दान, जीवनशैली), फिर रत्न, जटिल मामलों में स्तर 3 पूजा/परामर्श।",
    },
    purityNote: {
      en: "Classical texts specify natural, untreated stones of proper weight. Synthetic/treated stones are widely sold but traditionally considered ineffective — disclose origin and treatment before purchase.",
      hi: "शास्त्र प्राकृतिक, अनुपचारित उचित भार के रत्न बताते हैं। कृत्रिम/उपचारित रत्न आम हैं पर परंपरा में प्रभावहीन माने जाते हैं — खरीद से पहले उत्पत्ति व उपचार बताएँ।",
    },
    consultNote: {
      en: "Confirm with a qualified astrologer before a significant purchase — cost and contraindication risk both matter.",
      hi: "बड़ी खरीद से पहले योग्य ज्योतिषी से पुष्टि करें — लागत और प्रतिषेध दोनों मायने रखते हैं।",
    },
    mantraFirst: {
      en: "Start with planet-specific mantra, dana (charity) and daily discipline before investing in costly gems.",
      hi: "मँहगे रत्न से पहले ग्रह-विशिष्ट मंत्र, दान और दैनिक अनुशासन से आरंभ करें।",
    },
  };
}

/** Backward-compatible lagna-lord gem lookup used by older callers. */
export function gemstoneForSign(signIndex: number) {
  const planet = SIGN_LORD_ID[signIndex];
  const cat = GEM_CATALOG[planet];
  return {
    sign: { en: SIGNS[signIndex].en, hi: SIGNS[signIndex].hi },
    lord: SIGN_LORDS[signIndex],
    planet: PLANET_META[planet],
    gem: {
      en: cat.primary.en,
      hi: cat.primary.hi,
      wear: {
        en: `${cat.wearing.metal.en}, ${cat.wearing.finger.en}, ${cat.wearing.day.en}`,
        hi: `${cat.wearing.metal.hi}, ${cat.wearing.finger.hi}, ${cat.wearing.day.hi}`,
      },
    },
    substitute: cat.substitute,
    benefits: cat.benefits,
    wearing: cat.wearing,
    reason: {
      en: `Mapped to Lagna lord ${PLANET_META[planet].en} only — prefer full chart recommendGemstones() for friendship checks.`,
      hi: `केवल लग्न स्वामी ${PLANET_META[planet].hi} से मैप — मित्रता जाँच हेतु पूर्ण recommendGemstones() बेहतर।`,
    },
    disclaimer: {
      en: "Gemstones can strengthen or disturb — confirm with a full chart reading. Natural untreated stones preferred.",
      hi: "रत्न लाभ या हानि दोनों कर सकते हैं — पूर्ण कुंडली से पुष्टि करें। प्राकृतिक अनुपचारित रत्न बेहतर।",
    },
  };
}
