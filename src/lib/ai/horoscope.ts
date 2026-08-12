/**
 * Gemini (or OpenAI) narrative for live moon-sign horoscope scores.
 */
import type { LiveHoroscopeScores } from "@/lib/astrology/live-horoscope";
import { resolveProvider, streamGemini, streamOpenAI, type ChatMessage } from "./providers";

export async function narrateHoroscope(
  scores: LiveHoroscopeScores,
  locale: "en" | "hi"
): Promise<string> {
  const provider = resolveProvider();
  if (!provider) {
    return fallbackNarrative(scores, locale);
  }

  const sys =
    locale === "hi"
      ? `आप CosmicGPT के राशिफल लेखक हैं। केवल दिए गए स्कोर/ट्रांजिट तथ्यों की व्याख्या करें। नई ग्रह स्थिति न गढ़ें। गर्म, व्यावहारिक हिंदी में 3-5 छोटे पैराग्राफ।`
      : `You write CosmicGPT moon-sign horoscopes. ONLY narrate the supplied scores and transit notes. Never invent planet positions. Warm practical English, 3–5 short paragraphs covering love, career, money, health.`;

  const user = JSON.stringify(scores, null, 2);
  const messages: ChatMessage[] = [
    { role: "system", content: sys },
    { role: "user", content: user },
  ];

  let out = "";
  const onDelta = (t: string) => {
    out += t;
  };
  try {
    if (provider === "gemini") await streamGemini(messages, onDelta);
    else await streamOpenAI(messages, onDelta);
  } catch {
    return fallbackNarrative(scores, locale);
  }
  return out.trim() || fallbackNarrative(scores, locale);
}

function fallbackNarrative(scores: LiveHoroscopeScores, locale: "en" | "hi"): string {
  const s = scores.scores;
  if (locale === "hi") {
    return `${scores.sign.hi} के लिए समग्र ऊर्जा ${s.overall}/100। प्रेम ${s.love}, करियर ${s.career}, धन ${s.money}, स्वास्थ्य ${s.health}, परिवार ${s.family}। ${scores.highlights.map((h) => h.hi).join(" ")} शुभ अंक: ${scores.luckyNumber}।`;
  }
  return `Overall tone for ${scores.sign.en}: ${s.overall}/100. Love ${s.love}, career ${s.career}, money ${s.money}, health ${s.health}, family ${s.family}. ${scores.highlights.map((h) => h.en).join(" ")} Lucky number: ${scores.luckyNumber}.`;
}
