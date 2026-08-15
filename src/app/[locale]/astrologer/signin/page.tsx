import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { AstrologerAuthShell } from "@/components/astrologer/AstrologerAuthShell";
import { AstrologerSigninForm } from "@/components/astrologer/AstrologerSigninForm";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/astrologer/signin",
    title: hi
      ? `ज्योतिषी साइन इन | ${siteConfig.brandName}`
      : `Astrologer Sign In | ${siteConfig.brandName}`,
    description: hi
      ? "CosmicTalks ज्योतिषी पार्टनर पोर्टल में साइन इन करें।"
      : "Sign in to the CosmicTalks astrologer partner portal.",
    noIndex: true,
  });
}

export default function AstrologerSigninPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center text-sm text-ink-muted">
          Loading…
        </div>
      }
    >
      <AstrologerAuthShell mode="signin">
        <AstrologerSigninForm />
      </AstrologerAuthShell>
    </Suspense>
  );
}
