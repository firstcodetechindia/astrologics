"use client";

import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/site-config";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export function HomeFaqStrip({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const faqs = hi
    ? [
        {
          q: "क्या कुंडली मुफ्त है?",
          a: "हाँ। पूरी ऑनलाइन कुंडली और दर्जनों कैलकुलेटर मुफ्त हैं — खाता बनाने की ज़रूरत नहीं। गहन उपचार और व्यक्तिगत सलाह के लिए हमसे बात करें।",
        },
        {
          q: "कौन-सी गणना पद्धति?",
          a: "Astrologics वैदिक ज्योतिष पर चलता है — भारत में प्रचलित लाहिरी विधि, एक राशि = एक भाव, और जीवन काल दशा (विंशोत्तरी)।",
        },
        {
          q: "एआई चैट कैसे काम करता है?",
          a: "अपनी जन्म तिथि, समय और स्थान बताएँ, फिर साधारण भाषा में प्रश्न पूछें — जैसे करियर, विवाह या वर्तमान दशा। उत्तर आपकी कुंडली के आधार पर सरल शब्दों में मिलते हैं। ज़्यादा गहन सलाह के लिए हमसे बात करें।",
        },
        {
          q: "लव कैलकुलेटर या कुंडली मिलान?",
          a: "केवल नाम पता हो तो लव कैलकुलेटर आज़माएँ। दोनों की जन्म तिथि–समय–स्थान हों तो 36 गुण कुंडली मिलान चुनें — विवाह चर्चा के लिए वही बेहतर।",
        },
        {
          q: "क्या मेरी जानकारी सुरक्षित है?",
          a: "आपकी गणना आपके उपयोग के समय होती है। इन मुफ्त उपकरणों में हम स्थायी जन्म-रिकॉर्ड नहीं रखते। परामर्श के लिए आप जो हमसे साझा करें, वही उपयोग होता है।",
        },
        {
          q: "उपचार कैसे लें?",
          a: "पहले मुफ्त कुंडली या कैलकुलेटर पढ़ें। रत्न, मंत्र, उपाय या सही समय जानने के लिए हमसे बात करें।",
        },
      ]
    : [
        {
          q: "Is the kundli free?",
          a: "Yes. The full online kundli and dozens of calculators are free — no account needed. For deeper remedies and personal advice, talk with us.",
        },
        {
          q: "Which calculation method?",
          a: "Astrologics uses Vedic astrology — India’s widely used Lahiri method, one sign = one house, and the classical life-period dasha (Vimshottari).",
        },
        {
          q: "How does AI chat work?",
          a: "Share your birth date, time and place, then ask in plain language — about career, marriage, or your current life period. Answers are based on your chart, in simple words. For deeper personal advice, talk with us.",
        },
        {
          q: "Love Calculator or Kundli Matching?",
          a: "If you only know names, try the Love Calculator. If you have both birth dates, times and places, use 36-guna Kundli Matching — that is better for marriage talks.",
        },
        {
          q: "Is my data private?",
          a: "Your chart is calculated while you use the tools. We do not keep a permanent birth record from these free tools. For consultation, we only use what you choose to share with us.",
        },
        {
          q: "How do I get remedies?",
          a: "First read your free kundli or calculator result. For gemstones, mantras, remedies or auspicious timing, talk with us.",
        },
      ];

  return (
    <section className="container-page pb-3 pt-6 sm:pb-4 sm:pt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
          </h2>
          <p className="mt-1.5 text-[14px] text-ink-muted sm:text-[15px]">
            {hi
              ? "शुरू करने से पहले स्पष्ट उत्तर।"
              : "Clear answers before you dive in."}
          </p>
        </div>
        <Link
          href="/faq"
          className="shrink-0 text-[13px] font-semibold text-saffron-deep hover:underline sm:text-[14px]"
        >
          {hi ? "पूर्ण FAQ देखें →" : "See full FAQ →"}
        </Link>
      </div>

      <FaqAccordion items={faqs} />
    </section>
  );
}

export function HomeConsultBand({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="container-page pb-2 pt-2 sm:pb-3 sm:pt-3">
      <div className="rounded-xl border border-saffron/25 bg-gradient-to-br from-[#fff3ea] via-white to-[#ffe8d4] px-4 py-4 sm:px-6 sm:py-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <div className="min-w-0 flex-1 text-left">
            <h2 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              {hi
                ? "व्यक्तिगत मार्गदर्शन चाहिए?"
                : "Need personal guidance?"}
            </h2>
            <p className="mt-1 text-[13px] leading-snug text-ink-muted sm:text-[14px]">
              {hi
                ? "मुफ्त उपकरण से शुरू करें। रत्न, मंत्र, विवाह समय या करियर के लिए हमसे बात करें।"
                : "Start with free tools. For gems, mantras, marriage timing or career — talk with us."}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/kundli"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron to-maroon px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-saffron/25"
            >
              {hi ? "मुफ्त कुंडली" : "Free kundli"}
            </Link>
            <a
              href={whatsappLink(
                hi
                  ? "नमस्ते, मुझे विस्तृत कुंडली परामर्श और उपचार चाहिए।"
                  : "Namaste, I would like a detailed kundli reading and remedies."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-saffron/35 bg-white px-4 py-2 text-[13px] font-semibold text-saffron-deep hover:bg-sand/40"
            >
              {hi ? "हमसे बात करें" : "Talk With Us"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
