import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig, telLink, whatsappLink } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: `${t("title")} | ${siteConfig.brandName}`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/contact`,
      languages: {
        en: `${siteConfig.siteUrl}/en/contact`,
        hi: `${siteConfig.siteUrl}/hi/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow={hi ? "संपर्क" : "Contact"}
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: t("title") },
        ]}
      />
      <div className="container-page max-w-2xl py-10 sm:py-12">
        <GlassCard className="space-y-5">
          <p className="text-sm text-ink-muted">{t("note")}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              href={whatsappLink()}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              {t("whatsappCta")}
            </ButtonLink>
            <ButtonLink href={telLink()} variant="primary">
              <Phone className="h-4 w-4" />
              {t("callCta")}
            </ButtonLink>
          </div>
          <p className="flex items-center gap-2 text-sm text-ink">
            <Mail className="h-4 w-4 text-saffron" />
            <span>
              {t("email")}:{" "}
              <a
                className="text-maroon underline"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </span>
          </p>
          <p className="text-sm text-ink-muted">
            Talk With Us: +{siteConfig.whatsapp} · Phone: {siteConfig.phone}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
