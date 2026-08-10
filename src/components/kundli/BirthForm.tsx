"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { City } from "@/lib/astrology/cities";
import { formatPlaceLabel } from "@/lib/astrology/cities";
import type { KundliResult } from "@/lib/astrology/types";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";

const schema = z.object({
  name: z.string().min(2),
  gender: z.enum(["male", "female", "other"]).optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  place: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function BirthForm() {
  const t = useTranslations("kundliForm");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male", place: "" },
  });

  const placeValue = watch("place");

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        ...values,
        place: selectedCity ? formatPlaceLabel(selectedCity) : values.place,
        timezoneOffsetMinutes: selectedCity?.timezoneOffsetMinutes ?? 330,
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
      sessionStorage.setItem("astrologics_kundli", JSON.stringify(kundli));
      router.push("/kundli/result");
    } catch {
      setError(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard strong className="mx-auto w-full max-w-xl shine-border">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label={t("name")} error={errors.name}>
          <input
            {...register("name")}
            className="field"
            placeholder={locale === "hi" ? "आपका नाम" : "Your name"}
            spellCheck={false}
          />
        </Field>

        <Field label={t("gender")}>
          <select {...register("gender")} className="field">
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
            <option value="other">{t("other")}</option>
          </select>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("date")} error={errors.date}>
            <input type="date" {...register("date")} className="field" />
          </Field>
          <Field label={t("time")} error={errors.time}>
            <input type="time" {...register("time")} className="field" />
          </Field>
        </div>

        <PlaceAutocomplete
          label={t("place")}
          value={placeValue || ""}
          onChange={(v) => {
            setValue("place", v, { shouldValidate: true });
            setSelectedCity(null);
          }}
          onCity={setSelectedCity}
          placeholder={t("placeHint")}
          error={!!errors.place}
        />
        {errors.place ? (
          <span className="-mt-3 block text-xs text-maroon-soft">Required</span>
        ) : null}

        {error && (
          <p className="rounded-xl border border-saffron/20 bg-sand/60 px-3.5 py-2.5 text-sm text-saffron-deep">
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

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: { message?: string };
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-maroon-soft">Required</span>
      )}
    </label>
  );
}
