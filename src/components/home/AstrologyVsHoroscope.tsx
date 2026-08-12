import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

export function AstrologyVsHoroscope({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-8 rounded-3xl border border-saffron/20 surface-wash p-6 sm:p-10 lg:grid-cols-2">
            <div>
              <h2 className="heading-1 font-display tracking-tight text-ink">
                {hi
                  ? "कुंडली बनाम सामान्य राशिफल"
                  : "Birth Chart vs Generic Horoscope"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                {hi
                  ? "दैनिक राशिफल बारह राशियों के सामान्य विषयों पर आधारित हो सकता है। जन्म कुंडली आपके सटीक जन्म विवरण से बनती है—लग्न, भाव, नक्षत्र, दशा और योग सहित।"
                  : "A daily horoscope can speak to shared themes for twelve signs. A Janam Kundli is built from your exact birth details—Lagna, houses, Nakshatras, dashas and yogas included."}
              </p>
            </div>
            <div className="space-y-3 text-sm text-ink">
              <p className="rounded-xl bg-surface/85 px-4 py-3 border border-white/10">
                <span className="font-semibold text-saffron-deep">
                  {hi ? "राशिफल: " : "Horoscope: "}
                </span>
                {hi
                  ? "त्वरित दैनिक झलक—शुरुआत के लिए उपयोगी।"
                  : "A quick daily snapshot—useful as a starting point."}
              </p>
              <p className="rounded-xl bg-surface/85 px-4 py-3 border border-white/10">
                <span className="font-semibold text-white">
                  {hi ? "कुंडली: " : "Kundli: "}
                </span>
                {hi
                  ? "व्यक्तिगत चार्ट—जब आप गहराई और समय-संदर्भ चाहते हों।"
                  : "A personal chart—when you want depth and timing context."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/kundli"
                  className="text-sm font-semibold text-saffron-deep hover:underline"
                >
                  {hi ? "कुंडली बनाएँ →" : "Generate Kundli →"}
                </Link>
                <Link
                  href="/horoscope"
                  className="text-sm font-semibold text-ink-muted hover:text-saffron-deep hover:underline"
                >
                  {hi ? "आज का राशिफल →" : "Today’s horoscope →"}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
