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
      ? `लॉगिन | ${siteConfig.brandName}`
      : `Login | ${siteConfig.brandName}`,
    description: hi
      ? "मोबाइल OTP से CosmicGPT में लॉगिन या साइन अप करें।"
      : "Login or sign up to CosmicGPT with mobile OTP.",
    noIndex: true,
  });
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-cosmic-navy text-sm text-ink-muted">
          Loading…
        </div>
      }
    >
      <AuthClient />
    </Suspense>
  );
}
