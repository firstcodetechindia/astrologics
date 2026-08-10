import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { ContactCTA } from "@/components/kundli/ContactCTA";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} | ${siteConfig.brandName}`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/about`,
      languages: {
        en: `${siteConfig.siteUrl}/en/about`,
        hi: `${siteConfig.siteUrl}/hi/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const home = await getTranslations("home");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow={siteConfig.brandName}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
      />
      <div className="container-page max-w-3xl space-y-8 py-10 sm:py-12">
        <GlassCard className="space-y-4 text-ink-muted leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </GlassCard>
        <ContactCTA title={home("ctaBandTitle")} text={home("ctaBandText")} />
      </div>
    </div>
  );
}
