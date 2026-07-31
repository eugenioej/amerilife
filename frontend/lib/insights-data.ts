import { cache } from "react";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_INSIGHT_BY_SLUG,
  GET_INSIGHTS,
  GET_INSIGHTS_ADS_SETTINGS,
  GET_INSIGHT_TOPIC_BY_SLUG,
  GET_INSIGHT_TOPIC_SLUGS,
  GET_INSIGHT_TAG_BY_SLUG,
  INSIGHT_SALES_TAG_SLUG,
  INSIGHT_RECRUIT_TAG_SLUG,
  INSIGHT_INITIATIVE_TAG_SLUG,
  type InsightBySlugResult,
  type InsightDetail,
  type InsightListItem,
  type InsightsAdsSettings,
  type InsightsAdsSettingsResult,
  type InsightsConnectionResult,
  type InsightTopicBySlugResult,
  type InsightTopicsSlugListResult,
  type InsightTagBySlugResult,
} from "@/lib/queries";

/** First batch size for /insights/ magazine (hero + sidebar slots + main column page-one). */
export const INSIGHTS_MAGAZINE_FIRST = 36;

/** Page size for /insights/[category]/ (numbered pagination). */
export const INSIGHT_CATEGORY_PAGE_FIRST = 8;

/** Default page size for related-list fetch and load-more chunks. */
export const INSIGHTS_LOAD_MORE_FIRST = 12;

/** WordPress mu-plugin missing insightFields.isFeatured on schema. */
function isInsightFieldsSchemaGapError(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err);
  return m.includes("isFeatured");
}

async function fetchInsightsConnection(
  first: number,
  after?: string | null,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const variables = { first, after: after ?? null };
  try {
    const data = await fetchGraphQL<InsightsConnectionResult>(GET_INSIGHTS, variables);
    const conn = data?.insights;
    return {
      nodes: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      },
    };
  } catch (err) {
    if (!isInsightFieldsSchemaGapError(err)) throw err;
    const { GET_INSIGHTS_MINIMAL: minimalQuery } = await import("@/lib/queries");
    const data = await fetchGraphQL<InsightsConnectionResult>(
      minimalQuery,
      variables,
    );
    const conn = data?.insights;
    return {
      nodes: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      },
    };
  }
}

export async function getInsightsList(): Promise<InsightListItem[]> {
  try {
    const { nodes } = await fetchInsightsConnection(100);
    return nodes;
  } catch (err) {
    console.error("[insights] getInsightsList GraphQL failed:", err);
    return [];
  }
}

export async function getInsightsMagazineBundle(): Promise<{
  posts: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const { nodes, pageInfo } = await fetchInsightsConnection(
      INSIGHTS_MAGAZINE_FIRST,
      null,
    );
    return { posts: nodes, pageInfo };
  } catch (err) {
    console.error("[insights] getInsightsMagazineBundle GraphQL failed:", err);
    return {
      posts: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/** Used by API route for “Load more” on /insights/. */
export async function fetchInsightsAfterCursor(
  after: string,
  first = INSIGHTS_LOAD_MORE_FIRST,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  return fetchInsightsConnection(first, after);
}

export async function getInsightsAdsSettings(): Promise<InsightsAdsSettings | null> {
  try {
    const data = await fetchGraphQL<InsightsAdsSettingsResult>(
      GET_INSIGHTS_ADS_SETTINGS,
    );
    return data?.insightsAdsSettings ?? null;
  } catch (err) {
    console.error("[insights] getInsightsAdsSettings GraphQL failed:", err);
    return null;
  }
}

export async function getInsightBySlug(slug: string): Promise<InsightDetail | null> {
  try {
    const data = await fetchGraphQL<InsightBySlugResult>(GET_INSIGHT_BY_SLUG, {
      slug,
    });
    if (data?.insight?.slug) {
      return data.insight;
    }
    return null;
  } catch (err) {
    if (!isInsightFieldsSchemaGapError(err)) {
      console.error("[insights] getInsightBySlug GraphQL failed:", err);
      return null;
    }
    try {
      const { GET_INSIGHT_BY_SLUG_MINIMAL: minimalQuery } =
        await import("@/lib/queries");
      const data = await fetchGraphQL<InsightBySlugResult>(minimalQuery, {
        slug,
      });
      if (data?.insight?.slug) {
        return data.insight;
      }
    } catch (err2) {
      console.error("[insights] getInsightBySlug minimal GraphQL failed:", err2);
    }
    return null;
  }
}

export function getPrimaryInsightTopicSlug(
  post: Pick<InsightDetail, "insightTopics"> | Pick<InsightListItem, "insightTopics">,
): string | null {
  return post.insightTopics?.nodes?.[0]?.slug?.trim() || null;
}

export function getCanonicalInsightPath(post: InsightDetail): string | null {
  const slug = post.slug?.trim();
  const topicSlug = getPrimaryInsightTopicSlug(post);

  if (!slug || !topicSlug) return null;

  return `/insights/${topicSlug}/${slug}/`;
}

export async function getInsightTopicSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<InsightTopicsSlugListResult>(
      GET_INSIGHT_TOPIC_SLUGS,
      { first: 100 },
    );
    return (data?.insightTopics?.nodes ?? [])
      .map((n) => n.slug?.trim())
      .filter((s): s is string => Boolean(s));
  } catch (err) {
    console.error("[insights] getInsightTopicSlugs failed:", err);
    return [];
  }
}

