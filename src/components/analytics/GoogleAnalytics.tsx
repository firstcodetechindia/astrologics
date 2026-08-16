import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/ga";

/**
 * Consent defaults to "denied" until the user responds to CookieConsentBanner,
 * per Google's Consent Mode v2 — no analytics/ad cookies are set until then.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`}
      </Script>
    </>
  );
}
