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
      ? `ज्योतिष परामर्श सेवाएँ | ${siteConfig.brandName}`
      : `Astrology Consultation Services | ${siteConfig.brandName}`,
    description: hi
      ? "मुफ्त कुंडली से व्यक्तिगत परामर्श तक — जीवन पढ़ाई, गुण मिलान, दोष विश्लेषण और शास्त्रीय उपचार। हिंदी व अंग्रेज़ी में।"
      : "From free kundli to personal sessions — life readings, gun milan, dosha analysis and classical remedies. Available in English and Hindi.",
    keywords: hi
      ? [
          "कुंडली परामर्श",
          "गुण मिलान सेवा",
          "ज्योतिष सेवाएँ",
          "जन्म कुंडली",
          "astrology services",
        ]
      : [
          "kundli consultation",
          "gun milan service",
          "astrology services",
          "janam kundali reading",
          "astrology remedies",
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
    <div className="bg-cosmic-navy">
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
              ? "कुंडली से व्यक्तिगत ज्योतिष मार्गदर्शन तक"
              : "From kundli to personal astrology guidance"}
          </h2>
          <p>
            {hi
              ? "CosmicGyan पर आप मुफ्त जन्म कुंडली (janam kundali) बना सकते हैं, गुण मिलान चला सकते हैं और एआई गुरु से प्रश्न पूछ सकते हैं — फिर गहन पढ़ाई के लिए व्यक्तिगत सत्र बुक करें।"
              : "On CosmicGyan you can generate a free janam kundali, run gun milan and ask AI Guru — then book a personal session for a deeper reading."}
          </p>
          <p>
            {hi
              ? "हमारी सेवाएँ करियर, विवाह समय, दोष विश्लेषण, राशिफल व्याख्या और शास्त्रीय उपचार (मंत्र, दान, जीवनशैली) पर केंद्रित हैं — हिंदी व अंग्रेज़ी में।"
              : "Our services focus on career, marriage timing, dosha analysis, rashifal interpretation and classical remedies (mantra, charity, lifestyle) — in English and Hindi."}
          </p>
          <p>
            {hi
              ? "ऑनलाइन ज्योतिष उपकरण मुफ्त रहेंगे; व्यक्तिगत परामर्श व्हाट्सऐप पर उपलब्ध है।"
              : "Online astrology tools stay free; personal consultation is available on WhatsApp."}
          </p>
        </section>

        <section className="mt-12 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "परामर्श में क्या शामिल है" : "What consultation includes"}
          </h2>
          <p>
            {hi
              ? "व्यक्तिगत सत्र में हम आपकी कुंडली के आधार पर करियर, विवाह, धन और स्वास्थ्य प्रवृत्ति पर समय-क्रम देखते हैं। दोष (जैसे मंगल, कालसर्प, साढ़े साती) का संदर्भ, गुण मिलान की गहराई और उपाय प्राथमिकता चर्चा की जाती है — स्कोरकार्ड से आगे।"
              : "In a personal session we review career, marriage, wealth and health tendencies from your chart with timing context. Dosha themes (such as Mangal, Kaalsarp, Sade Sati), deeper gun milan and remedy priority are discussed — beyond scorecards alone."}
          </p>
          <p>
            {hi
              ? "परामर्श हिंदी या अंग्रेज़ी में हो सकता है। जन्म विवरण, प्रश्न और कोई पिछली रिपोर्ट साझा करें — ताकि सत्र केंद्रित और उपयोगी रहे।"
              : "Consultation can be in Hindi or English. Share birth details, your questions and any prior report so the session stays focused and useful."}
          </p>
        </section>

        <section className="mt-12 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "सत्र कैसे बुक करें" : "How to book a session"}
          </h2>
          <p>
            {hi
              ? "पहले मुफ्त कुंडली या एआई गुरु से परिचित हों। जब गहन मार्गदर्शन चाहिए, व्हाट्सऐप पर संदेश करें — नाम, जन्म तिथि, समय, स्थान और मुख्य प्रश्न लिखें। हम उपलब्धता और सत्र प्रारूप (चैट या कॉल) पर जवाब देंगे।"
              : "Start with a free kundli or AI Guru if helpful. When you want deeper guidance, message us on WhatsApp with name, birth date, time, place and your main question. We will reply on availability and session format (chat or call)."}
          </p>
        </section>
      </div>
    </div>
  );
}