/** Max nodes per GraphQL request when advancing the cursor to reach a page offset. */
const INSIGHT_TOPIC_CURSOR_BATCH = 80;

export type InsightCategoryPageData = {
  topicName: string | null;
  topicSlug: string;
  posts: InsightListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  endCursor: string | null;
};

async function fetchInsightTopicBySlugResult(
  slug: string,
  first: number,
  after: string | null,
): Promise<InsightTopicBySlugResult> {
  const variables = { slug, first, after };
  try {
    return await fetchGraphQL<InsightTopicBySlugResult>(
      GET_INSIGHT_TOPIC_BY_SLUG,
      variables,
    );
  } catch (err) {
    if (!isInsightFieldsSchemaGapError(err)) throw err;
    const { GET_INSIGHT_TOPIC_BY_SLUG_MINIMAL: minimalQuery } =
      await import("@/lib/queries");
    return await fetchGraphQL<InsightTopicBySlugResult>(minimalQuery, variables);
  }
}

async function fetchInsightTopicInsightsSlice(
  slug: string,
  first: number,
  after: string | null,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchInsightTopicBySlugResult(slug, first, after);
  const conn = data?.insightTopic?.insights;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

/**
 * Returns the connection cursor immediately after skipping `skip` posts (for same sort as paged queries).
 */
async function cursorAfterSkippingTopicPosts(
  slug: string,
  skip: number,
): Promise<{ after: string | null; ok: boolean }> {
  if (skip <= 0) return { after: null, ok: true };
  let after: string | null = null;
  let remaining = skip;
  while (remaining > 0) {
    const batch = Math.min(remaining, INSIGHT_TOPIC_CURSOR_BATCH);
    const { nodes, pageInfo } = await fetchInsightTopicInsightsSlice(slug, batch, after);
    if (nodes.length === 0) {
      return { after: null, ok: false };
    }
    remaining -= nodes.length;
    after = pageInfo.endCursor ?? null;
    if (!pageInfo.hasNextPage && remaining > 0) {
      return { after: null, ok: false };
    }
  }
  return { after, ok: true };
}

export const getInsightCategoryPageData = cache(async function getInsightCategoryPageData(
  slug: string,
  page: number,
): Promise<InsightCategoryPageData | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const safePage =
    Number.isFinite(page) && page >= 1
      ? Math.min(Math.floor(page), 1_000_000)
      : 1;
  const pageSize = INSIGHT_CATEGORY_PAGE_FIRST;

  try {
    const skipOffset = (safePage - 1) * pageSize;
    const { after: afterSkip, ok: skipOk } = await cursorAfterSkippingTopicPosts(
      trimmed,
      skipOffset,
    );
    if (!skipOk && skipOffset > 0) return null;

    const data = await fetchInsightTopicBySlugResult(
      trimmed,
      pageSize,
      skipOffset === 0 ? null : afterSkip,
    );
    const topic = data?.insightTopic;
    if (!topic?.slug?.trim()) return null;

    const totalCount = Math.max(0, topic.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
    if (safePage > totalPages) return null;

    const conn = topic.insights;
    const posts = conn?.nodes ?? [];
    const pageInfo = conn?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    };

    return {
      topicName: topic.name?.trim() ?? null,
      topicSlug: topic.slug.trim(),
      posts,
      totalCount,
      currentPage: safePage,
      pageSize,
      totalPages,
      hasNextPage: pageInfo.hasNextPage,
      endCursor: pageInfo.endCursor,
    };
  } catch (err) {
    console.error("[insights] getInsightCategoryPageData failed:", err);
    return null;
  }
});

