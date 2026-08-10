import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ResultView } from "@/components/kundli/ResultView";

export const metadata: Metadata = {
  title: "Your Kundli Result",
  robots: { index: false, follow: false },
};

export default async function KundliResultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResultView />;
}
