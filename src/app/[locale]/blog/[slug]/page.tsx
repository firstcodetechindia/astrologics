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
          "वैदिक कुंडली",
          "राशिफल",
          "janam kundali",
        ]
      : [
          post.title,
          "astrology blog",
          "Vedic kundli",
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
    <article className="bg-[#faf8f5]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
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
        }}
      />
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
        <GlassCard className="space-y-4">
          {post.content.map((para, i) => (
            <p key={i} className="leading-relaxed text-ink-muted">
              {para}
            </p>
          ))}
        </GlassCard>
        <Link
          href="/blog"
          className="mt-8 inline-block text-sm font-semibold text-saffron-deep hover:underline"
        >
          ← {hi ? "ब्लॉग" : "Blog"}
        </Link>
      </div>
    </article>
  );
}
