import { NextResponse } from "next/server";
import { completeMockConsult, getLiveBySlug } from "@/lib/astrologers/consult-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const astrologer = slug ? await getLiveBySlug(slug) : null;
  return NextResponse.json({ ok: true, astrologer });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    astrologerSlug?: string;
    customerName?: string;
    minutes?: number;
  };
  try {
    const result = await completeMockConsult({
      astrologerSlug: String(body.astrologerSlug || ""),
      customerName: String(body.customerName || "Phase5 Client"),
      minutes: Number(body.minutes || 5),
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "consult failed" },
      { status: 400 }
    );
  }
}
