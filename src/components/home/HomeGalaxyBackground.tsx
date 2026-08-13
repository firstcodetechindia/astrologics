"use client";

/**
 * Flagship home-hero galaxy.
 * Reuses shared GalaxyHeroBackground (stars / comets / Saptarishi / parallax)
 * and adds home-only atmosphere: nebula drift, Milky Way band, edge planet.
 * Reduced-motion is CSS (`prefers-reduced-motion`) — never a JS className branch.
 */
import { GalaxyHeroBackground } from "@/components/ui/GalaxyHeroBackground";

export function HomeGalaxyBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(168deg, #050714 0%, #0b0f1f 48%, #080c18 100%)",
        }}
      />

      <div className="home-nebula home-nebula-a" />
      <div className="home-nebula home-nebula-b" />
      <div className="home-nebula home-nebula-c" />

      <div className="home-milky-way home-milky-way-drift" />

      <GalaxyHeroBackground
        variant="home"
        parallax
        parallaxStrength={0.85}
        starDensity={1.2}
        intensity={1}
        opacity={0.55}
        chrome={false}
        className="z-[2]"
      />

      <div className="home-planet home-planet-spin">
        <div className="home-planet-core" />
        <div className="home-planet-ring" />
        <div className="home-planet-rim" />
      </div>
    </div>
  );
}
