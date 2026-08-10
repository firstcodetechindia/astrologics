export const siteConfig = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "Astrologics",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://astrologics.co",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+919876543210",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@astrologics.co",
  tagline: {
    en: "Clear Vedic kundli guidance for modern life",
    hi: "आधुनिक जीवन के लिए स्पष्ट वैदिक कुंडली मार्गदर्शन",
  },
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ||
      "Namaste, I found Astrologics and would like a detailed kundli reading and guidance."
  );
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function telLink() {
  return `tel:${siteConfig.phone.replace(/\s/g, "")}`;
}
