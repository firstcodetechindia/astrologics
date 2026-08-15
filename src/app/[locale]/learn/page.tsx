import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { LEARN_HUB_SECTIONS } from "@/lib/learn/catalog";
import { pickLocale } from "@/lib/learn/types";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/learn",
    title: hi
      ? "ज्योतिष सीखें — वैदिक, पश्चिमी, केपी व अंक ज्योतिष"
      : "Learn Astrology — Vedic, Western, KP & Numerology",
    description: hi
      ? "मुफ्त ज्योतिष गाइड — वैदिक राशि, ग्रह, भाव, पश्चिमी ज्योतिष, केपी सब-लॉर्ड, अंक ज्योतिष और दशा — स्पष्ट भाषा में।"
      : "Free astrology guides covering Vedic zodiac, planets, houses, Western astrology, KP sub-lords, numerology and dashas — explained clearly.",
    keywords: hi
      ? [
          "ज्योतिष सीखें",
          "कुंडली गाइड",
          "पश्चिमी ज्योतिष",
          "केपी ज्योतिष",
          "अंक ज्योतिष",
          "learn astrology",
        ]
      : [
          "learn astrology",
          "kundli basics",
          "western astrology guide",
          "KP astrology",
          "numerology guide",
          "astrology glossary",
        ],
  });
}

export default async function LearnHubPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "सीखें" : "Learn", path: "/learn" },
        ])}
      />
      <PageHero
        eyebrow={hi ? "शिक्षा केंद्र" : "Education hub"}
        title={hi ? "ज्योतिष सीखें — परंपराओं के पार गाइड" : "Learn Astrology — Guides Across Traditions"}
        description={
          hi
            ? "CosmicTalks पर राशियाँ, ग्रह, भाव, केपी, पश्चिमी आस्पेक्ट और व्यावहारिक विषय — एक जगह, सरल भाषा में।"
            : "On CosmicTalks: signs, planets, houses, KP, Western aspects, and practical topics — one place, plain language."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "सीखें" : "Learn" },
        ]}
        actions={
          <>
            <Link
              href="/learn/zodiac"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron to-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-saffron/20"
            >
              {hi ? "राशियों से शुरू करें" : "Start with rashis"}
            </Link>
            <Link
              href="/learn/glossary"
              className="inline-flex items-center justify-center rounded-xl border border-saffron/30 bg-surface/85 px-4 py-2.5 text-sm font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
            >
              {hi ? "शब्दावली" : "Glossary"}
            </Link>
          </>
        }
      />

      <div className="container-page space-y-12 py-10 sm:py-14">
        {LEARN_HUB_SECTIONS.map((section) => (
          <section key={section.category}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                  {section.icon} {pickLocale(locale, section.title)}
                </p>
                <p className="mt-1 max-w-2xl text-sm text-ink-muted">
                  {pickLocale(locale, section.description)}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/learn/${guide.slug}`}
                  className="group rounded-2xl border border-white/10 bg-surface p-4 shadow-[0_8px_24px_-18px_rgba(42,33,24,0.35)] transition hover:border-saffron/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-deep-indigo/70 text-lg transition group-hover:bg-cosmic-purple/15">
                      {guide.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink group-hover:text-saffron-deep">
                        {pickLocale(locale, guide.menuTitle)}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-ink-muted">
                        {pickLocale(locale, guide.menuDescription)}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-saffron/20 surface-wash p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {hi ? "सीखते हुए अभ्यास करें" : "Practice while you learn"}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {hi
                ? "गाइड पढ़ें, फिर मुफ्त कैलकुलेटर या कुंडली से जोड़ें।"
                : "Read a guide, then connect it with a free calculator or kundli."}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            <Link
              href="/calculators"
              className="rounded-xl bg-saffron-deep px-4 py-2 text-sm font-semibold text-white"
            >
              {hi ? "कैलकुलेटर" : "Calculators"}
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-saffron/30 bg-surface/85 px-4 py-2 text-sm font-semibold text-saffron-deep"
            >
              {hi ? "ब्लॉग" : "Blog"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
