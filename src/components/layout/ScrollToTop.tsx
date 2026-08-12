"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const next = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(next);
      setVisible(scrollTop > 280);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const size = 48;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={hi ? "ऊपर जाएँ" : "Back to top"}
      className={cn(
        "fixed z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-surface/95 text-saffron-deep shadow-[0_10px_28px_-12px_rgba(42,33,24,0.45)] ring-1 ring-black/[0.06] backdrop-blur transition-all duration-300",
        "right-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-6 lg:right-5",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(240,106,0,0.15)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scrollTopGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
        <defs>
          <linearGradient id="scrollTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F06A00" />
            <stop offset="100%" stopColor="#6B1C1C" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="relative h-[1.1rem] w-[1.1rem]" strokeWidth={2.4} />
    </button>
  );
}
