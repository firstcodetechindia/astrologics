import type {
  AdapterContext,
  PaymentGateway,
  PaymentOrder,
  CreateOrderInput,
  ProviderAdapter,
  TestCallResult,
} from "../types";
import { isMockCredential, resolveTransport, timed } from "../transport";

function basicAuth(id: string, secret: string) {
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export const razorpayAdapter: ProviderAdapter & PaymentGateway = {
  category: "payment",
  slotKey: "razorpay",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const keyId = ctx.secrets.key_id || "";
    const keySecret = ctx.secrets.key_secret || "";
    const transport = resolveTransport(ctx, keyId || keySecret);
    if (transport === "mock") {
      return {
        ok: true,
        category: "payment",
        slotKey: "razorpay",
        sandbox: ctx.sandbox,
        transport,
        latencyMs: 4,
        message: "Razorpay mock sandbox ping succeeded.",
        details: { orders: "ready", subscriptions: "ready", refunds: "ready" },
      };
    }
    const { value, latencyMs } = await timed(async () => {
      const res = await fetch("https://api.razorpay.com/v1/payments?count=1", {
        headers: { Authorization: basicAuth(keyId, keySecret) },
      });
      const body = await res.text();
      return { status: res.status, ok: res.ok, body: body.slice(0, 240) };
    });
    return {
      ok: value.ok,
      category: "payment",
      slotKey: "razorpay",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: value.ok
        ? "Razorpay API authenticated."
        : `Razorpay API returned ${value.status}`,
      details: { httpStatus: value.status, excerpt: value.body },
    };
  },
  async createOrder(input: CreateOrderInput, ctx: AdapterContext): Promise<PaymentOrder> {
    const keyId = ctx.secrets.key_id || "";
    const transport = resolveTransport(ctx, keyId);
    if (transport === "mock") {
      return {
        gateway: "razorpay",
        orderId: `order_sandbox_${Date.now()}`,
        amountMinor: input.amountMinor,
        currency: input.currency,
        sandbox: true,
      };
    }
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, ctx.secrets.key_secret || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountMinor,
        currency: input.currency,
        receipt: input.receipt,
        notes: input.notes,
      }),
    });
    if (!res.ok) {
      throw new Error(`Razorpay createOrder failed: ${res.status}`);
    }
    const data = (await res.json()) as { id: string };
    return {
      gateway: "razorpay",
      orderId: data.id,
      amountMinor: input.amountMinor,
      currency: input.currency,
      sandbox: ctx.sandbox,
    };
  },
  async createPaymentLink(input, ctx) {
    const keyId = ctx.secrets.key_id || "";
    if (resolveTransport(ctx, keyId) === "mock") {
      return {
        linkId: `plink_sandbox_${Date.now()}`,
        shortUrl: `https://rzp.io/sandbox/${Date.now()}`,
      };
    }
    const res = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, ctx.secrets.key_secret || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountMinor,
        currency: input.currency,
        description: input.description || input.receipt,
        reference_id: input.receipt,
        callback_url: input.callbackUrl,
        notes: input.notes,
      }),
    });
    if (!res.ok) throw new Error(`Razorpay payment_link failed: ${res.status}`);
    const data = (await res.json()) as { id: string; short_url: string };
    return { linkId: data.id, shortUrl: data.short_url };
  },
  async createSubscription(input, ctx) {
    const keyId = ctx.secrets.key_id || "";
    if (resolveTransport(ctx, keyId) === "mock") {
      return {
        planId: `plan_sandbox_${Date.now()}`,
        subscriptionId: `sub_sandbox_${Date.now()}`,
      };
    }
    const period = input.cycle === "annual" ? "yearly" : "monthly";
    const planRes = await fetch("https://api.razorpay.com/v1/plans", {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, ctx.secrets.key_secret || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period,
        interval: 1,
        item: {
          name: input.planName,
          amount: input.amountMinor,
          currency: input.currency,
        },
      }),
    });
    if (!planRes.ok) throw new Error(`Razorpay plan failed: ${planRes.status}`);
    const plan = (await planRes.json()) as { id: string };
    const subRes = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, ctx.secrets.key_secret || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: input.planId || plan.id,
        total_count: input.totalCount ?? (input.cycle === "annual" ? 10 : 12),
        quantity: 1,
      }),
    });
    if (!subRes.ok) throw new Error(`Razorpay subscription failed: ${subRes.status}`);
    const sub = (await subRes.json()) as { id: string };
    return { planId: plan.id, subscriptionId: sub.id };
  },
  async refund(paymentId, amountMinor, ctx) {
    const keyId = ctx.secrets.key_id || "";
    if (resolveTransport(ctx, keyId) === "mock") {
      return { refundId: `rfnd_sandbox_${Date.now()}`, status: "processed" };
    }
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        Authorization: basicAuth(keyId, ctx.secrets.key_secret || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(amountMinor ? { amount: amountMinor } : {}),
    });
    if (!res.ok) throw new Error(`Razorpay refund failed: ${res.status}`);
    const data = (await res.json()) as { id: string; status: string };
    return { refundId: data.id, status: data.status };
  },
};

