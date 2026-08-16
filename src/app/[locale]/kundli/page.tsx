import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BirthForm } from "@/components/kundli/BirthForm";
import { PageHero } from "@/components/ui/PageHero";
import { DirectAnswer } from "@/components/seo/DirectAnswer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { KUNDLI_PAGE_FAQS } from "@/lib/seo/kundli-page-content";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
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
      ? "मुफ्त कुंडली ऑनलाइन — अभी जन्म कुंडली बनाएँ"
      : "Free Kundli Online — Generate Your Janam Kundali Now",
    description: hi
      ? "मुफ्त जन्म कुंडली तुरंत बनाएँ। लग्न, ग्रह, भाव, नक्षत्र, दशा व योग — भारत की लाहिरी पद्धति से।"
      : "Create your free Janam Kundli instantly. Get Lagna, planets, houses, Nakshatra, dasha & yogas — calculated with India's Lahiri method.",
    keywords: hi
      ? [
          "मुफ्त कुंडली ऑनलाइन",
          "जन्म कुंडली ऑनलाइन",
          "जनम कुंडली",
          "free kundli online",
          "janam kundali online",
          "लग्न गणना",
        ]
      : [
          "free kundli online",
          "janam kundali online",
          "birth chart free",
          "online kundli generator",
          "lagna calculation",
          "kundli by date of birth and time",
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
  const tc = await getTranslations("nav");
  const hi = locale === "hi";
  const faqs = KUNDLI_PAGE_FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: tc("kundli"), path: "/kundli" },
        ])}
      />
      <JsonLd data={howToKundliJsonLd(locale)} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageHero
        eyebrow="Kundli"
        title={
          hi ? "अपनी मुफ्त जन्म कुंडली बनाएँ" : "Generate Your Free Janam Kundli"
        }
        description={
          hi
            ? "जन्म तिथि, समय और स्थान भरें — लाहिरी निरयण जन्म कुंडली सेकंडों में: लग्न, ग्रह, भाव, नक्षत्र, योग और विंशोत्तरी दशा एक रिपोर्ट में।"
            : "Enter birth date, time and place to generate a Lahiri sidereal janam kundali in seconds — Lagna, planets, houses, Nakshatras, yogas and Vimshottari dasha in one report."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: tc("kundli") },
        ]}
      />
      <div className="container-page space-y-6 py-6 sm:py-8">
          <DirectAnswer>
            {hi ? (
              <p>
                <strong>सीधे उत्तर:</strong> जन्म तिथि, समय और स्थान भरकर लाहिरी
                निरयण जन्म कुंडली सेकंडों में बनाएँ — लग्न, ग्रह, भाव, नक्षत्र,
                योग और विंशोत्तरी दशा एक रिपोर्ट में।
              </p>
            ) : (
              <p>
                <strong>Direct answer:</strong> Enter birth date, time and place
                to generate a Lahiri sidereal janam kundali in seconds — Lagna,
                planets, houses, Nakshatras, yogas and Vimshottari dasha in one
                report.
              </p>
            )}
          </DirectAnswer>

          <Suspense
            fallback={
              <div className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-ink-muted">
                {hi ? "फ़ॉर्म लोड हो रहा है…" : "Loading form…"}
              </div>
            }
          >
            <BirthForm />
          </Suspense>
          <article className="space-y-8 pt-2 text-[15px] leading-relaxed text-ink-muted sm:pt-4">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {hi
                ? "आपकी मुफ्त कुंडली में क्या मिलेगा"
                : "What You'll Get in Your Free Kundli"}
            </h2>
            <p>
              {hi
                ? "आपकी जन्म कुंडली जन्म क्षण पर सूर्य, चंद्र और ग्रहों की स्थिति को राशि, भाव और नक्षत्रों में मैप करती है। नीचे तिथि, समय और स्थान भरें — भारत में व्यापक रूप से प्रयुक्त लाहिरी (निरयण) पद्धति और पूर्ण-राशि भावों पर चार्ट बनेगा। इसमें लग्न, चंद्र राशि, नक्षत्र, 12 भावों में ग्रह स्थिति और वर्तमान विंशोत्तरी दशा शामिल हैं।"
                : "Your Janam Kundli maps the exact position of the Sun, Moon and planets at your birth moment, converted into signs, houses and Nakshatras. Enter your date, time and place of birth below to generate a chart based on India’s widely used Lahiri (sidereal) method with whole-sign houses. Your Kundli includes your Lagna (rising sign), Moon sign, Nakshatra, planetary placements across all 12 houses, and your current Vimshottari Dasha period."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {hi ? "जन्म समय क्यों मायने रखता है" : "Why Birth Time Matters"}
            </h2>
            <p>
              {hi
                ? "लग्न लगभग हर दो घंटे बदलता है — इसलिए सही भावों के लिए सटीक जन्म समय ज़रूरी है। यदि समय अनिश्चित हो तो जन्म प्रमाणपत्र या अस्पताल रिकॉर्ड जाँचें; 15 मिनट का अंतर भी भाव सीमा बदल सकता है। अभिलेख न हों तो "
                : "The Lagna changes roughly every two hours, which is why an accurate birth time is essential for correct house placements. If you’re unsure of your exact time, check your birth certificate or hospital record before generating your chart — even a 15-minute difference can shift house cusps. If records are missing, try "}
              <Link
                href="/calculators/birth-time-rectification"
                className="font-semibold text-saffron-deep hover:underline"
              >
                {hi ? "जन्म समय सुधार" : "birth-time rectification"}
              </Link>
              {hi
                ? " (अनुमानित संरेखण — प्रमाण नहीं)।"
                : " (heuristic alignment — not proof)."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {hi ? "अपनी कुंडली कैसे पढ़ें" : "How to Read Your Kundli"}
            </h2>
            <p>
              {hi ? (
                <>
                  चार्ट बनने के बाद लग्न से शुरू करें — यही हर भाव की रूपरेखा
                  तय करता है। चंद्र राशि भावनात्मक प्रवृत्ति दिखाती है, और
                  नक्षत्र जन्म नक्षत्र व उसके स्वामी ग्रह बताता है। करियर,
                  विवाह या समय के गहरे प्रश्नों के लिए{" "}
                  <Link href="/chat" className="font-semibold text-saffron-deep hover:underline">
                    एआई गुरु
                  </Link>{" "}
                  उपयोग करें या{" "}
                  <Link href="/learn" className="font-semibold text-saffron-deep hover:underline">
                    ज्योतिष सीखें
                  </Link>{" "}
                  गाइड देखें।
                </>
              ) : (
                <>
                  Once generated, start with your Lagna — it sets the framework
                  for how every house is read. Your Moon sign shows emotional
                  tendencies, and your Nakshatra reveals your birth star and its
                  ruling planet. For deeper questions about career, marriage or
                  timing, use the{" "}
                  <Link href="/chat" className="font-semibold text-saffron-deep hover:underline">
                    AI Guru chat
                  </Link>{" "}
                  or explore our{" "}
                  <Link href="/learn" className="font-semibold text-saffron-deep hover:underline">
                    Learn Astrology
                  </Link>{" "}
                  guides.
                </>
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-white/10 bg-surface px-4 py-3"
                >
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-1.5 text-[14px]">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm">
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                {hi
                  ? "हमारी गणना पद्धति कैसे काम करती है →"
                  : "How our calculation methodology works →"}
              </Link>
            </p>
          </section>
          </article>
      </div>
    </div>
  );
}
