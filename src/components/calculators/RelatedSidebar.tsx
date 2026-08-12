"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sidebarGroups } from "@/lib/navigation/menus";

export function RelatedSidebar({ excludeSlug }: { excludeSlug?: string }) {
  const locale = useLocale();
  const groups = sidebarGroups(excludeSlug);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <div
            key={locale === "hi" ? g.heading.hi : g.heading.en}
            className="rounded-2xl border border-white/10 bg-surface p-4 shadow-sm"
          >
            <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase mb-3">
              {locale === "hi" ? g.heading.hi : g.heading.en}
            </p>
            <ul className="space-y-1">
              {g.items.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/calculators/${c.slug}`}
                    className={`flex gap-2.5 rounded-xl px-2 py-2 transition hover:bg-sand/50 ${
                      c.slug === excludeSlug ? "bg-sand/40" : ""
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">{c.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-ink leading-snug">
                        {locale === "hi" ? c.title.hi : c.title.en}
                      </span>
                      <span className="block text-[11px] text-ink-muted leading-snug line-clamp-2">
                        {locale === "hi" ? c.description.hi : c.description.en}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </aside>
  );
}
