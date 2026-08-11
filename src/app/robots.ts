import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/kundli/result",
        "/*/login",
        "/*/signup",
        "/*/dashboard",
        "/*/astrologer/dashboard",
        "/*/astrologer/signin",
        "/*/astrologer/signup",
      ],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
