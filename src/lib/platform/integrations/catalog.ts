import type { IntegrationCategory, ProviderSlotSpec } from "./types";

const LLM_MODELS_OPENAI = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
];

const LLM_MODELS_ANTHROPIC = [
  { value: "claude-sonnet-4-5", label: "claude-sonnet-4-5" },
  { value: "claude-3-5-haiku-latest", label: "claude-3-5-haiku-latest" },
];

export const PROVIDER_SLOTS: ProviderSlotSpec[] = [
  {
    category: "llm",
    slotKey: "openai",
    displayName: "OpenAI",
    description: "Chat completions for AI Guru and configurable agent personas.",
    secretFields: [
      {
        name: "api_key",
        label: "API key",
        help: "Paste a project key. Sandbox keys starting with sandbox_ stay on the mock transport.",
      },
    ],
    configFields: [
      {
        name: "model",
        label: "Default model",
        inputType: "select",
        options: LLM_MODELS_OPENAI,
      },
      { name: "rpm", label: "Rate limit (req/min)", inputType: "number", placeholder: "60" },
      { name: "tpm", label: "Token budget / min", inputType: "number", placeholder: "80000" },
    ],
    sandboxDefault: true,
  },
  {
    category: "llm",
    slotKey: "anthropic",
    displayName: "Anthropic",
    description: "Claude models as an alternate LLM slot.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [
      {
        name: "model",
        label: "Default model",
        inputType: "select",
        options: LLM_MODELS_ANTHROPIC,
      },
      { name: "rpm", label: "Rate limit (req/min)", inputType: "number", placeholder: "40" },
    ],
    sandboxDefault: true,
  },
  {
    category: "llm",
    slotKey: "custom_llm",
    displayName: "Custom LLM (Sarvam / regional)",
    description:
      "OpenAI-compatible base URL for Sarvam AI or any regional provider. Swap without a code rewrite.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [
      {
        name: "base_url",
        label: "Base URL",
        inputType: "text",
        placeholder: "https://api.sarvam.ai/v1",
      },
      { name: "model", label: "Model id", inputType: "text", placeholder: "sarvam-m" },
      { name: "rpm", label: "Rate limit (req/min)", inputType: "number", placeholder: "30" },
    ],
    sandboxDefault: true,
  },
  {
    category: "voice",
    slotKey: "elevenlabs",
    displayName: "ElevenLabs",
    description: "AI astrologer voice slot. Architecture is provider-agnostic.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [
      { name: "voice_id", label: "Voice id", inputType: "text", placeholder: "default" },
      { name: "model_id", label: "Model id", inputType: "text", placeholder: "eleven_multilingual_v2" },
    ],
    sandboxDefault: true,
  },
  {
    category: "voice",
    slotKey: "custom_voice",
    displayName: "Custom voice provider",
    description: "Generic TTS slot so ElevenLabs can be swapped later.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [
      {
        name: "base_url",
        label: "Base URL",
        inputType: "text",
        placeholder: "https://api.example-tts.com",
      },
    ],
    sandboxDefault: true,
  },
  {
    category: "payment",
    slotKey: "razorpay",
    displayName: "Razorpay",
    description:
      "PRIMARY gateway for India — UPI, cards, netbanking, wallets, EMI. Phase 2 checkout targets this slot.",
    isPrimary: true,
    secretFields: [
      { name: "key_id", label: "Key ID", help: "rzp_test_… for sandbox, rzp_live_… for production." },
      { name: "key_secret", label: "Key secret" },
      {
        name: "webhook_secret",
        label: "Webhook secret",
        help: "Razorpay webhook HMAC secret. Payments are captured only after this signature verifies.",
      },
    ],
    configFields: [],
    sandboxDefault: true,
  },
  {
    category: "payment",
    slotKey: "stripe",
    displayName: "Stripe",
    description:
      "SECONDARY gateway for international / NRI checkout. Same payment abstraction; not the default India path.",
    secretFields: [
      { name: "publishable_key", label: "Publishable key" },
      { name: "secret_key", label: "Secret key" },
    ],
    configFields: [{ name: "webhook_secret", label: "Webhook secret (optional)", inputType: "text" }],
    sandboxDefault: true,
  },
  {
    category: "sms",
    slotKey: "generic_sms",
    displayName: "SMS (MSG91 / Twilio / Gupshup)",
    description: "sendOtp + sendTransactional. Provider kind is config, not a code fork.",
    secretFields: [
      { name: "api_key", label: "API key / auth token" },
      { name: "account_sid", label: "Account SID (Twilio, optional)", inputType: "text" },
    ],
    configFields: [
      {
        name: "provider_kind",
        label: "Provider kind",
        inputType: "select",
        options: [
          { value: "msg91", label: "MSG91" },
          { value: "twilio", label: "Twilio" },
          { value: "gupshup", label: "Gupshup" },
        ],
      },
      { name: "sender_id", label: "Sender ID", inputType: "text", placeholder: "CGYAN" },
      { name: "base_url", label: "Override base URL", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "email",
    slotKey: "smtp",
    displayName: "SMTP",
    description: "Host/port/credentials for transactional mail.",
    secretFields: [
      { name: "username", label: "Username", inputType: "text" },
      { name: "password", label: "Password" },
    ],
    configFields: [
      { name: "host", label: "Host", inputType: "text", placeholder: "smtp.example.com" },
      { name: "port", label: "Port", inputType: "number", placeholder: "587" },
      { name: "from_email", label: "From email", inputType: "text", placeholder: "hello@example.com" },
      { name: "from_name", label: "From name", inputType: "text", placeholder: "CosmicTalks" },
      {
        name: "secure",
        label: "TLS mode",
        inputType: "select",
        options: [
          { value: "starttls", label: "STARTTLS (587)" },
          { value: "tls", label: "TLS (465)" },
        ],
      },
    ],
    sandboxDefault: true,
  },
  {
    category: "email",
    slotKey: "sendgrid",
    displayName: "SendGrid",
    description: "Transactional email API alternative to SMTP.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [
      { name: "from_email", label: "From email", inputType: "text" },
      { name: "from_name", label: "From name", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "email",
    slotKey: "postmark",
    displayName: "Postmark",
    description: "Transactional email API alternative to SMTP.",
    secretFields: [{ name: "server_token", label: "Server token" }],
    configFields: [
      { name: "from_email", label: "From email", inputType: "text" },
      { name: "from_name", label: "From name", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "email",
    slotKey: "ses",
    displayName: "Amazon SES",
    description: "AWS SES transactional email.",
    secretFields: [
      { name: "access_key_id", label: "Access key ID", inputType: "text" },
      { name: "secret_access_key", label: "Secret access key" },
    ],
    configFields: [
      { name: "region", label: "Region", inputType: "text", placeholder: "ap-south-1" },
      { name: "from_email", label: "From email", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "whatsapp",
    slotKey: "meta_whatsapp",
    displayName: "Meta WhatsApp Cloud API",
    description: "WhatsApp Business via Meta. Template approval is tracked in Phase 3.",
    secretFields: [
      { name: "access_token", label: "Access token" },
      { name: "app_secret", label: "App secret" },
    ],
    configFields: [
      { name: "phone_number_id", label: "Phone number ID", inputType: "text" },
      { name: "waba_id", label: "WABA ID", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "whatsapp",
    slotKey: "gupshup_whatsapp",
    displayName: "Gupshup WhatsApp",
    description: "India-friendly WhatsApp Business partner slot.",
    secretFields: [{ name: "api_key", label: "API key" }],
    configFields: [{ name: "app_name", label: "App name", inputType: "text" }],
    sandboxDefault: true,
  },
  {
    category: "whatsapp",
    slotKey: "twilio_whatsapp",
    displayName: "Twilio WhatsApp",
    description: "Twilio WhatsApp sender slot.",
    secretFields: [
      { name: "account_sid", label: "Account SID", inputType: "text" },
      { name: "auth_token", label: "Auth token" },
    ],
    configFields: [
      { name: "from_number", label: "From (whatsapp:+91…)", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "social",
    slotKey: "meta_social",
    displayName: "Meta (Instagram / Facebook)",
    description: "Page posting + likes/comments/shares. Approve-before-post queue is Phase 6. Reach/impressions Insights may need extra Meta permissions — we only pull free engagement counts.",
    secretFields: [
      { name: "app_id", label: "App ID", inputType: "text" },
      { name: "app_secret", label: "App secret" },
      { name: "page_access_token", label: "Page access token" },
    ],
    configFields: [{ name: "page_id", label: "Page ID", inputType: "text" }],
    sandboxDefault: true,
  },
  {
    category: "social",
    slotKey: "linkedin",
    displayName: "LinkedIn",
    description: "Organization posting slot.",
    secretFields: [
      { name: "client_id", label: "Client ID", inputType: "text" },
      { name: "client_secret", label: "Client secret" },
      { name: "access_token", label: "Access token" },
    ],
    configFields: [
      { name: "organization_urn", label: "Organization URN", inputType: "text" },
    ],
    sandboxDefault: true,
  },
  {
    category: "social",
    slotKey: "twitter",
    displayName: "Twitter / X",
    description: "X API slot for scheduled posts.",
    secretFields: [
      { name: "api_key", label: "API key" },
      { name: "api_secret", label: "API secret" },
      { name: "bearer_token", label: "Bearer token" },
    ],
    configFields: [],
    sandboxDefault: true,
  },
  {
    category: "auth",
    slotKey: "auth0",
    displayName: "Auth0",
    description:
      "Architecture is wired. Feature flag stays OFF until credentials are pasted and you explicitly flip it. Dummy OTP remains the live login path.",
    secretFields: [
      { name: "domain", label: "Domain", inputType: "text", help: "your-tenant.auth0.com" },
      { name: "client_id", label: "Client ID", inputType: "text" },
      { name: "client_secret", label: "Client secret" },
      { name: "app_secret", label: "Cookie encryption secret" },
    ],
    configFields: [
      { name: "callback_path", label: "Callback path", inputType: "text", placeholder: "/api/auth/callback" },
    ],
    sandboxDefault: true,
  },
];

export function slotSpec(
  category: IntegrationCategory,
  slotKey: string
): ProviderSlotSpec | undefined {
  return PROVIDER_SLOTS.find((s) => s.category === category && s.slotKey === slotKey);
}

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  llm: "LLM providers",
  voice: "Voice / AI persona",
  payment: "Payment gateways",
  sms: "SMS",
  email: "Email",
  whatsapp: "WhatsApp Business",
  social: "Social media",
  auth: "Identity (Auth0)",
};
