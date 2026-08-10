import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ChatClient } from "@/components/chat/ChatClient";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/chat",
    title: hi
      ? `एआई गुरु — एआई ज्योतिष चैट व कुंडली प्रश्न | ${siteConfig.brandName}`
      : `AI Guru — AI Astrology Chat & Kundli Q&A | ${siteConfig.brandName}`,
    description: hi
      ? "एआई गुरु से वैदिक कुंडली पर प्रश्न पूछें — करियर, विवाह, दशा व राशिफल। AI astrology chat हिंदी व अंग्रेज़ी में।"
      : "Ask AI Guru about your Vedic kundli — career, marriage, dasha & rashifal. AI astrology chat in English & Hindi.",
    keywords: hi
      ? [
          "एआई गुरु",
          "एआई ज्योतिष",
          "एआई कुंडली चैट",
          "AI astrology",
          "AI Guru",
          "वैदिक ज्योतिष चैट",
        ]
      : [
          "AI Guru",
          "AI astrology",
          "AI astrology chat",
          "kundli AI chat",
          "Vedic AI jyotish",
          "ask astrology AI",
        ],
  });
}

export default function ChatPage() {
  return <ChatClient />;
}
