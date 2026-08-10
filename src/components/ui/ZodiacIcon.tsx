import { cn } from "@/lib/utils";
import {
  zodiacIconSrc,
  zodiacSlugFromIndex,
  type ZodiacSlug,
} from "@/lib/zodiac-icons";

/** KundliGPT-style masked line-art zodiac icon (color via background). */
export function ZodiacIcon({
  slug,
  index,
  className,
  colorClassName = "bg-[#c45a12]",
}: {
  slug?: ZodiacSlug | string;
  index?: number;
  className?: string;
  /** Tailwind bg-* class — mask reveals this color */
  colorClassName?: string;
}) {
  const resolved =
    slug ?? (typeof index === "number" ? zodiacSlugFromIndex(index) : "aries");
  const src = zodiacIconSrc(resolved);

  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", colorClassName, className)}
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}
