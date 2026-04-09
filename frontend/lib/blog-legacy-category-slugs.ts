/**
 * Legacy `/blog/{slug}` segments that list all posts (no taxonomy filter).
 * Keep in sync with routing behavior in `app/(site)/blog/[category]/page.tsx`.
 */
export const LEGACY_CATEGORY_SLUGS = new Set([
  "announcements",
  "blog",
  "partnerships",
  "in-the-news",
]);

/**
 * Canonical URL for the "all posts" listing. Do not use `/blog` — `next.config`
 * redirects `/blog` and `/blog/` to `/newsroom`.
 */
export const BLOG_ALL_POSTS_HREF = "/blog/announcements";
