/** Destinations used only by evidence scripts — never a live customer. */

const FIXTURE_PHONES = new Set(["9999999999", "919999999999"]);

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function isFixturePhone(to: string): boolean {
  return FIXTURE_PHONES.has(digitsOnly(to));
}

export function whatsappStatusLabel(status: string): string {
  if (status === "sandbox_approved") return "MOCK approved — not Meta";
  if (status === "sandbox_rejected") return "MOCK rejected — not Meta";
  if (status === "approved") return "Meta approved";
  if (status === "rejected") return "Meta rejected";
  if (status === "submitted") return "Submitted";
  if (status === "pending") return "Pending Meta";
  return status;
}

export function isSandboxWhatsappStatus(status: string): boolean {
  return status === "sandbox_approved" || status === "sandbox_rejected";
}

export function submissionLooksMock(providerResponse: string): boolean {
  try {
    const v = JSON.parse(providerResponse || "{}") as { mock?: boolean };
    return v.mock === true;
  } catch {
    return false;
  }
}
