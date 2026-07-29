import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import {
  IDEAXCHANGE_ARTICLE_PATH,
  IDEAXCHANGE_CATEGORY_PATH,
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
  IDEAXCHANGE_SALES_SUCCESS_PATH,
} from "@/lib/ideaxchange-constants";
import {
  IDEAXCHANGE_INITIATIVE_TAG_SLUG,
  IDEAXCHANGE_RECRUIT_TAG_SLUG,
  IDEAXCHANGE_SALES_TAG_SLUG,
} from "@/lib/ideaxchange-queries";

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

/** Pillar routing tags → hub pages (tags are not category archives). */
const PILLAR_TAG_HREF: Record<string, string> = {
  [IDEAXCHANGE_RECRUIT_TAG_SLUG]: IDEAXCHANGE_RECRUITING_HUB_PATH,
  [IDEAXCHANGE_SALES_TAG_SLUG]: IDEAXCHANGE_LEADERBOARD_PATH,
  [IDEAXCHANGE_INITIATIVE_TAG_SLUG]: IDEAXCHANGE_SALES_SUCCESS_PATH,
};

type BadgePost = Pick<IdeaxchangeListItem, "ideaxchangeTopics" | "ideaxchangeTags">;

export type IdeaxchangeBadge = {
  label: string;
  href: string | null;
};

/**
 * Badge for cards/newsroom:
 * 1) Topic → `/magazine/category/{slug}/`
 * 2) Optional pillar fallback label/href (Recruiting Hub, Leaderboard, …)
 * 3) Pillar tag on the post → hub path
 * 4) IDEAXCHANGE
 */
export function resolveIdeaxchangeBadge(
  post: BadgePost,
  fallback?: { label?: string; href?: string | null },
): IdeaxchangeBadge {
  const topic = post.ideaxchangeTopics?.nodes?.[0];
  const topicName = topic?.name?.trim();
  const topicSlugValue = topic?.slug?.trim();
  if (topicName) {
    return {
      label: topicName.toUpperCase(),
      href: topicSlugValue ? ideaxchangeCategoryHref(topicSlugValue) : null,
    };
  }

  const fallbackLabel = fallback?.label?.trim();
  if (fallbackLabel) {
    return {
      label: fallbackLabel.toUpperCase(),
      href: fallback?.href?.trim() || null,
    };
  }

  for (const tag of post.ideaxchangeTags?.nodes ?? []) {
    const slug = tag.slug?.trim().toLowerCase();
    if (!slug || !(slug in PILLAR_TAG_HREF)) continue;
    const name = tag.name?.trim() || slug;
    return {
      label: name.toUpperCase(),
      href: PILLAR_TAG_HREF[slug] ?? null,
    };
  }

  return { label: "IDEAXCHANGE", href: null };
}

export function topicLabel(
  post: BadgePost,
  fallbackLabel?: string,
): string {
  return resolveIdeaxchangeBadge(
    post,
    fallbackLabel ? { label: fallbackLabel } : undefined,
  ).label;
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
  if (!slug) return IDEAXCHANGE_HOME_FEED_PATH;
  return `${IDEAXCHANGE_ARTICLE_PATH}${slug}/`;
}

/** ideaXchange topic taxonomy archive (not public Insights categories). */
export function ideaxchangeCategoryHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_HOME_FEED_PATH;
  return `${IDEAXCHANGE_CATEGORY_PATH}${slug}/`;
}

export function topicSlug(post: Pick<IdeaxchangeListItem, "ideaxchangeTopics">): string | undefined {
  return post.ideaxchangeTopics?.nodes?.[0]?.slug?.trim() || undefined;
}

/** Next/Image quality (1–100) for ideaXchange cards — balances sharpness vs. payload. */
export const INSIGHT_IMG_QUALITY = 90;

/** Main column posts before first “Load more” on /ideaxchange/home/. */
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
