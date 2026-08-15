"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import type { City } from "@/lib/astrology/cities";
import { formatPlaceLabel } from "@/lib/astrology/cities";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import type { KundliResult } from "@/lib/astrology/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";

const schema = z.object({
  name: z.string().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
  place: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

/** Accurate CosmicTalks defaults — not shown in the form UI. */
const KUNDLI_DEFAULTS = {
  ayanamsa: "lahiri" as const,
  houseSystem: "whole_sign" as const,
  nodeMode: "mean" as const,
};

export function BirthForm() {
  const t = useTranslations("kundliForm");
  const tc = useTranslations("common");
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [rectifyNote, setRectifyNote] = useState(false);
  const [timeApproximate, setTimeApproximate] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { place: "" },
  });

  const placeValue = watch("place");

  useEffect(() => {
    const from = searchParams.get("from");
    const qName = searchParams.get("name");
    const qDate = searchParams.get("date");
    const qTime = searchParams.get("time");
    const qPlace = searchParams.get("place");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const tzOff = searchParams.get("tzOff");
    if (qName) setValue("name", qName);
    if (qDate) setValue("date", qDate);
    if (qTime) setValue("time", qTime);
    if (qPlace) setValue("place", qPlace);
    if (lat && lon) {
      setSelectedCity({
        name: qPlace?.split(",")[0]?.trim() || "Place",
        state: "",
        lat: Number(lat),
        lon: Number(lon),
        timezoneOffsetMinutes: tzOff ? Number(tzOff) : 330,
      });
    }
    if (from === "rectify" && qTime) setRectifyNote(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: values.name,
        date: values.date,
        time: values.time,
        place: selectedCity ? formatPlaceLabel(selectedCity) : values.place,
        timezoneOffsetMinutes: selectedCity?.timezoneOffsetMinutes ?? 330,
        timeZone: timeZoneForPlace({
          lat: selectedCity?.lat,
          lon: selectedCity?.lon,
          offsetMinutes: selectedCity?.timezoneOffsetMinutes ?? 330,
        }),
        ...KUNDLI_DEFAULTS,
        birthTimeApproximate: timeApproximate,
      };
      if (selectedCity) {
        payload.lat = selectedCity.lat;
        payload.lon = selectedCity.lon;
      }

      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || tc("error"));
        return;
      }
      const kundli = data.kundli as KundliResult;
      sessionStorage.setItem("cosmicgpt_kundli", JSON.stringify(kundli));
      router.push("/kundli/result");
    } catch {
      setError(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard strong className="w-full shine-border">
      <form
        onSubmit={handleSubmit(onSubmit, () => setShakeKey((k) => k + 1))}
        className="space-y-5"
        noValidate
      >
        {rectifyNote ? (
          <p className="rounded-xl border border-saffron/25 bg-saffron/10 px-3 py-2.5 text-sm text-ink-muted leading-relaxed">
            {hi
              ? "समय जन्म-समय सुधार उपकरण से भरा गया है — कुंडली बनाने से पहले पुष्टि करें। अनुमानित संरेखण प्रमाण नहीं है।"
              : "Time pre-filled from the birth-time rectification tool — confirm before generating. Heuristic alignment is not proof."}{" "}
            <Link
              href="/calculators/birth-time-rectification"
              className="text-saffron-deep underline"
            >
              {hi ? "उपकरण पर वापस" : "Back to tool"}
            </Link>
          </p>
        ) : (
          <p className="text-xs text-ink-muted">
            {hi ? "सटीक समय नहीं?" : "Unsure of exact time?"}{" "}
            <Link
              href="/calculators/birth-time-rectification"
              className="text-saffron-deep underline"
            >
              {hi ? "जन्म समय सुधार आज़माएँ" : "Try birth-time rectification"}
            </Link>
          </p>
        )}

        <FormField
          label={t("name")}
          required
          error={errors.name ? (locale === "hi" ? "आवश्यक" : "Required") : false}
          shakeKey={shakeKey}
        >
          <input
            {...register("name")}
            className="field"
            placeholder={locale === "hi" ? "आपका नाम" : "Your name"}
            spellCheck={false}
            autoComplete="name"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 min-w-0 sm:grid-cols-2">
          <FormField
            label={t("date")}
            required
            error={errors.date ? (locale === "hi" ? "आवश्यक" : "Required") : false}
            shakeKey={shakeKey}
          >
            <input type="date" {...register("date")} className="field min-w-0" />
          </FormField>
          <FormField
            label={t("time")}
            required
            error={errors.time ? (locale === "hi" ? "आवश्यक" : "Required") : false}
            shakeKey={shakeKey}
          >
            <input type="time" {...register("time")} className="field min-w-0" />
          </FormField>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-ink-muted cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[var(--saffron,#c45c26)]"
            checked={timeApproximate}
            onChange={(e) => setTimeApproximate(e.target.checked)}
          />
          <span className="leading-snug">
            {hi
              ? "जन्म समय अनुमानित है (सटीक मिनट पता नहीं)। लग्न/भाव-आधारित परिणाम कम विश्वसनीय होंगे।"
              : "Birth time is approximate (exact minute unknown). Lagna and house-based results will be marked less reliable."}
          </span>
        </label>

        <PlaceAutocomplete
          id="birth-place"
          label={t("place")}
          required
          value={placeValue || ""}
          onChange={(v) => {
            setValue("place", v, { shouldValidate: true });
            setSelectedCity(null);
          }}
          onCity={setSelectedCity}
          placeholder={t("placeHint")}
          error={
            errors.place
              ? locale === "hi"
                ? "आवश्यक"
                : "Required"
              : false
          }
          shakeKey={shakeKey}
        />

        {error && (
          <p
            className="rounded-xl border border-cosmic-pink/30 bg-cosmic-pink/10 px-3.5 py-2.5 text-sm text-cosmic-pink"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full !py-3.5">
          {loading ? tc("loading") : t("submit")}
        </Button>
        <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
          {t("note")}
        </p>
      </form>
    </GlassCard>
  );
}
