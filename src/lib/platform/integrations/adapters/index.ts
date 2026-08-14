import { llmAdapters } from "./llm";
import { voiceAdapters } from "./voice";
import { razorpayAdapter, stripeAdapter } from "./payment";
import { genericSmsAdapter } from "./sms";
import { emailAdapters } from "./email";
import { whatsappAdapters } from "./whatsapp";
import { socialAdapters } from "./social";
import { auth0Adapter } from "./auth0-slot";
import type { IntegrationCategory, ProviderAdapter } from "../types";

const ALL: ProviderAdapter[] = [
  ...llmAdapters,
  ...voiceAdapters,
  razorpayAdapter,
  stripeAdapter,
  genericSmsAdapter,
  ...emailAdapters,
  ...whatsappAdapters,
  ...socialAdapters,
  auth0Adapter,
];

export function getAdapter(
  category: IntegrationCategory,
  slotKey: string
): ProviderAdapter | undefined {
  return ALL.find((a) => a.category === category && a.slotKey === slotKey);
}

export function adaptersForCategory(category: IntegrationCategory): ProviderAdapter[] {
  return ALL.filter((a) => a.category === category);
}
