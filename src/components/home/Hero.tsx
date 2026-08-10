"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/site-config";
import { CosmicBackground } from "./CosmicBackground";
import { HeroZodiacWheel } from "./HeroZodiacWheel";

export function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();
  const hi = locale === "hi";

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-14">
      <CosmicBackground />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative order-1 mx-auto min-w-0 w-full text-center lg:mx-0 lg:text-left"
          >
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="w-[min(48vw,12.5rem)]">
                <HeroZodiacWheel />
              </div>
            </div>

            <h1 className="heading-hero mx-auto mt-1 max-w-xl font-display tracking-tight lg:mx-0">
              {hi ? (
                <span className="bg-gradient-to-r from-saffron via-saffron-deep to-maroon bg-clip-text text-transparent">
                  भारत का AI ज्योतिष प्लेटफ़ॉर्म
                </span>
              ) : (
                <span className="bg-gradient-to-r from-saffron via-saffron-deep to-maroon bg-clip-text text-transparent">
                  India’s AI Astrology Platform
                </span>
              )}
            </h1>

            <p className="text-body mx-auto mt-3 max-w-lg text-ink-muted lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3 lg:justify-start">
              <Link
                href="/chat"
                className="btn-grad inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-ivory shadow-md shadow-saffron/20"
              >
                <MessageCircle className="h-4 w-4" />
                {hi ? "एआई से पूछें" : "Ask AI Now"}
              </Link>
              <Link
                href="/kundli"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-saffron/40 bg-white/95 px-4 py-2.5 text-sm font-semibold text-saffron-deep backdrop-blur-sm transition hover:bg-[#fff1e6]"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <ButtonLink
                href={whatsappLink()}
                variant="ghost"
                className="rounded-xl px-4 py-2.5 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("ctaSecondary")}
              </ButtonLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="relative order-2 mx-auto hidden w-full max-w-[26rem] lg:block lg:max-w-[30rem]"
          >
            <HeroZodiacWheel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
