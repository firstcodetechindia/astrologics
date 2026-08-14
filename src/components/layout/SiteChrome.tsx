"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { AstrologyPageLoader } from "@/components/layout/AstrologyPageLoader";

function isAuthPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/signup/") ||
    pathname === "/astrologer/signup" ||
    pathname === "/astrologer/signin" ||
    pathname.startsWith("/astrologer/signup/") ||
    pathname.startsWith("/astrologer/signin/")
  );
}

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

const MOBILE_NAV_PAD =
  "pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);
  const dashboard = isDashboardPath(pathname);
  const admin = isAdminPath(pathname);

  useEffect(() => {
    if (!auth) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    // Keep x-lock only — vertical overscroll stays free for pull-to-refresh.
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";
    html.classList.add("auth-lock");
    body.classList.add("auth-lock");
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overflowX = "";
      body.style.overflowX = "";
      html.classList.remove("auth-lock");
      body.classList.remove("auth-lock");
    };
  }, [auth]);

  if (auth) {
    return (
      <>
        <AstrologyPageLoader />
        <PullToRefresh />
        <main
          className={`fixed inset-0 z-[40] max-h-dvh w-full max-w-[100vw] overflow-x-hidden overflow-y-auto bg-cosmic-navy ${MOBILE_NAV_PAD}`}
        >
          {children}
        </main>
        <MobileBottomNav />
      </>
    );
  }

  if (admin) {
    return (
      <>
        <AstrologyPageLoader />
        <main className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-cosmic-navy">
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <AstrologyPageLoader />
      <PullToRefresh />
      <Header />
      {/* Offset for fixed header; heroes pull back under it to merge with galaxy */}
      <main
        className={`min-h-[70vh] pt-[var(--site-header-h)] ${MOBILE_NAV_PAD}`}
      >
        {children}
      </main>
      {!dashboard ? (
        <div className={MOBILE_NAV_PAD}>
          <Footer />
        </div>
      ) : null}
      <MobileBottomNav />
      <ScrollToTop />
    </>
  );
}
