/**
 * Isolated webhook HMAC reject test — prints pass/fail for a tampered payload.
 * Usage: npx tsx scripts/phase2-webhook-reject.ts
 */
import {
  mockPaymentCapturedPayload,
  razorpayWebhookSignature,
  verifyRazorpayWebhookSignature,
} from "../src/lib/billing/razorpay-webhook.ts";

const secret = "sandbox_rzp_webhook_secret_TEST";
const body = JSON.stringify(
  mockPaymentCapturedPayload({
    orderId: "order_real",
    paymentId: "pay_real",
    amountMinor: 49900,
  })
);
const valid = razorpayWebhookSignature(body, secret);
const tamperedSig = "0".repeat(64);
const tamperedBody = body.replace("pay_real", "pay_FORGED");

const rows = [
  ["valid HMAC", verifyRazorpayWebhookSignature(body, valid, secret), true],
  ["all-zero signature", verifyRazorpayWebhookSignature(body, tamperedSig, secret), false],
  ["empty signature", verifyRazorpayWebhookSignature(body, "", secret), false],
  ["body tampered, old signature kept", verifyRazorpayWebhookSignature(tamperedBody, valid, secret), false],
] as const;

let failed = 0;
for (const [name, got, expect] of rows) {
  const ok = got === expect;
  if (!ok) failed += 1;
  console.log(
    JSON.stringify({
      case: name,
      accepted: got,
      expectedAccepted: expect,
      result: ok ? "PASS" : "FAIL",
    })
  );
}
if (failed) process.exit(1);
console.log(JSON.stringify({ ok: true, rejectedTampered: true, acceptedValid: true }));
