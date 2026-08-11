"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DIRECTIONS,
  PLACEMENT_RULES,
  buildAstroVastuInsight,
  scoreVastuPlan,
  type AstroVastuInsight,
  type RoomPlacement,
  type VastuScoreResult,
} from "@/lib/vastu/score";
import type { Loc, VastuDirection, VastuRoom } from "@/lib/vastu/rules";

function t(locale: string, v: Loc) {
  return locale === "hi" ? v.hi : v.en;
}

function StatusBadge({
  locale,
  status,
}: {
  locale: string;
  status: "ideal" | "acceptable" | "dosha";
}) {
  const hi = locale === "hi";
  const label =
    status === "ideal"
      ? hi
        ? "आदर्श"
        : "Ideal"
      : status === "dosha"
        ? hi
          ? "दोष"
          : "Dosha"
        : hi
          ? "कामचलाऊ"
          : "Acceptable";
  const cls =
    status === "ideal"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "dosha"
        ? "bg-rose-50 text-rose-800 border-rose-200"
        : "bg-amber-50 text-amber-900 border-amber-200";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

function Results({
  locale,
  result,
  astro,
  onReset,
}: {
  locale: string;
  result: VastuScoreResult;
  astro: AstroVastuInsight | null;
  onReset: () => void;
}) {
  const hi = locale === "hi";
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-saffron/25 bg-gradient-to-br from-[#fff7f0] via-white to-[#ffe8d4]/60 p-5 sm:p-7 shadow-[0_12px_40px_-24px_rgba(240,106,0,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
              {hi ? "आपका वास्तु परिणाम" : "Your Vastu result"}
            </p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums text-saffron-deep">
              {result.overall}
              <span className="text-xl text-ink-muted">/100</span>
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              {t(locale, result.summary)}
            </p>
            {!result.northConfirmed && (
              <p className="mt-2 text-[13px] font-medium text-amber-800">
                {hi
                  ? "नोट: सच्चा उत्तर दिशा की पुष्टि नहीं हुई — स्कोर आपके चुने दिशा टैग्स पर आधारित है।"
                  : "Note: True North was not confirmed — score uses the direction tags you selected."}
              </p>
            )}
          </div>
          <Button type="button" variant="ghost" onClick={onReset}>
            {hi ? "फॉर्म संपादित करें" : "Edit form"}
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-center text-[12px]">
          <span className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3.5 py-2.5">
            <span className="font-bold text-emerald-700 tabular-nums">
              {result.idealCount}
            </span>{" "}
            {hi ? "आदर्श" : "ideal"}
          </span>
          <span className="rounded-xl border border-rose-100 bg-rose-50/80 px-3.5 py-2.5">
            <span className="font-bold text-rose-700 tabular-nums">
              {result.doshaCount}
            </span>{" "}
            {hi ? "दोष" : "Dosha"}
          </span>
          <span className="rounded-xl border border-black/5 bg-white/90 px-3.5 py-2.5">
            <span className="font-bold text-ink tabular-nums">
              {result.findings.length}
            </span>{" "}
            {hi ? "क्षेत्र" : "zones"}
          </span>
        </div>
      </div>

      {astro && (
        <section className="space-y-3 rounded-2xl border border-saffron/20 bg-white p-5 sm:p-6">
          <h3 className="font-display text-xl font-bold text-ink">
            {hi ? "एस्ट्रो-वास्तु (कुंडली से)" : "Astro-Vastu (from your chart)"}
          </h3>
          <p className="text-[14px] text-ink-muted leading-relaxed">
            {hi
              ? `लग्न ${t(locale, astro.lagnaSign)} — तत्व ${t(locale, astro.lagnaElement)}। दिशा नियम + व्यक्तिगत तत्व सुझाव।`
              : `Lagna ${t(locale, astro.lagnaSign)} — element ${t(locale, astro.lagnaElement)}. Direction rules + personalised element cues.`}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 text-[14px]">
            <li className="rounded-xl border border-black/[0.06] bg-[#faf8f5] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {hi ? "सोने की दिशा" : "Sleep facing"}
              </p>
              <p className="mt-1 text-ink-muted">{t(locale, astro.sleepHint)}</p>
            </li>
            <li className="rounded-xl border border-black/[0.06] bg-[#faf8f5] px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {hi ? "अध्ययन दिशा" : "Study facing"}
              </p>
              <p className="mt-1 text-ink-muted">{t(locale, astro.studyHint)}</p>
            </li>
            <li className="rounded-xl border border-black/[0.06] bg-[#faf8f5] px-3 py-3 sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {hi ? "क्षेत्र प्राथमिकता" : "Zone focus"}
              </p>
              <p className="mt-1 text-ink-muted">{t(locale, astro.zoneFocus)}</p>
            </li>
            {astro.currentDasha && (
              <li className="rounded-xl border border-saffron/20 bg-[#fff7f0] px-3 py-3 sm:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
                  {hi ? "वर्तमान महादशा" : "Current Mahadasha"}:{" "}
                  {t(locale, astro.currentDasha.planet)}
                </p>
                <p className="mt-1 text-ink-muted">
                  {t(locale, astro.currentDasha.hint)}
                </p>
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="font-display text-xl font-bold text-ink">
          {hi ? "क्षेत्र-वार निष्कर्ष व उपाय" : "Zone-by-zone findings & remedies"}
        </h3>
        <p className="text-[14px] text-ink-muted">
          {hi
            ? "डिफ़ॉल्ट सुझाव गैर-संरचनात्मक हैं (प्रकाश, रंग, व्यवस्था, प्रतीक) — दीवार हटाना अंतिम विकल्प।"
            : "Default suggestions are non-structural (light, colour, order, symbols) — rebuilding walls is a last resort."}
        </p>
        <div className="space-y-3">
          {result.findings.map((f) => (
            <article
              key={`${f.room}-${f.direction}`}
              className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-ink">
                  {t(locale, f.roomLabel)}
                </h4>
                <StatusBadge locale={locale} status={f.status} />
                <span className="text-sm text-ink-muted">
                  → {t(locale, f.directionLabel)}
                </span>
              </div>
              <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
                {t(locale, f.explanation)}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted/90">
                {t(locale, f.note)}
              </p>
              <div className="mt-3 rounded-xl border border-saffron/15 bg-[#fffaf6] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
                  {hi ? "उपाय" : "Remedy"}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink">
                  {t(locale, f.remedy)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function VastuClient({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const resultsRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<RoomPlacement[]>([
    { room: "entrance", direction: "E" },
    { room: "kitchen", direction: "SE" },
    { room: "master_bedroom", direction: "SW" },
  ]);
  const [northConfirmed, setNorthConfirmed] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");
  const [result, setResult] = useState<VastuScoreResult | null>(null);
  const [astro, setAstro] = useState<AstroVastuInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAstro, setShowAstro] = useState(false);

  const usedRooms = useMemo(() => new Set(rows.map((r) => r.room)), [rows]);

  useEffect(() => {
    if (!result) return;
    const id = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(id);
  }, [result]);

  function updateRow(i: number, patch: Partial<RoomPlacement>) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    );
  }

  function addRow() {
    const next = PLACEMENT_RULES.find((r) => !usedRooms.has(r.room));
    if (!next) return;
    setRows((prev) => [
      ...prev,
      { room: next.room, direction: next.ideal[0] ?? "N" },
    ]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rows.length === 0) {
      setError(
        hi
          ? "कम से कम एक कक्ष व दिशा जोड़ें।"
          : "Add at least one room and direction."
      );
      return;
    }
    const scored = scoreVastuPlan(rows, { northConfirmed });
    setResult(scored);

    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const insight = buildAstroVastuInsight({
        name: name.trim() || "Vastu user",
        date,
        time: time || "12:00",
        place: "India",
        lat: 28.6139,
        lon: 77.209,
        timezoneOffsetMinutes: 330,
      });
      setAstro(insight);
    } else {
      setAstro(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="overflow-hidden rounded-3xl border border-saffron/20 bg-white shadow-[0_16px_48px_-28px_rgba(42,33,24,0.35)]"
      >
        {/* Form header */}
        <div className="border-b border-saffron/15 bg-gradient-to-br from-[#fff7f0] via-white to-[#ffe8d4]/40 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron to-maroon text-white shadow-md shadow-saffron/30">
              <Compass className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                {hi ? "चरण 1 · स्थान" : "Step 1 · Placement"}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                {hi ? "घर का वास्तु जाँचें" : "Check your home Vastu"}
              </h2>
              <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
                {hi
                  ? "प्रत्येक कक्ष की दिशा चुनें। स्कोर केवल सार है — असली निष्कर्ष क्षेत्र-वार दोष व उपाय हैं।"
                  : "Choose each room’s direction. The score is only a summary — real findings are zone Doshas and remedies."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-6">
          {/* North confirm */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-[#fff9f0] px-4 py-3.5 text-[13px] text-amber-950 transition hover:border-amber-300">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#F06A00]"
              checked={northConfirmed}
              onChange={(e) => setNorthConfirmed(e.target.checked)}
            />
            <span className="leading-relaxed">
              <span className="font-semibold">
                {hi ? "सच्चा उत्तर दिशा पुष्टि" : "Confirm true North"}
              </span>
              <span className="mt-0.5 block text-amber-900/80">
                {hi
                  ? "कम्पास या मानचित्र से — फोटो से अनुमान नहीं।"
                  : "Use a compass or map — don’t guess from a floor-plan photo."}
              </span>
            </span>
          </label>

          {/* Room rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                {hi ? "कक्ष व दिशा" : "Rooms & directions"}
              </p>
              <span className="rounded-full bg-[#fff1e6] px-2.5 py-0.5 text-[11px] font-semibold text-saffron-deep">
                {rows.length} {hi ? "जोड़" : "added"}
              </span>
            </div>

            {rows.map((row, i) => (
              <div
                key={`${row.room}-${i}`}
                className="group relative grid gap-3 rounded-2xl border border-black/[0.07] bg-[#faf8f5] p-3.5 transition hover:border-saffron/30 hover:bg-[#fffaf6] sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end sm:gap-3 sm:p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold tabular-nums text-saffron-deep shadow-sm ring-1 ring-saffron/15 sm:mb-0.5">
                  {i + 1}
                </div>

                <label className="block min-w-0 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                    {hi ? "कक्ष" : "Room"}
                  </span>
                  <select
                    className="field w-full !rounded-xl !bg-white"
                    value={row.room}
                    onChange={(e) =>
                      updateRow(i, { room: e.target.value as VastuRoom })
                    }
                  >
                    {PLACEMENT_RULES.map((r) => (
                      <option
                        key={r.room}
                        value={r.room}
                        disabled={usedRooms.has(r.room) && r.room !== row.room}
                      >
                        {t(locale, r.label)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block min-w-0 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                    {hi ? "दिशा" : "Direction"}
                  </span>
                  <select
                    className="field w-full !rounded-xl !bg-white"
                    value={row.direction}
                    onChange={(e) =>
                      updateRow(i, {
                        direction: e.target.value as VastuDirection,
                      })
                    }
                  >
                    {DIRECTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {t(locale, d.label)}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={rows.length <= 1}
                  aria-label={hi ? "हटाएँ" : "Remove"}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-ink-muted transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 sm:mb-0.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= PLACEMENT_RULES.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-saffron/35 bg-[#fffaf6] px-4 py-3 text-sm font-semibold text-saffron-deep transition hover:border-saffron/55 hover:bg-[#fff1e6] disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              {hi ? "और कक्ष जोड़ें" : "Add another room"}
            </button>
          </div>

          {/* Optional Astro-Vastu */}
          <div className="rounded-2xl border border-black/[0.06] bg-[#faf8f5] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAstro((v) => !v)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/60"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                  {hi ? "चरण 2 · वैकल्पिक" : "Step 2 · Optional"}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-ink">
                  {hi
                    ? "एस्ट्रो-वास्तु (लग्न + दशा)"
                    : "Astro-Vastu (Lagna + Dasha)"}
                </p>
              </div>
              <span className="text-saffron-deep text-lg font-bold">
                {showAstro ? "−" : "+"}
              </span>
            </button>
            {showAstro && (
              <div className="space-y-3 border-t border-black/[0.05] px-4 pb-4 pt-3">
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  {hi
                    ? "जन्म तिथि दें तो लग्न तत्व व वर्तमान महादशा से व्यक्तिगत दिशा सुझाव जुड़ेंगे।"
                    : "Add birth date to personalise sleep/study facing from Lagna element and current Mahadasha."}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block space-y-1.5">
                    <span className="text-[12px] font-semibold text-ink">
                      {hi ? "नाम" : "Name"}
                    </span>
                    <input
                      className="field w-full !rounded-xl !bg-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={hi ? "वैकल्पिक" : "Optional"}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[12px] font-semibold text-ink">
                      {hi ? "जन्म तिथि" : "Birth date"}
                    </span>
                    <input
                      type="date"
                      className="field w-full !rounded-xl !bg-white"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[12px] font-semibold text-ink">
                      {hi ? "जन्म समय" : "Birth time"}
                    </span>
                    <input
                      type="time"
                      className="field w-full !rounded-xl !bg-white"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-rose-700" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Sticky-feel CTA bar */}
        <div className="border-t border-black/[0.06] bg-[#faf8f6] px-5 py-4 sm:px-7">
          <Button
            type="submit"
            className="w-full sm:w-auto sm:min-w-[14rem] !rounded-2xl !px-8 !py-3.5 text-[15px]"
          >
            {hi ? "वास्तु रिपोर्ट देखें" : "See Vastu report"}
          </Button>
          <p className="mt-2 text-[12px] text-ink-muted">
            {hi
              ? "परिणाम नीचे खुलेंगे और पृष्ठ अपने आप स्क्रॉल होगा।"
              : "Results open below and the page scrolls to them automatically."}
          </p>
        </div>
      </form>

      {result && (
        <div
          ref={resultsRef}
          id="vastu-results"
          tabIndex={-1}
          className="scroll-mt-28 outline-none"
        >
          <Results
            locale={locale}
            result={result}
            astro={astro}
            onReset={() => {
              setResult(null);
              setAstro(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}
