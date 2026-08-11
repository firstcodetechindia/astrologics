"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Home,
  LayoutGrid,
  Sparkles,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  FEATURES_MENU,
  FREE_TOOLS_MENU,
  calculatorsMegaColumns,
  learnMegaColumns,
  type MegaColumn,
  type MegaColumnStack,
} from "@/lib/navigation/menus";
import { cn } from "@/lib/utils";

type MenuKey = "features" | "tools" | "calculators" | "learn";

function pick(locale: string, t: { en: string; hi: string }) {
  return locale === "hi" ? t.hi : t.en;
}

function asStacks(columns: MegaColumn[]): MegaColumnStack[] {
  return columns.map((col) => ({ groups: [col] }));
}

function pathMatches(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

type SheetDef = {
  key: MenuKey;
  label: string;
  shortLabel: string;
  icon: typeof Home;
  stacks: MegaColumnStack[];
  active: boolean;
  dense?: boolean;
  footer?: ReactNode;
};

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const hi = locale === "hi";
  const reduceMotion = useReducedMotion();
  const [menu, setMenu] = useState<MenuKey | null>(null);

  const calcColumns = calculatorsMegaColumns();
  const featuresStacks = asStacks(FEATURES_MENU);
  const toolsStacks = asStacks(FREE_TOOLS_MENU);
  const learnStacks = learnMegaColumns();

  const sectionActive = {
    features: pathMatches(pathname, ["/features", "/services"]),
    tools: pathMatches(pathname, [
      "/kundli",
      "/chat",
      "/chat-with-astrologer",
      "/panchang",
      "/horoscope",
      "/numerology",
      "/vastu",
    ]),
    calculators: pathMatches(pathname, ["/calculators"]),
    learn: pathMatches(pathname, ["/learn", "/blog"]),
    home: pathname === "/" || pathname === "",
  };

  const sheets: SheetDef[] = [
    {
      key: "features",
      label: t("features"),
      shortLabel: hi ? "फीचर्स" : "Features",
      icon: Sparkles,
      stacks: featuresStacks,
      active: sectionActive.features,
      footer: (
        <>
          <Link
            href="/features"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep"
          >
            {hi ? "सभी विशेषताएँ →" : "All features →"}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c]"
          >
            {t("pricing")}
          </Link>
        </>
      ),
    },
    {
      key: "tools",
      label: t("freeTools"),
      shortLabel: hi ? "टूल्स" : "Tools",
      icon: LayoutGrid,
      stacks: toolsStacks,
      active: sectionActive.tools,
      footer: (
        <>
          <Link
            href="/numerology"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep"
          >
            {hi ? "अंक ज्योतिष →" : "Numerology →"}
          </Link>
          <Link
            href="/vastu"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep"
          >
            {hi ? "वास्तु →" : "Vastu →"}
          </Link>
          <Link
            href="/calculators"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c]"
          >
            {hi ? "सभी उपकरण →" : "All tools →"}
          </Link>
          <Link
            href="/chat"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c]"
          >
            {hi ? "एआई चैट" : "AI Chat"}
          </Link>
        </>
      ),
    },
    {
      key: "calculators",
      label: t("calculators"),
      shortLabel: hi ? "कैलक" : "Calcs",
      icon: Calculator,
      stacks: calcColumns,
      active: sectionActive.calculators,
      dense: true,
      footer: (
        <>
          <Link
            href="/calculators"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep"
          >
            {hi ? "सभी कैलकुलेटर →" : "All calculators →"}
          </Link>
          <Link
            href="/kundli"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c]"
          >
            {hi ? "कुंडली" : "Kundli"}
          </Link>
        </>
      ),
    },
    {
      key: "learn",
      label: t("learn"),
      shortLabel: hi ? "सीखें" : "Learn",
      icon: BookOpen,
      stacks: learnStacks,
      active: sectionActive.learn,
      footer: (
        <>
          <Link
            href="/learn"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep"
          >
            {hi ? "सभी गाइड →" : "All guides →"}
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c]"
          >
            {t("blog")}
          </Link>
        </>
      ),
    },
  ];

  const leftTabs = sheets.filter((s) => s.key === "features" || s.key === "tools");
  const rightTabs = sheets.filter(
    (s) => s.key === "calculators" || s.key === "learn"
  );
  const activeSheet = sheets.find((s) => s.key === menu) ?? null;

  function toggleMenu(key: MenuKey) {
    setMenu((current) => (current === key ? null : key));
  }

  useEffect(() => {
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menu]);

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {menu && activeSheet ? (
          <motion.div
            key="mobile-sheet-root"
            className="fixed inset-0 z-[60]"
            data-mobile-sheet="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <button
              type="button"
              aria-label={hi ? "मेनू बंद करें" : "Close menu"}
              className="absolute inset-0 bg-[#2a2118]/45 backdrop-blur-[2px]"
              onClick={() => setMenu(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeSheet.label}
              className="absolute inset-x-0 bottom-0 z-10 flex max-h-[min(78vh,640px)] flex-col rounded-t-[1.35rem] border border-black/[0.08] border-b-0 bg-white shadow-[0_-18px_50px_-20px_rgba(42,33,24,0.4)]"
              style={{
                paddingBottom: "calc(4.85rem + env(safe-area-inset-bottom))",
              }}
              initial={reduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 320,
                mass: 0.85,
              }}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] px-4 pb-3 pt-3">
                <div className="min-w-0">
                  <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-black/10" />
                  <p className="truncate text-sm font-bold text-ink">
                    {activeSheet.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMenu(null)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-[#faf8f6] text-ink-muted transition hover:bg-[#fff1e6] hover:text-saffron-deep"
                  aria-label={hi ? "बंद करें" : "Close"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                key={activeSheet.key}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4"
              >
                {activeSheet.key === "tools" ? (
                  <div className="mb-4 space-y-2">
                    <Link
                      href="/numerology"
                      onClick={() => setMenu(null)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition",
                        pathMatches(pathname, ["/numerology"])
                          ? "border-saffron/40 bg-gradient-to-r from-saffron to-maroon text-white shadow-sm"
                          : "border-saffron/25 bg-gradient-to-br from-[#fff7f0] to-white hover:border-saffron/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
                          pathMatches(pathname, ["/numerology"])
                            ? "bg-white/20"
                            : "bg-white text-saffron-deep shadow-sm"
                        )}
                        aria-hidden
                      >
                        🔢
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">
                          {hi ? "अंक ज्योतिष" : "Numerology"}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-[12px] leading-snug",
                            pathMatches(pathname, ["/numerology"])
                              ? "text-white/85"
                              : "text-ink-muted"
                          )}
                        >
                          {hi
                            ? "मूलांक, भाग्यांक, नाम अंक व लो शू"
                            : "Mulank, Bhagyank, name number & Lo Shu"}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          pathMatches(pathname, ["/numerology"])
                            ? "text-white"
                            : "text-saffron-deep"
                        )}
                      >
                        →
                      </span>
                    </Link>
                    <Link
                      href="/vastu"
                      onClick={() => setMenu(null)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition",
                        pathMatches(pathname, ["/vastu"])
                          ? "border-saffron/40 bg-gradient-to-r from-saffron to-maroon text-white shadow-sm"
                          : "border-saffron/25 bg-gradient-to-br from-[#fff7f0] to-white hover:border-saffron/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
                          pathMatches(pathname, ["/vastu"])
                            ? "bg-white/20"
                            : "bg-white text-saffron-deep shadow-sm"
                        )}
                        aria-hidden
                      >
                        🏠
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">
                          {hi ? "वास्तु" : "Vastu"}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-[12px] leading-snug",
                            pathMatches(pathname, ["/vastu"])
                              ? "text-white/85"
                              : "text-ink-muted"
                          )}
                        >
                          {hi
                            ? "क्षेत्र दोष, स्कोर व उपाय"
                            : "Zone Dosha, score & remedies"}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          pathMatches(pathname, ["/vastu"])
                            ? "text-white"
                            : "text-saffron-deep"
                        )}
                      >
                        →
                      </span>
                    </Link>
                  </div>
                ) : null}
                <div className="space-y-5">
                  {activeSheet.stacks.map((col, ci) =>
                    col.groups.map((group) => (
                      <div key={`${ci}-${pick(locale, group.heading)}`}>
                        <p className="mb-1.5 border-b border-black/[0.06] pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
                          {pick(locale, group.heading)}
                        </p>
                        <ul
                          className={cn(
                            "grid gap-0.5",
                            activeSheet.dense
                              ? "grid-cols-1 sm:grid-cols-2"
                              : "grid-cols-1"
                          )}
                        >
                          {group.links.map((link) => {
                            const linkActive =
                              pathname === link.href ||
                              pathname.startsWith(`${link.href}/`);
                            return (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={() => setMenu(null)}
                                  className={cn(
                                    "flex items-start gap-2.5 rounded-xl px-2 py-2 transition",
                                    linkActive
                                      ? "bg-gradient-to-r from-saffron to-maroon text-white shadow-sm"
                                      : "hover:bg-[#fff1e6]"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[15px]",
                                      linkActive
                                        ? "bg-white/20"
                                        : "bg-[#f7f4f0] text-[#9a8b7a]"
                                    )}
                                    aria-hidden
                                  >
                                    {link.icon || "•"}
                                  </span>
                                  <span className="min-w-0 leading-snug">
                                    <span
                                      className={cn(
                                        "block text-[13px] font-semibold",
                                        linkActive
                                          ? "text-white"
                                          : "text-[#3d342c]"
                                      )}
                                    >
                                      {pick(locale, link.title)}
                                    </span>
                                    {!activeSheet.dense && link.description ? (
                                      <span
                                        className={cn(
                                          "mt-0.5 block text-[11px] font-normal leading-snug line-clamp-2",
                                          linkActive
                                            ? "text-white/85"
                                            : "text-[#8a7a6a]"
                                        )}
                                      >
                                        {pick(locale, link.description)}
                                      </span>
                                    ) : null}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {activeSheet.footer ? (
                <div
                  key={`${activeSheet.key}-footer`}
                  className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.06] bg-[#faf8f6] px-4 py-3 text-[13px]"
                >
                  {activeSheet.footer}
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-[70] w-full max-w-[100vw] border-t border-black/[0.06] bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={hi ? "मोबाइल मेनू" : "Mobile menu"}
      >
        <div className="relative mx-auto grid h-[3.85rem] max-w-lg grid-cols-5 px-1">
            {leftTabs.map((item) => (
              <TabButton
                key={item.key}
                item={item}
                open={menu === item.key}
                onClick={() => toggleMenu(item.key)}
              />
            ))}

            <Link
              href="/"
              onClick={() => setMenu(null)}
              className="relative flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 pb-1.5 pt-1"
              aria-current={sectionActive.home ? "page" : undefined}
              aria-label={t("home")}
            >
              {/* FAB sits above the bar with a white ring so it reads cleanly */}
              <span className="absolute left-1/2 top-0 z-20 flex size-[3.05rem] -translate-x-1/2 -translate-y-[54%] items-center justify-center rounded-full bg-gradient-to-br from-[#ff9a2e] via-saffron to-[#d45500] shadow-[0_8px_20px_-6px_rgba(240,106,0,0.75)] ring-[5px] ring-white transition-transform active:scale-95">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.32),transparent_55%)]"
                />
                <Home
                  className="relative h-[1.25rem] w-[1.25rem] text-white"
                  strokeWidth={2.25}
                />
              </span>
              {/* Matches TabButton icon slot so "Home" lines up with other labels */}
              <span className="h-8 w-8 shrink-0 opacity-0" aria-hidden />
              <span
                className={cn(
                  "max-w-full truncate text-[10px] font-semibold leading-none",
                  sectionActive.home ? "text-saffron-deep" : "text-[#8a7a6a]"
                )}
              >
                {hi ? "होम" : "Home"}
              </span>
            </Link>

            {rightTabs.map((item) => (
              <TabButton
                key={item.key}
                item={item}
                open={menu === item.key}
                onClick={() => toggleMenu(item.key)}
              />
            ))}
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  item,
  open,
  onClick,
}: {
  item: SheetDef;
  open: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const lit = open || item.active;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-current={item.active ? "true" : undefined}
      className={cn(
        "flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 pb-1.5 pt-1 transition",
        lit ? "text-saffron-deep" : "text-[#8a7a6a]"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl transition",
          open
            ? "bg-gradient-to-br from-saffron to-maroon text-white shadow-md shadow-saffron/25"
            : item.active
              ? "bg-saffron/12 text-saffron-deep"
              : "bg-transparent"
        )}
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.1} />
      </span>
      <span
        className={cn(
          "max-w-full truncate text-[10px] font-semibold leading-none",
          lit ? "text-saffron-deep" : "text-[#8a7a6a]"
        )}
      >
        {item.shortLabel}
      </span>
    </button>
  );
}
