import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import { FaqPageClient } from "@/components/faq/FaqPageClient";
import { faqForLocale } from "@/lib/home/faq";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
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
    path: "/faq",
    title: hi
      ? `कुंडली व ज्योतिष FAQ | ${siteConfig.brandName}`
      : `Kundli & Astrology FAQ | ${siteConfig.brandName}`,
    description: hi
      ? "कुंडली, लग्न, नक्षत्र, दशा, एआई गुरु और ज्योतिष गणना पर 17+ स्पष्ट उत्तर — CosmicGyan FAQ पेज पर।"
      : "Clear answers on kundli, Lagna, Nakshatra, dasha, AI Guru and how charts are calculated — 17+ questions on CosmicGyan FAQ.",
    keywords: hi
      ? [
          "कुंडली FAQ",
          "ज्योतिष प्रश्न",
          "जन्म कुंडली",
          "गुण मिलान",
          "ज्योतिष",
        ]
      : [
          "kundli FAQ",
          "astrology questions",
          "janam kundali help",
          "gun milan FAQ",
          "astrology FAQ",
        ],
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const hi = locale === "hi";

  const faqs = faqForLocale(locale).map(({ question, answer }) => ({
    q: question,
    a: answer,
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: t("title"), path: "/faq" },
        ])}
      />
      <FaqPageClient
        title={t("title")}
        subtitle={t("subtitle")}
        faqs={faqs}
        homeLabel={hi ? "होम" : "Home"}
      />
    </>
  );
}
