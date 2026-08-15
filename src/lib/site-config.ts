/** Intended public origin. Override with NEXT_PUBLIC_SITE_URL. */
const PRODUCTION_SITE_URL = "https://www.thecosmictalks.com";

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

function publicHostname() {
  try {
    return new URL(resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)).hostname.replace(
      /^www\./,
      ""
    );
  } catch {
    return "thecosmictalks.com";
  }
}

export const siteConfig = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "CosmicTalks",
  /** Always a public production URL — never localhost (for legal, SEO, share links). */
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  /** Transparent mark for loaders / on-navy UI. */
  brandLogo: "/icons/cosmictalks-mark.png",
  /**
   * Square site icon: mark + CosmicTalks + tagline (navy plate).
   * Used for Open Graph, Twitter, and JSON-LD.
   */
  brandIcon: "/icons/cosmictalks-lockup-square.png",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+919876543210",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || `hello@${publicHostname()}`,
  tagline: {
    en: "Let's Decode Your Stars",
    hi: "आइए अपने सितारों को समझें",
  },
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ||
      "Namaste, I found CosmicTalks and would like a detailed kundli reading and guidance."
  );
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function telLink() {
  return `tel:${siteConfig.phone.replace(/\s/g, "")}`;
}

export function defaultNoreplyEmail() {
  return `noreply@${publicHostname()}`;
}
