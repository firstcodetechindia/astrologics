/** Public math API — re-exports core + Lahiri ayanamsa. */
export {
  angleDelta,
  angleDistance,
  dateToJulianDay,
  degreeInSign,
  norm360,
  signIndexFromLongitude,
  toDMS,
} from "./math-core";

export {
  formatAyanamsa,
  LAHIRI_SE_ALIGNMENT_ARCSEC,
  lahiriAyanamsaFromDate,
  lahiriAyanamsaPolynomialFallback,
  trueChitrapakshaAyanamsa,
} from "./ayanamsa";
