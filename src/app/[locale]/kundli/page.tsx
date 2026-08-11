import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BirthForm } from "@/components/kundli/BirthForm";
import { PageHero } from "@/components/ui/PageHero";
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
    path: "/kundli",
    title: hi
      ? `मुफ्त जन्म कुंडली ऑनलाइन — जनम कुंडली व बर्थ चार्ट | ${siteConfig.brandName}`
      : `Free Kundli Online — Janam Kundali & Birth Chart | ${siteConfig.brandName}`,
    description: hi
      ? "मुफ्त जन्म कुंडली ऑनलाइन बनाएँ — लग्न, ग्रह, भाव, दशा व योग। Janam kundali / birth chart हिंदी व अंग्रेज़ी में।"
      : "Generate a free janam kundali online — Lagna, planets, houses, dasha & yogas. Instant birth chart in English & Hindi.",
    keywords: hi
      ? [
          "मुफ्त कुंडली ऑनलाइन",
          "जन्म कुंडली",
          "जनम कुंडली",
          "free kundli online",
          "janam kundali",
          "birth chart",
          "जन्म कुंडली",
        ]
      : [
          "free kundli online",
          "janam kundali",
          "birth chart",
          "kundli",
          "janam kundli",
          "online kundli free",
          "birth chart online",
        ],
  });
}

export default async function KundliPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kundliForm");
  const tc = await getTranslations("nav");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: tc("kundli"), path: "/kundli" },
        ])}
      />
      <PageHero
        eyebrow="Kundli"
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: tc("kundli") },
        ]}
      />
      <div className="container-page py-6 sm:py-8">
        <BirthForm />
      </div>
    </div>
  );
}
