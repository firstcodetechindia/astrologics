import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/dashboard",
    title: hi
      ? `डैशबोर्ड | ${siteConfig.brandName}`
      : `Dashboard | ${siteConfig.brandName}`,
    description: hi
      ? "आपका CosmicGyan डैशबोर्ड।"
      : "Your CosmicGyan dashboard.",
    noIndex: true,
  });
}

export default function DashboardPage() {
  return <DashboardHome />;
}
