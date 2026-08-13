"use client";

const STARS = [
  [8, 12], [18, 28], [26, 8], [34, 42], [44, 18], [52, 55], [62, 14],
  [71, 38], [78, 22], [86, 48], [12, 62], [22, 78], [38, 70], [58, 82],
  [68, 66], [82, 74], [92, 32], [48, 32], [15, 45], [75, 10],
] as const;

/** Twinkle is always in className; `@media (prefers-reduced-motion)` stops it. */
export function CosmicBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_15%_-10%,rgba(108,60,255,0.32),transparent_55%),radial-gradient(ellipse_60%_45%_at_90%_0%,rgba(255,92,168,0.18),transparent_50%),radial-gradient(ellipse_50%_40%_at_60%_100%,rgba(255,138,61,0.12),transparent_55%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.55)_0.6px,transparent_0.6px)] [background-size:36px_36px]" />
      {STARS.map(([x, y], i) => (
        <span
          key={`${x}-${y}`}
          className="cosmic-twinkle absolute h-0.5 w-0.5 rounded-full bg-surface/85"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${(i % 7) * 0.35}s`,
          }}
        />
      ))}
      <svg
        className="absolute -left-8 top-8 h-48 w-48 opacity-30 sm:h-64 sm:w-64"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="70" stroke="rgba(108,60,255,0.35)" strokeWidth="1" />
        <circle cx="100" cy="100" r="48" stroke="rgba(255,92,168,0.2)" strokeWidth="0.8" strokeDasharray="3 5" />
        <ellipse cx="100" cy="100" rx="90" ry="28" stroke="rgba(255,200,87,0.18)" strokeWidth="0.8" transform="rotate(-18 100 100)" />
      </svg>
    </div>
  );
}
