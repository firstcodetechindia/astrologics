/**
 * Central Vedic calculation settings — single source for all modules.
 * Swiss Ephemeris is intentionally NOT bundled: AGPL/GPL licensing is
 * incompatible with a proprietary commercial product without a separate
 * commercial Swiss Ephemeris license. astronomy-engine remains the engine;
 * this config + ephemeris abstraction are the upgrade seam.
 *
 * Silent settings (ayanamsa / node / houses / sunrise day / IANA TZ) are
 * locked here and documented in silent-settings.ts + Methodology.
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
    "astronomy-engine (VSOP87/ELP-derived). Swiss Ephemeris deferred (licensing). Multi-ayanamsa/house prefs supported on top of this engine.",
  /**
   * Birth civil time → UTC via IANA tz database at the birth instant
   * (runtime Intl / OS tzdata). India places resolve to Asia/Kolkata.
   * Fixed-offset minutes remain a fallback when IANA resolution fails.
   */
  timezoneMode: "iana_historical" as const,
  /** Vedic civil day for Panchang/muhurta: actual sunrise, not midnight. */
  dayBoundary: "sunrise" as const,
  houseSystemByChart: {
    d1: "whole_sign" as const,
    kp: "placidus" as const,
    bhavChalit: "sripati" as const,
  },
} as const;

export type AstroConfig = typeof ASTRO_CONFIG;
