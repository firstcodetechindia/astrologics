import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type Props = {
  className?: string;
  showTagline?: boolean;
  taglineClassName?: string;
  size?: "sm" | "md" | "lg";
  width?: number;
  variant?: "light" | "dark";
  animated?: boolean;
};

/**
 * Slot widths sized for “CosmicTalks” (11 letters). The suffix is one letter
 * longer and uses wider glyphs (T, k) than the previous 4-letter suffix —
 * do not reuse that pixel budget.
 */
const WIDTH = { sm: 188, md: 286, lg: 392 } as const;
const FONT = { sm: 26, md: 40, lg: 52 } as const;

/** CosmicTalks mark + English tagline — CSS text (smooth), star locked to the “i”. */
export function CosmicGPTWordmark({
  className,
  showTagline,
  taglineClassName,
  size = "md",
  width,
}: Props) {
  const withTag = showTagline ?? size !== "sm";
  const w = width ?? WIDTH[size];
  const fontPx = width
    ? Math.max(20, Math.round(width / 6))
    : FONT[size];
  const smFluid = size === "sm" && !width;
  const label = `${siteConfig.brandName} — ${siteConfig.tagline.en}`;
  const tagClass =
    size === "lg"
      ? "mt-1.5 text-[12px] tracking-[0.14em] sm:text-[13px]"
      : size === "md"
        ? "mt-1.5 text-[11px] tracking-[0.12em]"
        : "mt-1 text-[9px] tracking-[0.11em]";

  return (
    <span
      className={cn(
        "inline-flex w-full max-w-full select-none flex-col items-center",
        className
      )}
      role="img"
      aria-label={label}
      style={{ maxWidth: w }}
    >
      <span
        className={cn(
          "relative inline-flex max-w-full items-baseline whitespace-nowrap pt-[0.28em] font-ui font-bold tracking-[-0.04em] text-white",
          smFluid && "text-[clamp(1.125rem,4.8vw,1.625rem)]"
        )}
        style={{
          fontSize: smFluid ? undefined : fontPx,
          lineHeight: 1.05,
        }}
      >
        <span>Cosm</span>
        {/* Dotless stem + star tittle (always on the i, never drifts) */}
        <span className="relative inline-block px-[0.01em]">
          <span aria-hidden className="opacity-100">
            ı
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[42%] text-[0.42em] leading-none text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.55)]"
          >
            ✦
          </span>
        </span>
        <span>c</span>
        <span
          className="bg-[linear-gradient(90deg,#6C3CFF_0%,#FF5CA8_32%,#FF8A3D_68%,#FFC857_100%)] bg-clip-text pb-[0.08em] tracking-[-0.05em] text-transparent"
        >
          Talks
        </span>
      </span>

      {withTag ? (
        <span
          className={cn(
            "max-w-full truncate text-center font-ui font-semibold uppercase leading-normal text-white",
            tagClass,
            taglineClassName
          )}
          style={{ width: "100%" }}
        >
          Let&apos;s Decode Your Stars
        </span>
      ) : null}
    </span>
  );
}
