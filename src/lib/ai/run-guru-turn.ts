/**
 * Single Guru speech path — public /api/chat and consult/admin turns.
 * Every reply: fact-sheet grounding → model (or override) → fact-filter → scope-filter.
 * There is no unfiltered Guru content path.
 */
import { getOrComputeChart } from "@/lib/ai/chart-fact-cache";
import {
  filterAiAgainstFactSheet,
  type FilterViolation,
} from "@/lib/ai/ai-post-filter";
import type { ChartFactSheet } from "@/lib/ai/chart-fact-sheet";
import {
  filterAiScope,
  IMMUTABLE_PERSONA_GUARD,
  sanitizePersonaPrompt,
} from "@/lib/ai/persona-guard";
import {
  fallbackProvider,
  resolveProvider,
  streamAi,
  systemPrompt,
  type AiProvider,
  type ChatMessage,
} from "@/lib/ai/providers";
import type { BirthInput } from "@/lib/astrology/types";

export type GuruHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GuruScopeViolation = {
  kind: "scope";
  claim: string;
  detail: "medical/legal scope";
};

export type GuruTurnViolation = FilterViolation | GuruScopeViolation;

export type GuruTurnResult = {
  text: string;
  flagged: boolean;
  violations: GuruTurnViolation[];
  factFilterRan: true;
  scopeFlagged: boolean;
  scopeReasons: string[];
  chartKey: string;
  hits: number;
};

export type RunGuruTurnInput = {
  locale: "en" | "hi";
  userMessage: string;
  chartKey?: string | null;
  birth?: BirthInput | null;
  history?: GuruHistoryMessage[];
  personaSlug?: string;
  personaPrompt?: string | null;
  personaTone?: string;
  extraSystem?: string;
  /** Skip the model; still run both filters (tests + no-provider fallback). */
  rawOverride?: string;
  collectRaw?: (messages: ChatMessage[]) => Promise<string>;
};

/** Closing copy for quota-exhausted reveal — still filtered like any Guru turn. */
export const GURU_CLOSING_SYSTEM = `You are writing a short quota-exhausted closing as CosmicTalks AI Guru — clearly an AI astrologer, not a human.
Write 2-4 short sentences of plain text (no markdown, no bullet lists):
1. Warmly acknowledge the user. Cite only Lagna and the current Mahadasha (and Antardasha if listed) from the supplied chart fact-sheet. Never invent planet signs, degrees, yogas, dates, or dasha lords.
2. Explain that a free account unlocks saved charts and chat with a human astrologer. Do not promise unlimited AI questions.
3. Do not fully answer a new chart question. Do not give medical, legal, or financial advice.`;

export function applyGuruSafetyFilters(
  raw: string,
  sheet: ChartFactSheet,
  locale: "en" | "hi"
): Pick<
  GuruTurnResult,
  "text" | "flagged" | "violations" | "factFilterRan" | "scopeFlagged" | "scopeReasons"
> {
  const filtered = filterAiAgainstFactSheet(raw, sheet, locale);
  const scoped = filterAiScope(filtered.text, locale);
  return {
    text: scoped.text,
    flagged: filtered.flagged || scoped.flagged,
    violations: [
      ...filtered.violations,
      ...scoped.reasons.map(
        (claim): GuruScopeViolation => ({
          kind: "scope",
          claim,
          detail: "medical/legal scope",
        })
      ),
    ],
    factFilterRan: true,
    scopeFlagged: scoped.flagged,
    scopeReasons: scoped.reasons,
  };
}

export function buildGuruGroundingBlock(opts: {
  chartKey: string;
  summary: string;
  personaSlug?: string;
  personaTone?: string;
  personaPrompt?: string;
  extraSystem?: string;
}): string {
  const cleaned = opts.personaPrompt
    ? sanitizePersonaPrompt(opts.personaPrompt).text
    : "";
  const personaLine =
    cleaned && opts.personaSlug
      ? `\nPersona (${opts.personaSlug}${opts.personaTone ? `, tone ${opts.personaTone}` : ""}):\n${cleaned}`
      : cleaned
        ? `\nPersona:\n${cleaned}`
        : "";
  const extra = opts.extraSystem?.trim() ? `\n${opts.extraSystem.trim()}` : "";
  return `${IMMUTABLE_PERSONA_GUARD}${personaLine}${extra}

FACT FILTER IS MANDATORY. Birth chart context (cached fact-sheet key ${opts.chartKey} — do not recalculate):
${opts.summary}`;
}

