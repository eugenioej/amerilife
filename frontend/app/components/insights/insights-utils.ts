import type { InsightListItem } from "@/lib/queries";

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

export function topicLabel(post: Pick<InsightListItem, "insightTopics">): string {
  const name = post.insightTopics?.nodes?.[0]?.name?.trim();
  return name ? name.toUpperCase() : "INSIGHT";
}

/**
 * Magazine “Featured articles” row — driven by insightFields.isFeatured from WP
 * (is_featured meta and/or Featured insight_tag; see mu-plugin).
 */
export function isInsightFeatured(
  post: Pick<InsightListItem, "insightFields">,
): boolean {
  return post.insightFields?.isFeatured === true;
}

export function insightHref(slug: string | null | undefined): string {
  if (!slug) return "/insights/";
  return `/insights/${slug}/`;
}

/** Insight topic taxonomy archive on the Next.js site (not WP `/insight-topic/`). */
export function insightCategoryHref(slug: string | null | undefined): string {
  if (!slug) return "/insights/";
  return `/insights/category/${slug}/`;
}

/** Next/Image quality (1–100) for magazine — balances sharpness vs. payload. */
export const INSIGHT_IMG_QUALITY = 90;

/** Main column posts before first “Load more” on /insights/. */
export const INSIGHTS_NEWSROOM_INITIAL = 6;
