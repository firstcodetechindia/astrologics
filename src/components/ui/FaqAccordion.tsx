"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({
  items,
  className = "",
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="rounded-2xl border border-white/10 bg-surface shadow-sm overflow-hidden h-fit"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-semibold text-ink text-[15px] leading-snug">
                {f.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-saffron-deep transition-transform duration-200 mt-0.5 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 -mt-1">
                <p className="text-sm text-ink-muted leading-relaxed border-t border-white/10 pt-3">
                  {f.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
