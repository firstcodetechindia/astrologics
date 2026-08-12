"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SIGNS } from "@/lib/astrology/constants";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";
import { liveMuhuratNow } from "@/lib/astrology/muhurat-now";
import { computePanchang } from "@/lib/astrology/panchang";
import { getSiderealPlanets } from "@/lib/astrology/planets";
import {
  lahiriAyanamsaFromDate,
  signIndexFromLongitude,
} from "@/lib/astrology/math";
import type { PanchangPeek } from "./HomeExplore";
import { Reveal } from "./Reveal";
import { HomeMediaPanel, HomeSplitGrid } from "./HomeMediaPanel";

function tx(locale: string, v: { en: string; hi: string } | string) {
  if (typeof v === "string") return v;
  return locale === "hi" ? v.hi : v.en;
}

function livePanchangPeek(): PanchangPeek {
  const now = new Date();
  const p = computePanchang(now);
  const ayanamsa = lahiriAyanamsaFromDate(now);
  const { planets } = getSiderealPlanets(now, ayanamsa);
  const moon = planets.find((x) => x.id === "moon");
  const moonSi = moon ? signIndexFromLongitude(moon.longitude) : 0;
  return {
    weekday: { en: p.weekday.en, hi: p.weekday.hi },
    paksha: { en: p.paksha.en, hi: p.paksha.hi },
    tithi: { en: p.tithi.name.en, hi: p.tithi.name.hi },
    nakshatra: { en: p.nakshatra.name.en, hi: p.nakshatra.name.hi },
    yoga: { en: p.yoga.name.en, hi: p.yoga.name.hi },
    karana: { en: p.karana.name.en, hi: p.karana.name.hi },
    moonSign: { en: SIGNS[moonSi].en, hi: SIGNS[moonSi].hi },
  };
}

