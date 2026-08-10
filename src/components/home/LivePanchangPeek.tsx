"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Moon,
  Orbit,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { liveMuhuratNow } from "@/lib/astrology/muhurat-now";
import type { PanchangPeek } from "./HomeExplore";

function tx(locale: string, v: { en: string; hi: string } | string) {
  if (typeof v === "string") return v;
  return locale === "hi" ? v.hi : v.en;
}

type Row = {
  key: string;
  label: string;
  value: string;
  icon: typeof Moon;
  tone?: "good" | "neutral" | "caution";
};

/** Matches the clean Explore-column Panchang (Live · right now + text CTA) */
export function LivePanchangPeek({
  locale,
  panchang,
}: {
  locale: string;
  panchang: PanchangPeek;
}) {
  const hi = locale === "hi";
  const [now, setNow] = useState(() => liveMuhuratNow());

  useEffect(() => {
    const id = window.setInterval(() => setNow(liveMuhuratNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const tithiValue = `${tx(locale, panchang.paksha).split(" ")[0]} ${tx(locale, panchang.tithi)}`;

  const rows: Row[] = [
    {
      key: "tithi",
      label: hi ? "तिथि" : "Tithi",
      value: tithiValue,
      icon: Moon,
    },
    {
      key: "moon",
      label: hi ? "चंद्र राशि" : "Moon sign",
      value: tx(locale, panchang.moonSign),
      icon: Sparkles,
    },
    {
      key: "nak",
      label: hi ? "नक्षत्र" : "Nakshatra",
      value: tx(locale, panchang.nakshatra),
      icon: Star,
    },
    {
      key: "chog",
      label: hi ? "चौघड़िया" : "Choghadiya",
      value: tx(locale, now.choghadiya),
      icon: Timer,
      tone: now.choghadiyaTone,
    },
    {
      key: "hora",
      label: hi ? "होरा" : "Hora",
      value: tx(locale, now.hora),
      icon: Orbit,
    },
    {
      key: "rahu",
      label: hi ? "राहु काल" : "Rahu Kaal",
      value: tx(locale, now.rahuKaal.label),
      icon: Clock,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff1e6] text-saffron-deep">
          <CalendarDays className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-tight text-ink">
            {hi ? "पंचांग" : "Panchang"}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {hi ? "लाइव · अभी" : "Live · right now"}
          </p>
        </div>
      </div>

      <ul className="mt-4 flex-1 space-y-0.5">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <li
              key={row.key}
              className="flex items-center gap-2 px-0.5 py-1.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center text-saffron-deep">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="w-[4.5rem] shrink-0 text-[13px] text-ink-muted sm:w-[5rem]">
                {row.label}
              </span>
              <span className="ml-auto flex shrink-0 items-center justify-end gap-1.5 whitespace-nowrap text-right text-[13px] font-semibold leading-none text-ink">
                {row.value}
                {row.tone === "good" && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                )}
                {row.tone === "caution" && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href="/panchang"
        className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-saffron-deep hover:underline"
      >
        {hi ? "आज का पंचांग खोलें" : "Open today’s Panchang"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
