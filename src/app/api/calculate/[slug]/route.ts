import { NextResponse } from "next/server";
import { getCalculator } from "@/lib/calculators/catalog";
import { runCalculator } from "@/lib/astrology/run-calculator";
import { resolvePlace } from "@/lib/astrology/geocode";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`calc:${ip}`, 60, 60_000);
    if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

    const { slug } = await ctx.params;
    if (
      !getCalculator(slug) &&
      slug !== "daily-panchang" &&
      slug !== "birth-chart-lite"
    ) {
      return NextResponse.json({ error: "Unknown calculator" }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    if (body.place && (body.lat == null || body.lon == null)) {
      const place = await resolvePlace(String(body.place));
      if (place) {
        body.lat = place.lat;
        body.lon = place.lon;
        body.timezoneOffsetMinutes =
          body.timezoneOffsetMinutes ?? place.timezoneOffsetMinutes ?? 330;
      }
    }
    if (body.timezoneOffsetMinutes != null && body.timeZone == null) {
      body.timeZone = timeZoneForPlace({
        lat: Number(body.lat),
        lon: Number(body.lon),
        offsetMinutes: Number(body.timezoneOffsetMinutes),
      });
    }

    if (body.boyPlace && (body.boyLat == null || body.boyLon == null)) {
      const place = await resolvePlace(String(body.boyPlace));
      if (place) {
        body.boyLat = place.lat;
        body.boyLon = place.lon;
        body.boyTimezoneOffsetMinutes =
          body.boyTimezoneOffsetMinutes ?? place.timezoneOffsetMinutes ?? 330;
      }
    }
    if (body.girlPlace && (body.girlLat == null || body.girlLon == null)) {
      const place = await resolvePlace(String(body.girlPlace));
      if (place) {
        body.girlLat = place.lat;
        body.girlLon = place.lon;
        body.girlTimezoneOffsetMinutes =
          body.girlTimezoneOffsetMinutes ?? place.timezoneOffsetMinutes ?? 330;
      }
    }

    const result = runCalculator(slug, body);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Calculation failed" }, { status: 400 });
  }
}
