import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const OG_LOCALE = { en: "en_IN", hi: "hi_IN" } as const;

/** Build consistent on-page SEO for EN/HI App Router pages. */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  type = "website",
  noIndex = false,
}: {
  locale: string;
  /** Path after locale, e.g. "/kundli" or "/horoscope/aries". Use "" for home. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const enUrl = `${siteConfig.siteUrl}/en${normalized}`;
  const hiUrl = `${siteConfig.siteUrl}/hi${normalized}`;
  const canonical = `${siteConfig.siteUrl}/${locale === "hi" ? "hi" : "en"}${normalized}`;
  const desc = description.slice(0, 165);

  return {
    title: { absolute: title },
    description: desc,
    keywords,
    authors: [{ name: siteConfig.brandName, url: siteConfig.siteUrl }],
    creator: siteConfig.brandName,
    publisher: siteConfig.brandName,
    category: "Astrology",
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        hi: hiUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: siteConfig.brandName,
      locale: locale === "hi" ? OG_LOCALE.hi : OG_LOCALE.en,
      alternateLocale: locale === "hi" ? [OG_LOCALE.en] : [OG_LOCALE.hi],
      type,
      images: [
        {
          url: siteConfig.brandIcon,
          width: 512,
          height: 512,
          alt: `${siteConfig.brandName} — Kundli, AI astrology & calculators`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [siteConfig.brandIcon],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function absoluteUrl(locale: string, path = "") {
  const normalized = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}/${locale === "hi" ? "hi" : "en"}${normalized}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}${siteConfig.brandIcon}`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [
      `https://wa.me/${siteConfig.whatsapp}`,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    inLanguage: ["en-IN", "hi-IN"],
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
  };
}

export function howToKundliJsonLd(locale: string) {
  const hi = locale === "hi";
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: hi
      ? "CosmicTalks पर मुफ्त कुंडली कैसे बनाएँ"
      : "How to generate a free kundli on CosmicTalks",
    description: hi
      ? "जन्म तिथि, समय और स्थान से लाहिरी निरयण जन्म कुंडली बनाएँ।"
      : "Create a Lahiri sidereal janam kundali from birth date, time and place.",
    totalTime: "PT2M",
    tool: [
      {
        "@type": "HowToTool",
        name: hi ? "जन्म विवरण" : "Birth details",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: hi ? "जन्म विवरण भरें" : "Enter birth details",
        text: hi
          ? "जन्म तिथि, यथासंभव सटीक जन्म समय और जन्म शहर चुनें।"
          : "Add date of birth, the most accurate birth time you have, and select your birth city.",
        url: absoluteUrl(locale, "/kundli"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: hi ? "कुंडली बनाएँ" : "Generate the chart",
        text: hi
          ? "जनरेट पर टैप करें — इंजन लाहिरी अयनांश से ग्रह स्थिति और लग्न निकालता है।"
          : "Tap generate — the engine computes planetary positions and Lagna with Lahiri ayanamsa.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: hi ? "रिपोर्ट पढ़ें" : "Read your report",
        text: hi
          ? "लग्न, ग्रह, भाव, नक्षत्र, योग और विंशोत्तरी दशा देखें।"
          : "Review Lagna, planets, houses, Nakshatras, yogas and Vimshottari dasha.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: hi ? "अगला कदम" : "Next step",
        text: hi
          ? "एआई गुरु से प्रश्न पूछें या सत्यापित ज्योतिषी से चैट करें।"
          : "Ask AI Guru about your chart or chat with a verified astrologer for personal guidance.",
      },
    ],
  };
}

export function personAuthorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${siteConfig.brandName} Editorial`,
    url: `${siteConfig.siteUrl}/en/about`,
    jobTitle: "Astrology content & methodology",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
    knowsAbout: [
      "Vedic astrology",
      "Janam Kundli",
      "KP astrology",
      "Numerology",
      "Panchang",
    ],
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function faqPageJsonLd(
  faqs: { q: string; a: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function softwareAppJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description,
    url,
    inLanguage: ["en-IN", "hi-IN"],
    provider: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
  };
}
