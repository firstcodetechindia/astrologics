import { Reveal } from "./Reveal";

const ITEMS = [
  { en: "Free Kundli", hi: "मुफ्त कुंडली" },
  { en: "Western · KP · Numerology", hi: "पश्चिमी · केपी · अंक ज्योतिष" },
  { en: "30+ Calculators", hi: "30+ कैलकुलेटर" },
  { en: "AI Astrology", hi: "एआई ज्योतिष" },
  { en: "English + Hindi", hi: "अंग्रेज़ी + हिंदी" },
] as const;

export function TrustStrip({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section aria-label={hi ? "विश्वास संकेत" : "Trust indicators"} className="border-b border-black/[0.05] bg-white/70">
      <Reveal>
            <div className="container-page py-3">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6">
            {ITEMS.map((item) => (
              <li
                key={item.en}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted sm:text-[13px]"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-saffron-deep"
                />
                {hi ? item.hi : item.en}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
