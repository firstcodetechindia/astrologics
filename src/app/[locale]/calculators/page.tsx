import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  CALCULATORS,
  CATEGORY_LABELS,
  calculatorsByCategory,
  type CalcCategory,
} from "@/lib/calculators/catalog";
import { RelatedSidebar } from "@/components/calculators/RelatedSidebar";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/calculators",
    title: hi
      ? `मुफ्त ज्योतिष व अंक कैलकुलेटर — कुंडली उपकरण | ${siteConfig.brandName}`
      : `Free Astrology & Numerology Calculators — Kundli Tools | ${siteConfig.brandName}`,
    description: hi
      ? "चंद्र राशि, लग्न, मंगल दोष, गुण मिलान, पंचांग, केपी व अंक ज्योतिष — मुफ्त कैलकुलेटर स्पष्ट व्याख्या के साथ।"
      : "Moon sign, lagna, Mangal dosha, gun milan, panchang, KP & numerology — free astrology calculators with clear guides.",
    keywords: hi
      ? [
          "मुफ्त ज्योतिष कैलकुलेटर",
          "कुंडली कैलकुलेटर",
          "गुण मिलान",
          "मंगल दोष",
          "पंचांग",
          "free astrology calculator",
        ]
      : [
          "free astrology calculator",
          "kundli calculator",
          "gun milan calculator",
          "mangal dosha checker",
          "panchang calculator",
          "KP calculator",
          "numerology calculator",
        ],
  });
}

const ORDER: CalcCategory[] = [
  "signs",
  "dosha",
  "matching",
  "kp",
  "remedies",
  "panchang",
  "numerology",
];

export default async function CalculatorsPage() {
  const locale = await getLocale();
  const byCat = calculatorsByCategory();
  const hi = locale === "hi";

  const faqs = hi
    ? [
        {
          q: "क्या सभी कैलकुलेटर मुफ्त हैं?",
          a: "हाँ — बिना खाता बनाए उपयोग करें। गहन परामर्श व्हाट्सऐप पर उपलब्ध है।",
        },
        {
          q: "कौन-सी गणना पद्धति?",
          a: "ज्योतिष — लाहिरी विधि; जहाँ लागू हो एक राशि = एक भाव।",
        },
        {
          q: "नाम मिलान या जन्म मिलान?",
          a: "त्वरित जाँच हेतु लव कैलकुलेटर; विवाह चर्चा हेतु कुंडली मिलान।",
        },
        {
          q: "क्या मेरी जानकारी सुरक्षित है?",
          a: "गणना आपके उपयोग के समय होती है। इन उपकरणों में स्थायी जन्म-रिकॉर्ड नहीं रखा जाता।",
        },
      ]
    : [
        {
          q: "Are all calculators free?",
          a: "Yes — use freely, no account needed. For deeper consultation, talk with us.",
        },
        {
          q: "Which calculation method?",
          a: "astrology with Lahiri method; one sign = one house where applicable.",
        },
        {
          q: "Name match or birth match?",
          a: "Love Calculator for a quick check; Kundli Matching for marriage talks.",
        },
        {
          q: "Is my information private?",
          a: "Your chart is calculated while you use the tool. These tools do not keep a permanent birth record.",
        },
      ];

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "कैलकुलेटर" : "Calculators", path: "/calculators" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageHero
        eyebrow={hi ? "मुफ्त उपकरण" : "Free tools"}
        title={hi ? "सभी कैलकुलेटर" : "All Calculators"}
        description={
          hi
            ? `${CALCULATORS.length} मुफ्त उपकरण — तुरंत ब्राउज़र में। प्रत्येक पृष्ठ पर मार्गदर्शन, FAQ और संबंधित लिंक।`
            : `${CALCULATORS.length} free tools — instant in your browser. Every page includes guides, FAQs and related links.`
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "कैलकुलेटर" : "Calculators" },
        ]}
        actions={
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-xl border border-saffron/30 bg-white/80 px-4 py-2.5 text-sm font-semibold text-saffron-deep hover:bg-[#fff1e6]"
          >
            {hi ? "ज्योतिष सीखें" : "Learn astrology"}
          </Link>
        }
      />
      <div className="container-page py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div>
            <div className="space-y-10">
              {ORDER.map((cat) => {
                const items = byCat.get(cat) || [];
                const label = CATEGORY_LABELS[cat];
                return (
                  <section key={cat}>
                    <h2 className="text-[11px] font-bold tracking-wider text-ink-muted uppercase mb-3">
                      {hi ? label.hi : label.en}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {items.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/calculators/${c.slug}`}
                          className="flex gap-3 rounded-2xl border border-black/8 bg-white p-4 shadow-sm hover:border-saffron/30 hover:shadow-md transition"
                        >
                          <span className="text-2xl shrink-0">{c.icon}</span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink text-[15px]">
                              {hi ? c.title.hi : c.title.en}
                            </span>
                            <span className="block mt-1 text-sm text-ink-muted leading-snug">
                              {hi ? c.description.hi : c.description.en}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <section className="mt-10 rounded-2xl border border-saffron/20 bg-gradient-to-br from-[#fff7f0] to-white p-5">
              <h2 className="font-display text-lg font-bold text-ink">
                {hi ? "पूर्ण हब पेज" : "Full hub pages"}
              </h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                {hi
                  ? "गहन व्याख्या, FAQ और सिस्टम तुलना के साथ।"
                  : "With deeper explainers, FAQs and system comparisons."}
              </p>
              <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                <li>
                  <Link
                    href="/numerology"
                    className="text-saffron-deep hover:underline"
                  >
                    {hi ? "अंक ज्योतिष →" : "Numerology →"}
                  </Link>
                </li>
                <li>
                  <Link href="/vastu" className="text-saffron-deep hover:underline">
                    {hi ? "वास्तु →" : "Vastu →"}
                  </Link>
                </li>
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
              </h2>
              <FaqAccordion items={faqs} />
            </section>
          </div>

          <RelatedSidebar />
        </div>
      </div>
    </div>
  );
}
