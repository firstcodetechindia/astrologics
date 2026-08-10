"use client";

import { useLocale } from "next-intl";
import type { KundliResult } from "@/lib/astrology/types";

/** Geometric centers of the 12 houses in a North Indian chart (percent of box) */
const HOUSE_CENTERS: { n: number; left: string; top: string }[] = [
  { n: 1, left: "50%", top: "26%" },
  { n: 2, left: "26%", top: "14%" },
  { n: 3, left: "14%", top: "26%" },
  { n: 4, left: "26%", top: "50%" },
  { n: 5, left: "14%", top: "74%" },
  { n: 6, left: "26%", top: "86%" },
  { n: 7, left: "50%", top: "74%" },
  { n: 8, left: "74%", top: "86%" },
  { n: 9, left: "86%", top: "74%" },
  { n: 10, left: "74%", top: "50%" },
  { n: 11, left: "86%", top: "26%" },
  { n: 12, left: "74%", top: "14%" },
];

const PLANET_SHORT: Record<string, { en: string; hi: string }> = {
  sun: { en: "Su", hi: "सू" },
  moon: { en: "Mo", hi: "चं" },
  mars: { en: "Ma", hi: "मं" },
  mercury: { en: "Me", hi: "बु" },
  jupiter: { en: "Ju", hi: "गु" },
  venus: { en: "Ve", hi: "शु" },
  saturn: { en: "Sa", hi: "श" },
  rahu: { en: "Ra", hi: "रा" },
  ketu: { en: "Ke", hi: "के" },
};

/** North Indian style diamond chart with centered house labels */
export function KundliChart({
  kundli,
  compact = false,
  className = "",
}: {
  kundli: KundliResult;
  compact?: boolean;
  className?: string;
}) {
  const locale = useLocale() as "en" | "hi";
  const lagna = kundli.lagna.sign[locale];

  const byHouse: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  kundli.planets.forEach((p) => {
    const short = PLANET_SHORT[p.id]?.[locale] || p.name[locale].slice(0, 2);
    byHouse[p.house].push(short);
  });

  return (
    <div
      className={`glass rounded-2xl ${compact ? "p-3 md:p-4" : "p-4 md:p-6"} ${className}`}
    >
      <p
        className={`text-center font-display font-semibold text-maroon ${
          compact ? "mb-1.5 text-sm" : "mb-4 text-lg md:text-xl"
        }`}
      >
        {locale === "hi" ? "लग्न कुंडली" : "Lagna Chart"} — {lagna}
      </p>

      <div
        className={`relative mx-auto aspect-square w-full kundli-chart font-numeric ${
          compact ? "max-w-[280px]" : "max-w-[420px]"
        }`}
      >
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 h-full w-full text-maroon"
          aria-hidden
        >
          <rect
            x="8"
            y="8"
            width="284"
            height="284"
            fill="rgba(255,252,247,0.85)"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <line
            x1="8"
            y1="8"
            x2="292"
            y2="292"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <line
            x1="292"
            y1="8"
            x2="8"
            y2="292"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <polygon
            points="150,8 292,150 150,292 8,150"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
        </svg>

        {/* Centered house content overlays */}
        {HOUSE_CENTERS.map((h) => {
          const planets = byHouse[h.n] || [];
          return (
            <div
              key={h.n}
              className="absolute flex w-[22%] max-w-[5.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center pointer-events-none"
              style={{ left: h.left, top: h.top }}
            >
              <span
                className={`font-bold leading-none text-maroon font-numeric ${
                  compact ? "text-[11px]" : "text-sm md:text-base"
                }`}
              >
                {h.n}
              </span>
              {planets.length > 0 && (
                <span
                  className={`mt-0.5 font-semibold leading-tight text-saffron-deep font-numeric ${
                    compact ? "text-[9px]" : "text-[11px] md:text-xs"
                  }`}
                >
                  {planets.join(" ")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
