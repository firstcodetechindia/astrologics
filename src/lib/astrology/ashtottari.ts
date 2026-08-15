/**
 * Ashtottari dasha — 108-year cycle (Ketu excluded).
 * Applicability + period table are implemented. Nakshatra-lordship for the
 * 28-star (Abhijit-inclusive) start sequence is not in the formula sheet;
 * do not invent a lordship table until a BPHS/JHora source is attached.
 */

export const ASHTOTTARI_CYCLE_YEARS = 108;

export const ASHTOTTARI_YEARS: Record<string, number> = {
  sun: 6,
  moon: 15,
  mars: 8,
  mercury: 17,
  saturn: 10,
  jupiter: 19,
  rahu: 12,
  venus: 21,
};

/** Sequence after the birth-nakshatra lord (Ketu omitted). */
export const ASHTOTTARI_ORDER = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "saturn",
  "jupiter",
  "rahu",
  "venus",
] as const;

function isKendraOrTrikona(house: number) {
  return [1, 4, 5, 7, 9, 10].includes(house);
}

export function ashtottariApplies(opts: {
  /** House of Rahu counted from the sign occupied by the Lagna-lord (1–12). */
  rahuHouseFromLagnaLord: number;
  isDayBirth: boolean;
  /** true = Shukla Paksha (waxing), false = Krishna Paksha (waning). */
  waxingMoon: boolean;
}): { applies: boolean; byRahu: boolean; byPaksha: boolean } {
  const byRahu = isKendraOrTrikona(opts.rahuHouseFromLagnaLord);
  const byPaksha =
    (opts.isDayBirth && !opts.waxingMoon) ||
    (!opts.isDayBirth && opts.waxingMoon);
  return { applies: byRahu || byPaksha, byRahu, byPaksha };
}
