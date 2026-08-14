/**
 * Smaller follow-ups that must not be forgotten.
 * Human-readable copy: docs/follow-ups.md
 */
export const FOLLOW_UPS = [
  {
    id: "social-festival-panchang",
    priority: "P1" as const,
    blocksLive: false,
    title: "Hindu festival dates use the Panchang engine",
    detail:
      "Closed 2026-08-14: tithi+paksha+masa via lunarMasaAt / hinduFestivalOnDate. Live Graph posting is still blocked by sandbox Meta credentials, not by a second date path.",
  },
  {
    id: "social-live-graph",
    priority: "P0" as const,
    blocksLive: true,
    title: "Do not enable live Graph posting on sandbox Meta tokens",
    detail:
      "meta_social vault secrets are still sandbox_meta_*. Festival dates are reconciled; live Page posting is a separate credential step.",
  },
] as const;
