import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { DashboardProfilePanel } from "@/components/dashboard/DashboardProfilePanel";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/dashboard/profile",
    title: hi
      ? `प्रोफ़ाइल | ${siteConfig.brandName}`
      : `Profile | ${siteConfig.brandName}`,
    description: hi
      ? "अपनी Astrologics प्रोफ़ाइल अपडेट करें।"
      : "Update your Astrologics profile.",
    noIndex: true,
  });
}

export default function DashboardProfilePage() {
  return <DashboardProfilePanel />;
}
