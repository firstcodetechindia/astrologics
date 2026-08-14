/** Named placeholders: {{user_name}} → value. Unknown keys stay visible so drafts are honest. */

export const TEMPLATE_VARS = [
  "user_name",
  "astrologer_name",
  "appointment_time",
  "otp_code",
  "invoice_no",
  "amount",
  "plan_name",
  "expiry_date",
  "product_name",
  "brand_name",
] as const;

export type TemplateVar = (typeof TEMPLATE_VARS)[number];

export function renderTemplate(
  source: string,
  vars: Record<string, string>
): { rendered: string; missing: string[] } {
  const missing: string[] = [];
  const rendered = source.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_, key: string) => {
    const k = key.toLowerCase();
    if (vars[k] != null && vars[k] !== "") return vars[k];
    missing.push(k);
    return `{{${k}}}`;
  });
  return { rendered, missing: [...new Set(missing)] };
}

/** Meta WhatsApp bodies use {{1}} {{2}}. Map named vars in order. */
export function toWhatsAppPositional(body: string, varOrder: string[]): string {
  let out = body;
  varOrder.forEach((name, i) => {
    const re = new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, "gi");
    out = out.replace(re, `{{${i + 1}}}`);
  });
  return out;
}
