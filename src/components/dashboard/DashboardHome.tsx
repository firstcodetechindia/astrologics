"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MessageCircle,
  Sparkles,
  Stars,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import {
  formatPhoneDisplay,
  getSession,
  setSession,
  type AuthUser,
} from "@/lib/auth/client-auth";
import { siteConfig } from "@/lib/site-config";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const QUICK = [
  {
    href: "/kundli",
    icon: Stars,
    titleEn: "Birth kundli",
    titleHi: "जन्म कुंडली",
    descEn: "Generate a detailed chart from birth details.",
    descHi: "जन्म विवरण से विस्तृत कुंडली बनाएँ।",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    titleEn: "Ask AI Guru",
    titleHi: "एआई गुरु से पूछें",
    descEn: "Clear guidance on chart themes and timing.",
    descHi: "चार्ट विषयों व समय पर स्पष्ट मार्गदर्शन।",
  },
  {
    href: "/horoscope",
    icon: Sparkles,
    titleEn: "Daily rashifal",
    titleHi: "दैनिक राशिफल",
    descEn: "See today’s tone for your sign.",
    descHi: "आज की राशि का रुझान देखें।",
  },
  {
    href: "/panchang",
    icon: CalendarDays,
    titleEn: "Today’s panchang",
    titleHi: "आज का पंचांग",
    descEn: "Tithi, nakshatra and muhurat at a glance.",
    descHi: "तिथि, नक्षत्र व मुहूर्त एक दृष्टि में।",
  },
] as const;

export function DashboardHome() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const reduce = useHydratedReducedMotion();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setUser(session);
    if (session.isNewAtLogin) {
      setSession({ ...session, isNewAtLogin: false });
    }
  }, []);

  if (!user) return null;

  const greeting = user.isNewAtLogin
    ? hi
      ? "अकाउंट तैयार है"
      : "Account ready"
    : hi
      ? "वापस स्वागत है"
      : "Welcome back";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <DashboardPanel>
        <div className="relative overflow-hidden border-b border-saffron/10 px-5 py-6 sm:px-8 sm:py-7">
          <div
            aria-hidden
            className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(240,106,0,0.18),transparent_68%)]"
          />
          <p className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
            {siteConfig.brandName}
          </p>
          <h2 className="relative mt-2 font-display text-[1.65rem] font-semibold tracking-tight text-ink sm:text-[1.9rem]">
            {greeting}
          </h2>
          <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            {hi
              ? "ऊपर के अकाउंट मेनू से प्रोफ़ाइल, रिज़ल्ट्स और सेव कुंडलियाँ खोलें। नीचे त्वरित उपकरण हैं।"
              : "Use the account menu above for profile, results and saved kundlis. Quick tools are below."}
          </p>
          <p className="relative mt-3 text-[13px] text-ink-muted">
            {hi ? "लॉगिन:" : "Signed in as"}{" "}
            <span className="font-semibold text-ink">
              {formatPhoneDisplay(user.phone)}
            </span>
          </p>
          <div className="relative mt-5">
            <Button
              type="button"
              onClick={() => router.push("/kundli")}
              className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
            >
              {hi ? "कुंडली से शुरू करें" : "Start with Kundli"}
            </Button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-7">
          <h3 className="font-display text-lg font-semibold text-ink">
            {hi ? "त्वरित शुरूआत" : "Quick start"}
          </h3>
          <p className="mt-1 text-[13px] text-ink-muted">
            {hi
              ? "सबसे उपयोगी उपकरण एक टैप में।"
              : "The tools you’ll use most, one tap away."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {QUICK.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-saffron/12 bg-cosmic-navy p-4 transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-surface hover:shadow-[0_14px_30px_-22px_rgba(240,106,0,0.55)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-saffron-deep shadow-[inset_0_0_0_1px_rgba(240,106,0,0.12)] transition group-hover:bg-[#F06A00] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {hi ? item.titleHi : item.titleEn}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                    {hi ? item.descHi : item.descEn}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardPanel>
    </motion.div>
  );
}
