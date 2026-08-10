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
      ? `विशेषताएँ — मुफ्त कुंडली, एआई गुरु व ज्योतिष उपकरण | ${siteConfig.brandName}`
      : `Features — Free Kundli, AI Guru & Jyotish Tools | ${siteConfig.brandName}`,
    description: hi
      ? "Astrologics विशेषताएँ: मुफ्त जन्म कुंडली, एआई ज्योतिष चैट, गुण मिलान, राशिफल, पंचांग व 30+ वैदिक कैलकुलेटर।"
      : "Astrologics features: free janam kundali, AI astrology chat, gun milan, rashifal, panchang and 30+ Vedic jyotish calculators.",
    keywords: hi
      ? [
          "कुंडली विशेषताएँ",
          "एआई ज्योतिष",
          "गुण मिलान",
          "मुफ्त कुंडली",
          "AI astrology features",
        ]
      : [
          "AI astrology features",
          "free kundli online",
          "gun milan",
          "Vedic calculators",
          "AI Guru chat",
          "jyotish tools",
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
    href: "/learn",
    icon: "📚",
    title: { en: "Learn Astrology", hi: "ज्योतिष सीखें" },
    text: {
      en: "Guides on rashis, grahas, houses, doshas and more.",
      hi: "राशि, ग्रह, भाव, दोष आदि पर शैक्षिक गाइड।",
    },
  },
] as const;

export default async function FeaturesPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
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
            ? "Astrologics पर मुफ्त कुंडली से लेकर एआई चैट और दर्जनों कैलकुलेटर तक — एक जगह।"
            : "On Astrologics: free kundli, AI chat, and dozens of calculators — in one place."
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
              className="inline-flex items-center justify-center rounded-xl border border-saffron/30 bg-white/80 px-4 py-2.5 text-sm font-semibold text-saffron-deep hover:bg-[#fff1e6]"
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

        <section className="mt-12 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "वैदिक कुंडली व एआई ज्योतिष एक प्लेटफ़ॉर्म पर"
              : "Vedic kundli and AI astrology on one platform"}
          </h2>
          <p>
            {hi
              ? "Astrologics मुफ्त जन्म कुंडली (janam kundali), दैनिक राशिफल, गुण मिलान और एआई गुरु चैट को एक जगह लाता है — ताकि आप वैदिक ज्योतिष को सरल भाषा में समझ सकें।"
              : "Astrologics brings free janam kundali, daily rashifal, gun milan and AI Guru chat together — so you can explore Vedic jyotish in plain English or Hindi."}
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
