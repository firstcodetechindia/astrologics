"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { KundliResult } from "@/lib/astrology/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { KundliReport } from "./KundliReport";

const STORAGE_KEYS = ["astrologics_kundli", "vedic_kundli"] as const;

/** Minimum shape needed to render the report without crashing. */
function isUsableKundli(value: unknown): value is KundliResult {
  if (!value || typeof value !== "object") return false;
  const k = value as Partial<KundliResult>;
  return Boolean(
    k.input &&
      k.lagna?.sign &&
      Array.isArray(k.planets) &&
      k.planets.length > 0 &&
      k.dasha?.currentMaha &&
      k.nakshatra?.name &&
      k.moonRashi &&
      k.reliability
  );
}

function clearStoredKundli() {
  try {
    for (const key of STORAGE_KEYS) sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function EmptyResult({
  title,
  subtitle,
  cta,
  hi,
}: {
  title: string;
  subtitle: string;
  cta: string;
  hi: boolean;
}) {
  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        eyebrow="Kundli"
        title={title}
        description={subtitle}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "कुंडली" : "Kundli", href: "/kundli" },
          { label: hi ? "परिणाम" : "Result" },
        ]}
      />
      <div className="container-page py-8">
        <GlassCard className="max-w-lg mx-auto text-center">
          <p className="text-ink-muted">{subtitle}</p>
          <Link
            href="/kundli"
            className="mt-4 inline-block text-saffron-deep font-semibold underline"
          >
            {cta}
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}

export function ResultView() {
  const t = useTranslations("result");
  const locale = useLocale() as "en" | "hi";
  const [kundli, setKundli] = useState<KundliResult | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    try {
      let raw: string | null = null;
      for (const key of STORAGE_KEYS) {
        raw = sessionStorage.getItem(key);
        if (raw) break;
      }
      if (!raw) {
        setKundli(null);
        setReady(true);
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!isUsableKundli(parsed)) {
        clearStoredKundli();
        setKundli(null);
        setLoadError(true);
        setReady(true);
        return;
      }
      // Older stored charts may lack settings — fill safe defaults so UI never throws.
      if (!parsed.settings) {
        parsed.settings = {
          zodiac: "sidereal",
          ayanamsa: "lahiri",
          houseSystem: "whole-sign",
          nodeType: "mean",
          ephemerisEngine: "astronomy-engine",
        };
      }
      if (!parsed.yogas) parsed.yogas = [];
      if (!parsed.insights) parsed.insights = [];
      if (!parsed.doshas) {
        parsed.doshas = {
          manglik: {
            present: false,
            meaning: {
              en: "Regenerate kundli for dosha details.",
              hi: "दोष विवरण के लिए कुंडली फिर बनाएँ।",
            },
          },
          kaalSarp: {
            present: false,
            meaning: {
              en: "Regenerate kundli for dosha details.",
              hi: "दोष विवरण के लिए कुंडली फिर बनाएँ।",
            },
          },
        };
      }
      setKundli(parsed);
    } catch {
      clearStoredKundli();
      setKundli(null);
      setLoadError(true);
    } finally {
      setReady(true);
    }
  }, []);

  const hi = locale === "hi";

  if (!ready) {
    return (
      <div className="bg-[#faf8f5] min-h-[40vh] flex items-center justify-center">
        <p className="text-sm text-ink-muted">
          {hi ? "कुंडली लोड हो रही है…" : "Loading your kundli…"}
        </p>
      </div>
    );
  }

  if (!kundli) {
    return (
      <EmptyResult
        title={t("title")}
        subtitle={
          loadError
            ? hi
              ? "सेव की गई कुंडली पुरानी या अधूरी है। कृपया नई कुंडली बनाएँ।"
              : "Saved kundli is outdated or incomplete. Please generate a new one."
            : t("subtitle")
        }
        cta={t("newKundli")}
        hi={hi}
      />
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
