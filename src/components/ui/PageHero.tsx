"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  GalaxyHeroBackground,
  type GalaxyHeroBackgroundProps,
} from "@/components/ui/GalaxyHeroBackground";

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
  /**
   * Galaxy canvas backdrop. ON by default for all PageHero pages.
   * Pass `false` to disable. Pass config object to tune intensity/density.
   * Home page uses a separate Hero and is unaffected.
   */
  galaxyBackground?: boolean | GalaxyHeroBackgroundProps;
};

const RING_MARKS = Array.from({ length: 12 }, (_, i) => i * 30);

/** Sparse bright stars — milky-way backdrop uses denser CSS dust layers. */
const STARS = [
  [6, 18, 1.6],
  [14, 42, 1],
  [22, 12, 2],
  [28, 68, 0.9],
  [36, 28, 1.4],
  [44, 8, 1.1],
  [52, 52, 1.8],
  [58, 22, 0.9],
  [66, 74, 1.2],
  [72, 16, 2.1],
  [78, 48, 1],
  [84, 32, 1.5],
  [90, 62, 1.1],
  [12, 78, 1.3],
  [40, 86, 1],
  [62, 88, 1.6],
  [88, 10, 0.9],
  [48, 38, 0.8],
  [18, 55, 1.3],
  [74, 58, 1.1],
  [8, 34, 1.2],
  [32, 48, 0.8],
  [55, 14, 1.5],
  [81, 70, 1],
  [95, 44, 1.3],
  [4, 58, 0.9],
  [25, 88, 1.1],
  [70, 6, 1.4],
] as const;

