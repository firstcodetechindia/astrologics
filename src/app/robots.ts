import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const DISALLOW = [
  "/*/kundli/result",
  "/*/login",
  "/*/signup",
  "/*/dashboard",
  "/*/admin",
  "/*/admin/*",
  "/*/astrologer/dashboard",
  "/*/astrologer/signin",
  "/*/astrologer/signup",
];

const AI_CRAWLERS = [
  "GPTBot",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
