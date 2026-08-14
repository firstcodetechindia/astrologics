export const INTEGRATION_CATEGORIES = [
  "llm",
  "voice",
  "payment",
  "sms",
  "email",
  "whatsapp",
  "social",
  "auth",
] as const;

export type IntegrationCategory = (typeof INTEGRATION_CATEGORIES)[number];

export type SecretFieldSpec = {
  name: string;
  label: string;
  inputType?: "password" | "text";
  help?: string;
};

export type ConfigFieldSpec = {
  name: string;
  label: string;
  inputType: "text" | "number" | "select" | "textarea";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
};

export type ProviderSlotSpec = {
  category: IntegrationCategory;
  slotKey: string;
  displayName: string;
  description: string;
  isPrimary?: boolean;
  secretFields: SecretFieldSpec[];
  configFields: ConfigFieldSpec[];
  sandboxDefault: boolean;
};

export type AdapterTransport = "live" | "sandbox_api" | "mock";

export type AdapterContext = {
  secrets: Record<string, string>;
  config: Record<string, unknown>;
  sandbox: boolean;
};

export type TestCallResult = {
  ok: boolean;
  category: IntegrationCategory;
  slotKey: string;
  sandbox: boolean;
  transport: AdapterTransport;
  latencyMs: number;
  message: string;
  details?: Record<string, unknown>;
};

export type SocialPublisher = {
  slotKey: string;
  publishPost(
    input: { body: string; ctx: AdapterContext }
  ): Promise<{ postId: string; transport: AdapterTransport; url?: string }>;
  fetchEngagement(
    postId: string,
    ctx: AdapterContext
  ): Promise<{
    likes: number;
    comments: number;
    shares: number;
    source: "mock" | "api";
    note?: string;
  }>;
};

export type ProviderAdapter = {
  category: IntegrationCategory;
  slotKey: string;
  testConnection(ctx: AdapterContext): Promise<TestCallResult>;
};

/** Shared payment contract — checkout callers never import a vendor SDK. */
export type CreateOrderInput = {
  amountMinor: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type PaymentOrder = {
  gateway: string;
  orderId: string;
  amountMinor: number;
  currency: string;
  sandbox: boolean;
};

export type PaymentGateway = {
  slotKey: string;
  createOrder(input: CreateOrderInput, ctx: AdapterContext): Promise<PaymentOrder>;
  createPaymentLink(
    input: CreateOrderInput & { description?: string; callbackUrl?: string },
    ctx: AdapterContext
  ): Promise<{ linkId: string; shortUrl: string }>;
  createSubscription(
    input: {
      planId?: string;
      planName: string;
      amountMinor: number;
      currency: string;
      cycle: "monthly" | "annual";
      totalCount?: number;
    },
    ctx: AdapterContext
  ): Promise<{ subscriptionId: string; planId: string }>;
  refund(
    paymentId: string,
    amountMinor: number | undefined,
    ctx: AdapterContext
  ): Promise<{ refundId: string; status: string }>;
};

export type SmsProvider = {
  slotKey: string;
  sendOtp(to: string, code: string, ctx: AdapterContext): Promise<{ messageId: string }>;
  sendTransactional(
    to: string,
    body: string,
    ctx: AdapterContext
  ): Promise<{ messageId: string }>;
};

export type EmailProvider = {
  slotKey: string;
  send(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    ctx: AdapterContext;
  }): Promise<{ messageId: string }>;
};

export type WhatsappProvider = {
  slotKey: string;
  submitTemplate(
    input: {
      name: string;
      language: string;
      category: string;
      body: string;
    },
    ctx: AdapterContext
  ): Promise<{ submissionId: string; status: string; providerResponse: Record<string, unknown> }>;
  sendTemplate(
    input: {
      to: string;
      templateName: string;
      language: string;
      body: string;
      approved: boolean;
    },
    ctx: AdapterContext
  ): Promise<{ messageId: string }>;
};

export type VoiceProvider = {
  slotKey: string;
  synthesize?(
    text: string,
    ctx: AdapterContext
  ): Promise<{ audioUrl?: string; skipped: boolean }>;
};

export type IntegrationProviderRow = {
  id: string;
  category: IntegrationCategory;
  slot_key: string;
  display_name: string;
  enabled: boolean;
  sandbox_mode: boolean;
  is_primary: boolean;
  config_json: string;
  created_at: string;
  updated_at: string;
};

export type SecretPublicView = {
  name: string;
  label: string;
  configured: boolean;
  last4: string | null;
  masked: string;
  rotatedAt: string | null;
};

export type ProviderPublicView = {
  id: string;
  category: IntegrationCategory;
  slotKey: string;
  displayName: string;
  description: string;
  enabled: boolean;
  sandboxMode: boolean;
  isPrimary: boolean;
  config: Record<string, unknown>;
  secretFields: SecretFieldSpec[];
  configFields: ConfigFieldSpec[];
  secrets: SecretPublicView[];
  usage: { metric: string; quantity: number }[];
};

export type AuditLogRow = {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  metadata: string;
  created_at: string;
};
