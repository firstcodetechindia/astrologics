"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { locale: "en" as const, label: "English", native: "English" },
  { locale: "hi" as const, label: "Hindi", native: "हिंदी" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  function selectLocale(next: "en" | "hi") {
    if (next === locale) {
      setOpen(false);
      return;
    }
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={locale === "hi" ? "भाषा चुनें" : "Choose language"}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-saffron/30 bg-[#fff1e6] text-saffron-deep transition hover:border-saffron/50 hover:bg-[#ffe8d4]",
          open && "border-saffron/55 bg-[#ffe8d4] ring-2 ring-saffron/20"
        )}
      >
        <span
          className="select-none text-[13px] font-bold leading-none tracking-tight text-saffron-deep"
          aria-hidden
        >
          <span style={{ fontFamily: "var(--font-hindi), sans-serif" }}>अ</span>
          <span className="ml-0.5">A</span>
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={locale === "hi" ? "भाषा" : "Language"}
          className="absolute right-0 top-full z-[80] mt-1.5 min-w-[10.5rem] overflow-hidden rounded-xl border border-black/[0.08] bg-white py-1 shadow-[0_16px_40px_-18px_rgba(42,33,24,0.45)]"
        >
          {OPTIONS.map((opt) => {
            const active = locale === opt.locale;
            return (
              <button
                key={opt.locale}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => selectLocale(opt.locale)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition",
                  active
                    ? "bg-gradient-to-r from-saffron/12 to-maroon/8 font-semibold text-saffron-deep"
                    : "font-medium text-ink hover:bg-[#fff1e6]"
                )}
              >
                <span>
                  <span className="block leading-tight">{opt.native}</span>
                  <span className="block text-[11px] font-normal text-[#8a7a6a]">
                    {opt.label}
                  </span>
                </span>
                {active ? (
                  <Check className="h-4 w-4 shrink-0 text-saffron-deep" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function isValidLocale(locale: string): locale is "en" | "hi" {
  return routing.locales.includes(locale as "en" | "hi");
}
