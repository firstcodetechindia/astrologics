import type { PlanetPosition } from "./types";
import { SIGNS } from "./constants";
import { lahiriAyanamsaFromDate, signIndexFromLongitude } from "./math";
import { getSiderealPlanets } from "./planets";

export function mangalDosha(planets: PlanetPosition[], lagnaSign: number) {
  const mars = planets.find((p) => p.id === "mars");
  if (!mars) return { present: false, houses: [] as number[], exceptions: [] as string[] };

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
    exceptions,
    meaning: {
      en: afflicted
        ? `Mars in house ${house} is classically checked for Manglik indications.`
        : "Mars is not in the classic Manglik houses (1, 2, 4, 7, 8, 12).",
      hi: afflicted
        ? `मंगल ${house} भाव में — शास्त्रीय मंगलिक जाँच लागू।`
        : "मंगल शास्त्रीय मंगलिक भावों (1, 2, 4, 7, 8, 12) में नहीं है।",
    },
  };
}

export function kaalSarpDosha(planets: PlanetPosition[]) {
  const rahu = planets.find((p) => p.id === "rahu");
  const ketu = planets.find((p) => p.id === "ketu");
  if (!rahu || !ketu) return { present: false };

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

/** Sade Sati: Saturn transit over 12th, 1st, 2nd from Moon sign. */
export function sadeSati(moonSignIndex: number, asOf = new Date()) {
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
    rising: { en: "Rising phase (Saturn in 12th from Moon)", hi: "आरंभ चरण (चंद्र से 12वें में शनि)" },
    peak: { en: "Peak phase (Saturn on Moon sign)", hi: "मध्य चरण (चंद्र राशि पर शनि)" },
    setting: { en: "Setting phase (Saturn in 2nd from Moon)", hi: "अंतिम चरण (चंद्र से 2रे में शनि)" },
  };

  return {
    active: phase !== "none",
    phase,
    phaseLabel: labels[phase],
    moonSign: { en: SIGNS[moonSignIndex].en, hi: SIGNS[moonSignIndex].hi },
    saturnSign: { en: SIGNS[satSign].en, hi: SIGNS[satSign].hi },
    asOf: asOf.toISOString(),
  };
}
