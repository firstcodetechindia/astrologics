import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { AstrologerDashboardClient } from "@/components/astrologer/AstrologerDashboardClient";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/astrologer/dashboard",
    title: hi
      ? `ज्योतिषी डैशबोर्ड | ${siteConfig.brandName}`
      : `Astrologer Dashboard | ${siteConfig.brandName}`,
    description: hi
      ? "आपका Astrologics पार्टनर डैशबोर्ड।"
      : "Your Astrologics partner dashboard.",
    noIndex: true,
  });
}

export default function AstrologerDashboardPage() {
  return <AstrologerDashboardClient />;
}
