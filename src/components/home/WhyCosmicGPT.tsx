import {
  Brain,
  Clock3,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal } from "./Reveal";

const CARDS = [
  {
    icon: HeartHandshake,
    title: { en: "Personalized", hi: "व्यक्तिगत" },
    text: {
      en: "Your guidance is based on your birth details.",
      hi: "आपका मार्गदर्शन आपके जन्म विवरण पर आधारित है।",
    },
  },
  {
    icon: Brain,
    title: { en: "AI-Powered", hi: "एआई-संचालित" },
    text: {
      en: "Ask questions naturally and get easy-to-understand answers.",
      hi: "प्राकृतिक भाषा में पूछें और सरल उत्तर पाएँ।",
    },
  },
  {
    icon: Sparkles,
    title: { en: "Vedic Astrology", hi: "वैदिक ज्योतिष" },
    text: {
      en: "Insights inspired by traditional Vedic astrology principles.",
      hi: "पारंपरिक वैदिक ज्योतिष सिद्धांतों से प्रेरित अंतर्दृष्टि।",
    },
  },
  {
    icon: Languages,
    title: { en: "Easy to Understand", hi: "समझने में आसान" },
    text: {
      en: "No complicated astrology terminology.",
      hi: "जटिल ज्योतिष शब्दावली नहीं।",
    },
  },
  {
    icon: Clock3,
    title: { en: "Available Anytime", hi: "कभी भी उपलब्ध" },
    text: {
      en: "Your personal astrology guide is always available.",
      hi: "आपका व्यक्तिगत ज्योतिष गाइड हमेशा उपलब्ध।",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "Private & Personal", hi: "निजी व सुरक्षित" },
    text: {
      en: "Your conversations and birth details are handled with care.",
      hi: "आपकी बातचीत और जन्म विवरण सावधानी से संभाले जाते हैं।",
    },
  },
] as const;

export function WhyCosmicGPT({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-b border-white/[0.06] py-12 sm:py-16">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {hi ? "क्यों CosmicTalks?" : "Why Use CosmicTalks?"}
            </h2>
            <p className="mt-3 font-ui text-sm text-ink-muted sm:text-[15px]">
              {hi
                ? "प्रीमियम एआई ज्योतिष — सरल भाषा में, आपकी कुंडली पर आधारित।"
                : "Premium AI astrology — in simple language, grounded in your chart."}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title.en} delay={Math.min(i * 0.04, 0.2)}>
                <article className="h-full rounded-2xl border border-white/[0.08] bg-[rgba(26,31,59,0.65)] p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cosmic-purple/15 text-cosmic-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-3 font-ui text-[15px] font-semibold text-white">
                    {hi ? card.title.hi : card.title.en}
                  </h3>
                  <p className="mt-1.5 font-ui text-[13px] leading-snug text-ink-muted">
                    {hi ? card.text.hi : card.text.en}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