function PageHeroCosmos({ reduce }: { reduce: boolean | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 8% -20%, rgba(88,48,210,0.38), transparent 52%), radial-gradient(ellipse 70% 60% at 100% 0%, rgba(255,92,168,0.16), transparent 48%), radial-gradient(ellipse 55% 50% at 78% 115%, rgba(255,138,61,0.1), transparent 50%), linear-gradient(168deg, #050714 0%, #080c1a 28%, #0b1024 58%, #0a0e1c 100%)",
        }}
      />

      {/* Distant galactic haze */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 120% 55% at 50% 120%, rgba(60,40,140,0.35), transparent 60%), radial-gradient(ellipse 40% 70% at -5% 40%, rgba(40,70,160,0.2), transparent 55%)",
        }}
      />

      {/* Milky Way band — diagonal luminous dust lane */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative h-[170%] w-[min(42%,28rem)] shrink-0 page-hero-milky-way">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(160,170,255,0.04) 18%, rgba(210,200,255,0.14) 38%, rgba(255,236,210,0.22) 50%, rgba(255,170,210,0.14) 62%, rgba(140,150,255,0.06) 82%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-[8%_18%]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 45%, rgba(255,220,180,0.12) 50%, rgba(255,255,255,0.07) 55%, transparent)",
              filter: "blur(8px)",
            }}
          />
          <div
            className="absolute inset-y-[10%] left-[28%] right-[28%] opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.55) 0.45px, transparent 0.55px), radial-gradient(rgba(255,210,160,0.4) 0.4px, transparent 0.5px)",
              backgroundSize: "7px 7px, 11px 11px",
              backgroundPosition: "0 0, 4px 3px",
              maskImage:
                "linear-gradient(90deg, transparent, black 25%, black 75%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, black 25%, black 75%, transparent)",
            }}
          />
        </div>
      </div>

      {/* Soft nebula clouds */}
      <motion.div
        className="absolute -left-[14%] top-[-40%] h-[20rem] w-[20rem] rounded-full bg-cosmic-purple/28 blur-3xl sm:h-[24rem] sm:w-[24rem]"
        animate={
          reduce ? undefined : { opacity: [0.32, 0.55, 0.32], scale: [1, 1.1, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[10%] top-[-25%] h-[16rem] w-[16rem] rounded-full bg-cosmic-pink/22 blur-3xl sm:h-[20rem] sm:w-[20rem]"
        animate={
          reduce
            ? undefined
            : { opacity: [0.22, 0.42, 0.22], scale: [1.06, 0.94, 1.06] }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      <motion.div
        className="absolute bottom-[-45%] left-[30%] h-[14rem] w-[24rem] rounded-full bg-cosmic-orange/12 blur-3xl"
        animate={
          reduce ? undefined : { opacity: [0.12, 0.28, 0.12], x: [0, 28, 0] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] bottom-[-20%] h-[10rem] w-[14rem] rounded-full bg-sky-500/10 blur-3xl"
        animate={
          reduce ? undefined : { opacity: [0.1, 0.22, 0.1], y: [0, -12, 0] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Multi-layer star dust */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.45] page-hero-star-dust"
        )}
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 0.55px, transparent 0.55px), radial-gradient(rgba(200,210,255,0.45) 0.4px, transparent 0.45px), radial-gradient(rgba(255,220,180,0.35) 0.35px, transparent 0.4px)",
          backgroundSize: "26px 26px, 18px 18px, 34px 34px",
          maskImage:
            "radial-gradient(ellipse 95% 85% at 50% 35%, black 15%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 85% at 50% 35%, black 15%, transparent 78%)",
        }}
      />

      {/* Bright twinkling stars */}
      {STARS.map(([x, y, s], i) => (
        <span
          key={`${x}-${y}-${i}`}
          className={cn(
            "absolute rounded-full bg-white",
            s >= 1.5
              ? "shadow-[0_0_10px_rgba(255,255,255,0.75),0_0_18px_rgba(180,190,255,0.35)] cosmic-twinkle"
              : "shadow-[0_0_6px_rgba(255,255,255,0.55)] cosmic-twinkle"
          )}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${s}px`,
            height: `${s}px`,
            animationDelay: `${(i % 9) * 0.35}s`,
          }}
        />
      ))}

      {/* Spiral galaxy disc (far right) */}
      <div
        className={cn(
          "absolute -right-16 top-[42%] h-[20rem] w-[20rem] -translate-y-1/2 opacity-[0.55] page-hero-galaxy-spin sm:-right-10 sm:h-[24rem] sm:w-[24rem]"
        )}
      >
        <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
          <defs>
            <radialGradient id="pageHeroGalaxyCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,240,220,0.55)" />
              <stop offset="28%" stopColor="rgba(180,160,255,0.28)" />
              <stop offset="62%" stopColor="rgba(108,60,255,0.12)" />
              <stop offset="100%" stopColor="rgba(108,60,255,0)" />
            </radialGradient>
          </defs>
          <ellipse
            cx="160"
            cy="160"
            rx="148"
            ry="52"
            fill="url(#pageHeroGalaxyCore)"
            opacity="0.85"
            transform="rotate(-18 160 160)"
          />
          <ellipse
            cx="160"
            cy="160"
            rx="132"
            ry="38"
            stroke="rgba(220,210,255,0.22)"
            strokeWidth="1.2"
            transform="rotate(-18 160 160)"
          />
          <ellipse
            cx="160"
            cy="160"
            rx="98"
            ry="28"
            stroke="rgba(255,180,210,0.16)"
            strokeWidth="0.9"
            strokeDasharray="3 8"
            transform="rotate(12 160 160)"
          />
          <ellipse
            cx="160"
            cy="160"
            rx="70"
            ry="20"
            stroke="rgba(255,200,87,0.14)"
            strokeWidth="0.8"
            transform="rotate(-40 160 160)"
          />
          <circle cx="160" cy="160" r="10" fill="rgba(255,245,230,0.55)" />
          <circle
            cx="160"
            cy="160"
            r="18"
            fill="rgba(160,140,255,0.2)"
            className="blur-[2px]"
          />
        </svg>
      </div>

      {/* Orbit rings (left / right accents) */}
      <motion.svg
        className="absolute -right-10 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 opacity-30 sm:h-[26rem] sm:w-[26rem]"
        viewBox="0 0 320 320"
        fill="none"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="160" cy="160" r="118" stroke="rgba(108,60,255,0.28)" strokeWidth="1" />
        <circle
          cx="160"
          cy="160"
          r="88"
          stroke="rgba(255,92,168,0.18)"
          strokeWidth="0.9"
          strokeDasharray="4 7"
        />
      </motion.svg>

      <motion.svg
        className="absolute -left-16 bottom-[-30%] h-56 w-56 opacity-25 sm:h-72 sm:w-72"
        viewBox="0 0 240 240"
        fill="none"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="120" cy="120" r="92" stroke="rgba(108,60,255,0.24)" strokeWidth="1" />
        <circle
          cx="120"
          cy="120"
          r="64"
          stroke="rgba(255,138,61,0.14)"
          strokeWidth="0.8"
          strokeDasharray="2 6"
        />
      </motion.svg>

      {/* Soft light sweep across the band — always mounted (stable SSR tree) */}
      <motion.div
        className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={reduce ? undefined : { x: ["0%", "230%"] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
        }}
      />

      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0f1f] via-[#0b0f1f]/70 to-transparent" />
    </div>
  );
}

function HeroOrbitVisual({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[12.5rem] sm:max-w-[14rem] lg:max-w-[15.5rem]">
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(108,60,255,0.35)_0%,rgba(255,92,168,0.12)_40%,transparent_68%)] blur-md" />

      <motion.div
        aria-hidden
        className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(108,60,255,0.45)_0%,rgba(255,92,168,0.18)_45%,transparent_72%)]"
        animate={reduce ? undefined : { scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[2%] rounded-full border border-dashed border-cosmic-purple/45"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[8%]"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
      >
        {RING_MARKS.map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-center"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <span className="mx-auto mt-0 block h-2 w-[2px] rounded-full bg-cosmic-gold/55" />
          </span>
        ))}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-[20%] rounded-full border border-white/15 bg-white/[0.06] shadow-[inset_0_0_32px_rgba(108,60,255,0.25)] backdrop-blur-[2px]"
      />

      <motion.div
        aria-hidden
        className="absolute inset-[28%] rounded-full border-2 border-transparent"
        style={{
          borderTopColor: "rgba(108,60,255,0.7)",
          borderRightColor: "rgba(255,92,168,0.45)",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-[12%]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cosmic-gold shadow-[0_0_12px_rgba(255,200,87,0.9)]" />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-[18%]"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cosmic-pink shadow-[0_0_10px_rgba(255,92,168,0.85)]" />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          aria-hidden
          className="relative h-10 w-10 rounded-full bg-gradient-to-br from-cosmic-purple via-cosmic-pink to-cosmic-orange shadow-[0_0_28px_rgba(108,60,255,0.55)] sm:h-11 sm:w-11"
          animate={reduce ? undefined : { y: [0, -3, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-[28%] rounded-full bg-surface/80" />
        </motion.div>
      </div>

      <motion.span
        aria-hidden
        className="absolute left-[0%] top-[14%] rounded-md border border-white/15 bg-surface/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-cosmic-gold shadow-sm backdrop-blur"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        LAGNA
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute right-[-2%] top-[24%] rounded-md border border-white/15 bg-surface/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white shadow-sm backdrop-blur"
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      >
        DASHA
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute bottom-[12%] left-[6%] rounded-md border border-white/15 bg-surface/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-ink-muted shadow-sm backdrop-blur"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{
          duration: 4.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        NAKSHATRA
      </motion.span>
    </div>
  );
}

/** Internal page hero — cosmic nebula + orbit motion for all tool/content pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  className,
  compact,
  galaxyBackground,
}: PageHeroProps) {
  const reduce = useHydratedReducedMotion();
  // Default ON for every PageHero (home uses separate <Hero />, never PageHero).
  const useGalaxy = galaxyBackground !== false;
  const galaxyDefaults: GalaxyHeroBackgroundProps = {
    intensity: 1,
    opacity: 0.4,
    parallax: false,
  };
  const galaxyProps: GalaxyHeroBackgroundProps =
    typeof galaxyBackground === "object" && galaxyBackground
      ? { ...galaxyDefaults, ...galaxyBackground }
      : galaxyDefaults;

  return (
    <section
      className={cn(
        "relative -mt-[var(--site-header-h)] overflow-hidden border-b border-white/[0.08]",
        compact
          ? "pb-7 pt-[calc(var(--site-header-h)+1.5rem)] sm:pb-8 sm:pt-[calc(var(--site-header-h)+1.75rem)]"
          : useGalaxy
            ? "pb-16 pt-[calc(var(--site-header-h)+2.75rem)] sm:pb-20 sm:pt-[calc(var(--site-header-h)+3.5rem)] lg:pb-24 lg:pt-[calc(var(--site-header-h)+4.25rem)]"
            : "pb-7 pt-[calc(var(--site-header-h)+1.5rem)] sm:pb-9 sm:pt-[calc(var(--site-header-h)+2rem)] lg:pb-10 lg:pt-[calc(var(--site-header-h)+2.25rem)]",
        className
      )}
    >
      {useGalaxy ? (
        <GalaxyHeroBackground {...galaxyProps} />
      ) : (
        <PageHeroCosmos reduce={reduce} />
      )}

      <div className="container-page relative z-10">
        <div
          className={cn(
            "grid items-center gap-5 lg:gap-8",
            useGalaxy
              ? "lg:grid-cols-1"
              : "lg:grid-cols-[minmax(0,1.15fr)_minmax(180px,0.55fr)]"
          )}
        >
          <motion.div
            className={cn(
              "relative mx-auto w-full max-w-2xl text-center lg:mx-0 lg:max-w-none",
              useGalaxy ? "lg:max-w-3xl lg:text-left" : "lg:text-left"
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Readability scrim behind copy */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-3xl lg:-inset-x-6",
                useGalaxy
                  ? "bg-[radial-gradient(ellipse_at_center,rgba(11,15,31,0.45)_0%,transparent_74%)] lg:bg-[radial-gradient(ellipse_at_left,rgba(11,15,31,0.5)_0%,transparent_72%)]"
                  : "bg-[radial-gradient(ellipse_at_center,rgba(11,15,31,0.55)_0%,transparent_72%)] lg:bg-[radial-gradient(ellipse_at_left,rgba(11,15,31,0.62)_0%,transparent_70%)]"
              )}
            />

            <div className="relative flex flex-col items-center gap-3.5 sm:gap-4 lg:items-start">
              {crumbs && crumbs.length > 0 ? (
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] leading-normal text-ink-muted lg:justify-start">
                    {crumbs.map((c, i) => (
                      <li
                        key={`${c.label}-${i}`}
                        className="flex items-center gap-1.5"
                      >
                        {i > 0 ? (
                          <span className="text-white/25">/</span>
                        ) : null}
                        {c.href ? (
                          <Link
                            href={c.href}
                            className="transition hover:text-cosmic-gold"
                          >
                            {c.label}
                          </Link>
                        ) : (
                          <span className="font-medium text-white">
                            {c.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {eyebrow ? (
                <motion.p
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase leading-normal tracking-[0.16em] text-cosmic-gold"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.3 }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cosmic-purple opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cosmic-purple" />
                  </span>
                  {eyebrow}
                </motion.p>
              ) : null}

              <motion.h1
                className="page-hero-title mx-auto w-full max-w-2xl text-center font-display tracking-tight text-white drop-shadow-[0_2px_18px_rgba(108,60,255,0.25)] lg:mx-0 lg:text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                {title}
              </motion.h1>

              {description ? (
                <motion.p
                  className="mx-auto max-w-xl text-center text-[15px] leading-[1.75] text-ink-muted sm:text-base lg:mx-0 lg:text-left"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                >
                  {description}
                </motion.p>
              ) : null}

              {actions ? (
                <motion.div
                  className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                >
                  {actions}
                </motion.div>
              ) : null}
            </div>
          </motion.div>

          {!useGalaxy ? (
            <motion.div
              className="relative mx-auto w-full max-w-[15.5rem] sm:block lg:justify-self-end"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
            >
              <HeroOrbitVisual reduce={reduce} />
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
