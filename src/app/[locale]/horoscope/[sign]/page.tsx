import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HoroscopeSignView } from "@/components/horoscope/HoroscopeSignView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getHoroscopeSign,
  pickL,
} from "@/lib/horoscope/signs";
import { getHoroscopeSeo } from "@/lib/horoscope/seo-content";
import { siteConfig } from "@/lib/site-config";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";

type Props = { params: Promise<{ sign: string }> };

export function generateStaticParams() {
  return ZODIAC_SLUGS.map((sign) => ({ sign }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sign: slug } = await params;
  const locale = await getLocale();
  const sign = getHoroscopeSign(slug);
  if (!sign) return { title: siteConfig.brandName };

  const name = pickL(locale, sign.name);
  const ruler = pickL(locale, sign.ruler);
  const hi = locale === "hi";
  const title = hi
    ? `${name} राशिफल आज — दैनिक, साप्ताहिक, मासिक | लकी नंबर व रंग | ${siteConfig.brandName}`
    : `${name} Horoscope Today — Daily, Weekly, Monthly | Lucky Number & Colour | ${siteConfig.brandName}`;
  const description = hi
    ? `${name} (${sign.name.en}) राशिफल: दैनिक-साप्ताहिक-मासिक भविष्यवाणी, शासक ग्रह ${ruler}, लकी नंबर ${sign.luckyNumber}, प्रेम-करियर मार्गदर्शन, उपाय और एआई गुरु अंतर्दृष्टि।`
    : `${name} horoscope: daily, weekly & monthly forecast, ruling planet ${ruler}, lucky number ${sign.luckyNumber}, love & career guidance, remedies and AI Guru insights.`;

  const keywords = hi
    ? [
        `${name} राशिफल`,
        `${name} राशिफल आज`,
        `${sign.name.en} horoscope`,
        `दैनिक ${name} राशिफल`,
        `${name} लकी नंबर`,
        `${ruler} राशि`,
        "आज का राशिफल",
      ]
    : [
        `${name} horoscope`,
        `${name} horoscope today`,
        `${name} daily horoscope`,
        `${name} weekly horoscope`,
        `${name} monthly horoscope`,
        `${name} lucky number`,
        `${name} love horoscope`,
        `sidereal ${name} rashi`,
        "aaj ka rashifal",
      ];

  return buildPageMetadata({
    locale,
    path: `/horoscope/${slug}`,
    title,
    description,
    keywords,
    type: "article",
  });
}

export default async function HoroscopeSignPage({ params }: Props) {
  const { sign: slug } = await params;
  const locale = await getLocale();
  const sign = getHoroscopeSign(slug);
  const seo = getHoroscopeSeo(slug);
  if (!sign) notFound();

  const name = pickL(locale, sign.name);
  const url = absoluteUrl(locale, `/horoscope/${slug}`);
  const hi = locale === "hi";

  const faqs = (seo?.faqs ?? []).map((f) => ({
    q: pickL(locale, f.q),
    a: pickL(locale, f.a),
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: hi
            ? `${name} राशिफल — दैनिक, साप्ताहिक व मासिक`
            : `${name} Horoscope — Daily, Weekly & Monthly`,
          description: pickL(locale, sign.summary),
          author: {
            "@type": "Organization",
            name: siteConfig.brandName,
            url: siteConfig.siteUrl,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.brandName,
            url: siteConfig.siteUrl,
          },
          mainEntityOfPage: url,
          dateModified: new Date().toISOString().slice(0, 10),
          inLanguage: hi ? "hi-IN" : "en-IN",
          about: {
            "@type": "Thing",
            name: `${name} zodiac sign`,
          },
        }}
      />
      {faqs.length > 0 ? <JsonLd data={faqPageJsonLd(faqs)} /> : null}
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "राशिफल" : "Horoscope", path: "/horoscope" },
          { name, path: `/horoscope/${slug}` },
        ])}
      />
      <HoroscopeSignView sign={sign} />
    </>
  );
}
