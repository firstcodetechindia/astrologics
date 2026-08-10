"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/lib/site-config";
import { AstrologicsLogo } from "@/components/brand/AstrologicsLogo";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const locale = useLocale();
  const hi = locale === "hi";
  const year = new Date().getFullYear();

  const explore = [
    { href: "/kundli", label: n("kundli") },
    { href: "/horoscope", label: hi ? "राशिफल" : "Horoscope" },
    { href: "/chat", label: n("chat") },
    { href: "/calculators", label: n("calculators") },
    { href: "/features", label: n("features") },
  ] as const;

  const tools = [
    {
      href: "/calculators/today-panchang",
      label: hi ? "पंचांग" : "Panchang",
    },
    {
      href: "/calculators/choghadiya",
      label: hi ? "चौघड़िया" : "Choghadiya",
    },
    {
      href: "/calculators/kundli-matching",
      label: hi ? "गुण मिलान" : "Gun Milan",
    },
    {
      href: "/calculators/moon-sign",
      label: hi ? "चंद्र राशि" : "Moon Sign",
    },
    {
      href: "/calculators/love-calculator",
      label: hi ? "लव कैलकुलेटर" : "Love Calculator",
    },
  ] as const;

  const learn = [
    { href: "/learn", label: hi ? "ज्योतिष सीखें" : "Learn astrology" },
    {
      href: "/horoscope",
      label: hi ? "आज का राशिफल" : "Today’s horoscope",
    },
    {
      href: "/learn/zodiac",
      label: hi ? "राशियाँ" : "Zodiac signs",
    },
    {
      href: "/learn/glossary",
      label: hi ? "शब्दावली" : "Glossary",
    },
    { href: "/blog", label: n("blog") },
  ] as const;

  const company = [
    { href: "/about", label: n("about") },
    { href: "/services", label: n("services") },
    { href: "/faq", label: n("faq") },
    { href: "/contact", label: n("contact") },
    { href: "/pricing", label: n("pricing") },
  ] as const;

  return (
    <footer className="relative mt-4 overflow-hidden border-t border-saffron/20 sm:mt-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "url(/images/Zodiac.jpg)",
          backgroundRepeat: "repeat",
          backgroundSize: "480px auto",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff7f0] to-[#ffe8d0]"
      />

      <div className="container-page relative z-10 py-7 sm:py-8">
        {/* Brand + CTAs — one compact row */}
        <div className="flex flex-col gap-3 border-b border-saffron/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <AstrologicsLogo className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-base font-bold leading-tight text-ink">
                {siteConfig.brandName}
              </p>
              <p className="truncate text-[12px] text-ink-muted">{t("tagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-deep px-3 py-1.5 text-[12px] font-semibold text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {hi ? "हमसे बात करें" : "Talk With Us"}
            </a>
            <a
              href={telLink()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-saffron/30 bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-saffron-deep"
            >
              <Phone className="h-3.5 w-3.5" />
              {hi ? "कॉल" : "Call"}
            </a>
          </div>
        </div>

        {/* Link columns — tighter */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 py-5 lg:grid-cols-4 lg:gap-5">
          <FooterCol title={t("colExplore")}>
            {explore.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={t("colTools")}>
            {tools.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={t("colLearn")}>
            {learn.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={t("colConnect")}>
            {company.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition hover:text-saffron-deep"
              >
                <Mail className="h-3 w-3 shrink-0 opacity-70" />
                <span className="truncate">{siteConfig.email}</span>
              </a>
            </li>
          </FooterCol>
        </div>

        {/* Compact rashi strip */}
        <div className="flex items-center gap-2 border-t border-saffron/15 pt-3">
          <div className="grid flex-1 grid-cols-6 gap-0.5 sm:grid-cols-12">
            {ZODIAC_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/horoscope/${slug}`}
                className="flex items-center justify-center rounded-md py-1 transition hover:bg-white/50"
                title={slug}
              >
                <ZodiacIcon
                  slug={slug}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  colorClassName="bg-[#c45a12]/65"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex flex-col gap-1 border-t border-saffron/15 pt-3 text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-[12px]">
          <p className="leading-snug">{t("disclaimer")}</p>
          <p className="shrink-0 font-medium text-ink/75">
            © {year} {siteConfig.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-ink-muted transition hover:text-saffron-deep"
      >
        {label}
      </Link>
    </li>
  );
}
