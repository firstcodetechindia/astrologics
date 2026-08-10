"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { KundliResult } from "@/lib/astrology/types";
import { toDMS } from "@/lib/astrology/math";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { KundliChart } from "./KundliChart";
import { ContactCTA } from "./ContactCTA";

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

  const L = (obj: { en: string; hi: string }) => obj[locale];

  return (
    <div className="bg-[#faf8f5] pb-24 sm:pb-8">
      <PageHero
        eyebrow="Kundli"
        title={t("title")}
        description={t("subtitle")}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "कुंडली" : "Kundli", href: "/kundli" },
          { label: hi ? "परिणाम" : "Result" },
        ]}
        actions={
          <Link
            href="/kundli"
            className="inline-flex items-center justify-center rounded-lg border border-saffron/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-[#fff1e6]"
          >
            {t("newKundli")}
          </Link>
        }
      />
      <motion.div
        className="container-page space-y-6 sm:space-y-8 py-6 sm:py-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <GlassCard>
          <h2 className="font-display text-xl text-maroon font-semibold">
            {t("birthDetails")}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Item label={locale === "hi" ? "नाम" : "Name"} value={kundli.input.name} />
            <Item label={locale === "hi" ? "स्थान" : "Place"} value={kundli.input.place} />
            <Item label={locale === "hi" ? "तिथि" : "Date"} value={kundli.input.date} />
            <Item label={locale === "hi" ? "समय" : "Time"} value={kundli.input.time} />
          </dl>
        </GlassCard>
        <KundliChart kundli={kundli} />
      </div>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold">
          {t("coreIdentity")}
        </h2>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-3xl">
          {locale === "hi"
            ? "लग्न बाहरी व्यक्तित्व व भाव द्वार है; चंद्र राशि मन व भावना; सूर्य आत्मा ऊर्जा; नक्षत्र चंद्र का सूक्ष्म पता। नीचे ग्रह तालिका और दशा समय अध्याय बताते हैं।"
            : "Lagna is your outer style and house door; Moon sign is mind and emotion; Sun is vitality; nakshatra is the Moon’s finer address. The planet table and dasha below show placement and life chapters."}
        </p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat label={t("lagna")} value={`${L(kundli.lagna.sign)} (${toDMS(kundli.lagna.degree)})`} />
          <Stat label={t("moonRashi")} value={L(kundli.moonRashi)} />
          <Stat label={t("sunRashi")} value={L(kundli.sunRashi)} />
          <Stat
            label={t("nakshatra")}
            value={`${L(kundli.nakshatra.name)} — ${t("pada")} ${kundli.nakshatra.pada}`}
          />
          <Stat
            label={locale === "hi" ? "नक्षत्र स्वामी" : "Nakshatra lord"}
            value={L(kundli.nakshatra.lord)}
          />
          <Stat label={t("ayanamsa")} value={`${kundli.ayanamsa.toFixed(4)}°`} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold mb-4">
          {t("planets")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] md:text-base text-left font-numeric">
            <thead>
              <tr className="border-b border-gold/30 text-ink-muted">
                <th className="py-2 pr-3 font-medium">{t("planet")}</th>
                <th className="py-2 pr-3 font-medium">{t("sign")}</th>
                <th className="py-2 pr-3 font-medium">{t("house")}</th>
                <th className="py-2 pr-3 font-medium">{t("degree")}</th>
                <th className="py-2 font-medium">{t("nakshatra")}</th>
              </tr>
            </thead>
            <tbody>
              {kundli.planets.map((p) => (
                <tr key={p.id} className="border-b border-gold/15">
                  <td className="py-2.5 pr-3 font-medium text-maroon">{L(p.name)}</td>
                  <td className="py-2.5 pr-3">{L(p.sign)}</td>
                  <td className="py-2.5 pr-3">{p.house}</td>
                  <td className="py-2.5 pr-3">{toDMS(p.degreeInSign)}</td>
                  <td className="py-2.5">
                    {L(p.nakshatra)} ({p.pada})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold mb-4">
          {t("houses")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kundli.houses.map((h) => (
            <div
              key={h.number}
              className="rounded-xl border border-gold/25 bg-ivory/60 p-3 text-sm"
            >
              <p className="font-semibold text-maroon">
                {locale === "hi" ? "भाव" : "House"} {h.number} — {L(h.sign)}
              </p>
              <p className="text-xs text-ink-muted mt-1">
                {t("houseLord")}: {L(h.lord)}
              </p>
              <p className="text-xs text-ink-muted mt-1">{L(h.summary)}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold mb-4">
          {t("yogas")}
        </h2>
        <div className="space-y-3">
          {kundli.yogas.map((y) => (
            <div
              key={y.id}
              className={`rounded-xl border p-4 ${
                y.level === "positive"
                  ? "border-emerald-300/50 bg-emerald-50/50"
                  : y.level === "challenge"
                    ? "border-amber-300/50 bg-amber-50/40"
                    : "border-gold/30 bg-ivory/50"
              }`}
            >
              <p className="font-semibold text-maroon">{L(y.name)}</p>
              <p className="mt-1 text-sm text-ink-muted leading-relaxed">
                {L(y.meaning)}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold mb-4">
          {t("dasha")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Stat
            label={t("currentMaha")}
            value={`${L(kundli.dasha.currentMaha.planet)} (${kundli.dasha.currentMaha.start} → ${kundli.dasha.currentMaha.end})`}
          />
          <Stat
            label={t("currentAntar")}
            value={`${L(kundli.dasha.currentAntar.planet)} (${kundli.dasha.currentAntar.start} → ${kundli.dasha.currentAntar.end})`}
          />
        </div>
        <p className="text-sm font-medium text-ink mb-2">{t("mahaList")}</p>
        <ul className="space-y-1.5 text-sm font-numeric data-nums">
          {kundli.dasha.mahaList.map((d, i) => (
            <li
              key={i}
              className={`flex justify-between gap-4 rounded-lg px-3 py-2 ${
                d.isCurrent ? "bg-saffron/15 font-semibold text-maroon" : "bg-ivory/40"
              }`}
            >
              <span>{L(d.planet)}</span>
              <span className="text-ink-muted whitespace-nowrap">
                {d.start} — {d.end}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl text-maroon font-semibold mb-4">
          {t("insights")}
        </h2>
        <div className="space-y-4">
          {kundli.insights.map((ins) => (
            <div key={ins.area} className="border-b border-gold/20 pb-4 last:border-0">
              <h3 className="font-semibold text-maroon">{L(ins.title)}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-muted md:text-base">
                {L(ins.text)}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <ContactCTA title={t("upchaarTitle")} text={t("upchaarText")} />

      <p className="text-xs text-center text-ink-muted">{t("disclaimer")}</p>
      <div className="text-center">
        <Link href="/kundli" className="text-saffron-deep font-semibold text-sm underline">
          {t("newKundli")}
        </Link>
      </div>
      </motion.div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold/25 bg-ivory/70 p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 font-semibold text-maroon text-sm leading-snug font-numeric data-nums">
        {value}
      </p>
    </div>
  );
}
