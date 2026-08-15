import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { ContactCTA } from "@/components/kundli/ContactCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
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
      ? "CosmicTalks परिचय — बहु-परंपरा एआई ज्योतिष"
      : "About CosmicTalks — Multi-Tradition AI Astrology",
    description: hi
      ? "CosmicTalks वैदिक, पश्चिमी, केपी ज्योतिष और अंक ज्योतिष को एआई चार्ट व्याख्या से जोड़ता है — अनुमान नहीं, गणना; हिंदी व अंग्रेज़ी में।"
      : "CosmicTalks combines Vedic, Western, KP astrology and numerology with AI-powered chart explanations — calculated, not guessed, in EN & HI.",
    keywords: hi
      ? [
          "CosmicTalks परिचय",
          "ज्योतिष प्लेटफ़ॉर्म",
          "जन्म कुंडली",
          "एआई ज्योतिष",
          "केपी ज्योतिष",
          "अंक ज्योतिष",
        ]
      : [
          "about CosmicTalks",
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
    <div className="bg-cosmic-navy">
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
            {hi ? "हमारी पद्धति (Our Method)" : "Our Method"}
          </h2>
          <p>
            {hi
              ? "ज्योतिष पद्धति: लाहिरी (चित्रापक्ष) अयनांश, पूर्ण-राशि भाव, और विंशोत्तरी दशा समय-रेखा। ग्रह देशांतर गणना इंजन से निकलते हैं; एआई गुरु केवल उन परिणामों की व्याख्या करता है। सामग्री CosmicTalks Editorial द्वारा समीक्षित है — गणना पारदर्शिता और भय-मुक्त भाषा पर जोर।"
              : "Astrology method: Lahiri (Chitrapaksha) ayanamsa, whole-sign houses, and Vimshottari dasha timing. Planetary longitudes come from the calculation engine; AI Guru only interprets those results. Content is reviewed by CosmicTalks Editorial with emphasis on calculation transparency and non-fear-based language."}
          </p>
          <p>
            {hi
              ? "CosmicTalks पर ग्रह स्थिति, भाव, नक्षत्र और विंशोत्तरी दशा पहले ज्योतिष गणना इंजन से निकलती हैं। एआई गुरु इन गणना परिणामों की व्याख्या सरल हिंदी या अंग्रेज़ी में करता है; यह ग्रहों की स्थिति गढ़ता नहीं है।"
              : "On CosmicTalks, planetary positions, houses, Nakshatras and Vimshottari dasha are calculated first by the astrology engine. AI Guru interprets those calculated results in plain Hindi or English; it does not invent planetary positions."}
          </p>
          <p>
            {hi
              ? "यह पारदर्शिता E-E-A-T के लिए महत्वपूर्ण है: गणना पद्धति स्पष्ट है, परिणाम दोहराए जा सकते हैं, और जब आपको मानव दृष्टि चाहिए तो व्यक्तिगत परामर्श उपलब्ध है।"
              : "This transparency matters for trust: the calculation method is stated clearly, results are reproducible, and human consultation is available when you need expert judgement."}
          </p>
          <p>
            <Link
              href="/methodology"
              className="inline-flex font-semibold text-saffron-deep hover:underline"
            >
              {hi
                ? "पूरी पद्धति पढ़ें →"
                : "Read our full methodology →"}
            </Link>
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
              ? "गुण मिलान, मंगल दोष जाँच, पंचांग और एआई गुरु चैट से लेकर व्यक्तिगत परामर्श तक — CosmicTalks आधुनिक जीवन के लिए ज्योतिष को सुलभ बनाता है।"
              : "From gun milan, Mangal dosha checks and panchang to AI Guru chat and personal consultation — CosmicTalks makes astrology practical for modern life."}
          </p>
        </section>
        <ContactCTA title={home("ctaBandTitle")} text={home("ctaBandText")} />
      </div>
    </div>
  );
}
