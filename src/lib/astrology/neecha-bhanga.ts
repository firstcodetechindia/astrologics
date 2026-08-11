/**
 * Neecha Bhanga Raja Yoga — deterministic cancellation of debilitation.
 * Only reported when at least one classical cancellation rule matches.
 */
import { SIGN_LORDS } from "./constants";
import type { PlanetPosition, YogaFlag } from "./types";

const DEBIL_SIGN: Record<string, number> = {
  sun: 6,
  moon: 7,
  mars: 3,
  mercury: 11,
  jupiter: 9,
  venus: 5,
  saturn: 0,
};

/** Planet exalted in each sign (inverse of exaltation table). */
const EXALTED_IN_SIGN: Record<number, string> = {
  0: "sun", // Aries
  1: "moon", // Taurus
  3: "jupiter", // Cancer
  5: "mercury", // Virgo
  6: "saturn", // Libra
  9: "mars", // Capricorn
  11: "venus", // Pisces
};

function lordIdOfSign(signIndex: number): string {
  return SIGN_LORDS[signIndex].en.toLowerCase();
}

function isKendraHouse(h: number) {
  return [1, 4, 7, 10].includes(h);
}

function houseFromSign(fromSign: number, bodySign: number) {
  return ((bodySign - fromSign + 12) % 12) + 1;
}

export type NeechaBhangaResult = {
  detected: boolean;
  planetId: string;
  planetName: { en: string; hi: string };
  rulesMatched: string[];
  participatingPlanets: string[];
  explanation: { en: string; hi: string };
};

/**
 * Supported cancellation rules (explicit):
 * 1. Lord of debilitation sign in kendra from Lagna
 * 2. Lord of debilitation sign in kendra from Moon
 * 3. Planet that is exalted in the debilitation sign occupies a kendra from Lagna
 * 4. Debilitated planet conjunct its dispositor
 * 5. Debilitated planet itself in kendra from Lagna
 */
export function neechaBhangaForPlanet(
  planet: PlanetPosition,
  planets: PlanetPosition[]
): NeechaBhangaResult | null {
  const debilSign = DEBIL_SIGN[planet.id];
  if (debilSign == null || planet.signIndex !== debilSign) return null;

  const byId = Object.fromEntries(planets.map((p) => [p.id, p]));
  const moon = byId.moon;
  const rulesMatched: string[] = [];
  const participating: string[] = [planet.id];

  const dispositorId = lordIdOfSign(debilSign);
  const dispositor = byId[dispositorId];

  if (dispositor && isKendraHouse(dispositor.house)) {
    rulesMatched.push(
      `Dispositor ${dispositor.name.en} (lord of debilitation sign) in kendra from Lagna (H${dispositor.house})`
    );
    participating.push(dispositor.id);
  }

  if (dispositor && moon) {
    const h = houseFromSign(moon.signIndex, dispositor.signIndex);
    if (isKendraHouse(h)) {
      rulesMatched.push(
        `Dispositor ${dispositor.name.en} in kendra from Moon (count ${h})`
      );
      participating.push(dispositor.id);
    }
  }

  const exaltedId = EXALTED_IN_SIGN[debilSign];
  if (exaltedId && exaltedId !== planet.id) {
    const ex = byId[exaltedId];
    if (ex && isKendraHouse(ex.house)) {
      rulesMatched.push(
        `${ex.name.en} (exalted in this debilitation sign) occupies kendra H${ex.house}`
      );
      participating.push(ex.id);
    }
  }

  if (dispositor && dispositor.signIndex === planet.signIndex) {
    rulesMatched.push(
      `Debilitated ${planet.name.en} conjunct dispositor ${dispositor.name.en}`
    );
    participating.push(dispositor.id);
  }

  if (isKendraHouse(planet.house)) {
    rulesMatched.push(
      `Debilitated ${planet.name.en} itself occupies kendra H${planet.house}`
    );
  }

  if (!rulesMatched.length) {
    return {
      detected: false,
      planetId: planet.id,
      planetName: planet.name,
      rulesMatched: [],
      participatingPlanets: [planet.id],
      explanation: {
        en: `${planet.name.en} is debilitated in ${planet.sign.en}, but no supported Neecha Bhanga cancellation rule matched.`,
        hi: `${planet.name.hi} ${planet.sign.hi} में नीच हैं, पर समर्थित नीच भंग नियम नहीं मिला।`,
      },
    };
  }

  return {
    detected: true,
    planetId: planet.id,
    planetName: planet.name,
    rulesMatched,
    participatingPlanets: [...new Set(participating)],
    explanation: {
      en: `Neecha Bhanga for ${planet.name.en}: ${rulesMatched.join("; ")}.`,
      hi: `${planet.name.hi} के लिए नीच भंग: ${rulesMatched.join("; ")}.`,
    },
  };
}

export function detectNeechaBhangaYogas(
  planets: PlanetPosition[],
  _lagnaSign?: number
): { results: NeechaBhangaResult[]; yogaFlags: YogaFlag[] } {
  void _lagnaSign;
  const results: NeechaBhangaResult[] = [];
  const yogaFlags: YogaFlag[] = [];

  for (const p of planets) {
    if (DEBIL_SIGN[p.id] == null) continue;
    const r = neechaBhangaForPlanet(p, planets);
    if (!r) continue;
    results.push(r);
    if (r.detected) {
      yogaFlags.push({
        id: `neecha-bhanga-${p.id}`,
        name: {
          en: `Neecha Bhanga Raja Yoga (${p.name.en})`,
          hi: `नीच भंग राज योग (${p.name.hi})`,
        },
        level: "positive",
        meaning: {
          en: `${r.explanation.en} Participating: ${r.participatingPlanets.join(", ")}.`,
          hi: `${r.explanation.hi} ग्रह: ${r.participatingPlanets.join(", ")}.`,
        },
      });
    }
  }

  return { results, yogaFlags };
}
