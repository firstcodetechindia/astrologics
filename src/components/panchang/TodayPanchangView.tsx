"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Moon,
  MoonStar,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPlaceLabel, type City } from "@/lib/astrology/cities";
import {
  computeTodayPanchang,
  type TodayPanchangResult,
} from "@/lib/astrology/today-panchang";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { KundliChart } from "@/components/kundli/KundliChart";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Loc = { en: string; hi: string };

function tx(locale: string, v: Loc) {
  return locale === "hi" ? v.hi : v.en;
}

function ymdLocal(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day}`;
}

function shiftYmd(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 6, 30, 0));
  dt.setUTCDate(dt.getUTCDate() + days);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

const DEFAULT_CITY: City = {
  name: "New Delhi",
  state: "Delhi",
  country: "India",
  lat: 28.6139,
  lon: 77.209,
  timezoneOffsetMinutes: 330,
};

function Panel({
  children,
  className,
  accent = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "gold" | "red" | "none";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_10px_30px_-16px_rgba(42,33,24,0.28)]",
        className
      )}
    >
      {accent !== "none" ? (
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-[3px]",
            accent === "red"
              ? "bg-gradient-to-r from-rose-500 to-orange-400"
              : "bg-gradient-to-r from-amber-400 to-saffron"
          )}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

function TimingCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sunrise;
  label: string;
  value: string;
}) {
  return (
    <Panel accent="none" className="px-3 py-4 text-center sm:px-4">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cosmic-purple/15 text-saffron-deep">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-2 text-[12px] font-semibold text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[17px] font-bold tabular-nums tracking-tight text-ink sm:text-[18px]">
        {value}
      </p>
    </Panel>
  );
}

function LimbRow({
  label,
  value,
  until,
}: {
  label: string;
  value: string;
  until?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-0">
      <p className="text-[14px] font-medium text-ink-muted">{label}</p>
      <p className="max-w-[62%] text-right text-[14px] font-semibold text-ink">
        {value}
        {until && until !== "—" ? (
          <span className="font-medium text-ink-muted"> upto {until}</span>
        ) : null}
      </p>
    </div>
  );
}

export function TodayPanchangView() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [date, setDate] = useState(ymdLocal);
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [placeText, setPlaceText] = useState(formatPlaceLabel(DEFAULT_CITY));
  const [draftDate, setDraftDate] = useState(ymdLocal);

  const data: TodayPanchangResult = useMemo(
    () =>
      computeTodayPanchang({
        date,
        lat: city.lat,
        lon: city.lon,
        place: formatPlaceLabel(city),
        timeZone: timeZoneForPlace({
          lat: city.lat,
          lon: city.lon,
          offsetMinutes: city.timezoneOffsetMinutes ?? 330,
        }),
        timezoneOffsetMinutes: city.timezoneOffsetMinutes ?? 330,
      }),
    [date, city]
  );

  function apply() {
    setDate(draftDate);
  }

  function goDay(delta: number) {
    const n = shiftYmd(date, delta);
    setDate(n);
    setDraftDate(n);
  }

  const related = [
    { href: "/calculators/choghadiya", label: hi ? "चौघड़िया" : "Choghadiya" },
    { href: "/calculators/rahu-kaal", label: hi ? "राहु काल" : "Rahu Kaal" },
    { href: "/calculators/hora", label: hi ? "होरा" : "Hora" },
    { href: "/horoscope", label: hi ? "राशिफल" : "Horoscope" },
    { href: "/kundli", label: hi ? "कुंडली" : "Free Kundli" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Date + place controls */}
      <Panel accent="none" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[10rem] flex-1 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
              <CalendarDays className="h-3.5 w-3.5" />
              {hi ? "तिथि" : "Date"}
            </span>
            <input
              type="date"
              value={draftDate}
              onChange={(e) => setDraftDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-cosmic-navy px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-saffron/50 focus:ring-2 focus:ring-saffron/20"
            />
          </label>
          <div className="min-w-[14rem] flex-[2] space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
              <MapPin className="h-3.5 w-3.5" />
              {hi ? "स्थान" : "Location"}
            </span>
            <PlaceAutocomplete
              value={placeText}
              onChange={setPlaceText}
              onCity={(c) => {
                if (c) {
                  setCity(c);
                  setPlaceText(formatPlaceLabel(c));
                }
              }}
              placeholder={
                hi ? "शहर खोजें (जैसे नई दिल्ली)" : "Search city (e.g. New Delhi)"
              }
            />
          </div>
          <Button type="button" onClick={apply} className="!px-5 !py-2.5">
            {hi ? "पंचांग देखें" : "Get Panchang"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous day"
              className="rounded-lg border border-white/10 bg-surface p-1.5 hover:bg-cosmic-purple/15"
              onClick={() => goDay(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-lg border border-saffron/25 bg-cosmic-purple/15 px-3 py-1.5 text-[12px] font-semibold text-saffron-deep"
              onClick={() => {
                const t = ymdLocal();
                setDate(t);
                setDraftDate(t);
              }}
            >
              {hi ? "आज" : "Today"}
            </button>
            <button
              type="button"
              aria-label="Next day"
              className="rounded-lg border border-white/10 bg-surface p-1.5 hover:bg-cosmic-purple/15"
              onClick={() => goDay(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[13px] text-ink-muted">
            <span className="font-semibold text-ink">{placeText}</span>
            <span className="mx-1.5 text-black/20">·</span>
            {tx(locale, data.longDate)}
          </p>
        </div>
      </Panel>

      {/* Astrotalk-style core block */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <TimingCard
            icon={Sunrise}
            label={hi ? "सूर्योदय" : "Sunrise"}
            value={data.timings.sunrise.toLowerCase()}
          />
          <TimingCard
            icon={Sunset}
            label={hi ? "सूर्यास्त" : "Sunset"}
            value={data.timings.sunset.toLowerCase()}
          />
          <TimingCard
            icon={Moon}
            label={hi ? "चंद्रोदय" : "Moonrise"}
            value={data.timings.moonrise.toLowerCase()}
          />
          <TimingCard
            icon={MoonStar}
            label={hi ? "चंद्रास्त" : "Moonset"}
            value={data.timings.moonset.toLowerCase()}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel className="px-4 pt-5 sm:px-5">
            <LimbRow
              label={hi ? "तिथि" : "Tithi"}
              value={tx(locale, data.limbs.tithi.name)}
              until={data.limbs.tithi.until}
            />
            <LimbRow
              label={hi ? "नक्षत्र" : "Nakshatra"}
              value={tx(locale, data.limbs.nakshatra.name)}
              until={data.limbs.nakshatra.until}
            />
            <LimbRow
              label={hi ? "योग" : "Yoga"}
              value={tx(locale, data.limbs.yoga)}
            />
            <LimbRow
              label={hi ? "करण" : "Karana"}
              value={tx(locale, data.limbs.karana)}
            />
            <LimbRow
              label={hi ? "पक्ष" : "Paksha"}
              value={tx(locale, data.limbs.paksha)}
            />
            <LimbRow
              label={hi ? "वार" : "Weekday"}
              value={tx(locale, data.limbs.weekday)}
            />
          </Panel>

          <Panel className="px-4 pt-5 sm:px-5">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3">
              <p className="text-[14px] font-medium text-ink-muted">
                Shaka Samvat
              </p>
              <p className="text-right text-[14px] font-semibold text-ink">
                {tx(locale, data.samvat.shaka.label)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <p className="text-[14px] font-medium text-ink-muted">
                Vikram Samvat
              </p>
              <p className="text-right text-[14px] font-semibold text-ink">
                {tx(locale, data.samvat.vikram.label)}
              </p>
            </div>
            <div className="mt-2 rounded-xl bg-cosmic-navy px-3 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                {hi ? "अभिजित मुहूर्त" : "Abhijit muhurat"}
              </p>
              <p className="mt-1 text-[16px] font-semibold tabular-nums text-ink">
                {data.abhijit.start} – {data.abhijit.end}
              </p>
            </div>
          </Panel>
        </div>

        <Panel accent="red" className="p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink">
            {hi
              ? "अशुभ समय (अशुभ मुहूर्त)"
              : "Inauspicious Timings (Ashubha Muhurat)"}
          </h2>
          <div className="mt-3 space-y-0">
            {data.ashubha.map((w) => (
              <div
                key={w.id}
                className="flex flex-col gap-0.5 border-b border-white/10 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <p className="text-[14px] font-semibold text-ink">
                  {tx(locale, w.name)}
                </p>
                <p className="text-[13px] text-ink-muted sm:text-right">
                  <span className="font-medium text-ink-muted">
                    {hi ? "से" : "From"}
                  </span>{" "}
                  <span className="font-semibold tabular-nums text-ink">
                    {w.from}
                  </span>{" "}
                  <span className="font-medium text-ink-muted">
                    {hi ? "तक" : "To"}
                  </span>{" "}
                  <span className="font-semibold tabular-nums text-ink">
                    {w.to}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Chandra / Tara balam */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-4 sm:p-5">
          <p className="text-[15px] font-bold text-ink">Tarabalam</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
            {data.tarabalam.map((n) => tx(locale, n)).join(", ")}
          </p>
        </Panel>
        <Panel className="p-4 sm:p-5">
          <p className="text-[15px] font-bold text-ink">Chandrabalam</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
            {data.chandrabalam.map((n) => tx(locale, n)).join(", ")}
          </p>
        </Panel>
      </div>

      {/* Planetary positions + chart */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel className="overflow-x-auto p-4 sm:p-5">
          <p className="text-[15px] font-bold text-ink">
            {hi ? "ग्रह स्थिति" : "Planetary Positions"}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            {hi
              ? `${tx(locale, data.chartAt.label)} · लाहिरी अयनांश ${data.ayanamsa}°`
              : `${tx(locale, data.chartAt.label)} · Lahiri ayanamsa ${data.ayanamsa}°`}
          </p>
          <table className="mt-3 w-full min-w-[32rem] text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-2 font-bold">{hi ? "ग्रह" : "Planet"}</th>
                <th className="py-2 pr-2 font-bold">{hi ? "राशि" : "Rashi"}</th>
                <th className="py-2 pr-2 font-bold">
                  {hi ? "देशांतर" : "Longitude"}
                </th>
                <th className="py-2 pr-2 font-bold">
                  {hi ? "नक्षत्र" : "Nakshatra"}
                </th>
                <th className="py-2 font-bold">Pada</th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((p) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="py-2 pr-2 font-semibold text-ink">
                    {tx(locale, p.name)}
                  </td>
                  <td className="py-2 pr-2">{tx(locale, p.sign)}</td>
                  <td className="py-2 pr-2 font-numeric tabular-nums">
                    {p.longitude}
                  </td>
                  <td className="py-2 pr-2">{tx(locale, p.nakshatra)}</td>
                  <td className="py-2 tabular-nums">{p.pada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="p-4 sm:p-5">
          <p className="text-[15px] font-bold text-ink">
            {hi ? "लग्न कुंडली" : "Lagna Chart"}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            {tx(locale, data.chartAt.label)}
          </p>
          <div className="mt-3">
            <KundliChart kundli={data.kundli} compact />
          </div>
        </Panel>
      </div>

      <Panel accent="none" className="p-4 sm:p-5">
        <p className="text-[15px] font-bold text-ink">
          {hi ? "संबंधित पंचांग पृष्ठ" : "Related Panchang Pages"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {related.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="rounded-full border border-saffron/20 bg-cosmic-navy px-3.5 py-1.5 text-[13px] font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </Panel>

      <Panel accent="none" className="space-y-4 p-5 sm:p-6">
        <h2 className="heading-3 font-display text-ink">
          {hi ? "पंचांग क्यों महत्वपूर्ण है?" : "What is the importance of Panchang?"}
        </h2>
        <p className="text-muted text-[14px] leading-relaxed">
          {hi
            ? "पंचांग संस्कृत के पंच (पाँच) और अंग (अंग) से बना है — तिथि, वार, नक्षत्र, योग और करण। इनसे दिन की ऊर्जा समझकर विवाह, व्यापार, नामकरण, यात्रा और व्रत जैसे निर्णय लिए जाते हैं।"
            : "Panchang comes from Sanskrit panch (five) and ang (limbs): Tithi, Vaar, Nakshatra, Yoga and Karana. Together they map each day’s quality for marriage, business, naming, travel and fasting."}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              {
                t: { en: "Marriage", hi: "विवाह" },
                b: {
                  en: "Tithi, Yoga, Vaar and Nakshatra help pick an auspicious muhurat so the couple begins aligned with supportive cosmic timing.",
                  hi: "तिथि, योग, वार और नक्षत्र से शुभ मुहूर्त चुनकर दंपति की शुरुआत अनुकूल समय से होती है।",
                },
              },
              {
                t: { en: "Business", hi: "व्यवसाय" },
                b: {
                  en: "Opening an office, signing papers or starting a venture in a favourable window is classically preferred for smoother momentum.",
                  hi: "कार्यालय उद्घाटन, अनुबंध या नया उद्यम शुभ खंड में शुरू करना परंपरा से अनुकूल माना जाता है।",
                },
              },
              {
                t: { en: "Naming ceremony", hi: "नामकरण" },
                b: {
                  en: "Moon nakshatra and pada guide auspicious starting letters, while full panchang picks the day and hour.",
                  hi: "चंद्र नक्षत्र व पद शुभ अक्षर सुझाते हैं; पूरा पंचांग दिन और समय चुनने में मदद करता है।",
                },
              },
              {
                t: { en: "Travel & fasting", hi: "यात्रा व व्रत" },
                b: {
                  en: "Avoid ashubha windows for departures; match fasts like Ekadashi to the correct tithi for fuller spiritual benefit.",
                  hi: "प्रस्थान में अशुभ खंड से बचें; एकादशी जैसे व्रत सही तिथि पर रखने से लाभ अधिक माना जाता है।",
                },
              },
            ] as { t: Loc; b: Loc }[]
          ).map((item) => (
            <div key={item.t.en}>
              <h3 className="text-[15px] font-semibold text-ink">
                {tx(locale, item.t)}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                {tx(locale, item.b)}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
