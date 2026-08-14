import type { AdapterContext, ProviderAdapter, TestCallResult } from "../types";
import { resolveTransport, timed } from "../transport";

async function openaiTest(ctx: AdapterContext): Promise<TestCallResult> {
  const key = ctx.secrets.api_key || "";
  const transport = resolveTransport(ctx, key);
  if (transport === "mock") {
    return {
      ok: true,
      category: "llm",
      slotKey: "openai",
      sandbox: ctx.sandbox,
      transport,
      latencyMs: 5,
      message: "OpenAI mock sandbox ping succeeded.",
      details: { model: ctx.config.model || "gpt-4o-mini" },
    };
  }
  const { value, latencyMs } = await timed(async () => {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 240) };
  });
  return {
    ok: value.ok,
    category: "llm",
    slotKey: "openai",
    sandbox: ctx.sandbox,
    transport,
    latencyMs,
    message: value.ok ? "OpenAI models endpoint authenticated." : `OpenAI returned ${value.status}`,
    details: { httpStatus: value.status, excerpt: value.body },
  };
}

async function anthropicTest(ctx: AdapterContext): Promise<TestCallResult> {
  const key = ctx.secrets.api_key || "";
  const transport = resolveTransport(ctx, key);
  if (transport === "mock") {
    return {
      ok: true,
      category: "llm",
      slotKey: "anthropic",
      sandbox: ctx.sandbox,
      transport,
      latencyMs: 5,
      message: "Anthropic mock sandbox ping succeeded.",
      details: { model: ctx.config.model || "claude-sonnet-4-5" },
    };
  }
  const { value, latencyMs } = await timed(async () => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ctx.config.model || "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 240) };
  });
  return {
    ok: value.ok,
    category: "llm",
    slotKey: "anthropic",
    sandbox: ctx.sandbox,
    transport,
    latencyMs,
    message: value.ok ? "Anthropic messages endpoint authenticated." : `Anthropic returned ${value.status}`,
    details: { httpStatus: value.status, excerpt: value.body },
  };
}

async function customLlmTest(ctx: AdapterContext): Promise<TestCallResult> {
  const key = ctx.secrets.api_key || "";
  const base = String(ctx.config.base_url || "").replace(/\/$/, "");
  const transport = resolveTransport(ctx, key);
  if (transport === "mock" || !base) {
    return {
      ok: true,
      category: "llm",
      slotKey: "custom_llm",
      sandbox: ctx.sandbox,
      transport: "mock",
      latencyMs: 4,
      message: "Custom LLM mock ping succeeded (Sarvam / OpenAI-compatible slot).",
      details: { base_url: base || null, model: ctx.config.model || null },
    };
  }
  const { value, latencyMs } = await timed(async () => {
    const res = await fetch(`${base}/models`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 240) };
  });
  return {
    ok: value.ok,
    category: "llm",
    slotKey: "custom_llm",
    sandbox: ctx.sandbox,
    transport,
    latencyMs,
    message: value.ok ? "Custom LLM /models authenticated." : `Custom LLM returned ${value.status}`,
    details: { httpStatus: value.status, excerpt: value.body },
  };
}

export const llmAdapters: ProviderAdapter[] = [
  { category: "llm", slotKey: "openai", testConnection: openaiTest },
  { category: "llm", slotKey: "anthropic", testConnection: anthropicTest },
  { category: "llm", slotKey: "custom_llm", testConnection: customLlmTest },
];
