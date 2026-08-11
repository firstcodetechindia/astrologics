import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { ContactCTA } from "@/components/kundli/ContactCTA";
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
    path: "/about",
    title: hi
      ? `परिचय — ज्योतिष प्लेटफ़ॉर्म व एआई कुंडली | ${siteConfig.brandName}`
      : `About — Astrology Platform & AI Kundli | ${siteConfig.brandName}`,
    description: hi
      ? "Astrologics कई ज्योतिष परंपराएँ प्रस्तुत करता है — मुफ्त जन्म कुंडली (गणना इंजन), एआई व्याख्या, पश्चिमी, केपी, अंक ज्योतिष और राशिफल।"
      : "Astrologics covers multiple astrology traditions — free janam kundali from the calculation engine, AI interpretation, Western guides, KP, numerology and horoscope.",
    keywords: hi
      ? [
          "Astrologics परिचय",
          "ज्योतिष प्लेटफ़ॉर्म",
          "जन्म कुंडली",
          "एआई ज्योतिष",
          "केपी ज्योतिष",
          "अंक ज्योतिष",
        ]
      : [
          "about Astrologics",
          "astrology platform",
          "AI astrology",
          "janam kundali online",
          "KP astrology",
          "numerology",
        ],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const home = await getTranslations("home");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: t("title"), path: "/about" },
        ])}
      />
      <PageHero
        eyebrow={siteConfig.brandName}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
      />
      <div className="container-page max-w-3xl space-y-8 py-10 sm:py-12">
        <GlassCard className="space-y-4 text-ink-muted leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </GlassCard>
        <section className="space-y-3 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "गणना और एआई — हमारी पद्धति"
              : "How calculation & AI work"}
          </h2>
          <p>
            {hi
              ? "Astrologics पर ग्रह स्थिति, भाव, नक्षत्र और विंशोत्तरी दशा पहले ज्योतिष गणना इंजन से निकलती हैं — लाहिरी (चित्रापक्ष) अयनांश और पूर्ण-राशि भाव पद्धति के साथ। एआई गुरु इन गणना परिणामों की व्याख्या सरल हिंदी या अंग्रेज़ी में करता है; यह ग्रहों की स्थिति गढ़ता नहीं है।"
              : "On Astrologics, planetary positions, houses, Nakshatras and Vimshottari dasha are calculated first by the astrology engine — using the Lahiri (Chitrapaksha) ayanamsa and whole-sign house system. AI Guru interprets those calculated results in plain Hindi or English; it does not invent planetary positions."}
          </p>
          <p>
            {hi
              ? "यह पारदर्शिता E-E-A-T के लिए महत्वपूर्ण है: गणना पद्धति स्पष्ट है, परिणाम दोहराए जा सकते हैं, और जब आपको मानव दृष्टि चाहिए तो व्यक्तिगत परामर्श उपलब्ध है। एआई त्वरित स्पष्टीकरण के लिए है; गहन समय, उपाय और संवेदनशील निर्णयों के लिए अनुभवी ज्योतिषी से बात करें।"
              : "This transparency matters for trust: the calculation method is stated clearly, results are reproducible, and human consultation is available when you need expert judgement. AI is for quick clarification; for deeper timing, remedies and sensitive decisions, speak with an experienced astrologer."}
          </p>
        </section>
        <section className="space-y-3 text-[15px] leading-relaxed text-ink-muted">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "मुफ्त कुंडली, राशिफल और एआई ज्योतिष"
              : "Free kundli, rashifal and AI astrology"}
          </h2>
          <p>
            {hi
              ? "हमारा लक्ष्य है कि जन्म कुंडली, राशिफल और अन्य ज्योतिष उपकरण भयभीत करने वाले न हों — बल्कि स्पष्ट मार्गदर्शन दें, हिंदी व अंग्रेज़ी में।"
              : "Our aim is that kundli, horoscope and other astrology tools feel informative — not fear-based — with clear guidance in English and Hindi."}
          </p>
          <p>
            {hi
              ? "गुण मिलान, मंगल दोष जाँच, पंचांग और एआई गुरु चैट से लेकर व्यक्तिगत परामर्श तक — Astrologics आधुनिक जीवन के लिए ज्योतिष को सुलभ बनाता है।"
              : "From gun milan, Mangal dosha checks and panchang to AI Guru chat and personal consultation — Astrologics makes astrology practical for modern life."}
          </p>
        </section>
        <ContactCTA title={home("ctaBandTitle")} text={home("ctaBandText")} />
      </div>
    </div>
  );
}
