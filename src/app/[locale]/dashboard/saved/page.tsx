import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { DashboardSavedPanel } from "@/components/dashboard/DashboardSavedPanel";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/dashboard/saved",
    title: hi
      ? `सेव कुंडलियाँ | ${siteConfig.brandName}`
      : `Saved Kundlis | ${siteConfig.brandName}`,
    description: hi
      ? "अकाउंट में सेव की गई कुंडलियाँ।"
      : "Kundlis saved to your account.",
    noIndex: true,
  });
}

export default function DashboardSavedPage() {
  return <DashboardSavedPanel />;
}
