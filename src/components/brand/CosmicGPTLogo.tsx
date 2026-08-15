/** CosmicTalks brand mark — zodiac wheel, sun, crescent, orbits. */
import Image from "next/image";

export function CosmicGPTLogo({
  className = "h-9 w-9",
  title = "CosmicTalks",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src="/cosmicgpt-logo.png"
      alt={title}
      width={44}
      height={44}
      className={className}
      priority
    />
  );
}

const LOGO_SIGNS = [
  { g: "♈", a: -90 },
  { g: "♉", a: -60 },
  { g: "♊", a: -30 },
  { g: "♋", a: 0 },
  { g: "♌", a: 30 },
  { g: "♍", a: 60 },
  { g: "♎", a: 90 },
  { g: "♏", a: 120 },
  { g: "♐", a: 150 },
  { g: "♑", a: 180 },
  { g: "♒", a: 210 },
  { g: "♓", a: 240 },
] as const;

/** Stable SVG coords across SSR/CSR (avoids float hydration mismatches). */
function r(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(cx: number, cy: number, radius: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: r(cx + Math.cos(a) * radius), y: r(cy + Math.sin(a) * radius) };
}

/** Inline SVG fallback (crisp at tiny sizes / favicon source). */
export function CosmicGPTLogoSvg({
  className = "h-9 w-9",
  title = "CosmicTalks",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id="al-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="55%" stopColor="#FF8A1F" />
          <stop offset="100%" stopColor="#F06A00" />
        </radialGradient>
        <radialGradient id="al-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF3EA" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#FF8A1F" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FF8A1F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="72" fill="url(#al-glow)" />
      <circle cx="100" cy="100" r="96" stroke="#E85D04" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="88" stroke="#F06A00" strokeWidth="1.1" />
      <circle cx="100" cy="100" r="78" stroke="#FF8A1F" strokeWidth="1" opacity="0.85" />

      {Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30 - 90;
        const p1 = polar(100, 100, 78, deg);
        const p2 = polar(100, 100, 96, deg);
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#F06A00"
            strokeWidth="1"
            opacity="0.9"
          />
        );
      })}

      {LOGO_SIGNS.map((s) => {
        const p = polar(100, 100, 87, s.a);
        return (
          <text
            key={s.g}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#F06A00"
            fontSize="13"
            fontFamily="Segoe UI Symbol, Apple Symbols, Noto Sans Symbols, sans-serif"
            fontWeight="600"
          >
            {s.g}
          </text>
        );
      })}

      {[
        [100, 4],
        [196, 100],
        [100, 196],
        [4, 100],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="#E85D04" />
      ))}

      <circle
        cx="100"
        cy="100"
        r="62"
        stroke="#FF8A1F"
        strokeWidth="0.9"
        strokeDasharray="2 3"
        opacity="0.7"
      />
      <circle cx="100" cy="100" r="48" stroke="#FF8A1F" strokeWidth="0.9" opacity="0.65" />
      <circle cx="100" cy="100" r="36" stroke="#F06A00" strokeWidth="0.85" opacity="0.7" />

      <circle cx="148" cy="80" r="3" fill="#FFB347" />
      <circle cx="148" cy="80" r="5" stroke="#F06A00" strokeWidth="0.8" />
      <circle cx="70" cy="140" r="2.6" fill="#E85D04" />
      <circle cx="125" cy="145" r="2.2" fill="#FF8A1F" />
      <circle cx="62" cy="95" r="2.4" fill="#FFB347" />

      <path
        d="M78 70c-14 8-22 24-20 40 2 18 16 32 34 34-16-2-30-16-32-34-2-16 4-32 18-40Z"
        fill="#F06A00"
      />
      <path
        d="M80 74c-11 7-17 20-16 33 1 14 11 26 25 29-12-3-22-14-23-28-1-13 3-25 14-34Z"
        fill="#FF8A1F"
        opacity="0.45"
      />

      {Array.from({ length: 16 }, (_, i) => {
        const deg = i * 22.5 - 90;
        const long = i % 2 === 0;
        const p1 = polar(100, 100, long ? 14 : 11, deg);
        const p2 = polar(100, 100, long ? 28 : 22, deg);
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#FF8A1F"
            strokeWidth={long ? 2.2 : 1.4}
            strokeLinecap="round"
          />
        );
      })}

      <circle cx="100" cy="100" r="11" fill="url(#al-sun)" />
      <circle cx="100" cy="100" r="5.5" fill="#FFF3EA" opacity="0.85" />

      <path d="M55 88 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#FFB347" />
      <path d="M138 118 l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#FF8A1F" />
    </svg>
  );
}

/** White mark for orange / dark panels — no plate background needed. */
export function CosmicGPTLogoWhite({
  className = "h-9 w-9",
  title = "CosmicTalks",
}: {
  className?: string;
  title?: string;
}) {
  const uid = "alw";
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="96" stroke="#ffffff" strokeWidth="1.4" opacity="0.95" />
      <circle cx="100" cy="100" r="88" stroke="#ffffff" strokeWidth="1.1" opacity="0.85" />
      <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="1" opacity="0.75" />

      {Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30 - 90;
        const p1 = polar(100, 100, 78, deg);
        const p2 = polar(100, 100, 96, deg);
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.85"
          />
        );
      })}

      {LOGO_SIGNS.map((s) => {
        const p = polar(100, 100, 87, s.a);
        return (
          <text
            key={s.g}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize="13"
            fontFamily="Segoe UI Symbol, Apple Symbols, Noto Sans Symbols, sans-serif"
            fontWeight="600"
          >
            {s.g}
          </text>
        );
      })}

      {[
        [100, 4],
        [196, 100],
        [100, 196],
        [4, 100],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="#ffffff" />
      ))}

      <circle
        cx="100"
        cy="100"
        r="62"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeDasharray="2 3"
        opacity="0.7"
      />
      <circle cx="100" cy="100" r="48" stroke="#ffffff" strokeWidth="0.9" opacity="0.65" />
      <circle cx="100" cy="100" r="36" stroke="#ffffff" strokeWidth="0.85" opacity="0.7" />

      <circle cx="148" cy="80" r="3" fill="#ffffff" />
      <circle cx="148" cy="80" r="5" stroke="#ffffff" strokeWidth="0.8" />
      <circle cx="70" cy="140" r="2.6" fill="#ffffff" />
      <circle cx="125" cy="145" r="2.2" fill="#ffffff" />
      <circle cx="62" cy="95" r="2.4" fill="#ffffff" />

      <path
        d="M78 70c-14 8-22 24-20 40 2 18 16 32 34 34-16-2-30-16-32-34-2-16 4-32 18-40Z"
        fill="#ffffff"
      />
      <path
        d="M80 74c-11 7-17 20-16 33 1 14 11 26 25 29-12-3-22-14-23-28-1-13 3-25 14-34Z"
        fill="#ffffff"
        opacity="0.35"
      />

      {Array.from({ length: 16 }, (_, i) => {
        const deg = i * 22.5 - 90;
        const long = i % 2 === 0;
        const p1 = polar(100, 100, long ? 14 : 11, deg);
        const p2 = polar(100, 100, long ? 28 : 22, deg);
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#ffffff"
            strokeWidth={long ? 2.2 : 1.4}
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}

      <circle cx="100" cy="100" r="11" fill={`url(#${uid}-sun)`} />
      <circle cx="100" cy="100" r="5.5" fill="#ffffff" opacity="0.95" />

      <path d="M55 88 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#ffffff" />
      <path d="M138 118 l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#ffffff" />
    </svg>
  );
}
