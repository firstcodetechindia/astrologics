import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig, telLink, whatsappLink } from "@/lib/site-config";
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
    path: "/contact",
    title: hi
      ? `संपर्क — कुंडली परामर्श व एआई ज्योतिष सहायता | ${siteConfig.brandName}`
      : `Contact — Kundli Consultation & AI Astrology Help | ${siteConfig.brandName}`,
    description: hi
      ? "CosmicGPT से संपर्क करें — जन्म कुंडली परामर्श, गुण मिलान, राशिफल व एआई गुरु सहायता हेतु व्हाट्सऐप, कॉल या ईमेल।"
      : "Contact CosmicGPT — WhatsApp, call or email for kundli consultation, gun milan, rashifal and AI Guru support.",
    keywords: hi
      ? [
          "कुंडली परामर्श संपर्क",
          "ज्योतिष सलाह",
          "CosmicGPT संपर्क",
          "gun milan consultation",
        ]
      : [
          "kundli consultation contact",
          "astrology advice",
          "astrology WhatsApp",
          "CosmicGPT contact",
          "gun milan help",
        ],
  });
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
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: t("title"), path: "/contact" },
        ])}
      />
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
