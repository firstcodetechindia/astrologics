import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOROSCOPE_SIGNS, pickL } from "@/lib/horoscope/signs";
import { getHoroscopeSeo } from "@/lib/horoscope/seo-content";
import { siteConfig } from "@/lib/site-config";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/horoscope",
    title: hi
      ? `आज का राशिफल — 12 राशियाँ दैनिक, साप्ताहिक, मासिक | ${siteConfig.brandName}`
      : `Today’s Horoscope — 12 Zodiac Signs Daily, Weekly, Monthly | ${siteConfig.brandName}`,
    description: hi
      ? "मेष से मीन तक दैनिक, साप्ताहिक और मासिक राशिफल — लकी नंबर, रंग, शासक ग्रह, उपाय और एआई गुरु मार्गदर्शन।"
      : "Daily, weekly and monthly horoscopes for all 12 signs — lucky numbers, colours, ruling planets, remedies and AI Guru guidance.",
    keywords: hi
      ? [
          "राशिफल",
          "आज का राशिफल",
          "दैनिक राशिफल",
          "वैदिक राशिफल",
          "चंद्र राशि",
          "aaj ka rashifal",
        ]
      : [
          "horoscope today",
          "daily horoscope",
          "aaj ka rashifal",
          "Vedic horoscope",
          "zodiac signs",
          "Moon sign horoscope",
          "rashifal",
        ],
  });
}

export default async function HoroscopeIndexPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  return (
    <div className="relative overflow-hidden bg-[#faf8f5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,138,31,0.2),transparent_70%)]"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: hi ? "राशिफल — 12 राशियाँ" : "Horoscope — 12 Zodiac Signs",
          description: hi
            ? "सभी राशियों का दैनिक, साप्ताहिक और मासिक राशिफल।"
            : "Daily, weekly and monthly horoscopes for every zodiac sign.",
          url: absoluteUrl(locale, "/horoscope"),
          isPartOf: { "@type": "WebSite", name: siteConfig.brandName },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "राशिफल" : "Horoscope", path: "/horoscope" },
        ])}
      />

      <PageHero
        eyebrow={hi ? "एआई ज्योतिष · वैदिक शैली" : "AI Jyotish · Vedic style"}
        title={hi ? "राशिफल — 12 राशियाँ" : "Horoscope — 12 Zodiac Signs"}
        description={
          hi
            ? "अपनी राशि चुनें — दैनिक / साप्ताहिक / मासिक मार्गदर्शन, लकी मैट्रिक्स, उपाय और एआई गुरु।"
            : "Choose your sign — daily / weekly / monthly guidance, lucky matrix, remedies and AI Guru."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "राशिफल" : "Horoscope" },
        ]}
      />

      <div className="container-page relative py-8">
        <div className="mb-6 rounded-2xl border border-white/70 bg-white/55 p-4 text-[13px] leading-relaxed text-ink-muted shadow-sm backdrop-blur-xl sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
            <Sparkles className="h-3 w-3" />
            {hi ? "खोजने योग्य ज्योतिष सामग्री" : "Crawl-ready Jyotish content"}
          </p>
          <p className="mt-2">
            {hi
              ? "प्रत्येक राशि पृष्ठ पर व्यक्तित्व प्रोफ़ाइल, करियर संकेत, अनुकूलता, करें/न करें, सरल उपाय, FAQ और एआई अंतर्दृष्टि है — ताकि पाठक और सर्च इंजन दोनों को स्पष्ट संरचना मिले।"
              : "Each sign page includes personality profile, career cues, compatibility, do/don’t lists, remedies, FAQs and AI insight — structured clearly for readers and search engines."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {HOROSCOPE_SIGNS.map((s) => {
            const seo = getHoroscopeSeo(s.slug);
            return (
              <Link
                key={s.slug}
                href={`/horoscope/${s.slug}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/55 px-3 py-5 text-center shadow-[0_10px_30px_-18px_rgba(240,106,0,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-white/80"
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#fff7f0] to-[#ffe8d4]/80 transition group-hover:scale-105 sm:h-20 sm:w-20">
                  <ZodiacIcon
                    slug={s.slug}
                    className="h-12 w-12 sm:h-14 sm:w-14"
                    colorClassName="bg-[#c45a12]/85"
                  />
                </span>
                <span className="font-display text-[15px] font-bold text-ink">
                  {pickL(locale, s.name)}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {hi
                    ? `${pickL(locale, s.ruler)} शासित`
                    : `Ruled by ${pickL(locale, s.ruler)}`}
                </span>
                {seo ? (
                  <span className="line-clamp-2 text-[10px] leading-snug text-ink-muted/90">
                    {pickL(locale, seo.tagline)}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
