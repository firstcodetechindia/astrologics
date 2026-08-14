import { NextResponse } from "next/server";
import { getPartnerPanel, updatePartnerPanel } from "@/lib/astrologers/consult-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const phone = new URL(req.url).searchParams.get("phone") || "";
  if (!phone.replace(/\D/g, "")) {
    return NextResponse.json({ ok: false, error: "phone required" }, { status: 400 });
  }
  try {
    const panel = await getPartnerPanel(phone);
    return NextResponse.json({ ok: true, panel });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "panel failed" },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    phone?: string;
    action?: string;
    available?: boolean;
    rateMinor?: number;
    customerId?: string;
    note?: string;
    ratingId?: string;
    reply?: string;
    filename?: string;
  };
  const phone = String(body.phone || "");
  try {
    let panel;
    if (body.action === "availability") {
      panel = await updatePartnerPanel(phone, {
        type: "availability",
        available: Boolean(body.available),
      });
    } else if (body.action === "rate") {
      panel = await updatePartnerPanel(phone, {
        type: "rate",
        rateMinor: Number(body.rateMinor || 0),
      });
    } else if (body.action === "note") {
      panel = await updatePartnerPanel(phone, {
        type: "note",
        customerId: String(body.customerId || ""),
        note: String(body.note || ""),
      });
    } else if (body.action === "rating-reply") {
      panel = await updatePartnerPanel(phone, {
        type: "rating-reply",
        ratingId: String(body.ratingId || ""),
        reply: String(body.reply || ""),
      });
    } else if (body.action === "verification") {
      panel = await updatePartnerPanel(phone, {
        type: "verification",
        filename: String(body.filename || "id-reupload.pdf"),
      });
    } else {
      return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, panel });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "update failed" },
      { status: 400 }
    );
  }
}
