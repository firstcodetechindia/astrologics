import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-saffron/15 bg-white/92 shadow-[0_18px_48px_-34px_rgba(42,33,24,0.5)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </section>
  );
}

export function DashboardEmpty({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center sm:px-8">
      <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#fff8f1,#ffe8d4)] shadow-[inset_0_0_0_1px_rgba(240,106,0,0.14),0_10px_24px_-16px_rgba(240,106,0,0.55)]">
        <div
          aria-hidden
          className="absolute inset-1 rounded-[0.9rem] border border-dashed border-saffron/25"
        />
        <Icon
          className="relative h-7 w-7 text-saffron-deep"
          strokeWidth={1.9}
          aria-hidden
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
