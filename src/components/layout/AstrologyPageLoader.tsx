"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { CosmicGPTLogo } from "@/components/brand/CosmicGPTLogo";
import { AstrologySpinner } from "@/components/layout/AstrologySpinner";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Astrology-styled page load overlay:
 * - first paint / hydration
 * - every client route change
 */
export function AstrologyPageLoader() {
  const pathname = usePathname();
  const locale = useLocale();
  const hi = locale === "hi";
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const firstPath = useRef(pathname);
  const hideTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);

  function clearTimers() {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
  }

  function showThenHide(holdMs: number) {
    clearTimers();
    setVisible(true);
    setExiting(false);
    hideTimer.current = window.setTimeout(() => {
      setExiting(true);
      exitTimer.current = window.setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 300);
    }, holdMs);
  }

  // Initial load
  useEffect(() => {
    showThenHide(700);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subsequent navigations
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    showThenHide(520);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Admin control plane has its own shell — skip the public splash overlay.
  if (pathname.startsWith("/admin")) return null;

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cosmic-navy transition-opacity duration-300",
        exiting ? "opacity-0" : "opacity-100"
      )}
      role="status"
      aria-live="polite"
      aria-label={hi ? "पेज लोड हो रहा है" : "Page loading"}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 42%, rgba(108,60,255,0.28), transparent 42%), radial-gradient(circle at 20% 80%, rgba(255,92,168,0.12), transparent 35%), radial-gradient(circle at 80% 18%, rgba(255,138,61,0.16), transparent 30%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative h-[5.5rem] w-[5.5rem]">
          <AstrologySpinner size="lg" className="!h-full !w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CosmicGPTLogo className="h-10 w-10 drop-shadow-sm" />
          </div>
        </div>

        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-white">
            {siteConfig.brandName}
          </p>
          <p className="mt-1.5 font-ui text-[13px] font-medium text-cosmic-gold">
            {hi ? "तारों को संरेखित किया जा रहा है…" : "Aligning the stars…"}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-1.5" aria-hidden>
          {["♈", "♉", "♊", "♋", "♌"].map((g, i) => (
            <span
              key={g}
              className="astrology-dot text-[11px] text-saffron/70"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
