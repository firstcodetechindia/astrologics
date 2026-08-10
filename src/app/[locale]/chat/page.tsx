import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ChatClient } from "@/components/chat/ChatClient";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title:
      locale === "hi"
        ? `एआई एस्ट्रो चैट | ${siteConfig.brandName}`
        : `AI Astro Chat | ${siteConfig.brandName}`,
    description:
      locale === "hi"
        ? "अपनी वैदिक कुंडली देखें और हमारे एआई से प्रश्न पूछें।"
        : "See your Vedic kundli chart and ask our AI.",
  };
}

export default function ChatPage() {
  return <ChatClient />;
}
