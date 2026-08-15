import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/billing/engine";
import { captureMockViaSignedWebhook } from "@/lib/billing/razorpay-webhook-handler";
import { resolvePaymentGateway } from "@/lib/billing/resolve-gateway";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`pay:${ip}`, 30, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    purpose?: "consultation" | "subscription" | "product" | "wallet_topup";
    amountMinor?: number;
    displayName?: string;
    phone?: string;
    email?: string;
    stateCode?: string;
    astrologerId?: string;
    planId?: string;
    productId?: string;
    description?: string;
    paymentId?: string;
    gatewayPaymentId?: string;
  };
  try {
    if (body.action === "capture" && body.paymentId) {
      const gw = await resolvePaymentGateway();
      if (gw.transport !== "mock") {
        return NextResponse.json(
          {
            ok: false,
            error: "Payment is confirmed only by the Razorpay webhook with a verified signature.",
          },
          { status: 403 }
        );
      }
      const result = await captureMockViaSignedWebhook(body.paymentId);
      if (!result.ok) {
        return NextResponse.json(result, { status: "status" in result ? Number(result.status) || 400 : 400 });
      }
      return NextResponse.json({ ...result, transport: gw.transport, gateway: gw.slotKey });
    }
    const result = await createCheckout({
      purpose: body.purpose || "consultation",
      amountMinor: Number(body.amountMinor || 0),
      customer: {
        displayName: String(body.displayName || "Customer"),
        phone: body.phone,
        email: body.email,
        stateCode: body.stateCode,
      },
      astrologerId: body.astrologerId,
      planId: body.planId,
      productId: body.productId,
      description: String(body.description || "CosmicTalks payment"),
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
