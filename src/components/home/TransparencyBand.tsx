import { Reveal } from "./Reveal";

const POINTS = [
  {
    en: "Exact birth details matter for Lagna and houses",
    hi: "लग्न और भावों के लिए सटीक जन्म विवरण आवश्यक",
  },
  {
    en: "Kundli engine: Lahiri sidereal · Western, KP & numerology labelled separately",
    hi: "कुंडली इंजन: लाहिरी निरयण · पश्चिमी, केपी व अंक ज्योतिष अलग स्पष्ट",
  },
  {
    en: "Whole-sign houses and deterministic calculations for charts",
    hi: "चार्ट के लिए पूर्ण-राशि भाव और निश्चित गणना",
  },
  {
    en: "AI for interpretation—not invented planetary positions",
    hi: "एआई व्याख्या के लिए—गढ़ी हुई ग्रह स्थिति नहीं",
  },
] as const;

export function TransparencyBand({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-y border-saffron/15 bg-white py-14 sm:py-16">
      <div className="container-page">
        <Reveal>
          <h2 className="heading-1 max-w-2xl font-display tracking-tight text-ink">
            {hi ? "स्पष्ट ज्योतिष के लिए बनाया गया" : "Built for Clearer Astrology"}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-muted sm:text-base">
            {hi
              ? "Astrologics गणना और व्याख्या को अलग रखता है। जन्म कुंडली लाहिरी पद्धति से बनती है; पश्चिमी, केपी और अंक ज्योतिष अलग उपकरण हैं। एआई गणना परिणाम समझाने में मदद करता है—पद्धति गढ़ता नहीं।"
              : "Astrologics separates calculation from interpretation. Janam Kundli uses the Lahiri method; Western, KP and numerology are separate toolsets. AI helps explain calculated results—it does not invent the method."}
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {POINTS.map((p) => (
            <Reveal key={p.en}>
              <li className="flex gap-3 rounded-xl border border-black/[0.06] bg-[#faf7f4] px-4 py-3 text-sm font-medium text-ink">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-saffron-deep"
                />
                {hi ? p.hi : p.en}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
