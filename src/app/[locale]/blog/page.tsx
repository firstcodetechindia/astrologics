import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPosts } from "@/lib/blog";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/blog",
    title: hi
      ? "ज्योतिष ब्लॉग — कुंडली, दशा व उपाय गाइड"
      : "Astrology Blog — Kundli, Dasha & Remedy Guides",
    description: hi
      ? "वैदिक कुंडली, लग्न बनाम राशि, विंशोत्तरी दशा और उपाय पर गहन गाइड — शांत भाषा में, हिंदी व अंग्रेज़ी।"
      : "In-depth guides on Vedic kundli, Lagna vs Moon sign, Vimshottari dasha and remedies — calm language, English & Hindi.",
    keywords: hi
      ? [
          "ज्योतिष ब्लॉग",
          "कुंडली गाइड",
          "राशिफल लेख",
          "ज्योतिष",
          "astrology blog",
        ]
      : [
          "astrology blog",
          "kundli guide",
          "rashifal articles",
          "astrology blog",
          "gun milan explained",
        ],
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tn = await getTranslations("nav");
  const posts = getPosts(locale as "en" | "hi");
  const hi = locale === "hi";

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: tn("blog"), path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow={hi ? "ब्लॉग" : "Blog"}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: tn("blog") },
        ]}
      />
      <div className="container-page py-6 sm:py-8">
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <GlassCard key={post.slug}>
              <p className="text-xs text-ink-muted">{post.date}</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-maroon">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-saffron-deep hover:underline"
              >
                {t("readMore")} →
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
