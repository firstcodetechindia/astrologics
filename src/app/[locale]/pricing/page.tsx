import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";
import { Check } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/pricing",
    title: hi
      ? `मूल्य — मुफ्त उपकरण व परामर्श | ${siteConfig.brandName}`
      : `Pricing — Free Tools & Paid Consultation | ${siteConfig.brandName}`,
    description: hi
      ? "CosmicGPT मूल्य: कुंडली, कैलकुलेटर और एआई चैट मुफ्त। विस्तृत परामर्श व मिलान पैकेज व्यक्तिगत सत्र में — सरल व पारदर्शी।"
      : "CosmicGPT pricing: kundli, calculators and AI chat stay free. Detailed consultation and matching packages in personal sessions — simple and transparent.",
    keywords: hi
      ? [
          "कुंडली परामर्श मूल्य",
          "मुफ्त कुंडली",
          "ज्योतिष परामर्श",
          "गुण मिलान",
          "astrology consultation pricing",
        ]
      : [
          "kundli consultation pricing",
          "free kundli online",
          "astrology consultation",
          "gun milan package",
          "AI astrology pricing",
        ],
  });
}

export default async function PricingPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  const plans = [
    {
      name: hi ? "मुफ्त" : "Free",
      price: hi ? "₹0" : "₹0",
      period: hi ? "हमेशा" : "forever",
      features: hi
        ? [
            "पूर्ण ऑनलाइन कुंडली",
            "30+ कैलकुलेटर",
            "गुण मिलान",
            "एआई कुंडली चैट",
          ]
        : [
            "Full online kundli",
            "30+ calculators",
            "Gun Milan matching",
            "AI kundli chat",
          ],
      cta: hi ? "शुरू करें" : "Get started",
      internal: "/kundli" as const,
      highlight: false,
    },
    {
      name: hi ? "विस्तृत परामर्श" : "Detailed reading",
      price: hi ? "व्यक्तिगत" : "Personal",
      period: hi ? "व्यक्तिगत सत्र" : "personal session",
      features: hi
        ? [
            "करियर, विवाह, धन समय",
            "दोष विश्लेषण",
            "उपचार सुझाव",
            "फॉलो-अप प्रश्न",
          ]
        : [
            "Career, marriage, wealth timing",
            "Dosha analysis",
            "Remedy guidance",
            "Follow-up questions",
          ],
      cta: hi ? "हमसे बात करें" : "Talk With Us",
      external: whatsappLink(
        hi
          ? "नमस्ते, मुझे विस्तृत कुंडली परामर्श चाहिए।"
          : "Namaste, I would like a detailed kundli consultation."
      ),
      highlight: true,
    },
    {
      name: hi ? "मिलान + उपचार" : "Match + remedies",
      price: hi ? "कॉल / बातचीत" : "Call / chat",
      period: hi ? "जोड़ी सत्र" : "couple session",
      features: hi
        ? [
            "अष्टकूट + भाव विश्लेषण",
            "विवाह समय",
            "रत्न / मंत्र मार्गदर्शन",
            "पारिवारिक प्रश्न",
          ]
        : [
            "Ashtakoot + house analysis",
            "Marriage timing",
            "Gem / mantra guidance",
            "Family questions",
          ],
      cta: hi ? "अभी संपर्क करें" : "Contact now",
      external: whatsappLink(
        hi
          ? "नमस्ते, कुंडली मिलान और उपचार चाहिए।"
          : "Namaste, I need kundli matching and remedies."
      ),
      highlight: false,
    },
  ];

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "मूल्य सूची" : "Pricing", path: "/pricing" },
        ])}
      />
      <PageHero
        eyebrow={hi ? "मूल्य" : "Pricing"}
        title={hi ? "सरल मूल्य" : "Simple pricing"}
        description={
          hi
            ? "मुफ्त उपकरण हमेशा खुले। गहन मार्गदर्शन व्यक्तिगत सत्र में।"
            : "Free tools stay free. Deeper guidance happens in a personal session."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "मूल्य सूची" : "Pricing" },
        ]}
      />

      <div className="container-page py-10 sm:py-12">
      <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((p) => (
          <GlassCard
            key={p.name}
            strong={p.highlight}
            className={
              p.highlight
                ? "ring-2 ring-saffron/40 relative"
                : undefined
            }
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-maroon text-ivory text-xs px-3 py-1">
                {hi ? "लोकप्रिय" : "Popular"}
              </span>
            )}
            <h2 className="font-display text-xl font-semibold text-saffron-deep">
              {p.name}
            </h2>
            <p className="mt-2 text-3xl font-bold text-maroon">{p.price}</p>
            <p className="text-sm text-ink-muted">{p.period}</p>
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-ink">
                  <Check className="h-4 w-4 shrink-0 text-saffron mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {"internal" in p && p.internal ? (
              <Link
                href={p.internal}
                className={`mt-6 w-full justify-center inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-semibold ${
                  p.highlight
                    ? "btn-grad text-ivory"
                    : "bg-gradient-to-r from-gold to-saffron text-ivory"
                }`}
              >
                {p.cta}
              </Link>
            ) : (
              <ButtonLink
                href={p.external!}
                variant={p.highlight ? "primary" : "secondary"}
                className="mt-6 w-full justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.cta}
              </ButtonLink>
            )}
          </GlassCard>
        ))}
      </div>
      </div>

      <section className="container-page mt-12 max-w-3xl space-y-8 pb-12 text-[15px] leading-relaxed text-ink-muted">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "मुफ्त में क्या मिलता है" : "What stays free"}
          </h2>
          <p>
            {hi
              ? "पूर्ण ऑनलाइन जन्म कुंडली, 30+ कैलकुलेटर (गुण मिलान, दोष, केपी, अंक ज्योतिष), दैनिक राशिफल, पंचांग और एआई कुंडली चैट — ये सभी मुफ्त tier में हैं। कोई छिपी सदस्यता नहीं; गहन मार्गदर्शन अलग व्यक्तिगत सत्र में।"
              : "Full online janam kundali, 30+ calculators (gun milan, dosha, KP, numerology), daily horoscope, panchang and AI kundli chat are all in the free tier. No hidden subscription — deeper guidance is a separate personal session."}
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "भुगतान परामर्श कब लें" : "When to choose paid consultation"}
          </h2>
          <p>
            {hi
              ? "जब आपको घटना समय (विवाह, नौकरी बदलाव), जोड़ी मिलान की गहराई, दोष उपाय प्राथमिकता या परिवार के कई प्रश्न एक सत्र में चाहिए — तब विस्तृत परामर्श या मिलान+उपचार पैकेज उपयुक्त है। मूल्य व्यक्तिगत सत्र पर निर्भर; व्हाट्सऐप पर पूछें।"
              : "Choose a detailed reading or match-and-remedies package when you need event timing (marriage, job change), deeper couple compatibility, dosha remedy priority or several family questions in one session. Pricing depends on the personal session — ask on WhatsApp."}
          </p>
        </div>
      </section>
    </div>
  );
}
