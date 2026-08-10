"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import type { City } from "@/lib/astrology/cities";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import type { CalculatorMeta } from "@/lib/calculators/catalog";
import { getFormConfig } from "@/lib/calculators/form-config";
import { Button } from "@/components/ui/Button";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { LoShuResult } from "./LoShuResult";
import { ExplainedResultView } from "./ExplainedResultView";
import { explainCalculatorResult } from "@/lib/astrology/explain-result";

function PlaceField({
  label,
  value,
  onChange,
  onCity,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onCity: (c: City | null) => void;
}) {
  return (
    <PlaceAutocomplete
      label={label}
      value={value}
      onChange={onChange}
      onCity={onCity}
      placeholder="Place of birth"
      inputClassName="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20";

function bilingual(val: unknown, locale: string): string {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean")
    return String(val);
  if (typeof val === "object" && val !== null && ("en" in val || "hi" in val)) {
    const o = val as { en?: string; hi?: string };
    return locale === "hi" ? o.hi || o.en || "" : o.en || o.hi || "";
  }
  return "";
}

function LoveResult({
  data,
  locale,
  onReset,
}: {
  data: Record<string, unknown>;
  locale: string;
  onReset: () => void;
}) {
  const pct = Number(data.percent) || 0;
  const badge =
    pct >= 75
      ? { en: "Great Match", hi: "बहुत अच्छा मेल" }
      : pct >= 55
        ? { en: "Good Match", hi: "अच्छा मेल" }
        : { en: "Needs care", hi: "सावधानी से देखें" };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium text-ink-muted uppercase tracking-wide">
          {String(data.name1)} & {String(data.name2)}
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-5xl">❤️</span>
          <p className="font-display text-6xl font-bold text-saffron-deep tabular-nums">
            {pct}%
          </p>
          <span className="rounded-full bg-saffron/15 text-saffron-deep text-sm font-semibold px-3 py-1">
            {locale === "hi" ? badge.hi : badge.en}
          </span>
        </div>
        <p className="mt-4 text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
          {bilingual(data.note, locale)}
        </p>
      </div>

      <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5 space-y-3">
        <h4 className="font-display text-lg font-bold text-ink">
          {locale === "hi" ? "परिणाम कैसे समझें" : "How to understand this"}
        </h4>
        <ul className="space-y-2 text-[14px] text-ink-muted leading-relaxed">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
            {locale === "hi"
              ? "यह नाम-आधारित पारंपरिक सन्निकटन है — जन्म चंद्र नक्षत्र से गुण मिलान अधिक सटीक।"
              : "This is a traditional name-based approximation — birth Moon Gun Milan is more precise."}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
            {locale === "hi"
              ? "55%+ अक्सर अनुकूल संकेत; कम प्रतिशत पर भी पूर्ण कुंडली भिन्न कहानी बता सकती है।"
              : "55%+ is often a friendly signal; lower % can still look fine on a full kundli."}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
            {locale === "hi"
              ? "विवाह निर्णय हेतु कुंडली मिलान + व्यक्तिगत परामर्श लें।"
              : "For marriage decisions, use Kundli Matching + a personal reading."}
          </li>
        </ul>
      </div>

      <Button type="button" variant="secondary" className="w-full" onClick={onReset}>
        {locale === "hi" ? "दूसरा जोड़ा आज़माएँ" : "Try another pair"}
      </Button>
    </div>
  );
}

function MatchResult({ data, locale, onReset }: { data: Record<string, unknown>; locale: string; onReset: () => void }) {
  const total = Number(data.total) || 0;
  const max = Number(data.max) || 36;
  const pct = Math.round((total / max) * 100);
  return (
    <div className="space-y-4">
      <div className="text-center rounded-2xl bg-gradient-to-br from-saffron/10 to-maroon/5 p-6 border border-saffron/15">
        <p className="text-sm text-ink-muted">
          {locale === "hi" ? "कुल गुण" : "Total Gunas"}
        </p>
        <p className="font-display text-5xl font-bold text-saffron-deep mt-1 tabular-nums">
          {String(data.total)}{" "}
          <span className="text-2xl text-ink-muted font-semibold">/ {String(data.max)}</span>
        </p>
        <p className="mt-2 text-maroon font-semibold">
          {bilingual(data.verdict, locale)}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          {total} {locale === "hi" ? "में से" : "of"} {max}{" "}
          {locale === "hi" ? "गुण" : "gunas"} · {pct}%
        </p>
        <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
          {locale === "hi"
            ? "अष्टकूट चंद्र नक्षत्रों से आठ परीक्षाएँ अंकित करता है। कम नाड़ी/भकूट पर पूर्ण कुंडली से पुष्टि करें — अंक अकेले अंतिम नहीं।"
            : "Ashtakoot scores eight Moon-nakshatra tests. Low Nadi/Bhakoot need full-chart review — the total alone is not final."}
        </p>
      </div>
      {(data.boy != null || data.girl != null) ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[data.boy, data.girl].filter(Boolean).map((person, i) => {
            const p = person as Record<string, unknown>;
            const nak = p.nakshatra as Record<string, unknown> | undefined;
            return (
              <div key={i} className="rounded-xl border border-black/8 p-3 bg-sand/20">
                <p className="font-bold text-ink text-sm uppercase tracking-wide">
                  {String(p.name)}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  {bilingual(nak?.name, locale)}
                  {nak?.pada != null ? ` · Pada ${nak.pada}` : ""}
                </p>
                <p className="text-xs text-ink-muted">
                  {bilingual(p.moon, locale)}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-2">
          {locale === "hi" ? "कूट विवरण — प्रत्येक परीक्षा का अर्थ" : "Koota breakdown — what each test means"}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(data.scores as Record<string, unknown>[]).map((s, i) => (
            <div key={i} className="rounded-xl border border-black/8 px-3 py-2.5 bg-white">
              <div className="flex justify-between text-sm font-medium">
                <span>{bilingual(s.name, locale)}</span>
                <span className="tabular-nums">
                  {String(s.score)}/{String(s.max)}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1">{bilingual(s.note, locale)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-ink/[0.03] border border-black/5 px-4 py-3 text-xs text-ink-muted leading-relaxed">
        {locale === "hi"
          ? "विवाह निर्णय हेतु दशा, भाव और नवमांश सहित व्यक्तिगत परामर्श लें।"
          : "For marriage decisions, take a personal reading with dasha, houses and Navamsa."}
      </div>
      <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
        {locale === "hi" ? "फिर से गणना करें" : "Calculate again"}
      </Button>
    </div>
  );
}

function ResultBlock({
  data,
  locale,
  slug,
  onReset,
}: {
  data: unknown;
  locale: string;
  slug: string;
  onReset: () => void;
}) {
  if (data == null) return null;

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (slug === "love-calculator" && "percent" in obj) {
      return <LoveResult data={obj} locale={locale} onReset={onReset} />;
    }
    if (slug === "lo-shu-grid" || obj.kind === "lo-shu") {
      return <LoShuResult data={obj} locale={locale} onReset={onReset} />;
    }
    if ("total" in obj && "scores" in obj && Array.isArray(obj.scores)) {
      return <MatchResult data={obj} locale={locale} onReset={onReset} />;
    }

    const explained = explainCalculatorResult(slug, obj);
    if (explained) {
      return (
        <ExplainedResultView data={explained} locale={locale} onReset={onReset} />
      );
    }
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="rounded-xl bg-sand/30 px-4 py-3">
            <ResultBlock data={item} locale={locale} slug={slug} onReset={onReset} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data !== "object" || data === null) {
    return <p className="text-lg font-semibold text-saffron-deep">{String(data)}</p>;
  }

  const obj = data as Record<string, unknown>;
  return (
    <dl className="space-y-3">
      {Object.entries(obj).map(([key, val]) => {
        if (key === "raw" || key === "longitude" || key === "computedAt") return null;
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());

        if (
          val != null &&
          typeof val === "object" &&
          !Array.isArray(val) &&
          ("en" in (val as object) || "hi" in (val as object))
        ) {
          return (
            <div
              key={key}
              className="flex justify-between gap-4 border-b border-black/5 pb-2"
            >
              <dt className="text-sm text-ink-muted">{label}</dt>
              <dd className="text-sm font-medium text-ink text-right">
                {bilingual(val, locale)}
              </dd>
            </div>
          );
        }

        if (Array.isArray(val) || (val != null && typeof val === "object")) {
          return (
            <div key={key} className="pt-2">
              <p className="text-sm font-semibold text-saffron-deep mb-2">{label}</p>
              <ResultBlock data={val} locale={locale} slug={slug} onReset={onReset} />
            </div>
          );
        }

        return (
          <div
            key={key}
            className="flex justify-between gap-4 border-b border-black/5 pb-2"
          >
            <dt className="text-sm text-ink-muted">{label}</dt>
            <dd className="text-sm font-medium text-ink text-right">{String(val)}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function CalculatorClient({
  meta,
  toolTitle,
}: {
  meta: CalculatorMeta;
  toolTitle: string;
}) {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [number, setNumber] = useState("108");
  const [value, setValue] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [date2, setDate2] = useState("");
  const [boy, setBoy] = useState({ name: "", date: "", time: "12:00", place: "" });
  const [girl, setGirl] = useState({ name: "", date: "", time: "12:00", place: "" });
  const [boyCity, setBoyCity] = useState<City | null>(null);
  const [girlCity, setGirlCity] = useState<City | null>(null);

  const form = useMemo(() => getFormConfig(meta), [meta]);
  const pick = (t: { en: string; hi: string }) =>
    locale === "hi" ? t.hi : t.en;

  const labels = useMemo(
    () =>
      locale === "hi"
        ? {
            name: form.nameRequired ? "नाम *" : "नाम (वैकल्पिक)",
            date: pick(form.dateLabel),
            time: pick(form.timeLabel),
            place: pick(form.placeLabel),
            submit: "गणना करें",
            loading: "गणना हो रही है…",
            result: "परिणाम",
            boy: "वर / साथी A",
            girl: "वधू / साथी B",
            name1: "आपका नाम *",
            name2: "उनका नाम *",
            number: pick(form.valueLabel),
            value: pick(form.valueLabel),
            year: "वर्ष",
            date2:
              meta.slug === "love-compatibility-num"
                ? "दूसरी जन्म तिथि"
                : "दूसरी तिथि",
            error: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
            yourName: "आपका नाम",
            theirName: "उनका नाम",
            hint: form.hint ? pick(form.hint) : "",
          }
        : {
            name: form.nameRequired ? "Name *" : "Name (optional)",
            date: pick(form.dateLabel),
            time: pick(form.timeLabel),
            place: pick(form.placeLabel),
            submit:
              meta.slug === "love-calculator" ? "Calculate Love %" : "Calculate",
            loading: "Calculating…",
            result: "Result",
            boy: "Partner A (Boy)",
            girl: "Partner B (Girl)",
            name1: "Your name *",
            name2: "Their name *",
            number: pick(form.valueLabel),
            value: pick(form.valueLabel),
            year: "Year",
            date2:
              meta.slug === "love-compatibility-num"
                ? "Second date of birth"
                : "Second date",
            error: "Something went wrong. Please try again.",
            yourName: "Your name",
            theirName: "Their name",
            hint: form.hint ? pick(form.hint) : "",
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, meta.slug, form]
  );

  useEffect(() => {
    if (meta.input === "place-date" && !date) {
      setDate(new Date().toISOString().slice(0, 10));
    }
    if (meta.input === "place-date" && !place) {
      setPlace("New Delhi, India");
      setCity({
        name: "New Delhi",
        state: "Delhi",
        lat: 28.6139,
        lon: 77.209,
        timezoneOffsetMinutes: 330,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.slug]);

  useEffect(() => {
    if (meta.input === "none") void runCalc({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.slug]);

  async function runCalc(payload: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/calculate/${meta.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || labels.error);
        return;
      }
      setResult(data.result);
    } catch {
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};

    switch (meta.input) {
      case "birth":
      case "birth-optional-time":
        payload.name = form.askName && name.trim() ? name : "Native";
        payload.date = date;
        payload.time = time || "12:00";
        payload.place = place;
        if (city) {
          payload.lat = city.lat;
          payload.lon = city.lon;
          payload.timezoneOffsetMinutes = city.timezoneOffsetMinutes ?? 330;
        }
        if (meta.slug === "moon-phase" && date2) payload.date2 = date2;
        break;
      case "place-date":
        payload.date = date;
        payload.place = place || "New Delhi, India";
        if (city) {
          payload.lat = city.lat;
          payload.lon = city.lon;
          payload.timezoneOffsetMinutes = city.timezoneOffsetMinutes ?? 330;
          payload.timeZone = timeZoneForPlace({
            lat: city.lat,
            lon: city.lon,
            offsetMinutes: city.timezoneOffsetMinutes ?? 330,
          });
        } else {
          payload.lat = 28.6139;
          payload.lon = 77.209;
          payload.timezoneOffsetMinutes = 330;
          payload.timeZone = "Asia/Kolkata";
        }
        break;
      case "dual-birth":
        payload.boyName = boy.name.trim() || "Partner A";
        payload.boyDate = boy.date;
        payload.boyTime = boy.time;
        payload.boyPlace = boy.place;
        if (boyCity) {
          payload.boyLat = boyCity.lat;
          payload.boyLon = boyCity.lon;
          payload.boyTimezoneOffsetMinutes =
            boyCity.timezoneOffsetMinutes ?? 330;
        }
        payload.girlName = girl.name.trim() || "Partner B";
        payload.girlDate = girl.date;
        payload.girlTime = girl.time;
        payload.girlPlace = girl.place;
        if (girlCity) {
          payload.girlLat = girlCity.lat;
          payload.girlLon = girlCity.lon;
          payload.girlTimezoneOffsetMinutes =
            girlCity.timezoneOffsetMinutes ?? 330;
        }
        break;
      case "names":
        if (meta.slug === "love-calculator") {
          payload.name1 = name1;
          payload.name2 = name2;
        } else {
          payload.name = name1 || name;
        }
        break;
      case "number":
        payload.number = Number(number);
        break;
      case "value":
        payload.value = value;
        break;
      case "date":
        payload.date = date;
        payload.time = "12:00";
        payload.place = "India";
        payload.lat = 28.61;
        payload.lon = 77.21;
        break;
      case "date-year":
        payload.date = date;
        payload.year = Number(year);
        break;
      case "name-date":
        payload.name = name;
        payload.date = date;
        break;
      case "dual-date":
        payload.date1 = date;
        payload.date2 = date2;
        break;
      case "none":
        break;
    }

    await runCalc(payload);
  }

  function resetLove() {
    setResult(null);
    setName1("");
    setName2("");
  }

  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-black/5 bg-gradient-to-r from-[#fffaf6] to-[#fff3ea] px-5 py-4">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
          <span>{meta.icon}</span>
          {toolTitle}
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        {meta.input !== "none" && !result && (
          <form onSubmit={onSubmit} className="space-y-4">
            {labels.hint ? (
              <p className="rounded-xl bg-[#fff7f0] px-3 py-2.5 text-[13px] leading-relaxed text-ink-muted">
                {labels.hint}
              </p>
            ) : null}

            {(meta.input === "birth" || meta.input === "birth-optional-time") && (
              <>
                {form.askName ? (
                  <Field label={labels.name}>
                    <input
                      required={form.nameRequired}
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                ) : null}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={labels.date}>
                    <input required type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
                  </Field>
                  <Field label={labels.time}>
                    <input
                      required={meta.input === "birth"}
                      type="time"
                      className={inputClass}
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </Field>
                </div>
                <PlaceField label={labels.place} value={place} onChange={setPlace} onCity={setCity} />
                {meta.slug === "moon-phase" && (
                  <Field label={labels.date2}>
                    <input type="date" className={inputClass} value={date2} onChange={(e) => setDate2(e.target.value)} />
                  </Field>
                )}
              </>
            )}

            {meta.input === "place-date" && (
              <>
                <Field label={labels.date}>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <PlaceField
                  label={labels.place}
                  value={place}
                  onChange={setPlace}
                  onCity={setCity}
                />
              </>
            )}

            {meta.input === "dual-birth" && (
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-maroon mb-3">{labels.boy}</p>
                  <div className="space-y-3">
                    {form.askName ? (
                      <Field label={labels.name}>
                        <input
                          required={form.nameRequired}
                          className={inputClass}
                          value={boy.name}
                          onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                        />
                      </Field>
                    ) : null}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label={labels.date}>
                        <input required type="date" className={inputClass} value={boy.date} onChange={(e) => setBoy({ ...boy, date: e.target.value })} />
                      </Field>
                      <Field label={labels.time}>
                        <input type="time" className={inputClass} value={boy.time} onChange={(e) => setBoy({ ...boy, time: e.target.value })} />
                      </Field>
                    </div>
                    <PlaceField label={labels.place} value={boy.place} onChange={(v) => setBoy({ ...boy, place: v })} onCity={setBoyCity} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-maroon mb-3">{labels.girl}</p>
                  <div className="space-y-3">
                    {form.askName ? (
                      <Field label={labels.name}>
                        <input
                          required={form.nameRequired}
                          className={inputClass}
                          value={girl.name}
                          onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                        />
                      </Field>
                    ) : null}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label={labels.date}>
                        <input required type="date" className={inputClass} value={girl.date} onChange={(e) => setGirl({ ...girl, date: e.target.value })} />
                      </Field>
                      <Field label={labels.time}>
                        <input type="time" className={inputClass} value={girl.time} onChange={(e) => setGirl({ ...girl, time: e.target.value })} />
                      </Field>
                    </div>
                    <PlaceField label={labels.place} value={girl.place} onChange={(v) => setGirl({ ...girl, place: v })} onCity={setGirlCity} />
                  </div>
                </div>
              </div>
            )}

            {meta.input === "names" && (
              <>
                {meta.slug === "love-calculator" ? (
                  <>
                    <Field label={labels.name1}>
                      <input required className={inputClass} value={name1} onChange={(e) => setName1(e.target.value)} />
                    </Field>
                    <Field label={labels.name2}>
                      <input required className={inputClass} value={name2} onChange={(e) => setName2(e.target.value)} />
                    </Field>
                  </>
                ) : (
                  <Field
                    label={
                      meta.slug === "business-name"
                        ? pick(form.valueLabel)
                        : locale === "hi"
                          ? "नाम *"
                          : "Name *"
                    }
                  >
                    <input required className={inputClass} value={name1} onChange={(e) => setName1(e.target.value)} />
                  </Field>
                )}
              </>
            )}

            {meta.input === "number" && (
              <Field label={labels.number}>
                <input required type="number" min={1} max={249} className={inputClass} value={number} onChange={(e) => setNumber(e.target.value)} />
              </Field>
            )}
            {meta.input === "value" && (
              <Field label={labels.value}>
                <input required className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
              </Field>
            )}
            {meta.input === "date" && (
              <Field label={labels.date}>
                <input required type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            )}
            {meta.input === "date-year" && (
              <>
                <Field label={labels.date}>
                  <input required type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label={labels.year}>
                  <input required type="number" className={inputClass} value={year} onChange={(e) => setYear(e.target.value)} />
                </Field>
              </>
            )}
            {meta.input === "name-date" && (
              <>
                <Field label={labels.name}>
                  <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label={labels.date}>
                  <input required type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
              </>
            )}
            {meta.input === "dual-date" && (
              <>
                <Field label={labels.date}>
                  <input required type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label={labels.date2}>
                  <input required type="date" className={inputClass} value={date2} onChange={(e) => setDate2(e.target.value)} />
                </Field>
              </>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? labels.loading : labels.submit}
            </Button>
            {error && <p className="text-sm text-red-700">{error}</p>}
          </form>
        )}

        {meta.input === "none" && loading && (
          <p className="text-ink-muted">{labels.loading}</p>
        )}
        {meta.input === "none" && error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        {result != null && (
          <div>
            {meta.slug !== "love-calculator" &&
              meta.slug !== "lo-shu-grid" &&
              meta.slug !== "kundli-matching" &&
              !explainCalculatorResult(
                meta.slug,
                (result as Record<string, unknown>) || {}
              ) && (
              <p className="text-sm font-semibold text-ink-muted mb-4 uppercase tracking-wide">
                {labels.result}
              </p>
            )}
            <ResultBlock
              data={result}
              locale={locale}
              slug={meta.slug}
              onReset={
                meta.slug === "love-calculator"
                  ? resetLove
                  : () => setResult(null)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
