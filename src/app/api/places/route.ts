import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/astrology/geocode";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export async function GET(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`places:${ip}`, 40, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 120);
  if (q.trim().length < 2) {
    return NextResponse.json({ places: [] });
  }
  const places = await searchPlaces(q, 8);
  return NextResponse.json({ places });
}
