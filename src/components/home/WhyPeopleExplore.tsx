import { Reveal } from "./Reveal";

/** Product benefits — used instead of fabricated testimonials. */
const BENEFITS = [
  {
    title: { en: "Clarity before complexity", hi: "जटिलता से पहले स्पष्टता" },
    text: {
      en: "See Lagna, Moon, Nakshatra and dasha in a structured report you can actually read.",
      hi: "लग्न, चंद्र, नक्षत्र और दशा को ऐसी रिपोर्ट में देखें जिसे सच में पढ़ा जा सके।",
    },
  },
  {
    title: { en: "Tools for specific questions", hi: "विशिष्ट प्रश्नों के उपकरण" },
    text: {
      en: "Matching, Mangal Dosha, Sade Sati, dasha and dozens more calculators—each with its own page.",
      hi: "मिलान, मंगल दोष, साढ़े साती, दशा और दर्जनों कैलकुलेटर—प्रत्येक का अपना पृष्ठ।",
    },
  },
  {
    title: { en: "A guide that stays honest", hi: "ईमानदार मार्गदर्शक" },
    text: {
      en: "AI explains calculated results. No invented planets. No guaranteed predictions.",
      hi: "एआई गणना परिणाम समझाता है। गढ़े ग्रह नहीं। गारंटीशुदा भविष्यवाणी नहीं।",
    },
  },
] as const;

export function WhyPeopleExplore({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="py-14 sm:py-16">
      <div className="container-page">
        <Reveal>
          <h2 className="heading-1 font-display tracking-tight text-ink">
            {hi
              ? "लोग CosmicTalks क्यों देखते हैं"
              : "Why People Explore CosmicTalks"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">
            {hi
              ? "हम काल्पनिक प्रशंसापत्र नहीं दिखाते—केवल वे लाभ जो उत्पाद सच में देता है।"
              : "We don’t invent testimonials—only the benefits the product actually delivers."}
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title.en} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-saffron/20 surface-wash p-5">
                <h3 className="font-display text-lg font-semibold text-white">
                  {hi ? b.title.hi : b.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {hi ? b.text.hi : b.text.en}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
