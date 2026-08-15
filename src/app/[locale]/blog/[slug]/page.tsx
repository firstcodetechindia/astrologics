import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPost, getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";
import { Link } from "@/i18n/navigation";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  personAuthorJsonLd,
} from "@/lib/seo/page-meta";

export function generateStaticParams() {
  return getPosts("en")
    .concat(getPosts("hi"))
    .map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug, locale as "en" | "hi");
  if (!post) return { title: "Not found" };
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | ${siteConfig.brandName}`,
    description: post.description,
    type: "article",
    keywords: hi
      ? [
          post.title,
          "ज्योतिष ब्लॉग",
          "जन्म कुंडली",
          "राशिफल",
          "janam kundali",
        ]
      : [
          post.title,
          "astrology blog",
          "kundli",
          "rashifal",
          "jyotish guide",
        ],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug, locale as "en" | "hi");
  if (!post) notFound();
  const hi = locale === "hi";
  const url = absoluteUrl(locale, `/blog/${slug}`);

  return (
    <article className="bg-cosmic-navy">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: "2026-08-11",
          inLanguage: hi ? "hi-IN" : "en-IN",
          author: {
            "@type": "Person",
            name: `${siteConfig.brandName} Editorial`,
            url: `${siteConfig.siteUrl}/en/about`,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.brandName,
            url: siteConfig.siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.siteUrl}${siteConfig.brandIcon}`,
            },
          },
          mainEntityOfPage: url,
          url,
        }}
      />
      <JsonLd data={personAuthorJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "ब्लॉग" : "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />
      <PageHero
        eyebrow={post.date}
        title={post.title}
        description={post.description}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "ब्लॉग" : "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <div className="container-page max-w-3xl py-6 sm:py-8">
        <p className="mb-4 text-sm text-ink-muted">
          {hi ? "समीक्षा: 11 Aug 2026" : "Reviewed: 11 Aug 2026"} ·{" "}
          {siteConfig.brandName} Editorial
        </p>
        <GlassCard className="space-y-4">
          {post.content.map((para, i) => (
            <p key={i} className="leading-relaxed text-ink-muted">
              {para}
            </p>
          ))}
        </GlassCard>
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/kundli" className="text-saffron-deep hover:underline">
            {hi ? "मुफ्त कुंडली →" : "Free kundli →"}
          </Link>
          <Link href="/chat-with-astrologer" className="text-saffron-deep hover:underline">
            {hi ? "ज्योतिषी से चैट →" : "Chat with astrologer →"}
          </Link>
          <Link
            href="/blog"
            className="text-saffron-deep hover:underline"
          >
            ← {hi ? "ब्लॉग" : "Blog"}
          </Link>
        </div>
      </div>
    </article>
  );
}