export const stripeAdapter: ProviderAdapter & PaymentGateway = {
  category: "payment",
  slotKey: "stripe",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const secret = ctx.secrets.secret_key || "";
    const transport = resolveTransport(ctx, secret);
    if (transport === "mock") {
      return {
        ok: true,
        category: "payment",
        slotKey: "stripe",
        sandbox: ctx.sandbox,
        transport,
        latencyMs: 3,
        message: "Stripe mock sandbox ping succeeded (secondary gateway).",
        details: { role: "secondary" },
      };
    }
    const { value, latencyMs } = await timed(async () => {
      const res = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${secret}` },
      });
      return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 240) };
    });
    return {
      ok: value.ok,
      category: "payment",
      slotKey: "stripe",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: value.ok ? "Stripe API authenticated." : `Stripe API returned ${value.status}`,
      details: { httpStatus: value.status, excerpt: value.body },
    };
  },
  async createOrder(input, ctx): Promise<PaymentOrder> {
    const secret = ctx.secrets.secret_key || "";
    if (resolveTransport(ctx, secret) === "mock") {
      return {
        gateway: "stripe",
        orderId: `pi_sandbox_${Date.now()}`,
        amountMinor: input.amountMinor,
        currency: input.currency,
        sandbox: true,
      };
    }
    const params = new URLSearchParams({
      amount: String(input.amountMinor),
      currency: input.currency.toLowerCase(),
    });
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!res.ok) throw new Error(`Stripe createOrder failed: ${res.status}`);
    const data = (await res.json()) as { id: string };
    return {
      gateway: "stripe",
      orderId: data.id,
      amountMinor: input.amountMinor,
      currency: input.currency,
      sandbox: ctx.sandbox,
    };
  },
  async createPaymentLink(input, ctx) {
    const secret = ctx.secrets.secret_key || "";
    if (resolveTransport(ctx, secret) === "mock") {
      return { linkId: `plink_stripe_sandbox_${Date.now()}`, shortUrl: "https://checkout.stripe.com/sandbox" };
    }
    throw new Error("Stripe Payment Links are not the primary checkout path.");
  },
  async createSubscription(input, ctx) {
    const secret = ctx.secrets.secret_key || "";
    if (resolveTransport(ctx, secret) === "mock") {
      return {
        planId: `price_sandbox_${Date.now()}`,
        subscriptionId: `sub_stripe_sandbox_${Date.now()}`,
      };
    }
    const params = new URLSearchParams({
      "items[0][price_data][currency]": input.currency.toLowerCase(),
      "items[0][price_data][product_data][name]": input.planName,
      "items[0][price_data][unit_amount]": String(input.amountMinor),
      "items[0][price_data][recurring][interval]":
        input.cycle === "annual" ? "year" : "month",
    });
    const res = await fetch("https://api.stripe.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!res.ok) throw new Error(`Stripe subscription failed: ${res.status}`);
    const data = (await res.json()) as { id: string };
    return { planId: input.planId || "price_inline", subscriptionId: data.id };
  },
  async refund(paymentId, amountMinor, ctx) {
    const secret = ctx.secrets.secret_key || "";
    if (resolveTransport(ctx, secret) === "mock") {
      return { refundId: `re_sandbox_${Date.now()}`, status: "succeeded" };
    }
    const params = new URLSearchParams({ payment_intent: paymentId });
    if (amountMinor) params.set("amount", String(amountMinor));
    const res = await fetch("https://api.stripe.com/v1/refunds", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!res.ok) throw new Error(`Stripe refund failed: ${res.status}`);
    const data = (await res.json()) as { id: string; status: string };
    return { refundId: data.id, status: data.status };
  },
};

export function getPaymentGateway(slotKey: string): PaymentGateway {
  if (slotKey === "razorpay") return razorpayAdapter;
  if (slotKey === "stripe") return stripeAdapter;
  throw new Error(`Unknown payment slot: ${slotKey}`);
}

/** Checkout should prefer the primary (Razorpay) enabled slot. */
export function preferredPaymentSlot(enabledSlotKeys: string[]): string {
  if (enabledSlotKeys.includes("razorpay")) return "razorpay";
  if (enabledSlotKeys.includes("stripe")) return "stripe";
  return enabledSlotKeys[0] || "razorpay";
}

export function usesMockPaymentSecrets(ctx: AdapterContext) {
  return isMockCredential(ctx.secrets.key_id) || isMockCredential(ctx.secrets.secret_key);
}
