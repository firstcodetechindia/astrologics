/**
 * Hard AI post-filter: reject/flag claims not present on the cached fact-sheet.
 */
import {
  planetIdFromAlias,
  type ChartFactSheet,
} from "@/lib/ai/chart-fact-sheet";

export type FilterViolation = {
  kind: "planet_sign" | "lagna" | "nakshatra" | "dasha" | "degree";
  claim: string;
  detail: string;
};

export type FilterResult = {
  ok: boolean;
  text: string;
  violations: FilterViolation[];
  flagged: boolean;
};

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_RE = SIGNS.join("|");
const PLANET_RE =
  "Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu|Surya|Chandra|Mangal|Budha|Guru|Shukra|Shani";

function normalizeSign(s: string) {
  const t = s.trim().toLowerCase();
  return SIGNS.find((x) => x.toLowerCase() === t) ?? s.trim();
}

function planetFact(sheet: ChartFactSheet, id: string) {
  return sheet.planets.find((p) => p.id === id);
}

/** True when the sentence asserts a period is active *now*, not historical. */
function isCurrentPeriodClaim(sentence: string): boolean {
  return /\b(?:running\s+now|currently|presently(?:\s+in)?|is\s+now\s+running|now\s+running|at\s+present|right\s+now|present\s+period|अब\s+चल\s*रहा|वर्तमान)\b/i.test(
    sentence
  );
}

function periodKindFromClaim(claim: string): "maha" | "antar" | "pratyantar" | "any" {
  if (/pratyantar/i.test(claim)) return "pratyantar";
  if (/antar/i.test(claim)) return "antar";
  if (/maha/i.test(claim)) return "maha";
  return "any";
}

function normLord(name: string) {
  return name.trim().toLowerCase();
}

/**
 * Current-period phrasing → only current maha/antar/pratyantar from fact-sheet.
 * Historical mentions → full sequence allowlist still OK.
 */
function allowedDashaLord(
  sheet: ChartFactSheet,
  name: string,
  sentence: string,
  claim: string
): boolean {
  const n = normLord(name);
  if (isCurrentPeriodClaim(sentence)) {
    const kind = periodKindFromClaim(claim);
    const pool =
      kind === "maha"
        ? [sheet.dasha.currentMaha]
        : kind === "antar"
          ? [sheet.dasha.currentAntar]
          : kind === "pratyantar"
            ? [sheet.dasha.currentPratyantar]
            : [
                sheet.dasha.currentMaha,
                sheet.dasha.currentAntar,
                sheet.dasha.currentPratyantar,
              ];
    return pool
      .filter(Boolean)
      .map((x) => normLord(String(x)))
      .includes(n);
  }
  const pool = [
    sheet.dasha.currentMaha,
    sheet.dasha.currentAntar,
    sheet.dasha.currentPratyantar,
    ...sheet.dasha.mahaLords,
    ...sheet.dasha.antarLords,
  ]
    .filter(Boolean)
    .map((x) => normLord(String(x)));
  return pool.includes(n);
}

/**
 * Scan assistant text for factual claims; strip violating sentences and flag.
 */
