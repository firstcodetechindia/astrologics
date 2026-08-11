import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { DashboardResultsPanel } from "@/components/dashboard/DashboardResultsPanel";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/dashboard/results",
    title: hi
      ? `रिज़ल्ट्स | ${siteConfig.brandName}`
      : `Results | ${siteConfig.brandName}`,
    description: hi
      ? "याद रखे गए ज्योतिष रिज़ल्ट्स।"
      : "Remembered astrology results.",
    noIndex: true,
  });
}

export default function DashboardResultsPage() {
  return <DashboardResultsPanel />;
}
