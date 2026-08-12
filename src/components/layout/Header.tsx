"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  Home,
  IndianRupee,
  MessageCircle,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { UserAccountMenu } from "./UserAccountMenu";
import { whatsappLink } from "@/lib/site-config";
import { CosmicGPTWordmark } from "@/components/brand/CosmicGPTWordmark";
import {
  FEATURES_MENU,
  FREE_TOOLS_MENU,
  calculatorsMegaColumns,
  learnMegaColumns,
  type MegaColumn,
  type MegaColumnStack,
} from "@/lib/navigation/menus";
import { cn } from "@/lib/utils";

type MenuKey = "features" | "tools" | "calculators" | "learn" | null;

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

/** Shared grid mega — scrollable, with hover bridge so it doesn’t close while moving */
function MegaGridPanel({
  columns,
  locale,
  onNavigate,
  footer,
  wide,
  dense,
}: {
  columns: MegaColumnStack[];
  locale: string;
  onNavigate: () => void;
  footer?: ReactNode;
  wide?: boolean;
  dense?: boolean;
}) {
  const colCount = Math.min(3, Math.max(1, columns.length));

  return (
    <div
      className={`absolute left-1/2 top-full z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 pt-2 ${
        wide
          ? "w-[min(98vw,1180px)]"
          : colCount >= 3
            ? "w-[min(96vw,920px)]"
            : "w-[min(96vw,640px)]"
      }`}
    >
      <div className="flex max-h-[min(72vh,560px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1A1F3B] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={`grid grid-cols-1 md:divide-x md:divide-white/[0.08] ${
              colCount >= 3
                ? "md:grid-cols-3"
                : colCount === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1"
            }`}
          >
            {columns.map((col, ci) => (
              <div
                key={ci}
                className={`min-w-0 space-y-4 p-3 sm:p-4 ${dense ? "lg:px-5" : "lg:px-6 lg:space-y-5"}`}
              >
                {col.groups.map((group) => (
                  <div key={pick(locale, group.heading)}>
                    <p className="mb-1 border-b border-white/[0.08] pb-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      {pick(locale, group.heading)}
                    </p>
                    <ul className="grid grid-cols-1 gap-0">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onNavigate}
                            className={`group flex items-start gap-2 rounded-lg px-1.5 font-ui font-medium text-white/90 transition-colors hover:bg-cosmic-purple/15 hover:text-white ${
                              dense ? "py-1.5 text-[12.5px]" : "py-2 text-[13px]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-cosmic-gold group-hover:bg-cosmic-purple/20 group-hover:text-white ${
                                dense ? "h-6 w-6 text-[13px]" : "h-7 w-7 text-[15px]"
                              }`}
                              aria-hidden
                            >
                              {link.icon || "•"}
                            </span>
                            <span className="min-w-0 leading-snug">
                              <span className="block break-words">
                                {pick(locale, link.title)}
                              </span>
                              {!dense && link.description ? (
                                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-ink-muted line-clamp-1">
                                  {pick(locale, link.description)}
                                </span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.08] bg-[#12172E] px-5 py-2.5 font-ui text-[13px] text-ink-muted">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function navItemClass(active: boolean, open?: boolean) {
  return cn(
    // One active signal only: gradient pill (no underline)
    "relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-ui text-[13px] font-semibold",
    active || open
      ? "bg-[linear-gradient(90deg,#6C3CFF,#FF8A3D)] text-white shadow-[0_8px_22px_-8px_rgba(108,60,255,0.75)]"
      : "text-white/75 hover:bg-white/[0.08] hover:text-white"
  );
}

/** Quiet header controls — same size; Ask AI stays the only loud CTA */
const headerQuietBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/20 bg-transparent px-3 font-ui text-[12.5px] font-medium text-white/85 hover:border-white/35 hover:bg-white/[0.06] hover:text-white";
const headerQuietIcon =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-transparent text-white/85 hover:border-white/35 hover:bg-white/[0.06] hover:text-white";
const headerAskAi =
  "inline-flex h-9 items-center gap-1.5 rounded-lg bg-[linear-gradient(90deg,#6C3CFF,#FF8A3D)] px-3.5 font-ui text-[12.5px] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(108,60,255,0.55)] hover:brightness-110";


export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const hi = locale === "hi";
  const [menu, setMenu] = useState<MenuKey>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolledRef = useRef(false);

  const calcColumns = calculatorsMegaColumns();
  const featuresStacks = asStacks(FEATURES_MENU);
  const toolsStacks = asStacks(FREE_TOOLS_MENU);
  const learnStacks = learnMegaColumns();

  const sectionActive = {
    features: pathMatches(pathname, ["/features", "/services"]),
    tools: pathMatches(pathname, [
      "/kundli",
      "/chat",
      "/panchang",
      "/horoscope",
      "/numerology",
      "/vastu",
    ]),
    calculators: pathMatches(pathname, ["/calculators"]),
    learn: pathMatches(pathname, ["/learn", "/blog"]),
    pricing: pathMatches(pathname, ["/pricing"]),
    home: pathname === "/" || pathname === "",
  };

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu(key: MenuKey) {
    clearCloseTimer();
    setMenu(key);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setMenu(null), 280);
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    setMenu(null);
  }, [pathname]);

  // Sticky menu bar — flips as soon as the user starts scrolling the page
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const sync = () => {
      // Flip as soon as the page moves
      const on = window.scrollY > 1;
      if (on === scrolledRef.current) return;
      scrolledRef.current = on;
      el.dataset.scrolled = on ? "true" : "false";
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  type SoftMenuItem = {
    key: Exclude<MenuKey, "calculators" | null>;
    label: string;
    icon: LucideIcon;
    stacks: MegaColumnStack[];
    active: boolean;
    footer?: ReactNode;
  };

  const softMenus: SoftMenuItem[] = [
    {
      key: "features",
      label: t("features"),
      icon: Sparkles,
      stacks: featuresStacks,
      active: sectionActive.features,
      footer: (
        <>
          <Link
            href="/features"
            onClick={() => setMenu(null)}
            className="font-semibold text-cosmic-gold hover:underline"
          >
            {hi ? "सभी विशेषताएँ देखें →" : "View all features →"}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenu(null)}
            className="text-ink-muted hover:text-white"
          >
            {t("pricing")}
          </Link>
        </>
      ),
    },
    {
      key: "tools",
      label: t("freeTools"),
      icon: Wrench,
      stacks: toolsStacks,
      active: sectionActive.tools,
      footer: (
        <>
          <Link
            href="/kundli"
            onClick={() => setMenu(null)}
            className="font-semibold text-cosmic-gold hover:underline"
          >
            {hi ? "सभी उपकरण देखें →" : "View all tools →"}
          </Link>
          <Link
            href="/chat"
            onClick={() => setMenu(null)}
            className="text-ink-muted hover:text-white"
          >
            {hi ? "एआई चैट" : "AI Chat"}
          </Link>
        </>
      ),
    },
  ];

  const learnMenu: SoftMenuItem = {
    key: "learn",
    label: t("learn"),
    icon: BookOpen,
    stacks: learnStacks,
    active: sectionActive.learn,
    footer: (
      <>
        <Link
          href="/learn"
          onClick={() => setMenu(null)}
          className="font-semibold text-cosmic-gold hover:underline"
        >
          {hi ? "सभी गाइड देखें →" : "View all guides →"}
        </Link>
        <Link
          href="/blog"
          onClick={() => setMenu(null)}
          className="text-ink-muted hover:text-white"
        >
          {hi ? "ब्लॉग" : "Blog"}
        </Link>
        <Link
          href="/learn/glossary"
          onClick={() => setMenu(null)}
          className="text-ink-muted hover:text-white"
        >
          {hi ? "शब्दावली" : "Glossary"}
        </Link>
      </>
    ),
  };

  const activeSoft = [...softMenus, learnMenu].find((m) => m.key === menu);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      aria-label={hi ? "साइट मेनू" : "Site menu"}
      className={cn(
        // Soft strip at top of page; solid familiar bar when scrolled (no fade delay)
        "site-header fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-[#0B0F1F]/55",
        "data-[scrolled=true]:border-white/16 data-[scrolled=true]:bg-[#0B0F1F] data-[scrolled=true]:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.55)]"
      )}
    >
      {/* Brand + actions — logo/tagline always stay */}
      <div className="container-page flex h-14 items-center justify-between gap-3 lg:h-[3.75rem]">
        <nav className="sr-only" aria-label={hi ? "मुख्य लिंक" : "Primary links"}>
          <ul>
            <li>
              <Link href="/kundli">{hi ? "मुफ़्त कुंडली" : "Free kundli"}</Link>
            </li>
            <li>
              <Link href="/panchang">{hi ? "पंचांग" : "Panchang"}</Link>
            </li>
            <li>
              <Link href="/horoscope">{hi ? "राशिफल" : "Horoscope"}</Link>
            </li>
            <li>
              <Link href="/numerology">{hi ? "अंक ज्योतिष" : "Numerology"}</Link>
            </li>
            <li>
              <Link href="/vastu">{hi ? "वास्तु" : "Vastu"}</Link>
            </li>
            <li>
              <Link href="/calculators">{hi ? "कैलकुलेटर" : "Calculators"}</Link>
            </li>
            <li>
              <Link href="/chat">{hi ? "एआई गुरु" : "AI Guru"}</Link>
            </li>
            <li>
              <Link href="/learn">{hi ? "ज्योतिष सीखें" : "Learn astrology"}</Link>
            </li>
            <li>
              <Link href="/blog">{t("blog")}</Link>
            </li>
            <li>
              <Link href="/faq">{t("faq")}</Link>
            </li>
            <li>
              <Link href="/about">{t("about")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("contact")}</Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-2 sm:max-w-none sm:flex-none"
        >
          <CosmicGPTWordmark
            size="sm"
            showTagline
            width={160}
            className="group-hover:brightness-110"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher className={headerQuietIcon} />
          <UserAccountMenu
            quietClassName={headerQuietBtn}
            quietIconClassName={headerQuietIcon}
          />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tc("talkNow")}
            className={headerQuietBtn}
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-90" />
            <span className="hidden sm:inline">{tc("talkNow")}</span>
          </a>
          <Link
            href="/chat"
            aria-label={hi ? "एआई से बात करें" : "Talk to AI"}
            title={hi ? "एआई से बात करें" : "Talk to AI"}
            className={headerAskAi}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
            <span className="md:hidden">{hi ? "एआई" : "AI"}</span>
            <span className="hidden md:inline">
              {hi ? "एआई से पूछें" : "Ask AI"}
            </span>
          </Link>
        </div>
      </div>

      {/* Page menu — compact row with related icons */}
      <div className="hidden border-t border-white/10 lg:block">
        <nav
          ref={navRef}
          className="container-page relative flex h-12 items-center justify-center gap-3 sm:gap-5"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          aria-label={hi ? "पेज मेनू" : "Page menu"}
        >
          <Link
            href="/"
            className={navItemClass(sectionActive.home)}
            onMouseEnter={() => openMenu(null)}
            aria-current={sectionActive.home ? "page" : undefined}
          >
            <Home className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
            {t("home")}
          </Link>

          {softMenus.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={navItemClass(item.active, menu === item.key)}
                aria-expanded={menu === item.key}
                aria-current={item.active ? "true" : undefined}
                onMouseEnter={() => openMenu(item.key)}
                onClick={() =>
                  setMenu((m) => (m === item.key ? null : item.key))
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 opacity-55",
                    menu === item.key && "rotate-180 opacity-100"
                  )}
                />
              </button>
            );
          })}

          <button
            type="button"
            className={navItemClass(
              sectionActive.calculators,
              menu === "calculators"
            )}
            aria-expanded={menu === "calculators"}
            aria-current={sectionActive.calculators ? "true" : undefined}
            onMouseEnter={() => openMenu("calculators")}
            onClick={() =>
              setMenu((m) => (m === "calculators" ? null : "calculators"))
            }
          >
            <Calculator className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
            {t("calculators")}
            <ChevronDown
              className={cn(
                "h-3 w-3 opacity-55",
                menu === "calculators" && "rotate-180 opacity-100"
              )}
            />
          </button>

          <button
            type="button"
            className={navItemClass(learnMenu.active, menu === "learn")}
            aria-expanded={menu === "learn"}
            aria-current={learnMenu.active ? "true" : undefined}
            onMouseEnter={() => openMenu("learn")}
            onClick={() => setMenu((m) => (m === "learn" ? null : "learn"))}
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
            {learnMenu.label}
            <ChevronDown
              className={cn(
                "h-3 w-3 opacity-55",
                menu === "learn" && "rotate-180 opacity-100"
              )}
            />
          </button>

          <Link
            href="/pricing"
            className={navItemClass(sectionActive.pricing)}
            onMouseEnter={() => openMenu(null)}
            aria-current={sectionActive.pricing ? "page" : undefined}
          >
            <IndianRupee className="h-3.5 w-3.5 shrink-0" strokeWidth={2.1} />
            {t("pricing")}
          </Link>

          {activeSoft && (
            <MegaGridPanel
              wide={activeSoft.key === "learn"}
              columns={activeSoft.stacks}
              locale={locale}
              onNavigate={() => setMenu(null)}
              footer={activeSoft.footer}
            />
          )}
          {menu === "calculators" && (
            <MegaGridPanel
              wide
              dense
              columns={calcColumns}
              locale={locale}
              onNavigate={() => setMenu(null)}
              footer={
                <>
                  <Link
                    href="/calculators"
                    onClick={() => setMenu(null)}
                    className="font-semibold text-cosmic-gold hover:underline"
                  >
                    {hi ? "सभी कैलकुलेटर देखें →" : "View all calculators →"}
                  </Link>
                  <Link
                    href="/kundli"
                    onClick={() => setMenu(null)}
                    className="text-ink-muted hover:text-white"
                  >
                    {hi ? "पूर्ण कुंडली" : "Full kundli"}
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMenu(null)}
                    className="text-ink-muted hover:text-white"
                  >
                    {hi ? "एआई चैट" : "AI Chat"}
                  </Link>
                </>
              }
            />
          )}
        </nav>
      </div>
    </header>
  );
}
