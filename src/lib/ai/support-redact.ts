/**
 * DPDP-minded redaction for Super Admin support logs.
 * Full account dumps and raw birth/geo/contact are not needed to debug a flow.
 */
export function redactSupportText(raw: string): string {
  return String(raw || "")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .replace(/\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g, "[redacted-phone]")
    .replace(/\b(19|20)\d{2}[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/g, "[redacted-date]")
    .replace(/\b(?:lat(?:itude)?|lon(?:gitude)?)\s*[:=]?\s*-?\d+(?:\.\d+)?/gi, "[redacted-geo]");
}

export function redactVars(vars: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars || {})) {
    const k = key.toLowerCase();
    if (/(email|phone|dob|birth|lat|lon|password|otp)/.test(k)) {
      out[key] = "[redacted]";
      continue;
    }
    out[key] = redactSupportText(value);
  }
  return out;
}
