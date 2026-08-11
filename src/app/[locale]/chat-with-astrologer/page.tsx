import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChatAstrologersClient } from "@/components/talk/ChatAstrologersClient";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/chat-with-astrologer",
    title: hi
      ? `ज्योतिषी से चैट करें | ${siteConfig.brandName}`
      : `Chat with Astrologer | ${siteConfig.brandName}`,
    description: hi
      ? "भारत के सत्यापित ज्योतिषियों से ऑनलाइन चैट करें — प्रेम, विवाह, करियर और अधिक।"
      : "Chat online with verified Indian astrologers for love, marriage, career, and more. First chat free on select experts.",
    keywords: hi
      ? [
          "ज्योतिषी से चैट",
          "ऑनलाइन ज्योतिष",
          "टॉक टू एस्ट्रोलॉजर",
          "प्रेम ज्योतिष",
          "विवाह ज्योतिष",
        ]
      : [
          "chat with astrologer",
          "talk to astrologer",
          "online astrology chat",
          "verified astrologers",
          "first chat free",
        ],
  });
}

export default async function ChatWithAstrologerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_40%,#fff3ea_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(240,106,0,0.10), transparent 38%), radial-gradient(circle at 92% 12%, rgba(240,106,0,0.07), transparent 32%)",
        }}
      />
      <div className="container-page relative py-8 sm:py-10">
        <ChatAstrologersClient locale={locale} />
      </div>
    </main>
  );
}
