import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { CALCULATORS, getCalculator } from "@/lib/calculators/catalog";
import { getCalcContent } from "@/lib/calculators/content";
import { CalculatorPageView } from "@/components/calculators/CalculatorPageView";
import { siteConfig } from "@/lib/site-config";

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
  const title = locale === "hi" ? content.h1.hi : content.h1.en;
  const description = locale === "hi" ? content.intro.hi : content.intro.en;
  return {
    title: `${title} | ${siteConfig.brandName}`,
    description: description.slice(0, 160),
  };
}

export default async function CalculatorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) notFound();
  const content = getCalcContent(slug);
  return <CalculatorPageView meta={meta} content={content} />;
}
