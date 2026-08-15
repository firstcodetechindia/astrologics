import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:locale(en|hi)/:dup(en|hi)",
        destination: "/:locale",
        permanent: false,
      },
      {
        source: "/:locale(en|hi)/:dup(en|hi)/:path*",
        destination: "/:locale/:path*",
        permanent: false,
      },
      {
        source: "/:locale(en|hi)/calculators/today-panchang",
        destination: "/:locale/panchang",
        permanent: true,
      },
      {
        source: "/:locale(en|hi)/calculators/daily-panchang",
        destination: "/:locale/panchang",
        permanent: true,
      },
      {
        source: "/cosmicgpt-icon-512.png",
        destination: "/cosmictalks-icon-512.png",
        permanent: true,
      },
      {
        source: "/cosmicgpt-logo.png",
        destination: "/cosmictalks-logo.png",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "media-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
