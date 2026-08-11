"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/lib/site-config";
import { AstrologicsLogo } from "@/components/brand/AstrologicsLogo";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";
import { SIGNS } from "@/lib/astrology/constants";
import { ArrowRight } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const locale = useLocale();
  const hi = locale === "hi";
  const year = new Date().getFullYear();

  const astrology = [
    { href: "/kundli", label: hi ? "मुफ्त कुंडली" : "Free Kundli" },
    {
      href: "/calculators/kundli-matching",
      label: hi ? "कुंडली मिलान" : "Kundli Matching",
    },
    {
      href: "/calculators/moon-sign",
      label: hi ? "चंद्र राशि" : "Moon Sign",
    },
    { href: "/calculators/lagna", label: hi ? "लग्न" : "Lagna" },
    {
      href: "/calculators/nakshatra",
      label: hi ? "नक्षत्र" : "Nakshatra",
    },
    {
      href: "/calculators/vimshottari-dasha",
      label: hi ? "दशा" : "Dasha",
    },
    {
      href: "/calculators/sade-sati",
      label: hi ? "साढ़े साती" : "Sade Sati",
    },
    {
      href: "/calculators/mangal-dosha",
      label: hi ? "मंगल दोष" : "Mangal Dosha",
    },
  ] as const;

  const learn = [
    { href: "/learn", label: hi ? "सभी गाइड" : "All Guides" },
    { href: "/learn/zodiac", label: hi ? "राशियाँ" : "Zodiac Signs" },
    { href: "/learn/western", label: hi ? "पश्चिमी ज्योतिष" : "Western Astrology" },
    { href: "/learn/kp-astrology", label: hi ? "केपी ज्योतिष" : "KP Astrology" },
    { href: "/learn/numerology", label: hi ? "अंक ज्योतिष" : "Numerology" },
    { href: "/learn/dasha", label: hi ? "दशा" : "Dashas" },
    {
      href: "/learn/glossary",
      label: hi ? "शब्दावली" : "Glossary",
    },
    {
      href: "/learn/life-insights",
      label: hi ? "कुंडली गाइड" : "Kundli Guide",
    },
  ] as const;

  const tools = [
    { href: "/calculators", label: hi ? "सभी कैलकुलेटर" : "All Calculators" },
    { href: "/panchang", label: hi ? "पंचांग" : "Panchang" },
    { href: "/horoscope", label: hi ? "राशिफल" : "Horoscope" },
    { href: "/chat", label: hi ? "एआई गुरु" : "AI Guru" },
    {
      href: "/chat-with-astrologer",
      label: hi ? "ज्योतिषी से चैट" : "Chat with Astrologer",
    },
    { href: "/kundli", label: hi ? "जन्म कुंडली" : "Birth Chart" },
    { href: "/blog", label: n("blog") },
  ] as const;

  const company = [
    { href: "/about", label: n("about") },
    { href: "/contact", label: n("contact") },
    { href: "/faq", label: n("faq") },
    { href: "/services", label: n("services") },
    { href: "/features", label: n("features") },
    {
      href: "/astrologer/signup",
      label: hi ? "ज्योतिषी साइन अप" : "Astrologer Sign Up",
    },
    {
      href: "/astrologer/signin",
      label: hi ? "ज्योतिषी साइन इन" : "Astrologer Sign In",
    },
  ] as const;

  return (
    <footer className="relative mt-0 overflow-hidden border-t border-saffron/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
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

      <div className="container-page relative z-10 py-8 sm:py-10">
        <div className="flex flex-col gap-3 border-b border-saffron/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 py-6 lg:grid-cols-4 lg:gap-6">
          <FooterCol title={hi ? "ज्योतिष" : "Astrology"}>
            {astrology.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={hi ? "सीखें" : "Learn"}>
            {learn.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={hi ? "उपकरण" : "Tools"}>
            {tools.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol title={hi ? "कंपनी" : "Company"}>
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

        <div className="border-t border-saffron/15 pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                {hi ? "आज का राशिफल" : "Today’s Horoscope"}
              </p>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                {hi
                  ? "अपनी राशि चुनें — टैप करके पढ़ें"
                  : "Choose your sign — tap to read"}
              </p>
            </div>
            <Link
              href="/horoscope"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी राशिफल" : "All horoscopes"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {ZODIAC_SLUGS.map((slug, i) => {
              const label = hi ? SIGNS[i].hi : SIGNS[i].en;
              return (
                <Link
                  key={slug}
                  href={`/horoscope/${slug}`}
                  aria-label={
                    hi ? `${label} राशिफल` : `${label} horoscope`
                  }
                  className="group flex flex-col items-center gap-1 rounded-xl border border-saffron/20 bg-white/90 px-1.5 py-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-saffron-deep/45 hover:bg-[#fff1e6] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-deep/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e6] ring-1 ring-saffron/20 transition group-hover:bg-saffron-deep/10 group-hover:ring-saffron/40">
                    <ZodiacIcon
                      slug={slug}
                      className="h-5 w-5"
                      colorClassName="bg-[#c45a12]"
                    />
                  </span>
                  <span className="text-[10px] font-semibold leading-tight text-ink group-hover:text-saffron-deep sm:text-[11px]">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-saffron/15 pt-4 text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-[12px]">
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
