import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: "en",
    path: "/admin",
    title: `Super Admin | ${siteConfig.brandName}`,
    description: "CosmicGyan Super Admin control plane.",
    noIndex: true,
  });
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
