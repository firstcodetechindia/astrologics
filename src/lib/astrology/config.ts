/**
 * Central Vedic calculation settings — single source for all modules.
 * Swiss Ephemeris is intentionally NOT bundled: AGPL/GPL licensing is
 * incompatible with a proprietary commercial product without a separate
 * commercial Swiss Ephemeris license. astronomy-engine remains the engine;
 * this config + ephemeris abstraction are the upgrade seam.
 */
export const ASTRO_CONFIG = {
  zodiac: "sidereal" as const,
  ayanamsa: "lahiri" as const,
  ayanamsaLabel:
    "Lahiri / Chitrapaksha (Spica−180° + SE-alignment; astronomy-engine)",
  houseSystem: "whole_sign" as const,
  /**
   * Default node: mean (Meeus).
   * True node via Moon-node interpolation is EXPERIMENTAL — not bit-exact vs SE true node.
   */
  nodeMode: "mean" as "mean" | "true",
  trueNodeStatus: "experimental" as const,
  ephemerisEngine: "astronomy-engine" as const,
  ephemerisNote:
    "astronomy-engine (VSOP87/ELP-derived). Swiss Ephemeris deferred (licensing).",
  /**
   * Birth time uses a fixed civil UTC offset (minutes), not live IANA DST
   * at the birth instant. India (IST) is safe; UK/US historical DST requires
   * the correct offset to be supplied with the place data.
   */
  timezoneMode: "fixed_offset_minutes" as const,
} as const;

export type AstroConfig = typeof ASTRO_CONFIG;
