import { NextResponse } from "next/server";
import { searchPlacesDb } from "@/lib/places/places-search-db";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

/**
 * GET /api/places/search?q=delhi
 * Birth-place autocomplete via Neon Postgres + pg_trgm (stateless).
 */
export async function GET(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`places-search:${ip}`, 60, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").slice(0, 120);
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get("limit") || 10) || 10)
  );

  if (q.trim().length < 2) {
    return NextResponse.json({ places: [], meta: { q, count: 0 } });
  }

  const t0 = performance.now();

  try {
    const { hits, meta } = await searchPlacesDb(q, limit);
    return NextResponse.json({
      places: hits,
      meta: {
        q,
        count: hits.length,
        via: "postgres-pg_trgm",
        similarityThreshold: meta.threshold,
        wordSimilarityThreshold: meta.wordThreshold,
        queryMs: Math.round(meta.queryMs),
        requestMs: Math.round(performance.now() - t0),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Places search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
