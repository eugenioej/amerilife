import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";

export { formatInsightExcerptPlain } from "@/lib/insight-excerpt";

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatBylineDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function topicLabel(post: Pick<IdeaxchangeListItem, "ideaxchangeTopics">): string {
  const name = post.ideaxchangeTopics?.nodes?.[0]?.name?.trim();
  return name ? name.toUpperCase() : "IDEAXCHANGE";
}

/**
 * Magazine “Featured articles” row — driven by ideaxchangeFields.isFeatured from WP
 * (is_featured meta and/or Featured ideaxchange_tag; see mu-plugin).
 */
export function isIdeaxchangeFeatured(
  post: Pick<IdeaxchangeListItem, "ideaxchangeFields">,
): boolean {
  return post.ideaxchangeFields?.isFeatured === true;
}

export function ideaxchangeHref(slug: string | null | undefined): string {
  if (!slug) return "/ideaxchange/magazine/";
  return `/ideaxchange/magazine/${slug}/`;
}

/** Insight topic taxonomy archive on the Next.js site (not WP `/insight-topic/`). */
export function ideaxchangeCategoryHref(slug: string | null | undefined): string {
  if (!slug) return "/ideaxchange/magazine/";
  return `/ideaxchange/magazine/category/${slug}/`;
}

/** Next/Image quality (1–100) for magazine — balances sharpness vs. payload. */
export const INSIGHT_IMG_QUALITY = 90;

/** Main column posts before first “Load more” on /ideaxchange/magazine/. */
export const INSIGHTS_NEWSROOM_INITIAL = 6;
