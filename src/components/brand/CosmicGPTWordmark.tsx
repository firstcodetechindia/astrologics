import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type Props = {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  width?: number;
  variant?: "light" | "dark";
  animated?: boolean;
};

const WIDTH = { sm: 152, md: 228, lg: 304 } as const;
const FONT = { sm: 28, md: 40, lg: 52 } as const;

/** CosmicGPT mark + English tagline — CSS text (smooth), star locked to the “i”. */
export function CosmicGPTWordmark({
  className,
  showTagline,
  size = "md",
  width,
}: Props) {
  const withTag = showTagline ?? size !== "sm";
  const w = width ?? WIDTH[size];
  const fontPx = width
    ? Math.max(22, Math.round(width * 0.185))
    : FONT[size];
  const label = `${siteConfig.brandName} — ${siteConfig.tagline.en}`;
  const tagClass =
    size === "lg"
      ? "mt-1 text-[12px] tracking-[0.14em] sm:text-[13px]"
      : size === "md"
        ? "mt-1 text-[11px] tracking-[0.12em]"
        : "mt-0.5 text-[9px] tracking-[0.11em]";

  return (
    <span
      className={cn("inline-flex select-none flex-col items-center", className)}
      role="img"
      aria-label={label}
      style={{ width: w }}
    >
      <span
        className="relative inline-flex items-baseline font-ui font-bold tracking-[-0.03em] text-white"
        style={{ fontSize: fontPx, lineHeight: 1.05 }}
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
        <span className="bg-[linear-gradient(90deg,#6C3CFF_0%,#FF5CA8_38%,#FF8A3D_72%,#FFC857_100%)] bg-clip-text pb-[0.08em] text-transparent">
          GPT
        </span>
      </span>

      {withTag ? (
        <span
          className={cn(
            "text-center font-ui font-semibold uppercase leading-normal text-white",
            tagClass
          )}
          style={{ width: "90%" }}
        >
          Let&apos;s Decode Your Stars
        </span>
      ) : null}
    </span>
  );
}
