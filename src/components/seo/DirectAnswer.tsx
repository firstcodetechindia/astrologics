import type { ReactNode } from "react";

/** First crawlable paragraph: 1–2 sentence answer, not scene-setting. */
export function DirectAnswer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-saffron/20 bg-surface/90 px-4 py-4 text-[14px] leading-relaxed text-ink sm:px-5 sm:text-[15px]">
      {children}
    </div>
  );
}
