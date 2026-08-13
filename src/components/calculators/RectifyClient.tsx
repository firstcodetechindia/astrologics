"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { City } from "@/lib/astrology/cities";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import {
  LIFE_EVENT_DOMAINS,
  type LifeEventDomain,
  type RectificationResult,
} from "@/lib/astrology/rectification";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";

type EventRow = { id: string; date: string; domain: LifeEventDomain };

const inputClass =
  "w-full min-w-0 rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20";

function tx(locale: string, v: { en: string; hi: string } | string) {
  if (typeof v === "string") return v;
  return locale === "hi" ? v.hi : v.en;
}

function newRow(stableId?: string): EventRow {
  return {
    // Stable ids for SSR initial rows; random only for client-added rows.
    id: stableId ?? `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    date: "",
    domain: "marriage",
  };
}

export function RectifyClient() {
  const locale = useLocale();
  const hi = locale === "hi";

  const [name, setName] = useState("Native");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [events, setEvents] = useState<EventRow[]>(() => [
    newRow("evt-0"),
    newRow("evt-1"),
    newRow("evt-2"),
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [windowMinutes, setWindowMinutes] = useState(60);
  const [stepMinutes, setStepMinutes] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RectificationResult | null>(null);

  const filledEvents = useMemo(
    () => events.filter((e) => e.date),
    [events]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (filledEvents.length < 3) {
      setError(
        hi
          ? "कम से कम 3 दिनांकित जीवन घटनाएँ आवश्यक हैं।"
          : "At least 3 dated life events are required."
      );
      return;
    }
    if (!date || !time || !place) {
      setError(hi ? "जन्म तिथि, समय और स्थान भरें।" : "Enter birth date, time and place.");
      return;
    }
    setLoading(true);
    try {
      const birth: Record<string, unknown> = {
        name: name.trim() || "Native",
        date,
        time,
        place,
        timezoneOffsetMinutes: city?.timezoneOffsetMinutes ?? 330,
        timeZone: timeZoneForPlace({
          lat: city?.lat,
          lon: city?.lon,
          offsetMinutes: city?.timezoneOffsetMinutes ?? 330,
        }),
      };
      if (city) {
        birth.lat = city.lat;
        birth.lon = city.lon;
      }
      const res = await fetch("/api/rectify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth,
          events: filledEvents.map((ev) => ({
            date: ev.date,
            domain: ev.domain,
          })),
          windowMinutes,
          stepMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (hi ? "त्रुटि" : "Something went wrong"));
        return;
      }
      setResult(data as RectificationResult);
    } catch {
      setError(hi ? "त्रुटि" : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function kundliHref() {
    if (!result) return "/kundli";
    const q = new URLSearchParams();
    q.set("name", name.trim() || "Native");
    q.set("date", date);
    q.set("time", result.best.time);
    q.set("place", place);
    if (city) {
      q.set("lat", String(city.lat));
      q.set("lon", String(city.lon));
      q.set("tzOff", String(city.timezoneOffsetMinutes ?? 330));
    }
    q.set("from", "rectify");
    return `/kundli?${q.toString()}`;
  }

  if (result) {
    const tone =
      result.confidence === "high"
        ? "good"
        : result.confidence === "medium"
          ? "warn"
          : "neutral";
    const toneClass =
      tone === "good"
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
        : tone === "warn"
          ? "bg-amber-500/15 text-amber-100 border-amber-400/30"
          : "bg-saffron/10 text-saffron-deep border-saffron/25";

    return (
      <div className="rounded-2xl border border-white/10 bg-surface shadow-sm overflow-hidden">
        <div className="border-b border-white/10 surface-wash px-5 py-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "सुझाया गया जन्म समय" : "Suggested birth time"}
          </h2>
        </div>
        <div className="p-5 sm:p-6 space-y-6">
          <div className="rounded-2xl border border-saffron/20 surface-wash p-5">
            <p className="font-display text-3xl font-bold text-ink tabular-nums">
              {result.best.time}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {result.best.offsetMinutes >= 0 ? "+" : ""}
              {result.best.offsetMinutes}{" "}
              {hi ? "मिनट आपके अनुमान से" : "min from your estimate"} · Lagna{" "}
              {tx(locale, result.best.ascendantSign)}
            </p>
            <span
              className={`mt-3 inline-flex text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${toneClass}`}
            >
              {hi ? "विश्वसनीयता" : "Confidence"}: {result.confidence}
            </span>
            <p className="mt-4 text-[14px] text-ink-muted leading-relaxed">
              {tx(locale, result.reasoning)}
            </p>
            <p className="mt-2 text-sm text-ink">
              {hi ? "घटना मेल" : "Events matched"}: {result.best.matched}/
              {result.meta.eventCount} (
              {hi ? "मेल अनुपात" : "match ratio"}{" "}
              {Math.round(result.best.score * 100)}%{" "}
              {hi ? "घटनाओं का — सही जन्म समय %" : "of events — not % true birth time"})
            </p>
          </div>

          {result.lagnaCaution && result.lagnaCautionNote ? (
            <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-100">
              {tx(locale, result.lagnaCautionNote)}
            </p>
          ) : null}

          {result.best.eventDetails?.length ? (
            <div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                {hi ? "घटना विवरण" : "Event details"}
              </h3>
              <ul className="space-y-2 text-sm text-ink-muted">
                {result.best.eventDetails.map((ed, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-white/10 px-3 py-2"
                  >
                    <span
                      className={
                        ed.matched ? "text-emerald-300" : "text-amber-200"
                      }
                    >
                      {ed.matched ? "✓" : "·"}
                    </span>{" "}
                    {tx(locale, ed.basedOn)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h3 className="font-display text-lg font-bold text-ink mb-2">
              {hi ? "अन्य उम्मीदवार" : "Other candidates"}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.candidates.slice(0, 8).map((c) => (
                <div
                  key={`${c.time}-${c.offsetMinutes}`}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-ink tabular-nums">
                    {c.time}
                  </span>
                  <span className="text-ink-muted">
                    {" "}
                    · {tx(locale, c.ascendantSign)} · {c.matched}/
                    {result.meta.eventCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            {tx(locale, result.meta.disclaimer)}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={kundliHref()}
              className="btn-grad inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-ivory text-center"
            >
              {hi
                ? "इस समय से मुफ्त कुंडली खोलें →"
                : "Apply this time to Free Kundli →"}
            </Link>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setResult(null)}
            >
              {hi ? "फिर से चलाएँ" : "Run again"}
            </Button>
          </div>
          <p className="text-xs text-ink-muted">
            {hi
              ? "कुंडली फ़ॉर्म में समय पहले से भरेगा — जनरेट करने से पहले पुष्टि करें।"
              : "Kundli form will pre-fill this time — confirm before generating."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface shadow-sm overflow-hidden">
      <div className="border-b border-white/10 surface-wash px-5 py-4">
        <h2 className="font-display text-xl font-bold text-ink">
          {hi ? "जन्म समय सुधार (रेक्टिफिकेशन)" : "Birth-time rectification"}
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-4">
        <p className="rounded-xl bg-deep-indigo/80 px-3 py-2.5 text-[13px] leading-relaxed text-ink-muted">
          {hi
            ? "अनुमानित जन्म समय + कम से कम 3 दिनांकित घटनाएँ। यह अनुमानित संरेखण है — प्रमाण नहीं। अस्पताल अभिलेख प्राथमिक।"
            : "Approximate birth time + at least 3 dated events. Heuristic alignment — not proof. Prefer hospital records."}
        </p>

        <FormField label={hi ? "नाम (वैकल्पिक)" : "Name (optional)"}>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={hi ? "जन्म तिथि" : "Date of birth"} required>
            <input
              required
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField
            label={hi ? "अनुमानित जन्म समय" : "Approximate birth time"}
            required
          >
            <input
              required
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormField>
        </div>
        <PlaceAutocomplete
          label={hi ? "जन्म स्थान" : "Place of birth"}
          value={place}
          onChange={setPlace}
          onCity={setCity}
          required
          placeholder={hi ? "शहर" : "City"}
          inputClassName={inputClass}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink text-sm">
              {hi ? "जीवन घटनाएँ (कम से कम 3)" : "Life events (min 3)"}
            </p>
            <button
              type="button"
              className="text-sm text-saffron-deep font-medium"
              onClick={() => setEvents((prev) => [...prev, newRow()])}
            >
              {hi ? "+ जोड़ें" : "+ Add"}
            </button>
          </div>
          {events.map((row, idx) => (
            <div
              key={row.id}
              className="grid sm:grid-cols-[1fr_1.2fr_auto] gap-2 items-end"
            >
              <FormField label={idx === 0 ? (hi ? "तिथि" : "Date") : ""}>
                <input
                  type="date"
                  className={inputClass}
                  value={row.date}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, date: e.target.value } : r
                      )
                    )
                  }
                />
              </FormField>
              <FormField label={idx === 0 ? (hi ? "विषय" : "Domain") : ""}>
                <select
                  className={inputClass}
                  value={row.domain}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((r) =>
                        r.id === row.id
                          ? { ...r, domain: e.target.value as LifeEventDomain }
                          : r
                      )
                    )
                  }
                >
                  {LIFE_EVENT_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {hi ? d.label.hi : d.label.en}
                    </option>
                  ))}
                </select>
              </FormField>
              <button
                type="button"
                className="text-xs text-ink-muted py-2.5 px-2"
                disabled={events.length <= 3}
                onClick={() =>
                  setEvents((prev) => prev.filter((r) => r.id !== row.id))
                }
              >
                {hi ? "हटाएँ" : "Remove"}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="text-sm text-ink-muted underline"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced
            ? hi
              ? "उन्नत छुपाएँ"
              : "Hide advanced"
            : hi
              ? "उन्नत (विंडो / चरण)"
              : "Advanced (window / step)"}
        </button>
        {showAdvanced && (
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label={hi ? "विंडो (± मिनट)" : "Window (± minutes)"}>
              <input
                type="number"
                inputMode="numeric"
                min={10}
                max={180}
                className={inputClass}
                value={windowMinutes}
                onChange={(e) => setWindowMinutes(Number(e.target.value) || 60)}
              />
            </FormField>
            <FormField label={hi ? "चरण (मिनट)" : "Step (minutes)"}>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={15}
                className={inputClass}
                value={stepMinutes}
                onChange={(e) => setStepMinutes(Number(e.target.value) || 2)}
              />
            </FormField>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? hi
              ? "खोज हो रही है…"
              : "Searching…"
            : hi
              ? "उम्मीदवार समय खोजें"
              : "Find candidate times"}
        </Button>
        {error && <p className="text-sm text-cosmic-pink">{error}</p>}
      </form>
    </div>
  );
}
