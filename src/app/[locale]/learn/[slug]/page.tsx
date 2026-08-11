import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { LearnGuideView } from "@/components/learn/LearnGuideView";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import {
  LEARN_GUIDE_SLUGS,
  getLearnGuide,
} from "@/lib/learn/catalog";
import { GLOSSARY_TERMS } from "@/lib/learn/glossary";
import { pickLocale } from "@/lib/learn/types";
import { siteConfig } from "@/lib/site-config";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

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
  const title = pickLocale(locale, guide.title);
  const description = pickLocale(locale, guide.description);
  const hi = locale === "hi";

  return buildPageMetadata({
    locale,
    path: `/learn/${slug}`,
    title: `${title} | ${siteConfig.brandName}`,
    description,
    type: "article",
    keywords: hi
      ? [
          title,
          "ज्योतिष सीखें",
          "ज्योतिष",
          "कुंडली गाइड",
          "jyotish",
        ]
      : [
          title,
          "learn astrology",
          "astrology",
          "kundli guide",
          "rashifal basics",
        ],
  });
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
  const hi = locale === "hi";
  const title = pickLocale(locale, guide.title);
  const description = pickLocale(locale, guide.description);
  const url = absoluteUrl(locale, `/learn/${slug}`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: hi ? "hi-IN" : "en-IN",
    author: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}/astrologics-icon-512.png`,
      },
    },
    mainEntityOfPage: url,
    url,
  };

  const crumbs = breadcrumbJsonLd(locale, [
    { name: hi ? "होम" : "Home", path: "" },
    { name: hi ? "सीखें" : "Learn", path: "/learn" },
    { name: pickLocale(locale, guide.menuTitle), path: `/learn/${slug}` },
  ]);

  if (slug === "glossary") {
    return (
      <div className="bg-[#faf8f5]">
        <JsonLd data={articleLd} />
        <JsonLd data={crumbs} />
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

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={crumbs} />
      <LearnGuideView guide={guide} locale={locale} />
    </>
  );
}
