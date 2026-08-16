"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Cookie } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  CONSENT_STORAGE_KEY,
  updateGaConsent,
  type ConsentChoice,
} from "@/lib/analytics/ga";

export function CookieConsentBanner() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null;
    if (stored === "granted" || stored === "denied") {
      updateGaConsent(stored);
      return;
    }
    setVisible(true);
  }, []);

  function respond(choice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    updateGaConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={hi ? "कुकी सहमति" : "Cookie consent"}
      className="fixed inset-x-0 bottom-[calc(3.85rem+env(safe-area-inset-bottom))] z-[80] px-3 pb-3 lg:bottom-0 lg:px-4 lg:pb-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/12 bg-[#12172E]/95 p-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron/15 text-saffron-deep">
            <Cookie className="h-4 w-4" />
          </span>
          <p className="text-[12.5px] leading-relaxed text-ink-muted">
            {hi
              ? "हम अनुभव बेहतर बनाने और उपयोग समझने के लिए कुकीज़/एनालिटिक्स का उपयोग करते हैं। स्वीकार करके आप इसकी अनुमति देते हैं — विवरण के लिए "
              : "We use cookies and analytics to understand usage and improve the site. Accepting lets us use them — see our "}
            <Link href="/privacy" className="font-semibold text-saffron-deep hover:underline">
              {hi ? "गोपनीयता नीति" : "Privacy Policy"}
            </Link>
            {hi ? " देखें।" : "."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => respond("denied")}
            className="rounded-xl border border-white/15 bg-surface/60 px-3.5 py-2 text-[12.5px] font-semibold text-ink-muted hover:bg-surface/90"
          >
            {hi ? "अस्वीकार करें" : "Decline"}
          </button>
          <button
            type="button"
            onClick={() => respond("granted")}
            className="rounded-xl bg-gradient-to-r from-saffron to-maroon px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:brightness-110"
          >
            {hi ? "स्वीकार करें" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
