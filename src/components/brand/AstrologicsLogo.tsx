/** Astrologics brand mark — zodiac wheel, sun, crescent, orbits. */
export function AstrologicsLogo({
  className = "h-9 w-9",
  title = "Astrologics",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      src="/astrologics-logo.png"
      alt={title}
      width={36}
      height={36}
      className={className}
      decoding="async"
    />
  );
}

/** Inline SVG fallback (crisp at tiny sizes / favicon source). */
export function AstrologicsLogoSvg({
  className = "h-9 w-9",
  title = "Astrologics",
}: {
  className?: string;
  title?: string;
}) {
  const signs = [
    { g: "♈", a: -90 }, // Aries top
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
  ];

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

      {/* Soft inner glow — still transparent outside */}
      <circle cx="100" cy="100" r="72" fill="url(#al-glow)" />

      {/* Outer rings */}
      <circle cx="100" cy="100" r="96" stroke="#E85D04" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="88" stroke="#F06A00" strokeWidth="1.1" />
      <circle cx="100" cy="100" r="78" stroke="#FF8A1F" strokeWidth="1" opacity="0.85" />

      {/* 12 segment dividers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x1 = 100 + Math.cos(a) * 78;
        const y1 = 100 + Math.sin(a) * 78;
        const x2 = 100 + Math.cos(a) * 96;
        const y2 = 100 + Math.sin(a) * 96;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#F06A00"
            strokeWidth="1"
            opacity="0.9"
          />
        );
      })}

      {/* Real traditional zodiac glyphs */}
      {signs.map((s) => {
        const a = (s.a * Math.PI) / 180;
        const x = 100 + Math.cos(a) * 87;
        const y = 100 + Math.sin(a) * 87;
        return (
          <text
            key={s.g}
            x={x}
            y={y}
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

      {/* Cardinal beads */}
      {[
        [100, 4],
        [196, 100],
        [100, 196],
        [4, 100],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="#E85D04" />
      ))}

      {/* Inner orbits */}
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

      {/* Orbit planets */}
      <circle cx="148" cy="80" r="3" fill="#FFB347" />
      <circle cx="148" cy="80" r="5" stroke="#F06A00" strokeWidth="0.8" />
      <circle cx="70" cy="140" r="2.6" fill="#E85D04" />
      <circle cx="125" cy="145" r="2.2" fill="#FF8A1F" />
      <circle cx="62" cy="95" r="2.4" fill="#FFB347" />

      {/* Crescent moon */}
      <path
        d="M78 70c-14 8-22 24-20 40 2 18 16 32 34 34-16-2-30-16-32-34-2-16 4-32 18-40Z"
        fill="#F06A00"
      />
      <path
        d="M80 74c-11 7-17 20-16 33 1 14 11 26 25 29-12-3-22-14-23-28-1-13 3-25 14-34Z"
        fill="#FF8A1F"
        opacity="0.45"
      />

      {/* Sun rays */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = ((i * 22.5 - 90) * Math.PI) / 180;
        const long = i % 2 === 0;
        const r1 = long ? 14 : 11;
        const r2 = long ? 28 : 22;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * r1}
            y1={100 + Math.sin(a) * r1}
            x2={100 + Math.cos(a) * r2}
            y2={100 + Math.sin(a) * r2}
            stroke="#FF8A1F"
            strokeWidth={long ? 2.2 : 1.4}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sun core */}
      <circle cx="100" cy="100" r="11" fill="url(#al-sun)" />
      <circle cx="100" cy="100" r="5.5" fill="#FFF3EA" opacity="0.85" />

      {/* Tiny sparkles */}
      <path d="M55 88 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#FFB347" />
      <path d="M138 118 l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#FF8A1F" />
    </svg>
  );
}
