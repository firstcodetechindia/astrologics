import type {
  AdapterContext,
  ProviderAdapter,
  TestCallResult,
  WhatsappProvider,
} from "../types";
import { resolveTransport } from "../transport";

function ping(
  slotKey: string,
  ctx: AdapterContext,
  secret: string,
  extra?: Record<string, unknown>
): TestCallResult {
  const transport = resolveTransport(ctx, secret);
  return {
    ok: true,
    category: "whatsapp",
    slotKey,
    sandbox: ctx.sandbox,
    transport: transport === "live" ? "sandbox_api" : transport,
    latencyMs: 3,
    message:
      transport === "mock"
        ? `${slotKey} mock ping succeeded. Template submit/approval is tracked in Super Admin.`
        : `${slotKey} credentials stored. Live Graph send requires an approved template.`,
    details: extra,
  };
}

export const metaWhatsappAdapter: ProviderAdapter & WhatsappProvider = {
  category: "whatsapp",
  slotKey: "meta_whatsapp",
  testConnection: (ctx) =>
    ping("meta_whatsapp", ctx, ctx.secrets.access_token || "", {
      phone_number_id: ctx.config.phone_number_id || null,
    }),
  async submitTemplate(input, ctx) {
    const token = ctx.secrets.access_token || "";
    const wabaId = String(ctx.config.waba_id || "");
    if (resolveTransport(ctx, token) === "mock" || !wabaId) {
      return {
        submissionId: `waba_sub_sandbox_${Date.now()}`,
        status: "submitted",
        providerResponse: {
          mock: true,
          note: "Meta Graph was not called. Paste a real token + WABA id to submit for review.",
          name: input.name,
          language: input.language,
          category: input.category,
        },
      };
    }
    const res = await fetch(`https://graph.facebook.com/v21.0/${wabaId}/message_templates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        language: input.language,
        category: input.category,
        components: [{ type: "BODY", text: input.body }],
      }),
    });
    const json = (await res.json()) as { id?: string; status?: string; error?: { message?: string } };
    if (!res.ok) {
      throw new Error(json.error?.message || `Meta template submit failed (${res.status})`);
    }
    return {
      submissionId: String(json.id || `waba_${Date.now()}`),
      status: String(json.status || "PENDING").toLowerCase() === "approved" ? "approved" : "submitted",
      providerResponse: json as Record<string, unknown>,
    };
  },
  async sendTemplate(input, ctx) {
    const token = ctx.secrets.access_token || "";
    const phoneId = String(ctx.config.phone_number_id || "");
    const transport = resolveTransport(ctx, token);
    if (transport === "mock") {
      if (!input.approved) {
        return { messageId: `wa_sandbox_blocked_unapproved_${Date.now()}` };
      }
      return { messageId: `wa_sandbox_${Date.now()}` };
    }
    if (!input.approved) {
      throw new Error(
        "WhatsApp business-initiated messages outside the 24-hour window require a Meta-approved template."
      );
    }
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.to.replace(/\D/g, ""),
        type: "template",
        template: { name: input.templateName, language: { code: input.language } },
      }),
    });
    const json = (await res.json()) as { messages?: { id: string }[]; error?: { message?: string } };
    if (!res.ok) throw new Error(json.error?.message || `WhatsApp send failed (${res.status})`);
    return { messageId: json.messages?.[0]?.id || `wa_${Date.now()}` };
  },
};

export const whatsappAdapters: ProviderAdapter[] = [
  metaWhatsappAdapter,
  {
    category: "whatsapp",
    slotKey: "gupshup_whatsapp",
    testConnection: (ctx) =>
      ping("gupshup_whatsapp", ctx, ctx.secrets.api_key || "", {
        app_name: ctx.config.app_name || null,
      }),
  },
  {
    category: "whatsapp",
    slotKey: "twilio_whatsapp",
    testConnection: (ctx) =>
      ping("twilio_whatsapp", ctx, ctx.secrets.auth_token || "", {
        from_number: ctx.config.from_number || null,
      }),
  },
];
