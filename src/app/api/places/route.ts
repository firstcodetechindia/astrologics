import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/astrology/geocode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (q.trim().length < 2) {
    return NextResponse.json({ places: [] });
  }
  const places = await searchPlaces(q, 8);
  return NextResponse.json({ places });
}
