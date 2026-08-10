"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Heart,
  Home,
  Leaf,
  Compass,
  Wallet,
  Sparkles,
  Bot,
  CheckCircle2,
  XCircle,
  Gem,
  Users,
  Brain,
  Shield,
  ArrowRight,
  Hash,
  Palette,
  CalendarDays,
  CircleDot,
  Navigation,
  Flame,
  Mic2,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import {
  HOROSCOPE_SIGNS,
  pickL,
  type HoroscopePeriod,
  type HoroscopeSign,
} from "@/lib/horoscope/signs";
import { getHoroscopeSeo } from "@/lib/horoscope/seo-content";
import { cn } from "@/lib/utils";

const PERIODS: { id: HoroscopePeriod; en: string; hi: string }[] = [
  { id: "daily", en: "Daily", hi: "दैनिक" },
  { id: "weekly", en: "Weekly", hi: "साप्ताहिक" },
  { id: "monthly", en: "Monthly", hi: "मासिक" },
];

const SECTION_META = [
  { key: "love" as const, en: "Love & Relationships", hi: "प्रेम व संबंध", Icon: Heart },
  { key: "career" as const, en: "Career & Work", hi: "करियर व कार्य", Icon: Briefcase },
  { key: "money" as const, en: "Money & Finance", hi: "धन व वित्त", Icon: Wallet },
  { key: "health" as const, en: "Health & Wellbeing", hi: "स्वास्थ्य", Icon: Leaf },
  { key: "family" as const, en: "Family & Home", hi: "परिवार व घर", Icon: Home },
  { key: "outlook" as const, en: "Outlook", hi: "दृष्टिकोण", Icon: Compass },
];

