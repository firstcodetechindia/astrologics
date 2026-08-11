import { Reveal } from "./Reveal";

const CARDS = [
  {
    title: { en: "Calculated, not guessed", hi: "अनुमान नहीं—गणना" },
    text: {
      en: "Charts start from your real birth date, time and place.",
      hi: "चार्ट वास्तविक जन्म तिथि, समय और स्थान से शुरू होते हैं।",
    },
  },
  {
    title: { en: "Many traditions", hi: "कई परंपराएँ" },
    text: {
      en: "Kundli, Western, KP and numerology — each labelled clearly.",
      hi: "कुंडली, पश्चिमी, केपी और अंक ज्योतिष — प्रत्येक स्पष्ट।",
    },
  },
  {
    title: { en: "AI that explains", hi: "समझाने वाला एआई" },
    text: {
      en: "AI explains calculated results — it doesn’t invent planets.",
      hi: "एआई गणना परिणाम समझाता है — ग्रह गढ़ता नहीं।",
    },
  },
  {
    title: { en: "Simple language", hi: "सरल भाषा" },
    text: {
      en: "Clear tools and guides — without fear-based jargon.",
      hi: "स्पष्ट उपकरण और गाइड — भय आधारित भाषा के बिना।",
    },
  },
] as const;

export function WhyAstrologics({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="py-10 sm:py-12">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="heading-1 font-display tracking-tight text-ink">
              {hi ? "क्यों Astrologics?" : "Why Astrologics?"}
            </h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-[15px]">
              {hi
                ? "ज्योतिष सरल लगे — गणना पहले, व्याख्या स्पष्ट।"
                : "Astrology should feel clear — calculate first, explain simply."}
            </p>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <Reveal key={card.title.en} delay={Math.min(i * 0.04, 0.16)}>
              <article className="h-full rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
                <h3 className="font-display text-[15px] font-semibold text-[#6B1C1C]">
                  {hi ? card.title.hi : card.title.en}
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">
                  {hi ? card.text.hi : card.text.en}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
