import type { PlanetPosition } from "./types";
import { SIGNS } from "./constants";
import { lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { getSiderealPlanets } from "./planets";

export function mangalDosha(planets: PlanetPosition[], lagnaSign: number) {
  const mars = planets.find((p) => p.id === "mars");
  if (!mars)
    return {
      present: false,
      houses: [] as number[],
      exceptions: [] as { en: string; hi: string }[],
      meaning: {
        en: "Mars not found in chart.",
        hi: "कुंडली में मंगल नहीं मिला।",
      },
    };

  const house = mars.house;
  const afflicted = [1, 2, 4, 7, 8, 12].includes(house);
  const exceptions: { en: string; hi: string }[] = [];

  // Classical soft exceptions (simplified)
  if (mars.signIndex === lagnaSign) {
    exceptions.push({
      en: "Mars in lagna — check cancellation yogas with an expert.",
      hi: "मंगल लग्न में — विशेषज्ञ से दोष निवारण योग जाँचें।",
    });
  }
  const jupiter = planets.find((p) => p.id === "jupiter");
  if (jupiter && Math.abs(jupiter.house - house) % 12 <= 1) {
    exceptions.push({
      en: "Jupiter near Mars may soften Mangal dosha.",
      hi: "गुरु के निकट मंगल दोष को कम कर सकता है।",
    });
  }

  return {
    present: afflicted,
    house,
    sign: mars.sign,
    level: afflicted
      ? house === 7 || house === 8
        ? "strong"
        : "moderate"
      : "none",
    methodology: {
      en: "Lagna-based Manglik: Mars in houses 1, 2, 4, 7, 8, or 12 from Ascendant. Moon/Venus charts not auto-merged into a single verdict.",
      hi: "लग्न-आधारित मांगलिक: लग्न से भाव 1, 2, 4, 7, 8 या 12 में मंगल। चंद्र/शुक्र कुंडली को एक ही निर्णय में नहीं मिलाया गया।",
    },
    exceptions,
    meaning: {
      en: afflicted
        ? `Mars in house ${house} from Lagna is classically checked for Manglik indications.`
        : "Mars is not in the classic Manglik houses from Lagna (1, 2, 4, 7, 8, 12).",
      hi: afflicted
        ? `मंगल लग्न से ${house} भाव में — शास्त्रीय मंगलिक जाँच लागू।`
        : "मंगल लग्न से शास्त्रीय मंगलिक भावों (1, 2, 4, 7, 8, 12) में नहीं है।",
    },
  };
}

export function kaalSarpDosha(planets: PlanetPosition[]) {
  const rahu = planets.find((p) => p.id === "rahu");
  const ketu = planets.find((p) => p.id === "ketu");
  if (!rahu || !ketu)
    return {
      present: false,
      meaning: {
        en: "Nodes not found in chart.",
        hi: "कुंडली में राहु–केतु नहीं मिले।",
      },
    };

  const others = planets.filter((p) => !["rahu", "ketu"].includes(p.id));
  const rLon = rahu.longitude;
  const kLon = ketu.longitude;

  // All planets between Rahu→Ketu arc (one side of the axis)
  const inArc = (lon: number, from: number, to: number) => {
    const a = ((lon - from + 360) % 360);
    const span = ((to - from + 360) % 360);
    return a > 0 && a < span;
  };

  const allInRahuKetu = others.every((p) => inArc(p.longitude, rLon, kLon));
  const allInKetuRahu = others.every((p) => inArc(p.longitude, kLon, rLon));
  const present = allInRahuKetu || allInKetuRahu;

  return {
    present,
    type: present
      ? allInRahuKetu
        ? { en: "Planets between Rahu and Ketu", hi: "राहु से केतु के बीच ग्रह" }
        : { en: "Planets between Ketu and Rahu", hi: "केतु से राहु के बीच ग्रह" }
      : null,
    rahuSign: rahu.sign,
    ketuSign: ketu.sign,
    meaning: {
      en: present
        ? "All planets lie on one side of the Rahu–Ketu axis — classical Kaal Sarp pattern."
        : "Planets are not all hemmed between Rahu and Ketu.",
      hi: present
        ? "सभी ग्रह राहु–केतु अक्ष के एक ओर — शास्त्रीय काल सर्प पैटर्न।"
        : "ग्रह राहु–केतु के बीच पूरी तरह नहीं हैं।",
    },
  };
}

export function pitraDosha(planets: PlanetPosition[]) {
  const sun = planets.find((p) => p.id === "sun")!;
  const rahu = planets.find((p) => p.id === "rahu");
  const ketu = planets.find((p) => p.id === "ketu");
  const flags: { en: string; hi: string }[] = [];

  if (sun.house === 9) {
    flags.push({
      en: "Sun in 9th — review ancestral / father themes carefully.",
      hi: "सूर्य नवम भाव में — पितृ / पिता विषय ध्यान से देखें।",
    });
  }
  if (rahu && (rahu.house === 9 || Math.abs(rahu.signIndex - sun.signIndex) === 0)) {
    flags.push({
      en: "Rahu linked to Sun or 9th — classical Pitra indication to verify.",
      hi: "राहु सूर्य या नवम से जुड़ा — पितृ दोष जाँचें।",
    });
  }
  if (ketu && ketu.house === 9) {
    flags.push({
      en: "Ketu in 9th — ancestral karma theme may be active.",
      hi: "केतु नवम में — पैतृक कर्म विषय सक्रिय हो सकता है।",
    });
  }

  return {
    present: flags.length > 0,
    flags,
    meaning: {
      en: flags.length
        ? "Possible Pitra-related flags — confirm with full chart and family history."
        : "No strong Sun/9th/node Pitra flags in this simplified check.",
      hi: flags.length
        ? "संभावित पितृ संकेत — पूर्ण कुंडली से पुष्टि करें।"
        : "इस सरल जाँच में स्पष्ट पितृ दोष संकेत नहीं।",
    },
  };
}

/** Sade Sati: Saturn transit over 12th, 1st, 2nd from natal Moon sign. */
export function sadeSati(
  moonSignIndex: number,
  asOf = new Date(),
  opts?: { includeWindow?: boolean }
) {
  const ayanamsa = lahiriAyanamsaFromDate(asOf);
  const { planets } = getSiderealPlanets(asOf, ayanamsa);
  const saturn = planets.find((p) => p.id === "saturn")!;
  const satSign = signIndexFromLongitude(saturn.longitude);
  const twelfth = (moonSignIndex + 11) % 12;
  const first = moonSignIndex;
  const second = (moonSignIndex + 1) % 12;

  let phase: "none" | "rising" | "peak" | "setting" = "none";
  if (satSign === twelfth) phase = "rising";
  else if (satSign === first) phase = "peak";
  else if (satSign === second) phase = "setting";

  const labels = {
    none: { en: "Not in Sade Sati now", hi: "अभी साढ़े साती नहीं" },
    rising: {
      en: "Rising phase (Saturn in 12th from Moon)",
      hi: "आरंभ चरण (चंद्र से 12वें में शनि)",
    },
    peak: {
      en: "Peak phase (Saturn on Moon sign)",
      hi: "मध्य चरण (चंद्र राशि पर शनि)",
    },
    setting: {
      en: "Setting phase (Saturn in 2nd from Moon)",
      hi: "अंतिम चरण (चंद्र से 2रे में शनि)",
    },
  };

  const base = {
    active: phase !== "none",
    phase,
    phaseLabel: labels[phase],
    moonSign: { en: SIGNS[moonSignIndex].en, hi: SIGNS[moonSignIndex].hi },
    saturnSign: { en: SIGNS[satSign].en, hi: SIGNS[satSign].hi },
    asOf: asOf.toISOString(),
    methodology: {
      en: "Saturn sidereal sign vs natal Moon sign: 12th (rising), Moon sign (peak), 2nd (setting).",
      hi: "शनि की सायन राशि बनाम जन्म चंद्र राशि: 12वाँ (आरंभ), चंद्र राशि (मध्य), 2रा (अंत)।",
    },
  };

  if (!opts?.includeWindow) return base;

  const window = estimateSadeSatiWindow(moonSignIndex, asOf);
  return {
    ...base,
    startDate: window.startDate,
    endDate: window.endDate,
    currentPhaseStart: window.currentPhaseStart,
    currentPhaseEnd: window.currentPhaseEnd,
  };
}

/**
 * Scan Saturn's sidereal sign monthly to estimate Sade Sati start/end.
 * Deterministic from ephemeris — not AI. Monthly resolution (~±1 month).
 */
function estimateSadeSatiWindow(moonSignIndex: number, asOf: Date) {
  const twelfth = (moonSignIndex + 11) % 12;
  const first = moonSignIndex;
  const second = (moonSignIndex + 1) % 12;
  const inSade = (sign: number) =>
    sign === twelfth || sign === first || sign === second;
  const phaseOf = (sign: number) =>
    sign === twelfth ? "rising" : sign === first ? "peak" : sign === second ? "setting" : "none";

  const satSignAt = (d: Date) => {
    const a = lahiriAyanamsaFromDate(d);
    const { planets } = getSiderealPlanets(d, a);
    return signIndexFromLongitude(
      planets.find((p) => p.id === "saturn")!.longitude
    );
  };

  // Scan ±12 years monthly
  const startScan = new Date(asOf);
  startScan.setUTCFullYear(startScan.getUTCFullYear() - 12);
  const samples: { iso: string; sign: number; phase: string }[] = [];
  const cursor = new Date(startScan);
  for (let i = 0; i < 24 * 12; i++) {
    const sign = satSignAt(cursor);
    samples.push({
      iso: cursor.toISOString().slice(0, 10),
      sign,
      phase: phaseOf(sign),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const asOfIso = asOf.toISOString().slice(0, 10);
  let startDate: string | null = null;
  let endDate: string | null = null;
  let currentPhaseStart: string | null = null;
  let currentPhaseEnd: string | null = null;
  const currentSign = satSignAt(asOf);
  const currentPhase = phaseOf(currentSign);

  // Find contiguous Sade Sati block containing asOf (if active)
  for (let i = 0; i < samples.length; i++) {
    if (!inSade(samples[i].sign)) continue;
    let j = i;
    while (j + 1 < samples.length && inSade(samples[j + 1].sign)) j++;
    const blockStart = samples[i].iso;
    const blockEnd = samples[j].iso;
    if (asOfIso >= blockStart && asOfIso <= blockEnd) {
      startDate = blockStart;
      endDate = blockEnd;
      break;
    }
    // upcoming block
    if (!startDate && asOfIso < blockStart) {
      startDate = blockStart;
      endDate = blockEnd;
      break;
    }
    i = j;
  }

  if (currentPhase !== "none") {
    for (let i = 0; i < samples.length; i++) {
      if (samples[i].phase !== currentPhase) continue;
      let j = i;
      while (j + 1 < samples.length && samples[j + 1].phase === currentPhase)
        j++;
      if (asOfIso >= samples[i].iso && asOfIso <= samples[j].iso) {
        currentPhaseStart = samples[i].iso;
        currentPhaseEnd = samples[j].iso;
        break;
      }
      i = j;
    }
  }

  return { startDate, endDate, currentPhaseStart, currentPhaseEnd };
}
