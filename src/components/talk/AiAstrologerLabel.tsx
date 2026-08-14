"use client";

/**
 * Mandatory AI disclosure. Import this component whenever an AI_PERSONA
 * astrologer is shown — directory card, chat window, or generated copy.
 * Do not replace with a one-off span; omitting this on a new screen is a
 * trust violation. Use AstrologerKindLabel so kind cannot be skipped.
 */
export function AiAstrologerLabel({
  locale,
  size = "md",
}: {
  locale: string;
  size?: "sm" | "md";
}) {
  const hi = locale === "hi";
  return (
    <span
      role="status"
      className={
        size === "sm"
          ? "inline-flex items-center rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200 ring-1 ring-violet-400/40"
          : "inline-flex min-h-11 items-center rounded-full bg-violet-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-100 ring-1 ring-violet-400/50"
      }
    >
      {hi ? "एआई ज्योतिषी — मानव नहीं" : "AI astrologer — not a human"}
    </span>
  );
}

export function HumanAstrologerLabel({
  locale,
  size = "md",
}: {
  locale: string;
  size?: "sm" | "md";
}) {
  const hi = locale === "hi";
  return (
    <span
      className={
        size === "sm"
          ? "inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/35"
          : "inline-flex min-h-11 items-center rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/40"
      }
    >
      {hi ? "वास्तविक मानव ज्योतिषी" : "Real human astrologer"}
    </span>
  );
}

export function isAiPersona(kind: string | undefined | null) {
  return kind === "AI_PERSONA";
}

/** Always renders AI or human disclosure — use this on directory + chat. */
export function AstrologerKindLabel({
  kind,
  locale,
  size = "md",
}: {
  kind: string | undefined | null;
  locale: string;
  size?: "sm" | "md";
}) {
  if (isAiPersona(kind)) {
    return <AiAstrologerLabel locale={locale} size={size} />;
  }
  return <HumanAstrologerLabel locale={locale} size={size} />;
}
