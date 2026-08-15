import { Reveal } from "./Reveal";
import { HomeMediaPanel, HomeSplitGrid } from "./HomeMediaPanel";

export function TrustSection({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-b border-white/[0.06] py-12 sm:py-16">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(26,31,59,0.65)]">
            <HomeSplitGrid
              imageSide="left"
              image={
                <HomeMediaPanel
                  side="left"
                  src="/images/home/home-today-panchang.jpg"
                  alt={
                    hi
                      ? "चंद्रमा और राशि चक्र — व्यक्तिगत ज्योतिष"
                      : "Moon and zodiac sky — personal astrology"
                  }
                  minHeightClass="min-h-[240px] sm:min-h-[280px] lg:min-h-full"
                  className="rounded-none"
                  imageClassName="object-cover object-[center_40%]"
                >
                  <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
                    {hi
                      ? "ज्योतिष जो व्यक्तिगत लगे"
                      : "Astrology That Feels Personal"}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/90">
                    {hi
                      ? "कुंडली से शुरू — सरल भाषा में समझ।"
                      : "Starts with your chart — explained in plain language."}
                  </p>
                </HomeMediaPanel>
              }
              content={
                <div className="flex h-full flex-col justify-center p-5 sm:p-6 lg:p-8">
                  <p className="font-ui text-[15px] leading-relaxed text-ink-muted sm:text-base">
                    {hi
                      ? "CosmicTalks पारंपरिक ज्योतिष अवधारणाओं को आधुनिक एआई से जोड़ता है — ताकि ज्योतिषीय अंतर्दृष्टि समझना आसान हो। गणना आपकी जन्म कुंडली से शुरू होती है; एआई केवल उन परिणामों को सरल भाषा में समझाता है।"
                      : "CosmicTalks combines traditional astrology concepts with modern AI to make astrological insights easier to understand. Calculation starts from your birth chart; AI only explains those results in plain language."}
                  </p>
                </div>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
