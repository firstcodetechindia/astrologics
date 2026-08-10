"use client";

import { useEffect, useId, useState } from "react";
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
  error?: boolean;
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
  id: idProp,
}: PlaceAutocompleteProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [open, setOpen] = useState(false);

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

    setSuggestions(
      dedupeClient(
        searchCities(q, 5).map((c) => ({ ...c, country: c.country || "India" }))
      )
    );

    let cancelled = false;
    const timer = setTimeout(async () => {
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

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, selected]);

  return (
    <div className={cn("relative", className)}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "field w-full",
          error && "border-maroon-soft",
          inputClassName
        )}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
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
      {open && !selected && suggestions.length > 0 ? (
        <ul
          className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-saffron/25 bg-white shadow-lg"
          role="listbox"
        >
          {suggestions.map((c) => {
            const labelText = formatPlaceLabel(c);
            return (
              <li key={`${labelText}-${c.lat}-${c.lon}`}>
                <button
                  type="button"
                  role="option"
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
