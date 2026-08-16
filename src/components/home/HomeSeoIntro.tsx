import { Link } from "@/i18n/navigation";

/** Crawlable homepage intro — keyword-relevant paragraphs, not a second H1. */
export function HomeSeoIntro({ locale }: { locale: string }) {
  const hi = locale === "hi";

  return (
    <section className="border-b border-white/[0.06] bg-cosmic-navy">
      <div className="container-page max-w-3xl py-10 sm:py-12">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {hi
            ? "मुफ्त कुंडली और एआई वैदिक ज्योतिष — एक जगह"
            : "Free Kundli & AI Vedic Astrology, All in One Place"}
        </h2>
        {hi ? (
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>
              CosmicTalks पर आप जन्म तिथि, समय और स्थान से{" "}
              <Link
                href="/kundli"
                className="font-semibold text-saffron-deep hover:underline"
              >
                मुफ्त कुंडली
              </Link>{" "}
              (जन्म कुंडली / जनम कुंडली) बना सकते हैं। यह जन्म चार्ट भारत की
              लाहिरी (चित्रापक्ष) पद्धति और पूर्ण-राशि भाव से गणना होता है —
              सामान्य सूर्य-राशि अनुमान नहीं। विधि{" "}
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                पद्धति
              </Link>{" "}
              पृष्ठ पर लिखी है, ताकि आप जाँच सकें।
            </p>
            <p>
              उसी चार्ट के इर्द-गिर्द वैदिक ज्योतिष (भाव, दशा, योग), अलग से
              चिह्नित पश्चिमी ज्योतिष व केपी ज्योतिष उपकरण,{" "}
              <Link
                href="/numerology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                अंक ज्योतिष
              </Link>{" "}
              (मूलांक, भाग्यांक, नाम अंक), और आज का{" "}
              <Link
                href="/panchang"
                className="font-semibold text-saffron-deep hover:underline"
              >
                पंचांग
              </Link>{" "}
              (तिथि, नक्षत्र, सूर्योदय) हैं। दो जन्म विवरण हों तो{" "}
              <Link
                href="/calculators/kundli-matching"
                className="font-semibold text-saffron-deep hover:underline"
              >
                कुंडली मिलान
              </Link>{" "}
              (अष्टकूट गुण मिलान) उसी टूलकिट में है।
            </p>
            <p>
              एआई ज्योतिष का अर्थ यहाँ यह है:{" "}
              <Link
                href="/chat"
                className="font-semibold text-saffron-deep hover:underline"
              >
                एआई गुरु
              </Link>{" "}
              केवल इंजन से निकली ग्रह स्थिति समझाता है; वह ग्रह गढ़ता नहीं।
              हिंदी और अंग्रेज़ी दोनों प्रथम भाषाएँ हैं। मुफ्त कुंडली से शुरू
              करें, फिर चार्ट पर प्रश्न पूछें, चिह्नित कैलकुलेटर खोलें, या केवल
              दैनिक नोट चाहिए तो आज का{" "}
              <Link
                href="/horoscope"
                className="font-semibold text-saffron-deep hover:underline"
              >
                राशिफल
              </Link>{" "}
              देखें।
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>
              CosmicTalks is where you generate a{" "}
              <Link
                href="/kundli"
                className="font-semibold text-saffron-deep hover:underline"
              >
                free kundli
              </Link>{" "}
              — a janam kundli / birth chart — from your date, time and place of
              birth. Planetary longitudes use India&apos;s Lahiri (Chitrapaksha)
              ayanamsa and whole-sign houses, not a generic sun-sign blurb. The
              calculation steps are on{" "}
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                Methodology
              </Link>
              , so you can verify them instead of taking a slogan on faith.
            </p>
            <p>
              Around that chart you can read Vedic astrology (houses, dasha,
              yogas), open Western astrology and KP astrology tools that are
              labelled as such, run{" "}
              <Link
                href="/numerology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                numerology
              </Link>{" "}
              (mulank, bhagyank, name number), and check today&apos;s{" "}
              <Link
                href="/panchang"
                className="font-semibold text-saffron-deep hover:underline"
              >
                Panchang
              </Link>{" "}
              for tithi, nakshatra and sunrise. When you have two birth
              details,{" "}
              <Link
                href="/calculators/kundli-matching"
                className="font-semibold text-saffron-deep hover:underline"
              >
                kundli matching
              </Link>{" "}
              (Ashtakoot gun milan) is in the same toolkit.
            </p>
            <p>
              AI astrology here means{" "}
              <Link
                href="/chat"
                className="font-semibold text-saffron-deep hover:underline"
              >
                AI Guru
              </Link>{" "}
              explains grahas the engine already computed; it does not invent
              them. English and Hindi are both first-class. Start with a free
              kundli, then ask a chart question, read a labelled calculator, or
              open today&apos;s{" "}
              <Link
                href="/horoscope"
                className="font-semibold text-saffron-deep hover:underline"
              >
                horoscope
              </Link>{" "}
              if you only need a daily note.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