export function buildGuruMessages(opts: {
  locale: "en" | "hi";
  chartKey: string;
  summary: string;
  userMessage: string;
  history?: GuruHistoryMessage[];
  personaSlug?: string;
  personaTone?: string;
  personaPrompt?: string | null;
  extraSystem?: string;
}): ChatMessage[] {
  return [
    { role: "system", content: systemPrompt(opts.locale) },
    {
      role: "system",
      content: buildGuruGroundingBlock({
        chartKey: opts.chartKey,
        summary: opts.summary,
        personaSlug: opts.personaSlug,
        personaTone: opts.personaTone,
        personaPrompt: opts.personaPrompt || undefined,
        extraSystem: opts.extraSystem,
      }),
    },
    ...(opts.history || []).map((h) => ({
      role: (h.role === "assistant" ? "assistant" : "user") as
        | "assistant"
        | "user",
      content: String(h.content || "").slice(0, 2500),
    })),
    { role: "user", content: opts.userMessage },
  ];
}

async function defaultCollectRaw(messages: ChatMessage[]): Promise<string> {
  const provider = resolveProvider();
  if (!provider) return "";

  const collectFrom = async (p: AiProvider) => {
    let full = "";
    await streamAi(p, messages, (delta) => {
      full += delta;
    });
    return full;
  };

  try {
    return await collectFrom(provider);
  } catch (primaryErr) {
    const alt = fallbackProvider(provider);
    if (!alt) throw primaryErr;
    return collectFrom(alt);
  }
}

export function splitGuruSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Sentence-level clock for the reveal; later TTS can replace cueMs without a rebuild. */
export function closingCues(text: string): {
  sentences: string[];
  cueMs: number[];
} {
  const sentences = splitGuruSentences(text)
    .filter(
      (s) =>
        !s.startsWith("⚠️") &&
        !/did not match your calculated chart|मेल नहीं खाते थे|Medical\/legal advice claims were removed|चिकित्सा\/कानूनी दावे हटा|CosmicTalks does not provide medical or legal advice|चिकित्सा या कानूनी सलाह नहीं/i.test(
          s
        )
    )
    .slice(0, 4);
  const cueMs = sentences.map((_, i) => 700 + i * 2200);
  return { sentences, cueMs };
}

export function closingFallbackText(locale: "en" | "hi"): string {
  return locale === "hi"
    ? "तीन मुफ्त प्रश्न पूरे हो चुके हैं। मुफ्त खाते से कुंडली सहेज सकते हैं और मानव ज्योतिषी से बात कर सकते हैं।"
    : "Those three free questions are complete. A free account lets you save charts and chat with a human astrologer.";
}

export async function runGuruClosing(
  opts: Omit<RunGuruTurnInput, "extraSystem">
): Promise<GuruTurnResult & { sentences: string[]; cueMs: number[] }> {
  const locale = opts.locale === "hi" ? "hi" : "en";
  const provider = resolveProvider();
  const turn = await runGuruTurn({
    ...opts,
    extraSystem: GURU_CLOSING_SYSTEM,
    rawOverride:
      typeof opts.rawOverride === "string"
        ? opts.rawOverride
        : provider
          ? undefined
          : closingFallbackText(locale),
    userMessage:
      opts.userMessage.trim() ||
      (locale === "hi"
        ? "कृपया मुफ्त-सीमा समाप्ति का संक्षिप्त संदेश लिखें।"
        : "Please write the short quota-exhausted closing now."),
  });
  const cues = closingCues(turn.text);
  return { ...turn, ...cues };
}

export async function runGuruTurn(
  opts: RunGuruTurnInput
): Promise<GuruTurnResult> {
  const locale = opts.locale === "hi" ? "hi" : "en";
  const cached = getOrComputeChart({
    chartKey: opts.chartKey || undefined,
    input: opts.birth || undefined,
  });

  const messages = buildGuruMessages({
    locale,
    chartKey: cached.key,
    summary: cached.summary,
    userMessage: opts.userMessage,
    history: opts.history,
    personaSlug: opts.personaSlug,
    personaTone: opts.personaTone,
    personaPrompt: opts.personaPrompt,
    extraSystem: opts.extraSystem,
  });

  let raw = "";
  if (typeof opts.rawOverride === "string") {
    raw = opts.rawOverride;
  } else if (opts.collectRaw) {
    raw = await opts.collectRaw(messages);
  } else {
    raw = await defaultCollectRaw(messages);
  }

  if (!raw.trim()) {
    raw =
      locale === "hi"
        ? `आपकी कुंडली तैयार है, पर अभी एआई सेवा उपलब्ध नहीं है। नीचे सारांश है — बाद में फिर कोशिश करें।\n\n${cached.summary}`
        : `Your kundli is ready, but our AI is temporarily unavailable. Here is your chart summary — please try again later.\n\n${cached.summary}`;
  }

  return {
    ...applyGuruSafetyFilters(raw, cached.factSheet, locale),
    chartKey: cached.key,
    hits: cached.hits,
  };
}
