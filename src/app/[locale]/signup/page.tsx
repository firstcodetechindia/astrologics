import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

/** Unified OTP login/signup lives on /login */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";
  redirect(`/${locale}/login${qs}`);
}