/** Image RIGHT — alternates from How Astrology Works */
export function TodayAstrology({
  locale,
  panchang: initialPanchang,
}: {
  locale: string;
  panchang: PanchangPeek;
}) {
  const hi = locale === "hi";
  const [panchang, setPanchang] = useState(initialPanchang);
  /** Null until mount — avoids SSR/client clock hydration mismatch. */
  const [now, setNow] = useState<ReturnType<typeof liveMuhuratNow> | null>(
    null
  );

  useEffect(() => {
    const tick = () => {
      setNow(liveMuhuratNow());
      setPanchang(livePanchangPeek());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const chips = [
    {
      label: hi ? "तिथि" : "Tithi",
      value: `${tx(locale, panchang.paksha).split(" ")[0]} ${tx(locale, panchang.tithi)}`,
      note: null as string | null,
      href: "/panchang",
    },
    {
      label: hi ? "चंद्र" : "Moon",
      value: tx(locale, panchang.moonSign),
      note: null,
      href: "/calculators/moon-sign",
    },
    {
      label: hi ? "नक्षत्र" : "Nakshatra",
      value: tx(locale, panchang.nakshatra),
      note: null,
      href: "/calculators/nakshatra",
    },
    {
      label: hi ? "चौघड़िया" : "Choghadiya",
      value: now ? tx(locale, now.choghadiya) : "—",
      note: hi ? "अभी का खंड" : "Current slot",
      href: "/calculators/choghadiya",
    },
    {
      label: hi ? "होरा" : "Hora",
      value: now ? tx(locale, now.hora) : "—",
      note: hi ? "अभी की होरा" : "Current hora",
      href: "/calculators/hora",
    },
    {
      label: hi ? "राहु काल" : "Rahu Kaal",
      value: now ? tx(locale, now.rahuKaal.label) : "—",
      // Daytime-only window for today — not “right now” at night
      note: now?.rahuKaal.active
        ? hi
          ? "अभी सक्रिय"
          : "Active now"
        : hi
          ? "आज दिन में · अभी नहीं"
          : "Today daytime · not now",
      href: "/calculators/rahu-kaal",
    },
  ] as const;

  return (
    <section className="bg-cosmic-navy/80 py-8 sm:py-10">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-saffron/20 bg-surface shadow-sm">
            <HomeSplitGrid
              imageSide="right"
              image={
                <HomeMediaPanel
                  side="right"
                  src="/images/home/home-today-panchang.jpg"
                  alt={
                    hi
                      ? "सूर्योदय, दीपक और पंचांग — आज का ज्योतिष"
                      : "Sunrise, diya and Panchang — today’s astrology"
                  }
                  minHeightClass="min-h-[220px] sm:min-h-[260px] lg:min-h-full"
                  className="rounded-none lg:rounded-none"
                  imageClassName="object-cover object-center"
                >
                  <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
                    {hi ? "आज का ज्योतिष" : "Today’s Astrology"}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/95">
                    {hi
                      ? "पंचांग, मुहूर्त और दैनिक राशिफल एक जगह।"
                      : "Panchang, muhurat and daily horoscope in one place."}
                  </p>
                </HomeMediaPanel>
              }
              content={
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-semibold text-ink">
                          {hi ? "आज का पंचांग" : "Today’s Panchang"}
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold tabular-nums text-emerald-200">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          </span>
                          {hi ? "लाइव" : "Live"}
                          {now ? (
                            <>
                              {" · "}
                              <span suppressHydrationWarning>{now.clock}</span>
                            </>
                          ) : null}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-ink-muted">
                        {hi
                          ? "तिथि से राहु काल तक — हर सेकंड ताज़ा गणना।"
                          : "From Tithi to Rahu Kaal — recalculated every second."}
                      </p>
                    </div>
                    <Link
                      href="/panchang"
                      className="shrink-0 text-[13px] font-semibold text-saffron-deep hover:underline"
                    >
                      {hi ? "पूरा पंचांग →" : "Full Panchang →"}
                    </Link>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {chips.map((chip) => (
                      <Link
                        key={chip.label}
                        href={chip.href}
                        className="group rounded-xl border border-saffron/15 bg-cosmic-navy px-2.5 py-2.5 transition hover:-translate-y-0.5 hover:border-saffron/40 hover:bg-cosmic-purple/15 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-deep/35"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted group-hover:text-saffron-deep">
                          {chip.label}
                        </p>
                        <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                          {chip.value}
                        </p>
                        {chip.note ? (
                          <p className="mt-1 text-[10px] font-medium text-ink-muted">
                            {chip.note}
                          </p>
                        ) : null}
                        <p className="mt-1 text-[10px] font-semibold text-saffron-deep">
                          {hi ? "खोलें →" : "Open →"}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          {hi ? "आज का राशिफल" : "Today’s Horoscope"}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-ink-muted">
                          {hi
                            ? "अपनी राशि चुनें — टैप करके पढ़ें"
                            : "Choose your sign — tap to read"}
                        </p>
                      </div>
                      <Link
                        href="/horoscope"
                        className="text-[13px] font-semibold text-saffron-deep hover:underline"
                      >
                        {hi ? "सभी राशिफल →" : "All horoscopes →"}
                      </Link>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {ZODIAC_SLUGS.map((slug, i) => {
                        const label = hi ? SIGNS[i].hi : SIGNS[i].en;
                        return (
                          <Link
                            key={slug}
                            href={`/horoscope/${slug}`}
                            aria-label={
                              hi ? `${label} राशिफल` : `${label} horoscope`
                            }
                            className="group flex flex-col items-center gap-1 rounded-xl border border-saffron/20 bg-surface px-1.5 py-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-saffron-deep/45 hover:bg-cosmic-purple/15 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-deep/40"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cosmic-purple/15 ring-1 ring-saffron/20 transition group-hover:bg-saffron-deep/10">
                              <ZodiacIcon
                                slug={slug}
                                className="h-5 w-5"
                                colorClassName="bg-cosmic-gold"
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
                </div>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
