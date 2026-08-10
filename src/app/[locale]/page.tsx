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
  const path = `/${locale}`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.siteUrl}${path}`,
      languages: {
        en: `${siteConfig.siteUrl}/en`,
        hi: `${siteConfig.siteUrl}/hi`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.siteUrl}${path}`,
      siteName: siteConfig.brandName,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

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
          description: t("subtitle"),
          url: siteConfig.siteUrl,
          telephone: siteConfig.phone,
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
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
