/** Google Analytics (GA4) measurement ID. Override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-S04KF3T9Y6";

export const CONSENT_STORAGE_KEY = "cosmictalks_consent";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Pushes a consent update to gtag if it has loaded. Safe to call before load — it's a no-op then. */
export function updateGaConsent(choice: ConsentChoice) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}
