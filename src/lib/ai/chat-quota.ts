import { createHmac, timingSafeEqual } from "crypto";
import { FREE_CHAT_LIMIT } from "@/lib/ai/chat-limits";

const COOKIE = "al_chat_q";
const DAY_MS = 24 * 60 * 60 * 1000;

function secret() {
  return (
    process.env.CHAT_QUOTA_SECRET ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "cosmicgpt-dev-chat-quota"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex").slice(0, 24);
}

function parseCookie(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

/** Returns used count for current rolling window (0 if missing/invalid). */
export function readChatQuotaUsed(cookieHeader: string | null): number {
  const raw = parseCookie(cookieHeader)[COOKIE];
  if (!raw) return 0;
  const [usedStr, expStr, sig] = raw.split(".");
  if (!usedStr || !expStr || !sig) return 0;
  const payload = `${usedStr}.${expStr}`;
  const expect = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expect);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return 0;
  } catch {
    return 0;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return 0;
  const used = Number(usedStr);
  if (!Number.isFinite(used) || used < 0) return 0;
  return Math.min(FREE_CHAT_LIMIT, Math.floor(used));
}

function buildCookie(used: number, exp: number) {
  const payload = `${used}.${exp}`;
  const value = `${payload}.${sign(payload)}`;
  const maxAge = Math.max(60, Math.floor((exp - Date.now()) / 1000));
  return `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function assertChatQuota(cookieHeader: string | null): {
  allowed: boolean;
  used: number;
  limit: number;
} {
  const used = readChatQuotaUsed(cookieHeader);
  return {
    allowed: used < FREE_CHAT_LIMIT,
    used,
    limit: FREE_CHAT_LIMIT,
  };
}

/** Call after a successful chat start — returns Set-Cookie header value. */
export function consumeChatQuota(cookieHeader: string | null): {
  used: number;
  setCookie: string;
} {
  const prev = readChatQuotaUsed(cookieHeader);
  const cookies = parseCookie(cookieHeader);
  const raw = cookies[COOKIE];
  let exp = Date.now() + DAY_MS;
  if (raw) {
    const parts = raw.split(".");
    const prevExp = Number(parts[1]);
    if (Number.isFinite(prevExp) && prevExp > Date.now()) exp = prevExp;
  }
  const used = Math.min(FREE_CHAT_LIMIT, prev + 1);
  return { used, setCookie: buildCookie(used, exp) };
}

export { COOKIE as CHAT_QUOTA_COOKIE };
