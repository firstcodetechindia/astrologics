import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Free Kundli Online — AI Vedic Astrology Hub | CosmicTalks",
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Generate your free Janam Kundli. Explore Vedic, Western & KP astrology, numerology and Panchang. Get AI-powered birth-chart answers in English & Hindi.",
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
    title: "Free Kundli Online — AI Vedic Astrology Hub | CosmicTalks",
    description:
      "Generate your free Janam Kundli. Explore Vedic, Western & KP astrology, numerology and Panchang. Get AI-powered birth-chart answers in English & Hindi.",
    url: siteConfig.siteUrl,
    images: [
      {
        url: siteConfig.brandIcon,
        width: 1080,
        height: 1080,
        alt: `${siteConfig.brandName} — free kundli and AI Vedic astrology`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Kundli Online — AI Vedic Astrology Hub | CosmicTalks",
    description:
      "Generate your free Janam Kundli. Explore Vedic, Western & KP astrology, numerology and Panchang. Get AI-powered birth-chart answers in English & Hindi.",
    images: [siteConfig.brandIcon],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icons/cosmictalks-mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/cosmictalks-mark-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/cosmictalks-mark-180-navy.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
