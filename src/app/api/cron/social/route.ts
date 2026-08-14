import { NextResponse } from "next/server";
import { processDueSocialQueue } from "@/lib/social/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Due scheduled posts only run if they were already human-approved. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  const hdr = req.headers.get("authorization") || "";
  if (secret && hdr !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!secret) {
    return NextResponse.json({
      ok: false,
      error: "CRON_SECRET is not set — refusing unauthenticated queue drain",
    }, { status: 503 });
  }
  try {
    const result = await processDueSocialQueue(null);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "cron failed" },
      { status: 500 }
    );
  }
}
