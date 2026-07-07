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

export function dedupeIdeaxchangePosts(
  posts: IdeaxchangeListItem[],
): IdeaxchangeListItem[] {
  const seen = new Set<string>();
  const out: IdeaxchangeListItem[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

/** Spotlight + recent sidebar slots for the magazine-style newsroom grid. */
export function partitionNewsroomWithSidebar(posts: IdeaxchangeListItem[]) {
  const unique = dedupeIdeaxchangePosts(posts);
  let remaining = [...unique];

  let spotlight: IdeaxchangeListItem | null = null;
  const spotlightIdx = remaining.findIndex((p) => p.ideaxchangeFields?.isSpotlight);
  if (spotlightIdx >= 0) {
    spotlight = remaining[spotlightIdx]!;
    remaining = remaining.filter((_, i) => i !== spotlightIdx);
  } else if (remaining.length > 0) {
    spotlight = remaining[0]!;
    remaining = remaining.slice(1);
  }

  const recentSidebar = remaining.slice(0, 4);
  const newsroomRest = remaining.slice(4);

  return { spotlight, recentSidebar, newsroomRest };
}
