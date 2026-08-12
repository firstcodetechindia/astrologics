import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Calculator,
  CalendarDays,
  Globe2,
  HeartHandshake,
  MessageCircle,
  ScrollText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SIGNS } from "@/lib/astrology/constants";
import { LivePanchangPeek } from "./LivePanchangPeek";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";

type Loc = { en: string; hi: string };

export type PanchangPeek = {
  weekday: Loc;
  paksha: Loc;
  tithi: Loc;
  nakshatra: Loc;
  yoga: Loc;
  karana: Loc;
  moonSign: Loc;
};

function tx(locale: string, v: Loc | string) {
  if (typeof v === "string") return v;
  return locale === "hi" ? v.hi : v.en;
}

function PanelHeader({
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tone: "features" | "tools" | "learn";
}) {
  const tones = {
    features: "bg-cosmic-purple/15 text-saffron-deep",
    tools: "bg-surface text-saffron-deep ring-1 ring-saffron/20",
    learn: "bg-ink/[0.05] text-maroon",
  };
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold leading-tight text-ink">{title}</h3>
        <p className="mt-0.5 text-[12px] text-ink-muted">{subtitle}</p>
      </div>
    </div>
  );
}

export function HomeExplore({
  locale,
  brand,
  panchang,
}: {
  locale: string;
  brand: string;
  panchang: PanchangPeek;
}) {
  const hi = locale === "hi";

  const features: { href: string; icon: LucideIcon; label: string }[] = [
    { href: "/chat", icon: Bot, label: hi ? "एआई चैट" : "AI Chat" },
    { href: "/kundli", icon: ScrollText, label: hi ? "जन्म कुंडली" : "Birth Chart" },
    {
      href: "/calculators/kundli-matching",
      icon: HeartHandshake,
      label: hi ? "कुंडली मिलान" : "Kundli Matching",
    },
    {
      href: "/panchang",
      icon: CalendarDays,
      label: hi ? "दैनिक पंचांग" : "Daily Panchang",
    },
    { href: "/features", icon: Globe2, label: hi ? "हिंदी व अंग्रेज़ी" : "Hindi & English" },
    {
      href: "/pricing",
      icon: MessageCircle,
      label: hi ? "व्यक्तिगत परामर्श" : "Personal reading",
    },
  ];

  const calculators = [
    { href: "/calculators/moon-sign", label: hi ? "चंद्र राशि" : "Moon Sign" },
    { href: "/calculators/sun-sign", label: hi ? "सूर्य राशि" : "Sun Sign" },
    { href: "/numerology", label: hi ? "अंक ज्योतिष" : "Numerology" },
    { href: "/vastu", label: hi ? "वास्तु" : "Vastu" },
    {
      href: "/calculators/kundli-matching",
      label: hi ? "कुंडली मिलान" : "Kundli Matching",
    },
    { href: "/calculators/mangal-dosha", label: hi ? "मंगल दोष" : "Mangal Dosha" },
  ];

  const learn = [
    { href: "/learn/zodiac", label: hi ? "राशियाँ" : "Zodiac" },
    { href: "/learn/planets", label: hi ? "ग्रह" : "Planets" },
    { href: "/learn/houses", label: hi ? "भाव" : "Houses" },
    { href: "/numerology", label: hi ? "अंक ज्योतिष" : "Numerology" },
    { href: "/vastu", label: hi ? "वास्तु" : "Vastu" },
    { href: "/learn", label: hi ? "सभी गाइड" : "All guides" },
  ];

  return (
    <section className="border-y border-white/10 bg-cosmic-navy py-12 sm:py-16 md:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:max-w-xl sm:text-left">
          <h2 className="heading-1 font-display tracking-tight text-ink">
            {hi ? "खोजें" : "Explore"}{" "}
            <span className="text-saffron-deep">{brand}</span>
          </h2>
          <p className="text-muted mt-3">
            {hi
              ? "दैनिक पंचांग, मुफ्त कैलकुलेटर और मार्गदर्शिका — झलक देखें, फिर गहराई में जाएँ।"
              : "A daily almanac, free calculators, and guides — take a peek, then dive in."}
          </p>
        </div>

        {/* 4 columns — same shell so Panchang matches Features/Tools/Learn */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
          <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 shadow-[0_8px_24px_-20px_rgba(42,33,24,0.35)]">
            <LivePanchangPeek locale={locale} panchang={panchang} />
          </article>

          {/* Features */}
          <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 shadow-[0_8px_24px_-20px_rgba(42,33,24,0.35)]">
            <PanelHeader
              icon={Sparkles}
              title={hi ? "विशेषताएँ" : "Features"}
              subtitle={hi ? "हम क्या कर सकते हैं" : "What we can do"}
              tone="features"
            />
            <ul className="mt-4 flex-1 space-y-0.5">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.href}>
                    <Link
                      href={f.href}
                      className="flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-[13px] font-medium text-ink transition hover:bg-cosmic-purple/15 hover:text-saffron-deep"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cosmic-purple/15 text-saffron-deep">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {f.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/features"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी विशेषताएँ देखें" : "Explore features"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          {/* Calculators */}
          <article className="flex h-full flex-col rounded-2xl border border-dashed border-saffron/30 bg-surface p-4 sm:p-5">
            <PanelHeader
              icon={Calculator}
              title={hi ? "कैलकुलेटर" : "Calculators"}
              subtitle={hi ? "मुफ्त त्वरित उपकरण" : "Free instant tools"}
              tone="tools"
            />
            <ul className="mt-4 flex-1 space-y-0.5">
              {calculators.map((c, i) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center gap-3 rounded-xl px-1.5 py-2 text-[13px] font-medium text-ink transition hover:bg-surface hover:text-saffron-deep"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-[11px] font-bold tabular-nums text-ink-muted ring-1 ring-black/[0.05]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/calculators"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी कैलकुलेटर" : "All calculators"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          {/* Learn */}
          <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 shadow-[0_8px_24px_-20px_rgba(42,33,24,0.35)]">
            <PanelHeader
              icon={BookOpen}
              title={hi ? "ज्योतिष सीखें" : "Learn Astrology"}
              subtitle={hi ? "मार्गदर्शिका व मूल बातें" : "Guides & fundamentals"}
              tone="learn"
            />
            <ul className="mt-4 flex-1 space-y-0.5 border-l-2 border-saffron/25 pl-3">
              {learn.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-r-xl px-2 py-2 text-[13px] font-medium text-ink transition hover:bg-cosmic-purple/15 hover:text-saffron-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/learn"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सीखना शुरू करें" : "Start learning"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        </div>

        {/* Today's signs */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-surface p-5 shadow-[0_8px_24px_-20px_rgba(42,33,24,0.3)] sm:mt-6 sm:p-6 md:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="heading-2 font-display text-ink">
                {hi ? "आज की ज्योतिष भविष्यवाणी" : "Today’s Astrology Prediction"}
              </h3>
              <p className="text-muted mt-1">
                {hi
                  ? `आज चंद्र राशि: ${tx(locale, panchang.moonSign)} — अपनी जन्म राशि चुनें।`
                  : `Moon is in ${tx(locale, panchang.moonSign)} today — pick your birth sign.`}
              </p>
            </div>
            <Link
              href="/horoscope"
              className="shrink-0 text-[13px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी राशि →" : "All signs →"}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
            {SIGNS.map((sign, i) => (
              <Link
                key={sign.en}
                href={`/horoscope/${ZODIAC_SLUGS[i]}`}
                className="group/sign flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition hover:-translate-y-0.5"
              >
                <span className="grid place-items-center transition-transform duration-300 group-hover/sign:scale-110">
                  <ZodiacIcon
                    index={i}
                    className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
                    colorClassName="bg-cosmic-gold"
                  />
                </span>
                <span className="text-[12px] font-semibold leading-tight text-ink transition-colors group-hover/sign:text-saffron-deep sm:text-[13px]">
                  {hi ? sign.hi : sign.en}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
