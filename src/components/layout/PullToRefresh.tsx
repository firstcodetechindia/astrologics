"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AstrologySpinner } from "@/components/layout/AstrologySpinner";
import { vibrate } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const THRESHOLD = 78;
const MAX_PULL = 120;

function scrollTopOf(el: Element | Document): number {
  if (
    el === document ||
    el === document.documentElement ||
    el === document.body
  ) {
    return (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }
  return (el as HTMLElement).scrollTop;
}

function findScrollParent(start: EventTarget | null): Element | Document {
  let el = start instanceof Element ? start : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const oy = style.overflowY;
    const canScroll =
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      el.scrollHeight > el.clientHeight + 1;
    if (canScroll) return el;
    el = el.parentElement;
  }
  return document.documentElement;
}

export function PullToRefresh() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullRef = useRef(0);
  const startY = useRef(0);
  const startX = useRef(0);
  const tracking = useRef(false);
  const armed = useRef(false);
  const thresholdHit = useRef(false);
  const refreshingRef = useRef(false);
  const scrollParent = useRef<Element | Document | null>(null);

  const setPullBoth = useCallback((n: number) => {
    pullRef.current = n;
    setPull(n);
  }, []);

  const reset = useCallback(() => {
    tracking.current = false;
    armed.current = false;
    thresholdHit.current = false;
    setPullBoth(0);
  }, [setPullBoth]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      if (e.touches.length !== 1) return;
      // Skip while mobile nav sheet is open
      if (document.querySelector('[data-mobile-sheet="open"]')) return;
      const parent = findScrollParent(e.target);
      scrollParent.current = parent;
      if (scrollTopOf(parent) > 2) {
        tracking.current = false;
        return;
      }
      startY.current = e.touches[0].clientY;
      startX.current = e.touches[0].clientX;
      tracking.current = true;
      armed.current = false;
      thresholdHit.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || refreshingRef.current) return;
      const y = e.touches[0].clientY;
      const x = e.touches[0].clientX;
      const dy = y - startY.current;
      const dx = Math.abs(x - startX.current);
      if (dx > 12 && dx > Math.abs(dy)) {
        reset();
        return;
      }
      if (dy <= 0) {
        setPullBoth(0);
        armed.current = false;
        return;
      }
      const parent = scrollParent.current ?? document.documentElement;
      if (scrollTopOf(parent) > 2) {
        reset();
        return;
      }
      const next = Math.min(MAX_PULL, dy * 0.55);
      if (next > 8) {
        armed.current = true;
        if (e.cancelable) e.preventDefault();
      }
      setPullBoth(next);
      if (next >= THRESHOLD && !thresholdHit.current) {
        thresholdHit.current = true;
        vibrate(14);
      } else if (next < THRESHOLD - 12) {
        thresholdHit.current = false;
      }
    };

    const onTouchEnd = () => {
      if (!tracking.current) return;
      const shouldRefresh = armed.current && pullRef.current >= THRESHOLD;
      if (shouldRefresh) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullBoth(THRESHOLD);
        vibrate(22, 40, 28);
        window.setTimeout(() => {
          window.location.reload();
        }, 420);
        return;
      }
      reset();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [reset, setPullBoth]);

  const visible = pull > 6 || refreshing;
  const ready = pull >= THRESHOLD || refreshing;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[90] flex justify-center transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top))",
        transform: `translateY(${Math.max(0, pull - 12)}px)`,
      }}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-full border border-saffron/25 bg-white/95 px-3.5 py-2 shadow-[0_10px_28px_-12px_rgba(240,106,0,0.45)] backdrop-blur-md",
          ready && "border-saffron/45"
        )}
      >
        <AstrologySpinner size="sm" />
        <span className="text-[12px] font-semibold text-saffron-deep">
          {refreshing
            ? hi
              ? "तारों को संरेखित कर रहे हैं…"
              : "Aligning the stars…"
            : ready
              ? hi
                ? "छोड़कर रीफ़्रेश करें"
                : "Release to refresh"
              : hi
                ? "खींचकर रीफ़्रेश करें"
                : "Pull to refresh"}
        </span>
      </div>
    </div>
  );
}
