import { NextResponse } from "next/server";
import { listLiveDirectory } from "@/lib/astrologers/consult-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const astrologers = await listLiveDirectory();
    return NextResponse.json({ ok: true, astrologers });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "directory failed" },
      { status: 500 }
    );
  }
}
