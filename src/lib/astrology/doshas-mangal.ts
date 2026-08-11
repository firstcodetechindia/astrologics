/**
 * Manglik (Mangal Dosha) with classical cancellation checks.
 * Present flag = Mars in affliction houses; cancellations reduce severity.
 */
import type { PlanetPosition } from "./types";

const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12] as const;
const MARS_OWN = [0, 7]; // Aries, Scorpio
const MARS_EXALT = 9; // Capricorn
const MARS_DEBIL = 3; // Cancer

function houseFromSign(fromSign: number, planetSign: number) {
  return ((planetSign - fromSign + 12) % 12) + 1;
}

function aspectsHouse(fromHouse: number, toHouse: number, aspectHouses: number[]) {
  const dist = ((toHouse - fromHouse + 12) % 12) + 1;
  return aspectHouses.includes(dist);
}

export type MangalCancellation = {
  id: string;
  en: string;
  hi: string;
};

export function mangalDosha(planets: PlanetPosition[], lagnaSign: number) {
  const mars = planets.find((p) => p.id === "mars");
  if (!mars) {
    return {
      present: false,
      cancelled: false,
      severity: "none" as const,
      houses: [] as number[],
      fromLagna: null as number | null,
      fromMoon: null as number | null,
      cancellations: [] as MangalCancellation[],
      exceptions: [] as { en: string; hi: string }[],
      meaning: {
        en: "Mars not found in chart.",
        hi: "कुंडली में मंगल नहीं मिला।",
      },
      methodology: {
        en: "Lagna + Moon chart Manglik houses 1,2,4,7,8,12 with classical cancellation checks.",
        hi: "लग्न व चंद्र कुंडली मांगलिक भाव 1,2,4,7,8,12 + शास्त्रीय निवारण जाँच।",
      },
    };
  }

  const moon = planets.find((p) => p.id === "moon");
  const jupiter = planets.find((p) => p.id === "jupiter");
  const saturn = planets.find((p) => p.id === "saturn");
  const venus = planets.find((p) => p.id === "venus");
  const rahu = planets.find((p) => p.id === "rahu");

  const fromLagna = mars.house;
  const fromMoon = moon
    ? houseFromSign(moon.signIndex, mars.signIndex)
    : null;

  const lagnaAfflicted = (MANGLIK_HOUSES as readonly number[]).includes(
    fromLagna
  );
  const moonAfflicted =
    fromMoon != null &&
    (MANGLIK_HOUSES as readonly number[]).includes(fromMoon);

  /** Primary flag = Lagna chart (backward-compatible with classic checks). */
  const present = lagnaAfflicted;
  const presentFromMoon = moonAfflicted;
  const presentAny = lagnaAfflicted || moonAfflicted;
  const cancellations: MangalCancellation[] = [];

  // 1. Mars in own / exaltation
  if (MARS_OWN.includes(mars.signIndex) || mars.signIndex === MARS_EXALT) {
    cancellations.push({
      id: "own-exalt",
      en: "Mars in own sign or Capricorn exaltation — classical cancellation factor.",
      hi: "मंगल स्वराशि या मकर उच्च में — शास्त्रीय निवारण कारक।",
    });
  }

  // 2. Mars debilitated in Cancer — often treated carefully (not always cancel)
  if (mars.signIndex === MARS_DEBIL) {
    cancellations.push({
      id: "debil-note",
      en: "Mars debilitated in Cancer — Manglik tone changes; confirm with full chart (not auto-cleared).",
      hi: "मंगल कर्क में नीच — मांगलिक स्वर बदलता है; पूर्ण कुंडली से पुष्टि (स्वतः निरस्त नहीं)।",
    });
  }

  // 3. Jupiter aspects Mars (5th/7th/9th graha drishti from Jupiter house)
  if (jupiter && aspectsHouse(jupiter.house, mars.house, [5, 7, 9])) {
    cancellations.push({
      id: "jupiter-aspect",
      en: `Jupiter from house ${jupiter.house} aspects Mars (graha drishti) — softens Manglik.`,
      hi: `गुरु भाव ${jupiter.house} से मंगल पर दृष्टि — मांगलिक शिथिल।`,
    });
  }

  // 4. Jupiter conjoined Mars
  if (jupiter && jupiter.signIndex === mars.signIndex) {
    cancellations.push({
      id: "jupiter-conjunction",
      en: "Jupiter conjunct Mars — widely cited cancellation / softening.",
      hi: "गुरु-मंगल युति — प्रचलित निवारण/शिथिलता।",
    });
  }

  // 5. Saturn aspects or conjuncts Mars
  if (saturn && (saturn.signIndex === mars.signIndex || aspectsHouse(saturn.house, mars.house, [3, 7, 10]))) {
    cancellations.push({
      id: "saturn-aspect",
      en: "Saturn association with Mars — some schools treat as cancellation.",
      hi: "शनि-मंगल संबंध — कुछ परंपराओं में निवारण माना जाता है।",
    });
  }

  // 6. Mars in 2nd only — milder in many schools
  if (fromLagna === 2 && !moonAfflicted) {
    cancellations.push({
      id: "second-house-mild",
      en: "Mars only in 2nd from Lagna — often considered milder Manglik.",
      hi: "केवल द्वितीय भाव में मंगल — प्रायः हल्का मांगलिक।",
    });
  }

  // 7. Venus / Rahu with Mars in certain contexts (soft note)
  if (venus && venus.signIndex === mars.signIndex) {
    cancellations.push({
      id: "venus-conjunction",
      en: "Venus with Mars — relational tone changes; verify before fear-based conclusions.",
      hi: "शुक्र-मंगल युति — संबंध स्वर बदलता है; भय से पहले जाँचें।",
    });
  }
  if (rahu && rahu.signIndex === mars.signIndex) {
    cancellations.push({
      id: "rahu-conjunction",
      en: "Rahu with Mars (Angarak yoga zone) — separate from pure Manglik; read carefully.",
      hi: "राहु-मंगल (आंगारक क्षेत्र) — शुद्ध मांगलिक से अलग; सावधानी से पढ़ें।",
    });
  }

  // Strong cancellations that can mark "cancelled" for report severity
  const strongCancelIds = new Set([
    "own-exalt",
    "jupiter-aspect",
    "jupiter-conjunction",
    "saturn-aspect",
  ]);
  const strongCount = cancellations.filter((c) =>
    strongCancelIds.has(c.id)
  ).length;
  const cancelled = presentAny && strongCount >= 1;

  let severity: "none" | "mild" | "moderate" | "strong" | "cancelled" = "none";
  if (!presentAny) severity = "none";
  else if (cancelled) severity = "cancelled";
  else if (fromLagna === 7 || fromLagna === 8 || fromMoon === 7 || fromMoon === 8)
    severity = "strong";
  else if (fromLagna === 2 || cancellations.some((c) => c.id === "second-house-mild"))
    severity = "mild";
  else severity = "moderate";

  const exceptions = cancellations.map((c) => ({ en: c.en, hi: c.hi }));

  return {
    present,
    presentFromMoon,
    presentAny,
    cancelled,
    severity,
    level: severity,
    house: fromLagna,
    fromLagna,
    fromMoon,
    sign: mars.sign,
    lagnaAfflicted,
    moonAfflicted,
    cancellations,
    exceptions,
    methodology: {
      en: "Primary Manglik = Mars in 1/2/4/7/8/12 from Lagna. Moon-chart Manglik reported separately. Cancellations: own/exalt, Jupiter aspect/conjunction, Saturn association.",
      hi: "मुख्य मांगलिक = लग्न से 1/2/4/7/8/12 में मंगल। चंद्र-कुंडली मांगलिक अलग। निवारण: स्व/उच्च, गुरु, शनि।",
    },
    meaning: {
      en: !presentAny
        ? "Mars is not in classic Manglik houses from Lagna or Moon (1, 2, 4, 7, 8, 12)."
        : cancelled
          ? `Manglik pattern present (Lagna house ${fromLagna}${presentFromMoon ? `, Moon house ${fromMoon}` : ""}), but ${strongCount} classical cancellation factor(s) apply — treat as softened/cancelled pending full matching.`
          : present
            ? `Mars in house ${fromLagna} from Lagna${presentFromMoon ? ` and house ${fromMoon} from Moon` : ""} — Manglik indication (severity ${severity}).`
            : `Mars not Manglik from Lagna, but in house ${fromMoon} from Moon — Moon-chart Manglik note (severity ${severity}).`,
      hi: !presentAny
        ? "मंगल लग्न या चंद्र से शास्त्रीय मांगलिक भावों (1, 2, 4, 7, 8, 12) में नहीं।"
        : cancelled
          ? `मांगलिक पैटर्न है (लग्न भाव ${fromLagna}${presentFromMoon ? `, चंद्र भाव ${fromMoon}` : ""}), पर ${strongCount} निवारण कारक — शिथिल/निरस्त मानें।`
          : present
            ? `मंगल लग्न से ${fromLagna} भाव${presentFromMoon ? ` व चंद्र से ${fromMoon}` : ""} — मांगलिक संकेत (तीव्रता ${severity})।`
            : `लग्न से मांगलिक नहीं, पर चंद्र से भाव ${fromMoon} — चंद्र-कुंडली मांगलिक नोट (तीव्रता ${severity})।`,
    },
  };
}
