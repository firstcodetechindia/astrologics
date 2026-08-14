/**
 * Redact secret-bearing fields before any log, audit, or error payload.
 * Envelope encryption at rest is useless if plaintext was printed in transit.
 */
const SECRET_KEY_RE =
  /^(value|plaintext|password|secret|api_key|apiKey|client_secret|clientSecret|key_secret|keySecret|access_token|accessToken|auth_token|authToken|bearer_token|bearerToken|page_access_token|app_secret|appSecret|server_token|secret_access_key|secret_key|secretKey|cookie encryption secret)$/i;

const SECRET_VALUE_RE =
  /(?:sk-|rk_live_|rk_test_|rzp_live_|rzp_test_|xox[baprs]-|whsec_|sg\.|Bearer\s+)/i;

export function isSecretFieldName(name: string): boolean {
  return SECRET_KEY_RE.test(name);
}

export function redactValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  if (value.length <= 4) return "[redacted]";
  if (SECRET_VALUE_RE.test(value) || value.length >= 12) {
    return `[redacted last4=${value.slice(-4)}]`;
  }
  return "[redacted]";
}

export function redactRecord(
  input: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(input)) {
    if (isSecretFieldName(key)) {
      out[key] = typeof val === "string" ? redactValue(val) : "[redacted]";
      continue;
    }
    if (val && typeof val === "object" && !Array.isArray(val)) {
      out[key] = redactRecord(val as Record<string, unknown>);
      continue;
    }
    out[key] = val;
  }
  return out;
}

export function assertNoPlaintextSecret(
  payload: unknown,
  knownPlaintext: string
): void {
  if (!knownPlaintext || knownPlaintext.length < 8) return;
  const blob = JSON.stringify(payload);
  if (blob.includes(knownPlaintext)) {
    throw new Error("Refusing to persist or log a payload that contains a raw secret");
  }
}
