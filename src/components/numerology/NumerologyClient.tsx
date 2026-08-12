"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import {
  LO_SHU_ORDER,
  buildNumerologyReport,
  compatibilityReport,
  type NumerologyReport,
} from "@/lib/numerology/compute";
import type { Loc, NumberProfile } from "@/lib/numerology/profiles";

function t(locale: string, v: Loc) {
  return locale === "hi" ? v.hi : v.en;
}

function ProfileCard({
  locale,
  label,
  number,
  profile,
}: {
  locale: string;
  label: string;
  number: number;
  profile: NumberProfile;
}) {
  return (
    <div className="rounded-2xl border border-saffron/20 bg-surface p-4 sm:p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-4xl font-bold tabular-nums text-saffron-deep">
          {number}
        </span>
        <div>
          <p className="font-semibold text-ink">{t(locale, profile.title)}</p>
          <p className="text-sm text-ink-muted">
            {locale === "hi" ? "ग्रह" : "Planet"}: {t(locale, profile.planet)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
        {t(locale, profile.traits)}
      </p>
      <dl className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">
            {locale === "hi" ? "शक्तियाँ" : "Strengths"}
          </dt>
          <dd className="text-ink-muted">{t(locale, profile.strengths)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">
            {locale === "hi" ? "सावधानी" : "Watchouts"}
          </dt>
          <dd className="text-ink-muted">{t(locale, profile.watchouts)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">
            {locale === "hi" ? "शुभ रंग" : "Lucky colours"}
          </dt>
          <dd className="text-ink-muted">{t(locale, profile.luckyColors)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">
            {locale === "hi" ? "शुभ दिन / दिशा" : "Lucky day / direction"}
          </dt>
          <dd className="text-ink-muted">
            {t(locale, profile.luckyDays)} · {t(locale, profile.direction)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[12px] text-ink-muted">
        {locale === "hi" ? "अनुकूल अंक" : "Compatible"}:{" "}
        <span className="font-semibold text-ink">
          {profile.compatible.join(", ")}
        </span>
        {" · "}
        {locale === "hi" ? "चुनौतीपूर्ण" : "Challenging"}:{" "}
        <span className="font-semibold text-ink">
          {profile.challenging.join(", ")}
        </span>
      </p>
    </div>
  );
}

function TierBadge({
  locale,
  tier,
}: {
  locale: string;
  tier: "friendly" | "neutral" | "challenging";
}) {
  const label =
    tier === "friendly"
      ? locale === "hi"
        ? "मित्र"
        : "Friendly"
      : tier === "challenging"
        ? locale === "hi"
          ? "चुनौती"
          : "Challenging"
        : locale === "hi"
          ? "तटस्थ"
          : "Neutral";
  const cls =
    tier === "friendly"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
      : tier === "challenging"
        ? "bg-rose-500/15 text-rose-200 border-rose-400/30"
        : "bg-amber-500/15 text-amber-100 border-amber-400/30";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

function Results({
  report,
  locale,
  onReset,
}: {
  report: NumerologyReport;
  locale: string;
  onReset: () => void;
}) {
  const hi = locale === "hi";
  const nameCompat = compatibilityReport(
    report.chaldean.expression,
    report.vedic.bhagyank
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-saffron/20 surface-wash p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            {hi ? "आपका अंक सार" : "Your number snapshot"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {report.name}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{report.date}</p>
        </div>
        <Button type="button" variant="ghost" onClick={onReset}>
          {hi ? "फिर से जाँचें" : "Check again"}
        </Button>
      </div>

      <section className="space-y-4">
        <h3 className="font-display text-xl font-bold text-ink">
          {hi ? "वैदिक — मूलांक व भाग्यांक" : "Vedic — Mulank & Bhagyank"}
        </h3>
        <p className="text-[14px] text-ink-muted leading-relaxed">
          {hi
            ? "मूलांक केवल जन्म दिन से आता है (व्यक्तित्व)। भाग्यांक पूरी तिथि DD+MM+YYYY के अंकों से (जीवन दिशा)। मास्टर अंक 11/22 भाग्यांक में सुरक्षित रह सकते हैं।"
            : "Mulank comes from the birth day only (core personality). Bhagyank from all digits of DD+MM+YYYY (life direction). Master numbers 11/22 may be preserved in Bhagyank."}
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <ProfileCard
            locale={locale}
            label={hi ? "मूलांक (मूल / साइकिक)" : "Mulank (root / psychic)"}
            number={report.vedic.mulank}
            profile={report.vedic.mulankProfile}
          />
          <ProfileCard
            locale={locale}
            label={hi ? "भाग्यांक (भाग्य / लाइफ पाथ)" : "Bhagyank (destiny / life path)"}
            number={report.vedic.bhagyank}
            profile={report.vedic.bhagyankProfile}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl font-bold text-ink">
          {hi ? "नाम अंक — कैल्डियन व पाइथागोरस" : "Name numbers — Chaldean & Pythagorean"}
        </h3>
        <p className="text-[14px] text-ink-muted leading-relaxed">
          {hi
            ? "भारत में नाम विश्लेषण हेतु कैल्डियन अधिक प्रचलित है (अंक 9 पवित्र माना जाता है)। पाइथागोरस पश्चिमी 1–9 क्रम है। दोनों सिस्टम मिश्रित न करें — परिणाम अलग होंगे।"
            : "In India, Chaldean is preferred for name analysis (9 is sacred and unused in the letter map). Pythagorean is the Western 1–9 sequence. Never mix tables — they produce different Name Numbers."}
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
              Chaldean
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  n: report.chaldean.expression,
                  l: hi ? "अभिव्यक्ति" : "Expression",
                },
                { n: report.chaldean.soulUrge, l: hi ? "आत्मा" : "Soul urge" },
                {
                  n: report.chaldean.personality,
                  l: hi ? "व्यक्तित्व" : "Personality",
                },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-saffron/15 bg-cosmic-navy px-2 py-3"
                >
                  <p className="font-display text-2xl font-bold tabular-nums text-saffron-deep">
                    {x.n}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase text-ink-muted">
                    {x.l}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              {t(locale, report.chaldean.expressionProfile.traits)}
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Pythagorean
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  n: report.pythagorean.expression,
                  l: hi ? "अभिव्यक्ति" : "Expression",
                },
                {
                  n: report.pythagorean.soulUrge,
                  l: hi ? "आत्मा" : "Soul urge",
                },
                {
                  n: report.pythagorean.personality,
                  l: hi ? "व्यक्तित्व" : "Personality",
                },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-white/10 bg-cosmic-navy px-2 py-3"
                >
                  <p className="font-display text-2xl font-bold tabular-nums text-ink">
                    {x.n}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase text-ink-muted">
                    {x.l}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              {t(locale, report.pythagorean.expressionProfile.traits)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-saffron/15 bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">
              {hi
                ? "कैल्डियन नाम अंक × भाग्यांक"
                : "Chaldean name number × Bhagyank"}
            </p>
            <TierBadge locale={locale} tier={nameCompat.tier} />
          </div>
          <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
            {t(locale, nameCompat.note)}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl font-bold text-ink">
          {hi ? "लो शू ग्रिड" : "Lo Shu Grid"}
        </h3>
        <p className="text-[14px] text-ink-muted leading-relaxed">
          {t(locale, report.loShu.summary)}
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="mx-auto w-full max-w-xs">
            <div className="grid grid-cols-3 gap-2.5">
              {LO_SHU_ORDER.map((n) => {
                const count = report.loShu.grid[n] ?? 0;
                const filled = count > 0;
                return (
                  <div
                    key={n}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center ${
                      filled
                        ? "border-saffron/35 surface-wash shadow-sm"
                        : "border-white/10 bg-surface"
                    }`}
                    title={`${n}: ${count}`}
                  >
                    <span className="text-xs text-ink-muted/80 tabular-nums">{n}</span>
                    <span
                      className={`font-display text-2xl font-bold tabular-nums ${
                        filled ? "text-saffron-deep" : "text-ink/25"
                      }`}
                    >
                      {count || "·"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center text-[11px] text-ink-muted">
              {hi ? "पैटर्न 4-9-2 / 3-5-7 / 8-1-6" : "Pattern 4-9-2 / 3-5-7 / 8-1-6"}
            </p>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {hi ? "अनुपस्थित अंक (विकास)" : "Missing numbers (growth)"}
              </p>
              {report.loShu.missing.length === 0 ? (
                <p className="mt-1 text-sm text-ink-muted">
                  {hi ? "कोई अनुपस्थित अंक नहीं।" : "No missing numbers."}
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {report.loShu.missing.map((n) => (
                    <li
                      key={n}
                      className="rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm"
                    >
                      <span className="font-bold text-saffron-deep tabular-nums">
                        {n}
                      </span>
                      <span className="text-ink-muted">
                        {" "}
                        — {t(locale, report.loShu.cellThemes[n])}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {hi ? "सक्रिय तीर / तल" : "Active arrows / planes"}
              </p>
              {report.loShu.activeArrows.length === 0 ? (
                <p className="mt-1 text-sm text-ink-muted">
                  {hi
                    ? "कोई पूर्ण तीर नहीं — तल अभी विकसित हो रहे हैं।"
                    : "No complete arrows yet — planes are still developing."}
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {report.loShu.activeArrows.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl border border-emerald-400/25 bg-emerald-500/15 px-3 py-2 text-sm"
                    >
                      <p className="font-semibold text-ink">{t(locale, a.title)}</p>
                      <p className="text-ink-muted">{t(locale, a.meaning)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-saffron/20 bg-surface p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold text-ink">
          {hi
            ? `व्यक्तिगत वर्ष ${report.personalYear.year}`
            : `Personal year ${report.personalYear.year}`}
        </h3>
        <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
          {hi
            ? `इस वर्ष का स्वर अंक ${report.personalYear.number} है — जन्म दिन + माह + वर्तमान वर्ष।`
            : `This year’s tone number is ${report.personalYear.number} — from birth day + month + current year.`}
        </p>
        <div className="mt-4">
          <ProfileCard
            locale={locale}
            label={hi ? "वर्ष अंक" : "Year number"}
            number={report.personalYear.number}
            profile={report.personalYear.profile}
          />
        </div>
      </section>

      <p className="text-[13px] leading-relaxed text-ink-muted border-t border-white/10 pt-4">
        {hi
          ? "अंक ज्योतिष चिंतन का ढाँचा है — चिकित्सा, कानूनी या वित्तीय सलाह नहीं। कुंडली मिलान के लिए जन्म कुंडली उपकरण भी देखें।"
          : "Numerology is a reflective framework — not medical, legal or financial advice. For marriage matching, also use Janam Kundli tools."}
      </p>
    </div>
  );
}

export function NumerologyClient({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [tried, setTried] = useState(false);

  const nameOk = name.trim().length >= 2;
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const canSubmit = nameOk && dateOk;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!canSubmit) {
      setShakeKey((k) => k + 1);
      setError(
        hi
          ? "कृपया मान्य नाम और जन्म तिथि दर्ज करें।"
          : "Please enter a valid name and birth date."
      );
      return;
    }
    setError(null);
    try {
      const r = buildNumerologyReport(name, date);
      setReport(r);
    } catch {
      setShakeKey((k) => k + 1);
      setError(
        hi
          ? "कृपया मान्य नाम और जन्म तिथि दर्ज करें।"
          : "Please enter a valid name and birth date."
      );
    }
  }

  if (report) {
    return (
      <Results
        report={report}
        locale={locale}
        onReset={() => setReport(null)}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-saffron/20 bg-surface p-5 shadow-sm sm:p-6"
      noValidate
    >
      <div>
        <h2 className="font-display text-xl font-bold text-ink">
          {hi ? "अपने अंक जाँचें" : "Check your numbers"}
        </h2>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
          {hi
            ? "नाम और जन्म तिथि से मूलांक, भाग्यांक, कैल्डियन/पाइथागोरस नाम अंक और लो शू ग्रिड एक साथ।"
            : "From name and date of birth — Mulank, Bhagyank, Chaldean/Pythagorean name numbers and Lo Shu grid together."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={hi ? "पूरा नाम" : "Full name"}
          required
          error={
            tried && !nameOk
              ? hi
                ? "आवश्यक"
                : "Required"
              : false
          }
          shakeKey={shakeKey}
        >
          <input
            className="field w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={hi ? "जैसे Priya Sharma" : "e.g. Priya Sharma"}
            autoComplete="name"
          />
        </FormField>
        <FormField
          label={hi ? "जन्म तिथि" : "Date of birth"}
          required
          error={
            tried && !dateOk
              ? hi
                ? "आवश्यक"
                : "Required"
              : false
          }
          shakeKey={shakeKey}
        >
          <input
            type="date"
            className="field w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>
      </div>

      {error && (
        <p className="text-sm text-cosmic-pink" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto">
        {hi ? "अंक रिपोर्ट देखें" : "See numerology report"}
      </Button>
    </form>
  );
}
