import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";

const FAQS = [
  {
    q: {
      en: "What ayanamsa does Astrologics use?",
      hi: "Astrologics कौन-सा अयनांश उपयोग करता है?",
    },
    a: {
      en: "Lahiri (Chitrapaksha) ayanamsa — the standard used in India’s Rashtriya Panchang and most Vedic software.",
      hi: "लाहिरी (चित्रापक्ष) अयनांश — भारत के राष्ट्रीय पंचांग और अधिकांश वैदिक सॉफ़्टवेयर का मानक।",
    },
  },
  {
    q: {
      en: "What’s the difference between Vedic and Western astrology on this site?",
      hi: "इस साइट पर वैदिक और पश्चिमी ज्योतिष में क्या अंतर है?",
    },
    a: {
      en: "Janam Kundli and most calculators use sidereal Lahiri positions with whole-sign houses. Learn guides also cover Western (tropical) concepts separately and label which system you are reading.",
      hi: "जन्म कुंडली और अधिकांश कैलकुलेटर लाहिरी निरयण स्थिति व पूर्ण-राशि भाव उपयोग करते हैं। सीखें गाइड में पश्चिमी (ट्रॉपिकल) अवधारणाएँ अलग से बताई जाती हैं।",
    },
  },
  {
    q: {
      en: "Does Astrologics sell my birth data?",
      hi: "क्या Astrologics मेरा जन्म डेटा बेचता है?",
    },
    a: {
      en: "No. Birth details are used to calculate your chart and are not sold to third parties, including remedy or gemstone sellers. You can request deletion via Contact.",
      hi: "नहीं। जन्म विवरण कुंडली गणना हेतु उपयोग होते हैं और तीसरे पक्षों को नहीं बेचे जाते। Contact से हटाने का अनुरोध कर सकते हैं।",
    },
  },
  {
    q: {
      en: "Does the AI invent planetary positions?",
      hi: "क्या एआई ग्रह स्थिति गढ़ता है?",
    },
    a: {
      en: "No. AI Guru only interprets chart data already calculated by the ephemeris engine.",
      hi: "नहीं। एआई गुरु केवल गणना इंजन से निकले चार्ट डेटा की व्याख्या करता है।",
    },
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/methodology",
    title: hi
      ? "हमारी पद्धति — Astrologics कुंडली कैसे गणना करता है"
      : "Our Methodology — How Astrologics Calculates Your Chart",
    description: hi
      ? "देखें Astrologics आपकी कुंडली कैसे गणना करता है — अयनांश, भाव पद्धति, इफेमेरिस स्रोत और एआई दृष्टिकोण, पारदर्शी रूप से।"
      : "See exactly how Astrologics calculates your Kundli — ayanamsa, house system, ephemeris source and AI approach, explained transparently.",
    keywords: hi
      ? [
          "ज्योतिष पद्धति",
          "लाहिरी अयनांश",
          "कुंडली गणना",
          "Astrologics methodology",
        ]
      : [
          "astrology methodology",
          "lahiri ayanamsa",
          "how kundli is calculated",
          "vedic house system",
          "Astrologics calculation method",
        ],
  });
}

