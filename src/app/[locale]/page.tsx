import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServiceCards } from "@/components/home/ServiceCards";
import { WhyCosmicGPT } from "@/components/home/WhyCosmicGPT";
import { HowAstrologyWorks } from "@/components/home/HowAstrologyWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo/page-meta";
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
              alternateName: [
                "CosmicGPT",
                "Let's Decode Your Stars",
                "आइए अपने सितारों को समझें",
                "CosmicGPT AI Astrology",
              ],
              description:
                locale === "hi"
                  ? siteConfig.tagline.hi
                  : siteConfig.tagline.en,
              url: siteConfig.siteUrl,
              logo: `${siteConfig.siteUrl}/cosmicgpt-icon-512.png`,
              image: `${siteConfig.siteUrl}/cosmicgpt-icon-512.png`,
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

      <Hero />
      <ServiceCards locale={locale} />
      <WhyCosmicGPT locale={locale} />
      <HowAstrologyWorks locale={locale} />
      <TrustSection locale={locale} />
      <HomeFaq locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
