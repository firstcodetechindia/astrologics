import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: `${t("title")} | ${siteConfig.brandName}`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/services`,
      languages: {
        en: `${siteConfig.siteUrl}/en/services`,
        hi: `${siteConfig.siteUrl}/hi/services`,
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const hi = locale === "hi";

  const items = [
    { title: t("s1Title"), text: t("s1Text") },
    { title: t("s2Title"), text: t("s2Text") },
    { title: t("s3Title"), text: t("s3Text") },
    { title: t("s4Title"), text: t("s4Text") },
  ];

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow={hi ? "सेवाएँ" : "Services"}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
        actions={
          <ButtonLink
            href={whatsappLink("Namaste, I want to book a consultation.")}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            {t("cta")}
          </ButtonLink>
        }
      />
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <GlassCard key={item.title}>
              <h2 className="font-display text-xl font-semibold text-maroon">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {item.text}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
