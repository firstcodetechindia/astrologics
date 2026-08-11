"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bookmark,
  ClipboardCheck,
  History,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS: {
  href: "/dashboard" | "/dashboard/profile" | "/dashboard/results" | "/dashboard/kundli-check" | "/dashboard/saved";
  icon: typeof LayoutDashboard;
  en: string;
  hi: string;
  exact?: boolean;
}[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    en: "Dashboard",
    hi: "डैशबोर्ड",
    exact: true,
  },
  {
    href: "/dashboard/profile",
    icon: UserRound,
    en: "Profile",
    hi: "प्रोफ़ाइल",
  },
  {
    href: "/dashboard/results",
    icon: History,
    en: "Results",
    hi: "रिज़ल्ट्स",
  },
  {
    href: "/dashboard/kundli-check",
    icon: ClipboardCheck,
    en: "Kundli Check",
    hi: "कुंडली जाँच",
  },
  {
    href: "/dashboard/saved",
    icon: Bookmark,
    en: "Saved Kundlis",
    hi: "सेव कुंडलियाँ",
  },
];

export function DashboardAccountNav() {
  const locale = useLocale();
  const hi = locale === "hi";
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  return (
    <div className="relative">
      {/* Ambient glow behind the rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -inset-y-3 hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(240,106,0,0.1),transparent_70%)] sm:block"
      />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-[#f0d4b8]/90 bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f0_100%)] shadow-[0_18px_40px_-28px_rgba(78,48,20,0.45)]">
        {/* Top hairline accent */}
        <div
          aria-hidden
          className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(240,106,0,0.45),rgba(255,179,71,0.7),rgba(240,106,0,0.45),transparent)]"
        />

        <div className="relative px-2 py-2 sm:px-3 sm:py-2.5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-[#fffaf6] to-transparent sm:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-7 bg-gradient-to-l from-[#fffaf6] to-transparent sm:hidden"
          />

          <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav
              aria-label={hi ? "अकाउंट मेनू" : "Account menu"}
              className="flex w-max min-w-full items-stretch justify-start gap-1 sm:justify-between sm:gap-1.5"
            >
              {TABS.map((tab) => {
                const active = tab.exact
                  ? pathname === tab.href
                  : pathname === tab.href ||
                    pathname.startsWith(`${tab.href}/`);
                const Icon = tab.icon;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    ref={active ? activeRef : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex min-w-[5.75rem] flex-1 flex-col items-center gap-1.5 rounded-[1.05rem] px-3 py-2.5 transition-colors sm:min-w-0 sm:px-2.5 sm:py-3 md:px-3",
                      !active && "hover:bg-white/70"
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId={reduce ? undefined : "dashboard-tab-glow"}
                        aria-hidden
                        className="absolute inset-0 rounded-[1.05rem] bg-[linear-gradient(145deg,#ff8a1f_0%,#f06a00_55%,#e85d04_100%)] shadow-[0_12px_28px_-14px_rgba(240,106,0,0.95),inset_0_1px_0_rgba(255,255,255,0.28)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}

                    <span
                      className={cn(
                        "relative z-[1] inline-flex h-9 w-9 items-center justify-center rounded-full transition duration-300",
                        active
                          ? "bg-white/18 text-white ring-1 ring-white/35"
                          : "bg-[#fff1e6] text-saffron-deep ring-1 ring-saffron/15 group-hover:bg-white group-hover:ring-saffron/30"
                      )}
                    >
                      <Icon className="h-[17px] w-[17px]" strokeWidth={2.05} />
                    </span>

                    <span
                      className={cn(
                        "relative z-[1] whitespace-nowrap text-[11.5px] font-semibold tracking-[0.01em] sm:text-[12.5px]",
                        active
                          ? "text-white"
                          : "text-[#5c4a3a] group-hover:text-saffron-deep"
                      )}
                    >
                      {hi ? tab.hi : tab.en}
                    </span>

                    {active ? (
                      <motion.span
                        layoutId={reduce ? undefined : "dashboard-tab-dot"}
                        aria-hidden
                        className="relative z-[1] h-1 w-1 rounded-full bg-[#ffe0b8]"
                      />
                    ) : (
                      <span aria-hidden className="relative z-[1] h-1 w-1" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
