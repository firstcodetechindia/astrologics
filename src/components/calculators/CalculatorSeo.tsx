"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CalcPageContent } from "@/lib/calculators/content";
import { ContactCTA } from "@/components/kundli/ContactCTA";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

function T({
  locale,
  t,
}: {
  locale: string;
  t: { en: string; hi: string };
}) {
  return <>{locale === "hi" ? t.hi : t.en}</>;
}

export function CalculatorSeo({ content }: { content: CalcPageContent }) {
  const locale = useLocale();

  return (
    <div className="space-y-10 mt-10">
      {content.sections.map((s) => (
        <section key={s.title.en}>
          <h2 className="font-display text-2xl font-bold text-ink mb-3">
            <T locale={locale} t={s.title} />
          </h2>
          <p className="text-[15px] text-ink-muted leading-relaxed max-w-3xl">
            <T locale={locale} t={s.body} />
          </p>
          {s.steps && (
            <ol className="mt-4 space-y-3">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-ink leading-relaxed">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron/15 text-saffron-deep text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">
                    <T locale={locale} t={step} />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      <section>
        <h2 className="font-display text-2xl font-bold text-ink mb-5">
          {locale === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
        </h2>
        <FaqAccordion
          items={content.faqs.map((faq) => ({
            q: locale === "hi" ? faq.q.hi : faq.q.en,
            a: locale === "hi" ? faq.a.hi : faq.a.en,
          }))}
        />
      </section>

      {content.references && content.references.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-3">
            {locale === "hi" ? "संदर्भ" : "References"}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink-muted">
            {content.references.map((r) => (
              <li key={r.en}>
                <T locale={locale} t={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {content.disclaimer && (
        <p className="text-xs text-ink-muted leading-relaxed border-t border-black/5 pt-6">
          <T locale={locale} t={content.disclaimer} />
        </p>
      )}

      <ContactCTA compact />
    </div>
  );
}

export function PromoBanner({
  text,
  cta,
  href,
}: {
  text: { en: string; hi: string };
  cta: { en: string; hi: string };
  href: string;
}) {
  const locale = useLocale();
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-saffron/25 bg-gradient-to-r from-[#fff3ea] to-[#ffe8d4] px-4 py-3.5">
      <p className="text-sm text-ink font-medium">
        {locale === "hi" ? text.hi : text.en}
      </p>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center justify-center rounded-xl bg-saffron-deep px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
      >
        {locale === "hi" ? cta.hi : cta.en}
      </Link>
    </div>
  );
}