export default async function MethodologyPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          {
            name: hi ? "पद्धति" : "Methodology",
            path: "/methodology",
          },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "हमारी पद्धति" : "Our Methodology"}
        description={
          hi
            ? "गणना, व्याख्या और एआई — स्पष्ट रूप से अलग, ताकि आप जाँच सकें।"
            : "Calculation, interpretation and AI — clearly separated, so you can verify our work."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "पद्धति" : "Methodology" },
        ]}
      />

      <article className="container-page max-w-3xl space-y-10 py-10 sm:py-12 text-[15px] leading-relaxed text-ink-muted">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "हम यह पृष्ठ क्यों प्रकाशित करते हैं" : "Why we publish this"}
          </h2>
          <p>
            {hi
              ? "अधिकांश ज्योतिष प्लेटफ़ॉर्म गणना का तरीका बताए बिना विश्वास माँगते हैं। हम इसे उल्टा मानते हैं — खासकर जन्म कुंडली जैसी व्यक्तिगत चीज़ के लिए। यह पृष्ठ बताता है कि Astrologics किन गणना विधियों, डेटा स्रोतों और एआई दृष्टिकोण का उपयोग करता है।"
              : "Most astrology platforms ask you to trust their calculations without ever showing how they arrived at them. We think that's backwards — especially for something as personal as your birth chart. This page explains exactly which calculation methods, data sources and AI approach Astrologics uses."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "आपकी कुंडली कैसे गणना होती है" : "How your chart is calculated"}
          </h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "अयनांश" : "Ayanamsa"}
            </h3>
            <p>
              {hi
                ? "हम लाहिरी अयनांश उपयोग करते हैं — भारत के राष्ट्रीय पंचांग का मानक और वैदिक ज्योतिष में सबसे व्यापक विधि।"
                : "We use the Lahiri ayanamsa, the standard of India’s Rashtriya Panchang and the most widely used method in Vedic astrology."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "भाव पद्धति" : "House system"}
            </h3>
            <p>
              {hi
                ? "पूर्ण-राशि (whole-sign) भाव — लग्न से प्रत्येक भाव एक राशि।"
                : "Whole-sign houses — each house is one sign starting from Lagna."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "इफेमेरिस" : "Ephemeris"}
            </h3>
            <p>
              {hi
                ? "ग्रह स्थिति astronomy-engine से गणना होती है। Swiss Ephemeris लाइसेंस सीमाओं के कारण अभी बंडल नहीं है।"
                : "Planetary positions are calculated with astronomy-engine. Swiss Ephemeris is not currently bundled due to licensing."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "दशा" : "Dasha"}
            </h3>
            <p>
              {hi
                ? "विंशोत्तरी दशा — चंद्र नक्षत्र पर आधारित 120-वर्ष चक्र।"
                : "Vimshottari Dasha — 120-year cycle based on the Moon’s Nakshatra."}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "एआई गुरु" : "How our AI Guru works"}
          </h2>
          <p>
            {hi
              ? "एआई ग्रह स्थिति गढ़ता नहीं — वह पहले से गणना चार्ट की व्याख्या करता है, पारंपरिक सिद्धांत संदर्भित करता है, और बताता है कि उत्तर किस स्थिति पर आधारित है।"
              : "AI does not invent planetary positions — it interprets an already-calculated chart, references traditional principles, and states which placement the answer is based on."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "गोपनीयता" : "Data privacy"}
          </h2>
          <p>
            {hi ? (
              <>
                जन्म विवरण तीसरे पक्षों को नहीं बेचे जाते। हटाने का अनुरोध{" "}
                <Link href="/contact" className="font-semibold text-saffron-deep hover:underline">
                  संपर्क
                </Link>{" "}
                से करें।
              </>
            ) : (
              <>
                Birth details are not sold to third parties. Request deletion via{" "}
                <Link href="/contact" className="font-semibold text-saffron-deep hover:underline">
                  Contact
                </Link>
                .
              </>
            )}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "सामान्य प्रश्न" : "Questions"}
          </h2>
          <p>
            {hi ? (
              <>
                तकनीकी प्रश्न:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  {siteConfig.email}
                </a>
              </>
            ) : (
              <>
                Technical questions:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  {siteConfig.email}
                </a>
              </>
            )}
          </p>
          <dl className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-black/[0.06] bg-white px-4 py-3"
              >
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14px]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="border-t border-black/5 pt-6 text-sm">
          <Link href="/kundli" className="font-semibold text-saffron-deep hover:underline">
            {hi ? "मुफ्त कुंडली →" : "Free kundli →"}
          </Link>
        </p>
      </article>
    </div>
  );
}
