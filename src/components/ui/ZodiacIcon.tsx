import { cn } from "@/lib/utils";
import {
  zodiacIconSrc,
  zodiacSlugFromIndex,
  type ZodiacSlug,
} from "@/lib/zodiac-icons";

/** CosmicGyan masked line-art zodiac icon (color via background). */
export function ZodiacIcon({
  slug,
  index,
  className,
  /** Tailwind bg-* class — mask reveals this color. Default: cosmic gold for dark UI. */
  colorClassName = "bg-cosmic-gold",
}: {
  slug?: ZodiacSlug | string;
  index?: number;
  className?: string;
  colorClassName?: string;
}) {
  const resolved =
    slug ?? (typeof index === "number" ? zodiacSlugFromIndex(index) : "aries");
  const src = zodiacIconSrc(resolved);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0",
        colorClassName,
        className
      )}
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
        filter: "drop-shadow(0 0 6px rgba(255, 200, 87, 0.35))",
      }}
    />
  );
}
