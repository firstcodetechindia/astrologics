import {
  Briefcase,
  Calculator,
  Coins,
  Compass,
  Heart,
  MoonStar,
  Orbit,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

const SERVICES = [
  {
    href: "/kundli",
    icon: Orbit,
    title: { en: "Birth Chart", hi: "जन्म कुंडली" },
    text: { en: "Full Janam Kundli from your birth details.", hi: "जन्म विवरण से पूर्ण जन्म कुंडली।" },
  },
  {
    href: "/kundli",
    icon: Compass,
    title: { en: "Kundli Analysis", hi: "कुंडली विश्लेषण" },
    text: { en: "Houses, dashas, yogas — explained clearly.", hi: "भाव, दशा, योग — स्पष्ट व्याख्या।" },
  },
  {
    href: "/chat",
    icon: Heart,
    title: { en: "Love & Relationships", hi: "प्रेम व संबंध" },
    text: { en: "Ask about timing, compatibility and harmony.", hi: "समय, अनुकूलता और सामंजस्य पूछें।" },
  },
  {
    href: "/chat",
    icon: Briefcase,
    title: { en: "Career & Business", hi: "करियर व व्यवसाय" },
    text: { en: "Guidance for work, growth and decisions.", hi: "कार्य, विकास और निर्णयों हेतु मार्गदर्शन।" },
  },
  {
    href: "/calculators/kundli-matching",
    icon: Users,
    title: { en: "Marriage", hi: "विवाह" },
    text: { en: "Gun milan and marriage-theme insights.", hi: "गुण मिलान और विवाह विषय अंतर्दृष्टि।" },
  },
  {
    href: "/chat",
    icon: Coins,
    title: { en: "Finance & Wealth", hi: "वित्त व धन" },
    text: { en: "Chart-informed money and opportunity themes.", hi: "कुंडली-आधारित धन व अवसर विषय।" },
  },
  {
    href: "/horoscope",
    icon: MoonStar,
    title: { en: "Daily Horoscope", hi: "दैनिक राशिफल" },
    text: { en: "Moon-sign guidance for today.", hi: "आज हेतु चंद्र राशि मार्गदर्शन।" },
  },
  {
    href: "/numerology",
    icon: Calculator,
    title: { en: "Numerology", hi: "अंक ज्योतिष" },
    text: { en: "Mulank, Bhagyank and name numbers.", hi: "मूलांक, भाग्यांक और नाम अंक।" },
  },
  {
    href: "/calculators/kundli-matching",
    icon: Waves,
    title: { en: "Compatibility", hi: "अनुकूलता" },
    text: { en: "Relationship and partnership matching.", hi: "संबंध और साझेदारी मिलान।" },
  },
  {
    href: "/chat",
    icon: Sparkles,
    title: { en: "Life Path", hi: "जीवन पथ" },
    text: { en: "Big-picture themes from your chart.", hi: "आपकी कुंडली से बड़े विषय।" },
  },
] as const;

export function ServiceCards({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-b border-white/[0.06] py-12 sm:py-16">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-cosmic-gold">
              {hi ? "सेवाएँ" : "Services"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {hi ? "आपके जीवन के हर प्रश्न हेतु" : "For every question about your life"}
            </h2>
            <p className="mt-3 font-ui text-sm text-ink-muted sm:text-[15px]">
              {hi
                ? "कुंडली से लेकर एआई चैट तक — साफ़, आधुनिक उपकरण।"
                : "From birth charts to AI chat — clear, modern tools."}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title.en} delay={Math.min(i * 0.03, 0.2)}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[rgba(26,31,59,0.65)] p-4 transition hover:-translate-y-0.5 hover:border-cosmic-purple/40 hover:shadow-[0_16px_40px_-20px_rgba(108,60,255,0.45)]"
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cosmic-purple/25 bg-cosmic-purple/10 text-cosmic-gold transition group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-ui text-sm font-semibold text-white">
                    {hi ? s.title.hi : s.title.en}
                  </h3>
                  <p className="mt-1.5 font-ui text-[12px] leading-snug text-ink-muted">
                    {hi ? s.text.hi : s.text.en}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