/** First batch for Sales-tagged magazine posts on the leaderboard page. */
export const INSIGHTS_SALES_MAGAZINE_FIRST = 12;

async function fetchInsightTagBySlugResult(
  slug: string,
  first: number,
  after: string | null,
): Promise<InsightTagBySlugResult> {
  const variables = { slug, first, after };
  try {
    return await fetchGraphQL<InsightTagBySlugResult>(GET_INSIGHT_TAG_BY_SLUG, variables);
  } catch (err) {
    if (!isInsightFieldsSchemaGapError(err)) throw err;
    const { GET_INSIGHT_TAG_BY_SLUG_MINIMAL: minimalQuery } = await import("@/lib/queries");
    return await fetchGraphQL<InsightTagBySlugResult>(minimalQuery, variables);
  }
}

export async function getInsightsSalesMagazineBundle(): Promise<{
  posts: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchInsightTagBySlugResult(
      INSIGHT_SALES_TAG_SLUG,
      INSIGHTS_SALES_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.insightTag?.insights;
    return {
      posts: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  } catch (err) {
    console.error("[insights] getInsightsSalesMagazineBundle failed:", err);
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function fetchInsightsSalesAfterCursor(
  after: string,
  first = INSIGHTS_LOAD_MORE_FIRST,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchInsightTagBySlugResult(INSIGHT_SALES_TAG_SLUG, first, after);
  const conn = data?.insightTag?.insights;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

/** First batch for Recruit-tagged magazine posts on the Recruiting Hub page. */
export const INSIGHTS_RECRUIT_MAGAZINE_FIRST = 12;

export async function getInsightsRecruitMagazineBundle(): Promise<{
  posts: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchInsightTagBySlugResult(
      INSIGHT_RECRUIT_TAG_SLUG,
      INSIGHTS_RECRUIT_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.insightTag?.insights;
    return {
      posts: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  } catch (err) {
    console.error("[insights] getInsightsRecruitMagazineBundle failed:", err);
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function fetchInsightsRecruitAfterCursor(
  after: string,
  first = INSIGHTS_LOAD_MORE_FIRST,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchInsightTagBySlugResult(INSIGHT_RECRUIT_TAG_SLUG, first, after);
  const conn = data?.insightTag?.insights;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

/** First batch for Initiative-tagged magazine posts on the Sales Success page. */
export const INSIGHTS_INITIATIVE_MAGAZINE_FIRST = 12;

export async function getInsightsInitiativeMagazineBundle(): Promise<{
  posts: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchInsightTagBySlugResult(
      INSIGHT_INITIATIVE_TAG_SLUG,
      INSIGHTS_INITIATIVE_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.insightTag?.insights;
    return {
      posts: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  } catch (err) {
    console.error("[insights] getInsightsInitiativeMagazineBundle failed:", err);
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function fetchInsightsInitiativeAfterCursor(
  after: string,
  first = INSIGHTS_LOAD_MORE_FIRST,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchInsightTagBySlugResult(INSIGHT_INITIATIVE_TAG_SLUG, first, after);
  const conn = data?.insightTag?.insights;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

export async function fetchInsightCategoryAfterCursor(
  topicSlug: string,
  after: string,
  first = INSIGHTS_LOAD_MORE_FIRST,
): Promise<{
  nodes: InsightListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const slug = topicSlug.trim();
  if (!slug) {
    return {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
  const data = await fetchInsightTopicBySlugResult(slug, first, after);
  const conn = data?.insightTopic?.insights;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}
