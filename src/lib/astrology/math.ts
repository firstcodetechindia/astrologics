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
  KP_FROM_LAHIRI_OFFSET_ARCSEC,
  kpAyanamsaFromDate,
  lahiriLonToKp,
  LAHIRI_SE_ALIGNMENT_ARCSEC,
  lahiriAyanamsaFromDate,
  lahiriAyanamsaPolynomialFallback,
  trueChitrapakshaAyanamsa,
} from "./ayanamsa";
