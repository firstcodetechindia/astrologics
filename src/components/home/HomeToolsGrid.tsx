import { Link } from "@/i18n/navigation";
import { CALCULATORS } from "@/lib/calculators/catalog";

const SHOWCASE = [
  "moon-sign",
  "lagna",
  "kundli-matching",
  "mangal-dosha",
  "sade-sati",
  "vimshottari-dasha",
  "lo-shu-grid",
  "life-path",
  "gemstone",
  "birth-panchang",
  "nakshatra",
  "love-calculator",
] as const;

export function HomeToolsGrid({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const tools = SHOWCASE.map((slug) => CALCULATORS.find((c) => c.slug === slug)).filter(
    Boolean
  );

  return (
    <section className="bg-[#f7f4f0] border-y border-black/[0.04] py-14 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4 max-w-4xl">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
              {hi ? "और उपकरण" : "More tools"}
            </p>
            <h2 className="heading-1 mt-2 font-display tracking-tight text-ink">
              {hi ? "व्याख्या वाले लोकप्रिय कैलकुलेटर" : "Popular calculators, explained"}
            </h2>
            <p className="text-muted mt-3 max-w-xl">
              {hi
                ? "ऊपर झलक थी — यहाँ परिणाम की पूरी व्याख्या, FAQ और संबंधित लिंक वाले उपकरण हैं।"
                : "That was a quick peek above — these open full explained results, FAQs and related links."}
            </p>
          </div>
          <Link
            href="/calculators"
            className="text-sm font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "सभी 30+ देखें →" : "View all 30+ →"}
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((c) =>
            c ? (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="flex gap-3 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm hover:border-saffron/30 hover:shadow-md transition"
              >
                <span className="text-2xl shrink-0">{c.icon}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-[14px] text-ink leading-snug">
                    {hi ? c.title.hi : c.title.en}
                  </span>
                  <span className="block mt-1 text-[12px] text-ink-muted leading-snug line-clamp-2">
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
