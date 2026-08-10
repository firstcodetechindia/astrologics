import { NextResponse } from "next/server";
import { computeKundli } from "@/lib/astrology/compute";
import { resolvePlace } from "@/lib/astrology/geocode";
import type { BirthInput } from "@/lib/astrology/types";
import {
  buildChartCard,
  buildChartSummary,
  fallbackProvider,
  resolveProvider,
  streamAi,
  suggestedQuestions,
  systemPrompt,
  type AiProvider,
  type ChatMessage,
} from "@/lib/ai/providers";

export const runtime = "nodejs";

type BirthBody = {
  name?: string;
  date?: string;
  time?: string;
  place?: string;
  lat?: number;
  lon?: number;
  timezoneOffsetMinutes?: number;
};

async function resolveBirth(birth: BirthBody): Promise<{
  input: BirthInput;
  summary: string;
  card: ReturnType<typeof buildChartCard>;
} | null> {
  if (!birth?.date) return null;
  const placeQuery = String(birth.place || "").trim();
  if (!placeQuery) return null;

  let lat = Number(birth.lat);
  let lon = Number(birth.lon);
  let tz = Number(birth.timezoneOffsetMinutes ?? NaN);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const place = await resolvePlace(placeQuery);
    if (!place) return null;
    lat = place.lat;
    lon = place.lon;
    tz = place.timezoneOffsetMinutes ?? 330;
  }
  if (!Number.isFinite(tz)) tz = 330;

  const input: BirthInput = {
    name: String(birth.name || "Native").trim() || "Native",
    date: String(birth.date),
    time: String(birth.time || "12:00"),
    place: placeQuery,
    lat,
    lon,
    timezoneOffsetMinutes: tz,
  };
  const k = computeKundli(input);
  return {
    input,
    summary: buildChartSummary(k),
    card: buildChartCard(k, "en"),
  };
}

/** Prepare kundli context + suggestions before chat */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const locale = body.locale === "hi" ? "hi" : "en";
    const resolved = await resolveBirth(body.birth || {});
    if (!resolved) {
      return NextResponse.json(
        {
          error:
            locale === "hi"
              ? "कृपया सही जन्म तिथि, समय और स्थान भरें।"
              : "Please enter a valid date, time and place of birth.",
        },
        { status: 400 }
      );
    }

    const k = computeKundli(resolved.input);

    return NextResponse.json({
      ok: true,
      chartSummary: resolved.summary,
      card: buildChartCard(k, locale),
      kundli: k,
      suggestions: suggestedQuestions(locale),
      aiReady: Boolean(resolveProvider()),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Prepare failed" }, { status: 500 });
  }
}

/** Real-time streaming chat (SSE) — provider chosen server-side */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const locale = body.locale === "hi" ? "hi" : "en";
    // Provider is chosen server-side only (best available + failover).
    const provider = resolveProvider();

    if (!message || message.length > 2000) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const resolved = await resolveBirth(body.birth || {});
    if (!resolved) {
      return NextResponse.json(
        {
          error:
            locale === "hi"
              ? "पहले अपनी कुंडली बनाएँ — जन्म विवरण आवश्यक हैं।"
              : "Create your kundli first — birth details are required.",
        },
        { status: 400 }
      );
    }

    if (!provider) {
      const fallback =
        locale === "hi"
          ? `आपकी कुंडली तैयार है, पर अभी एआई सेवा उपलब्ध नहीं है। नीचे सारांश है — बाद में फिर कोशिश करें।\n\n${resolved.summary}`
          : `Your kundli is ready, but our AI is temporarily unavailable. Here is your chart summary — please try again later.\n\n${resolved.summary}`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta: fallback })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, mode: "fallback" })}\n\n`
            )
          );
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt(locale) },
      {
        role: "system",
        content: `Birth chart context for this user:\n${resolved.summary}`,
      },
      ...history.map((h: { role?: string; content?: string }) => ({
        role: (h.role === "assistant" ? "assistant" : "user") as
          | "assistant"
          | "user",
        content: String(h.content || "").slice(0, 2500),
      })),
      { role: "user", content: message },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        };
        const tryProvider = async (p: AiProvider) => {
          let produced = false;
          await streamAi(p, messages, (delta) => {
            produced = true;
            send({ delta });
          });
          return produced;
        };

        try {
          let used: AiProvider = provider;
          try {
            await tryProvider(provider);
          } catch (primaryErr) {
            console.error(primaryErr);
            const alt = fallbackProvider(provider);
            if (!alt) throw primaryErr;
            await tryProvider(alt);
            used = alt;
          }
          send({ done: true, mode: used });
        } catch (err) {
          console.error(err);
          send({
            error:
              locale === "hi"
                ? "हमारा एआई अभी उत्तर नहीं दे सका। कृपया थोड़ी देर बाद फिर कोशिश करें।"
                : "Our AI could not reply just now. Please try again shortly.",
          });
          send({ done: true, mode: "error" });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
