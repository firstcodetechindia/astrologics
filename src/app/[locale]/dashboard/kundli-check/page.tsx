import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { DashboardKundliCheckPanel } from "@/components/dashboard/DashboardKundliCheckPanel";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/dashboard/kundli-check",
    title: hi
      ? `कुंडली जाँच | ${siteConfig.brandName}`
      : `Kundli Check | ${siteConfig.brandName}`,
    description: hi
      ? "कुंडली जाँच इतिहास और नई जाँच।"
      : "Kundli check history and new checks.",
    noIndex: true,
  });
}

export default function DashboardKundliCheckPage() {
  return <DashboardKundliCheckPanel />;
}
