import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BirthForm } from "@/components/kundli/BirthForm";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kundliForm" });
  return {
    title: `${t("title")} | ${siteConfig.brandName}`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/kundli`,
      languages: {
        en: `${siteConfig.siteUrl}/en/kundli`,
        hi: `${siteConfig.siteUrl}/hi/kundli`,
      },
    },
  };
}

export default async function KundliPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kundliForm");
  const tc = await getTranslations("nav");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow="Kundli"
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: tc("kundli") },
        ]}
      />
      <div className="container-page py-6 sm:py-8">
        <BirthForm />
      </div>
    </div>
  );
}
