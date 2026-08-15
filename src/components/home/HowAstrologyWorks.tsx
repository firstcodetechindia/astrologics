import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { HomeMediaPanel, HomeSplitGrid } from "./HomeMediaPanel";

const STEPS = [
  {
    n: "01",
    title: { en: "Enter Your Birth Details", hi: "जन्म विवरण दर्ज करें" },
    text: {
      en: "Date, time and place of birth.",
      hi: "जन्म तिथि, समय और स्थान।",
    },
  },
  {
    n: "02",
    title: { en: "Ask Your Question", hi: "अपना प्रश्न पूछें" },
    text: {
      en: "Ask anything about your life, career, love or future.",
      hi: "जीवन, करियर, प्रेम या भविष्य के बारे में कुछ भी पूछें।",
    },
  },
  {
    n: "03",
    title: { en: "Get Personalized Guidance", hi: "व्यक्तिगत मार्गदर्शन पाएँ" },
    text: {
      en: "CosmicTalks analyzes your astrological information and explains the insights in simple language.",
      hi: "CosmicTalks आपकी ज्योतिष जानकारी का विश्लेषण कर सरल भाषा में समझाता है।",
    },
  },
] as const;

export function HowAstrologyWorks({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="relative border-b border-white/[0.06] py-12 sm:py-16">
      <div className="container-page relative">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(26,31,59,0.65)]">
            <HomeSplitGrid
              imageSide="right"
              image={
                <HomeMediaPanel
                  side="right"
                  src="/images/home/home-how-works-kundli.jpg"
                  alt={
                    hi
                      ? "जन्म कुंडली चार्ट — गणना से मार्गदर्शन तक"
                      : "Birth chart kundli — from calculation to guidance"
                  }
                  minHeightClass="min-h-[240px] sm:min-h-[280px] lg:min-h-full"
                  className="rounded-none"
                  imageClassName="object-cover object-center"
                >
                  <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
                    {hi ? "यह कैसे काम करता है" : "How it works"}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/90">
                    {hi
                      ? "तीन सरल चरण — गणना पहले, फिर स्पष्ट व्याख्या।"
                      : "Three simple steps — calculate first, then clear explanation."}
                  </p>
                </HomeMediaPanel>
              }
              content={
                <div className="flex h-full flex-col justify-center p-5 sm:p-6 lg:p-8">
                  <ol className="space-y-4">
                    {STEPS.map((step) => (
                      <li key={step.n} className="flex gap-3">
                        <span className="mt-0.5 font-ui text-xs font-bold tracking-[0.16em] text-gradient-brand">
                          {step.n}
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-white">
                            {hi ? step.title.hi : step.title.en}
                          </h3>
                          <p className="mt-1 font-ui text-sm leading-relaxed text-ink-muted">
                            {hi ? step.text.hi : step.text.en}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6">
                    <Link
                      href="/kundli"
                      className="btn-grad inline-flex px-5 py-3 font-ui text-sm font-semibold text-white"
                    >
                      {hi ? "अभी शुरू करें" : "Get started"}
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
