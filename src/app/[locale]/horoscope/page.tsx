import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { HOROSCOPE_SIGNS, pickL } from "@/lib/horoscope/signs";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title:
      locale === "hi"
        ? `राशिफल — 12 राशियाँ | ${siteConfig.brandName}`
        : `Horoscope — 12 Zodiac Signs | ${siteConfig.brandName}`,
    description:
      locale === "hi"
        ? "अपनी राशि चुनें — दैनिक, साप्ताहिक और मासिक राशिफल।"
        : "Choose your sign — daily, weekly and monthly horoscopes.",
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/horoscope`,
    },
  };
}

export default async function HoroscopeIndexPage() {
  const locale = await getLocale();
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        title={hi ? "राशिफल" : "Horoscope"}
        description={
          hi
            ? "अपनी राशि चुनें और दैनिक / साप्ताहिक / मासिक मार्गदर्शन पढ़ें।"
            : "Pick your sign for daily, weekly and monthly guidance."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "राशिफल" : "Horoscope" },
        ]}
      />

      <div className="container-page max-w-5xl py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {HOROSCOPE_SIGNS.map((s) => (
            <Link
              key={s.slug}
              href={`/horoscope/${s.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-[#fffaf6]"
            >
              <ZodiacIcon
                slug={s.slug}
                className="h-16 w-16 sm:h-20 sm:w-20"
                colorClassName="bg-[#c45a12]/80"
              />
              <span className="font-display text-[15px] font-bold text-ink">
                {pickL(locale, s.name)}
              </span>
              <span className="text-[11px] text-ink-muted">
                {hi
                  ? `${pickL(locale, s.ruler)} शासित`
                  : `Ruled by ${pickL(locale, s.ruler)}`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
