import net from "node:net";
import type { AdapterContext, EmailProvider, ProviderAdapter, TestCallResult } from "../types";
import { resolveTransport, timed } from "../transport";

async function tcpPing(host: string, port: number, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const t = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);
    socket.on("connect", () => {
      clearTimeout(t);
      socket.end();
      resolve(true);
    });
    socket.on("error", () => {
      clearTimeout(t);
      resolve(false);
    });
  });
}

export const smtpAdapter: ProviderAdapter & EmailProvider = {
  category: "email",
  slotKey: "smtp",
  async testConnection(ctx: AdapterContext): Promise<TestCallResult> {
    const password = ctx.secrets.password || "";
    const host = String(ctx.config.host || "");
    const port = Number(ctx.config.port || 587);
    const transport = resolveTransport(ctx, password);
    if (transport === "mock" || !host) {
      return {
        ok: true,
        category: "email",
        slotKey: "smtp",
        sandbox: ctx.sandbox,
        transport: "mock",
        latencyMs: 4,
        message: "SMTP mock ping succeeded. Host/port will be used when real credentials are saved.",
        details: { host: host || null, port },
      };
    }
    const { value, latencyMs } = await timed(() => tcpPing(host, port));
    return {
      ok: value,
      category: "email",
      slotKey: "smtp",
      sandbox: ctx.sandbox,
      transport,
      latencyMs,
      message: value
        ? `SMTP TCP connect to ${host}:${port} succeeded.`
        : `SMTP TCP connect to ${host}:${port} failed.`,
      details: { host, port },
    };
  },
  async send({ to, subject, html, text, ctx }) {
    const password = ctx.secrets.password || "";
    const host = String(ctx.config.host || "");
    const port = Number(ctx.config.port || 587);
    const user = ctx.secrets.username || "";
    const fromEmail = String(ctx.config.from_email || user || "noreply@cosmicgpt.in");
    const fromName = String(ctx.config.from_name || "CosmicGyan");
    if (resolveTransport(ctx, password) === "mock" || !host) {
      return { messageId: `smtp_sandbox_${Date.now()}` };
    }
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465 || String(ctx.config.secure || "") === "tls",
      auth: user ? { user, pass: password } : undefined,
    });
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " "),
    });
    return { messageId: String(info.messageId || `smtp_${Date.now()}`) };
  },
};

async function apiKeyPing(
  slotKey: "sendgrid" | "postmark" | "ses",
  ctx: AdapterContext,
  url: string,
  headers: Record<string, string>,
  secret: string
): Promise<TestCallResult> {
  const transport = resolveTransport(ctx, secret);
  if (transport === "mock") {
    return {
      ok: true,
      category: "email",
      slotKey,
      sandbox: ctx.sandbox,
      transport,
      latencyMs: 3,
      message: `${slotKey} mock ping succeeded.`,
    };
  }
  const { value, latencyMs } = await timed(async () => {
    const res = await fetch(url, { headers });
    return { status: res.status, ok: res.ok, body: (await res.text()).slice(0, 200) };
  });
  return {
    ok: value.ok,
    category: "email",
    slotKey,
    sandbox: ctx.sandbox,
    transport,
    latencyMs,
    message: value.ok
      ? `${slotKey} API authenticated.`
      : `${slotKey} API returned ${value.status}`,
    details: { httpStatus: value.status, excerpt: value.body },
  };
}

export const sendgridAdapter: ProviderAdapter & EmailProvider = {
  category: "email",
  slotKey: "sendgrid",
  testConnection: (ctx) =>
    apiKeyPing(
      "sendgrid",
      ctx,
      "https://api.sendgrid.com/v3/scopes",
      { Authorization: `Bearer ${ctx.secrets.api_key || ""}` },
      ctx.secrets.api_key || ""
    ),
  async send({ to, subject, html, text, ctx }) {
    const key = ctx.secrets.api_key || "";
    if (resolveTransport(ctx, key) === "mock") {
      return { messageId: `sg_sandbox_${Date.now()}` };
    }
    const fromEmail = String(ctx.config.from_email || "noreply@cosmicgpt.in");
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail },
        subject,
        content: [
          { type: "text/plain", value: text || html.replace(/<[^>]+>/g, " ") },
          { type: "text/html", value: html },
        ],
      }),
    });
    if (!res.ok) throw new Error(`SendGrid send failed (${res.status})`);
    return { messageId: res.headers.get("x-message-id") || `sg_${Date.now()}` };
  },
};

export const postmarkAdapter: ProviderAdapter = {
  category: "email",
  slotKey: "postmark",
  testConnection: (ctx) =>
    apiKeyPing(
      "postmark",
      ctx,
      "https://api.postmarkapp.com/server",
      { "X-Postmark-Server-Token": ctx.secrets.server_token || "" },
      ctx.secrets.server_token || ""
    ),
};

export const sesAdapter: ProviderAdapter = {
  category: "email",
  slotKey: "ses",
  async testConnection(ctx): Promise<TestCallResult> {
    const key = ctx.secrets.access_key_id || "";
    const transport = resolveTransport(ctx, key);
    return {
      ok: true,
      category: "email",
      slotKey: "ses",
      sandbox: ctx.sandbox,
      transport: transport === "live" ? "sandbox_api" : transport,
      latencyMs: 2,
      message:
        transport === "mock"
          ? "SES mock ping succeeded."
          : "SES credentials stored. Signed live send is Phase 3.",
      details: { region: ctx.config.region || "ap-south-1" },
    };
  },
};

export const emailAdapters: ProviderAdapter[] = [
  smtpAdapter,
  sendgridAdapter,
  postmarkAdapter,
  sesAdapter,
];
