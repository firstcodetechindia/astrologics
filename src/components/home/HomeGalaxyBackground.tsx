"use client";

/**
 * Flagship home-hero galaxy.
 * Reuses shared GalaxyHeroBackground (stars / comets / Saptarishi / parallax)
 * and adds home-only atmosphere: nebula drift, Milky Way band, edge planet.
 * PageHero / CosmicBackground elsewhere stay untouched.
 */
import { useReducedMotion } from "framer-motion";
import { GalaxyHeroBackground } from "@/components/ui/GalaxyHeroBackground";
import { cn } from "@/lib/utils";

export function HomeGalaxyBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Deep base — nebula layers sit above this */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(168deg, #050714 0%, #0b0f1f 48%, #080c18 100%)",
        }}
      />

      {/* Layer 2 — nebula drift (brand purple / magenta / teal) */}
      <div
        className={cn(
          "home-nebula home-nebula-a",
          reduce && "home-galaxy-static"
        )}
      />
      <div
        className={cn(
          "home-nebula home-nebula-b",
          reduce && "home-galaxy-static"
        )}
      />
      <div
        className={cn(
          "home-nebula home-nebula-c",
          reduce && "home-galaxy-static"
        )}
      />

      {/* Layer 3 — distant Milky Way band (clear of left copy / CTAs) */}
      <div
        className={cn(
          "home-milky-way",
          !reduce && "home-milky-way-drift",
          reduce && "home-galaxy-static"
        )}
      />

      {/* Layer 1 engine — sharp stars + Saptarishi + slow puchhal + parallax */}
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

      {/* Layer 4 — subtle edge planet (partially cropped, no labels) */}
      <div
        className={cn(
          "home-planet",
          !reduce && "home-planet-spin",
          reduce && "home-galaxy-static"
        )}
      >
        <div className="home-planet-core" />
        <div className="home-planet-ring" />
        <div className="home-planet-rim" />
      </div>
    </div>
  );
}
