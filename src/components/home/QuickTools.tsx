import { Link } from "@/i18n/navigation";
import { CALCULATORS } from "@/lib/calculators/catalog";
import { Reveal } from "./Reveal";

const QUICK = [
  "moon-sign",
  "lagna",
  "nakshatra",
  "kundli-matching",
  "mangal-dosha",
  "vimshottari-dasha",
] as const;

export function QuickTools({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const tools = QUICK.map((slug) => CALCULATORS.find((c) => c.slug === slug)).filter(
    Boolean
  );

  return (
    <section className="border-y border-white/10 bg-cosmic-navy py-8 sm:py-10">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              {hi ? "जल्दी शुरू करें" : "Quick start"}
            </h2>
            <Link
              href="/calculators"
              className="text-[13px] font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी उपकरण →" : "All tools →"}
            </Link>
          </div>
        </Reveal>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:grid-cols-6">
          {tools.map((c) =>
            c ? (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="flex min-w-[42%] snap-start flex-col items-center rounded-xl border border-white/10 bg-surface px-3 py-3 text-center shadow-sm transition hover:border-saffron/35 sm:min-w-0"
              >
                <span className="text-xl" aria-hidden>
                  {c.icon}
                </span>
                <span className="mt-1.5 line-clamp-2 text-[12px] font-semibold leading-snug text-ink">
                  {hi ? c.title.hi : c.title.en}
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
