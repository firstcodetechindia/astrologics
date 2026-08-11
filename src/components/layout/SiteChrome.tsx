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
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);
  const dashboard = isDashboardPath(pathname);

  useEffect(() => {
    if (!auth) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.classList.add("auth-lock");
    body.classList.add("auth-lock");
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      html.classList.remove("auth-lock");
      body.classList.remove("auth-lock");
    };
  }, [auth]);

  if (auth) {
    return (
      <main className="fixed inset-0 z-[60] h-dvh max-h-dvh overflow-hidden bg-[#fff8f1]">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[70vh] pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      {!dashboard ? (
        <div className="pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0">
          <Footer />
        </div>
      ) : null}
      <MobileBottomNav />
      <ScrollToTop />
    </>
  );
}
