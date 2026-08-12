"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  ASTROLOGER_CATEGORIES,
  ASTROLOGER_LANGUAGES,
  ASTROLOGER_SKILLS,
  clearAstrologerSession,
  displayAstrologerName,
  formatPhoneDisplay,
  getAstrologerSession,
  type AstrologerProfile,
} from "@/lib/auth/astrologer-auth";
import { siteConfig } from "@/lib/site-config";

function labelFor(
  list: readonly { id: string; en: string; hi: string }[],
  id: string,
  hi: boolean
) {
  const item = list.find((x) => x.id === id);
  if (!item) return id;
  return hi ? item.hi : item.en;
}

export function AstrologerDashboardClient() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);

  useEffect(() => {
    const session = getAstrologerSession();
    if (!session) {
      router.replace("/astrologer/signin");
      return;
    }
    setProfile(session);
  }, [router]);

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-muted">
        {hi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  const pending = profile.status === "pending";

  return (
    <div className="bg-cosmic-navy">
      <div className="container-page py-8 sm:py-10">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-saffron/15 bg-surface shadow-[0_18px_48px_-34px_rgba(42,33,24,0.45)]">
          <div className="border-b border-saffron/10 px-5 py-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                  {siteConfig.brandName} · {hi ? "पार्टनर" : "Partner"}
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {hi ? "नमस्ते" : "Welcome"}, {displayAstrologerName(profile)}
                </h1>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatPhoneDisplay(profile.phone)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearAstrologerSession();
                  router.replace("/astrologer/signin");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-saffron/25 px-3 py-2 text-xs font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
              >
                <LogOut className="h-3.5 w-3.5" />
                {hi ? "लॉग आउट" : "Logout"}
              </button>
            </div>

            <div
              className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${
                pending
                  ? "border-saffron/25 bg-cosmic-navy"
                  : "border-emerald-400/30 bg-emerald-500/15"
              }`}
            >
              {pending ? (
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-saffron-deep" />
              ) : (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              )}
              <div>
                <p className="text-sm font-semibold text-ink">
                  {pending
                    ? hi
                      ? "आवेदन समीक्षाधीन है"
                      : "Application under review"
                    : hi
                      ? "पार्टनर सत्यापित"
                      : "Partner verified"}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {pending
                    ? hi
                      ? "हमारी टीम आपके पंजीकरण की जाँच करेगी और जल्द संपर्क करेगी।"
                      : "Our team will review your registration and contact you soon."
                    : hi
                      ? "आप परामर्श उपकरण जल्द उपयोग कर सकेंगे।"
                      : "Consultation tools will be available for you soon."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-8">
            <section>
              <h2 className="text-sm font-semibold text-ink">
                {hi ? "कौशल" : "Skills"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-cosmic-purple/15 px-3 py-1 text-[12px] font-semibold text-saffron-deep"
                  >
                    {labelFor(ASTROLOGER_SKILLS, id, hi)}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-ink">
                {hi ? "भाषाएँ" : "Languages"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.languages.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-saffron/20 px-3 py-1 text-[12px] font-semibold text-ink"
                  >
                    {labelFor(ASTROLOGER_LANGUAGES, id, hi)}
                  </span>
                ))}
              </div>
            </section>
            {profile.categories.length ? (
              <section>
                <h2 className="text-sm font-semibold text-ink">
                  {hi ? "श्रेणियाँ" : "Categories"}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.categories.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-saffron/20 px-3 py-1 text-[12px] font-semibold text-ink"
                    >
                      {labelFor(ASTROLOGER_CATEGORIES, id, hi)}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
              >
                {hi ? "मुख्य साइट पर जाएँ" : "Go to main site"}
              </Button>
              <p className="mt-3 text-[12px] text-ink-muted">
                <Link href="/contact" className="font-semibold text-saffron-deep hover:underline">
                  {hi ? "सहायता से संपर्क करें" : "Contact support"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
