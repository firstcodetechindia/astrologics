import type { Metadata } from "next";
import { PayConsultationClient } from "@/components/billing/PayConsultationClient";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: "en",
    path: "/pay",
    title: `Pay | ${siteConfig.brandName}`,
    description: "Sandbox consultation checkout.",
    noIndex: true,
  });
}

export default function PayPage() {
  return <PayConsultationClient />;
}
