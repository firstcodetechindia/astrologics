import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

const REVEALS = [
  {
    title: { en: "Personality", hi: "व्यक्तित्व" },
    text: { en: "Lagna, Moon and planetary patterns.", hi: "लग्न, चंद्र और ग्रहीय पैटर्न।" },
    href: "/learn/zodiac",
  },
  {
    title: { en: "Career", hi: "करियर" },
    text: {
      en: "10th house, D10 and relevant periods.",
      hi: "दशम भाव, D10 और संबंधित काल।",
    },
    href: "/learn/houses",
  },
  {
    title: { en: "Love & Marriage", hi: "प्रेम व विवाह" },
    text: {
      en: "7th house, Venus, Jupiter and D9.",
      hi: "सप्तम भाव, शुक्र, गुरु और D9।",
    },
    href: "/learn/love-marriage",
  },
  {
    title: { en: "Life Periods", hi: "जीवन काल" },
    text: {
      en: "Mahadasha, Antardasha and transits.",
      hi: "महादशा, अंतर्दशा और गोचर।",
    },
    href: "/calculators/vimshottari-dasha",
  },
  {
    title: { en: "Yogas & Doshas", hi: "योग व दोष" },
    text: {
      en: "Combinations explained with context.",
      hi: "संयोजन—संदर्भ सहित।",
    },
    href: "/learn/mangal-dosha",
  },
  {
    title: { en: "Wealth themes", hi: "धन विषय" },
    text: {
      en: "2nd, 5th, 9th and 11th house ideas.",
      hi: "द्वितीय, पंचम, नवम और एकादश भाव।",
    },
    href: "/learn/life-insights",
  },
] as const;

/** Compact life-area grid — glossary dump removed for cleaner UI */
export function KundliExplore({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="bg-cosmic-navy py-10 sm:py-12">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="heading-1 font-display tracking-tight text-ink">
                {hi
                  ? "कुंडली में क्या देखें?"
                  : "What can you explore in a Kundli?"}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-ink-muted">
                {hi
                  ? "जीवन क्षेत्रों के पारंपरिक संकेत — निश्चित भविष्यवाणी नहीं।"
                  : "Traditional indicators across life areas — not guaranteed predictions."}
              </p>
            </div>
            <Link
              href="/kundli"
              className="text-sm font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "मुफ्त कुंडली →" : "Free Kundli →"}
            </Link>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {REVEALS.map((item) => (
            <Link
              key={item.title.en}
              href={item.href}
              className="rounded-xl border border-white/10 bg-surface px-4 py-3.5 transition hover:border-saffron/35"
            >
              <h3 className="text-[14px] font-semibold text-ink">
                {hi ? item.title.hi : item.title.en}
              </h3>
              <p className="mt-1 text-[12px] text-ink-muted">
                {hi ? item.text.hi : item.text.en}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
