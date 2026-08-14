import { getSql } from "@/lib/db";
import { capturePayment } from "@/lib/billing/engine";
import { resolvePaymentGateway } from "@/lib/billing/resolve-gateway";
import {
  mockPaymentCapturedPayload,
  razorpayWebhookSignature,
  verifyRazorpayWebhookSignature,
} from "@/lib/billing/razorpay-webhook";

export function webhookSecretFromGateway(gw: Awaited<ReturnType<typeof resolvePaymentGateway>>) {
  return (
    gw.ctx.secrets.webhook_secret ||
    (typeof gw.ctx.config.webhook_secret === "string" ? gw.ctx.config.webhook_secret : "") ||
    ""
  );
}

export async function handleRazorpayWebhook(rawBody: string, signature: string) {
  const gw = await resolvePaymentGateway();
  if (gw.slotKey !== "razorpay") {
    return { ok: false, status: 400, error: "Active gateway is not Razorpay." };
  }
  const secret = webhookSecretFromGateway(gw);
  if (!verifyRazorpayWebhookSignature(rawBody, signature, secret)) {
    return { ok: false, status: 400, error: "invalid webhook signature" };
  }
  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return { ok: false, status: 400, error: "invalid JSON" };
  }
  if (event.event !== "payment.captured") {
    return { ok: true, ignored: true, event: event.event };
  }
  const orderId = event.payload?.payment?.entity?.order_id;
  const gatewayPaymentId = event.payload?.payment?.entity?.id;
  if (!orderId || !gatewayPaymentId) {
    return { ok: false, status: 400, error: "payment.captured missing order_id" };
  }
  const sql = getSql();
  const pay = await sql`SELECT id FROM payments WHERE gateway_order_id = ${orderId} LIMIT 1`;
  if (!pay[0]) {
    return { ok: false, status: 404, error: "order not found" };
  }
  const captured = await capturePayment(String(pay[0].id), gatewayPaymentId);
  return { ok: true, ...captured };
}

/** Mock transport only: sign a payment.captured event and run the real webhook handler. */
export async function captureMockViaSignedWebhook(paymentId: string) {
  const gw = await resolvePaymentGateway();
  if (gw.transport !== "mock") {
    throw new Error("Live / Razorpay-sandbox payments are captured only via the Razorpay webhook.");
  }
  const secret = webhookSecretFromGateway(gw);
  if (!secret) {
    throw new Error("Razorpay webhook_secret is not configured in the vault.");
  }
  const sql = getSql();
  const pay = await sql`SELECT * FROM payments WHERE id = ${paymentId} LIMIT 1`;
  if (!pay[0]) throw new Error("Payment not found");
  const payload = mockPaymentCapturedPayload({
    orderId: String(pay[0].gateway_order_id),
    paymentId: `pay_sandbox_${Date.now()}`,
    amountMinor: Number(pay[0].amount_minor),
  });
  const rawBody = JSON.stringify(payload);
  const signature = razorpayWebhookSignature(rawBody, secret);
  return handleRazorpayWebhook(rawBody, signature);
}
