"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { User } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  clearSession,
  displayUserName,
  formatPhoneDisplay,
  getSession,
  type AuthUser,
} from "@/lib/auth/client-auth";
import { cn } from "@/lib/utils";

export function UserAccountMenu() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function syncAuth() {
      setUser(getSession());
    }
    syncAuth();
    window.addEventListener("astrologics-auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("astrologics-auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  }

  function logout() {
    clearSession();
    setOpen(false);
    router.replace("/login");
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-xl border border-saffron/30 px-2.5 py-2 text-xs font-semibold text-saffron-deep transition hover:bg-[#fff1e6] sm:px-3"
      >
        <User className="h-4 w-4 shrink-0" strokeWidth={2.1} />
        <span>{hi ? "लॉगिन" : "Login"}</span>
      </Link>
    );
  }

  const displayName = displayUserName(user) || null;
  const phoneLabel = formatPhoneDisplay(user.phone);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={hi ? "अकाउंट मेनू" : "Account menu"}
        onFocus={openMenu}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F06A00] text-white shadow-[0_6px_16px_-10px_rgba(240,106,0,0.8)] transition hover:bg-[#e85d04]",
          open && "ring-2 ring-saffron/30 ring-offset-2"
        )}
      >
        <User className="h-4 w-4" strokeWidth={2.2} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.35rem)] z-60 min-w-[13.5rem] overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_16px_40px_-18px_rgba(42,33,24,0.45)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="flex flex-col items-center px-5 pb-3.5 pt-4 text-center">
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e8e4df] text-[#6b6560]"
              aria-hidden
            >
              <User className="h-6 w-6" strokeWidth={1.8} />
            </span>
            {displayName ? (
              <p className="mt-2.5 text-[15px] font-bold leading-tight text-[#1e2a44]">
                {displayName}
              </p>
            ) : null}
            <p
              className={cn(
                "text-[13px] font-semibold text-[#6b7280]",
                displayName ? "mt-1" : "mt-2.5"
              )}
            >
              {phoneLabel}
            </p>
          </div>

          <div className="mx-3 border-t border-dashed border-[#cfc8bf]" />

          <div className="py-1.5">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] font-medium text-[#2f2924] transition hover:bg-[#fff1e6] hover:text-saffron-deep"
            >
              {hi ? "मेरा अकाउंट" : "My Account"}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="block w-full px-4 py-2.5 text-left text-[13px] font-medium text-[#2f2924] transition hover:bg-[#fff1e6] hover:text-saffron-deep"
            >
              {hi ? "लॉग आउट" : "Logout"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
