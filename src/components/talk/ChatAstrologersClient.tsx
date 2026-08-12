"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  CONSULT_CATEGORIES,
  filterAstrologers,
  type ConsultCategory,
} from "@/lib/astrologers/directory";
import { cn } from "@/lib/utils";
import { AstrologerCard } from "./AstrologerCard";

export function ChatAstrologersClient({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const [category, setCategory] = useState<"all" | ConsultCategory>("all");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () => filterAstrologers(category, query),
    [category, query]
  );

  return (
    <div>
      <div className="relative min-w-0 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            hi ? "नाम, कौशल या भाषा खोजें" : "Search name, skill or language"
          }
          className="w-full rounded-xl border border-white/12 bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#F06A00]/50 focus:ring-[3px] focus:ring-[#F06A00]/12"
        />
      </div>

      <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {CONSULT_CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition",
                active
                  ? "bg-[#F06A00] text-white shadow-[0_8px_18px_-10px_rgba(240,106,0,0.9)]"
                  : "border border-white/12 bg-surface text-ink hover:border-[#F06A00]/35"
              )}
            >
              {hi ? c.hi : c.en}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-surface/75 px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            {hi ? "कोई ज्योतिषी नहीं मिला" : "No astrologers found"}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {hi
              ? "फ़िल्टर या खोज बदलकर देखें।"
              : "Try another category or search term."}
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
            }}
            className="mt-4 text-sm font-semibold text-[#F06A00] hover:underline"
          >
            {hi ? "सभी दिखाएँ" : "Show all"}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((a) => (
            <AstrologerCard key={a.id} astrologer={a} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
