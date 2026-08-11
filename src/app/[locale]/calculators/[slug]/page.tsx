import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { CALCULATORS, getCalculator } from "@/lib/calculators/catalog";
import { getCalcContent } from "@/lib/calculators/content";
import { CalculatorPageView } from "@/components/calculators/CalculatorPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
  softwareAppJsonLd,
} from "@/lib/seo/page-meta";

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculator(slug);
  const content = getCalcContent(slug);
  if (!meta) return {};
  const locale = await getLocale();
  const hi = locale === "hi";
  const title = content.seoTitle
    ? hi
      ? content.seoTitle.hi
      : content.seoTitle.en
    : `${hi ? content.h1.hi : content.h1.en} | Free Astrology Tool`;
  const description = content.seoDescription
    ? hi
      ? content.seoDescription.hi
      : content.seoDescription.en
    : hi
      ? content.intro.hi
      : content.intro.en;
  const name = locale === "hi" ? meta.title.hi : meta.title.en;

  return buildPageMetadata({
    locale,
    path: `/calculators/${slug}`,
    title,
    description,
    keywords: [
      name,
      `free ${meta.title.en} online`,
      "astrology calculator",
      "free kundli tools",
      locale === "hi" ? "मुफ़्त ज्योतिष कैलकुलेटर" : "free astrology calculator",
    ],
  });
}

export default async function CalculatorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const meta = getCalculator(slug);
  if (!meta) notFound();
  const content = getCalcContent(slug);
  const name = locale === "hi" ? content.h1.hi : content.h1.en;
  const intro = locale === "hi" ? content.intro.hi : content.intro.en;
  const url = absoluteUrl(locale, `/calculators/${slug}`);

  const faqs = content.faqs.map((f) => ({
    q: locale === "hi" ? f.q.hi : f.q.en,
    a: locale === "hi" ? f.a.hi : f.a.en,
  }));

  return (
    <>
      <JsonLd
        data={softwareAppJsonLd({ name, description: intro, url })}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "hi" ? "होम" : "Home", path: "" },
          {
            name: locale === "hi" ? "कैलकुलेटर" : "Calculators",
            path: "/calculators",
          },
          { name, path: `/calculators/${slug}` },
        ])}
      />
      <CalculatorPageView meta={meta} content={content} />
    </>
  );
}
