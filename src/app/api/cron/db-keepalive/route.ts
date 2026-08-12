import { NextResponse } from "next/server";
import { getSql, hasDatabaseUrl } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

/**
 * Lightweight Neon wake ping — prevents Free-tier scale-to-zero during
 * scheduled keep-alive windows. Auth: Authorization Bearer CRON_SECRET
 * or ?secret= (for simple schedulers).
 *
 * CU budget note: always-on 0.25 CU ≈ 182 CU-h/mo > Free 100 CU-h.
 * Peak-hours schedule only (see .github/workflows/db-keepalive.yml).
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

async function ping() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL not configured" },
      { status: 503 }
    );
  }
  const sql = getSql();
  const t0 = Date.now();
  const rows = await sql`SELECT 1 AS ok, NOW() AS at`;
  const queryMs = Date.now() - t0;
  return NextResponse.json({
    ok: true,
    queryMs,
    at: rows[0]?.at ?? null,
    purpose: "neon-keepalive",
  });
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    return await ping();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "keepalive failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
