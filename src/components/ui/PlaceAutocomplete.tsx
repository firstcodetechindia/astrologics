"use client";

import { useEffect, useState } from "react";
import { searchCities, type City, formatPlaceLabel } from "@/lib/astrology/cities";
import { cn } from "@/lib/utils";

function dedupeClient(places: City[]): City[] {
  const map = new Map<string, City>();
  for (const p of places) {
    const key = [
      p.name.trim().toLowerCase(),
      (p.state || "").trim().toLowerCase(),
      (p.country || "").trim().toLowerCase(),
    ].join("|");
    if (!map.has(key)) map.set(key, p);
  }
  return Array.from(map.values());
}

type PlaceAutocompleteProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onCity: (city: City | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Truthy or message string for validation error + shake. */
  error?: boolean | string;
  required?: boolean;
  shakeKey?: number;
  id?: string;
};

/** Shared worldwide birth-place search (local India list + OpenStreetMap). */
export function PlaceAutocomplete({
  label,
  value,
  onChange,
  onCity,
  placeholder = "Place of birth",
  className,
  inputClassName,
  error,
  required,
  shakeKey = 0,
  id: idProp = "place-autocomplete",
}: PlaceAutocompleteProps) {
  // Stable string id (not useId) — avoids SSR/client hydration mismatches when
  // the surrounding tree's useId slots differ (e.g. framer-motion, HMR).
  const id = idProp;
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [open, setOpen] = useState(false);
  const hasError = Boolean(error);
  const message =
    typeof error === "string" && error.trim()
      ? error
      : hasError
        ? "Required"
        : null;

  useEffect(() => {
    if (selected) {
      setSuggestions([]);
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestions([]);

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/search?q=${encodeURIComponent(q)}&limit=10`
        );
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.places) && data.places.length) {
          const mapped = data.places.map(
            (p: {
              name: string;
              state?: string;
              country?: string;
              lat: number;
              lng: number;
              timezoneOffsetMinutes?: number;
            }) => ({
              name: p.name,
              state: p.state,
              country: p.country || "India",
              lat: p.lat,
              lon: p.lng,
              timezoneOffsetMinutes: p.timezoneOffsetMinutes ?? 330,
            })
          );
          setSuggestions(dedupeClient(mapped));
          setOpen(true);
          return;
        }
      } catch {
        /* fall through to legacy */
      }
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.places)) {
          setSuggestions(dedupeClient(data.places));
          setOpen(true);
        }
      } catch {
        /* keep local */
      }
    }, 280);

    // Instant local major-city hints while network search runs
    setSuggestions(
      dedupeClient(
        searchCities(q, 5).map((c) => ({ ...c, country: c.country || "India" }))
      )
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, selected]);

  return (
    <div className={cn("relative min-w-0", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 flex items-center gap-1 text-sm font-medium text-ink"
        >
          <span>{label}</span>
          {required ? (
            <>
              <span className="text-cosmic-pink" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>
          ) : null}
        </label>
      ) : null}
      <div
        key={hasError ? `shake-${shakeKey}` : "ok"}
        className={cn(hasError && "field-shake")}
      >
        <input
          id={id}
          className={cn(
            "field w-full",
            hasError && "border-cosmic-pink/70 ring-2 ring-cosmic-pink/25",
            inputClassName
          )}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          required={required}
          aria-invalid={hasError || undefined}
          onChange={(e) => {
            setSelected(null);
            onCity(null);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0 && !selected) setOpen(true);
          }}
          onBlur={() => {
            // allow click on option
            setTimeout(() => setOpen(false), 150);
          }}
        />
      </div>
      {message ? (
        <span
          className="mt-1.5 block text-xs font-medium text-cosmic-pink"
          role="alert"
        >
          {message}
        </span>
      ) : null}
      {open && !selected && suggestions.length > 0 ? (
        <ul
          className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-saffron/25 bg-surface shadow-lg"
          role="listbox"
        >
          {suggestions.map((c) => {
            const labelText = formatPlaceLabel(c);
            return (
              <li key={`${labelText}-${c.lat}-${c.lon}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="w-full border-b border-saffron/10 px-3.5 py-2.5 text-left text-[0.95rem] text-ink transition last:border-0 hover:bg-sand/70"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSelected(c);
                    onChange(labelText);
                    onCity(c);
                    setSuggestions([]);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{c.name}</span>
                  {(c.state || c.country) && (
                    <span className="text-ink-muted">
                      {`, ${[c.state, c.country].filter(Boolean).join(", ")}`}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
