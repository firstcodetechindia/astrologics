"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/lib/site-config";
import { CosmicGPTWordmark } from "@/components/brand/CosmicGPTWordmark";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";
import { SIGNS } from "@/lib/astrology/constants";
import { cn } from "@/lib/utils";

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
      href: "/calculators/prashna-kundli",
      label: hi ? "प्रश्न कुंडली" : "Prashna",
    },
    {
      href: "/calculators/muhurta-electional",
      label: hi ? "मुहूर्त" : "Muhurta",
    },
    {
      href: "/calculators/birth-time-rectification",
      label: hi ? "समय सुधार" : "Rectify time",
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
    { href: "/observatory", label: hi ? "ऑब्ज़र्वेटरी" : "Observatory" },
    { href: "/panchang", label: hi ? "पंचांग" : "Panchang" },
    { href: "/horoscope", label: hi ? "राशिफल" : "Horoscope" },
    { href: "/numerology", label: hi ? "अंक ज्योतिष" : "Numerology" },
    { href: "/vastu", label: hi ? "वास्तु" : "Vastu" },
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
    {
      href: "/methodology",
      label: hi ? "पद्धति" : "Methodology",
    },
    {
      href: "/brand",
      label: hi ? "ब्रांड दिशानिर्देश" : "Brand Guidelines",
    },
    { href: "/contact", label: n("contact") },
    { href: "/faq", label: n("faq") },
    { href: "/services", label: n("services") },
    { href: "/features", label: n("features") },
    {
      href: "/astrologer/signup",
      label: hi ? "ज्योतिषी साइन अप" : "Astrologer Sign Up",
    },
  ] as const;

  return (
    <footer className="relative mt-0 overflow-hidden border-t border-white/[0.08] bg-[#0B0F1F]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/images/Zodiac.jpg)",
          backgroundRepeat: "repeat",
          backgroundSize: "480px auto",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(108,60,255,0.14),transparent_55%)]"
      />

      <div className="container-page relative z-10 py-8 sm:py-10">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CosmicGPTWordmark showTagline width={252} />
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cosmic-purple px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {hi ? "हमसे बात करें" : "Talk With Us"}
              </a>
              <a
                href={telLink()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cosmic-purple/45 bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-cosmic-gold"
              >
                <Phone className="h-3.5 w-3.5" />
                {hi ? "कॉल" : "Call"}
              </a>
            </div>
          </div>
          <p className="mt-3 w-full text-[13px] leading-relaxed text-ink-muted">
            {hi
              ? "सटीक ऑनलाइन ज्योतिष के लिए आपका AI-संचालित विश्वसनीय मंच। विवाह, प्रेम, करियर और स्वास्थ्य पर मार्गदर्शन के लिए भारत के शीर्ष ज्योतिषियों से चैट करें — साथ ही कुंडली विश्लेषण, अंक ज्योतिष, एआई ज्योतिष और वैदिक मार्गदर्शन, जिस पर हज़ारों लोग भरोसा करते हैं।"
              : "Your AI-powered trusted platform for accurate online astrology. Chat with top Indian astrologers for insights on marriage, love, career, and health — plus Kundli analysis, Numerology, AI Astrology, and Vedic guidance trusted by thousands."}
          </p>
        </div>

        <div className="grid grid-cols-4 py-6">
          <FooterCol
            title={hi ? "ज्योतिष" : "Astrology"}
            className="border-r border-white/[0.08] pr-2.5 sm:pr-5"
          >
            {astrology.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol
            title={hi ? "सीखें" : "Learn"}
            className="border-r border-white/[0.08] px-2.5 sm:px-5"
          >
            {learn.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol
            title={hi ? "उपकरण" : "Tools"}
            className="border-r border-white/[0.08] px-2.5 sm:px-5"
          >
            {tools.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </FooterCol>
          <FooterCol
            title={hi ? "कंपनी" : "Company"}
            className="pl-2.5 sm:pl-5"
          >
            {company.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-0.5 flex flex-col items-start gap-1 text-[11px] leading-snug text-ink-muted transition hover:text-cosmic-gold sm:flex-row sm:items-center sm:gap-1.5 sm:text-[13px]"
              >
                <Mail className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                <span className="max-w-full break-all">{siteConfig.email}</span>
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="border-t border-white/[0.08] pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-cosmic-gold">
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
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-cosmic-gold hover:underline"
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
                  className="group flex flex-col items-center gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-1.5 py-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-cosmic-purple/50 hover:bg-cosmic-purple/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-purple/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cosmic-purple/15 ring-1 ring-cosmic-purple/25 transition group-hover:bg-cosmic-purple/25 group-hover:ring-cosmic-purple/45">
                    <ZodiacIcon
                      slug={slug}
                      className="h-5 w-5"
                      colorClassName="bg-[#FFC857]"
                    />
                  </span>
                  <span className="text-[10px] font-semibold leading-tight text-white/90 group-hover:text-cosmic-gold sm:text-[11px]">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/[0.08] pt-4 text-center text-[11px] text-ink-muted sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:text-left sm:text-[12px]">
          <div className="min-w-0 max-w-xl">
            <p
              className="font-medium leading-relaxed text-white/80"
              suppressHydrationWarning
            >
              © {year} {siteConfig.brandName}. {t("rights")}
            </p>
            <p className="mt-1 leading-relaxed">{t("disclaimer")}</p>
          </div>
          <nav
            aria-label={hi ? "कानूनी" : "Legal"}
            className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start"
          >
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center py-1 font-medium text-white/75 transition hover:text-cosmic-gold"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center py-1 font-medium text-white/75 transition hover:text-cosmic-gold"
            >
              {t("privacy")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white sm:text-[11px]">
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
        className="text-[12px] text-ink-muted transition hover:text-cosmic-gold sm:text-[13px]"
      >
        {label}
      </Link>
    </li>
  );
}
