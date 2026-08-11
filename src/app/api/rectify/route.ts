import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { kundliRequestSchema } from "@/lib/astrology/schema";
import { resolvePlace } from "@/lib/astrology/geocode";
import {
  rectifyBirthTime,
  type LifeEventDomain,
} from "@/lib/astrology/rectification";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const eventSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  domain: z.string(),
});

const bodySchema = z.object({
  birth: kundliRequestSchema,
  events: z.array(eventSchema).min(3).max(30),
  windowMinutes: z.number().min(10).max(180).optional(),
  stepMinutes: z.number().min(1).max(15).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`rectify:${ip}`, 10, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { birth, events, windowMinutes, stepMinutes } = parsed.data;
    let lat = birth.lat;
    let lon = birth.lon;
    let timezoneOffsetMinutes = birth.timezoneOffsetMinutes ?? 330;
    let place = birth.place;

    if (lat == null || lon == null) {
      const city = await resolvePlace(birth.place);
      if (!city) {
        return NextResponse.json(
          { error: "Place not found. Try a city name." },
          { status: 400 }
        );
      }
      lat = city.lat;
      lon = city.lon;
      timezoneOffsetMinutes = city.timezoneOffsetMinutes;
      place = city.state ? `${city.name}, ${city.state}` : city.name;
    }

    const input = {
      name: birth.name,
      gender: birth.gender,
      date: birth.date,
      time: birth.time,
      place,
      lat,
      lon,
      timezoneOffsetMinutes,
      ayanamsa: birth.ayanamsa,
      houseSystem: birth.houseSystem,
      nodeMode: birth.nodeMode,
    };
    const result = rectifyBirthTime(
      input,
      events.map((e) => ({
        date: e.date,
        domain: e.domain as LifeEventDomain,
      })),
      {
        windowMinutes,
        stepMinutes,
        ayanamsa: birth.ayanamsa ?? "lahiri",
      }
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rectification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
