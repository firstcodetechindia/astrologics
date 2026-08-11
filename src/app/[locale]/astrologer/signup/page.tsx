import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { AstrologerAuthShell } from "@/components/astrologer/AstrologerAuthShell";
import { AstrologerSignupForm } from "@/components/astrologer/AstrologerSignupForm";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/astrologer/signup",
    title: hi
      ? `ज्योतिषी साइन अप | ${siteConfig.brandName}`
      : `Astrologer Sign Up | ${siteConfig.brandName}`,
    description: hi
      ? "Astrologics के साथ सत्यापित ज्योतिषी के रूप में जुड़ें।"
      : "Join Astrologics as a verified astrologer partner.",
    noIndex: true,
  });
}

export default function AstrologerSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center text-sm text-ink-muted">
          Loading…
        </div>
      }
    >
      <AstrologerAuthShell mode="signup">
        <AstrologerSignupForm />
      </AstrologerAuthShell>
    </Suspense>
  );
}
