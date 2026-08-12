import type { PlanetPosition } from "./types";
import { trackSadeSati } from "./sade-sati-tracker";

export { mangalDosha } from "./doshas-mangal";
export type { MangalCancellation } from "./doshas-mangal";

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
  const t = trackSadeSati(moonSignIndex, asOf);

  const base = {
    active: t.active,
    present: t.active,
    phase: t.phaseKey,
    phaseNum: t.phase,
    phaseLabel: t.phaseLabel,
    moonSign: {
      en: t.natalMoonSign.en,
      hi: t.natalMoonSign.hi,
    },
    saturnSign: {
      en: t.saturnSign.en,
      hi: t.saturnSign.hi,
    },
    asOf: t.asOf,
    methodology: t.methodology,
    intensityHint: t.intensityHint,
    basedOn: t.basedOn,
    disclaimer: t.disclaimer,
    fullCycle: t.fullCycle,
    currentWindow: t.currentWindow,
    dhaiyaEnabled: t.dhaiyaEnabled,
    meaning: t.phaseLabel,
    tracker: t,
  };

  if (!opts?.includeWindow) return base;

  return {
    ...base,
    startDate: t.fullCycle[0]?.start ?? null,
    endDate: t.fullCycle[t.fullCycle.length - 1]?.end ?? null,
    currentPhaseStart: t.currentWindow?.start ?? null,
    currentPhaseEnd: t.currentWindow?.end ?? null,
  };
}
