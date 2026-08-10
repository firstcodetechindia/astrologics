import type { KundliResult } from "@/lib/astrology/types";
import { siteConfig } from "@/lib/site-config";

export type AiProvider = "openai" | "gemini";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export function buildChartSummary(k: KundliResult): string {
  return [
    `Name: ${k.input.name}`,
    `Birth: ${k.input.date} ${k.input.time} @ ${k.input.place}`,
    `Lagna: ${k.lagna.sign.en} (${k.lagna.degree.toFixed(1)}°)`,
    `Moon: ${k.moonRashi.en} / Nakshatra ${k.nakshatra.name.en} pada ${k.nakshatra.pada}`,
    `Sun: ${k.sunRashi.en}`,
    `Current Mahadasha: ${k.dasha.currentMaha.planet.en} (${k.dasha.currentMaha.start} → ${k.dasha.currentMaha.end})`,
    `Current Antardasha: ${k.dasha.currentAntar.planet.en}`,
    `Planets: ${k.planets.map((p) => `${p.name.en} in ${p.sign.en} H${p.house}`).join("; ")}`,
    `Yogas: ${k.yogas.map((y) => y.name.en).join(", ") || "none flagged"}`,
  ].join("\n");
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
You practice classical Jyotish with modern clarity — calm, practical, never fear-mongering.
Always ground answers in the provided birth-chart context when available.
Do not invent exact planet degrees that are not in the chart context.
This is guidance for reflection — not medical, legal, or financial advice.
Keep replies focused (usually under 220 words) unless the user asks for more depth.
If asked about Western astrology, you may briefly compare, but prioritise the Vedic chart context given.`;
}

export function availableProviders(): AiProvider[] {
  const list: AiProvider[] = [];
  if (process.env.OPENAI_API_KEY) list.push("openai");
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) list.push("gemini");
  return list;
}

/** Prefer configured provider, then OpenAI, then Gemini. Ignores client preference. */
export function resolveProvider(_requested?: string): AiProvider | null {
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
      temperature: 0.65,
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
        temperature: 0.65,
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
