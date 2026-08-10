import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { ContactCTA } from "@/components/kundli/ContactCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/about",
    title: hi
      ? `परिचय — वैदिक ज्योतिष व एआई कुंडली | ${siteConfig.brandName}`
      : `About — Vedic Jyotish & AI Kundli | ${siteConfig.brandName}`,
    description: hi
      ? "Astrologics पारंपरिक वैदिक ज्योतिष को आधुनिक स्पष्टता से प्रस्तुत करता है — मुफ्त जन्म कुंडली, राशिफल, गुण मिलान व एआई गुरु।"
      : "Astrologics presents classical Vedic jyotish with modern clarity — free janam kundali, rashifal, gun milan and AI Guru guidance.",
    keywords: hi
      ? [
          "Astrologics परिचय",
          "वैदिक ज्योतिष",
          "जन्म कुंडली",
          "एआई ज्योतिष",
          "jyotish platform",
        ]
      : [
          "about Astrologics",
          "Vedic jyotish",
          "AI astrology platform",
          "janam kundali online",
          "gun milan",
        ],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const home = await getTranslations("home");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: t("title"), path: "/about" },
        ])}
      />
      <PageHero
        eyebrow={siteConfig.brandName}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
      />
      <div className="container-page max-w-3xl space-y-8 py-10 sm:py-12">
        <GlassCard className="space-y-4 text-ink-muted leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </GlassCard>
        <section className="space-y-3 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "मुफ्त कुंडली, राशिफल और एआई ज्योतिष"
              : "Free kundli, rashifal and AI astrology"}
          </h2>
          <p>
            {hi
              ? "हमारा लक्ष्य है कि जन्म कुंडली (janam kundali) और दैनिक राशिफल भयभीत करने वाले न हों — बल्कि स्पष्ट वैदिक ज्योतिष मार्गदर्शन दें, हिंदी व अंग्रेज़ी में।"
              : "Our aim is that janam kundali and daily rashifal feel informative — not fear-based — with clear Vedic jyotish guidance in English and Hindi."}
          </p>
          <p>
            {hi
              ? "गुण मिलान, मंगल दोष जाँच, पंचांग और एआई गुरु चैट से लेकर व्यक्तिगत परामर्श तक — Astrologics आधुनिक जीवन के लिए ज्योतिष को सुलभ बनाता है।"
              : "From gun milan, Mangal dosha checks and panchang to AI Guru chat and personal consultation — Astrologics makes jyotish practical for modern life."}
          </p>
        </section>
        <ContactCTA title={home("ctaBandTitle")} text={home("ctaBandText")} />
      </div>
    </div>
  );
}
