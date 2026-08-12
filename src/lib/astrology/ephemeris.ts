/**
 * Ephemeris abstraction seam.
 * Current implementation: astronomy-engine (see planets.ts).
 * Future: Swiss Ephemeris behind the same interface once a commercial
 * license / AGPL-compatible deployment path exists.
 */
import { ASTRO_CONFIG } from "./config";

export type EphemerisEngineId = "astronomy-engine" | "swiss-ephemeris";

export function activeEphemerisEngine(): EphemerisEngineId {
  return ASTRO_CONFIG.ephemerisEngine;
}

export function ephemerisCapabilityNotes(): string[] {
  return [
    `Engine: ${ASTRO_CONFIG.ephemerisEngine}`,
    `Ayanamsa: ${ASTRO_CONFIG.ayanamsaLabel}`,
    `Nodes: ${ASTRO_CONFIG.nodeMode}`,
    `Timezone: ${ASTRO_CONFIG.timezoneMode}`,
    `Day boundary: ${ASTRO_CONFIG.dayBoundary}`,
    "Swiss Ephemeris not bundled (AGPL/GPL licensing constraint for this product).",
  ];
}
