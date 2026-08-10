import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  FeatureGrid,
  HowItWorks,
  WhySection,
} from "@/components/home/FeatureGrid";
import { HomeExplore } from "@/components/home/HomeExplore";
import { HomeLovePromo } from "@/components/home/HomeLovePromo";
import { HomeToolsGrid } from "@/components/home/HomeToolsGrid";
import { HomeConsultBand, HomeFaqStrip } from "@/components/home/HomeFaqStrip";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo/page-meta";
import { computePanchang } from "@/lib/astrology/panchang";
import { SIGNS } from "@/lib/astrology/constants";
import { signIndexFromLongitude } from "@/lib/astrology/math";
import { lahiriAyanamsaFromDate } from "@/lib/astrology/math";
import { getSiderealPlanets } from "@/lib/astrology/planets";

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
            "आज का राशिफल",
            "वैदिक ज्योतिष",
            "गुण मिलान",
            "एआई ज्योतिष",
            "janam kundali",
            "free kundli",
          ]
        : [
            "free kundli online",
            "janam kundali",
            "Vedic kundli",
            "aaj ka rashifal",
            "gun milan",
            "jyotish",
            "AI astrology",
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
  const t = await getTranslations("home");
  const tm = await getTranslations("meta");

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

  const features = [
    { title: t("feature1Title"), text: t("feature1Text") },
    { title: t("feature2Title"), text: t("feature2Text") },
    { title: t("feature3Title"), text: t("feature3Text") },
    { title: t("feature4Title"), text: t("feature4Text") },
  ];

  const whyItems = [
    { title: t("why1Title"), text: t("why1Text") },
    { title: t("why2Title"), text: t("why2Text") },
    { title: t("why3Title"), text: t("why3Text") },
  ];

  const steps = [t("how1"), t("how2"), t("how3")];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: siteConfig.brandName,
          alternateName: ["Astrologics AI Astrology", "Astrologics Jyotish"],
          description: tm("description"),
          url: absoluteUrl(locale, ""),
          image: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
          logo: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
          telephone: siteConfig.phone,
          email: siteConfig.email,
          priceRange: "₹0–consultation",
          areaServed: {
            "@type": "Country",
            name: "India",
          },
          availableLanguage: ["English", "Hindi"],
          sameAs: [`https://wa.me/${siteConfig.whatsapp}`],
          serviceType: [
            "Vedic kundli",
            "Janam kundali",
            "Gun milan",
            "Rashifal",
            "AI astrology consultation",
          ],
          knowsAbout: [
            "Vedic astrology",
            "Jyotish",
            "Birth chart",
            "Kundli matching",
            "Daily horoscope",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: siteConfig.phone,
            email: siteConfig.email,
            availableLanguage: ["English", "Hindi"],
          },
        }}
      />

      <Hero />

      <HomeExplore
        locale={locale}
        brand={siteConfig.brandName}
        panchang={panchang}
      />

      <HomeLovePromo locale={locale} />

      <HomeToolsGrid locale={locale} />

      <WhySection
        title={t("whyTitle")}
        subtitle={t("whySubtitle")}
        items={whyItems}
      />

      <FeatureGrid
        title={t("featuresTitle")}
        subtitle={t("featuresSubtitle")}
        features={features}
      />

      <HowItWorks title={t("howTitle")} steps={steps} ctaLabel={t("ctaPrimary")} />

      <HomeConsultBand locale={locale} />

      <HomeFaqStrip locale={locale} />
    </>
  );
}
