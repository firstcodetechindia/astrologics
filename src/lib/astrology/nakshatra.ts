import { NAKSHATRAS, NAKSHATRA_SPAN } from "./constants";
import { norm360 } from "./math";

export function nakshatraFromLongitude(lon: number) {
  const L = norm360(lon);
  const index = Math.floor(L / NAKSHATRA_SPAN) % 27;
  const within = L % NAKSHATRA_SPAN;
  const pada = Math.floor(within / (NAKSHATRA_SPAN / 4)) + 1;
  const n = NAKSHATRAS[index];
  return {
    index,
    name: { en: n.en, hi: n.hi },
    pada,
    lord: { en: n.lord.en, hi: n.lord.hi },
  };
}
