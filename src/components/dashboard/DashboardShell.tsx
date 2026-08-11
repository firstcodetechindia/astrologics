"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { DashboardAccountNav } from "@/components/dashboard/DashboardAccountNav";
import { getSession, type AuthUser } from "@/lib/auth/client-auth";

export function DashboardShell({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login?next=/dashboard");
      return;
    }
    setUser(session);
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center text-sm text-ink-muted">
        {hi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  return (
    <div className="relative min-h-[60vh] bg-[#faf8f5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(240,106,0,0.09) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative space-y-5 py-6 sm:space-y-6 sm:py-8">
        <header className="mx-auto max-w-5xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
            {hi ? "मेरा अकाउंट" : "My account"}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.85rem]">
            {hi ? "आपका व्यक्तिगत स्पेस" : "Your personal space"}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
            {hi
              ? "प्रोफ़ाइल, याद रखे गए रिज़ल्ट्स, कुंडली जाँच और सेव की गई कुंडलियाँ — सब एक जगह।"
              : "Profile, remembered results, kundli checks and saved charts — all in one place."}
          </p>
        </header>

        <div className="mx-auto max-w-5xl">
          <DashboardAccountNav />
        </div>

        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
