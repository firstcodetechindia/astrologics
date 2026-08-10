"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { searchCities, type City } from "@/lib/astrology/cities";
import {
  CHOGHADIYA_MEANINGS,
  dailyMuhuratFor,
  weekChoghadiya,
  type MuhuratWindow,
} from "@/lib/astrology/muhurat-now";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import { cn } from "@/lib/utils";

function tx(locale: string, v: { en: string; hi: string }) {
  return locale === "hi" ? v.hi : v.en;
}

function toneClass(tone: "good" | "neutral" | "caution", active?: boolean) {
  if (tone === "good")
    return active
      ? "border-emerald-500/40 bg-emerald-50 text-emerald-900"
      : "border-emerald-500/20 bg-emerald-50/70 text-emerald-800";
  if (tone === "caution")
    return active
      ? "border-rose-500/40 bg-rose-50 text-rose-900"
      : "border-rose-500/20 bg-rose-50/70 text-rose-800";
  return active
    ? "border-amber-500/40 bg-amber-50 text-amber-950"
    : "border-amber-500/20 bg-amber-50/60 text-amber-900";
}

function toneDot(tone: "good" | "neutral" | "caution") {
  if (tone === "good") return "bg-emerald-500";
  if (tone === "caution") return "bg-rose-500";
  return "bg-amber-500";
}

function ymdLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  // ~12:00 IST as UTC for stable day brackets
  return new Date(Date.UTC(y, m - 1, d, 6, 30, 0));
}

