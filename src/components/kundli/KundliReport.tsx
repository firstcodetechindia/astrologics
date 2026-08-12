"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { KundliResult } from "@/lib/astrology/types";
import type { DivisionalChart } from "@/lib/astrology/vargas";
import type { LalKitabChart } from "@/lib/astrology/lalkitab";
import type { VarshphalResult } from "@/lib/astrology/varshphal";
import { toDMS } from "@/lib/astrology/math-core";
import { recommendGemstones, rudrakshaForSign } from "@/lib/astrology/remedies";
import { getHoroscopeSeo } from "@/lib/horoscope/seo-content";
import { zodiacSlugFromIndex } from "@/lib/zodiac-icons";
import { ContactCTA } from "./ContactCTA";
import { VedicChartView, type ChartStyle } from "./VedicChartView";

type MainTab =
  | "basic"
  | "kundli"
  | "kp"
  | "ashtakvarga"
  | "charts"
  | "dasha"
  | "report";

type ReportSub =
  | "general"
  | "remedies"
  | "dosha"
  | "ascendant"
  | "planetary"
  | "vimshottari"
  | "yoga"
  | "lalkitab"
  | "varshphal";

type DoshaSub = "manglik" | "kalsarpa" | "sadesati";
type RemedySub = "rudraksha" | "gemstone";

