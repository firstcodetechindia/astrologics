import type { KundliResult } from "@/lib/astrology/types";
import { formatPredictionsForAi } from "@/lib/astrology/prediction";
import { siteConfig } from "@/lib/site-config";

export type AiProvider = "openai" | "gemini";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function fmtDeg(d: number) {
  const deg = Math.floor(d);
  const m = Math.floor((d - deg) * 60);
  return `${deg}°${String(m).padStart(2, "0")}′`;
}

/**
 * Full calculated chart + multi-factor prediction bundle for AI.
 * AI must never invent values not present here.
 */
export function buildChartSummary(k: KundliResult): string {
  const planetLines = k.planets
    .map((p) => {
      const flags = [
        p.isRetrograde ? "R" : null,
        p.isCombust ? "combust" : null,
        p.dignity?.kind && p.dignity.kind !== "neutral"
          ? p.dignity.label.en
          : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `  - ${p.name.en}: ${p.sign.en} ${fmtDeg(p.degreeInSign)} | House ${p.house} | ${p.nakshatra.en} pada ${p.pada}${flags ? ` | ${flags}` : ""}`;
    })
    .join("\n");

  const houseLords = k.houses
    .map((h) => `H${h.number}=${h.sign.en}(lord ${h.lord.en})`)
    .join("; ");

  const yogaLines =
    k.yogas.map((y) => `  - ${y.name.en} [${y.level}]: ${y.meaning.en}`).join("\n") ||
    "  - none detected by rule engine";

  const aspectSample = k.aspects
    .slice(0, 24)
    .map((a) => a.label.en)
    .join("; ");

  const predictionBlock = k.predictions
    ? formatPredictionsForAi(k.predictions)
    : "=== PREDICTION FACTORS: unavailable ===";

  return [
    "=== CALCULATED CHART (authoritative — do not recalculate) ===",
    `Name: ${k.input.name}`,
    `Birth (local): ${k.input.date} ${k.input.time} @ ${k.input.place}`,
    `Coords: lat ${k.input.lat}, lon ${k.input.lon}; TZ offset min: ${k.input.timezoneOffsetMinutes ?? "default IST"}`,
    `Settings: sidereal + Lahiri ayanamsa ${k.ayanamsa.toFixed(4)}°; whole-sign houses; ${k.settings.nodeType} nodes; engine ${k.settings.ephemerisEngine}`,
    `Calculation reliability: ${k.reliability.level.toUpperCase()} (${k.reliability.reasons.map((r) => r.en).join("; ")})`,
    `Lagna: ${k.lagna.sign.en} ${fmtDeg(k.lagna.degree)} (lon ${k.lagna.longitude.toFixed(4)}°)`,
    `Moon rashi: ${k.moonRashi.en} | Nakshatra ${k.nakshatra.name.en} pada ${k.nakshatra.pada} | lord ${k.nakshatra.lord.en}`,
    `Sun rashi: ${k.sunRashi.en}`,
    `Planets:`,
    planetLines,
    `House signs/lords: ${houseLords}`,
    `Yogas/dosha flags from rule engine:`,
    yogaLines,
    `Manglik: ${k.doshas.manglik.present ? "present" : "not present"} — ${k.doshas.manglik.meaning.en}`,
    `Kaal Sarp: ${k.doshas.kaalSarp.present ? "present" : "not present"} — ${k.doshas.kaalSarp.meaning.en}`,
    k.doshas.sadeSati
      ? `Sade Sati: ${k.doshas.sadeSati.present ? "active" : "not active"} — ${k.doshas.sadeSati.meaning.en}`
      : "",
    `Vimshottari start lord: ${k.dasha.startLord?.en ?? "n/a"}; balance years at birth: ${k.dasha.balanceYears ?? "n/a"}`,
    `Current Mahadasha: ${k.dasha.currentMaha.planet.en} (${k.dasha.currentMaha.start} → ${k.dasha.currentMaha.end})`,
    `Current Antardasha: ${k.dasha.currentAntar.planet.en} (${k.dasha.currentAntar.start} → ${k.dasha.currentAntar.end})`,
    k.dasha.currentPratyantar
      ? `Current Pratyantardasha: ${k.dasha.currentPratyantar.planet.en} (${k.dasha.currentPratyantar.start} → ${k.dasha.currentPratyantar.end})`
      : "",
    (() => {
      const d9 = k.divisionalCharts?.D9 as
        | { lagna?: { sign?: { en?: string } }; planets?: { id: string; sign: { en: string } }[] }
        | undefined;
      if (!d9?.lagna?.sign?.en) return "";
      return `D9 Navamsa Lagna: ${d9.lagna.sign.en}; planets: ${(d9.planets || [])
        .map((p) => `${p.id}:${p.sign.en}`)
        .join(", ")}`;
    })(),
    (() => {
      const d10 = k.divisionalCharts?.D10 as
        | { lagna?: { sign?: { en?: string } }; planets?: { id: string; sign: { en: string } }[] }
        | undefined;
      if (!d10?.lagna?.sign?.en) return "";
      return `D10 Dashamsa Lagna: ${d10.lagna.sign.en}; planets: ${(d10.planets || [])
        .map((p) => `${p.id}:${p.sign.en}`)
        .join(", ")}`;
    })(),
    (() => {
      const tr = k.transits as
        | { asOf?: string; planets?: { id: string; sign: { en: string }; houseFromLagna: number; isRetrograde: boolean }[] }
        | undefined;
      if (!tr?.planets?.length) return "";
      return `Current transits (${tr.asOf}): ${tr.planets
        .map(
          (p) =>
            `${p.id} ${p.sign.en} H${p.houseFromLagna}${p.isRetrograde ? " R" : ""}`
        )
        .join("; ")}`;
    })(),
    `Graha Drishti (sample): ${aspectSample || "none"}`,
    "=== END CALCULATED CHART ===",
    "",
    predictionBlock,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildChartCard(k: KundliResult, locale: "en" | "hi") {
  const L = <T extends { en: string; hi: string }>(o: T) => o[locale];
  return {
    name: k.input.name,
    place: k.input.place,
    lagna: L(k.lagna.sign),
    moon: L(k.moonRashi),
    sun: L(k.sunRashi),
    nakshatra: `${L(k.nakshatra.name)} · pada ${k.nakshatra.pada}`,
    dasha: `${L(k.dasha.currentMaha.planet)} / ${L(k.dasha.currentAntar.planet)}`,
  };
}

export { FREE_CHAT_LIMIT, followUpQuestions, suggestedQuestions } from "./chat-limits";

export function systemPrompt(locale: "en" | "hi"): string {
  return `You are ${siteConfig.brandName}'s proprietary AI astrology assistant (astrologics.co).
Never mention OpenAI, GPT, Gemini, Google, Claude, or any third-party model names — you are simply "${siteConfig.brandName} AI".
Answer in ${locale === "hi" ? "clear Hindi (Devanagari script)" : "clear, warm English"}.

GOLDEN RULE — CALCULATE FIRST, INTERPRET SECOND:
You receive (1) CALCULATED CHART and (2) MULTI-FACTOR PREDICTION ENGINE factors.
Both are authoritative. You MUST NOT recalculate astrology.

You MUST NEVER invent:
- Planet positions, Lagna, Rashi, Nakshatra, houses
- Dasha dates/lords, transits, Yogas, Doshas, D9, D10
- Exact marriage/career/finance dates or medical diagnoses
- Fake accuracy percentages

Your job is ONLY to explain the supplied factors in plain language.

Prefer this answer structure when giving a topic reading:
### What your chart shows
### Why (cite supporting + challenging factors from the prediction block)
### What this can mean
### Timing (only if a timing window was supplied)
### What to keep in mind (conflicts, effort, no guarantees)

Use confidence labels from the engine: very_strong / strong / moderate / weak / insufficient_data.
If factors conflict, say so clearly — do not force a one-sided story.
Never use fear-based or absolute claims ("definitely marry", "will get cancer", "will become rich").
If data is missing, say "Insufficient calculated data" — do not fill gaps.
This is guidance for reflection — not medical, legal, or financial advice.
Keep replies focused (usually under 280 words) unless the user asks for more depth.`;
}

export function availableProviders(): AiProvider[] {
  const list: AiProvider[] = [];
  if (process.env.OPENAI_API_KEY) list.push("openai");
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) list.push("gemini");
  return list;
}

/** Prefer configured provider, then OpenAI, then Gemini. */
export function resolveProvider(): AiProvider | null {
  const available = availableProviders();
  if (!available.length) return null;
  const preferred = process.env.AI_PROVIDER as AiProvider | undefined;
  if (preferred && available.includes(preferred)) return preferred;
  if (available.includes("openai")) return "openai";
  return available[0];
}

/** Other configured provider for automatic failover. */
export function fallbackProvider(primary: AiProvider): AiProvider | null {
  const available = availableProviders().filter((p) => p !== primary);
  return available[0] ?? null;
}

/** OpenAI Chat Completions streaming → plain text chunks */
export async function streamOpenAI(
  messages: ChatMessage[],
  onDelta: (text: string) => void
): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.55,
      max_tokens: 700,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch {
        /* skip partial */
      }
    }
  }
}

/** Google Gemini streaming → plain text chunks */
export async function streamGemini(
  messages: ChatMessage[],
  onDelta: (text: string) => void
): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents,
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text();
    throw new Error(`Gemini error: ${err.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = json.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("");
        if (text) onDelta(text);
      } catch {
        /* skip */
      }
    }
  }
}

export async function streamAi(
  provider: AiProvider,
  messages: ChatMessage[],
  onDelta: (text: string) => void
): Promise<void> {
  if (provider === "gemini") return streamGemini(messages, onDelta);
  return streamOpenAI(messages, onDelta);
}
