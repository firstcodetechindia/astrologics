import { NextResponse } from "next/server";
import { requestRefund } from "@/lib/billing/engine";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`pay-refund:${ip}`, 10, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);
  const body = (await req.json().catch(() => ({}))) as {
    paymentId?: string;
    reason?: string;
  };
  if (!body.paymentId) {
    return NextResponse.json({ ok: false, error: "paymentId required" }, { status: 400 });
  }
  try {
    const refundId = await requestRefund(
      body.paymentId,
      String(body.reason || "user request")
    );
    return NextResponse.json({ ok: true, refundId, status: "requested" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Refund request failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
