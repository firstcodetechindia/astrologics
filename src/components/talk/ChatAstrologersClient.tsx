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
      <div className="w-full">
        <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="uppercase tracking-[0.12em] text-red-600">
            {hi ? "लाइव नाउ" : "Live now"}
          </span>
        </p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.15rem]">
          {hi ? (
            <>
              भारत के <span className="text-[#F06A00]">टॉप रेटेड</span>{" "}
              ज्योतिषियों से बात करें
            </>
          ) : (
            <>
              Talk to India&apos;s{" "}
              <span className="text-[#F06A00]">Top Rated</span> Astrologers
            </>
          )}
        </h1>
        <p className="mt-3 w-full text-[13.5px] leading-relaxed text-ink-muted sm:text-[15px]">
          {hi
            ? "ऑनलाइन सर्वश्रेष्ठ ज्योतिषी से बात करें और अपने संबंधों, करियर, वित्त तथा जीवन के अन्य महत्वपूर्ण निर्णयों पर स्पष्ट मार्गदर्शन पाएँ। भरोसेमंद अंतर्दृष्टि, सटीक भविष्यवाणियाँ और पूर्ण गोपनीयता के साथ आप आत्मविश्वास से अगला कदम बढ़ाएँ। दो दशकों से अधिक की विशेषज्ञता और 500+ विशेषज्ञ ज्योतिषियों की 24/7 उपलब्धता के साथ, आपकी आगे की यात्रा में हमेशा सहायता और स्पष्टता मिलेगी।"
            : "Talk to the best astrologer online and get clear guidance on your relationships, career, finances, and other important life choices you’re about to make. You get trusted insights, accurate predictions with complete privacy, and take the next step in life with confidence. With over two decades of expertise and with 500+ experts astrologer available 24/7, you’ll always find support and clarity with us on your journey forward."}
        </p>
      </div>

      <div className="mt-6">
        <div className="relative min-w-0 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0a090]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              hi ? "नाम, कौशल या भाषा खोजें" : "Search name, skill or language"
            }
            className="w-full rounded-xl border border-[#e8ddd2] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#F06A00]/50 focus:ring-[3px] focus:ring-[#F06A00]/12"
          />
        </div>
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
                  : "border border-[#e8ddd2] bg-white text-ink hover:border-[#F06A00]/35"
              )}
            >
              {hi ? c.hi : c.en}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#e8ddd2] bg-white/70 px-6 py-12 text-center">
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
