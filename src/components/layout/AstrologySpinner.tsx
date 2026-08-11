import { cn } from "@/lib/utils";

/** Compact rotating zodiac ring used by pull-to-refresh + page loader. */
export function AstrologySpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-20 w-20" : "h-12 w-12";

  return (
    <div className={cn("relative shrink-0", dim, className)} aria-hidden>
      <div className="astrology-spin absolute inset-0 rounded-full border-2 border-dashed border-saffron/45" />
      <div className="astrology-spin-rev absolute inset-[18%] rounded-full border border-saffron/30" />
      <div className="astrology-spin absolute inset-0">
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-saffron shadow-[0_0_6px_rgba(240,106,0,0.55)]" />
      </div>
      <div className="astrology-spin-rev absolute inset-0">
        <span className="absolute bottom-[8%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#f06a00]/85" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="astrology-pulse text-[0.95em] leading-none text-saffron-deep">
          ✦
        </span>
      </div>
    </div>
  );
}
