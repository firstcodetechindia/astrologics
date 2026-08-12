"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowRight, Mic, Send, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HomeGalaxyBackground } from "./HomeGalaxyBackground";

const SUGGESTED = [
  { en: "Will I get married soon?", hi: "क्या मेरी शादी जल्द होगी?" },
  { en: "What does my career look like?", hi: "मेरा करियर कैसा दिखता है?" },
  { en: "Tell me about my love life", hi: "मेरे प्रेम जीवन के बारे में बताएँ" },
  { en: "What does my birth chart say?", hi: "मेरी जन्म कुंडली क्या कहती है?" },
] as const;

export function Hero() {
  const locale = useLocale();
  const hi = locale === "hi";
  const reduce = useReducedMotion();

  return (
    <section className="relative -mt-[var(--site-header-h)] overflow-hidden border-b border-white/[0.06] pt-[var(--site-header-h)]">
      <HomeGalaxyBackground />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        {/* Light photo wash only — galaxy + nebula carry the scene */}
        <Image
          src="/images/home/home-hero-cosmic.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-[0.08]"
        />
        {/* Soft side wash — leave breathing room under header so menu stays clear */}
        <div className="absolute inset-y-0 left-0 w-[min(100%,42rem)] bg-gradient-to-r from-[#0B0F1F]/95 via-[#0B0F1F]/62 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[calc(var(--site-header-h)+1.25rem)] bg-gradient-to-b from-[#0B0F1F]/75 via-[#0B0F1F]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0F1F] via-[#0B0F1F]/55 to-transparent [mask-image:linear-gradient(90deg,#000_0%,#000_55%,transparent_88%)] [-webkit-mask-image:linear-gradient(90deg,#000_0%,#000_55%,transparent_88%)]" />
      </div>
      <div className="container-page relative z-10 pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-ui text-[10px] font-semibold uppercase leading-normal tracking-[0.18em] text-cosmic-gold sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-cosmic-purple" />
              {hi ? "एआई-संचालित वैदिक ज्योतिष" : "AI-Powered Vedic Astrology"}
            </p>

            <h1 className="hero-title max-w-xl overflow-visible">
              {hi ? (
                <>
                  <span className="hero-title-line1">आइए अपने सितारों को</span>
                  <span className="hero-title-line2">समझें</span>
                </>
              ) : (
                <>
                  <span className="hero-title-line1">Let&apos;s Decode</span>
                  <span className="hero-title-line2">Your Stars</span>
                </>
              )}
            </h1>

            <p className="mt-5 max-w-lg font-ui text-[15px] leading-[1.7] text-ink-muted sm:text-base">
              {hi
                ? "प्रेम, करियर, संबंध, भविष्य और अधिक के बारे में पूछें — और अपनी जन्म कुंडली पर आधारित व्यक्तिगत मार्गदर्शन पाएँ।"
                : "Ask questions about your love, career, relationships, future and more — and get personalized guidance based on your birth chart."}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/chat"
                className="btn-grad inline-flex items-center justify-center gap-2 px-5 py-3.5 font-ui text-sm font-semibold leading-normal text-white"
              >
                {hi ? "अपनी ज्योतिष यात्रा शुरू करें" : "Start Your Astrology Journey"}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href="/kundli"
                className="btn-secondary-cosmic inline-flex items-center justify-center gap-2 px-5 py-3.5 font-ui text-sm font-semibold leading-normal"
              >
                {hi ? "जन्म कुंडली देखें" : "Explore Your Birth Chart"}
              </Link>
            </div>
          </motion.div>

          {/* Premium AI chat preview */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className={`relative ${reduce ? "" : "cosmic-float"}`}
          >
            <div className="absolute -inset-3 rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_20%,rgba(108,60,255,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(255,138,61,0.2),transparent_50%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(26,31,59,0.78)] shadow-[0_24px_64px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C3CFF,#FF5CA8,#FF8A3D)] shadow-[0_0_20px_rgba(108,60,255,0.45)]">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <p className="font-ui text-sm font-semibold text-white">CosmicGPT</p>
                    <p className="font-ui text-[11px] text-ink-muted">
                      {hi ? "जन्म कुंडली संदर्भ सक्रिय" : "Birth-chart context on"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-cosmic-purple/40 bg-cosmic-purple/15 px-2.5 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-wider text-cosmic-gold">
                  {hi ? "लाइव" : "Live"}
                </span>
              </div>

              <div className="space-y-3 px-4 py-4">
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-cosmic-purple/25 px-3.5 py-2.5 font-ui text-[13px] leading-relaxed text-white">
                  {hi
                    ? "क्या इस साल मेरे करियर में बदलाव होगा?"
                    : "Will I have a career change this year?"}
                </div>
                <div className="flex gap-2">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C3CFF,#FF8A3D)]">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </span>
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 font-ui text-[13px] leading-relaxed text-ink-muted">
                    {hi
                      ? "आपकी वर्तमान दशा और दसवें भाव की स्थिति करियर गति की ओर इशारा करती है। बदलाव संभव है — खासकर जब आप कौशल और नेटवर्क पर ध्यान दें। मैं विवरण कुंडली से समझा सकता/सकती हूँ।"
                      : "Your current dasha and 10th-house patterns point to career momentum. A shift is possible — especially when you focus skills and network. I can walk through the chart details with you."}
                  </div>
                </div>
                {!reduce ? (
                  <div className="flex items-center gap-1.5 pl-9 text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-cosmic-purple [animation:ai-typing_1.2s_ease-in-out_infinite]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cosmic-pink [animation:ai-typing_1.2s_ease-in-out_0.15s_infinite]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cosmic-orange [animation:ai-typing_1.2s_ease-in-out_0.3s_infinite]" />
                  </div>
                ) : null}
              </div>

              <div className="border-t border-white/[0.07] px-3 py-3">
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  {SUGGESTED.slice(0, 3).map((q) => (
                    <Link
                      key={q.en}
                      href="/chat"
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-ui text-[11px] text-ink-muted transition hover:border-cosmic-purple/40 hover:text-white"
                    >
                      {hi ? q.hi : q.en}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B0F1F]/70 px-3 py-2">
                  <button
                    type="button"
                    aria-label="Microphone"
                    className="rounded-full p-1.5 text-ink-muted transition hover:text-white"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <span className="flex-1 font-ui text-[13px] text-ink-muted/80">
                    {hi ? "अपना प्रश्न पूछें…" : "Ask your question…"}
                  </span>
                  <Link
                    href="/chat"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(90deg,#6C3CFF,#FF8A3D)] text-white shadow-[0_0_16px_rgba(108,60,255,0.45)]"
                    aria-label="Send"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
