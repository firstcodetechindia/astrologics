const PRODUCTION_SITE_URL = "https://www.cosmicgpt.in";

function resolveSiteUrl(raw?: string) {
  const value = (raw || "").trim().replace(/\/$/, "");
  if (
    !value ||
    value.includes("localhost") ||
    value.includes("127.0.0.1") ||
    value.includes("0.0.0.0")
  ) {
    return PRODUCTION_SITE_URL;
  }
  return value;
}

export const siteConfig = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "CosmicGPT",
  /** Always a public production URL — never localhost (for legal, SEO, share links). */
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+919876543210",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@cosmicgpt.in",
  tagline: {
    en: "Let's Decode Your Stars",
    hi: "आइए अपने सितारों को समझें",
  },
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ||
      "Namaste, I found CosmicGPT and would like a detailed kundli reading and guidance."
  );
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function telLink() {
  return `tel:${siteConfig.phone.replace(/\s/g, "")}`;
}
