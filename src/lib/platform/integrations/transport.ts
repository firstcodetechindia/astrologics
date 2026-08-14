import type { AdapterContext, AdapterTransport } from "./types";

/** Credentials pasted for local evidence / mock transport — never treated as live vendor keys. */
export function isMockCredential(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return (
    v.startsWith("sandbox_") ||
    v.startsWith("sandbox.") ||
    v.startsWith("sk_sandbox") ||
    v.startsWith("rzp_test_sandbox") ||
    v.endsWith(".example") ||
    v.includes(".example.") ||
    (v.startsWith("xox") && v.includes("sandbox")) ||
    v.includes("_sandbox_")
  );
}

export function resolveTransport(
  ctx: AdapterContext,
  liveCredential?: string
): AdapterTransport {
  if (!liveCredential) return "mock";
  if (isMockCredential(liveCredential)) return "mock";
  if (ctx.sandbox) return "sandbox_api";
  return "live";
}

export async function timed<T>(
  fn: () => Promise<T>
): Promise<{ value: T; latencyMs: number }> {
  const t0 = Date.now();
  const value = await fn();
  return { value, latencyMs: Date.now() - t0 };
}
