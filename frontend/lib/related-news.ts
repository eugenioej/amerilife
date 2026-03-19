import type { PostsListItem } from "@/lib/queries";

export type RelatedNewsItem = {
  category: string;
  date: string;
  title: string;
  href: string;
};

/**
 * Converts MM/DD/YY to ISO date string for Date parsing.
 */
function parseRelatedDate(dateStr: string): string {
  const [mm, dd, yy] = dateStr.split("/");
  if (!mm || !dd || !yy) return dateStr;
  const year = yy.length === 2 ? `20${yy}` : yy;
  return `${year}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

/**
 * Extracts category slug and post slug from amerilife.com blog URL.
 * e.g. https://amerilife.com/blog/announcements/my-post-slug/ -> { categorySlug: "announcements", slug: "my-post-slug" }
 */
function parseBlogHref(href: string): { categorySlug: string; slug: string } {
  const match = href.match(/\/blog\/([^/]+)\/([^/]+)\/?$/);
  return {
    categorySlug: match?.[1] ?? "announcements",
    slug: match?.[2] ?? "post",
  };
}

/**
 * Converts a RelatedNewsItem (from distribution pages) to PostsListItem
 * for use with BlogPostCard. Uses internal /blog/ paths.
 */
export function relatedNewsToPost(item: RelatedNewsItem, index: number): PostsListItem {
  const { categorySlug, slug } = parseBlogHref(item.href);
  return {
    id: `related-${index}`,
    title: item.title,
    slug,
    date: parseRelatedDate(item.date),
    excerpt: null,
    categories: {
      nodes: [{ name: item.category, slug: categorySlug }],
    },
  };
}