function L(locale: "en" | "hi", t: { en: string; hi: string }) {
  return t[locale];
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
        active
          ? "bg-cosmic-gold/20 text-maroon ring-1 ring-cosmic-gold/35"
          : "bg-surface/75 text-ink-muted hover:bg-surface hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-surface p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function StatusBadge({
  present,
  presentLabel,
  absentLabel,
}: {
  present: boolean;
  presentLabel: string;
  absentLabel: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        present
          ? "bg-red-50 text-red-700"
          : "bg-emerald-500/15 text-emerald-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          present ? "bg-red-500" : "bg-emerald-500"
        }`}
      />
      {present ? presentLabel : absentLabel}
    </span>
  );
}

function SadeSatiTrackerPanel({
  sade,
  locale,
}: {
  sade: Record<string, unknown>;
  locale: "en" | "hi";
}) {
  const hi = locale === "hi";
  const moon = sade.moonSign as { en: string; hi: string } | undefined;
  const saturn = sade.saturnSign as { en: string; hi: string } | undefined;
  const intensity = sade.intensityHint as { en: string; hi: string } | undefined;
  const basedOn = sade.basedOn as { en: string; hi: string } | undefined;
  const disclaimer = sade.disclaimer as { en: string; hi: string } | undefined;
  const window = sade.currentWindow as { start: string; end: string } | null | undefined;
  const cycle = (sade.fullCycle as
    | { phase: number; label: { en: string; hi: string }; start: string; end: string }[]
    | undefined) || [];

  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 text-sm">
        <p className="text-ink-muted">
          <span className="font-medium text-ink">
            {hi ? "चंद्र राशि: " : "Moon sign: "}
          </span>
          {moon ? L(locale, moon) : "—"}
        </p>
        <p className="text-ink-muted">
          <span className="font-medium text-ink">
            {hi ? "शनि अभी: " : "Saturn now: "}
          </span>
          {saturn ? L(locale, saturn) : "—"}
        </p>
      </div>
      {window && (
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">
            {hi ? "वर्तमान चरण: " : "Current phase window: "}
          </span>
          {window.start} → {window.end}
        </p>
      )}
      {intensity && (
        <p className="text-sm text-ink-muted">{L(locale, intensity)}</p>
      )}
      {cycle.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink">
            {hi ? "चक्र समयरेखा" : "Cycle timeline"}
          </p>
          <ul className="mt-2 space-y-2">
            {cycle.map((c) => (
              <li
                key={`${c.phase}-${c.start}`}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-medium text-maroon">
                  {hi ? `चरण ${c.phase}` : `Phase ${c.phase}`}
                </span>
                <span className="mx-2 text-ink-muted">·</span>
                <span className="text-ink-muted">
                  {c.start} → {c.end}
                </span>
                <p className="mt-1 text-xs text-ink-muted">{L(locale, c.label)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {basedOn && (
        <p className="text-xs text-saffron-deep">
          {hi ? "आधार: " : "Based on: "}
          {L(locale, basedOn)}
        </p>
      )}
      {disclaimer && (
        <p className="text-xs text-ink-muted">{L(locale, disclaimer)}</p>
      )}
    </div>
  );
}

function VarshphalReportPanel({
  kundli,
  locale,
}: {
  kundli: KundliResult;
  locale: "en" | "hi";
}) {
  const hi = locale === "hi";
  const vp = kundli.varshphal as VarshphalResult | undefined;
  if (!vp?.varshaLagna) {
    return (
      <Card>
        <p className="text-sm text-ink-muted">
          {hi
            ? "वर्षफल उपलब्ध नहीं — कुंडली फिर बनाएँ।"
            : "Varshphal unavailable — regenerate kundli."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-display text-lg font-bold text-maroon">
          {hi
            ? `वर्षफल ${vp.targetYear}`
            : `Varshphal ${vp.targetYear}`}
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          {L(locale, vp.methodology)}
        </p>
        <p className="mt-2 text-xs text-saffron-deep">
          {hi ? "सूर्य वापसी: " : "Solar return: "}
          {new Date(vp.solarReturnAt).toISOString().replace(".000Z", "Z")}
          {typeof vp.solarReturnResidualDeg === "number"
            ? ` · Δ ${vp.solarReturnResidualDeg.toFixed(4)}°`
            : ""}
        </p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h4 className="font-semibold text-ink">
            {hi ? "वर्ष लग्न" : "Varsha Lagna"}
          </h4>
          <p className="mt-2 text-sm text-maroon font-medium">
            {L(locale, vp.varshaLagna.sign)}{" "}
            {toDMS(vp.varshaLagna.degree)}
          </p>
          <p className="mt-2 text-xs text-saffron-deep">
            {hi ? "आधार: " : "Based on: "}
            {L(locale, vp.varshaLagna.basedOn)}
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold text-ink">{hi ? "मुंथा" : "Muntha"}</h4>
          <p className="mt-2 text-sm text-maroon font-medium">
            {L(locale, vp.muntha.sign)} ·{" "}
            {hi ? `भाव ${vp.muntha.houseFromVarshaLagna}` : `H${vp.muntha.houseFromVarshaLagna}`}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {hi
              ? `आयु वर्ष पूर्ण: ${vp.completedYearsOfAge}`
              : `Completed years: ${vp.completedYearsOfAge}`}
          </p>
          <p className="mt-2 text-xs text-saffron-deep">
            {hi ? "आधार: " : "Based on: "}
            {vp.muntha.basedOn
              ? L(locale, vp.muntha.basedOn)
              : "—"}
          </p>
        </Card>
      </div>

      <Card>
        <h4 className="font-semibold text-ink">
          {hi ? "वर्षेश्वर (सरलीकृत)" : "Varsheshwara (simplified)"}
        </h4>
        <p className="mt-2 text-sm font-medium text-maroon">
          {L(locale, vp.varsheshwara.name)}
        </p>
        <p className="mt-2 text-xs text-saffron-deep">
          {hi ? "आधार: " : "Based on: "}
          {L(locale, vp.varsheshwara.basedOn)}
        </p>
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">{hi ? "सहाम" : "Sahams"}</h4>
        <ul className="mt-3 space-y-3 text-sm">
          {vp.sahams.map((s) => (
            <li key={s.id} className="border-b border-white/5 pb-2">
              <span className="font-medium text-ink">{L(locale, s.name)}</span>
              <span className="text-ink-muted">
                {" "}
                · {L(locale, s.sign)}
              </span>
              <p className="mt-1 text-xs text-ink-muted">
                {hi ? "सूत्र: " : "Formula: "}
                {L(locale, s.formula)}
              </p>
              <p className="mt-1 text-xs text-saffron-deep">
                {hi ? "आधार: " : "Based on: "}
                {L(locale, s.basedOn)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">
          {hi ? "वर्ष ग्रह (स्नैपशॉट)" : "Annual planets (snapshot)"}
        </h4>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2 text-sm text-ink-muted">
          {vp.planets.slice(0, 9).map((p) => (
            <li key={p.id}>
              {L(locale, p.name)} · {L(locale, p.sign)} · H{p.house}
              {p.isRetrograde ? " ®" : ""}
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-xs text-ink-muted">{L(locale, vp.disclaimer)}</p>
    </div>
  );
}

function LalKitabReportPanel({
  kundli,
  locale,
}: {
  kundli: KundliResult;
  locale: "en" | "hi";
}) {
  const hi = locale === "hi";
  const lk = kundli.lalkitab as LalKitabChart | undefined;
  if (!lk?.planets?.length) {
    return (
      <Card>
        <p className="text-sm text-ink-muted">
          {hi
            ? "लाल किताब तथ्य उपलब्ध नहीं — कुंडली फिर बनाएँ।"
            : "Lal Kitab facts unavailable — regenerate kundli."}
        </p>
      </Card>
    );
  }

  const rin = lk.rin ?? lk.debts ?? [];
  const andha = lk.andha ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-display text-lg font-bold text-maroon">
          {hi ? "लाल किताब रिपोर्ट" : "Lal Kitab report"}
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          {L(locale, lk.methodology)}
        </p>
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">
          {hi ? "पक्का घर" : "Pakka Ghar"}
        </h4>
        <ul className="mt-3 space-y-2 text-sm">
          {lk.planets.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-2"
            >
              <span className="font-medium text-ink">
                {L(locale, p.name)} · H{p.house}
                <span className="ml-2 text-xs text-ink-muted">
                  {hi ? `पक्का ${p.pakkaGhar}` : `Pakka ${p.pakkaGhar}`}
                </span>
              </span>
              <StatusBadge
                present={!p.inPakkaGhar}
                presentLabel={hi ? "बाहर" : "Away"}
                absentLabel={hi ? "में" : "In Pakka"}
              />
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">
          {hi ? "अंध ग्रह (v1)" : "Andha Graha (v1)"}
        </h4>
        {andha.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">
            {hi ? "कोई Andha ध्वज नहीं।" : "No Andha flags."}
          </p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-ink-muted">
            {andha.map((a) => (
              <li key={a.id}>
                {L(locale, a.reason)}
                <span className="mt-1 block text-xs text-saffron-deep">
                  {hi ? "आधार: " : "Based on: "}
                  {L(locale, a.basedOn)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">{hi ? "ऋण स्क्रीन" : "Rin screens"}</h4>
        <ul className="mt-3 space-y-3">
          {rin.map((d) => (
            <li key={d.id}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink">{L(locale, d.name)}</span>
                <StatusBadge
                  present={d.present}
                  presentLabel={hi ? "सक्रिय" : "Present"}
                  absentLabel={hi ? "नहीं" : "Clear"}
                />
              </div>
              <p className="mt-1 text-sm text-ink-muted">{L(locale, d.note)}</p>
              <p className="mt-1 text-xs text-saffron-deep">
                {hi ? "आधार: " : "Based on: "}
                {L(locale, d.basedOn)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h4 className="font-semibold text-ink">
          {hi ? "Tier-1 उपाय" : "Tier-1 remedies"}
        </h4>
        <p className="mt-1 text-xs text-ink-muted">
          {hi
            ? "सांस्कृतिक/व्यवहार उपाय — चिकित्सा दावा नहीं। रत्न केवल Ratna मॉड्यूल से।"
            : "Cultural/behavioral only — not medical. Gems only via Ratna module."}
        </p>
        {(lk.remedies?.length || 0) === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">
            {hi ? "कोई Tier-1 उपाय ट्रिगर नहीं।" : "No Tier-1 remedies triggered."}
          </p>
        ) : (
          <ul className="mt-3 space-y-3 text-sm text-ink-muted">
            {lk.remedies.map((r) => (
              <li key={r.id}>
                <span className="font-medium text-ink">
                  {r.forPlanet} · {r.trigger}
                </span>
                <p className="mt-1">{L(locale, r.text)}</p>
                <p className="mt-1 text-xs text-saffron-deep">
                  {hi ? "आधार: " : "Based on: "}
                  {L(locale, r.basedOn)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function KundliReport({ kundli }: { kundli: KundliResult }) {
  const locale = useLocale() as "en" | "hi";
  const hi = locale === "hi";
  const [main, setMain] = useState<MainTab>("basic");
  const [reportSub, setReportSub] = useState<ReportSub>("general");
  const [doshaSub, setDoshaSub] = useState<DoshaSub>("manglik");
  const [remedySub, setRemedySub] = useState<RemedySub>("rudraksha");
  const [chartStyle, setChartStyle] = useState<ChartStyle>("north");
  const [dashaSystem, setDashaSystem] = useState<"vimshottari" | "yogini">(
    "vimshottari"
  );

  const bodies = useMemo(
    () =>
      kundli.planets.map((p) => ({
        id: p.id,
        signIndex: p.signIndex,
        isRetrograde: p.isRetrograde,
      })),
    [kundli.planets]
  );

  const d9 = kundli.divisionalCharts?.D9 as DivisionalChart | undefined;
  const d10 = kundli.divisionalCharts?.D10 as DivisionalChart | undefined;
  const allVargas = (kundli.divisionalCharts || {}) as Record<
    string,
    DivisionalChart
  >;
  const panchang = kundli.panchang as
    | {
        weekday: { en: string; hi: string };
        tithi: { name: { en: string; hi: string }; index: number };
        nakshatra: { name: { en: string; hi: string }; pada: number };
        yoga: { name: { en: string; hi: string } };
        karana: { name: { en: string; hi: string } };
        paksha: { en: string; hi: string };
      }
    | undefined;
  const avakhada = kundli.avakhada as
    | {
        varna: { en: string; hi: string };
        vashya: { en: string; hi: string };
        yoni: { en: string; hi: string };
        gana: { en: string; hi: string };
        nadi: { en: string; hi: string };
        paya: { en: string; hi: string };
        charan: number;
        nameAlphabet: string;
      }
    | undefined;
  const ashtak = kundli.ashtakvarga as
    | {
        sarva: number[];
        total: number;
        houses: {
          number: number;
          bindus: number;
          sign: { en: string; hi: string };
          strength: string;
        }[];
        bhinna: Record<string, number[]>;
      }
    | undefined;
  const kp = kundli.kp as
    | {
        points: {
          id: string;
          name: { en: string; hi: string };
          house: number;
          sign: { en: string; hi: string };
          signLord: { en: string; hi: string };
          nakshatra: { en: string; hi: string };
          starLord: { en: string; hi: string };
          subLord: { en: string; hi: string };
        }[];
        ruling: {
          dayLord: { en: string; hi: string };
          ascendant: { starLord: { en: string; hi: string }; subLord: { en: string; hi: string } };
          moon: { starLord: { en: string; hi: string }; subLord: { en: string; hi: string } } | null;
        };
        ayanamsaNote: { en: string; hi: string };
      }
    | undefined;
  const bhavChalit = kundli.bhavChalit as
    | {
        planets: {
          id: string;
          name: { en: string; hi: string };
          signIndex: number;
          bhavHouse: number;
          rashiHouse: number;
          isRetrograde?: boolean;
        }[];
      }
    | undefined;

  const ascSeo = getHoroscopeSeo(zodiacSlugFromIndex(kundli.lagna.signIndex));
  const gemReport = recommendGemstones(kundli, "overall");
  const rudraNak = rudrakshaForSign(kundli.moonRashi.signIndex);

  const yogini = kundli.yoginiDasha as
    | {
        current: { planet: { en: string; hi: string }; start: string; end: string; isCurrent?: boolean };
        mahaList: { planet: { en: string; hi: string }; start: string; end: string; isCurrent?: boolean }[];
        balanceYears: number;
        startLord: { en: string; hi: string };
        currentPlanet: { en: string; hi: string };
        startLordPlanet: { en: string; hi: string };
      }
    | undefined;

  const manglikExtra = (kundli.doshas?.manglik || {
    present: false,
    meaning: {
      en: "Manglik status unavailable — regenerate your kundli.",
      hi: "मांगलिक स्थिति उपलब्ध नहीं — कुंडली फिर बनाएँ।",
    },
  }) as {
    present: boolean;
    meaning: { en: string; hi: string };
    cancelled?: boolean;
    severity?: string;
    cancellations?: { id: string; en: string; hi: string }[];
    fromLagna?: number;
    fromMoon?: number | null;
    methodology?: { en: string; hi: string };
    presentAny?: boolean;
  };

  const mainTabs: { id: MainTab; en: string; hi: string }[] = [
    { id: "basic", en: "Basic", hi: "बेसिक" },
    { id: "kundli", en: "Kundli", hi: "कुंडली" },
    { id: "kp", en: "KP", hi: "केपी" },
    { id: "ashtakvarga", en: "Ashtakvarga", hi: "अष्टकवर्ग" },
    { id: "charts", en: "Charts", hi: "चार्ट" },
    { id: "dasha", en: "Dasha", hi: "दशा" },
    { id: "report", en: "Free Report", hi: "मुफ़्त रिपोर्ट" },
  ];

  const reportTabs: { id: ReportSub; en: string; hi: string }[] = [
    { id: "general", en: "General", hi: "सामान्य" },
    { id: "remedies", en: "Remedies", hi: "उपाय" },
    { id: "dosha", en: "Dosha", hi: "दोष" },
    { id: "ascendant", en: "Ascendant", hi: "लग्न" },
    { id: "planetary", en: "Planetary", hi: "ग्रह" },
    { id: "vimshottari", en: "Vimshottari", hi: "विंशोत्तरी" },
    { id: "yoga", en: "Yoga", hi: "योग" },
    { id: "lalkitab", en: "Lal Kitab", hi: "लाल किताब" },
    { id: "varshphal", en: "Varshphal", hi: "वर्षफल" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Report header — Astrotalk style */}
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold text-maroon sm:text-3xl">
          {hi
            ? `${kundli.input.name} की कुंडली`
            : `${kundli.input.name}'s Kundli`}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {kundli.input.date} · {kundli.input.time} · {kundli.input.place}
        </p>
      </header>

      {/* Main tabs */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {mainTabs.map((t) => (
          <TabBtn
            key={t.id}
            active={main === t.id}
            onClick={() => setMain(t.id)}
          >
            {hi ? t.hi : t.en}
          </TabBtn>
        ))}
      </div>

      {main === "basic" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-maroon">
                {hi ? "जन्म विवरण" : "Birth details"}
              </h2>
              <div className="flex shrink-0 rounded-full border border-white/10 bg-cosmic-navy p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setChartStyle("north")}
                  className={`rounded-full px-2.5 py-1 ${
                    chartStyle === "north" ? "bg-cosmic-gold/20 text-maroon" : "text-ink-muted"
                  }`}
                >
                  {hi ? "उत्तर" : "North"}
                </button>
                <button
                  type="button"
                  onClick={() => setChartStyle("south")}
                  className={`rounded-full px-2.5 py-1 ${
                    chartStyle === "south" ? "bg-cosmic-gold/20 text-maroon" : "text-ink-muted"
                  }`}
                >
                  {hi ? "दक्षिण" : "South"}
                </button>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Item label={hi ? "नाम" : "Name"} value={kundli.input.name} />
              <Item label={hi ? "स्थान" : "Place"} value={kundli.input.place} />
              <Item label={hi ? "तिथि" : "Date"} value={kundli.input.date} />
              <Item label={hi ? "समय" : "Time"} value={kundli.input.time} />
              <Item
                label={hi ? "अयनांश" : "Ayanamsa"}
                value={`Lahiri ${Number(kundli.ayanamsa || 0).toFixed(4)}°`}
              />
              <Item
                label={hi ? "राहु/केतु" : "Nodes"}
                value={
                  kundli.settings?.nodeType === "true"
                    ? hi
                      ? "ट्रू (प्रयोगात्मक)"
                      : "True (experimental)"
                    : hi
                      ? "मीन नोड"
                      : "Mean node"
                }
              />
              <Item
                label={hi ? "एफ़ेमेरिस" : "Ephemeris"}
                value={
                  kundli.settings?.ephemerisEngine || "astronomy-engine"
                }
              />
              <Item
                label={hi ? "विश्वसनीयता" : "Reliability"}
                value={kundli.reliability?.level || "—"}
              />
            </dl>
          </Card>
          <VedicChartView
            style={chartStyle}
            title={
              hi
                ? `लग्न चार्ट — ${L(locale, kundli.lagna.sign)}`
                : `Lagna Chart — ${L(locale, kundli.lagna.sign)}`
            }
            lagnaSignIndex={kundli.lagna.signIndex}
            bodies={bodies}
            locale={locale}
          />
          <Card className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-maroon">
              {hi ? "मुख्य पहचान" : "Core identity"}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Stat
                label={hi ? "लग्न" : "Lagna"}
                value={`${L(locale, kundli.lagna.sign)} ${toDMS(kundli.lagna.degree)}`}
              />
              <Stat
                label={hi ? "चंद्र राशि" : "Moon sign"}
                value={L(locale, kundli.moonRashi)}
              />
              <Stat
                label={hi ? "सूर्य राशि" : "Sun sign"}
                value={L(locale, kundli.sunRashi)}
              />
              <Stat
                label={hi ? "नक्षत्र" : "Nakshatra"}
                value={`${L(locale, kundli.nakshatra.name)} (Pada ${kundli.nakshatra.pada})`}
              />
              <Stat
                label={hi ? "नक्षत्र स्वामी" : "Nakshatra lord"}
                value={L(locale, kundli.nakshatra.lord)}
              />
              <Stat
                label={hi ? "अक्षांश / देशांतर" : "Lat / Lon"}
                value={`${kundli.input.lat.toFixed(4)}, ${kundli.input.lon.toFixed(4)}`}
              />
            </div>
          </Card>
          {panchang && (
            <Card className="lg:col-span-2">
              <h2 className="font-display text-lg font-bold text-maroon">
                {hi ? "पंचांग (जन्म क्षण)" : "Panchang at birth"}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat label={hi ? "वार" : "Day"} value={L(locale, panchang.weekday)} />
                <Stat
                  label={hi ? "तिथि" : "Tithi"}
                  value={`${L(locale, panchang.tithi.name)} (${panchang.tithi.index})`}
                />
                <Stat label={hi ? "पक्ष" : "Paksha"} value={L(locale, panchang.paksha)} />
                <Stat
                  label={hi ? "नक्षत्र" : "Nakshatra"}
                  value={`${L(locale, panchang.nakshatra.name)} · P${panchang.nakshatra.pada}`}
                />
                <Stat label={hi ? "योग" : "Yoga"} value={L(locale, panchang.yoga.name)} />
                <Stat label={hi ? "करण" : "Karana"} value={L(locale, panchang.karana.name)} />
              </div>
            </Card>
          )}
          {avakhada && (
            <Card className="lg:col-span-2">
              <h2 className="font-display text-lg font-bold text-maroon">
                {hi ? "अवखाड़ा चक्र" : "Avakhada details"}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label={hi ? "वर्ण" : "Varna"} value={L(locale, avakhada.varna)} />
                <Stat label={hi ? "वश्य" : "Vashya"} value={L(locale, avakhada.vashya)} />
                <Stat label={hi ? "योनि" : "Yoni"} value={L(locale, avakhada.yoni)} />
                <Stat label={hi ? "गण" : "Gana"} value={L(locale, avakhada.gana)} />
                <Stat label={hi ? "नाड़ी" : "Nadi"} value={L(locale, avakhada.nadi)} />
                <Stat label={hi ? "पाय" : "Paya"} value={L(locale, avakhada.paya)} />
                <Stat label={hi ? "चरण" : "Charan"} value={String(avakhada.charan)} />
                <Stat
                  label={hi ? "नामाक्षर" : "Name letter"}
                  value={avakhada.nameAlphabet}
                />
              </div>
            </Card>
          )}
        </div>
      )}

      {main === "kundli" && (
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-lg font-bold text-maroon">
              {hi ? "ग्रह स्थिति" : "Planetary positions"}
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="py-2 pr-3">{hi ? "ग्रह" : "Planet"}</th>
                    <th className="py-2 pr-3">{hi ? "राशि" : "Sign"}</th>
                    <th className="py-2 pr-3">{hi ? "भाव" : "House"}</th>
                    <th className="py-2 pr-3">{hi ? "अंश" : "Degree"}</th>
                    <th className="py-2">{hi ? "नक्षत्र" : "Nakshatra"}</th>
                  </tr>
                </thead>
                <tbody>
                  {kundli.planets.map((p) => (
                    <tr key={p.id} className="border-b border-white/10">
                      <td className="py-2.5 pr-3 font-medium text-ink">
                        {L(locale, p.name)}
                        {p.isRetrograde ? " ®" : ""}
                      </td>
                      <td className="py-2.5 pr-3">{L(locale, p.sign)}</td>
                      <td className="py-2.5 pr-3">{p.house}</td>
                      <td className="py-2.5 pr-3 font-numeric">
                        {toDMS(p.degreeInSign)}
                      </td>
                      <td className="py-2.5">
                        {L(locale, p.nakshatra)} ({p.pada})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-bold text-maroon">
              {hi ? "भाव अवलोकन" : "House overview"}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {kundli.houses.map((h) => (
                <div
                  key={h.number}
                  className="rounded-xl border border-white/10 bg-cosmic-navy p-3"
                >
                  <p className="text-xs font-semibold text-maroon">
                    {hi ? `भाव ${h.number}` : `House ${h.number}`} ·{" "}
                    {L(locale, h.sign)}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {hi ? "स्वामी" : "Lord"}: {L(locale, h.lord)}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-muted">
                    {L(locale, h.summary)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          {(kundli.yogas?.length || 0) > 0 && (
            <Card>
              <h2 className="font-display text-lg font-bold text-maroon">
                {hi ? "योग" : "Yogas"}
              </h2>
              <ul className="mt-3 space-y-2">
                {(kundli.yogas || []).map((y) => (
                  <li
                    key={y.id}
                    className="rounded-xl border border-white/10 px-3 py-2.5"
                  >
                    <p className="font-semibold text-ink">{L(locale, y.name)}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {L(locale, y.meaning)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {main === "kp" && (
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-lg font-bold text-maroon">
              {hi ? "केपी ग्रह तालिका" : "KP Planets"}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {kp ? L(locale, kp.ayanamsaNote) : null}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="py-2 pr-2">{hi ? "ग्रह" : "Planet"}</th>
                    <th className="py-2 pr-2">{hi ? "भाव" : "House"}</th>
                    <th className="py-2 pr-2">{hi ? "राशि" : "Sign"}</th>
                    <th className="py-2 pr-2">{hi ? "राशि स्वामी" : "Sign lord"}</th>
                    <th className="py-2 pr-2">{hi ? "नक्षत्र" : "Star"}</th>
                    <th className="py-2 pr-2">{hi ? "स्टार लॉर्ड" : "Star lord"}</th>
                    <th className="py-2">{hi ? "सब-लॉर्ड" : "Sub lord"}</th>
                  </tr>
                </thead>
                <tbody>
                  {(kp?.points || []).map((row) => (
                    <tr key={row.id} className="border-b border-white/10">
                      <td className="py-2.5 pr-2 font-medium text-ink">
                        {L(locale, row.name)}
                      </td>
                      <td className="py-2.5 pr-2">{row.house}</td>
                      <td className="py-2.5 pr-2">{L(locale, row.sign)}</td>
                      <td className="py-2.5 pr-2">{L(locale, row.signLord)}</td>
                      <td className="py-2.5 pr-2">{L(locale, row.nakshatra)}</td>
                      <td className="py-2.5 pr-2">{L(locale, row.starLord)}</td>
                      <td className="py-2.5">{L(locale, row.subLord)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {kp?.ruling && (
            <Card>
              <h3 className="font-semibold text-ink">
                {hi ? "रूलिंग प्लैनेट्स" : "Ruling planets"}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Stat
                  label={hi ? "दिन स्वामी" : "Day lord"}
                  value={L(locale, kp.ruling.dayLord)}
                />
                <Stat
                  label={hi ? "लग्न स्टार/सब" : "Asc star / sub"}
                  value={`${L(locale, kp.ruling.ascendant.starLord)} / ${L(locale, kp.ruling.ascendant.subLord)}`}
                />
                {kp.ruling.moon && (
                  <Stat
                    label={hi ? "चंद्र स्टार/सब" : "Moon star / sub"}
                    value={`${L(locale, kp.ruling.moon.starLord)} / ${L(locale, kp.ruling.moon.subLord)}`}
                  />
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {main === "ashtakvarga" && (
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-lg font-bold text-maroon">
              {hi ? "सर्वाष्टकवर्ग (SAV)" : "Sarvashtakvarga (SAV)"}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {hi
                ? `कुल बिंदु: ${ashtak?.total ?? "—"} · 28+ मजबूत, 25–27 औसत, ≤24 कमजोर`
                : `Total bindus: ${ashtak?.total ?? "—"} · 28+ strong, 25–27 average, ≤24 weak`}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {(ashtak?.houses || []).map((h) => (
                <div
                  key={h.number}
                  className="rounded-xl border border-white/10 bg-cosmic-navy px-3 py-3 text-center"
                >
                  <p className="text-xs text-ink-muted">
                    {hi ? `भाव ${h.number}` : `House ${h.number}`} ·{" "}
                    {L(locale, h.sign)}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-maroon font-numeric">
                    {h.bindus}
                  </p>
                  <p className="text-[10px] uppercase text-ink-muted">
                    {h.strength}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          {ashtak?.bhinna && (
            <Card>
              <h3 className="font-semibold text-ink">
                {hi ? "भिन्नाष्टकवर्ग" : "Bhinnashtakvarga"}
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[36rem] text-left text-xs sm:text-sm">
                  <thead className="border-b border-white/10 text-ink-muted">
                    <tr>
                      <th className="py-2 pr-2">{hi ? "ग्रह" : "Planet"}</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={i} className="py-2 px-1 text-center">
                          {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ashtak.bhinna).map(([id, row]) => (
                      <tr key={id} className="border-b border-white/10">
                        <td className="py-2 pr-2 font-medium capitalize text-ink">
                          {id}
                        </td>
                        {row.map((v, i) => (
                          <td key={i} className="py-2 px-1 text-center font-numeric">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {main === "charts" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {hi
                ? "D1 राशि + भाव चलित + वर्ग चार्ट (BPHS)। उत्तर/दक्षिण केवल चित्रण है — गणना एक ही।"
                : "D1 Rashi + Bhav Chalit + Vargas (BPHS). North/South is drawing only — same calculation."}
            </p>
            <div className="flex rounded-full border border-white/10 bg-surface p-0.5 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setChartStyle("north")}
                className={`rounded-full px-3 py-1.5 transition ${
                  chartStyle === "north"
                    ? "bg-cosmic-gold/20 text-maroon"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {hi ? "उत्तर" : "North"}
              </button>
              <button
                type="button"
                onClick={() => setChartStyle("south")}
                className={`rounded-full px-3 py-1.5 transition ${
                  chartStyle === "south"
                    ? "bg-cosmic-gold/20 text-maroon"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {hi ? "दक्षिण" : "South"}
              </button>
            </div>
          </div>
          {bhavChalit && (
            <Card>
              <h3 className="font-semibold text-maroon">
                {hi ? "भाव चलित (श्रीपति)" : "Bhav Chalit (Sripati)"}
              </h3>
              <p className="mt-1 text-xs text-ink-muted">
                {hi
                  ? "राशि भाव बनाम भाव-कुस्प भाव — ग्रह राशि में रहकर भाव बदल सकता है।"
                  : "Rashi house vs cusp house — a planet can change house without changing sign."}
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead className="border-b border-white/10 text-xs text-ink-muted">
                    <tr>
                      <th className="py-2 pr-2">{hi ? "ग्रह" : "Planet"}</th>
                      <th className="py-2 pr-2">{hi ? "राशि भाव" : "Rashi house"}</th>
                      <th className="py-2">{hi ? "भाव चलित" : "Bhav house"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhavChalit.planets.map((p) => (
                      <tr key={p.id} className="border-b border-white/10">
                        <td className="py-2 pr-2 font-medium">
                          {L(locale, p.name)}
                          {p.isRetrograde ? " ®" : ""}
                        </td>
                        <td className="py-2 pr-2">{p.rashiHouse}</td>
                        <td className="py-2 font-semibold text-maroon">
                          {p.bhavHouse}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                "D1",
                "D2",
                "D3",
                "D4",
                "D7",
                "D9",
                "D10",
                "D12",
                "D16",
                "D20",
                "D24",
                "D27",
                "D30",
                "D40",
                "D45",
                "D60",
              ] as const
            ).map((code) => {
              const chart = allVargas[code] || (code === "D9" ? d9 : code === "D10" ? d10 : undefined);
              if (!chart) {
                if (code === "D1") {
                  return (
                    <VedicChartView
              style={chartStyle}
                      key={code}
                      title={hi ? "लग्न — जन्म कुंडली" : "Lagna — Birth Chart"}
                      subtitle="D-1"
                      lagnaSignIndex={kundli.lagna.signIndex}
                      bodies={bodies}
                      locale={locale}
                    />
                  );
                }
                return null;
              }
              return (
                <VedicChartView
              style={chartStyle}
                  key={code}
                  title={L(locale, chart.name)}
                  subtitle={L(locale, chart.purpose)}
                  lagnaSignIndex={chart.lagna.signIndex}
                  bodies={chart.planets.map((p) => ({
                    id: p.id,
                    signIndex: p.signIndex,
                  }))}
                  locale={locale}
                />
              );
            })}
            <VedicChartView
              style={chartStyle}
              title={hi ? "चंद्र कुंडली" : "Moon chart"}
              subtitle={hi ? "चंद्र = लग्न" : "Moon as Lagna"}
              lagnaSignIndex={kundli.moonRashi.signIndex}
              bodies={bodies}
              locale={locale}
            />
            <VedicChartView
              style={chartStyle}
              title={hi ? "सूर्य कुंडली" : "Sun chart"}
              subtitle={hi ? "सूर्य = लग्न" : "Sun as Lagna"}
              lagnaSignIndex={kundli.sunRashi.signIndex}
              bodies={bodies}
              locale={locale}
            />
          </div>
        </div>
      )}

      {main === "dasha" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <TabBtn
              active={dashaSystem === "vimshottari"}
              onClick={() => setDashaSystem("vimshottari")}
            >
              Vimshottari
            </TabBtn>
            <TabBtn
              active={dashaSystem === "yogini"}
              onClick={() => setDashaSystem("yogini")}
            >
              Yogini
            </TabBtn>
          </div>

          {dashaSystem === "vimshottari" ? (
            <>
              <p className="text-sm text-ink-muted">
                {hi
                  ? "प्रत्येक कार्ड एक महादशा है। व्याख्या ग्रह की जन्म कुंडली स्थिति (भाव + राशि) पर आधारित है।"
                  : "Each card is one Mahadasha. Readings cite the dasha lord’s natal house and sign."}
              </p>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {kundli.dasha.mahaList?.map((d, i) => {
                  const planet = kundli.planets.find(
                    (p) =>
                      p.name.en.toLowerCase() === d.planet.en.toLowerCase() ||
                      p.id === d.planet.en.toLowerCase()
                  );
                  return (
                    <Card
                      key={`${d.planet.en}-${i}`}
                      className={d.isCurrent ? "ring-2 ring-saffron/40" : ""}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-maroon">
                          {L(locale, d.planet)}{" "}
                          {hi ? "महादशा" : "Mahadasha"}
                        </h3>
                        {d.isCurrent && (
                          <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold uppercase text-saffron-deep">
                            {hi ? "सक्रिय" : "Active"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-muted font-numeric">
                        {d.start} — {d.end}
                      </p>
                      <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
                        {planet ? (
                          <>
                            <p>
                              {hi
                                ? `${L(locale, planet.name)} जन्म कुंडली में ${planet.house} भाव और ${L(locale, planet.sign)} राशि में है। इस महादशा में उस भाव के विषय सक्रिय होते हैं।`
                                : `${L(locale, planet.name)} sits in house ${planet.house} in ${L(locale, planet.sign)}. This Mahadasha activates that house’s themes.`}
                            </p>
                            <p className="text-xs font-medium text-saffron-deep">
                              {hi
                                ? `आधार: ${L(locale, planet.name)} · भाव ${planet.house} · ${L(locale, planet.sign)}`
                                : `Based on: ${L(locale, planet.name)} · house ${planet.house} · ${L(locale, planet.sign)}`}
                            </p>
                          </>
                        ) : (
                          <p>
                            {hi
                              ? "विस्तृत फल व्याख्या परामर्श में।"
                              : "Fuller reading available in consultation."}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Card>
                <h3 className="font-semibold text-ink">
                  {hi ? "वर्तमान अंतर / प्रत्यंतर" : "Current Antar / Pratyantar"}
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Stat
                    label={hi ? "अंतरदशा" : "Antardasha"}
                    value={`${L(locale, kundli.dasha.currentAntar.planet)} (${kundli.dasha.currentAntar.start} → ${kundli.dasha.currentAntar.end})`}
                  />
                  {kundli.dasha.currentPratyantar && (
                    <Stat
                      label={hi ? "प्रत्यंतर" : "Pratyantar"}
                      value={`${L(locale, kundli.dasha.currentPratyantar.planet)} (${kundli.dasha.currentPratyantar.start} → ${kundli.dasha.currentPratyantar.end})`}
                    />
                  )}
                </div>
              </Card>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-muted">
                {hi
                  ? `योगिनी दशा 36-वर्ष चक्र (8 योगिनियाँ)। जन्म नक्षत्र स्वामी: ${yogini ? L(locale, yogini.startLord) : "—"} (${yogini ? L(locale, yogini.startLordPlanet) : ""})।`
                  : `Yogini is a 36-year cycle (8 Yoginis). Birth lord: ${yogini ? L(locale, yogini.startLord) : "—"} (ruled by ${yogini ? L(locale, yogini.startLordPlanet) : ""}).`}
              </p>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {(yogini?.mahaList || []).map((d, i) => (
                  <Card
                    key={`${d.planet.en}-${i}`}
                    className={d.isCurrent ? "ring-2 ring-saffron/40" : ""}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-maroon">
                        {L(locale, d.planet)}
                      </h3>
                      {d.isCurrent && (
                        <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold uppercase text-saffron-deep">
                          {hi ? "सक्रिय" : "Active"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted font-numeric">
                      {d.start} — {d.end}
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">
                      {hi
                        ? "योगिनी काल चंद्र नक्षत्र शेष से आरंभ होता है — विंशोत्तरी से अलग समय-चक्र।"
                        : "Yogini timing starts from Moon-nakshatra balance — a separate clock from Vimshottari."}
                    </p>
                  </Card>
                ))}
              </div>
              {yogini && (
                <Card>
                  <Stat
                    label={hi ? "वर्तमान योगिनी · ग्रह" : "Current Yogini · planet"}
                    value={`${L(locale, yogini.current.planet)} · ${L(locale, yogini.currentPlanet)}`}
                  />
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {main === "report" && (
        <div className="space-y-4">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {reportTabs.map((t) => (
              <TabBtn
                key={t.id}
                active={reportSub === t.id}
                onClick={() => setReportSub(t.id)}
              >
                {hi ? t.hi : t.en}
              </TabBtn>
            ))}
          </div>

          {reportSub === "general" && (
            <div className="space-y-4">
              {kundli.insights?.map((ins) => (
                <Card key={ins.area}>
                  <h3 className="font-display text-base font-bold text-maroon">
                    {L(locale, ins.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {L(locale, ins.text)}
                  </p>
                  <p className="mt-2 text-xs font-medium text-saffron-deep">
                    {hi
                      ? `आधार क्षेत्र: ${ins.area} · लग्न ${L(locale, kundli.lagna.sign)} · दशा ${L(locale, kundli.dasha.currentMaha.planet)}`
                      : `Based on: ${ins.area} · Lagna ${L(locale, kundli.lagna.sign)} · Dasha ${L(locale, kundli.dasha.currentMaha.planet)}`}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {reportSub === "remedies" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <TabBtn
                  active={remedySub === "rudraksha"}
                  onClick={() => setRemedySub("rudraksha")}
                >
                  Rudraksha
                </TabBtn>
                <TabBtn
                  active={remedySub === "gemstone"}
                  onClick={() => setRemedySub("gemstone")}
                >
                  {hi ? "रत्न" : "Gemstones"}
                </TabBtn>
              </div>
              {remedySub === "rudraksha" && (
                <Card>
                  <h3 className="font-display text-lg font-bold text-maroon">
                    {hi ? "रुद्राक्ष सुझाव" : "Rudraksha recommendation"}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {hi
                      ? `${L(locale, kundli.nakshatra.name)} नक्षत्र में जन्म के आधार पर, लग्न/चंद्र से जुड़ा रुद्राक्ष सुझाव:`
                      : `Based on birth in ${L(locale, kundli.nakshatra.name)} nakshatra, a chart-linked rudraksha suggestion:`}
                  </p>
                  <p className="mt-3 text-base font-semibold text-ink">
                    {L(locale, rudraNak.bead)} · {L(locale, rudraNak.planet)}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {L(locale, rudraNak.disclaimer)}
                  </p>
                  <p className="mt-3 text-xs text-ink-muted">
                    {hi
                      ? "गलत रुद्राक्ष नुकसान भी कर सकता है — ज्योतिषी से पुष्टि करें।"
                      : "The wrong bead can disturb — confirm with an astrologer before wearing."}
                  </p>
                </Card>
              )}
              {remedySub === "gemstone" && (
                <div className="space-y-4">
                  <Card>
                    <h3 className="font-display text-lg font-bold text-maroon">
                      {hi
                        ? "रत्न सुझाव (कुंडली-आधारित)"
                        : "Gemstone suggestions (chart-based)"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {L(locale, gemReport.mantraFirst)}
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {L(locale, gemReport.tierNote)}
                    </p>
                  </Card>

                  {gemReport.recommendations.map((rec) => (
                    <Card key={`${rec.planetId}-${rec.trigger}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-base font-bold text-ink">
                          {L(locale, rec.primary)}
                        </h4>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                            rec.status === "caution"
                              ? "border-amber-400/30 bg-amber-500/15 text-amber-100"
                              : "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                          }`}
                        >
                          {rec.status === "caution"
                            ? hi
                              ? "सावधानी"
                              : "Caution"
                            : hi
                              ? "सुझाव"
                              : "Suggested"}
                        </span>
                        {rec.highRisk && (
                          <span className="rounded-full border border-rose-400/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-200">
                            {hi ? "उच्च जोखिम" : "High risk"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {hi ? "ग्रह" : "Planet"}: {L(locale, rec.planet)}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-ink">
                        <span className="font-semibold">
                          {hi ? "कारण: " : "Why: "}
                        </span>
                        {L(locale, rec.reason)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        <span className="font-semibold text-ink">
                          {hi ? "लाभ: " : "Benefits: "}
                        </span>
                        {L(locale, rec.benefits)}
                      </p>
                      <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold text-ink">
                            {hi ? "उंगली / धातु" : "Finger / metal"}
                          </dt>
                          <dd className="text-ink-muted">
                            {L(locale, rec.wearing.finger)} ·{" "}
                            {L(locale, rec.wearing.metal)}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-ink">
                            {hi ? "दिन" : "Day"}
                          </dt>
                          <dd className="text-ink-muted">
                            {L(locale, rec.wearing.day)}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="font-semibold text-ink">
                            {hi ? "विकल्प रत्न" : "Substitute"}
                          </dt>
                          <dd className="text-ink-muted">
                            {L(locale, rec.substitute)}
                            {rec.substituteWeaker
                              ? hi
                                ? " (प्रभाव आमतौर पर बहुत कमज़ोर — समकक्ष नहीं)"
                                : " (generally much weaker — not equivalent)"
                              : ""}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="font-semibold text-ink">
                            {hi ? "भार नोट" : "Weight note"}
                          </dt>
                          <dd className="text-ink-muted">
                            {L(locale, rec.wearing.minCaratNote)}
                          </dd>
                        </div>
                      </dl>
                      {rec.contraindications.length > 0 && (
                        <ul className="mt-3 space-y-1.5 rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-2.5 text-[13px] text-amber-100">
                          {rec.contraindications.map((c, i) => (
                            <li key={i}>⚠ {L(locale, c)}</li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  ))}

                  {gemReport.conflicts.length > 0 && (
                    <Card>
                      <h4 className="font-semibold text-rose-200">
                        {hi
                          ? "रत्न संघर्ष — एक साथ न पहनें"
                          : "Gem conflicts — do not wear together"}
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-ink-muted">
                        {gemReport.conflicts.map((c, i) => (
                          <li key={i}>{L(locale, c.note)}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  <Card>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {L(locale, gemReport.purityNote)}
                    </p>
                    <p className="mt-2 text-sm font-medium text-ink">
                      {L(locale, gemReport.consultNote)}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          )}

          {reportSub === "dosha" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "manglik" as const, en: "Manglik", hi: "मांगलिक" },
                    { id: "kalsarpa" as const, en: "Kalsarpa", hi: "कालसर्प" },
                    { id: "sadesati" as const, en: "Sade Sati", hi: "साढ़े साती" },
                  ] as const
                ).map((t) => (
                  <TabBtn
                    key={t.id}
                    active={doshaSub === t.id}
                    onClick={() => setDoshaSub(t.id)}
                  >
                    {hi ? t.hi : t.en}
                  </TabBtn>
                ))}
              </div>
              {doshaSub === "manglik" && (
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-maroon">
                      {hi ? "मांगलिक दोष" : "Manglik Dosha"}
                    </h3>
                    <StatusBadge
                      present={Boolean(
                        (manglikExtra as { presentAny?: boolean }).presentAny ??
                          manglikExtra.present
                      ) && !manglikExtra.cancelled}
                      presentLabel={hi ? "मांगलिक" : "Manglik"}
                      absentLabel={
                        manglikExtra.present && manglikExtra.cancelled
                          ? hi
                            ? "निरस्त/शिथिल"
                            : "Softened"
                          : hi
                            ? "नहीं"
                            : "Not present"
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {L(locale, manglikExtra.meaning)}
                  </p>
                  {manglikExtra.severity && (
                    <p className="mt-2 text-xs font-semibold uppercase text-saffron-deep">
                      {hi ? "तीव्रता" : "Severity"}: {manglikExtra.severity}
                    </p>
                  )}
                  {manglikExtra.cancellations &&
                    manglikExtra.cancellations.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                        {manglikExtra.cancellations.map((c) => (
                          <li key={c.id} className="rounded-lg bg-cosmic-navy px-3 py-2">
                            {locale === "hi" ? c.hi : c.en}
                          </li>
                        ))}
                      </ul>
                    )}
                  {manglikExtra.methodology && (
                    <p className="mt-3 text-xs text-ink-muted">
                      {L(locale, manglikExtra.methodology)}
                    </p>
                  )}
                </Card>
              )}
              {doshaSub === "kalsarpa" && kundli.doshas?.kaalSarp && (
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-maroon">
                      {hi ? "कालसर्प दोष" : "Kalsarpa Dosha"}
                    </h3>
                    <StatusBadge
                      present={kundli.doshas.kaalSarp.present}
                      presentLabel={hi ? "उपस्थित" : "Present"}
                      absentLabel={hi ? "नहीं" : "Not present"}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {L(locale, kundli.doshas.kaalSarp.meaning)}
                  </p>
                </Card>
              )}
              {doshaSub === "sadesati" && kundli.doshas?.sadeSati && (
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-maroon">
                      {hi ? "साढ़े साती" : "Sade Sati"}
                    </h3>
                    <StatusBadge
                      present={Boolean(kundli.doshas.sadeSati.present || kundli.doshas.sadeSati.active)}
                      presentLabel={hi ? "सक्रिय" : "Active"}
                      absentLabel={hi ? "सक्रिय नहीं" : "Not active"}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {L(locale, kundli.doshas.sadeSati.meaning)}
                  </p>
                  <SadeSatiTrackerPanel
                    sade={kundli.doshas.sadeSati as Record<string, unknown>}
                    locale={locale}
                  />
                </Card>
              )}
            </div>
          )}

          {reportSub === "ascendant" && ascSeo && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-display text-lg font-bold text-maroon">
                  {hi ? "लग्न भविष्य / व्यक्तित्व" : "Ascendant predictions"}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {hi
                    ? `आपका लग्न ${L(locale, kundli.lagna.sign)} है।`
                    : `Your ascendant is ${L(locale, kundli.lagna.sign)}.`}
                </p>
                <p className="mt-2 text-xs font-medium text-saffron-deep">
                  {hi
                    ? `आधार: लग्न ${L(locale, kundli.lagna.sign)} ${toDMS(kundli.lagna.degree)} · पूरे-चिह्न भाव`
                    : `Based on: Lagna ${L(locale, kundli.lagna.sign)} ${toDMS(kundli.lagna.degree)} · whole-sign houses`}
                </p>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <h4 className="font-semibold text-ink">
                    {hi ? "व्यक्तित्व" : "Personality"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-muted">
                    {L(locale, ascSeo.personality)}
                  </p>
                </Card>
                <Card>
                  <h4 className="font-semibold text-ink">
                    {hi ? "शारीरिक" : "Physical"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-muted">
                    {L(locale, ascSeo.bodyFocus)}
                  </p>
                </Card>
                <Card>
                  <h4 className="font-semibold text-ink">
                    {hi ? "स्वास्थ्य" : "Health"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-muted">
                    {L(locale, ascSeo.bodyFocus)}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-muted">
                    {ascSeo.challenges.slice(0, 3).map((c) => (
                      <li key={c.en}>{L(locale, c)}</li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <h4 className="font-semibold text-ink">
                    {hi ? "करियर" : "Career"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-muted">
                    {L(locale, ascSeo.careerFields)}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {reportSub === "planetary" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {kundli.planets.map((p) => (
                <Card key={p.id}>
                  <h4 className="font-semibold text-maroon">
                    {L(locale, p.name)}
                    {p.isRetrograde ? " ®" : ""}
                  </h4>
                  <p className="mt-2 text-sm text-ink-muted">
                    {hi
                      ? `${L(locale, p.sign)} राशि, भाव ${p.house}, ${L(locale, p.nakshatra)} नक्षत्र (पाद ${p.pada})।`
                      : `${L(locale, p.sign)} sign, house ${p.house}, ${L(locale, p.nakshatra)} nakshatra (pada ${p.pada}).`}
                  </p>
                  {p.dignity && (
                    <p className="mt-1 text-xs font-medium text-saffron-deep">
                      {L(locale, p.dignity.label)}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {reportSub === "vimshottari" && (
            <Card>
              <h3 className="font-display text-lg font-bold text-maroon">
                {hi ? "विंशोत्तरी सार" : "Vimshottari summary"}
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-ink">
                    {hi ? "वर्तमान महादशा: " : "Current Mahadasha: "}
                  </span>
                  {L(locale, kundli.dasha.currentMaha.planet)} (
                  {kundli.dasha.currentMaha.start} → {kundli.dasha.currentMaha.end})
                </p>
                <p>
                  <span className="font-semibold text-ink">
                    {hi ? "अंतरदशा: " : "Antardasha: "}
                  </span>
                  {L(locale, kundli.dasha.currentAntar.planet)}
                </p>
                {kundli.predictions?.currentPeriod && (
                  <p className="mt-3 leading-relaxed text-ink-muted">
                    {L(locale, kundli.predictions.currentPeriod.summary)}
                  </p>
                )}
                <p className="mt-3 text-xs font-medium text-saffron-deep">
                  {hi
                    ? `आधार: चंद्र नक्षत्र ${L(locale, kundli.nakshatra.name)} (पाद ${kundli.nakshatra.pada}) · स्वामी ${L(locale, kundli.nakshatra.lord)} · शेष ${kundli.dasha.balanceYears?.toFixed?.(2) ?? kundli.dasha.balanceYears} वर्ष`
                    : `Based on: Moon nakshatra ${L(locale, kundli.nakshatra.name)} (pada ${kundli.nakshatra.pada}) · lord ${L(locale, kundli.nakshatra.lord)} · balance ${kundli.dasha.balanceYears?.toFixed?.(2) ?? kundli.dasha.balanceYears} yr`}
                </p>
              </div>
            </Card>
          )}

          {reportSub === "yoga" && (
            <div className="space-y-3">
              {(kundli.yogas?.length || 0) === 0 ? (
                <Card>
                  <p className="text-sm text-ink-muted">
                    {hi
                      ? "इस स्कैन में प्रमुख योग चिह्न नहीं मिले।"
                      : "No major yoga flags in this scan."}
                  </p>
                </Card>
              ) : (
                kundli.yogas.map((y) => (
                  <Card key={y.id}>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-ink">{L(locale, y.name)}</h4>
                      <span className="text-[10px] font-bold uppercase text-ink-muted">
                        {y.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">
                      {L(locale, y.meaning)}
                    </p>
                    {y.basedOn && (
                      <p className="mt-2 text-xs font-medium text-saffron-deep">
                        {hi ? "आधार: " : "Based on: "}
                        {L(locale, y.basedOn)}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                      {hi ? `योग आईडी: ${y.id}` : `Fact id: ${y.id}`}
                    </p>
                  </Card>
                ))
              )}
            </div>
          )}

          {reportSub === "lalkitab" && (
            <LalKitabReportPanel kundli={kundli} locale={locale} />
          )}

          {reportSub === "varshphal" && (
            <VarshphalReportPanel kundli={kundli} locale={locale} />
          )}
        </div>
      )}

      <ContactCTA
        title={
          hi
            ? "गहन कुंडली विश्लेषण चाहिए?"
            : "Want a deeper Kundli analysis?"
        }
        text={
          hi
            ? "प्रेम, करियर, स्वास्थ्य और वित्त पर और जानने के लिए विशेषज्ञ ज्योतिषी से बात करें।"
            : "To know more about love, career, health and finance, consult our expert astrologers."
        }
      />

      <p className="text-center text-xs text-ink-muted">
        {hi
          ? "मार्गदर्शन और चिंतन हेतु। चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं।"
          : "For guidance and self-reflection. Not a substitute for medical, legal or financial advice."}
      </p>
      <div className="text-center">
        <Link
          href="/kundli"
          className="text-sm font-semibold text-saffron-deep underline"
        >
          {hi ? "नई कुंडली बनाएँ" : "Generate another kundli"}
        </Link>
      </div>
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
    <div className="rounded-xl border border-gold/25 bg-cosmic-navy p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-maroon font-numeric">
        {value}
      </p>
    </div>
  );
}
