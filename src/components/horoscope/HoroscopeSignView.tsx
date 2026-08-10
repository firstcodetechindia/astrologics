"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  Briefcase,
  Heart,
  Home,
  Leaf,
  Compass,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import {
  HOROSCOPE_FAQS,
  HOROSCOPE_SIGNS,
  pickL,
  type HoroscopePeriod,
  type HoroscopeSign,
} from "@/lib/horoscope/signs";
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

export function HoroscopeSignView({ sign }: { sign: HoroscopeSign }) {
  const locale = useLocale();
  const hi = locale === "hi";
  const [period, setPeriod] = useState<HoroscopePeriod>("daily");
  const name = pickL(locale, sign.name);
  const ruler = pickL(locale, sign.ruler);

  const lucky = useMemo(
    () => [
      { label: hi ? "लकी नंबर" : "Lucky number", value: sign.luckyNumber },
      { label: hi ? "लकी रंग" : "Lucky colour", value: pickL(locale, sign.luckyColour) },
      { label: hi ? "लकी दिन" : "Lucky day", value: pickL(locale, sign.luckyDay) },
      { label: hi ? "रत्न" : "Gemstone", value: pickL(locale, sign.gemstone) },
      { label: hi ? "धातु" : "Metal", value: pickL(locale, sign.metal) },
      { label: hi ? "दिशा" : "Favourable direction", value: pickL(locale, sign.direction) },
      { label: hi ? "देवता" : "Presiding deity", value: pickL(locale, sign.deity) },
      { label: hi ? "मंत्र" : "Mantra", value: sign.mantra },
    ],
    [hi, locale, sign]
  );

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow={hi ? `${ruler} द्वारा शासित` : `Ruled by ${ruler}`}
        title={
          hi
            ? `${name} राशिफल — दैनिक, साप्ताहिक व मासिक`
            : `${name} Horoscope — Daily, Weekly & Monthly`
        }
        description={pickL(locale, sign.summary)}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "राशिफल" : "Horoscope", href: "/horoscope" },
          { label: name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ZodiacIcon
              slug={sign.slug}
              className="h-12 w-12 sm:h-14 sm:w-14"
              colorClassName="bg-saffron"
            />
          </div>
        }
      />

      <div className="container-page max-w-5xl py-6 sm:py-8">
        {/* Period tabs */}
        <div className="inline-flex rounded-xl border border-saffron/25 bg-white p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition sm:px-4",
                period === p.id
                  ? "bg-gradient-to-r from-saffron to-maroon text-white"
                  : "text-ink-muted hover:bg-[#fff1e6]"
              )}
            >
              {hi ? p.hi : p.en}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-ink-muted">
          {hi
            ? "मार्गदर्शन सामान्य है — चंद्र राशि के आधार पर; दिन भर उपयोगी।"
            : "Predictions are general guidance based on your Moon sign and update through the day."}
        </p>

        {/* Lucky grid */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {lucky.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-black/[0.06] bg-white px-3 py-2.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {item.label}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug text-ink">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Period lead + sections */}
        <GlassCard strong className="mt-5 space-y-5 !p-4 sm:!p-5">
          <p className="text-[13px] leading-relaxed text-ink">
            {pickL(locale, sign.periodLead[period])}
          </p>

          <div className="space-y-4">
            {SECTION_META.map(({ key, en, hi: hiLabel, Icon }) => (
              <div key={key} className="border-t border-black/[0.05] pt-4 first:border-0 first:pt-0">
                <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-ink">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffe8d6] text-saffron-deep">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {hi ? hiLabel : en}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  {pickL(locale, sign.sections[key])}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Ruling planet */}
        <GlassCard className="mt-5 !p-4 sm:!p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
            {hi ? "शासक ग्रह" : "Ruling planet"}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold text-ink">{ruler}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
            {pickL(locale, sign.rulerBlurb)}
          </p>
        </GlassCard>

        {/* Educate */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(
            [
              {
                t: L2(
                  hi,
                  "What is a horoscope?",
                  "राशिफल क्या है?",
                  "A horoscope reads where planets sit against your sign — daily sky weather on top of who you are in the birth chart.",
                  "राशिफल ग्रहों की स्थिति को आपकी राशि पर पढ़ता है — जन्म कुंडली के ऊपर आज का आकाशीय मौसम।"
                ),
              },
              {
                t: L2(
                  hi,
                  "How to read it",
                  "कैसे पढ़ें",
                  "Prefer your Moon sign in Vedic astrology. Treat it like a weather report — useful for timing, not as fixed fate.",
                  "वैदिक ज्योतिष में चंद्र राशि प्राथमिक है। इसे मौसम रिपोर्ट की तरह लें — समय के लिए उपयोगी, तय किस्मत नहीं।"
                ),
              },
              {
                t: L2(
                  hi,
                  "Why it helps",
                  "क्यों उपयोगी",
                  "Use it to start important work on supportive days, pause before haste, and pair with panchang for muhurat.",
                  "सहायक दिनों पर महत्वपूर्ण काम शुरू करने, जल्दबाज़ी रोकने और मुहूर्त के लिए पंचांग से जोड़ने में मदद।"
                ),
              },
            ] as const
          ).map((block) => (
            <div
              key={block.t.title}
              className="rounded-xl border border-black/[0.06] bg-white p-4"
            >
              <h4 className="font-display text-[14px] font-bold text-ink">
                {block.t.title}
              </h4>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                {block.t.body}
              </p>
            </div>
          ))}
        </div>

        {/* Sign switcher */}
        <div className="mt-8">
          <h3 className="font-display text-base font-bold text-ink">
            {hi ? "अपनी राशि चुनें" : "Choose your zodiac sign"}
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {HOROSCOPE_SIGNS.map((s) => {
              const active = s.slug === sign.slug;
              return (
                <Link
                  key={s.slug}
                  href={`/horoscope/${s.slug}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition",
                    active
                      ? "border-saffron/50 bg-[#fff1e6]"
                      : "border-black/[0.06] bg-white hover:border-saffron/30 hover:bg-[#fffaf6]"
                  )}
                >
                  <ZodiacIcon
                    slug={s.slug}
                    className="h-10 w-10"
                    colorClassName={active ? "bg-saffron" : "bg-[#c45a12]/75"}
                  />
                  <span className="text-[11px] font-semibold text-ink">
                    {pickL(locale, s.name)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-2">
          <h3 className="font-display text-base font-bold text-ink">
            {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
          </h3>
          {HOROSCOPE_FAQS.map((f) => (
            <details
              key={pickL(locale, f.q)}
              className="group rounded-xl border border-black/[0.06] bg-white px-4 py-3"
            >
              <summary className="cursor-pointer list-none text-[13px] font-semibold text-ink marker:content-none">
                {pickL(locale, f.q)}
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                {pickL(locale, f.a)}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <GlassCard strong className="mt-8 space-y-3 !p-5 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
            <Sparkles className="h-3.5 w-3.5" />
            {hi ? "व्यक्तिगत पढ़ाई" : "Personalised reading"}
          </p>
          <h3 className="font-display text-xl font-bold text-ink">
            {hi
              ? `${name} के लिए व्यक्तिगत मार्गदर्शन लें`
              : `Get your personalised ${name} reading`}
          </h3>
          <p className="mx-auto max-w-lg text-[13px] text-ink-muted">
            {hi
              ? "सामान्य राशिफल शुरुआत है। एआई गुरु आपकी पूरी कुंडली — ग्रह, दशा और योग — पढ़कर आप पर केंद्रित सलाह देता है।"
              : "A general horoscope is just the start. Our AI Guru reads your full birth chart — planets, dashas and yogas — for guidance made for you."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Link href="/chat">
              <Button type="button" className="!px-5 !py-2.5">
                {hi ? "एआई गुरु से बात करें" : "Talk to AI Guru"}
              </Button>
            </Link>
            <Link href="/kundli">
              <Button type="button" variant="ghost" className="!px-5 !py-2.5">
                {hi ? "पूर्ण कुंडली बनाएँ" : "Build full kundli"}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function L2(
  hi: boolean,
  enTitle: string,
  hiTitle: string,
  enBody: string,
  hiBody: string
) {
  return {
    title: hi ? hiTitle : enTitle,
    body: hi ? hiBody : enBody,
  };
}
