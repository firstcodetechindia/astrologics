import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import {
  GLOSSARY_TERM_SLUGS,
  getGlossaryTerm,
  glossaryTermArticle,
} from "@/lib/learn/glossary";
import { siteConfig } from "@/lib/site-config";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  personAuthorJsonLd,
} from "@/lib/seo/page-meta";

export function generateStaticParams() {
  return GLOSSARY_TERM_SLUGS.map((term) => ({ term }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const locale = await getLocale();
  const record = getGlossaryTerm(slug);
  if (!record) return {};
  const hi = locale === "hi";
  const name = hi ? record.term.hi : record.term.en;
  const def = hi ? record.definition.hi : record.definition.en;

  return buildPageMetadata({
    locale,
    path: `/learn/glossary/${slug}`,
    title: hi
      ? `${name} अर्थ — ज्योतिष शब्दावली | ${siteConfig.brandName}`
      : `What is ${record.term.en}? Astrology Glossary | ${siteConfig.brandName}`,
    description: def.slice(0, 160),
    type: "article",
    keywords: hi
      ? [name, "ज्योतिष शब्दावली", "कुंडली शब्द", record.term.en]
      : [record.term.en, "astrology glossary", "jyotish term", "kundli meaning"],
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const locale = await getLocale();
  const record = getGlossaryTerm(slug);
  if (!record) notFound();

  const hi = locale === "hi";
  const name = hi ? record.term.hi : record.term.en;
  const paragraphs = glossaryTermArticle(record, locale);
  const url = absoluteUrl(locale, `/learn/glossary/${slug}`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: hi ? `${name} — ज्योतिष अर्थ` : `What is ${record.term.en}?`,
    description: hi ? record.definition.hi : record.definition.en,
    url,
    inLanguage: hi ? "hi-IN" : "en-IN",
    dateModified: "2026-08-11",
    author: {
      "@type": "Person",
      name: `${siteConfig.brandName} Editorial`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "सीखें" : "Learn", path: "/learn" },
          { name: hi ? "शब्दावली" : "Glossary", path: "/learn/glossary" },
          { name: name, path: `/learn/glossary/${slug}` },
        ])}
      />
      <JsonLd data={articleLd} />
      <JsonLd data={personAuthorJsonLd()} />
      <PageHero
        eyebrow={hi ? "शब्दावली" : "Glossary"}
        title={name}
        description={hi ? record.definition.hi : record.definition.en}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "सीखें" : "Learn", href: "/learn" },
          { label: hi ? "शब्दावली" : "Glossary", href: "/learn/glossary" },
          { label: name },
        ]}
      />
      <article className="container-page max-w-3xl py-8 sm:py-10">
        <p className="text-sm text-ink-muted">
          {hi ? "समीक्षा तिथि: 11 Aug 2026" : "Reviewed: 11 Aug 2026"} ·{" "}
          {siteConfig.brandName} Editorial
        </p>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/kundli" className="text-saffron-deep hover:underline">
            {hi ? "मुफ्त कुंडली →" : "Free kundli →"}
          </Link>
          <Link href="/calculators" className="text-saffron-deep hover:underline">
            {hi ? "कैलकुलेटर →" : "Calculators →"}
          </Link>
          <Link href="/learn/glossary" className="text-saffron-deep hover:underline">
            {hi ? "पूरी शब्दावली →" : "Full glossary →"}
          </Link>
        </div>
      </article>
    </div>
  );
}
