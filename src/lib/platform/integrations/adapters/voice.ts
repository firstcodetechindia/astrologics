import type { AdapterContext, ProviderAdapter, TestCallResult } from "../types";
import { resolveTransport, timed } from "../transport";

function mockVoice(slotKey: "elevenlabs" | "custom_voice", ctx: AdapterContext): TestCallResult {
  return {
    ok: true,
    category: "voice",
    slotKey,
    sandbox: ctx.sandbox,
    transport: "mock",
    latencyMs: 3,
    message: `${slotKey} mock ping succeeded. TTS is not called until a live key is saved.`,
    details: { voice_id: ctx.config.voice_id || null },
  };
}

export const elevenLabsAdapter: ProviderAdapter = {
  category: "voice",
  slotKey: "elevenlabs",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const key = ctx.secrets.api_key || "";
    const transport = resolveTransport(ctx, key);
    if (transport === "mock") return mockVoice("elevenlabs", ctx);
    const { value, latencyMs } = await timed(async () => {
      const res = await fetch("https://api.elevenlabs.io/v1/user", {
        headers: { "xi-api-key": key },
      });
      return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 200) };
    });
    return {
      ok: value.ok,
      category: "voice",
      slotKey: "elevenlabs",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: value.ok ? "ElevenLabs user endpoint authenticated." : `ElevenLabs returned ${value.status}`,
      details: { httpStatus: value.status, excerpt: value.body },
    };
  },
};

export const customVoiceAdapter: ProviderAdapter = {
  category: "voice",
  slotKey: "custom_voice",
  async testConnection(ctx): Promise<TestCallResult> {
    const key = ctx.secrets.api_key || "";
    const transport = resolveTransport(ctx, key);
    if (transport === "mock") return mockVoice("custom_voice", ctx);
    const base = String(ctx.config.base_url || "").replace(/\/$/, "");
    if (!base) return mockVoice("custom_voice", ctx);
    const { value, latencyMs } = await timed(async () => {
      const res = await fetch(`${base}/health`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      return { status: res.status, ok: res.ok };
    });
    return {
      ok: value.ok,
      category: "voice",
      slotKey: "custom_voice",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: value.ok ? "Custom voice /health succeeded." : `Custom voice returned ${value.status}`,
      details: { httpStatus: value.status },
    };
  },
};

export const voiceAdapters: ProviderAdapter[] = [elevenLabsAdapter, customVoiceAdapter];