function GlassPanel({
  children,
  className,
  strong,
}: {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/60 shadow-[0_12px_40px_-18px_rgba(240,106,0,0.28)] backdrop-blur-xl",
        strong
          ? "bg-gradient-to-br from-white/90 via-[#fffaf6]/85 to-[#ffe8d4]/55"
          : "bg-white/55",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-saffron/15 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-gold/20 blur-2xl"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Best-effort colour chip from lucky-colour text */
function guessColour(raw: string): string | undefined {
  const s = raw.toLowerCase();
  if (
    s.includes("red") ||
    s.includes("लाल") ||
    s.includes("maroon") ||
    s.includes("मरून")
  )
    return "#e11d48";
  if (
    s.includes("gold") ||
    s.includes("सुनहरा") ||
    s.includes("orange") ||
    s.includes("नारंगी") ||
    s.includes("saffron") ||
    s.includes("केसर")
  )
    return "#f59e0b";
  if (s.includes("green") || s.includes("हरा") || s.includes("sea"))
    return "#16a34a";
  if (
    s.includes("blue") ||
    s.includes("नीला") ||
    s.includes("turquoise") ||
    s.includes("फ़िरोज़ी")
  )
    return "#2563eb";
  if (s.includes("pink") || s.includes("गुलाबी")) return "#ec4899";
  if (
    s.includes("white") ||
    s.includes("सफ़ेद") ||
    s.includes("cream") ||
    s.includes("क्रीम") ||
    s.includes("silver") ||
    s.includes("चाँदी")
  )
    return "#e5e7eb";
  if (s.includes("black") || s.includes("काला") || s.includes("dark"))
    return "#1f2937";
  if (s.includes("yellow") || s.includes("पीला")) return "#eab308";
  if (s.includes("grey") || s.includes("gray") || s.includes("धूसर"))
    return "#9ca3af";
  return undefined;
}

export function HoroscopeSignView({ sign }: { sign: HoroscopeSign }) {
  const locale = useLocale();
  const hi = locale === "hi";
  const [period, setPeriod] = useState<HoroscopePeriod>("daily");
  const name = pickL(locale, sign.name);
  const ruler = pickL(locale, sign.ruler);
  const seo = getHoroscopeSeo(sign.slug);

  const lucky = useMemo(
    () =>
      [
        {
          id: "number",
          label: hi ? "लकी नंबर" : "Lucky number",
          value: sign.luckyNumber,
          Icon: Hash,
          accent: "from-[#ff8a1f]/25 to-[#f06a00]/10",
          iconBg: "bg-saffron text-white",
          featured: true,
        },
        {
          id: "colour",
          label: hi ? "लकी रंग" : "Lucky colour",
          value: pickL(locale, sign.luckyColour),
          Icon: Palette,
          accent: "from-[#ffb347]/30 to-[#ffe0b8]/20",
          iconBg: "bg-[#fff1e6] text-saffron-deep",
          swatch: guessColour(pickL(locale, sign.luckyColour)),
        },
        {
          id: "day",
          label: hi ? "लकी दिन" : "Lucky day",
          value: pickL(locale, sign.luckyDay),
          Icon: CalendarDays,
          accent: "from-sky-100/80 to-white/40",
          iconBg: "bg-sky-50 text-sky-700",
        },
        {
          id: "gem",
          label: hi ? "रत्न" : "Gemstone",
          value: pickL(locale, sign.gemstone),
          Icon: Gem,
          accent: "from-violet-100/70 to-white/40",
          iconBg: "bg-violet-50 text-violet-700",
        },
        {
          id: "metal",
          label: hi ? "धातु" : "Metal",
          value: pickL(locale, sign.metal),
          Icon: CircleDot,
          accent: "from-amber-100/80 to-white/40",
          iconBg: "bg-amber-50 text-amber-800",
        },
        {
          id: "direction",
          label: hi ? "दिशा" : "Direction",
          value: pickL(locale, sign.direction),
          Icon: Navigation,
          accent: "from-emerald-100/70 to-white/40",
          iconBg: "bg-emerald-50 text-emerald-700",
        },
        {
          id: "deity",
          label: hi ? "देवता" : "Deity",
          value: pickL(locale, sign.deity),
          Icon: Flame,
          accent: "from-orange-100/80 to-white/40",
          iconBg: "bg-orange-50 text-orange-700",
          wide: true,
        },
        {
          id: "mantra",
          label: hi ? "मंत्र" : "Mantra",
          value: sign.mantra,
          Icon: Mic2,
          accent: "from-[#ffe8d6]/90 to-white/50",
          iconBg: "bg-[#fff1e6] text-saffron-deep",
          wide: true,
        },
      ] as {
        id: string;
        label: string;
        value: string;
        Icon: LucideIcon;
        accent: string;
        iconBg: string;
        featured?: boolean;
        wide?: boolean;
        swatch?: string;
      }[],
    [hi, locale, sign]
  );

  const todayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(hi ? "hi-IN" : "en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return "";
    }
  }, [hi]);

  return (
    <div className="relative overflow-hidden bg-[#faf8f5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,138,31,0.22),transparent_70%)]"
      />

      <PageHero
        eyebrow={hi ? `${ruler} द्वारा शासित · एआई ज्योतिष` : `Ruled by ${ruler} · AI Jyotish`}
        title={
          hi
            ? `${name} राशिफल — दैनिक, साप्ताहिक व मासिक`
            : `${name} Horoscope — Daily, Weekly & Monthly`
        }
        description={
          seo
            ? pickL(locale, seo.tagline)
            : pickL(locale, sign.summary)
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "राशिफल" : "Horoscope", href: "/horoscope" },
          { label: name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/70 bg-white/50 shadow-sm backdrop-blur-md">
              <ZodiacIcon
                slug={sign.slug}
                className="h-10 w-10"
                colorClassName="bg-saffron"
              />
            </div>
          </div>
        }
      />

      <div className="container-page relative max-w-6xl py-6 sm:py-8">
        {/* AI status strip */}
        <GlassPanel className="mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-saffron to-maroon text-white shadow-md">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] font-bold text-ink">
                {hi ? "एआई गुरु सिग्नल" : "AI Guru signal"}
              </p>
              <p className="text-[11px] text-ink-muted">
                {hi
                  ? `${name} · ${pickL(locale, sign.element)} · ${pickL(locale, sign.quality)} · ${todayLabel}`
                  : `${name} · ${pickL(locale, sign.element)} · ${pickL(locale, sign.quality)} · ${todayLabel}`}
              </p>
            </div>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron/30 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-saffron-deep backdrop-blur hover:bg-[#fff1e6]"
          >
            <Sparkles className="h-3 w-3" />
            {hi ? "व्यक्तिगत प्रश्न पूछें" : "Ask a personal question"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </GlassPanel>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Period tabs */}
            <GlassPanel strong className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="heading-3 font-display text-ink">
                    {hi ? `${name} पूर्वानुमान` : `${name} forecast`}
                  </h2>
                  <p className="text-caption mt-0.5">
                    {hi
                      ? "चंद्र-राशि शैली सामान्य मार्गदर्शन — एआई द्वारा संरचित।"
                      : "Moon-sign style general guidance — structured by AI."}
                  </p>
                </div>
                <div className="inline-flex rounded-xl border border-saffron/20 bg-white/70 p-1 backdrop-blur">
                  {PERIODS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPeriod(p.id)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition sm:px-3.5",
                        period === p.id
                          ? "bg-gradient-to-r from-saffron to-maroon text-white shadow-sm"
                          : "text-ink-muted hover:bg-[#fff1e6]"
                      )}
                    >
                      {hi ? p.hi : p.en}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={period}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-body mt-4 text-ink"
                >
                  {pickL(locale, sign.periodLead[period])}
                </motion.p>
              </AnimatePresence>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SECTION_META.map(({ key, en, hi: hiLabel, Icon }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/70 bg-white/45 p-3.5 backdrop-blur-md transition hover:bg-white/70"
                  >
                    <h3 className="flex items-center gap-2 text-[13px] font-bold text-ink">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#ffe8d6] to-[#ffd4a8] text-saffron-deep">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {hi ? hiLabel : en}
                    </h3>
                    <p className="text-muted mt-2 text-[12.5px] leading-relaxed">
                      {pickL(locale, sign.sections[key])}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Personality SEO block */}
            {seo ? (
              <GlassPanel strong className="p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-saffron-deep" />
                  <h2 className="heading-3 font-display text-ink">
                    {hi
                      ? `${name} व्यक्तित्व व ज्योतिष प्रोफ़ाइल`
                      : `${name} personality & Jyotish profile`}
                  </h2>
                </div>
                <p className="text-body text-ink-muted">
                  {pickL(locale, seo.personality)}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-50/50 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                      {hi ? "शक्तियाँ" : "Strengths"}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {seo.strengths.map((s) => (
                        <li
                          key={pickL(locale, s)}
                          className="flex items-start gap-2 text-[12.5px] text-ink"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          {pickL(locale, s)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-amber-500/15 bg-amber-50/40 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-900">
                      {hi ? "सावधानियाँ" : "Growth edges"}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {seo.challenges.map((s) => (
                        <li
                          key={pickL(locale, s)}
                          className="flex items-start gap-2 text-[12.5px] text-ink"
                        >
                          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                          {pickL(locale, s)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/70 bg-white/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                      {hi ? "शरीर फोकस" : "Body focus"}
                    </p>
                    <p className="mt-1 text-[12.5px] font-semibold text-ink">
                      {pickL(locale, seo.bodyFocus)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white/50 p-3 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                      {hi ? "करियर क्षेत्र" : "Career fields"}
                    </p>
                    <p className="mt-1 text-[12.5px] font-semibold text-ink">
                      {pickL(locale, seo.careerFields)}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ) : null}

            {/* Deep SEO guide */}
            {seo ? (
              <GlassPanel className="p-4 sm:p-5">
                <h2 className="heading-3 font-display text-ink">
                  {hi
                    ? `${name} राशिफल कैसे पढ़ें — पूर्ण गाइड`
                    : `How to read the ${name} horoscope — full guide`}
                </h2>
                <div className="mt-3 space-y-3">
                  {seo.deepGuide.map((para, idx) => (
                    <p key={idx} className="text-body text-ink-muted">
                      {pickL(locale, para)}
                    </p>
                  ))}
                </div>
              </GlassPanel>
            ) : null}

            {/* FAQ */}
            <GlassPanel strong className="p-4 sm:p-5">
              <h2 className="heading-3 font-display text-ink">
                {hi
                  ? `${name} राशिफल — अक्सर पूछे गए प्रश्न`
                  : `${name} horoscope — FAQs`}
              </h2>
              <div className="mt-3 space-y-2">
                {(seo?.faqs ?? []).map((f) => (
                  <details
                    key={pickL(locale, f.q)}
                    className="group rounded-xl border border-white/70 bg-white/50 px-3.5 py-2.5 backdrop-blur open:bg-white/80"
                  >
                    <summary className="cursor-pointer list-none text-[13px] font-semibold text-ink marker:content-none">
                      {pickL(locale, f.q)}
                    </summary>
                    <p className="text-muted mt-2 text-[12.5px]">
                      {pickL(locale, f.a)}
                    </p>
                  </details>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <GlassPanel strong className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                    <Sparkles className="h-3 w-3" />
                    {hi ? "एआई लकी मैट्रिक्स" : "AI Lucky Matrix"}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-muted">
                    {hi
                      ? `${name} के लिए शास्त्रीय संकेत — एआई द्वारा संरचित`
                      : `Classical cues for ${name} — structured by AI`}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-saffron/25 bg-white/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-saffron-deep">
                  {hi ? "लाइव" : "Live"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {lucky.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "relative overflow-hidden rounded-xl border border-white/80 bg-gradient-to-br p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md",
                      item.accent,
                      item.wide && "col-span-2",
                      item.featured && "ring-1 ring-saffron/25"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg shadow-sm",
                          item.iconBg
                        )}
                      >
                        <item.Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/90">
                          {item.label}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          {item.swatch ? (
                            <span
                              className="h-3 w-3 shrink-0 rounded-full border border-black/10 shadow-sm"
                              style={{ background: item.swatch }}
                              aria-hidden
                            />
                          ) : null}
                          <p
                            className={cn(
                              "font-semibold leading-snug text-ink",
                              item.featured
                                ? "font-display text-xl tabular-nums text-saffron-deep"
                                : item.wide
                                  ? "text-[12.5px]"
                                  : "text-[13px]"
                            )}
                          >
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-ink-muted">
                <Bot className="h-3 w-3 text-saffron-deep" />
                {hi
                  ? "सामान्य राशि संकेत · व्यक्तिगत कुंडली से और गहराई"
                  : "General sign cues · deepen with your kundli"}
              </p>
            </GlassPanel>

            <GlassPanel className="p-4">
              <div className="flex items-center gap-2">
                <Gem className="h-4 w-4 text-saffron-deep" />
                <h3 className="text-[13px] font-bold text-ink">
                  {hi ? "शासक ग्रह" : "Ruling planet"}
                </h3>
              </div>
              <p className="mt-1 font-display text-base font-bold text-saffron-deep">
                {ruler}
              </p>
              <p className="text-muted mt-2 text-[12px]">
                {pickL(locale, sign.rulerBlurb)}
              </p>
            </GlassPanel>

            {seo ? (
              <>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-saffron-deep" />
                    <h3 className="text-[13px] font-bold text-ink">
                      {hi ? "अनुकूलता संकेत" : "Compatibility cues"}
                    </h3>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-ink-muted">
                    {hi ? "अच्छा मेल" : "Supportive"}
                  </p>
                  <p className="text-[12.5px] font-semibold text-ink">
                    {pickL(locale, seo.bestMatches)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-ink-muted">
                    {hi ? "धैर्य चाहिए" : "Needs patience"}
                  </p>
                  <p className="text-[12.5px] font-semibold text-ink">
                    {pickL(locale, seo.watchMatches)}
                  </p>
                </GlassPanel>

                <GlassPanel className="p-4">
                  <h3 className="text-[13px] font-bold text-ink">
                    {hi ? "करें / न करें" : "Do / Don’t"}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {seo.doList.map((d) => (
                      <li
                        key={pickL(locale, d)}
                        className="flex gap-2 text-[12px] text-ink"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {pickL(locale, d)}
                      </li>
                    ))}
                    {seo.dontList.map((d) => (
                      <li
                        key={pickL(locale, d)}
                        className="flex gap-2 text-[12px] text-ink"
                      >
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" />
                        {pickL(locale, d)}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>

                <GlassPanel className="p-4">
                  <h3 className="text-[13px] font-bold text-ink">
                    {hi ? "सरल उपाय" : "Simple remedies"}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {seo.remedies.map((r) => (
                      <li
                        key={pickL(locale, r)}
                        className="rounded-lg border border-white/70 bg-white/50 px-2.5 py-2 text-[12px] leading-snug text-ink"
                      >
                        {pickL(locale, r)}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>

                <GlassPanel strong className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-saffron-deep" />
                    <h3 className="text-[13px] font-bold text-ink">
                      {hi ? "एआई गुरु अंतर्दृष्टि" : "AI Guru insight"}
                    </h3>
                  </div>
                  <p className="text-muted mt-2 text-[12px]">
                    {pickL(locale, seo.aiInsight)}
                  </p>
                  <Link href="/chat" className="mt-3 block">
                    <Button type="button" className="w-full !py-2.5 !text-[13px]">
                      {hi ? "एआई गुरु से पूछें" : "Ask AI Guru"}
                    </Button>
                  </Link>
                </GlassPanel>
              </>
            ) : null}
          </aside>
        </div>

        {/* Sign switcher */}
        <GlassPanel strong className="mt-6 p-4 sm:p-5">
          <h2 className="heading-3 font-display text-ink">
            {hi ? "सभी 12 राशियाँ" : "All 12 zodiac signs"}
          </h2>
          <p className="text-muted mt-1">
            {hi
              ? "किसी भी राशि पर क्लिक कर दैनिक–मासिक राशिफल खोलें।"
              : "Tap any sign for its daily–monthly horoscope."}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {HOROSCOPE_SIGNS.map((s) => {
              const active = s.slug === sign.slug;
              return (
                <Link
                  key={s.slug}
                  href={`/horoscope/${s.slug}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center backdrop-blur transition",
                    active
                      ? "border-saffron/45 bg-gradient-to-b from-[#fff1e6] to-white shadow-sm"
                      : "border-white/70 bg-white/45 hover:border-saffron/30 hover:bg-white/80"
                  )}
                >
                  <ZodiacIcon
                    slug={s.slug}
                    className="h-9 w-9"
                    colorClassName={active ? "bg-saffron" : "bg-[#c45a12]/75"}
                  />
                  <span className="text-[11px] font-semibold text-ink">
                    {pickL(locale, s.name)}
                  </span>
                </Link>
              );
            })}
          </div>
        </GlassPanel>

        {/* Bottom CTA */}
        <GlassPanel strong className="mt-6 space-y-3 p-5 text-center sm:p-6">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
            <Bot className="h-3.5 w-3.5" />
            {hi ? "व्यक्तिगत एआई ज्योतिष" : "Personal AI Jyotish"}
          </p>
          <h2 className="heading-2 font-display text-ink">
            {hi
              ? `${name} से आगे — आपकी कुंडली पढ़ें`
              : `Beyond ${name} — read your full kundli`}
          </h2>
          <p className="text-muted mx-auto max-w-xl">
            {hi
              ? "सामान्य राशिफल शुरुआत है। एआई गुरु लग्न, चंद्र, दशा और योग से आप पर केंद्रित उत्तर देता है।"
              : "A sign horoscope is the start. AI Guru answers from your lagna, Moon, dasha and yogas."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Link href="/chat">
              <Button type="button" className="!px-5 !py-2.5">
                {hi ? "एआई गुरु चैट" : "AI Guru chat"}
              </Button>
            </Link>
            <Link href="/kundli">
              <Button type="button" variant="ghost" className="!px-5 !py-2.5">
                {hi ? "मुफ़्त कुंडली" : "Free kundli"}
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
