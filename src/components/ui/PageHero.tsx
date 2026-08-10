"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type PageHeroCrumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: PageHeroCrumb[];
  actions?: ReactNode;
  className?: string;
  compact?: boolean;
};

const RING_MARKS = Array.from({ length: 12 }, (_, i) => i * 30);

function HeroOrbitVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[11.5rem] sm:max-w-[13rem] lg:max-w-[14.5rem]">
      <motion.div
        aria-hidden
        className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(255,138,31,0.28)_0%,rgba(255,138,31,0.08)_42%,transparent_70%)]"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[4%] rounded-full border border-dashed border-saffron/35"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[10%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
      >
        {RING_MARKS.map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-center"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <span className="mx-auto mt-0 block h-2 w-[2px] rounded-full bg-saffron/45" />
          </span>
        ))}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-[22%] rounded-full border border-saffron/25 bg-white/35 shadow-[inset_0_0_28px_rgba(255,138,31,0.08)] backdrop-blur-[2px]"
      />

      <motion.div
        aria-hidden
        className="absolute inset-[30%] rounded-full border-2 border-transparent"
        style={{
          borderTopColor: "rgba(240,106,0,0.55)",
          borderRightColor: "rgba(255,183,71,0.35)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[14%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-saffron shadow-[0_0_10px_rgba(255,138,31,0.8)]" />
      </motion.div>

      {/* Soft center core — no Om */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          aria-hidden
          className="relative h-9 w-9 rounded-full bg-gradient-to-br from-saffron/90 to-maroon/90 shadow-[0_8px_22px_-8px_rgba(240,106,0,0.55)] sm:h-10 sm:w-10"
          animate={{ y: [0, -3, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-[28%] rounded-full bg-white/35" />
        </motion.div>
      </div>

      <motion.span
        aria-hidden
        className="absolute left-[2%] top-[16%] rounded-md border border-saffron/20 bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-saffron-deep shadow-sm backdrop-blur"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        LAGNA
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute right-0 top-[26%] rounded-md border border-saffron/20 bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-ink shadow-sm backdrop-blur"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        DASHA
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute bottom-[14%] left-[8%] rounded-md border border-saffron/20 bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-ink-muted shadow-sm backdrop-blur"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        NAKSHATRA
      </motion.span>
    </div>
  );
}

/** Internal page hero — compact orbit motion, no Om emblem. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-black/[0.06] py-5 sm:py-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 8% 0%, rgba(255,138,31,0.18), transparent 55%), radial-gradient(ellipse 55% 60% at 92% 20%, rgba(255,183,71,0.14), transparent 52%), linear-gradient(165deg, #fffaf6 0%, #fff3e8 55%, #ffe8d2 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(42,33,24,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(42,33,24,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 30% 20%, black 20%, transparent 75%)",
        }}
        animate={{ backgroundPosition: ["0px 0px", "36px 36px"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ["0%", "220%"] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
      />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(160px,0.55fr)] lg:gap-6">
          <motion.div
            className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {crumbs && crumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="mb-1.5">
                <ol className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-ink-muted lg:justify-start">
                  {crumbs.map((c, i) => (
                    <li
                      key={`${c.label}-${i}`}
                      className="flex items-center gap-1.5"
                    >
                      {i > 0 ? <span className="text-black/25">/</span> : null}
                      {c.href ? (
                        <Link
                          href={c.href}
                          className="transition hover:text-saffron-deep"
                        >
                          {c.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-ink">{c.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {eyebrow ? (
              <motion.p
                className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-saffron-deep" />
                </span>
                {eyebrow}
              </motion.p>
            ) : null}

            <motion.h1
              className="mx-auto font-display max-w-2xl text-xl font-bold tracking-tight text-ink sm:text-2xl lg:mx-0 lg:text-[1.75rem] lg:leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              {title}
            </motion.h1>

            {description ? (
              <motion.p
                className="mx-auto mt-1.5 max-w-xl text-[13px] leading-snug text-ink-muted sm:text-[14px] lg:mx-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                {description}
              </motion.p>
            ) : null}

            {actions ? (
              <motion.div
                className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                {actions}
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div
            className="relative mx-auto hidden w-full sm:block lg:justify-self-end"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
          >
            <HeroOrbitVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
