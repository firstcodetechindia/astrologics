import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ChatClient } from "@/components/chat/ChatClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import { CHAT_PAGE_FAQS } from "@/lib/seo/chat-page-content";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/chat",
    title: hi
      ? `जन्म कुंडली पर एआई से पूछें — मुफ्त एआई ज्योतिष चैट | ${siteConfig.brandName}`
      : `Ask AI About Your Birth Chart — Free AI Astrology Chat | ${siteConfig.brandName}`,
    description: hi
      ? "एआई गुरु से अपनी लाहिरी जन्म कुंडली पूछें — दशा, करियर, विवाह। तीन मुफ्त प्रश्न, हिंदी व अंग्रेज़ी। एआई ज्योतिषी — मानव नहीं।"
      : "Ask AI Guru about your Lahiri janam kundli — dasha, career, marriage. Three free questions, English & Hindi. AI astrologer — not a human.",
    keywords: hi
      ? [
          "एआई ज्योतिष चैट",
          "कुंडली पर एआई से पूछें",
          "एआई गुरु",
          "AI astrology chat",
          "ask AI birth chart",
        ]
      : [
          "AI astrology chat",
          "ask AI about your birth chart",
          "AI Guru",
          "free kundli AI chat",
          "Lahiri janam kundli AI",
        ],
  });
}

export default async function ChatPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const faqs = CHAT_PAGE_FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "एआई चैट" : "AI Chat", path: "/chat" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ChatClient />
      <section className="container-page pb-10">
        <h2 className="font-display text-xl font-bold text-ink">
          {hi ? "एआई गुरु — संक्षेप में" : "AI Guru — in brief"}
        </h2>
        <dl className="mt-4 space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-ui text-sm font-semibold text-ink">{f.q}</dt>
              <dd className="mt-1 font-ui text-sm leading-relaxed text-ink-muted">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 font-ui text-sm text-ink-muted">
          <Link href="/methodology" className="font-semibold text-saffron-deep hover:underline">
            {hi ? "गणना पद्धति" : "How we calculate"}
          </Link>
          {" · "}
          <Link href="/kundli" className="font-semibold text-saffron-deep hover:underline">
            {hi ? "मुफ्त कुंडली" : "Free Kundli"}
          </Link>
          {" · "}
          <Link
            href="/chat-with-astrologer"
            className="font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "मानव ज्योतिषी" : "Human astrologer"}
          </Link>
        </p>
      </section>
    </>
  );
}
