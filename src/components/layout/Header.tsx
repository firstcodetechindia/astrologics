"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { AstrologicsLogo } from "@/components/brand/AstrologicsLogo";
import {
  FEATURES_MENU,
  FREE_TOOLS_MENU,
  calculatorsMegaColumns,
  learnMegaColumns,
  type MegaColumn,
  type MegaColumnStack,
} from "@/lib/navigation/menus";

type MenuKey = "features" | "tools" | "calculators" | "learn" | null;

function pick(locale: string, t: { en: string; hi: string }) {
  return locale === "hi" ? t.hi : t.en;
}

function asStacks(columns: MegaColumn[]): MegaColumnStack[] {
  return columns.map((col) => ({ groups: [col] }));
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
      className={`absolute left-1/2 top-full z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 pt-3 ${
        wide
          ? "w-[min(98vw,1180px)]"
          : colCount >= 3
            ? "w-[min(96vw,920px)]"
            : "w-[min(96vw,640px)]"
      }`}
    >
      <div className="flex max-h-[min(72vh,560px)] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_50px_-20px_rgba(42,33,24,0.35)]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={`grid grid-cols-1 md:divide-x md:divide-black/[0.06] ${
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
                    <p className="mb-1 border-b border-black/[0.06] pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
                      {pick(locale, group.heading)}
                    </p>
                    <ul className="grid grid-cols-1 gap-0">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onNavigate}
                            className={`group flex items-start gap-2 rounded-lg px-1.5 font-medium text-[#3d342c] transition-colors hover:bg-[#fff1e6] hover:text-saffron-deep ${
                              dense ? "py-1.5 text-[12.5px]" : "py-2 text-[13px]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex shrink-0 items-center justify-center rounded-md bg-[#f7f4f0]/80 text-[#9a8b7a] group-hover:bg-white group-hover:text-saffron-deep ${
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
                                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-[#8a7a6a] line-clamp-1">
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
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.06] bg-[#faf8f6] px-5 py-2.5 text-[13px]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const hi = locale === "hi";
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcColumns = calculatorsMegaColumns();
  const featuresStacks = asStacks(FEATURES_MENU);
  const toolsStacks = asStacks(FREE_TOOLS_MENU);
  const learnStacks = learnMegaColumns();

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

  const softMenus: {
    key: Exclude<MenuKey, "calculators" | null>;
    label: string;
    stacks: MegaColumnStack[];
    footer?: ReactNode;
  }[] = [
    {
      key: "features",
      label: t("features"),
      stacks: featuresStacks,
      footer: (
        <>
          <Link
            href="/features"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "सभी विशेषताएँ →" : "Explore all features →"}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c] hover:text-saffron-deep"
          >
            {t("pricing")}
          </Link>
        </>
      ),
    },
    {
      key: "tools",
      label: t("freeTools"),
      stacks: toolsStacks,
      footer: (
        <>
          <Link
            href="/calculators"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "सभी उपकरण →" : "View all tools →"}
          </Link>
          <Link
            href="/chat"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c] hover:text-saffron-deep"
          >
            {hi ? "एआई चैट" : "AI Chat"}
          </Link>
        </>
      ),
    },
    {
      key: "learn",
      label: t("learn"),
      stacks: learnStacks,
      footer: (
        <>
          <Link
            href="/learn"
            onClick={() => setMenu(null)}
            className="font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "सभी ज्योतिष गाइड →" : "All astrology guides →"}
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c] hover:text-saffron-deep"
          >
            {hi ? "ब्लॉग" : "Blog"}
          </Link>
          <Link
            href="/learn/glossary"
            onClick={() => setMenu(null)}
            className="text-[#6b5c4c] hover:text-saffron-deep"
          >
            {hi ? "शब्दावली" : "Glossary"}
          </Link>
        </>
      ),
    },
  ];

  const activeSoft = softMenus.find((m) => m.key === menu);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <nav className="sr-only" aria-label={hi ? "मुख्य लिंक" : "Primary links"}>
          <ul>
            <li>
              <Link href="/kundli">{hi ? "मुफ़्त कुंडली" : "Free kundli"}</Link>
            </li>
            <li>
              <Link href="/horoscope">{hi ? "राशिफल" : "Horoscope"}</Link>
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
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <AstrologicsLogo className="h-10 w-10 shrink-0 transition group-hover:scale-[1.04] sm:h-11 sm:w-11" />
          <span className="truncate font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
            {siteConfig.brandName}
          </span>
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-0.5 lg:flex"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {softMenus.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-medium transition ${
                menu === item.key
                  ? "bg-[#fff1e6] text-saffron-deep"
                  : "text-ink-muted hover:bg-[#fff1e6]/70 hover:text-saffron-deep"
              }`}
              aria-expanded={menu === item.key}
              onMouseEnter={() => openMenu(item.key)}
              onClick={() =>
                setMenu((m) => (m === item.key ? null : item.key))
              }
            >
              {item.label}
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${
                  menu === item.key ? "rotate-180" : ""
                }`}
              />
            </button>
          ))}

          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-medium transition ${
              menu === "calculators"
                ? "bg-[#fff1e6] text-saffron-deep"
                : "text-ink-muted hover:bg-[#fff1e6]/70 hover:text-saffron-deep"
            }`}
            aria-expanded={menu === "calculators"}
            onMouseEnter={() => openMenu("calculators")}
            onClick={() =>
              setMenu((m) => (m === "calculators" ? null : "calculators"))
            }
          >
            {t("calculators")}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${
                menu === "calculators" ? "rotate-180" : ""
              }`}
            />
          </button>

          <Link
            href="/pricing"
            className="rounded-lg px-3 py-2 text-[14px] font-medium text-ink-muted transition hover:bg-[#fff1e6]/70 hover:text-saffron-deep"
            onMouseEnter={() => openMenu(null)}
          >
            {t("pricing")}
          </Link>

          {/* Single panel slot under whole nav — stays open while switching items */}
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
                    className="font-semibold text-saffron-deep hover:underline"
                  >
                    {hi ? "सभी कैलकुलेटर देखें →" : "View all calculators →"}
                  </Link>
                  <Link
                    href="/kundli"
                    onClick={() => setMenu(null)}
                    className="text-[#6b5c4c] hover:text-saffron-deep"
                  >
                    {hi ? "पूर्ण कुंडली" : "Full kundli"}
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMenu(null)}
                    className="text-[#6b5c4c] hover:text-saffron-deep"
                  >
                    {hi ? "एआई चैट" : "AI Chat"}
                  </Link>
                </>
              }
            />
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="/chat"
            className="hidden items-center justify-center rounded-xl bg-gradient-to-r from-saffron to-maroon px-4 py-2 text-sm font-semibold text-white shadow-md shadow-saffron/25 hover:brightness-105 md:inline-flex"
          >
            {t("chatNow")}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-saffron/30 px-3 py-2 text-xs font-semibold text-saffron-deep hover:bg-[#fff1e6] xl:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {tc("whatsapp")}
          </a>
          <button
            type="button"
            className="rounded-xl border border-saffron/15 p-2.5 text-saffron-deep hover:bg-[#fff1e6] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] space-y-5 overflow-y-auto border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          {softMenus.map((item) => (
            <div key={item.key}>
              <p className="mb-2 border-b border-black/[0.06] pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
                {item.label}
              </p>
              <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {item.stacks
                  .flatMap((s) => s.groups)
                  .flatMap((c) => c.links)
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-[#fff1e6]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f7f4f0] text-[14px]">
                        {link.icon}
                      </span>
                      <span className="font-medium text-[#3d342c]">
                        {pick(locale, link.title)}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          <div>
            <p className="mb-2 border-b border-black/[0.06] pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a7a6a]">
              {t("calculators")}
            </p>
            <div className="space-y-4">
              {calcColumns.flatMap((col) =>
                col.groups.map((g) => (
                  <div key={pick(locale, g.heading)}>
                    <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a7a6a]">
                      {pick(locale, g.heading)}
                    </p>
                    <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                      {g.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-[#fff1e6]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f7f4f0] text-[14px] text-[#9a8b7a]">
                            {link.icon}
                          </span>
                          <span className="font-medium text-[#3d342c]">
                            {pick(locale, link.title)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-2 py-2.5 font-semibold text-ink"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/chat"
            onClick={() => setOpen(false)}
            className="block rounded-xl bg-gradient-to-r from-saffron to-maroon py-3 text-center font-semibold text-white"
          >
            {t("chatNow")}
          </Link>
        </div>
      )}
    </header>
  );
}
