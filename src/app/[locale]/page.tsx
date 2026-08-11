import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { QuickTools } from "@/components/home/QuickTools";
import { WhyAstrologics } from "@/components/home/WhyAstrologics";
import { HowAstrologyWorks } from "@/components/home/HowAstrologyWorks";
import { KundliExplore } from "@/components/home/KundliExplore";
import { HomeToolsGrid } from "@/components/home/HomeToolsGrid";
import { AiGuruSection } from "@/components/home/AiGuruSection";
import { TopAstrologers } from "@/components/home/TopAstrologers";
import { TodayAstrology } from "@/components/home/TodayAstrology";
import { LearnAstrologyStrip } from "@/components/home/LearnAstrologyStrip";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo/page-meta";
import { computePanchang } from "@/lib/astrology/panchang";
import { SIGNS } from "@/lib/astrology/constants";
import { signIndexFromLongitude } from "@/lib/astrology/math";
import { lahiriAyanamsaFromDate } from "@/lib/astrology/math";
import { getSiderealPlanets } from "@/lib/astrology/planets";
import { faqForLocale } from "@/lib/home/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildPageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    keywords:
      locale === "hi"
        ? [
            "मुफ्त कुंडली ऑनलाइन",
            "जन्म कुंडली",
            "ज्योतिष",
            "एआई ज्योतिष",
            "पश्चिमी ज्योतिष",
            "केपी ज्योतिष",
            "अंक ज्योतिष",
            "कुंडली कैलकुलेटर",
            "लग्न कैलकुलेटर",
            "चंद्र राशि",
            "गुण मिलान",
            "राशिफल",
            "free kundli",
            "AI astrology",
          ]
        : [
            "free kundli",
            "free kundali",
            "janam kundli",
            "online kundli",
            "astrology",
            "AI astrology",
            "birth chart",
            "western astrology",
            "KP astrology",
            "numerology",
            "kundli calculator",
            "lagna calculator",
            "moon sign calculator",
            "kundli matching",
            "daily horoscope",
          ],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tm = await getTranslations("meta");
  const faqItems = faqForLocale(locale);

  const now = new Date();
  const p = computePanchang(now);
  const ayanamsa = lahiriAyanamsaFromDate(now);
  const { planets } = getSiderealPlanets(now, ayanamsa);
  const moon = planets.find((x) => x.id === "moon");
  const moonSi = moon ? signIndexFromLongitude(moon.longitude) : 0;
  const panchang = {
    weekday: { en: p.weekday.en, hi: p.weekday.hi },
    paksha: { en: p.paksha.en, hi: p.paksha.hi },
    tithi: { en: p.tithi.name.en, hi: p.tithi.name.hi },
    nakshatra: { en: p.nakshatra.name.en, hi: p.nakshatra.name.hi },
    yoga: { en: p.yoga.name.en, hi: p.yoga.name.hi },
    karana: { en: p.karana.name.en, hi: p.karana.name.hi },
    moonSign: { en: SIGNS[moonSi].en, hi: SIGNS[moonSi].hi },
  };

  const homeUrl = absoluteUrl(locale, "");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${siteConfig.siteUrl}/#website`,
              name: siteConfig.brandName,
              url: siteConfig.siteUrl,
              inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
              description: tm("description"),
              publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
            },
            {
              "@type": "Organization",
              "@id": `${siteConfig.siteUrl}/#organization`,
              name: siteConfig.brandName,
              alternateName: ["Astrologics AI Astrology", "Astrologics Astrology"],
              url: siteConfig.siteUrl,
              logo: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
              image: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
              email: siteConfig.email,
              telephone: siteConfig.phone,
              sameAs: [`https://wa.me/${siteConfig.whatsapp}`],
              knowsAbout: [
                "Astrology",
                "Janam Kundli",
                "Western astrology",
                "KP astrology",
                "Numerology",
                "Horoscope",
                "Panchang",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: siteConfig.phone,
                email: siteConfig.email,
                availableLanguage: ["English", "Hindi"],
              },
            },
            {
              "@type": "WebApplication",
              "@id": `${homeUrl}#webapp`,
              name: `${siteConfig.brandName} Astrology Platform`,
              url: homeUrl,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              description: tm("description"),
              inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
              provider: { "@id": `${siteConfig.siteUrl}/#organization` },
            },
            {
              "@type": "FAQPage",
              "@id": `${homeUrl}#faq`,
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ],
        }}
      />

      {/* Lean homepage flow — fewer overlapping sections */}
      <AnnouncementBar locale={locale} />
      <Hero />
      <QuickTools locale={locale} />
      <TopAstrologers locale={locale} />
      <WhyAstrologics locale={locale} />
      <HowAstrologyWorks locale={locale} />
      <TodayAstrology locale={locale} panchang={panchang} />
      <HomeToolsGrid locale={locale} />
      <AiGuruSection locale={locale} />
      <KundliExplore locale={locale} />
      <LearnAstrologyStrip locale={locale} />
      <HomeFaq locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
