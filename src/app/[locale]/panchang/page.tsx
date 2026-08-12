import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { TodayPanchangView } from "@/components/panchang/TodayPanchangView";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
  softwareAppJsonLd,
} from "@/lib/seo/page-meta";

const FAQS = [
  {
    q: {
      en: "What does today’s Panchang include?",
      hi: "आज के पंचांग में क्या आता है?",
    },
    a: {
      en: "Sunrise, sunset, moonrise, moonset, tithi, nakshatra, yoga, karana, paksha, weekday, ashubha muhurat, tarabalam, chandrabalam and planetary positions for your city.",
      hi: "आपके शहर के लिए सूर्योदय-अस्त, चंद्रोदय-अस्त, तिथि, नक्षत्र, योग, करण, पक्ष, वार, अशुभ मुहूर्त, ताराबल, चंद्रबल और ग्रह स्थिति।",
    },
  },
  {
    q: {
      en: "Can I change the date and location?",
      hi: "क्या तिथि और स्थान बदल सकते हैं?",
    },
    a: {
      en: "Yes. Pick any date and search a city — Panchang recalculates sun/moon timings and all five limbs for that place.",
      hi: "हाँ। कोई भी तिथि चुनें और शहर खोजें — सूर्य-चंद्र समय व पाँचों अंग उसी स्थान के अनुसार बदलते हैं।",
    },
  },
  {
    q: {
      en: "Which ayanamsa do you use?",
      hi: "कौन-सा अयनांश उपयोग होता है?",
    },
    a: {
      en: "Lahiri (Chitrapaksha) ayanamsa — India’s widely used national panchang standard.",
      hi: "लाहिरी (चित्रपक्ष) अयनांश — भारत में प्रचलित राष्ट्रीय पंचांग मानक।",
    },
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/panchang",
    title: hi
      ? "आज का पंचांग — तिथि, नक्षत्र, राहु काल लाइव"
      : "Today's Panchang — Tithi, Nakshatra, Rahu Kaal Live",
    description: hi
      ? "आज का लाइव पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल, चौघड़िया और होरा, आपके स्थान के अनुसार।"
      : "Live Panchang for today — Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Choghadiya and Hora, recalculated in real time for your location.",
    keywords: [
      "today panchang",
      "daily panchangam",
      "sunrise sunset moonrise",
      "tithi nakshatra yoga karana",
      "rahu kaal today",
      hi ? "आज का पंचांग" : "panchang today India",
    ],
  });
}

export default async function PanchangPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const url = absoluteUrl(locale, "/panchang");
  const name = hi ? "आज का पंचांग" : "Today Panchang";
  const intro = hi
    ? "अपने शहर के लिए आज का पंचांग देखें — सूर्य-चंद्र समय, पाँच अंग, अशुभ मुहूर्त और ग्रह स्थिति। तिथि या स्थान कभी भी बदलें।"
    : "See today’s Panchang for your city — sun & moon timings, five limbs, ashubha muhurat and planetary positions. Change date or location anytime.";

  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <>
      <JsonLd
        data={softwareAppJsonLd({
          name,
          description: intro,
          url,
        })}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "पंचांग" : "Panchang", path: "/panchang" },
        ])}
      />
      <div className="min-h-screen bg-cosmic-navy">
        <PageHero
          eyebrow={hi ? "दैनिक पंचांग" : "Daily Panchangam"}
          title={hi ? "आज का पंचांग" : "Today's Panchang"}
          description={intro}
          crumbs={[
            { label: hi ? "होम" : "Home", href: "/" },
            { label: hi ? "पंचांग" : "Panchang" },
          ]}
        />
        <div className="container-page py-6 sm:py-8">
          <TodayPanchangView />
          <article className="mx-auto mt-10 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "पंचांग क्या है?" : "What is Panchang?"}
            </h2>
            <p>
              {hi
                ? "पंचांग का शाब्दिक अर्थ पाँच अंग है — तिथि, वार, नक्षत्र, योग और करण। ये पाँच तत्व पारंपरिक रूप से दैनिक शुभ-अशुभ समय और धार्मिक/सामाजिक कार्यों के चयन में सहायक माने जाते हैं। CosmicGPT आपके शहर के लिए सूर्योदय-अस्त के साथ इन अंगों की गणना लाहिरी पद्धति से करता है।"
                : "Panchang literally means five limbs — Tithi, Vara (weekday), Nakshatra, Yoga and Karana. Together they form the traditional daily calendar used for muhurat, festivals and everyday timing decisions. CosmicGPT calculates these limbs for your city with sunrise/sunset using the Lahiri standard."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "चौघड़िया और राहु काल कैसे उपयोग करें" : "Using Choghadiya and Rahu Kaal"}
            </h2>
            <p>
              {hi
                ? "राहु काल को प्रायः नए शुभ कार्य शुरू करने से बचने का समय माना जाता है — यात्रा या समारोह योजना में इसे ध्यान में रखें। चौघड़िया दिन-रात को खंडों में बाँटती है; Ambija/Shubh जैसे खंड सामान्य कार्यों हेतु अनुकूल माने जाते हैं। ये संकेत मार्गदर्शन हैं, निश्चित भविष्य नहीं।"
                : "Rahu Kaal is traditionally treated as a window to avoid starting auspicious new work — useful when planning travel or ceremonies. Choghadiya divides day and night into rated segments; favourable windows are often preferred for routine starts. These are guidance frameworks, not guaranteed outcomes."}
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
