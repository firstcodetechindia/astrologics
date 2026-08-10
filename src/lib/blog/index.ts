import { blogPosts } from "@/lib/blog/posts";

export type { BlogPost } from "@/lib/blog/posts";
export { blogPosts };

export function getPost(slug: string, locale: "en" | "hi") {
  return blogPosts.find((p) => p.slug === slug && p.locale === locale);
}

export function getPosts(locale: "en" | "hi") {
  return blogPosts.filter((p) => p.locale === locale);
}
