/**
 * ideaXchange magazine — dedicated `ideaxchange_article` CPT (gated content, own tags).
 * Falls back to public Insights CPT while ideaxchange_article posts are being populated.
 */
import { cache } from "react";
import { fetchGraphQL, fetchGraphQLWithTimeout, isWpGraphqlConfigured } from "@/lib/wp-client";
import type { InsightDetail, InsightListItem } from "@/lib/queries";
import {
  fetchInsightCategoryAfterCursor,
  fetchInsightsAfterCursor,
  fetchInsightsSalesAfterCursor,
  fetchInsightsRecruitAfterCursor,
  fetchInsightsInitiativeAfterCursor,
  getInsightBySlug,
  getInsightCategoryPageData,
  getInsightsList,
  getInsightsMagazineBundle,
  getInsightsSalesMagazineBundle,
  getInsightsRecruitMagazineBundle,
  getInsightsInitiativeMagazineBundle,
  getInsightTopicSlugs,
  INSIGHT_CATEGORY_PAGE_FIRST,
  INSIGHTS_LOAD_MORE_FIRST,
  INSIGHTS_MAGAZINE_FIRST,
  INSIGHTS_SALES_MAGAZINE_FIRST,
  INSIGHTS_RECRUIT_MAGAZINE_FIRST,
  INSIGHTS_INITIATIVE_MAGAZINE_FIRST,
} from "@/lib/insights-data";
import { getMockSalesMagazineBundle, getMockSalesMagazineAfterCursor } from "@/lib/ideaxchange-sales-magazine-mock";
import { getMockRecruitMagazineBundle, getMockRecruitMagazineAfterCursor } from "@/lib/ideaxchange-recruit-magazine-mock";
import { getMockInitiativeMagazineBundle, getMockInitiativeMagazineAfterCursor, getMockInitiativeArticleBySlug } from "@/lib/ideaxchange-initiative-magazine-mock";
import {
  GET_IDEAXCHANGE_ARTICLES,
  GET_IDEAXCHANGE_ARTICLES_MINIMAL,
  GET_IDEAXCHANGE_BY_SLUG,
  GET_IDEAXCHANGE_BY_SLUG_MINIMAL,
  GET_IDEAXCHANGE_TAG_BY_SLUG,
  GET_IDEAXCHANGE_TAG_BY_SLUG_MINIMAL,
  GET_IDEAXCHANGE_TOPIC_BY_SLUG,
  GET_IDEAXCHANGE_TOPIC_BY_SLUG_MINIMAL,
  GET_IDEAXCHANGE_TOPIC_SLUGS,
  IDEAXCHANGE_RECRUIT_TAG_SLUG,
  IDEAXCHANGE_SALES_TAG_SLUG,
  IDEAXCHANGE_INITIATIVE_TAG_SLUG,
  type IdeaxchangeBySlugResult,
  type IdeaxchangeConnectionResult,
  type IdeaxchangeDetail,
  type IdeaxchangeListItem,
  type IdeaxchangeTagBySlugResult,
  type IdeaxchangeTopicBySlugResult,
  type IdeaxchangeTopicsSlugListResult,
} from "@/lib/ideaxchange-queries";

export const IDEAXCHANGE_MAGAZINE_FIRST = INSIGHTS_MAGAZINE_FIRST;
export const IDEAXCHANGE_CATEGORY_PAGE_FIRST = INSIGHT_CATEGORY_PAGE_FIRST;
export const IDEAXCHANGE_LOAD_MORE_FIRST = INSIGHTS_LOAD_MORE_FIRST;

export { IDEAXCHANGE_SALES_TAG_SLUG, IDEAXCHANGE_RECRUIT_TAG_SLUG, IDEAXCHANGE_INITIATIVE_TAG_SLUG };

function isIdeaxchangeFieldsSchemaGapError(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err);
  return m.includes("isFeatured");
}

function mapInsightListItem(post: InsightListItem): IdeaxchangeListItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    ideaxchangeFields: post.insightFields
      ? {
          isSpotlight: post.insightFields.isSpotlight,
          isFeatured: post.insightFields.isFeatured,
        }
      : null,
    ideaxchangeTopics: post.insightTopics,
    featuredImage: post.featuredImage,
  };
}

function mapInsightDetail(post: InsightDetail): IdeaxchangeDetail {
  return {
    ...mapInsightListItem(post),
    content: post.content,
    seo: post.seo,
  };
}

