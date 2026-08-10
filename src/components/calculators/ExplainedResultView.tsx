"use client";

import { Button } from "@/components/ui/Button";
import type { ExplainedResult, Loc } from "@/lib/astrology/explain-result";

function tx(locale: string, v: Loc | string) {
  if (typeof v === "string") return v;
  return locale === "hi" ? v.hi : v.en;
}

const toneClass: Record<string, string> = {
  good: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warn: "bg-amber-50 text-amber-900 border-amber-200",
  alert: "bg-red-50 text-red-800 border-red-200",
  neutral: "bg-saffron/10 text-saffron-deep border-saffron/25",
};

export function ExplainedResultView({
  data,
  locale,
  onReset,
}: {
  data: ExplainedResult;
  locale: string;
  onReset: () => void;
}) {
  const tone = data.hero.badgeTone || "neutral";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-saffron/20 bg-gradient-to-br from-[#fff7f0] via-white to-[#ffe8d4]/40 p-5 sm:p-6">
        {data.hero.icon && (
          <span className="text-3xl" aria-hidden>
            {data.hero.icon}
          </span>
        )}
        <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-ink leading-snug">
          {tx(locale, data.hero.title)}
        </h3>
        {data.hero.badge && (
          <span
            className={`mt-3 inline-flex text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${toneClass[tone]}`}
          >
            {tx(locale, data.hero.badge)}
          </span>
        )}
        <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
          {tx(locale, data.hero.summary)}
        </p>
      </div>

      {data.highlights.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.highlights.map((h, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {tx(locale, h.label)}
              </p>
              <p className="mt-1 font-semibold text-ink text-[15px] leading-snug">
                {tx(locale, h.value)}
              </p>
              {h.note && (
                <p className="mt-1 text-xs text-ink-muted">{tx(locale, h.note)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.sections.map((s, i) => (
        <section key={i} className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
          <h4 className="font-display text-lg font-bold text-ink">
            {tx(locale, s.title)}
          </h4>
          {s.body && (
            <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
              {tx(locale, s.body)}
            </p>
          )}
          {s.bullets && s.bullets.length > 0 && (
            <ul className="mt-3 space-y-2">
              {s.bullets.map((b, j) => (
                <li key={j} className="flex gap-2 text-[14px] text-ink leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                  <span>{tx(locale, b)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {data.tips && data.tips.length > 0 && (
        <div className="rounded-2xl bg-sand/40 border border-saffron/15 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep mb-2">
            {locale === "hi" ? "सुझाव" : "Tips"}
          </p>
          <ul className="space-y-2">
            {data.tips.map((tip, i) => (
              <li key={i} className="text-[14px] text-ink leading-relaxed">
                {tx(locale, tip)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.nextStep && (
        <p className="text-sm font-medium text-maroon leading-relaxed">
          → {tx(locale, data.nextStep)}
        </p>
      )}

      <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
        {locale === "hi" ? "फिर से गणना करें" : "Calculate again"}
      </Button>
    </div>
  );
}
