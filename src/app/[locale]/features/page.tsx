import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/features",
    title: hi
      ? `प्लेटफ़ॉर्म विशेषताएँ — कुंडली, एआई गुरु | ${siteConfig.brandName}`
      : `Platform Features — Kundli, AI Guru & 30+ Tools | ${siteConfig.brandName}`,
    description: hi
      ? "CosmicGPT पर मुफ्त जन्म कुंडली, एआई गुरु चैट, गुण मिलान, राशिफल, पंचांग, केपी, अंक ज्योतिष और 30+ कैलकुलेटर — सब एक जगह।"
      : "Explore CosmicGPT platform features: free janam kundali, AI Guru chat, gun milan, horoscope, panchang, KP, numerology and 30+ calculators in one place.",
    keywords: hi
      ? [
          "कुंडली विशेषताएँ",
          "एआई ज्योतिष",
          "गुण मिलान",
          "मुफ्त कुंडली",
          "केपी ज्योतिष",
          "अंक ज्योतिष",
        ]
      : [
          "AI astrology features",
          "free kundli online",
          "gun milan",
          "KP calculators",
          "numerology tools",
          "AI Guru chat",
        ],
  });
}

const FEATURES = [
  {
    href: "/chat",
    icon: "🤖",
    title: { en: "AI Chart Chat", hi: "एआई कुंडली चैट" },
    text: {
      en: "Ask follow-up questions on your birth chart in English or Hindi.",
      hi: "अपनी कुंडली पर हिंदी या अंग्रेज़ी में प्रश्न पूछें।",
    },
  },
  {
    href: "/kundli",
    icon: "📜",
    title: { en: "Full Birth Chart", hi: "पूर्ण जन्म कुंडली" },
    text: {
      en: "Lagna, planets, houses, yogas, dasha and life insights.",
      hi: "लग्न, ग्रह, भाव, योग, दशा और जीवन मार्गदर्शन।",
    },
  },
  {
    href: "/panchang",
    icon: "📅",
    title: { en: "Today Panchang", hi: "आज का पंचांग" },
    text: {
      en: "Sunrise, tithi, nakshatra, yoga, karana and muhurat for any city.",
      hi: "किसी भी शहर के सूर्योदय, तिथि, नक्षत्र, योग, करण व मुहूर्त।",
    },
  },
  {
    href: "/calculators/kundli-matching",
    icon: "💞",
    title: { en: "Kundli Matching", hi: "कुंडली मिलान" },
    text: {
      en: "36-point Ashtakoot Gun Milan with clear verdict.",
      hi: "36 अंक अष्टकूट गुण मिलान स्पष्ट परिणाम के साथ।",
    },
  },
  {
    href: "/calculators",
    icon: "🧮",
    title: { en: "30+ Free Calculators", hi: "30+ मुफ्त कैलकुलेटर" },
    text: {
      en: "Dosha, KP, numerology, gems, dasha and more.",
      hi: "दोष, केपी, अंक ज्योतिष, रत्न, दशा और अधिक।",
    },
  },
  {
    href: "/numerology",
    icon: "🔢",
    title: { en: "Numerology Calculator", hi: "अंक ज्योतिष कैलकुलेटर" },
    text: {
      en: "Chaldean, Pythagorean, Mulank/Bhagyank and Lo Shu — clearly labelled.",
      hi: "कैल्डियन, पाइथागोरस, मूलांक/भाग्यांक और लो शू — स्पष्ट रूप से चिह्नित।",
    },
  },
  {
    href: "/vastu",
    icon: "🏠",
    title: { en: "Vastu Shastra Checker", hi: "वास्तु शास्त्र जाँच" },
    text: {
      en: "Zone Dosha flags with non-structural remedies and optional Astro-Vastu.",
      hi: "क्षेत्र दोष चिह्न, गैर-संरचनात्मक उपाय और वैकल्पिक एस्ट्रो-वास्तु।",
    },
  },
  {
    href: "/learn",
    icon: "📚",
    title: { en: "Learn Astrology", hi: "ज्योतिष सीखें" },
    text: {
      en: "Guides on kundli, Western astrology, KP, numerology and more.",
      hi: "कुंडली, पश्चिमी ज्योतिष, केपी, अंक ज्योतिष आदि पर गाइड।",
    },
  },
] as const;

export default async function FeaturesPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "विशेषताएँ" : "Features", path: "/features" },
        ])}
      />
      <PageHero
        eyebrow={hi ? "उत्पाद" : "Product"}
        title={hi ? "प्लेटफ़ॉर्म विशेषताएँ" : "Platform features"}
        description={
          hi
            ? "CosmicGPT पर मुफ्त कुंडली से लेकर एआई चैट और दर्जनों कैलकुलेटर तक — एक जगह।"
            : "On CosmicGPT: free kundli, AI chat, and dozens of calculators — in one place."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "विशेषताएँ" : "Features" },
        ]}
        actions={
          <>
            <Link
              href="/kundli"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron to-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-saffron/20"
            >
              {hi ? "कुंडली बनाएँ" : "Generate kundli"}
            </Link>
            <Link
              href="/calculators"
              className="inline-flex items-center justify-center rounded-xl border border-saffron/30 bg-surface/85 px-4 py-2.5 text-sm font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
            >
              {hi ? "कैलकुलेटर देखें" : "Browse calculators"}
            </Link>
          </>
        }
      />

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href}>
              <GlassCard hover className="h-full">
                <span className="text-3xl">{f.icon}</span>
                <h2 className="mt-3 font-display text-xl font-semibold text-saffron-deep">
                  {hi ? f.title.hi : f.title.en}
                </h2>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  {hi ? f.text.hi : f.text.en}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>

        <section className="mt-12 space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "कुंडली, पश्चिमी, केपी व एआई ज्योतिष एक प्लेटफ़ॉर्म पर"
              : "Kundli, Western, KP and AI astrology on one platform"}
          </h2>
          <p>
            {hi
              ? "CosmicGPT मुफ्त जन्म कुंडली, दैनिक राशिफल, गुण मिलान, पश्चिमी/केपी/अंक ज्योतिष उपकरण और एआई गुरु चैट को एक जगह लाता है — सरल भाषा में।"
              : "CosmicGPT brings free janam kundali, daily horoscope, gun milan, Western/KP/numerology tools and AI Guru chat together — in plain English or Hindi."}
          </p>
          <p>
            {hi
              ? "लग्न, ग्रह, भाव, दशा और दोष जाँच से लेकर पंचांग व अंक ज्योतिष कैलकुलेटर तक — हर उपकरण SEO-अनुकूल मार्गदर्शन और स्पष्ट परिणाम के साथ आता है।"
              : "From Lagna, planets, houses, dasha and dosha checks to panchang and numerology calculators — every tool includes clear guidance and actionable results."}
          </p>
          <p>
            {hi
              ? "जब आपको गहन पढ़ाई चाहिए, व्यक्तिगत परामर्श के लिए हमसे बात करें — ऑनलाइन उपकरण मुफ्त रहेंगे।"
              : "When you need a deeper reading, talk with us for a personal session — free online kundli tools stay free."}
          </p>
        </section>
      </div>
    </div>
  );
}
