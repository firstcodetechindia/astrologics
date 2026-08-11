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
          url: "/astrologics-icon-512.png",
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
      images: ["/astrologics-icon-512.png"],
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
    logo: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.siteUrl}/en/calculators?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
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
