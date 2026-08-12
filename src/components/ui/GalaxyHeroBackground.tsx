"use client";

/**
 * Galaxy hero motion:
 * field stars + Saptarishi (7) + slow-animating puchhal (comet tails).
 * No orbit labels, no CSS planets, no mouse parallax by default.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type GalaxyHeroBackgroundProps = {
  className?: string;
  /** Overall visual intensity 0–1 (default 0.85). */
  intensity?: number;
  /** Star density multiplier 0.4–1.4 (default 1). */
  starDensity?: number;
  /** Mouse/scroll/tilt parallax (default false — no reaction to mouse). */
  parallax?: boolean;
  /**
   * Opacity of the animated star/comet canvas layer (0–1).
   * Default 0.2 — quiet but sharp (no blur on stars).
   */
  opacity?: number;
  /**
   * `page` = PageHero defaults (unchanged).
   * `home` = slightly richer density + comet cadence for the flagship hero.
   */
  variant?: "page" | "home";
  /** Parallax travel multiplier (default 1). Home uses ~0.85 for subtler motion. */
  parallaxStrength?: number;
  /**
   * When false, skip the solid base fill + copy veil (home provides its own
   * atmosphere so nebula / Milky Way layers can show through).
   */
  chrome?: boolean;
};

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  speed: number;
  phase: number;
  layer: 0 | 1 | 2;
  /** Brighter / sharper twinkle (Saptarishi + a few field gems). */
  sparkle: boolean;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  len: number;
};

/** Approved preview depth shifts (far / mid / near). */
const DEPTH_SHIFT = [
  { x: 4, y: 3 },
  { x: 10, y: 7 },
  { x: 18, y: 12 },
] as const;

/**
 * Saptarishi / Big Dipper relative layout (Dubhe→Alkaid).
 * Units are local 0–1 inside a constellation box.
 */
const SAPTARISHI: ReadonlyArray<{ u: number; v: number; bright: number }> = [
  { u: 0.12, v: 0.38, bright: 1 }, // Dubhe
  { u: 0.14, v: 0.62, bright: 0.92 }, // Merak
  { u: 0.4, v: 0.7, bright: 0.88 }, // Phecda
  { u: 0.44, v: 0.44, bright: 0.78 }, // Megrez (dimmest of the 7)
  { u: 0.62, v: 0.4, bright: 0.95 }, // Alioth
  { u: 0.8, v: 0.34, bright: 0.9 }, // Mizar
  { u: 0.98, v: 0.22, bright: 0.98 }, // Alkaid
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function seedSaptarishi(w: number, h: number): Star[] {
  // Upper-right sky — readable on hero without covering copy on the left.
  const boxW = Math.min(220, w * 0.32);
  const boxH = Math.min(120, h * 0.42);
  const ox = w * 0.58;
  const oy = h * 0.1;
  return SAPTARISHI.map((s, i) => ({
    x: ox + s.u * boxW,
    y: oy + s.v * boxH,
    r: 1.7 + s.bright * 1.1,
    base: 0.55 + s.bright * 0.3,
    amp: 0.28 + s.bright * 0.35,
    // Slow, elegant twinkle — more “chamkila” than field stars
    speed: 0.45 + (i % 3) * 0.22,
    phase: i * 0.9,
    layer: 2 as const,
    sparkle: true,
  }));
}

function seedStars(w: number, h: number, count: number, density: number): Star[] {
  const n = Math.max(24, Math.round(count * density));
  const stars: Star[] = seedSaptarishi(w, h);
  for (let i = 0; i < n; i++) {
    const layer = (i % 3) as 0 | 1 | 2;
    const sparkle = Math.random() < 0.08;
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: sparkle
        ? 1.6 + Math.random() * 1.2
        : layer === 2
          ? 1.3 + Math.random() * 1.3
          : 0.7 + Math.random() * 1.1,
      base: sparkle ? 0.45 + Math.random() * 0.35 : 0.22 + Math.random() * 0.4,
      amp: sparkle ? 0.45 + Math.random() * 0.45 : 0.35 + Math.random() * 0.55,
      speed: sparkle ? 0.9 + Math.random() * 1.6 : 0.7 + Math.random() * 2.4,
      phase: Math.random() * Math.PI * 2,
      layer,
      sparkle,
    });
  }
  return stars;
}

