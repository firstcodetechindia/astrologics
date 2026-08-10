import { NextResponse } from "next/server";
import { resolvePlace } from "@/lib/astrology/geocode";
import { computeKundli } from "@/lib/astrology/compute";
import { kundliRequestSchema } from "@/lib/astrology/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = kundliRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let lat = data.lat;
    let lon = data.lon;
    let timezoneOffsetMinutes = data.timezoneOffsetMinutes ?? 330;
    let place = data.place;

    if (lat == null || lon == null) {
      const city = await resolvePlace(data.place);
      if (!city) {
        return NextResponse.json(
          {
            error:
              "Place not found. Try a city name anywhere in the world.",
          },
          { status: 400 }
        );
      }
      lat = city.lat;
      lon = city.lon;
      timezoneOffsetMinutes = city.timezoneOffsetMinutes;
      place = city.state ? `${city.name}, ${city.state}` : city.name;
    }

    const result = computeKundli({
      name: data.name,
      gender: data.gender,
      date: data.date,
      time: data.time,
      place,
      lat,
      lon,
      timezoneOffsetMinutes,
    });

    return NextResponse.json({ ok: true, kundli: result });
  } catch (err) {
    console.error("kundli error", err);
    return NextResponse.json(
      { error: "Failed to compute kundli" },
      { status: 500 }
    );
  }
}
