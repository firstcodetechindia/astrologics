"use client";

import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  BADGE_LABEL,
  type DirectoryAstrologer,
} from "@/lib/astrologers/directory";
import { AstrologerKindLabel } from "@/components/talk/AiAstrologerLabel";

export function AstrologerCard({
  astrologer: a,
  locale,
  compact = false,
}: {
  astrologer: DirectoryAstrologer;
  locale: string;
  compact?: boolean;
}) {
  const hi = locale === "hi";
  const badge = a.badge ? BADGE_LABEL[a.badge] : null;
  const langs = a.languages.join(" · ");
  const skills = a.skills.slice(0, 3);

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-surface p-3.5 shadow-[0_10px_28px_-22px_rgba(42,33,24,0.45)] transition hover:-translate-y-0.5 hover:border-[#F06A00]/35 hover:shadow-[0_18px_36px_-22px_rgba(240,106,0,0.35)]",
        compact && "p-3"
      )}
    >
      {badge ? (
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ring-1",
            badge.className
          )}
        >
          {hi ? badge.hi : badge.en}
        </span>
      ) : null}

      <div className="flex items-start gap-3 pr-16">
        <div className="relative shrink-0">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/20">
            <Image
              src={a.image}
              alt={a.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <span
            className={cn(
              "absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full ring-2 ring-white",
              a.online ? "bg-[#22c55e]" : "bg-[#c4b5a5]"
            )}
            aria-hidden
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-ink">
              {a.name}
            </h3>
            {a.verified ? (
              <BadgeCheck
                className="h-4 w-4 shrink-0 fill-[#22c55e] text-white"
                aria-label={hi ? "सत्यापित" : "Verified"}
              />
            ) : null}
          </div>
          <div className="mt-1">
            <AstrologerKindLabel kind={a.kind} locale={locale} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-[11px] text-ink-muted">
            {a.experienceYears} {hi ? "वर्ष अनुभव" : "yrs exp"} ·{" "}
            {a.languages.slice(0, 2).join(", ")}
            {a.languages.length > 2 ? "…" : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s}
            className="max-w-full rounded-full border border-white/12 bg-cosmic-navy px-2 py-0.5 text-[10px] font-semibold text-ink-muted break-words"
          >
            {s}
          </span>
        ))}
      </div>

      {!compact ? (
        <div className="mt-3 space-y-1 text-[11.5px] text-ink-muted">
          <p className="truncate">{langs}</p>
          <p>
            {a.experienceYears} {hi ? "वर्ष अनुभव" : "yrs exp"}
          </p>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 pt-0.5">
            <p className="inline-flex min-w-0 max-w-full flex-wrap items-center gap-1 font-semibold text-ink">
              <Star className="h-3.5 w-3.5 fill-[#f5b301] text-[#f5b301]" />
              {a.rating.toFixed(1)}
              <span className="font-medium text-ink-muted">
                · {a.ordersLabel}
              </span>
            </p>
            <span
              className={cn(
                "text-[11px] font-bold",
                a.online ? "text-[#16a34a]" : "text-ink-muted"
              )}
            >
              {a.online
                ? hi
                  ? "ऑनलाइन"
                  : "Online"
                : hi
                  ? "व्यस्त"
                  : "Busy"}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-2.5 flex items-center justify-between gap-2 text-[11.5px]">
          <p className="inline-flex items-center gap-1 font-semibold text-ink">
            <Star className="h-3.5 w-3.5 fill-[#f5b301] text-[#f5b301]" />
            {a.rating.toFixed(1)}
            <span className="font-medium text-ink-muted">· {a.ordersLabel}</span>
          </p>
          <span
            className={cn(
              "text-[11px] font-bold",
              a.online ? "text-[#16a34a]" : "text-ink-muted"
            )}
          >
            {a.online ? (hi ? "ऑनलाइन" : "Online") : hi ? "व्यस्त" : "Busy"}
          </span>
        </div>
      )}

      <div className="mt-auto flex min-w-0 items-end justify-between gap-2 border-t border-white/10 pt-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-bold tracking-tight text-ink">
            ₹{a.pricePerMin}
            <span className="text-[12px] font-semibold text-ink-muted">
              /{hi ? "मिनट" : "min"}
            </span>
          </p>
          {a.firstChatFree ? (
            <Link
              href={`/chat-with-astrologer/${a.id}`}
              className="mt-0.5 inline-flex text-[12px] font-semibold text-[#F06A00] hover:underline"
            >
              {hi ? "पहली चैट मुफ़्त ›" : "First Chat Free ›"}
            </Link>
          ) : (
            <Link
              href={`/chat-with-astrologer/${a.id}`}
              className="mt-0.5 inline-flex text-[12px] font-semibold text-[#F06A00] hover:underline"
            >
              {hi ? "अभी चैट करें ›" : "Chat now ›"}
            </Link>
          )}
        </div>
        <Link
          href={`/chat-with-astrologer/${a.id}`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-[#F06A00] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_10px_20px_-12px_rgba(240,106,0,0.9)] transition hover:bg-[#e85d04]"
        >
          {hi ? "चैट" : "Chat"}
        </Link>
      </div>
    </article>
  );
}
