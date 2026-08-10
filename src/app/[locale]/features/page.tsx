import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title:
      locale === "hi"
        ? `विशेषताएँ | ${siteConfig.brandName}`
        : `Features | ${siteConfig.brandName}`,
    description:
      locale === "hi"
        ? "एआई चैट, जन्म कुंडली, पंचांग, मिलान, कैलकुलेटर और प्रीमियम रिपोर्ट।"
        : "AI chat, birth chart, panchang, matching, calculators and premium reports.",
  };
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
    href: "/calculators/birth-panchang",
    icon: "📅",
    title: { en: "Panchang Tools", hi: "पंचांग उपकरण" },
    text: {
      en: "Tithi, nakshatra, yoga, karana and ayanamsa calculators.",
      hi: "तिथि, नक्षत्र, योग, करण और अयनांश कैलकुलेटर।",
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
      </div>
    </div>
  );
}
