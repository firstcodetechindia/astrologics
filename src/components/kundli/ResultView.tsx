"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { KundliResult } from "@/lib/astrology/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { KundliReport } from "./KundliReport";

export function ResultView() {
  const t = useTranslations("result");
  const locale = useLocale() as "en" | "hi";
  const [kundli, setKundli] = useState<KundliResult | null>(null);

  useEffect(() => {
    const raw =
      sessionStorage.getItem("astrologics_kundli") ||
      sessionStorage.getItem("vedic_kundli");
    if (raw) setKundli(JSON.parse(raw));
  }, []);

  const hi = locale === "hi";

  if (!kundli) {
    return (
      <div className="bg-[#faf8f5]">
        <PageHero
          eyebrow="Kundli"
          title={t("title")}
          description={t("subtitle")}
          crumbs={[
            { label: hi ? "होम" : "Home", href: "/" },
            { label: hi ? "कुंडली" : "Kundli", href: "/kundli" },
            { label: hi ? "परिणाम" : "Result" },
          ]}
        />
        <div className="container-page py-8">
          <GlassCard className="max-w-lg mx-auto text-center">
            <p className="text-ink-muted">{t("subtitle")}</p>
            <Link
              href="/kundli"
              className="mt-4 inline-block text-saffron-deep font-semibold underline"
            >
              {t("newKundli")}
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] pb-24 sm:pb-10">
      <div className="border-b border-black/[0.04] bg-gradient-to-b from-[#fff6ea] to-[#faf8f5]">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <nav className="flex flex-wrap items-center gap-1.5 text-ink-muted">
            <Link href="/" className="hover:text-ink">
              {hi ? "होम" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/kundli" className="hover:text-ink">
              {hi ? "कुंडली" : "Kundli"}
            </Link>
            <span>/</span>
            <span className="text-ink">{hi ? "परिणाम" : "Result"}</span>
          </nav>
          <Link
            href="/kundli"
            className="inline-flex items-center justify-center rounded-lg border border-saffron/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-[#fff1e6]"
          >
            {t("newKundli")}
          </Link>
        </div>
      </div>
      <motion.div
        className="container-page py-6 sm:py-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <KundliReport kundli={kundli} />
      </motion.div>
    </div>
  );
}