function shiftYmd(ymd: string, days: number) {
  const d = parseYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLongDate(ymd: string, locale: string) {
  const d = parseYmd(ymd);
  return d.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function WindowRow({
  w,
  locale,
}: {
  w: MuhuratWindow;
  locale: string;
}) {
  const meaning = CHOGHADIYA_MEANINGS[w.name.en];
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 transition",
        toneClass(w.tone, w.active),
        w.active && "ring-2 ring-saffron/35 shadow-sm"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", toneDot(w.tone))} />
          <p className="font-semibold text-[14px]">{tx(locale, w.name)}</p>
          {w.active ? (
            <span className="rounded-md bg-saffron-deep px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {locale === "hi" ? "अभी" : "Now"}
            </span>
          ) : null}
        </div>
        {meaning ? (
          <p className="mt-0.5 pl-4 text-[12px] leading-snug opacity-80">
            {tx(locale, meaning.blurb)}
          </p>
        ) : null}
      </div>
      <p className="shrink-0 font-numeric text-[13px] font-semibold tabular-nums">
        {w.start} – {w.end}
      </p>
    </div>
  );
}

const DEFAULT_CITY: City = {
  name: "New Delhi",
  state: "Delhi",
  country: "India",
  lat: 28.6139,
  lon: 77.209,
  timezoneOffsetMinutes: 330,
};

/** Live Choghadiya board — city + date first, same flow as reference sites, our brand UI. */
export function ChoghadiyaBoard() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [ymd, setYmd] = useState(() => ymdLocal(new Date()));
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [placeQuery, setPlaceQuery] = useState("New Delhi, Delhi");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [tick, setTick] = useState(0);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!cityOpen) return;
    const q = placeQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestions(searchCities(q, 6).map((c) => ({ ...c, country: c.country || "India" })));
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data.places)) {
          setSuggestions(data.places);
        }
      } catch {
        /* local */
      }
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [placeQuery, cityOpen]);

  const when = useMemo(() => {
    const base = parseYmd(ymd);
    const todayKey = ymdLocal(new Date());
    if (ymd === todayKey) return new Date();
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ymd, tick]);

  const tz = useMemo(
    () =>
      timeZoneForPlace({
        lat: city.lat,
        lon: city.lon,
        offsetMinutes: city.timezoneOffsetMinutes ?? 330,
      }),
    [city.lat, city.lon, city.timezoneOffsetMinutes]
  );

  const data = useMemo(
    () => dailyMuhuratFor(when, tz, city.lat, city.lon),
    [when, city.lat, city.lon, tz]
  );

  const week = useMemo(
    () => weekChoghadiya(parseYmd(ymd), tz, city.lat, city.lon, 7),
    [ymd, city.lat, city.lon, tz]
  );

  const isToday = ymd === ymdLocal(new Date());
  const { timeline } = data;

  return (
    <div className="space-y-6">
      {/* Controls: date nav + city — no birth form */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-2xl border border-black/[0.08] bg-white p-1 shadow-sm">
          <button
            type="button"
            aria-label={hi ? "पिछला दिन" : "Previous day"}
            className="rounded-xl p-2.5 text-ink-muted transition hover:bg-[#fff1e6] hover:text-saffron-deep"
            onClick={() => setYmd((d) => shiftYmd(d, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-[11rem] px-2 text-center sm:min-w-[14rem]">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
              {isToday ? (hi ? "आज" : "Today") : hi ? "चयनित दिन" : "Selected day"}
            </p>
            <p className="font-display text-[14px] font-bold text-ink sm:text-[15px]">
              {formatLongDate(ymd, locale)}
            </p>
          </div>
          <button
            type="button"
            aria-label={hi ? "अगला दिन" : "Next day"}
            className="rounded-xl p-2.5 text-ink-muted transition hover:bg-[#fff1e6] hover:text-saffron-deep"
            onClick={() => setYmd((d) => shiftYmd(d, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setCityOpen((v) => !v)}
            className="inline-flex w-full items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 py-2.5 text-left shadow-sm sm:w-auto"
          >
            <MapPin className="h-4 w-4 text-saffron-deep" />
            <span className="text-[14px] font-semibold text-ink">
              {city.name}
              {city.state ? ` · ${city.state}` : ""}
              {city.country ? ` · ${city.country}` : ""}
            </span>
          </button>
          {cityOpen ? (
            <div className="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border border-black/10 bg-white p-3 shadow-xl">
              <input
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder={hi ? "जन्म स्थान" : "Place of birth"}
                autoFocus
              />
              <ul className="mt-2 max-h-48 overflow-auto">
                {suggestions.map((c) => (
                  <li key={`${c.name}-${c.state}-${c.country}-${c.lat}`}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-[#fff1e6]"
                      onClick={() => {
                        setCity(c);
                        setPlaceQuery(
                          [c.name, c.state, c.country].filter(Boolean).join(", ")
                        );
                        setCityOpen(false);
                      }}
                    >
                      {c.name}
                      {(c.state || c.country) && (
                        <span className="text-ink-muted">
                          {`, ${[c.state, c.country].filter(Boolean).join(", ")}`}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Live status strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            key: "prev",
            label: hi ? "अभी समाप्त" : "Just ended",
            w: timeline.previous,
          },
          {
            key: "now",
            label: hi ? "अभी चल रहा" : "Right now",
            w: timeline.current,
          },
          {
            key: "next",
            label: hi ? "अगला" : "Up next",
            w: timeline.next,
          },
        ].map((slot) => (
          <div
            key={slot.key}
            className={cn(
              "rounded-2xl border bg-white p-4 shadow-sm",
              slot.key === "now" && "border-saffron/35 ring-1 ring-saffron/20"
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
              {slot.label}
            </p>
            {slot.w ? (
              <>
                <p className="mt-1 font-display text-lg font-bold text-ink">
                  {tx(locale, slot.w.name)}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {slot.w.start} – {slot.w.end}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    slot.w.tone === "good" && "bg-emerald-100 text-emerald-800",
                    slot.w.tone === "caution" && "bg-rose-100 text-rose-800",
                    slot.w.tone === "neutral" && "bg-amber-100 text-amber-900"
                  )}
                >
                  {slot.w.tone === "good"
                    ? hi
                      ? "शुभ"
                      : "Good"
                    : slot.w.tone === "caution"
                      ? hi
                        ? "बचें"
                        : "Avoid"
                      : hi
                        ? "सामान्य"
                        : "Neutral"}
                </span>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">—</p>
            )}
          </div>
        ))}
      </div>

      {/* Sun + important times */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
            <Sunrise className="h-3.5 w-3.5 text-saffron-deep" />
            {hi ? "सूर्योदय" : "Sunrise"}
          </p>
          <p className="mt-1 font-numeric text-xl font-bold text-ink">
            {data.meta.sunrise}
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
            <Sunset className="h-3.5 w-3.5 text-saffron-deep" />
            {hi ? "सूर्यास्त" : "Sunset"}
          </p>
          <p className="mt-1 font-numeric text-xl font-bold text-ink">
            {data.meta.sunset}
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
            {hi ? "अभिजित मुहूर्त" : "Abhijit Muhurta"}
          </p>
          <p className="mt-1 font-numeric text-[15px] font-bold text-ink">
            {data.abhijit.start} → {data.abhijit.end}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700">
            {hi ? "राहु काल" : "Rahu Kaal"}
          </p>
          <p className="mt-1 font-numeric text-[15px] font-bold text-rose-900">
            {data.rahuKaal.start} → {data.rahuKaal.end}
          </p>
        </div>
      </div>

      {/* Day / Night lists */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/[0.07] bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {hi ? "दिन की चौघड़िया" : "Daytime periods"}
              </h2>
              <p className="text-[12px] text-ink-muted">
                8 · {tx(locale, data.dayDuration)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.dayChoghadiya.map((w) => (
              <WindowRow key={`d-${w.index}`} w={w} locale={locale} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-black/[0.07] bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {hi ? "रात की चौघड़िया" : "Night periods"}
              </h2>
              <p className="text-[12px] text-ink-muted">
                8 · {tx(locale, data.nightDuration)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.nightChoghadiya.map((w) => (
              <WindowRow key={`n-${w.index}`} w={w} locale={locale} />
            ))}
          </div>
        </section>
      </div>

      <p className="text-center text-[12px] text-ink-muted">
        {hi
          ? "समय चुने शहर के सूर्योदय–सूर्यास्त पर आधारित हैं। जन्म कुंडली की ज़रूरत नहीं।"
          : "Times follow local sunrise–sunset for the selected city. No birth chart needed."}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {hi ? "शुभ" : "Auspicious"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          {hi ? "सामान्य" : "Neutral"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          {hi ? "अशुभ" : "Inauspicious"}
        </span>
      </div>

      {/* 7-day table */}
      <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
        <div className="border-b border-black/[0.06] px-4 py-4 sm:px-5">
          <h2 className="font-display text-lg font-bold text-ink">
            {hi ? "अगले 7 दिनों की चौघड़िया" : "Choghadiya for the next 7 days"}
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            {hi
              ? "हरे खंड शुभ, लाल अशुभ — समय चुने शहर के अनुसार।"
              : "Green windows are auspicious, red ones best avoided — times for your city."}
          </p>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {[
            { title: hi ? "दिन" : "Day Choghadiya", key: "day" as const },
            { title: hi ? "रात" : "Night Choghadiya", key: "night" as const },
          ].map((block) => (
            <div key={block.key} className="overflow-x-auto">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
                {block.title}
              </p>
              <table className="w-full min-w-[640px] border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-black/10 text-[#8a7a6a]">
                    <th className="py-2 pr-2 font-semibold">{hi ? "तिथि" : "Date"}</th>
                    {Array.from({ length: 8 }, (_, i) => (
                      <th key={i} className="px-1 py-2 font-semibold">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {week.map((row) => (
                    <tr key={`${block.key}-${row.dateKey}`} className="border-b border-black/[0.05]">
                      <td className="py-2 pr-2 font-semibold text-ink whitespace-nowrap">
                        {tx(locale, row.label)}
                      </td>
                      {(block.key === "day" ? row.day : row.night).map((w) => (
                        <td key={w.index} className="px-1 py-2 align-top">
                          <span
                            className={cn(
                              "inline-flex flex-col rounded-lg border px-1.5 py-1",
                              toneClass(w.tone)
                            )}
                          >
                            <span className="font-semibold leading-tight">
                              {tx(locale, w.name)}
                            </span>
                            <span className="font-numeric text-[10px] opacity-80">
                              {w.start}
                            </span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <nav className="flex flex-wrap gap-2">
        {[
          { href: "/panchang", label: hi ? "पंचांग" : "Panchang" },
          { href: "/calculators/hora", label: hi ? "होरा" : "Hora" },
          {
            href: "/calculators/gowri-panchangam",
            label: hi ? "गौरी पंचांगम" : "Gowri Panchangam",
          },
          { href: "/calculators/rahu-kaal", label: hi ? "राहु काल" : "Rahu Kaal" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-saffron/25 bg-[#fff7f0] px-3 py-1.5 text-[13px] font-semibold text-saffron-deep hover:bg-[#fff1e6]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
