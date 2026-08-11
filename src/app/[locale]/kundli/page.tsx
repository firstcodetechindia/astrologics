import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BirthForm } from "@/components/kundli/BirthForm";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  howToKundliJsonLd,
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
      ? `मुफ्त कुंडली ऑनलाइन — जन्म कुंडली | ${siteConfig.brandName}`
      : `Free Kundli Online — Janam Kundali | ${siteConfig.brandName}`,
    description: hi
      ? "मुफ्त जन्म कुंडली बनाएँ — लग्न, ग्रह, भाव, विंशोत्तरी दशा व योग। साइनअप बिना, हिंदी व अंग्रेज़ी में।"
      : "Generate free janam kundali — Lagna, planets, houses, Vimshottari dasha & yogas. English & Hindi. No signup required.",
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
      <JsonLd data={howToKundliJsonLd(locale)} />
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
        <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-saffron/20 bg-white/90 px-5 py-4 text-[14px] leading-relaxed text-ink">
          {hi ? (
            <p>
              <strong>सीधे उत्तर:</strong> जन्म तिथि, समय और स्थान भरकर लाहिरी
              निरयण जन्म कुंडली सेकंडों में बनाएँ — लग्न, ग्रह, भाव, नक्षत्र,
              योग और विंशोत्तरी दशा एक रिपोर्ट में। गणना इंजन से होती है; एआई
              केवल व्याख्या में मदद करता है।
            </p>
          ) : (
            <p>
              <strong>Direct answer:</strong> Enter birth date, time and place
              to generate a Lahiri sidereal janam kundali in seconds — Lagna,
              planets, houses, Nakshatras, yogas and Vimshottari dasha in one
              report. The astrology engine calculates positions; AI only helps
              interpret them.
            </p>
          )}
        </div>
        <BirthForm />
      </div>
    </div>
  );
}
