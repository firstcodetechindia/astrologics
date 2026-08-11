"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { AstrologerOptionSection } from "@/lib/auth/astrologer-auth";
import { cn } from "@/lib/utils";

export function MultiSectionSelect({
  label,
  required,
  placeholder,
  sections,
  values,
  onChange,
  hi,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  sections: readonly AstrologerOptionSection[];
  values: string[];
  onChange: (next: string[]) => void;
  hi: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const labels = new Map<string, string>();
  for (const section of sections) {
    for (const opt of section.options) {
      labels.set(opt.id, hi ? opt.hi : opt.en);
    }
  }

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(id: string) {
    onChange(
      values.includes(id) ? values.filter((x) => x !== id) : [...values, id]
    );
  }

  function remove(id: string) {
    onChange(values.filter((x) => x !== id));
  }

  return (
    <div ref={rootRef}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b5c4c]">
          {label}
          {required ? <span className="text-[#F06A00]"> *</span> : null}
        </span>
        {values.length > 0 ? (
          <span className="text-[11px] font-semibold text-[#F06A00]">
            {values.length} {hi ? "चयनित" : "selected"}
          </span>
        ) : null}
      </div>

      {/* Anchor panel strictly to the trigger — not to chips below */}
      <div className="relative mt-1.5">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm transition",
            open
              ? "border-[#F06A00]/55 ring-[3px] ring-[#F06A00]/12"
              : "border-[#e8ddd2] hover:border-[#F06A00]/35"
          )}
        >
          <span
            className={cn(
              "min-w-0 truncate",
              values.length ? "font-medium text-ink" : "text-[#9a8b7a]"
            )}
          >
            {values.length
              ? values
                  .map((id) => labels.get(id))
                  .filter(Boolean)
                  .join(", ")
              : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#8a7a6a] transition",
              open && "rotate-180 text-[#F06A00]"
            )}
          />
        </button>

        {open ? (
          <div
            id={listId}
            role="listbox"
            aria-multiselectable
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-60 overflow-y-auto overscroll-contain rounded-xl border border-[#e8ddd2] bg-white shadow-[0_16px_40px_-18px_rgba(42,33,24,0.45)]"
          >
            <div className="p-2 pb-3">
              {sections.map((section, idx) => (
                <div key={section.id} className={cn(idx > 0 && "mt-2")}>
                  <p className="sticky top-0 z-10 -mx-2 border-b border-[#f3ebe3] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a8b7a]">
                    {hi ? section.hi : section.en}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {section.options.map((opt) => {
                      const on = values.includes(opt.id);
                      return (
                        <li key={opt.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={on}
                            onClick={() => toggle(opt.id)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] transition",
                              on
                                ? "bg-[#fff1e6] font-semibold text-[#c45a00]"
                                : "text-ink hover:bg-[#faf6f1]"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                on
                                  ? "border-[#F06A00] bg-[#F06A00] text-white"
                                  : "border-[#d4c4b4] bg-white"
                              )}
                            >
                              {on ? (
                                <Check className="h-3 w-3" strokeWidth={3} />
                              ) : null}
                            </span>
                            {hi ? opt.hi : opt.en}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {values.length > 0 ? (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {values.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-md bg-[#fff1e6] px-1.5 py-0.5 text-[11px] font-semibold text-[#c45a00]"
            >
              {labels.get(id)}
              <button
                type="button"
                aria-label={hi ? "हटाएँ" : "Remove"}
                onClick={() => remove(id)}
                className="rounded p-0.5 hover:bg-[#F06A00]/15"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
