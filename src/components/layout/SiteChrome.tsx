"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

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

const MOBILE_NAV_PAD =
  "pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);
  const dashboard = isDashboardPath(pathname);

  useEffect(() => {
    if (!auth) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    // Vertical scroll stays on the auth form panel; lock page-level x-scroll.
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
        <main
          className={`fixed inset-0 z-[40] max-h-dvh w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-[#fff8f1] ${MOBILE_NAV_PAD}`}
        >
          {children}
        </main>
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={`min-h-[70vh] ${MOBILE_NAV_PAD}`}>{children}</main>
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
