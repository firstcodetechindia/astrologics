import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig, whatsappLink } from "@/lib/site-config";
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
    path: "/services",
    title: hi
      ? `सेवाएँ — मुफ्त कुंडली, गुण मिलान व ज्योतिष परामर्श | ${siteConfig.brandName}`
      : `Services — Free Kundli, Gun Milan & Jyotish Consultation | ${siteConfig.brandName}`,
    description: hi
      ? "मुफ्त ऑनलाइन जन्म कुंडली से शुरू करें। विस्तृत जीवन पढ़ाई, गुण मिलान, दोष विश्लेषण व उपचार — वैदिक ज्योतिष परामर्श।"
      : "Start with a free online janam kundali. Detailed life readings, gun milan, dosha analysis and remedies — Vedic jyotish consultation.",
    keywords: hi
      ? [
          "कुंडली परामर्श",
          "गुण मिलान सेवा",
          "ज्योतिष सेवाएँ",
          "जन्म कुंडली",
          "Vedic astrology services",
        ]
      : [
          "kundli consultation",
          "gun milan service",
          "Vedic astrology services",
          "janam kundali reading",
          "jyotish remedies",
        ],
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const hi = locale === "hi";

  const items = [
    { title: t("s1Title"), text: t("s1Text") },
    { title: t("s2Title"), text: t("s2Text") },
    { title: t("s3Title"), text: t("s3Text") },
    { title: t("s4Title"), text: t("s4Text") },
  ];

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: t("title"), path: "/services" },
        ])}
      />
      <PageHero
        eyebrow={hi ? "सेवाएँ" : "Services"}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
        actions={
          <ButtonLink
            href={whatsappLink("Namaste, I want to book a consultation.")}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            {t("cta")}
          </ButtonLink>
        }
      />
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <GlassCard key={item.title}>
              <h2 className="font-display text-xl font-semibold text-maroon">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {item.text}
              </p>
            </GlassCard>
          ))}
        </div>

        <section className="mt-12 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "वैदिक कुंडली से व्यक्तिगत ज्योतिष मार्गदर्शन तक"
              : "From Vedic kundli to personal jyotish guidance"}
          </h2>
          <p>
            {hi
              ? "Astrologics पर आप मुफ्त जन्म कुंडली (janam kundali) बना सकते हैं, गुण मिलान चला सकते हैं और एआई गुरु से प्रश्न पूछ सकते हैं — फिर गहन पढ़ाई के लिए व्यक्तिगत सत्र बुक करें।"
              : "On Astrologics you can generate a free janam kundali, run gun milan and ask AI Guru — then book a personal session for a deeper reading."}
          </p>
          <p>
            {hi
              ? "हमारी सेवाएँ करियर, विवाह समय, दोष विश्लेषण, राशिफल व्याख्या और शास्त्रीय उपचार (मंत्र, दान, जीवनशैली) पर केंद्रित हैं — हिंदी व अंग्रेज़ी में।"
              : "Our services focus on career, marriage timing, dosha analysis, rashifal interpretation and classical remedies (mantra, charity, lifestyle) — in English and Hindi."}
          </p>
          <p>
            {hi
              ? "ऑनलाइन ज्योतिष उपकरण मुफ्त रहेंगे; व्यक्तिगत परामर्श व्हाट्सऐप पर उपलब्ध है।"
              : "Online jyotish tools stay free; personal consultation is available on WhatsApp."}
          </p>
        </section>
      </div>
    </div>
  );
}
