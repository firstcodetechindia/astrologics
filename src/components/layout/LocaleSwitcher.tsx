"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const other = locale === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded-lg border border-gold/40 bg-ivory/60 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-gold-soft/50 transition"
      aria-label="Switch language"
    >
      {locale === "en" ? "हिंदी" : "English"}
    </button>
  );
}

export function isValidLocale(locale: string): locale is "en" | "hi" {
  return routing.locales.includes(locale as "en" | "hi");
}
