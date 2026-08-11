import { Link } from "@/i18n/navigation";
import { CALCULATORS } from "@/lib/calculators/catalog";
import { Reveal } from "./Reveal";

const SHOWCASE = [
  "moon-sign",
  "lagna",
  "nakshatra",
  "sun-sign",
  "kundli-matching",
  "mangal-dosha",
  "sade-sati",
  "vimshottari-dasha",
  "navamsa",
  "life-path",
  "love-calculator",
  "hora",
] as const;

export function HomeToolsGrid({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const tools = SHOWCASE.map((slug) => CALCULATORS.find((c) => c.slug === slug)).filter(
    Boolean
  );

  return (
    <section className="py-10 sm:py-12">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="heading-1 font-display tracking-tight text-ink">
                {hi ? "लोकप्रिय कैलकुलेटर" : "Popular calculators"}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-ink-muted">
                {hi
                  ? "वास्तविक गणना — परिणाम व संदर्भ के साथ।"
                  : "Real calculations — with results and context."}
              </p>
            </div>
            <Link
              href="/calculators"
              className="text-sm font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "सभी 30+ →" : "View all 30+ →"}
            </Link>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((c) =>
            c ? (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="group flex gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5 transition hover:border-saffron/30 hover:shadow-sm"
              >
                <span className="text-xl shrink-0" aria-hidden>
                  {c.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-ink">
                    {hi ? c.title.hi : c.title.en}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-[12px] text-ink-muted">
                    {hi ? c.description.hi : c.description.en}
                  </span>
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
