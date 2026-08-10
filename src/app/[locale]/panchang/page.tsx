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
      ? "आज का पंचांग | सूर्योदय, तिथि, नक्षत्र व मुहूर्त"
      : "Today Panchang | Sunrise, Tithi, Nakshatra & Muhurat",
    description: hi
      ? "आज का दैनिक पंचांग — सूर्योदय, सूर्यास्त, चंद्रोदय, चंद्रास्त, तिथि, नक्षत्र, योग, करण, राहु काल व ग्रह स्थिति। तिथि और शहर बदलें।"
      : "Today’s daily Panchangam with sunrise, sunset, moonrise, moonset, tithi, nakshatra, yoga, karana, Rahu Kaal and planetary positions. Change date and city anytime.",
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
      <div className="min-h-screen bg-[#faf8f5]">
        <PageHero
          eyebrow={hi ? "दैनिक पंचांग" : "Daily Panchangam"}
          title={hi ? "आज का पंचांग" : "Today Panchang"}
          description={intro}
          crumbs={[
            { label: hi ? "होम" : "Home", href: "/" },
            { label: hi ? "पंचांग" : "Panchang" },
          ]}
        />
        <div className="container-page py-6 sm:py-8">
          <TodayPanchangView />
        </div>
      </div>
    </>
  );
}
