"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Home,
  Menu,
  MessageCircle,
  Orbit,
  Sparkles,
  Sun,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function pathMatches(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

type DirectTab = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type MoreLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Mobile: Kundli · Horoscope · Chat · Calculators · More */
export function MobileBottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const hi = locale === "hi";
  const reduceMotion = useReducedMotion();
  const [moreOpen, setMoreOpen] = useState(false);

  const kundliActive = pathMatches(pathname, ["/kundli"]);
  const horoscopeActive = pathMatches(pathname, ["/horoscope"]);
  const chatActive = pathMatches(pathname, ["/chat"]);
  const calcActive = pathMatches(pathname, ["/calculators"]);
  const moreActive = pathMatches(pathname, [
    "/features",
    "/services",
    "/panchang",
    "/numerology",
    "/vastu",
    "/learn",
    "/blog",
    "/pricing",
    "/about",
    "/contact",
    "/faq",
  ]);

  const leftTabs: DirectTab[] = [
    {
      href: "/kundli",
      label: hi ? "कुंडली" : "Kundli",
      icon: Orbit,
      active: kundliActive,
    },
    {
      href: "/horoscope",
      label: hi ? "राशिफल" : "Horoscope",
      icon: Sun,
      active: horoscopeActive,
    },
  ];

  const rightTabs: DirectTab[] = [
    {
      href: "/calculators",
      label: hi ? "कैलक" : "Calcs",
      icon: Calculator,
      active: calcActive,
    },
  ];

  const moreLinks: MoreLink[] = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/features", label: t("features"), icon: Sparkles },
    { href: "/panchang", label: hi ? "पंचांग" : "Panchang", icon: Sun },
    {
      href: "/numerology",
      label: hi ? "अंक ज्योतिष" : "Numerology",
      icon: Calculator,
    },
    { href: "/vastu", label: hi ? "वास्तु" : "Vastu", icon: Wrench },
    { href: "/learn", label: t("learn"), icon: BookOpen },
    { href: "/pricing", label: t("pricing"), icon: Sparkles },
    { href: "/blog", label: t("blog"), icon: BookOpen },
  ];

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {moreOpen ? (
          <motion.div
            key="mobile-more-sheet"
            className="fixed inset-0 z-[60]"
            data-mobile-sheet="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          >
            <button
              type="button"
              aria-label={hi ? "मेनू बंद करें" : "Close menu"}
              className="absolute inset-0 bg-[#0B0F1F]/72"
              onClick={() => setMoreOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={hi ? "और मेनू" : "More menu"}
              className="absolute inset-x-0 bottom-0 z-10 flex max-h-[min(72vh,560px)] flex-col rounded-t-[1.35rem] border border-white/10 border-b-0 bg-[#12172E] shadow-[0_-18px_50px_-20px_rgba(0,0,0,0.65)]"
              style={{
                paddingBottom: "calc(4.85rem + env(safe-area-inset-bottom))",
              }}
              initial={reduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 340,
                mass: 0.8,
              }}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-3">
                <div className="min-w-0">
                  <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/20" />
                  <p className="font-ui text-sm font-bold text-white">
                    {hi ? "और विकल्प" : "More"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-ink-muted hover:bg-white/[0.06] hover:text-white"
                  aria-label={hi ? "बंद करें" : "Close"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <ul className="space-y-1">
                  {moreLinks.map((link) => {
                    const Icon = link.icon;
                    const active =
                      link.href === "/"
                        ? pathname === "/" || pathname === ""
                        : pathMatches(pathname, [link.href]);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 font-ui text-[14px] font-semibold",
                            active
                              ? "bg-[linear-gradient(90deg,#6C3CFF,#FF8A3D)] text-white"
                              : "text-white/90 hover:bg-white/[0.06]"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" strokeWidth={2.1} />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 border-t border-white/10 px-1 pt-3">
                  <Link
                    href="/features"
                    onClick={() => setMoreOpen(false)}
                    className="font-ui text-[13px] font-semibold text-cosmic-gold hover:underline"
                  >
                    {hi ? "सभी विशेषताएँ देखें →" : "View all features →"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-[70] w-full max-w-[100vw] border-t border-white/10 bg-[#0B0F1F]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={hi ? "मोबाइल मेनू" : "Mobile menu"}
      >
        <div className="relative mx-auto grid h-[3.85rem] max-w-lg grid-cols-5 px-1">
          {leftTabs.map((item) => (
            <DirectTabLink key={item.href} item={item} />
          ))}

          <Link
            href="/chat"
            onClick={() => setMoreOpen(false)}
            className="relative flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 pb-1.5 pt-1"
            aria-current={chatActive ? "page" : undefined}
            aria-label={hi ? "एआई चैट" : "AI Chat"}
          >
            <span className="absolute left-1/2 top-0 z-20 flex size-[3.05rem] -translate-x-1/2 -translate-y-[54%] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C3CFF,#FF8A3D)] shadow-[0_8px_20px_-6px_rgba(108,60,255,0.75)] ring-[5px] ring-[#0B0F1F]">
              <MessageCircle
                className="relative h-[1.25rem] w-[1.25rem] text-white"
                strokeWidth={2.25}
              />
            </span>
            <span className="h-8 w-8 shrink-0 opacity-0" aria-hidden />
            <span
              className={cn(
                "max-w-full truncate text-[10px] font-semibold leading-none",
                chatActive ? "text-cosmic-gold" : "text-ink-muted"
              )}
            >
              {hi ? "चैट" : "Chat"}
            </span>
          </Link>

          {rightTabs.map((item) => (
            <DirectTabLink key={item.href} item={item} />
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-label={hi ? "और मेनू" : "More menu"}
            className={cn(
              "flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 pb-1.5 pt-1",
              moreOpen || moreActive ? "text-cosmic-gold" : "text-ink-muted"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl",
                moreOpen
                  ? "bg-[linear-gradient(135deg,#6C3CFF,#FF8A3D)] text-white"
                  : moreActive
                    ? "bg-cosmic-purple/20 text-cosmic-gold"
                    : "bg-transparent"
              )}
            >
              <Menu className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.1} />
            </span>
            <span className="max-w-full truncate text-[10px] font-semibold leading-none">
              {hi ? "और" : "More"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function DirectTabLink({ item }: { item: DirectTab }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 pb-1.5 pt-1",
        item.active ? "text-cosmic-gold" : "text-ink-muted"
      )}
      aria-current={item.active ? "page" : undefined}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl",
          item.active
            ? "bg-cosmic-purple/20 text-cosmic-gold"
            : "bg-transparent"
        )}
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.1} />
      </span>
      <span className="max-w-full truncate text-[10px] font-semibold leading-none">
        {item.label}
      </span>
    </Link>
  );
}
