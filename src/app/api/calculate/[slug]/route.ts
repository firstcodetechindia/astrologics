import { NextResponse } from "next/server";
import { getCalculator } from "@/lib/calculators/catalog";
import { runCalculator } from "@/lib/astrology/run-calculator";
import { resolvePlace } from "@/lib/astrology/geocode";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    if (!getCalculator(slug) && slug !== "daily-panchang" && slug !== "birth-chart-lite") {
      return NextResponse.json({ error: "Unknown calculator" }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    // Resolve place if lat/lon missing
    if (body.place && (body.lat == null || body.lon == null)) {
      const place = await resolvePlace(String(body.place));
      if (place) {
        body.lat = place.lat;
        body.lon = place.lon;
        body.timezoneOffsetMinutes =
          body.timezoneOffsetMinutes ?? place.timezoneOffsetMinutes ?? 330;
      }
    }
    if (body.boyPlace && (body.boyLat == null || body.boyLon == null)) {
      const place = await resolvePlace(String(body.boyPlace));
      if (place) {
        body.boyLat = place.lat;
        body.boyLon = place.lon;
      }
    }
    if (body.girlPlace && (body.girlLat == null || body.girlLon == null)) {
      const place = await resolvePlace(String(body.girlPlace));
      if (place) {
        body.girlLat = place.lat;
        body.girlLon = place.lon;
      }
    }

    const result = runCalculator(slug, body);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Calculation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
