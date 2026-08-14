import { NextResponse } from "next/server";
import { handleRazorpayWebhook } from "@/lib/billing/razorpay-webhook-handler";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`rzp-webhook:${ip}`, 120, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const result = await handleRazorpayWebhook(rawBody, signature);
  const status = "status" in result && typeof result.status === "number" ? result.status : 200;
  return NextResponse.json(result, { status: result.ok ? 200 : status });
}