export function GalaxyHeroBackground({
  className,
  intensity = 1,
  starDensity = 1,
  parallax = false,
  opacity = 0.2,
  variant = "page",
  parallaxStrength = 1,
  chrome = true,
}: GalaxyHeroBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const cometRef = useRef<Comet | null>(null);
  const nextCometAtRef = useRef(0);
  const cometScheduledOnceRef = useRef(false);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const reduceRef = useRef(false);
  const mobileRef = useRef(false);
  const parallaxTargetRef = useRef({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0 });
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);

  const intensityClamped = clamp01(intensity);
  const densityClamped = Math.max(0.4, Math.min(1.4, starDensity));
  const opacityClamped = clamp01(opacity);
  const isHome = variant === "home";
  const parallaxMul = Math.max(0.35, Math.min(1.25, parallaxStrength));

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const rect = root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mobileRef.current = isMobileViewport();
    const base = mobileRef.current
      ? isHome
        ? 95
        : 70
      : isHome
        ? 155
        : 120;
    starsRef.current = seedStars(w, h, base, densityClamped);
  }, [densityClamped, isHome]);

  const scheduleNextComet = useCallback(
    (now: number) => {
      // Deliver on a normal cadence — only the travel animation is slow.
      // Home is a bit richer, still within the same performance budget.
      const first = !cometScheduledOnceRef.current;
      cometScheduledOnceRef.current = true;
      const min = first
        ? 1200
        : mobileRef.current
          ? isHome
            ? 7000
            : 9000
          : isHome
            ? 4800
            : 6500;
      const max = first
        ? 2000
        : mobileRef.current
          ? isHome
            ? 13000
            : 16000
          : isHome
            ? 8500
            : 11000;
      nextCometAtRef.current = now + min + Math.random() * (max - min);
    },
    [isHome]
  );

  const spawnComet = useCallback((w: number, h: number) => {
    const fromLeft = Math.random() > 0.4;
    // Slow glide across the sky (not a quick streak)
    const speed = 1.55 + Math.random() * 0.85;
    cometRef.current = {
      x: fromLeft ? -40 : w + 40,
      y: h * (0.1 + Math.random() * 0.38),
      vx: fromLeft ? speed : -speed,
      vy: speed * (0.22 + Math.random() * 0.22),
      life: 0,
      // Long enough life so a slow comet still crosses most of the hero
      maxLife: 220 + Math.random() * 80,
      // Long puchhal (tail)
      len: 140 + Math.random() * 90,
    };
  }, []);

  const drawFrame = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 1 || h < 1) return;

      const reduce = reduceRef.current;
      const target = parallaxTargetRef.current;
      const p = parallaxRef.current;
      if (!reduce && parallax) {
        p.x += (target.x - p.x) * 0.08;
        p.y += (target.y - p.y) * 0.08;
      } else {
        p.x = 0;
        p.y = 0;
      }

      ctx.clearRect(0, 0, w, h);
      const alphaScale = 0.75 + intensityClamped * 0.35;

      for (const s of starsRef.current) {
        let tw = reduce
          ? s.base
          : s.base + Math.sin(now * 0.001 * s.speed + s.phase) * s.amp;
        // Extra “chamkila” sparkle pulse on Saptarishi / bright gems
        if (!reduce && s.sparkle) {
          const pulse = Math.sin(now * 0.0022 * s.speed + s.phase * 1.7);
          tw += Math.max(0, pulse) * 0.35;
        }
        const a = Math.max(0.06, Math.min(1, tw)) * alphaScale;
        const shift = DEPTH_SHIFT[s.layer];
        const ox = p.x * shift.x * parallaxMul;
        const oy = p.y * shift.y * parallaxMul;
        const x = s.x + ox;
        const y = s.y + oy;

        ctx.beginPath();
        ctx.fillStyle = s.sparkle
          ? `rgba(235,245,255,${a})`
          : `rgba(255,255,255,${a})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Tiny cross flare on the brightest — still sharp, more cosmic
        if (s.sparkle && a > 0.55) {
          const arm = s.r * (1.8 + a * 1.4);
          ctx.strokeStyle = `rgba(210,225,255,${a * 0.55})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(x - arm, y);
          ctx.lineTo(x + arm, y);
          ctx.moveTo(x, y - arm);
          ctx.lineTo(x, y + arm);
          ctx.stroke();
        }
      }

      // Soft connector lines for Saptarishi (first 7 stars in the seed list)
      if (starsRef.current.length >= 7) {
        const dipper = starsRef.current.slice(0, 7);
        ctx.strokeStyle = "rgba(180,200,255,0.18)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let i = 0; i < dipper.length; i++) {
          const s = dipper[i]!;
          const shift = DEPTH_SHIFT[s.layer];
          const x = s.x + p.x * shift.x * parallaxMul;
          const y = s.y + p.y * shift.y * parallaxMul;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (!reduce) {
        if (!cometRef.current && now >= nextCometAtRef.current) {
          spawnComet(w, h);
          scheduleNextComet(now);
        }
        const c = cometRef.current;
        if (c) {
          c.life += 1;
          c.x += c.vx;
          c.y += c.vy;
          const fade = 1 - c.life / c.maxLife;
          const ang = Math.atan2(c.vy, c.vx);
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const tx = c.x - cos * c.len;
          const ty = c.y - sin * c.len;

          // Wide soft puchhal
          const gWide = ctx.createLinearGradient(tx, ty, c.x, c.y);
          gWide.addColorStop(0, "rgba(140,170,255,0)");
          gWide.addColorStop(0.45, `rgba(160,190,255,${0.22 * fade})`);
          gWide.addColorStop(1, `rgba(255,255,255,${0.55 * fade})`);
          ctx.strokeStyle = gWide;
          ctx.lineWidth = 4.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();

          // Bright core trail
          const gCore = ctx.createLinearGradient(tx, ty, c.x, c.y);
          gCore.addColorStop(0, "rgba(255,255,255,0)");
          gCore.addColorStop(0.55, `rgba(200,220,255,${0.5 * fade})`);
          gCore.addColorStop(1, `rgba(255,255,255,${0.98 * fade})`);
          ctx.strokeStyle = gCore;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(c.x - cos * c.len * 0.72, c.y - sin * c.len * 0.72);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();

          // Head
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${0.98 * fade})`;
          ctx.arc(c.x, c.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `rgba(190,210,255,${0.35 * fade})`;
          ctx.arc(c.x, c.y, 4.2, 0, Math.PI * 2);
          ctx.fill();

          if (
            c.life >= c.maxLife ||
            c.x < -160 ||
            c.x > w + 160 ||
            c.y > h + 120
          ) {
            cometRef.current = null;
          }
        }
      }
    },
    [intensityClamped, parallax, parallaxMul, scheduleNextComet, spawnComet]
  );

  const loop = useCallback(
    (now: number) => {
      if (!visibleRef.current || reduceRef.current) {
        rafRef.current = 0;
        return;
      }
      drawFrame(now);
      rafRef.current = requestAnimationFrame(loop);
    },
    [drawFrame]
  );

  const startLoop = useCallback(() => {
    if (rafRef.current || reduceRef.current || !visibleRef.current) return;
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const boot = () => {
      if (cancelled || startedRef.current) return;
      startedRef.current = true;
      reduceRef.current = prefersReducedMotion();
      mobileRef.current = isMobileViewport();
      resizeCanvas();
      scheduleNextComet(performance.now());
      setReady(true);
      drawFrame(performance.now());
      if (!reduceRef.current) startLoop();
    };

    const ric = (
      window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number }
        ) => number;
      }
    ).requestIdleCallback;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof ric === "function") {
      idleId = ric(boot, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(boot, 180);
    }

    return () => {
      cancelled = true;
      if (idleId != null && "cancelIdleCallback" in window) {
        (
          window as Window & { cancelIdleCallback: (id: number) => void }
        ).cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
      stopLoop();
    };
  }, [drawFrame, resizeCanvas, scheduleNextComet, startLoop, stopLoop]);

  useEffect(() => {
    const onResize = () => {
      resizeCanvas();
      drawFrame(performance.now());
    };
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      reduceRef.current = mq.matches;
      if (mq.matches) {
        stopLoop();
        cometRef.current = null;
        drawFrame(performance.now());
      } else if (visibleRef.current && ready) {
        scheduleNextComet(performance.now());
        startLoop();
      }
    };
    mq.addEventListener?.("change", onMq);
    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener?.("change", onMq);
    };
  }, [drawFrame, ready, resizeCanvas, scheduleNextComet, startLoop, stopLoop]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (visibleRef.current && ready && !reduceRef.current) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [ready, startLoop, stopLoop]);

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: MouseEvent) => {
      if (reduceRef.current) return;
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      parallaxTargetRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
    };
    const onScroll = () => {
      if (reduceRef.current) return;
      const root = rootRef.current;
      if (!root) return;
      const hh = root.getBoundingClientRect().height || 1;
      const ny = (window.scrollY || 0) / Math.max(hh, 1);
      parallaxTargetRef.current = {
        ...parallaxTargetRef.current,
        y: Math.max(-1, Math.min(1, ny * 0.6 - 0.3)),
      };
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (reduceRef.current || e.gamma == null || e.beta == null) return;
      parallaxTargetRef.current = {
        x: Math.max(-1, Math.min(1, e.gamma / 35)),
        y: Math.max(-1, Math.min(1, (e.beta - 45) / 45)),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [parallax]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      {chrome ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(168deg, #050714 0%, #0b0f1f 45%, #0a0e1c 100%)",
          }}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          opacity: ready ? opacityClamped : 0,
          transition: "opacity 0.45s ease",
        }}
      />
      {chrome ? (
        <>
          {/* Soft readability veil for hero copy */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 75% at 28% 42%, rgba(11,15,31,0.28) 0%, transparent 70%), linear-gradient(90deg, rgba(11,15,31,0.22) 0%, transparent 55%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0b0f1f] to-transparent" />
        </>
      ) : null}
    </div>
  );
}
