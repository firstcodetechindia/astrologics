import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { LearnGuideView } from "@/components/learn/LearnGuideView";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import {
  LEARN_GUIDE_SLUGS,
  getLearnGuide,
} from "@/lib/learn/catalog";
import { GLOSSARY_TERMS } from "@/lib/learn/glossary";
import { pickLocale } from "@/lib/learn/types";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return LEARN_GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const guide = getLearnGuide(slug);
  if (!guide) return {};

  return {
    title: `${pickLocale(locale, guide.title)} | ${siteConfig.brandName}`,
    description: pickLocale(locale, guide.description),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/learn/${slug}`,
      languages: {
        en: `${siteConfig.siteUrl}/en/learn/${slug}`,
        hi: `${siteConfig.siteUrl}/hi/learn/${slug}`,
      },
    },
  };
}

export default async function LearnGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const guide = getLearnGuide(slug);
  if (!guide) notFound();

  if (slug === "glossary") {
    const hi = locale === "hi";
    return (
      <div className="bg-[#faf8f5]">
        <PageHero
          eyebrow={hi ? "संदर्भ" : "Reference"}
          title={pickLocale(locale, guide.title)}
          description={pickLocale(locale, guide.subtitle)}
          crumbs={[
            { label: hi ? "होम" : "Home", href: "/" },
            { label: hi ? "सीखें" : "Learn", href: "/learn" },
            { label: pickLocale(locale, guide.menuTitle) },
          ]}
          actions={
            <Link
              href="/learn"
              className="inline-flex items-center justify-center rounded-xl border border-saffron/30 bg-white/80 px-4 py-2.5 text-sm font-semibold text-saffron-deep hover:bg-[#fff1e6]"
            >
              {hi ? "सभी गाइड" : "All guides"}
            </Link>
          }
        />
        <div className="container-page py-10 sm:py-12">
          <div className="mb-8 max-w-3xl space-y-3 text-[15px] text-ink-muted">
            {guide.intro.map((p, i) => (
              <p key={i}>{pickLocale(locale, p)}</p>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {GLOSSARY_TERMS.map((item) => (
              <div
                key={pickLocale(locale, item.term)}
                className="rounded-2xl border border-black/[0.07] bg-white p-4"
              >
                <h2 className="font-display text-[15px] font-bold text-ink">
                  {pickLocale(locale, item.term)}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                  {pickLocale(locale, item.definition)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <LearnGuideView guide={guide} locale={locale} />;
}
