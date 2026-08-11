import { NextResponse } from "next/server";
import { z } from "zod";
import { synthesizeMoonSignForecast } from "@/lib/astrology/live-horoscope";
import { narrateHoroscope } from "@/lib/ai/horoscope";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const schema = z.object({
  signIndex: z.number().int().min(0).max(11),
  period: z.enum(["daily", "weekly", "monthly", "yearly"]).default("daily"),
  locale: z.enum(["en", "hi"]).default("en"),
  narrate: z.boolean().optional().default(true),
});

const cache = new Map<string, { at: number; body: unknown }>();
const TTL_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`horoscope:${ip}`, 40, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { signIndex, period, locale, narrate } = parsed.data;
    const dayKey = new Date().toISOString().slice(0, 10);
    const key = `${signIndex}:${period}:${locale}:${dayKey}:${narrate}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return NextResponse.json(hit.body);
    }

    const scores = synthesizeMoonSignForecast(signIndex, period);
    const narrative = narrate ? await narrateHoroscope(scores, locale) : null;
    const body = { ok: true, scores, narrative };
    cache.set(key, { at: Date.now(), body });
    return NextResponse.json(body);
  } catch (err) {
    console.error("horoscope api", err);
    return NextResponse.json({ error: "Horoscope failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const signIndex = Number(url.searchParams.get("signIndex") ?? "0");
  const period = (url.searchParams.get("period") ?? "daily") as
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";
  const locale = (url.searchParams.get("locale") ?? "en") as "en" | "hi";
  return POST(
    new Request(req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signIndex, period, locale, narrate: true }),
    })
  );
}
