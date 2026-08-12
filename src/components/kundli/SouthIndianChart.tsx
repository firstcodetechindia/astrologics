"use client";

import type { ChartBody } from "./NorthIndianChart";

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
  asc: { en: "Asc", hi: "ल" },
};

/**
 * South Indian fixed-sign grid (4×4 with open center).
 * Cell order = sign index 0–11 (Aries=0 … Pisces=11).
 *
 *   Pi  Ar  Ta  Ge
 *   Aq          Cn
 *   Cp          Le
 *   Sg  Sc  Li  Vi
 */
const SOUTH_CELLS: { signIndex: number; row: number; col: number }[] = [
  { signIndex: 11, row: 0, col: 0 }, // Pisces
  { signIndex: 0, row: 0, col: 1 }, // Aries
  { signIndex: 1, row: 0, col: 2 }, // Taurus
  { signIndex: 2, row: 0, col: 3 }, // Gemini
  { signIndex: 3, row: 1, col: 3 }, // Cancer
  { signIndex: 4, row: 2, col: 3 }, // Leo
  { signIndex: 5, row: 3, col: 3 }, // Virgo
  { signIndex: 6, row: 3, col: 2 }, // Libra
  { signIndex: 7, row: 3, col: 1 }, // Scorpio
  { signIndex: 8, row: 3, col: 0 }, // Sagittarius
  { signIndex: 9, row: 2, col: 0 }, // Capricorn
  { signIndex: 10, row: 1, col: 0 }, // Aquarius
];

type Props = {
  title: string;
  subtitle?: string;
  lagnaSignIndex: number;
  bodies: ChartBody[];
  locale: "en" | "hi";
  showAsc?: boolean;
  className?: string;
};

export function SouthIndianChart({
  title,
  subtitle,
  lagnaSignIndex,
  bodies,
  locale,
  showAsc = true,
  className = "",
}: Props) {
  const bySign: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) bySign[i] = [];

  if (showAsc) {
    bySign[lagnaSignIndex].push(PLANET_SHORT.asc[locale]);
  }
  for (const b of bodies) {
    const short = PLANET_SHORT[b.id]?.[locale] || b.id.slice(0, 2);
    bySign[b.signIndex].push(b.isRetrograde ? `${short}®` : short);
  }

  return (
    <div
      className={`rounded-2xl border border-gold/30 bg-surface p-3 sm:p-4 ${className}`}
    >
      <p className="text-center font-display text-sm font-semibold text-maroon sm:text-base">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-0.5 text-center text-[11px] text-ink-muted">{subtitle}</p>
      ) : null}

      <div
        className="relative mx-auto mt-2 aspect-square w-full max-w-[240px] sm:max-w-[280px]"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
        }}
      >
        {/* Outer border + cross lines via background cells */}
        <div
          className="pointer-events-none absolute inset-0 rounded-sm border-2 border-[#c4a35a] bg-[#1a1f3b]"
          aria-hidden
        />
        {/* Center diamond hint */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/4 h-1/2 w-1/2 border border-[#c4a35a]/50"
          aria-hidden
        />

        {SOUTH_CELLS.map((cell) => {
          const planets = bySign[cell.signIndex] || [];
          const isLagna = cell.signIndex === lagnaSignIndex;
          return (
            <div
              key={cell.signIndex}
              className={`relative z-[1] flex flex-col items-center justify-start border border-[#c4a35a]/40 p-0.5 text-center ${
                isLagna ? "bg-saffron/10" : ""
              }`}
              style={{
                gridRow: cell.row + 1,
                gridColumn: cell.col + 1,
              }}
            >
              <span className="text-[9px] font-bold text-maroon/60 font-numeric">
                {cell.signIndex + 1}
              </span>
              {planets.length > 0 && (
                <span className="mt-0.5 text-[8px] font-semibold leading-tight text-saffron-deep sm:text-[9px]">
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
