import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import { FaqPageClient } from "@/components/faq/FaqPageClient";
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
      ? `अक्सर पूछे जाने वाले प्रश्न — कुंडली, राशिफल व ज्योतिष | ${siteConfig.brandName}`
      : `FAQ — Kundli, Rashifal & Astrology Questions | ${siteConfig.brandName}`,
    description: hi
      ? "जन्म कुंडली, लग्न, कुंडली बनाम पश्चिमी ज्योतिष, गुण मिलान, उपचार व एआई गुरु पर स्पष्ट उत्तर — Astrologics FAQ।"
      : "Clear answers on janam kundali, Lagna, Kundli vs Western astrology, gun milan, remedies and AI Guru — Astrologics FAQ.",
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

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

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
