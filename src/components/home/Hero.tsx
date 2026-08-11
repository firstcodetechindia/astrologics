"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CosmicBackground } from "./CosmicBackground";
import { HeroZodiacWheel } from "./HeroZodiacWheel";

export function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();
  const hi = locale === "hi";
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-saffron/15">
      <CosmicBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--ivory)] to-transparent"
      />

      <div className="container-page relative z-10 py-8 sm:py-10 lg:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left"
          >
            <div className="mb-4 flex w-full justify-center lg:hidden">
              <div className="mx-auto w-[11rem] sm:w-[12.5rem]">
                <HeroZodiacWheel />
              </div>
            </div>

            <h1 className="hero-title font-display">
              {hi ? (
                <>
                  <span className="hero-title-line1">
                    जन्म कुंडली, कैलकुलेटर और एआई ज्योतिष
                  </span>
                  <span className="hero-title-line2">— एक जगह</span>
                </>
              ) : (
                <>
                  <span className="hero-title-line1">
                    Birth Chart, Calculators & AI Astrology
                  </span>
                  <span className="hero-title-line2">— in One Place</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-lg text-[15px] font-medium leading-relaxed text-ink-muted">
              {hi ? (
                <>
                  <span className="font-semibold text-[#6B1C1C]">Astrologics</span>
                  {" "}
                  एक आधुनिक ज्योतिष प्लेटफ़ॉर्म है — जहाँ कुंडली, पश्चिमी·केपी·अंक ज्योतिष और एआई गाइड एक साथ मिलते हैं।
                </>
              ) : (
                <>
                  <span className="font-semibold text-[#6B1C1C]">Astrologics</span>
                  {" "}
                  is a modern astrology platform — bringing kundli, Western, KP, numerology and AI guidance together in one clear place.
                </>
              )}
            </p>

            <p className="text-body mt-3 max-w-lg text-ink-muted">
              {hi
                ? "मुफ्त जन्म कुंडली बनाएँ, पश्चिमी·केपी·अंक ज्योतिष उपकरण आज़माएँ, और अपनी कुंडली पर एआई से स्पष्ट उत्तर पाएँ।"
                : "Create your free Janam Kundli, try Western, KP and numerology tools, and get clear AI answers about your chart."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/kundli"
                className="btn-grad inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold text-ivory shadow-md shadow-saffron/25 transition hover:brightness-[1.03]"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6B1C1C]/25 bg-white/90 px-5 py-3 text-sm font-semibold text-[#6B1C1C] backdrop-blur-sm transition hover:border-saffron/40 hover:bg-[#fff1e6]"
              >
                <MessageCircle className="h-4 w-4" />
                {hi ? "एआई गुरु से पूछें" : "Ask AI Guru"}
              </Link>
            </div>

            <p className="mt-4 text-[13px] text-ink-muted">
              {hi
                ? "आपकी सटीक जन्म तिथि, समय और स्थान पर आधारित।"
                : "Based on your exact birth date, time and place."}
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.65, ease: "easeOut" }}
            className="relative mx-auto hidden w-full max-w-[22rem] justify-self-center lg:block xl:max-w-[24rem]"
          >
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(240,106,0,0.18),transparent_68%)] blur-2xl"
            />
            <HeroZodiacWheel />
            <p className="mt-2 text-center text-[12px] font-medium text-ink-muted">
              {hi
                ? "कई परंपराएँ × आधुनिक गणना"
                : "Many traditions × modern calculation"}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
