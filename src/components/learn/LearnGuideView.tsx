import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import {
  pickLocale,
  type LearnGuide,
} from "@/lib/learn/types";
import { getLearnGuide } from "@/lib/learn/catalog";

type Props = {
  guide: LearnGuide;
  locale: string;
};

export function LearnGuideView({ guide, locale }: Props) {
  const hi = locale === "hi";
  const related = (guide.relatedSlugs || [])
    .map((slug) => getLearnGuide(slug))
    .filter(Boolean) as LearnGuide[];

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow={hi ? "ज्योतिष सीखें" : "Learn astrology"}
        title={pickLocale(locale, guide.title)}
        description={pickLocale(locale, guide.subtitle)}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "सीखें" : "Learn", href: "/learn" },
          { label: pickLocale(locale, guide.menuTitle) },
        ]}
        actions={
          <>
            {guide.relatedCalculator ? (
              <Link
                href={`/calculators/${guide.relatedCalculator}`}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-saffron to-maroon px-3 py-1.5 text-xs font-semibold text-white"
              >
                {hi ? "कैलकुलेटर" : "Calculator"}
              </Link>
            ) : null}
            <Link
              href="/kundli"
              className="inline-flex items-center justify-center rounded-lg border border-saffron/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-[#fff1e6]"
            >
              {hi ? "कुंडली" : "Kundli"}
            </Link>
          </>
        }
      />

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <article className="min-w-0 space-y-10">
            <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
              {guide.intro.map((p, i) => (
                <p key={i}>{pickLocale(locale, p)}</p>
              ))}
            </div>

            {guide.cards && guide.cards.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.cards.map((card) => (
                  <div
                    key={pickLocale(locale, card.title)}
                    className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_8px_24px_-18px_rgba(42,33,24,0.35)] transition hover:border-saffron/25"
                  >
                    <div className="flex items-start gap-3">
                      {card.icon ? (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f4f0] text-lg">
                          {card.icon}
                        </span>
                      ) : null}
                      <div className="min-w-0">
                        <h2 className="font-display text-[15px] font-bold text-ink">
                          {pickLocale(locale, card.title)}
                        </h2>
                        {card.subtitle ? (
                          <p className="mt-0.5 text-[12px] font-medium text-saffron-deep">
                            {pickLocale(locale, card.subtitle)}
                          </p>
                        ) : null}
                        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                          {pickLocale(locale, card.body)}
                        </p>
                        {card.tags && card.tags.length > 0 ? (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {card.tags.map((tag) => (
                              <span
                                key={pickLocale(locale, tag)}
                                className="rounded-md bg-[#fff1e6] px-2 py-0.5 text-[11px] font-medium text-[#8a5a2a]"
                              >
                                {pickLocale(locale, tag)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {guide.sections.map((section) => (
              <section key={pickLocale(locale, section.heading)}>
                <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
                  {pickLocale(locale, section.heading)}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-muted">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{pickLocale(locale, p)}</p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[14px] leading-relaxed text-ink-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                        <span>{pickLocale(locale, b)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a7a6a]">
                {hi ? "आगे पढ़ें" : "Keep learning"}
              </p>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/learn/${r.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-[#fff1e6] hover:text-saffron-deep"
                    >
                      <span aria-hidden>{r.icon}</span>
                      {pickLocale(locale, r.menuTitle)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/learn"
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-saffron-deep hover:bg-[#fff1e6]"
                  >
                    {hi ? "सभी गाइड →" : "All guides →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/glossary"
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-[#fff1e6] hover:text-saffron-deep"
                  >
                    📖 {hi ? "शब्दावली" : "Glossary"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-saffron/20 bg-gradient-to-br from-[#fff7f0] to-[#ffe8d4] p-4">
              <p className="font-display text-[15px] font-bold text-ink">
                {hi ? "व्यक्तिगत मार्गदर्शन?" : "Want personal guidance?"}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                {hi
                  ? "मुफ्त कैलकुलेटर आज़माएँ, या अपनी कुंडली पर प्रश्न पूछें।"
                  : "Try a free calculator, or ask about your birth chart."}
              </p>
              <Link
                href="/chat"
                className="mt-3 inline-flex text-[13px] font-semibold text-saffron-deep hover:underline"
              >
                {hi ? "एआई चैट खोलें →" : "Open AI chat →"}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
