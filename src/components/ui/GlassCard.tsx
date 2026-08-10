import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  strong = false,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        hover && "glass-hover",
        "rounded-2xl p-5 sm:p-6 md:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
