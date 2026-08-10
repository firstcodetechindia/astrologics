import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HoroscopeSignView } from "@/components/horoscope/HoroscopeSignView";
import {
  getHoroscopeSign,
  HOROSCOPE_SIGNS,
  pickL,
} from "@/lib/horoscope/signs";
import { siteConfig } from "@/lib/site-config";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";

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
  const title =
    locale === "hi"
      ? `${name} राशिफल — दैनिक, साप्ताहिक व मासिक | ${siteConfig.brandName}`
      : `${name} Horoscope — Daily, Weekly & Monthly | ${siteConfig.brandName}`;
  const description =
    locale === "hi"
      ? `${name} का दैनिक, साप्ताहिक और मासिक राशिफल — लकी नंबर, रंग, शासक ग्रह और मार्गदर्शन।`
      : `${name} daily, weekly and monthly horoscope — lucky number, colour, ruling planet and guidance.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/horoscope/${slug}`,
      languages: {
        en: `${siteConfig.siteUrl}/en/horoscope/${slug}`,
        hi: `${siteConfig.siteUrl}/hi/horoscope/${slug}`,
      },
    },
  };
}

export default async function HoroscopeSignPage({ params }: Props) {
  const { sign: slug } = await params;
  const sign = getHoroscopeSign(slug);
  if (!sign) notFound();

  // Touch list so tree-shaking keeps full catalog available to client switcher data path
  void HOROSCOPE_SIGNS.length;

  return <HoroscopeSignView sign={sign} />;
}
