import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.astrologics.co"
  ),
  title: {
    default: `${siteConfig.brandName} — Free Kundli, AI Astrology & Horoscope`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Free kundli, AI astrology chat, Western guides, KP tools, numerology, daily horoscope, Panchang and 30+ calculators in English & Hindi.",
  applicationName: siteConfig.brandName,
  keywords: [
    "free kundli online",
    "janam kundali",
    "astrology",
    "AI astrology",
    "western astrology",
    "KP astrology",
    "numerology",
    "aaj ka rashifal",
    "horoscope today",
    "gun milan",
    "kundli matching",
    "moon sign calculator",
    "panchang today",
    "lagna calculator",
  ],
  authors: [{ name: siteConfig.brandName, url: siteConfig.siteUrl }],
  creator: siteConfig.brandName,
  publisher: siteConfig.brandName,
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandName} — Free Kundli & AI Astrology`,
    description:
      "Generate free janam kundali, explore Western, KP and numerology tools, read horoscope and chat with AI Guru — English & Hindi.",
    url: siteConfig.siteUrl,
    images: [
      {
        url: "/astrologics-icon-512.png",
        width: 512,
        height: 512,
        alt: siteConfig.brandName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — Free Kundli & AI Astrology`,
    description:
      "Free kundli, Western, KP, numerology, horoscope and AI chart guidance in EN & HI.",
    images: ["/astrologics-icon-512.png"],
  },
  robots: {
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
  category: "Astrology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
