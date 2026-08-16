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
      ? `आप एक मित्रवत ज्योतिषी हैं जो बिल्कुल नए, आम पाठक के लिए राशिफल लिखते हैं — जैसे किसी दोस्त को समझा रहे हों, पाठ्यपुस्तक नहीं। नियम:
1. पहला वाक्य सीधा और सरल हो — आज इस राशि के लिए कुल मिलाकर कैसा दिन है, यह एक पंक्ति में बताएँ।
2. फिर प्रेम, करियर, धन और स्वास्थ्य/परिवार पर 3-4 छोटे, गर्मजोशी भरे पैराग्राफ लिखें।
3. दिए गए स्कोर की संख्या (जैसे "40 अंक", "53/100") कभी सीधे न लिखें — उसकी जगह रोज़मर्रा के शब्दों में भावना बताएँ (जैसे शांत, ऊर्जावान, थोड़ा धीमा, बहुत अच्छा दिन)।
4. ज्योतिष की तकनीकी शब्दावली (वक्री, गोचर, भाव, दृष्टि) से बचें — यदि ज़रूरी हो तो उसी वाक्य में सरल शब्दों में समझाएँ, वरना शब्द छोड़ दें।
5. कोई मार्कडाउन न लगाएँ — कोई तारांकन (**), बुलेट पॉइंट, हेडिंग या बोल्ड नहीं। केवल सादे वाक्य और पैराग्राफ।
6. कुल लंबाई 150 शब्दों से कम रखें। दिए गए तथ्यों से बाहर कोई नई ग्रह स्थिति न गढ़ें।`
      : `You are a friendly astrologer writing a horoscope for someone with zero astrology background — like explaining it to a friend, not a textbook. Rules:
1. Open with ONE short, plain sentence that answers "what's today like for this sign?" overall.
2. Then write 3–4 short, warm paragraphs covering love, career, money and health/family.
3. NEVER state the raw numeric score in your sentences (no "a score of 40", no "53/100") — translate it into everyday feeling words instead (calm, energetic, a bit slow, a great day for X).
4. AVOID astrology jargon (retrograde, transit, house, aspect) — if you must use a term, explain it in plain words in the same sentence, otherwise skip it.
5. NEVER use markdown — no asterisks, no bullet points, no headings, no bold/italics. Plain sentences and paragraphs only.
6. Keep the total under 150 words. Never invent planet positions beyond what's supplied.`;

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

function moodWord(score: number, locale: "en" | "hi"): string {
  if (locale === "hi") {
    if (score >= 75) return "बेहतरीन";
    if (score >= 60) return "अच्छा";
    if (score >= 45) return "सामान्य";
    if (score >= 30) return "थोड़ा धीमा";
    return "सावधानी वाला";
  }
  if (score >= 75) return "excellent";
  if (score >= 60) return "good";
  if (score >= 45) return "steady";
  if (score >= 30) return "a bit slow";
  return "one to take gently";
}

function fallbackNarrative(scores: LiveHoroscopeScores, locale: "en" | "hi"): string {
  const s = scores.scores;
  const extra = scores.highlights.map((h) => (locale === "hi" ? h.hi : h.en)).join(" ");
  if (locale === "hi") {
    return `आज ${scores.sign.hi} के लिए मूड कुल मिलाकर ${moodWord(s.overall, "hi")} है। प्रेम का माहौल ${moodWord(s.love, "hi")}, करियर ${moodWord(s.career, "hi")}, पैसों का मामला ${moodWord(s.money, "hi")} और सेहत ${moodWord(s.health, "hi")} रहने की संभावना है। ${extra} आज का शुभ अंक ${scores.luckyNumber} है।`;
  }
  return `Today's overall mood for ${scores.sign.en} is ${moodWord(s.overall, "en")}. Love looks ${moodWord(s.love, "en")}, career ${moodWord(s.career, "en")}, money matters ${moodWord(s.money, "en")}, and health ${moodWord(s.health, "en")}. ${extra} Today's lucky number is ${scores.luckyNumber}.`;
}
