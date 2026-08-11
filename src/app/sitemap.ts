import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPosts } from "@/lib/blog";
import { CALCULATORS } from "@/lib/calculators/catalog";
import { LEARN_GUIDE_SLUGS } from "@/lib/learn/catalog";
import { ZODIAC_SLUGS } from "@/lib/zodiac-icons";

const staticPaths = [
  "",
  "/kundli",
  "/calculators",
  "/chat",
  "/chat-with-astrologer",
  "/horoscope",
  "/panchang",
  "/features",
  "/pricing",
  "/about",
  "/services",
  "/faq",
  "/contact",
  "/blog",
  "/learn",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "hi"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency:
          path === "" || path === "/horoscope" ? "daily" : path === "/kundli" || path === "/calculators" ? "weekly" : "monthly",
        priority:
          path === ""
            ? 1
            : path === "/kundli" || path === "/calculators" || path === "/horoscope"
              ? 0.95
              : path === "/chat" || path === "/chat-with-astrologer"
                ? 0.9
                : 0.75,
        alternates: {
          languages: {
            en: `${siteConfig.siteUrl}/en${path}`,
            hi: `${siteConfig.siteUrl}/hi${path}`,
          },
        },
      });
    }

    for (const calc of CALCULATORS) {
      const path = `/calculators/${calc.slug}`;
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: {
            en: `${siteConfig.siteUrl}/en${path}`,
            hi: `${siteConfig.siteUrl}/hi${path}`,
          },
        },
      });
    }

    for (const post of getPosts(locale)) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            en: `${siteConfig.siteUrl}/en/blog/${post.slug}`,
            hi: `${siteConfig.siteUrl}/hi/blog/${post.slug}`,
          },
        },
      });
    }

    for (const slug of LEARN_GUIDE_SLUGS) {
      const path = `/learn/${slug}`;
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.72,
        alternates: {
          languages: {
            en: `${siteConfig.siteUrl}/en${path}`,
            hi: `${siteConfig.siteUrl}/hi${path}`,
          },
        },
      });
    }

    for (const slug of ZODIAC_SLUGS) {
      const path = `/horoscope/${slug}`;
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
        alternates: {
          languages: {
            en: `${siteConfig.siteUrl}/en${path}`,
            hi: `${siteConfig.siteUrl}/hi${path}`,
          },
        },
      });
    }
  }

  return entries;
}