async function fetchIdeaxchangeArticlesConnection(
  first: number,
  after?: string | null,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const variables = { first, after: after ?? null };
  try {
    const data = await fetchGraphQL<IdeaxchangeConnectionResult>(
      GET_IDEAXCHANGE_ARTICLES,
      variables,
    );
    const conn = data?.ideaxchangeArticles;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) {
      console.error("[ideaxchange] fetchIdeaxchangeArticlesConnection failed:", err);
    } else {
      try {
        const data = await fetchGraphQL<IdeaxchangeConnectionResult>(
          GET_IDEAXCHANGE_ARTICLES_MINIMAL,
          variables,
        );
        const conn = data?.ideaxchangeArticles;
        const nodes = conn?.nodes ?? [];
        if (nodes.length > 0) {
          return {
            nodes,
            pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
          };
        }
      } catch (err2) {
        console.error("[ideaxchange] fetchIdeaxchangeArticlesConnection minimal failed:", err2);
      }
    }
  }

  if (!after) {
    const bundle = await getInsightsMagazineBundle();
    if (bundle.posts.length > 0) {
      return {
        nodes: bundle.posts.map(mapInsightListItem),
        pageInfo: bundle.pageInfo,
      };
    }
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }

  const { nodes, pageInfo } = await fetchInsightsAfterCursor(after, first);
  return { nodes: nodes.map(mapInsightListItem), pageInfo };
}

async function fetchIdeaxchangeTagBySlugResult(
  slug: string,
  first: number,
  after: string | null,
): Promise<IdeaxchangeTagBySlugResult> {
  const variables = { slug, first, after };
  try {
    return await fetchGraphQL<IdeaxchangeTagBySlugResult>(
      GET_IDEAXCHANGE_TAG_BY_SLUG,
      variables,
    );
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) throw err;
    return fetchGraphQL<IdeaxchangeTagBySlugResult>(
      GET_IDEAXCHANGE_TAG_BY_SLUG_MINIMAL,
      variables,
    );
  }
}

export async function getIdeaxchangeList(): Promise<IdeaxchangeListItem[]> {
  const { nodes } = await fetchIdeaxchangeArticlesConnection(100);
  if (nodes.length > 0) return nodes;
  const posts = await getInsightsList();
  return posts.map(mapInsightListItem);
}

export async function getIdeaxchangeMagazineBundle(): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { nodes, pageInfo } = await fetchIdeaxchangeArticlesConnection(
    IDEAXCHANGE_MAGAZINE_FIRST,
    null,
  );
  return { posts: nodes, pageInfo };
}

export async function fetchIdeaxchangeAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  return fetchIdeaxchangeArticlesConnection(first, after);
}

export async function getIdeaxchangeArticleBySlug(
  slug: string,
): Promise<IdeaxchangeDetail | null> {
  try {
    const data = await fetchGraphQL<IdeaxchangeBySlugResult>(GET_IDEAXCHANGE_BY_SLUG, { slug });
    if (data?.ideaxchangeArticle?.slug) return data.ideaxchangeArticle;
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) {
      console.error("[ideaxchange] getIdeaxchangeArticleBySlug failed:", err);
    } else {
      try {
        const data = await fetchGraphQL<IdeaxchangeBySlugResult>(
          GET_IDEAXCHANGE_BY_SLUG_MINIMAL,
          { slug },
        );
        if (data?.ideaxchangeArticle?.slug) return data.ideaxchangeArticle;
      } catch (err2) {
        console.error("[ideaxchange] getIdeaxchangeArticleBySlug minimal failed:", err2);
      }
    }
  }

  const post = await getInsightBySlug(slug);
  return post ? mapInsightDetail(post) : null;
}

/** Single article for Sales Success — WP with short timeout, then mock fallback. */
export async function getIdeaxchangeInitiativeArticleBySlug(
  slug: string,
): Promise<IdeaxchangeDetail | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const mock = getMockInitiativeArticleBySlug(trimmed);

  if (isWpGraphqlConfigured()) {
    try {
      const data = await fetchGraphQLWithTimeout<IdeaxchangeBySlugResult>(
        GET_IDEAXCHANGE_BY_SLUG,
        { slug: trimmed },
      );
      if (data?.ideaxchangeArticle?.slug) return data.ideaxchangeArticle;
    } catch (err) {
      if (isIdeaxchangeFieldsSchemaGapError(err)) {
        try {
          const data = await fetchGraphQLWithTimeout<IdeaxchangeBySlugResult>(
            GET_IDEAXCHANGE_BY_SLUG_MINIMAL,
            { slug: trimmed },
          );
          if (data?.ideaxchangeArticle?.slug) return data.ideaxchangeArticle;
        } catch (minimalErr) {
          console.error("[ideaxchange] getIdeaxchangeInitiativeArticleBySlug minimal failed:", minimalErr);
        }
      } else {
        console.error("[ideaxchange] getIdeaxchangeInitiativeArticleBySlug failed:", err);
      }
    }
  }

  return mock;
}

export async function getIdeaxchangeTopicSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<IdeaxchangeTopicsSlugListResult>(
      GET_IDEAXCHANGE_TOPIC_SLUGS,
      { first: 100 },
    );
    const slugs = (data?.ideaxchangeTopics?.nodes ?? [])
      .map((n) => n.slug?.trim())
      .filter((s): s is string => Boolean(s));
    if (slugs.length > 0) return slugs;
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeTopicSlugs failed:", err);
  }
  return getInsightTopicSlugs();
}

export type IdeaxchangeCategoryPageData = {
  topicName: string | null;
  topicSlug: string;
  posts: IdeaxchangeListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  endCursor: string | null;
};

const IDEAXCHANGE_TOPIC_CURSOR_BATCH = 80;

async function fetchIdeaxchangeTopicBySlugResult(
  slug: string,
  first: number,
  after: string | null,
): Promise<IdeaxchangeTopicBySlugResult> {
  const variables = { slug, first, after };
  try {
    return await fetchGraphQL<IdeaxchangeTopicBySlugResult>(
      GET_IDEAXCHANGE_TOPIC_BY_SLUG,
      variables,
    );
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) throw err;
    return fetchGraphQL<IdeaxchangeTopicBySlugResult>(
      GET_IDEAXCHANGE_TOPIC_BY_SLUG_MINIMAL,
      variables,
    );
  }
}

async function fetchIdeaxchangeTopicArticlesSlice(
  slug: string,
  first: number,
  after: string | null,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeTopicBySlugResult(slug, first, after);
  const conn = data?.ideaxchangeTopic?.ideaxchangeArticles;
  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

async function cursorAfterSkippingIdeaxchangeTopicPosts(
  slug: string,
  skip: number,
): Promise<{ after: string | null; ok: boolean }> {
  if (skip <= 0) return { after: null, ok: true };
  let cursor: string | null = null;
  let remaining = skip;
  while (remaining > 0) {
    const batch = Math.min(remaining, IDEAXCHANGE_TOPIC_CURSOR_BATCH);
    const { nodes, pageInfo } = await fetchIdeaxchangeTopicArticlesSlice(slug, batch, cursor);
    if (nodes.length === 0) return { after: null, ok: false };
    remaining -= nodes.length;
    cursor = pageInfo.endCursor ?? null;
    if (!pageInfo.hasNextPage && remaining > 0) return { after: null, ok: false };
  }
  return { after: cursor, ok: true };
}

export const getIdeaxchangeCategoryPageData = cache(async function getIdeaxchangeCategoryPageData(
  slug: string,
  page: number,
): Promise<IdeaxchangeCategoryPageData | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const safePage =
    Number.isFinite(page) && page >= 1
      ? Math.min(Math.floor(page), 1_000_000)
      : 1;
  const pageSize = IDEAXCHANGE_CATEGORY_PAGE_FIRST;

  try {
    const skipOffset = (safePage - 1) * pageSize;
    const { after: afterSkip, ok: skipOk } = await cursorAfterSkippingIdeaxchangeTopicPosts(
      trimmed,
      skipOffset,
    );
    if (!skipOk && skipOffset > 0) return null;

    const data = await fetchIdeaxchangeTopicBySlugResult(trimmed, pageSize, afterSkip);
    const topic = data?.ideaxchangeTopic;
    if (!topic?.slug) return null;

    const conn = topic.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];
    const totalCount = topic.count ?? posts.length;
    if (posts.length === 0 && totalCount === 0) return null;

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    return {
      topicName: topic.name?.trim() ?? null,
      topicSlug: topic.slug.trim(),
      posts,
      totalCount,
      currentPage: safePage,
      pageSize,
      totalPages,
      hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      endCursor: conn?.pageInfo?.endCursor ?? null,
    };
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeCategoryPageData failed:", err);
  }

  const data = await getInsightCategoryPageData(trimmed, safePage);
  if (!data) return null;
  return {
    ...data,
    posts: data.posts.map(mapInsightListItem),
  };
});

export async function fetchIdeaxchangeCategoryAfterCursor(
  topicSlug: string,
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchGraphQL<IdeaxchangeTopicBySlugResult>(
      GET_IDEAXCHANGE_TOPIC_BY_SLUG,
      { slug: topicSlug, first, after },
    );
    const conn = data?.ideaxchangeTopic?.ideaxchangeArticles;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeCategoryAfterCursor failed:", err);
  }

  const { nodes, pageInfo } = await fetchInsightCategoryAfterCursor(topicSlug, after, first);
  return { nodes: nodes.map(mapInsightListItem), pageInfo };
}

