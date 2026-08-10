/** Soft zodiac plate atmosphere for the hero */
export function CosmicBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.32] sm:opacity-[0.38]"
        style={{
          backgroundImage: "url(/images/Zodiac.jpg)",
          backgroundRepeat: "repeat",
          backgroundSize: "480px auto",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/60 to-[#faf7f4]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,138,31,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,179,71,0.10),transparent_42%)]" />
    </div>
  );
}
