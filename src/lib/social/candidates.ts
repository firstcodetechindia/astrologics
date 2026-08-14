import { computeTodayPanchang } from "@/lib/astrology/today-panchang";
import { getPosts } from "@/lib/blog";
import { HOROSCOPE_SIGNS, pickL } from "@/lib/horoscope/signs";
import { siteConfig } from "@/lib/site-config";
import { hinduFestivalOnDate } from "@/lib/social/hindu-festivals";

export type CandidateKind = "daily_horoscope" | "blog_promo" | "festival_muhurta";

export type SocialCandidate = {
  kind: CandidateKind;
  locale: "en" | "hi";
  body: string;
};

/**
 * Civil-calendar greetings only (Gregorian-fixed national days).
 * Hindu tithi festivals live in hinduFestivalOnDate() — Panchang tithi+paksha+masa.
 */
const CIVIL: { md: string; en: string; hi: string }[] = [
  { md: "01-26", en: "Republic Day", hi: "गणतंत्र दिवस" },
  { md: "08-15", en: "Independence Day", hi: "स्वतंत्रता दिवस" },
  { md: "10-02", en: "Gandhi Jayanti", hi: "गाँधी जयंती" },
];

export function buildSocialCandidates(locale: "en" | "hi" = "en"): SocialCandidate[] {
  const hi = locale === "hi";
  const today = new Date();
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);
  const md = ymd.slice(5);
  const sign = HOROSCOPE_SIGNS[today.getUTCDate() % HOROSCOPE_SIGNS.length]!;
  const lead = pickL(locale, sign.periodLead.daily);
  const outlook = pickL(locale, sign.sections.outlook);
  const posts = getPosts(locale);
  const blog = posts[0];
  const panchang = computeTodayPanchang({ date: ymd, timeZone: "Asia/Kolkata" });
  const tithi = pickL(locale, panchang.limbs.tithi.name);
  const nak = pickL(locale, panchang.limbs.nakshatra.name as { en: string; hi: string });
  const civil = CIVIL.find((c) => c.md === md);
  const hindu = hinduFestivalOnDate(ymd, locale);
  let festivalLine: string;
  if (hindu.festival) {
    festivalLine = hi
      ? `आज ${hindu.festival.hi} — ${hindu.masa.hi} ${panchang.limbs.paksha.hi} ${tithi}। गणना पंचांग से, ग्रेगोरियन तारीख से नहीं।`
      : `Today is ${hindu.festival.en} — ${hindu.masa.en} ${panchang.limbs.paksha.en} ${tithi}, from the Panchang (tithi + paksha + masa), not a civil calendar date.`;
  } else if (civil) {
    festivalLine = hi
      ? `आज ${civil.hi} — शांत चिंतन और परिवार के साथ समय।`
      : `Today marks ${civil.en} — a pause for reflection, not a hard prediction.`;
  } else {
    festivalLine = hi
      ? `आज ${hindu.masa.hi}, तिथि ${tithi}, नक्षत्र ${nak}। अभिजीत मुहूर्त पंचांग पर देखें।`
      : `Today’s masa is ${hindu.masa.en}, tithi ${tithi}, nakshatra ${nak}. Check Abhijit muhurta on the Panchang — this is timing, not a verdict.`;
  }

  return [
    {
      kind: "daily_horoscope",
      locale,
      body: hi
        ? `${sign.name.hi} राशिफल · ${ymd}\n${lead}\n${outlook}\nगणना आधारित चिंतन — चिकित्सा/कानूनी सलाह नहीं। ${siteConfig.siteUrl}/${locale}/horoscope/${sign.slug}`
        : `${sign.name.en} daily · ${ymd}\n${lead}\n${outlook}\nCalculated reflection — not medical or legal advice. ${siteConfig.siteUrl}/${locale}/horoscope/${sign.slug}`,
    },
    {
      kind: "blog_promo",
      locale,
      body: blog
        ? hi
          ? `पढ़ें: ${blog.title}\n${blog.description}\n${siteConfig.siteUrl}/hi/blog/${blog.slug}`
          : `Read: ${blog.title}\n${blog.description}\n${siteConfig.siteUrl}/en/blog/${blog.slug}`
        : hi
          ? `CosmicGyan ब्लॉग पर कुंडली समझाइए। ${siteConfig.siteUrl}/hi/blog`
          : `New on the CosmicGyan blog — calculated Kundli, not guesswork. ${siteConfig.siteUrl}/en/blog`,
    },
    {
      kind: "festival_muhurta",
      locale,
      body: `${festivalLine}\n${siteConfig.siteUrl}/${locale}/panchang`,
    },
  ];
}
