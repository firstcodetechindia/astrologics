import { NextResponse } from "next/server";
import { resolvePlace } from "@/lib/astrology/geocode";
import type { BirthInput } from "@/lib/astrology/types";
import { buildChartCard, resolveProvider, suggestedQuestions } from "@/lib/ai/providers";
import { getOrComputeChart } from "@/lib/ai/chart-fact-cache";
import { runGuruTurn } from "@/lib/ai/run-guru-turn";
import { hasDatabaseUrl } from "@/lib/db";
import { assertChatQuota, consumeChatQuota } from "@/lib/ai/chat-quota";
import { FREE_CHAT_LIMIT } from "@/lib/ai/chat-limits";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";

type BirthBody = {
  name?: string;
  date?: string;
  time?: string;
  place?: string;
  lat?: number;
  lon?: number;
  timezoneOffsetMinutes?: number;
  timeZone?: string;
};

async function resolveBirthInput(
  birth: BirthBody
): Promise<BirthInput | null> {
  if (!birth?.date) return null;
  const placeQuery = String(birth.place || "").trim();
  if (!placeQuery) return null;

  let lat = Number(birth.lat);
  let lon = Number(birth.lon);
  let tz = Number(birth.timezoneOffsetMinutes ?? NaN);
  let timeZone = birth.timeZone?.trim() || undefined;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const place = await resolvePlace(placeQuery);
    if (!place) return null;
    lat = place.lat;
    lon = place.lon;
    tz = place.timezoneOffsetMinutes ?? 330;
  }
  if (!Number.isFinite(tz)) tz = 330;
  if (!timeZone) {
    timeZone = tz === 330 ? "Asia/Kolkata" : undefined;
  }

  return {
    name: String(birth.name || "Native").trim() || "Native",
    date: String(birth.date),
    time: String(birth.time || "12:00"),
    place: placeQuery,
    lat,
    lon,
    timezoneOffsetMinutes: tz,
    timeZone,
  };
}

/** Prepare kundli context + suggestions before chat (cached fact-sheet). */
export async function PUT(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`chat-put:${ip}`, 30, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

    const body = await req.json();
    const locale = body.locale === "hi" ? "hi" : "en";
    const input = await resolveBirthInput(body.birth || {});
    if (!input) {
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

    const cached = getOrComputeChart({ input });
    const quota = assertChatQuota(req.headers.get("cookie"));

    return NextResponse.json({
      ok: true,
      chartKey: cached.key,
      chartSummary: cached.summary,
      factSheet: cached.factSheet,
      card: buildChartCard(cached.kundli, locale),
      kundli: cached.kundli,
      suggestions: suggestedQuestions(locale),
      aiReady: Boolean(resolveProvider()),
      freeUsed: quota.used,
      freeLimit: FREE_CHAT_LIMIT,
      cacheHits: cached.hits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Prepare failed" }, { status: 500 });
  }
}

/** Real-time streaming chat — uses cached fact-sheet; post-filters AI text. */
export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`chat-post:${ip}`, 20, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const locale = body.locale === "hi" ? "hi" : "en";
    const chartKey = body.chartKey ? String(body.chartKey) : null;

    if (!message || message.length > 2000) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const quota = assertChatQuota(req.headers.get("cookie"));
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error:
            locale === "hi"
              ? `मुफ़्त सीमा (${FREE_CHAT_LIMIT}) पूरी हो गई। जारी रखने के लिए लॉगिन करें।`
              : `Free limit (${FREE_CHAT_LIMIT}) reached. Please log in to continue.`,
          code: "FREE_LIMIT",
          freeUsed: quota.used,
          freeLimit: FREE_CHAT_LIMIT,
        },
        { status: 429 }
      );
    }

    const input = await resolveBirthInput(body.birth || {});
    let cached;
    try {
      cached = getOrComputeChart({ chartKey, input });
    } catch {
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

    let personaSlug = String(body.personaSlug || "ai_guru");
    let personaPrompt: string | null = null;
    let personaTone: string | undefined;
    try {
      if (hasDatabaseUrl()) {
        const { getPersona } = await import("@/lib/ai/chat-agent-store");
        const persona = await getPersona(personaSlug);
        if (persona?.enabled && persona.systemPrompt) {
          personaSlug = persona.slug;
          personaPrompt = persona.systemPrompt;
          personaTone = persona.tone;
        }
      }
    } catch {
      /* Phase 4 tables may not exist yet */
    }

    const consumed = consumeChatQuota(req.headers.get("cookie"));

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        };

        try {
          const turn = await runGuruTurn({
            locale,
            userMessage: message,
            chartKey: cached.key,
            birth: input,
            history: history.map((h: { role?: string; content?: string }) => ({
              role: h.role === "assistant" ? "assistant" : "user",
              content: String(h.content || ""),
            })),
            personaSlug,
            personaPrompt,
            personaTone,
          });
          const chunkSize = 48;
          for (let i = 0; i < turn.text.length; i += chunkSize) {
            send({ delta: turn.text.slice(i, i + chunkSize) });
          }
          send({
            done: true,
            mode: "ok",
            chartKey: turn.chartKey,
            cacheHits: turn.hits,
            filter: {
              flagged: turn.flagged,
              violationCount: turn.violations.length,
              violations: turn.violations.slice(0, 8),
              factFilterRan: true,
              scopeFlagged: turn.scopeFlagged,
            },
            freeUsed: consumed.used,
            freeLimit: FREE_CHAT_LIMIT,
          });
        } catch (err) {
          console.error(err);
          send({
            error:
              locale === "hi"
                ? "हमारा एआई अभी उत्तर नहीं दे सका। कृपया थोड़ी देर बाद फिर कोशिश करें।"
                : "Our AI could not reply just now. Please try again shortly.",
          });
          send({
            done: true,
            mode: "error",
            chartKey: cached.key,
            freeUsed: consumed.used,
            freeLimit: FREE_CHAT_LIMIT,
          });
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
        "Set-Cookie": consumed.setCookie,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