/** ideaXchange-tagged Sales posts — leaderboard & carrier spotlight sidebars. */
export async function getIdeaxchangeSalesMagazineBundle(): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_SALES_TAG_SLUG,
      INSIGHTS_SALES_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];
    if (posts.length > 0) {
      return {
        posts,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeSalesMagazineBundle failed:", err);
  }

  const { posts, pageInfo } = await getInsightsSalesMagazineBundle();
  if (posts.length > 0) {
    return { posts: posts.map(mapInsightListItem), pageInfo };
  }
  return getMockSalesMagazineBundle();
}

export async function fetchIdeaxchangeSalesAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(IDEAXCHANGE_SALES_TAG_SLUG, first, after);
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeSalesAfterCursor failed:", err);
  }

  try {
    const { nodes, pageInfo } = await fetchInsightsSalesAfterCursor(after, first);
    if (nodes.length > 0) {
      return { nodes: nodes.map(mapInsightListItem), pageInfo };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeSalesAfterCursor insights failed:", err);
  }

  const mock = getMockSalesMagazineAfterCursor(after);
  return { nodes: mock.nodes, pageInfo: mock.pageInfo };
}

/** ideaXchange-tagged Recruit posts — recruiting hub blog section. */
export async function getIdeaxchangeRecruitMagazineBundle(): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_RECRUIT_TAG_SLUG,
      INSIGHTS_RECRUIT_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];
    if (posts.length > 0) {
      return {
        posts,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeRecruitMagazineBundle failed:", err);
  }

  const { posts, pageInfo } = await getInsightsRecruitMagazineBundle();
  if (posts.length > 0) {
    return { posts: posts.map(mapInsightListItem), pageInfo };
  }
  return getMockRecruitMagazineBundle();
}

export async function fetchIdeaxchangeRecruitAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_RECRUIT_TAG_SLUG,
      first,
      after,
    );
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeRecruitAfterCursor failed:", err);
  }

  try {
    const { nodes, pageInfo } = await fetchInsightsRecruitAfterCursor(after, first);
    if (nodes.length > 0) {
      return { nodes: nodes.map(mapInsightListItem), pageInfo };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeRecruitAfterCursor insights failed:", err);
  }

  const mock = getMockRecruitMagazineAfterCursor(after);
  return { nodes: mock.nodes, pageInfo: mock.pageInfo };
}

/** ideaXchange-tagged Initiative posts — Sales Success vertical. */
async function fetchIdeaxchangeInitiativeTagBySlugResult(
  first: number,
  after: string | null,
): Promise<IdeaxchangeTagBySlugResult | null> {
  const variables = {
    slug: IDEAXCHANGE_INITIATIVE_TAG_SLUG,
    first,
    after,
  };

  if (!isWpGraphqlConfigured()) return null;

  try {
    return await fetchGraphQLWithTimeout<IdeaxchangeTagBySlugResult>(
      GET_IDEAXCHANGE_TAG_BY_SLUG,
      variables,
    );
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) return null;
    try {
      return await fetchGraphQLWithTimeout<IdeaxchangeTagBySlugResult>(
        GET_IDEAXCHANGE_TAG_BY_SLUG_MINIMAL,
        variables,
      );
    } catch {
      return null;
    }
  }
}

export async function getIdeaxchangeInitiativeMagazineBundle(): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeInitiativeTagBySlugResult(
    INSIGHTS_INITIATIVE_MAGAZINE_FIRST,
    null,
  );
  const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
  const posts = conn?.nodes ?? [];
  if (posts.length > 0) {
    return {
      posts,
      pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  }

  try {
    const { posts: insightPosts, pageInfo } = await getInsightsInitiativeMagazineBundle();
    if (insightPosts.length > 0) {
      return { posts: insightPosts.map(mapInsightListItem), pageInfo };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeInitiativeMagazineBundle insights failed:", err);
  }

  return getMockInitiativeMagazineBundle();
}

export async function fetchIdeaxchangeInitiativeAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeInitiativeTagBySlugResult(first, after);
  const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
  const nodes = conn?.nodes ?? [];
  if (nodes.length > 0) {
    return {
      nodes,
      pageInfo: conn?.pageInfo ?? { hasNextPage: false, endCursor: null },
    };
  }

  try {
    const { nodes: insightNodes, pageInfo } = await fetchInsightsInitiativeAfterCursor(after, first);
    if (insightNodes.length > 0) {
      return { nodes: insightNodes.map(mapInsightListItem), pageInfo };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeInitiativeAfterCursor insights failed:", err);
  }

  const mock = getMockInitiativeMagazineAfterCursor(after);
  return { nodes: mock.nodes, pageInfo: mock.pageInfo };
}
