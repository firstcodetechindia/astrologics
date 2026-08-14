import { createHmac, timingSafeEqual } from "node:crypto";

/** Razorpay: HMAC-SHA256 hex digest of the raw webhook body. */
export function razorpayWebhookSignature(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) return false;
  const expected = razorpayWebhookSignature(rawBody, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export type RazorpayPaymentCapturedEvent = {
  event: "payment.captured";
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: string;
      };
    };
  };
};

export function mockPaymentCapturedPayload(input: {
  orderId: string;
  paymentId: string;
  amountMinor: number;
}): RazorpayPaymentCapturedEvent {
  return {
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: input.paymentId,
          order_id: input.orderId,
          amount: input.amountMinor,
          status: "captured",
        },
      },
    },
  };
}
