import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { AuthClient } from "@/components/auth/AuthClient";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/login",
    title: hi
      ? `लॉगिन / साइन अप | ${siteConfig.brandName}`
      : `Login / Sign up | ${siteConfig.brandName}`,
    description: hi
      ? "एआई गुरु ज्योतिष चैट जारी रखने के लिए लॉगिन या साइन अप करें।"
      : "Login or sign up to continue AI Guru astrology chat.",
    noIndex: true,
  });
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-[#faf8f5] min-h-[40vh]" />}>
      <AuthClient />
    </Suspense>
  );
}
