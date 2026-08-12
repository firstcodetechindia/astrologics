"use client";

import { Button } from "@/components/ui/Button";

type Loc = { en: string; hi: string };

function t(locale: string, v: Loc) {
  return locale === "hi" ? v.hi : v.en;
}

const ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const;
const ROW_LABELS = [
  { en: "Mind", hi: "मन" },
  { en: "Heart", hi: "हृदय" },
  { en: "Action", hi: "कर्म" },
];

export function LoShuResult({
  data,
  locale,
  onReset,
}: {
  data: Record<string, unknown>;
  locale: string;
  onReset: () => void;
}) {
  const grid = data.grid as Record<string, number>;
  const present = (data.present as Record<string, unknown>[]) || [];
  const missing = (data.missing as Record<string, unknown>[]) || [];
  const planes = (data.planes as Record<string, unknown>[]) || [];
  const summary = data.summary as Loc;
  const tip = data.tip as Loc;
  const lifePath = data.lifePath;

  return (
    <div className="space-y-8">
      {/* Hero summary */}
      <div className="rounded-2xl border border-saffron/20 surface-wash p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {locale === "hi" ? "आपका सार" : "Your snapshot"}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              {locale === "hi" ? "लाइफ पाथ" : "Life Path"}{" "}
              <span className="text-saffron-deep tabular-nums">{String(lifePath)}</span>
            </p>
          </div>
          <div className="flex gap-2 text-center">
            <div className="rounded-xl bg-surface/85 border border-white/10 px-3 py-2 min-w-[4.5rem]">
              <p className="text-lg font-bold text-saffron-deep tabular-nums">{present.length}</p>
              <p className="text-[10px] text-ink-muted uppercase">
                {locale === "hi" ? "सक्रिय" : "Active"}
              </p>
            </div>
            <div className="rounded-xl bg-surface/85 border border-white/10 px-3 py-2 min-w-[4.5rem]">
              <p className="text-lg font-bold text-ink tabular-nums">{missing.length}</p>
              <p className="text-[10px] text-ink-muted uppercase">
                {locale === "hi" ? "खुले" : "Open"}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">{t(locale, summary)}</p>
        <p className="mt-2 text-sm text-maroon/90 leading-relaxed font-medium">
          {t(locale, tip)}
        </p>
      </div>

      {/* Grid + row labels */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-3">
          {locale === "hi" ? "लो शू ग्रिड" : "Lo Shu Grid"}
        </p>
        <div className="flex gap-3 items-stretch max-w-sm mx-auto sm:mx-0">
          <div className="hidden sm:flex flex-col justify-around py-1 shrink-0 w-14">
            {ROW_LABELS.map((lab) => (
              <span
                key={lab.en}
                className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted text-right leading-tight"
              >
                {t(locale, lab)}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2.5 flex-1">
            {ORDER.map((n, i) => {
              const count = grid[String(n)] ?? grid[n as unknown as string] ?? 0;
              const filled = count > 0;
              return (
                <div
                  key={n}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition ${
                    filled
                      ? "border-saffron/35 surface-wash shadow-sm"
                      : "border-white/10 bg-surface"
                  }`}
                  title={`${n}: ${count}`}
                >
                  <span className="text-xs text-ink-muted/80 tabular-nums">{n}</span>
                  <span
                    className={`mt-0.5 text-2xl sm:text-3xl font-bold tabular-nums ${
                      filled ? "text-saffron-deep" : "text-ink-muted/35"
                    }`}
                  >
                    {count}
                  </span>
                  <span className="text-[9px] text-ink-muted mt-0.5 sm:hidden">
                    {t(locale, ROW_LABELS[Math.floor(i / 3)])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-muted max-w-md">
          {locale === "hi"
            ? "छोटा अंक = ग्रिड स्थिति · बड़ा अंक = आपकी जन्म तिथि में कितनी बार आया।"
            : "Small digit = grid seat · Large digit = how often it appears in your birth date."}
        </p>
      </div>

      {/* Planes */}
      <div>
        <h3 className="font-display text-lg font-bold text-ink mb-1">
          {locale === "hi" ? "जीवन के तीन तल" : "Your life planes"}
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          {locale === "hi"
            ? "पंक्तियाँ मन–हृदय–कर्म बताती हैं; स्तंभ सोच–संकल्प–कर्म की दिशा।"
            : "Rows show mind–heart–action; columns show thought–will–action direction."}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {planes.slice(0, 6).map((p) => {
            const level = String(p.level);
            const badge =
              level === "strong"
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
                : level === "balanced"
                  ? "bg-saffron/10 text-saffron-deep border-saffron/25"
                  : level === "soft"
                    ? "bg-amber-500/15 text-amber-100 border-amber-400/30"
                    : "bg-slate-500/15 text-slate-200 border-white/12";
            return (
              <div
                key={String(p.id)}
                className="rounded-2xl border border-white/10 bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-[14px] text-ink leading-snug">
                    {t(locale, p.title as Loc)}
                  </p>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${badge}`}
                  >
                    {t(locale, p.levelLabel as Loc)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-muted tabular-nums">
                  {(p.cells as number[]).join(" · ")} →{" "}
                  {(p.counts as number[]).join(" + ")}
                </p>
                <p className="mt-2 text-[13px] text-ink-muted leading-relaxed">
                  {t(locale, p.insight as Loc)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Present numbers */}
      {present.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-ink mb-1">
            {locale === "hi" ? "सक्रिय अंक — आपकी शक्तियाँ" : "Active numbers — your strengths"}
          </h3>
          <p className="text-sm text-ink-muted mb-4">
            {locale === "hi"
              ? "ये अंक जन्म तिथि में मौजूद हैं। दो या अधिक बार = विशेष बल।"
              : "These appear in your birth date. Twice or more = emphasised gift."}
          </p>
          <div className="space-y-3">
            {present.map((item) => (
              <div
                key={String(item.number)}
                className="flex gap-3 rounded-2xl border border-white/10 bg-surface p-4"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-maroon text-white shadow-md shadow-saffron/20">
                  <span className="text-lg font-bold leading-none tabular-nums">
                    {String(item.number)}
                  </span>
                  <span className="text-[9px] opacity-90">×{String(item.count)}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink text-[14px]">
                      {t(locale, item.title as Loc)}
                    </p>
                    <span className="text-[10px] font-bold uppercase text-saffron-deep bg-saffron/10 px-2 py-0.5 rounded-full">
                      {t(locale, item.intensity as Loc)}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">
                    {t(locale, item.meaning as Loc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing numbers */}
      {missing.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-ink mb-1">
            {locale === "hi" ? "खुले अंक — विकास के द्वार" : "Open numbers — growth doors"}
          </h3>
          <p className="text-sm text-ink-muted mb-4">
            {locale === "hi"
              ? "अनुपस्थिति कमज़ोरी नहीं। ये वे क्षेत्र हैं जहाँ सचेत अभ्यास फल देता है।"
              : "Absence is not a flaw. These are areas where conscious practice pays off."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {missing.map((item) => (
              <div
                key={String(item.number)}
                className="rounded-2xl border border-dashed border-white/15 bg-sand/20 p-4"
              >
                <p className="font-semibold text-ink text-[14px]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-white/10 text-ink-muted mr-2 text-sm font-bold tabular-nums">
                    {String(item.number)}
                  </span>
                  {t(locale, item.title as Loc)}
                </p>
                <p className="mt-2 text-[13px] text-ink-muted leading-relaxed">
                  {t(locale, item.meaning as Loc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-ink/[0.03] border border-white/10 px-4 py-3 text-xs text-ink-muted leading-relaxed">
        {locale === "hi"
          ? "लो शू आत्म-समझ के लिए है — भाग्य की सज़ा नहीं। गंभीर निर्णयों हेतु कुंडली + व्यक्तिगत परामर्श लें।"
          : "Lo Shu is for self-understanding — not fate as punishment. For serious decisions, pair with kundli and a personal reading."}
      </div>

      <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
        {locale === "hi" ? "फिर से गणना करें" : "Calculate again"}
      </Button>
    </div>
  );
}
