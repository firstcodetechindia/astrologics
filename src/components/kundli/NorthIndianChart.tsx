"use client";

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
  asc: { en: "Asc", hi: "ल" },
};

export type ChartBody = {
  id: string;
  signIndex: number;
  isRetrograde?: boolean;
};

/** Whole-sign house from a chart Lagna sign index. */
export function houseFromLagna(planetSignIndex: number, lagnaSignIndex: number) {
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}

type Props = {
  title: string;
  subtitle?: string;
  lagnaSignIndex: number;
  /** Sign numbers shown in each house (1–12). Defaults to whole-sign from Lagna. */
  signNumbers?: number[];
  bodies: ChartBody[];
  locale: "en" | "hi";
  showAsc?: boolean;
  className?: string;
};

export function NorthIndianChart({
  title,
  subtitle,
  lagnaSignIndex,
  signNumbers,
  bodies,
  locale,
  showAsc = true,
  className = "",
}: Props) {
  const signs =
    signNumbers ??
    Array.from({ length: 12 }, (_, i) => ((lagnaSignIndex + i) % 12) + 1);

  const byHouse: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];

  if (showAsc) {
    byHouse[1].push(PLANET_SHORT.asc[locale]);
  }

  for (const b of bodies) {
    const h = houseFromLagna(b.signIndex, lagnaSignIndex);
    const short = PLANET_SHORT[b.id]?.[locale] || b.id.slice(0, 2);
    byHouse[h].push(b.isRetrograde ? `${short}®` : short);
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
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[240px] kundli-chart font-numeric sm:max-w-[280px]">
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 h-full w-full text-[#c4a35a]"
          aria-hidden
        >
          <rect
            x="8"
            y="8"
            width="284"
            height="284"
            fill="rgba(255,252,247,0.95)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line x1="8" y1="8" x2="292" y2="292" stroke="currentColor" strokeWidth="1.5" />
          <line x1="292" y1="8" x2="8" y2="292" stroke="currentColor" strokeWidth="1.5" />
          <polygon
            points="150,8 292,150 150,292 8,150"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        {HOUSE_CENTERS.map((h) => {
          const planets = byHouse[h.n] || [];
          const signNo = signs[h.n - 1];
          return (
            <div
              key={h.n}
              className="pointer-events-none absolute flex w-[22%] max-w-[5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
              style={{ left: h.left, top: h.top }}
            >
              <span className="text-[10px] font-bold leading-none text-maroon/70">
                {signNo}
              </span>
              {planets.length > 0 && (
                <span className="mt-0.5 text-[9px] font-semibold leading-tight text-saffron-deep sm:text-[10px]">
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
