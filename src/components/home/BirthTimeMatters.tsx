import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

export function BirthTimeMatters({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-y border-saffron/15 surface-wash py-14 sm:py-16">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <h2 className="heading-1 font-display tracking-tight text-ink">
              {hi
                ? "ज्योतिष में जन्म समय क्यों मायने रखता है?"
                : "Why Does Your Birth Time Matter in Astrology?"}
            </h2>
            <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-muted">
              <p>
                {hi
                  ? "जन्म तिथि ग्रहों की मोटे तौर पर स्थिति पहचानने में मदद करती है। जन्म समय लग्न तय करने में सहायक होता है—और लग्न पूरे भाव-क्रम को निर्धारित करता है।"
                  : "Birth date identifies planetary positions. Birth time helps determine Lagna—and Lagna sets the whole-sign house sequence for the chart."}
              </p>
              <p>
                {hi
                  ? "जन्म स्थान अक्षांश/देशांतर देता है; समय-क्षेत्र खगोलीय रूपांतरण को प्रभावित करता है। जब लग्न राशि सीमा के निकट हो, तो छोटा अंतर भी भाव-आधारित व्याख्या को बदल सकता है।"
                  : "Birth place supplies latitude and longitude; timezone affects astronomical conversion. Even a small difference can matter when the Ascendant is close to a sign boundary."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="rounded-2xl border border-[#6B1C1C]/15 bg-surface/90 p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-white">
                {hi ? "सटीक समय नहीं पता?" : "Not sure about your birth time?"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {hi
                  ? "भाव और समय-आधारित पठन अनुमानित जन्म समय पर कम विश्वसनीय हो सकते हैं। चंद्र राशि और कुछ नक्षत्र-विषय फिर भी उपयोगी आरंभ बिंदु हो सकते हैं। अभिलेख न हों तो जन्म समय सुधार (अनुमान) आज़माएँ।"
                  : "Readings involving houses and timing may have lower reliability when birth time is approximate. Moon sign and some Nakshatra themes can still be useful starting points. If records are missing, try birth-time rectification (heuristic)."}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href="/calculators/birth-time-rectification"
                  className="btn-grad inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold text-ivory"
                >
                  {hi ? "जन्म समय सुधार" : "Rectify birth time"}
                </Link>
                <Link
                  href="/kundli"
                  className="inline-flex rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  {hi ? "अपनी कुंडली बनाएँ" : "Generate Your Kundli"}
                </Link>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
