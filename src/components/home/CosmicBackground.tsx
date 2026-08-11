/** Soft zodiac plate atmosphere for the hero — saffron warmth + maroon depth */
export function CosmicBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.28] sm:opacity-[0.34]"
        style={{
          backgroundImage: "url(/images/Zodiac.jpg)",
          backgroundRepeat: "repeat",
          backgroundSize: "520px auto",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf6]/70 via-[#fff3ea]/75 to-[var(--ivory)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(240,106,0,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_25%,rgba(107,28,28,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,179,71,0.12),transparent_50%)]" />
    </div>
  );
}
