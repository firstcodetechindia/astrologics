import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getFeaturedAstrologers } from "@/lib/astrologers/directory";
import { AstrologerCard } from "@/components/talk/AstrologerCard";
import { Reveal } from "./Reveal";

export function TopAstrologers({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const featured = getFeaturedAstrologers(8);

  return (
    <section className="relative overflow-hidden border-y border-saffron/15 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_55%,#fff3ea_100%)] py-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(240,106,0,0.10), transparent 40%), radial-gradient(circle at 90% 10%, rgba(240,106,0,0.08), transparent 35%)",
        }}
      />

      <div className="container-page relative">
        <Reveal>
          <div className="w-full">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="uppercase tracking-[0.12em] text-red-600">
                {hi ? "लाइव नाउ" : "Live now"}
              </span>
            </p>
            <h2 className="mt-2 font-display text-[1.55rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.85rem]">
              {hi ? (
                <>
                  भारत के <span className="text-[#F06A00]">टॉप रेटेड</span>{" "}
                  ज्योतिषियों से बात करें
                </>
              ) : (
                <>
                  Talk to India&apos;s{" "}
                  <span className="text-[#F06A00]">Top Rated</span> Astrologers
                </>
              )}
            </h2>
            <p className="mt-3 w-full text-[13.5px] leading-relaxed text-ink-muted sm:text-[15px]">
              {hi
                ? "ऑनलाइन सर्वश्रेष्ठ ज्योतिषी से बात करें और अपने संबंधों, करियर, वित्त तथा जीवन के अन्य महत्वपूर्ण निर्णयों पर स्पष्ट मार्गदर्शन पाएँ। भरोसेमंद अंतर्दृष्टि, सटीक भविष्यवाणियाँ और पूर्ण गोपनीयता के साथ आप आत्मविश्वास से अगला कदम बढ़ाएँ। दो दशकों से अधिक की विशेषज्ञता और 500+ विशेषज्ञ ज्योतिषियों की 24/7 उपलब्धता के साथ, आपकी आगे की यात्रा में हमेशा सहायता और स्पष्टता मिलेगी।"
                : "Talk to the best astrologer online and get clear guidance on your relationships, career, finances, and other important life choices you’re about to make. You get trusted insights, accurate predictions with complete privacy, and take the next step in life with confidence. With over two decades of expertise and with 500+ experts astrologer available 24/7, you’ll always find support and clarity with us on your journey forward."}
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((a, i) => (
            <Reveal key={a.id} delay={0.04 * i}>
              <AstrologerCard astrologer={a} locale={locale} compact />
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/chat-with-astrologer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffc107] px-5 py-2.5 text-[13px] font-bold text-[#2a2118] shadow-[0_10px_22px_-12px_rgba(255,193,7,0.85)] transition hover:bg-[#ffb300]"
          >
            {hi ? "सभी ज्योतिषी देखें" : "View all astrologers"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
