import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

export function FinalCta({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="relative overflow-hidden py-12 sm:py-14">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#6B1C1C] via-[#8f2e14] to-[#F06A00]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.25), transparent 40%)",
        }}
      />
      <div className="container-page relative z-10 text-center text-ivory">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {hi
              ? "आपकी जन्म कुंडली व्यक्तिगत है। आपकी समझ भी वैसी ही होनी चाहिए।"
              : "Your Birth Chart Is Personal. Your Understanding Should Be Too."}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
            {hi
              ? "जन्म विवरण से शुरू करें और कुंडली, दशा, नक्षत्र व जीवन विषयों को एक जगह देखें।"
              : "Start with your birth details and explore your Kundli, Dashas, Nakshatra and life themes in one place."}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[13px] font-medium text-white/70">
            {hi
              ? "समझें अपनी कुंडली। समझें अपने पैटर्न। खोजें अपनी संभावनाएँ।"
              : "Understand your chart. Understand your patterns. Explore your possibilities."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kundli"
              className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#6B1C1C] shadow-md transition hover:bg-[#fff7f0]"
            >
              {hi ? "मुफ्त कुंडली बनाएँ" : "Generate Free Kundli"}
            </Link>
            <Link
              href="/calculators"
              className="inline-flex rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {hi ? "ज्योतिष उपकरण देखें" : "Explore Astrology Tools"}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
