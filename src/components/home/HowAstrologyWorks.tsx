import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { HomeMediaPanel, HomeSplitGrid } from "./HomeMediaPanel";

const STEPS = [
  {
    n: "01",
    title: { en: "Birth details", hi: "जन्म विवरण" },
    text: {
      en: "Date, exact time and place.",
      hi: "तिथि, सटीक समय और स्थान।",
    },
  },
  {
    n: "02",
    title: { en: "Planetary positions", hi: "ग्रहीय स्थितियाँ" },
    text: {
      en: "Planet positions for your birth moment (Lahiri for kundli).",
      hi: "जन्म क्षण की ग्रह स्थिति (कुंडली के लिए लाहिरी)।",
    },
  },
  {
    n: "03",
    title: { en: "Your chart & tools", hi: "आपका चार्ट व उपकरण" },
    text: {
      en: "Kundli houses & stars — plus KP, Western and numerology tools.",
      hi: "कुंडली के भाव व नक्षत्र — साथ में केपी, पश्चिमी व अंक ज्योतिष।",
    },
  },
  {
    n: "04",
    title: { en: "Timing systems", hi: "समय तंत्र" },
    text: {
      en: "Dashas and transits for changing life periods.",
      hi: "दशा और गोचर—बदलते जीवन काल।",
    },
  },
  {
    n: "05",
    title: { en: "Clear interpretation", hi: "स्पष्ट व्याख्या" },
    text: {
      en: "Calculate first. Explain clearly. You decide.",
      hi: "पहले गणना। स्पष्ट व्याख्या। निर्णय आपका।",
    },
  },
] as const;

/** Image LEFT */
export function HowAstrologyWorks({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-y border-black/[0.04] bg-white py-10 sm:py-12">
      <div className="container-page">
        <Reveal>
          <HomeSplitGrid
            imageSide="left"
            className="gap-6 lg:gap-8"
            image={
              <HomeMediaPanel
                side="left"
                src="/images/home/home-how-works-kundli.jpg"
                alt={
                  hi
                    ? "पारंपरिक जन्म कुंडली चार्ट — गणना कैसे होती है"
                    : "Traditional Janam Kundli chart — how astrology is calculated"
                }
                imageClassName="object-cover object-center"
              >
                <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
                  {hi
                    ? "ज्योतिष कैसे काम करता है?"
                    : "How Does Astrology Work?"}
                </h2>
                <p className="mt-1.5 text-[13px] leading-snug text-white/95">
                  {hi
                    ? "अनुमान नहीं—स्पष्ट गणना, स्पष्ट पद्धति।"
                    : "Not guesswork—clear calculation, clear methods."}
                </p>
              </HomeMediaPanel>
            }
            content={
              <ol className="grid h-full content-center gap-2 sm:grid-cols-2">
                {STEPS.map((step) => (
                  <li
                    key={step.n}
                    className="flex gap-3 rounded-xl border border-black/[0.06] bg-white px-3.5 py-3 transition hover:border-saffron/30"
                  >
                    <span className="font-display text-sm font-bold text-saffron-deep">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-semibold text-ink">
                        {hi ? step.title.hi : step.title.en}
                      </h3>
                      <p className="mt-0.5 text-[12px] leading-snug text-ink-muted">
                        {hi ? step.text.hi : step.text.en}
                      </p>
                    </div>
                  </li>
                ))}
                <li className="flex items-center rounded-xl border border-dashed border-saffron/35 bg-[#fff7f0] px-3.5 py-3 sm:col-span-2">
                  <Link
                    href="/learn"
                    className="text-sm font-semibold text-saffron-deep hover:underline"
                  >
                    {hi
                      ? "ज्योतिष सीखना शुरू करें →"
                      : "Start learning astrology →"}
                  </Link>
                </li>
              </ol>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
