export const ZODIAC_SLUGS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSlug = (typeof ZODIAC_SLUGS)[number];

export function zodiacIconSrc(slug: ZodiacSlug | string) {
  return `/icons/zodiac/${slug}.svg`;
}

export function zodiacSlugFromIndex(index: number): ZodiacSlug {
  return ZODIAC_SLUGS[((index % 12) + 12) % 12];
}