export function filterAiAgainstFactSheet(
  text: string,
  sheet: ChartFactSheet,
  locale: "en" | "hi" = "en"
): FilterResult {
  const violations: FilterViolation[] = [];
  const sentences = text.split(/(?<=[.!?।])\s+/);

  const planetSignPatterns = [
    new RegExp(
      `\\b(${PLANET_RE})\\b(?:\\s+(?:is|are|sits|sits?|placed|resides|lies|in your chart is))?\\s+(?:in|into)\\s+(${SIGN_RE})\\b`,
      "gi"
    ),
    new RegExp(`\\b(${PLANET_RE})\\s+in\\s+(${SIGN_RE})\\b`, "gi"),
  ];

  const lagnaPatterns = [
    new RegExp(
      `\\b(?:lagna|ascendant|rising sign)\\b(?:\\s+is)?\\s+(${SIGN_RE})\\b`,
      "gi"
    ),
    new RegExp(`\\b(${SIGN_RE})\\s+(?:lagna|ascendant|rising)\\b`, "gi"),
  ];

  const nakPatterns = [
    new RegExp(
      `\\b(?:nakshatra|birth star)\\b(?:\\s+is)?\\s+([A-Za-z][A-Za-z\\s]{2,24})`,
      "gi"
    ),
  ];

  const dashaPatterns = [
    new RegExp(
      `\\b(?:maha\\s*dasha|mahadasha|antardasha|antar\\s*dasha|pratyantar(?:dasha)?)\\b(?:\\s+of)?\\s+(${PLANET_RE})\\b`,
      "gi"
    ),
    new RegExp(
      `\\b(${PLANET_RE})\\b\\s+(?:maha\\s*dasha|mahadasha|antardasha)\\b`,
      "gi"
    ),
  ];

  const degreePatterns = [
    new RegExp(
      `\\b(${PLANET_RE}|Lagna|Ascendant)\\b[^.!?]{0,40}?(\\d{1,2})\\s*°`,
      "gi"
    ),
  ];

  const kept: string[] = [];

  for (const sentence of sentences) {
    let bad = false;

    for (const re of planetSignPatterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(sentence))) {
        const pid = planetIdFromAlias(m[1]);
        const sign = normalizeSign(m[2]);
        if (!pid) continue;
        const fact = planetFact(sheet, pid);
        if (!fact || fact.sign.toLowerCase() !== sign.toLowerCase()) {
          bad = true;
          violations.push({
            kind: "planet_sign",
            claim: m[0],
            detail: fact
              ? `${fact.name} is actually in ${fact.sign}, not ${sign}`
              : `Unknown planet claim ${m[0]}`,
          });
        }
      }
    }

    for (const re of lagnaPatterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(sentence))) {
        const sign = normalizeSign(m[1]);
        if (sign.toLowerCase() !== sheet.lagna.sign.toLowerCase()) {
          bad = true;
          violations.push({
            kind: "lagna",
            claim: m[0],
            detail: `Lagna is ${sheet.lagna.sign}, not ${sign}`,
          });
        }
      }
    }

    for (const re of nakPatterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(sentence))) {
        const claimed = m[1].trim().replace(/[.,;:]+$/, "");
        // Allow partial match / English variants
        const ok =
          sheet.moon.nakshatra.toLowerCase().includes(claimed.toLowerCase()) ||
          claimed.toLowerCase().includes(sheet.moon.nakshatra.toLowerCase());
        if (!ok && claimed.length > 3) {
          bad = true;
          violations.push({
            kind: "nakshatra",
            claim: m[0],
            detail: `Moon nakshatra is ${sheet.moon.nakshatra}, not ${claimed}`,
          });
        }
      }
    }

    for (const re of dashaPatterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(sentence))) {
        const lord = m[1];
        const claim = m[0];
        if (!allowedDashaLord(sheet, lord, sentence, claim)) {
          bad = true;
          const currentOnly = isCurrentPeriodClaim(sentence);
          violations.push({
            kind: "dasha",
            claim,
            detail: currentOnly
              ? `Current-period claim for ${lord} rejected (actual current ${sheet.dasha.currentMaha}/${sheet.dasha.currentAntar})`
              : `Dasha lord ${lord} not in fact-sheet dasha set (current ${sheet.dasha.currentMaha}/${sheet.dasha.currentAntar})`,
          });
        }
      }
    }

    for (const re of degreePatterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(sentence))) {
        const subject = m[1];
        const deg = Number(m[2]);
        const pid = planetIdFromAlias(subject);
        let expected: number | null = null;
        if (pid) expected = planetFact(sheet, pid)?.degreeRounded ?? null;
        else if (/lagna|ascendant/i.test(subject))
          expected = sheet.lagna.degreeRounded;
        if (expected != null && Math.abs(expected - deg) > 1) {
          bad = true;
          violations.push({
            kind: "degree",
            claim: m[0],
            detail: `${subject} degree ~${expected}° on chart, claim was ${deg}°`,
          });
        }
      }
    }

    if (!bad) kept.push(sentence);
  }

  let out = kept.join(" ").replace(/\s+/g, " ").trim();
  const flagged = violations.length > 0;

  if (flagged) {
    const note =
      locale === "hi"
        ? "\n\n⚠️ कुछ एआई दावे आपकी गणना की गई कुंडली से मेल नहीं खाते थे, इसलिए उन्हें हटा दिया गया।"
        : "\n\n⚠️ Some AI claims did not match your calculated chart fact-sheet and were removed.";
    if (!out) {
      out =
        locale === "hi"
          ? "गणना की गई कुंडली के तथ्यों से मेल न खाने वाले दावे हटा दिए गए। कृपया प्रश्न दोबारा पूछें।"
          : "Claims that did not match the calculated chart facts were removed. Please ask again.";
    }
    out += note;
  }

  return {
    ok: !flagged,
    text: out || text,
    violations,
    flagged,
  };
}
