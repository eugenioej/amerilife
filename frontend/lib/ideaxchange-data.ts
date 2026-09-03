/**
 * ideaXchange magazine — dedicated `ideaxchange_article` CPT (gated content, own tags).
 * Does not fall back to public Insights CPT; Insights remains the public site content.
 */
import { cache } from "react";
import { fetchGraphQL, fetchGraphQLWithTimeout, isWpGraphqlConfigured } from "@/lib/wp-client";
import {
  getMockSalesMagazineBundle,
  getMockSalesMagazineAfterCursor,
  MOCK_SALES_MAGAZINE_POSTS,
} from "@/lib/ideaxchange-sales-magazine-mock";
import {
  getMockRecruitMagazineBundle,
  getMockRecruitMagazineAfterCursor,
  MOCK_RECRUIT_MAGAZINE_POSTS,
} from "@/lib/ideaxchange-recruit-magazine-mock";
import {
  getMockInitiativeMagazineBundle,
  getMockInitiativeMagazineAfterCursor,
  getMockInitiativeArticleBySlug,
} from "@/lib/ideaxchange-initiative-magazine-mock";
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
  GET_IDEAXCHANGE_TAG_SLUGS,
  type IdeaxchangeTagsSlugListResult,
  type IdeaxchangeBySlugResult,
  type IdeaxchangeConnectionResult,
  type IdeaxchangeDetail,
  type IdeaxchangeListItem,
  type IdeaxchangeTagBySlugResult,
  type IdeaxchangeTopicBySlugResult,
  type IdeaxchangeTopicsSlugListResult,
} from "@/lib/ideaxchange-queries";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import {
  filterItemsByPersonaVisibility,
  isItemVisibleToPersona,
} from "@/lib/ideaxchange-visibility";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import {
  GET_IDEAXCHANGE_ADS_SETTINGS,
  type IdeaxchangeAdsSettings,
  type IdeaxchangeAdsSettingsResult,
} from "@/lib/queries";

export const IDEAXCHANGE_CAREER_SALES_TAG_SLUG = "career-sales";
export const IDEAXCHANGE_CAREER_SALES_MAGAZINE_FIRST = 12;

const RESERVED_IDEAXCHANGE_TAG_SLUGS = new Set([
  IDEAXCHANGE_INITIATIVE_TAG_SLUG,
  IDEAXCHANGE_SALES_TAG_SLUG,
  IDEAXCHANGE_CAREER_SALES_TAG_SLUG,
]);

function isReservedIdeaxchangeArticle(post: IdeaxchangeListItem): boolean {
  return (
    post.ideaxchangeTags?.nodes?.some((tag) => {
      const slug = tag.slug?.trim().toLowerCase();
      const name = tag.name?.trim().toLowerCase();

      return (
        (slug ? RESERVED_IDEAXCHANGE_TAG_SLUGS.has(slug) : false) ||
        (name ? RESERVED_IDEAXCHANGE_TAG_SLUGS.has(name) : false)
      );
    }) ?? false
  );
}

function excludeReservedIdeaxchangeArticles(
  posts: IdeaxchangeListItem[],
): IdeaxchangeListItem[] {
  return posts.filter((post) => !isReservedIdeaxchangeArticle(post));
}

function mockListItemToDetail(post: IdeaxchangeListItem): IdeaxchangeDetail {
  const body = formatInsightExcerptPlain(post.excerpt) || post.title || "";
  return {
    ...post,
    content: body ? `<p>${body}</p>` : "<p></p>",
  };
}

/** Demo article singles when the slug exists in mock sidebars but not yet in WordPress. */
function getMockIdeaxchangeArticleBySlug(slug: string): IdeaxchangeDetail | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const found = [...MOCK_SALES_MAGAZINE_POSTS, ...MOCK_RECRUIT_MAGAZINE_POSTS].find(
    (p) => p.slug === trimmed,
  );
  return found ? mockListItemToDetail(found) : null;
}

export const IDEAXCHANGE_MAGAZINE_FIRST = 36;
export const IDEAXCHANGE_CATEGORY_PAGE_FIRST = 8;
/** Page size for `/ideaxchange/home/?page=N` numbered archive (matches category archives). */
export const IDEAXCHANGE_HOME_PAGE_FIRST = IDEAXCHANGE_CATEGORY_PAGE_FIRST;
export const IDEAXCHANGE_LOAD_MORE_FIRST = 12;
export const IDEAXCHANGE_SALES_MAGAZINE_FIRST = 12;
export const IDEAXCHANGE_RECRUIT_MAGAZINE_FIRST = 12;
export const IDEAXCHANGE_INITIATIVE_MAGAZINE_FIRST = 12;

export { IDEAXCHANGE_SALES_TAG_SLUG, IDEAXCHANGE_RECRUIT_TAG_SLUG, IDEAXCHANGE_INITIATIVE_TAG_SLUG };

const EMPTY_PAGE_INFO = { hasNextPage: false, endCursor: null as string | null };

function isIdeaxchangeFieldsSchemaGapError(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err);
  return m.includes("isFeatured");
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
    return {
      nodes: conn?.nodes ?? [],
      pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
    };
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) {
      console.error("[ideaxchange] fetchIdeaxchangeArticlesConnection failed:", err);
      return { nodes: [], pageInfo: EMPTY_PAGE_INFO };
    }
    try {
      const data = await fetchGraphQL<IdeaxchangeConnectionResult>(
        GET_IDEAXCHANGE_ARTICLES_MINIMAL,
        variables,
      );
      const conn = data?.ideaxchangeArticles;
      return {
        nodes: conn?.nodes ?? [],
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    } catch (err2) {
      console.error("[ideaxchange] fetchIdeaxchangeArticlesConnection minimal failed:", err2);
      return { nodes: [], pageInfo: EMPTY_PAGE_INFO };
    }
  }
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
export async function fetchIdeaxchangeTagAfterCursor(
  tagSlug: string,
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      tagSlug,
      first,
      after,
    );

    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;

    const personaFilteredPosts = filterArticles(
      conn?.nodes ?? [],
      persona,
    );

    const visiblePosts = excludeReservedIdeaxchangeArticles(
      personaFilteredPosts,
    );

    return {
      nodes: visiblePosts,
      pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
    };
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeTagAfterCursor failed:", err);

    return {
      nodes: [],
      pageInfo: EMPTY_PAGE_INFO,
    };
  }
}


export async function getIdeaxchangeList(
  persona: IdeaxchangePersona = "brokerage",
): Promise<IdeaxchangeListItem[]> {
  const { nodes } = await fetchIdeaxchangeArticlesConnection(100);
  const personaFilteredPosts = filterArticles(nodes, persona);

  return excludeReservedIdeaxchangeArticles(personaFilteredPosts);
}

function filterArticles(
  posts: IdeaxchangeListItem[],
  persona: IdeaxchangePersona,
): IdeaxchangeListItem[] {
  return filterItemsByPersonaVisibility(posts, persona);
}

function visibleArticle(
  post: IdeaxchangeDetail | null,
  persona?: IdeaxchangePersona,
): IdeaxchangeDetail | null {
  if (!post) return null;
  if (persona && !isItemVisibleToPersona(post, persona)) return null;
  return post;
}

export async function getIdeaxchangeMagazineBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { nodes, pageInfo } = await fetchIdeaxchangeArticlesConnection(
    IDEAXCHANGE_MAGAZINE_FIRST,
    null,
  );

  const personaFilteredPosts = filterArticles(nodes, persona);
  const visiblePosts = excludeReservedIdeaxchangeArticles(personaFilteredPosts);

  return { posts: visiblePosts, pageInfo };
}

const IDEAXCHANGE_ARTICLE_CURSOR_BATCH = 80;

const getVisibleGeneralIdeaxchangeArticles = cache(
  async function getVisibleGeneralIdeaxchangeArticles(
    persona: IdeaxchangePersona,
  ): Promise<IdeaxchangeListItem[]> {
    const allPosts: IdeaxchangeListItem[] = [];
    let cursor: string | null = null;

    for (;;) {
      const { nodes, pageInfo } = await fetchIdeaxchangeArticlesConnection(
        IDEAXCHANGE_ARTICLE_CURSOR_BATCH,
        cursor,
      );

      allPosts.push(...nodes);

      if (!pageInfo.hasNextPage || !pageInfo.endCursor) break;

      cursor = pageInfo.endCursor;
    }

    const personaFilteredPosts = filterArticles(allPosts, persona);

    return excludeReservedIdeaxchangeArticles(personaFilteredPosts);
  },
);

export type IdeaxchangeHomeArchivePageData = {
  posts: IdeaxchangeListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  endCursor: string | null;
};

/** Numbered archive for `/ideaxchange/home/?page=N` (category-style pagination). */
export const getIdeaxchangeHomeArchivePageData = cache(
  async function getIdeaxchangeHomeArchivePageData(
    page: number,
    persona: IdeaxchangePersona = "brokerage",
  ): Promise<IdeaxchangeHomeArchivePageData | null> {
    const safePage =
      Number.isFinite(page) && page >= 1
        ? Math.min(Math.floor(page), 1_000_000)
        : 1;

    const pageSize = IDEAXCHANGE_HOME_PAGE_FIRST;

    try {
      const visiblePosts = await getVisibleGeneralIdeaxchangeArticles(persona);

      if (visiblePosts.length === 0) return null;

      const totalCount = visiblePosts.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      if (safePage > totalPages) return null;

      const start = (safePage - 1) * pageSize;
      const end = start + pageSize;
      const pagePosts = visiblePosts.slice(start, end);

      return {
        posts: pagePosts,
        totalCount,
        currentPage: safePage,
        pageSize,
        totalPages,
        hasNextPage: safePage < totalPages,
        endCursor: null,
      };
    } catch (err) {
      console.error("[ideaxchange] getIdeaxchangeHomeArchivePageData failed:", err);
      return null;
    }
  },
);

export async function fetchIdeaxchangeAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const result = await fetchIdeaxchangeArticlesConnection(first, after);
  const personaFilteredPosts = filterArticles(result.nodes, persona);
  const visiblePosts = excludeReservedIdeaxchangeArticles(personaFilteredPosts);
  
  return { nodes: visiblePosts, pageInfo: result.pageInfo };
}

export async function getIdeaxchangeArticleBySlug(
  slug: string,
  persona?: IdeaxchangePersona,
): Promise<IdeaxchangeDetail | null> {
  try {
    const data = await fetchGraphQL<IdeaxchangeBySlugResult>(GET_IDEAXCHANGE_BY_SLUG, { slug });
    if (data?.ideaxchangeArticle?.slug) {
      return visibleArticle(data.ideaxchangeArticle, persona);
    }
  } catch (err) {
    if (!isIdeaxchangeFieldsSchemaGapError(err)) {
      console.error("[ideaxchange] getIdeaxchangeArticleBySlug failed:", err);
    } else {
      try {
        const data = await fetchGraphQL<IdeaxchangeBySlugResult>(
          GET_IDEAXCHANGE_BY_SLUG_MINIMAL,
          { slug },
        );
        if (data?.ideaxchangeArticle?.slug) {
          return visibleArticle(data.ideaxchangeArticle, persona);
        }
      } catch (err2) {
        console.error("[ideaxchange] getIdeaxchangeArticleBySlug minimal failed:", err2);
      }
    }
  }

  const mock = getMockIdeaxchangeArticleBySlug(slug);
  return visibleArticle(mock, persona);
}

/** Single article for Sales Success — WP with short timeout, then mock fallback. */
export async function getIdeaxchangeInitiativeArticleBySlug(
  slug: string,
  persona?: IdeaxchangePersona,
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
      if (data?.ideaxchangeArticle?.slug) {
        return visibleArticle(data.ideaxchangeArticle, persona) ?? mock;
      }
    } catch (err) {
      if (isIdeaxchangeFieldsSchemaGapError(err)) {
        try {
          const data = await fetchGraphQLWithTimeout<IdeaxchangeBySlugResult>(
            GET_IDEAXCHANGE_BY_SLUG_MINIMAL,
            { slug: trimmed },
          );
          if (data?.ideaxchangeArticle?.slug) {
            return visibleArticle(data.ideaxchangeArticle, persona) ?? mock;
          }
        } catch (minimalErr) {
          console.error(
            "[ideaxchange] getIdeaxchangeInitiativeArticleBySlug minimal failed:",
            minimalErr,
          );
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
    return (data?.ideaxchangeTopics?.nodes ?? [])
      .map((n) => n.slug?.trim())
      .filter((s): s is string => Boolean(s));
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeTopicSlugs failed:", err);
    return [];
  }
}
export async function getIdeaxchangeTagSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<IdeaxchangeTagsSlugListResult>(
      GET_IDEAXCHANGE_TAG_SLUGS,
      { first: 100 },
    );

    return (data?.ideaxchangeTags?.nodes ?? [])
      .map((n) => n.slug?.trim())
      .filter((s): s is string => Boolean(s));
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeTagSlugs failed:", err);
    return [];
  }
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
const IDEAXCHANGE_TAG_CURSOR_BATCH = 80;

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
    pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
  };
}
async function fetchIdeaxchangeTagArticlesSlice(
  slug: string,
  first: number,
  after: string | null,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeTagBySlugResult(
    slug,
    first,
    after,
  );

  const conn = data?.ideaxchangeTag?.ideaxchangeArticles;

  return {
    nodes: conn?.nodes ?? [],
    pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
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
async function cursorAfterSkippingIdeaxchangeTagPosts(
  slug: string,
  skip: number,
): Promise<{ after: string | null; ok: boolean }> {
  if (skip <= 0) {
    return { after: null, ok: true };
  }

  let cursor: string | null = null;
  let remaining = skip;

  while (remaining > 0) {
    const batch = Math.min(
      remaining,
      IDEAXCHANGE_TAG_CURSOR_BATCH,
    );

    const { nodes, pageInfo } =
      await fetchIdeaxchangeTagArticlesSlice(
        slug,
        batch,
        cursor,
      );

    if (nodes.length === 0) {
      return { after: null, ok: false };
    }

    remaining -= nodes.length;
    cursor = pageInfo.endCursor ?? null;

    if (!pageInfo.hasNextPage && remaining > 0) {
      return { after: null, ok: false };
    }
  }

  return {
    after: cursor,
    ok: true,
  };
}
export const getIdeaxchangeCategoryPageData = cache(async function getIdeaxchangeCategoryPageData(
  slug: string,
  page: number,
  persona: IdeaxchangePersona = "brokerage",
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
    const personaFilteredPosts = filterArticles(posts, persona);
    const visiblePosts = excludeReservedIdeaxchangeArticles(personaFilteredPosts);
      
    return {
      topicName: topic.name?.trim() ?? null,
      topicSlug: topic.slug.trim(),
      posts: visiblePosts,
      totalCount,
      currentPage: safePage,
      pageSize,
      totalPages,
      hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      endCursor: conn?.pageInfo?.endCursor ?? null,
    };
      } catch (err) {
        console.error("[ideaxchange] getIdeaxchangeCategoryPageData failed:", err);
        return null;
      }
    });
    
    export async function fetchIdeaxchangeCategoryAfterCursor(
      topicSlug: string,
      after: string,
      first = IDEAXCHANGE_LOAD_MORE_FIRST,
      persona: IdeaxchangePersona = "brokerage",
    ): Promise<{
      nodes: IdeaxchangeListItem[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    }> {
      try {
        const data = await fetchIdeaxchangeTopicBySlugResult(topicSlug, first, after);
        const conn = data?.ideaxchangeTopic?.ideaxchangeArticles;
        const personaFilteredPosts = filterArticles(conn?.nodes ?? [], persona);
        const visiblePosts = excludeReservedIdeaxchangeArticles(personaFilteredPosts);

        return {
          nodes: visiblePosts,
          pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
        };
      } catch (err) {
        console.error("[ideaxchange] fetchIdeaxchangeCategoryAfterCursor failed:", err);
        return { nodes: [], pageInfo: EMPTY_PAGE_INFO };
      }
    }

/** ideaXchange-tagged Sales articles — leaderboard & carrier spotlight sidebars. */
export async function getIdeaxchangeSalesMagazineBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_SALES_TAG_SLUG,
      IDEAXCHANGE_SALES_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];

    if (posts.length > 0) {
      return {
        posts: filterArticles(posts, persona),
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeSalesMagazineBundle failed:", err);
  }

  const mock = getMockSalesMagazineBundle();
  return { posts: filterArticles(mock.posts, persona), pageInfo: mock.pageInfo };
}

/** ideaXchange-tagged Career Sales articles — career leaderboard hero grid. */
export async function getIdeaxchangeCareerSalesMagazineBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_CAREER_SALES_TAG_SLUG,
      IDEAXCHANGE_CAREER_SALES_MAGAZINE_FIRST,
      null,
    );

    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];

    if (posts.length > 0) {
      return {
        posts: filterArticles(posts, persona),
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeCareerSalesMagazineBundle failed:", err);
  }

  return { posts: [], pageInfo: EMPTY_PAGE_INFO };
}

export async function fetchIdeaxchangeSalesAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
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
        nodes: filterArticles(nodes, persona),
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeSalesAfterCursor failed:", err);
  }

  const mock = getMockSalesMagazineAfterCursor(after);
  return { nodes: filterArticles(mock.nodes, persona), pageInfo: mock.pageInfo };
}

/** ideaXchange-tagged Recruit articles — recruiting hub blog section. */
export async function getIdeaxchangeRecruitMagazineBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const data = await fetchIdeaxchangeTagBySlugResult(
      IDEAXCHANGE_RECRUIT_TAG_SLUG,
      IDEAXCHANGE_RECRUIT_MAGAZINE_FIRST,
      null,
    );
    const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
    const posts = conn?.nodes ?? [];
    if (posts.length > 0) {
      return {
        posts: filterArticles(posts, persona),
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    }
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeRecruitMagazineBundle failed:", err);
  }

  const mock = getMockRecruitMagazineBundle();
  return { posts: filterArticles(mock.posts, persona), pageInfo: mock.pageInfo };
}

export async function fetchIdeaxchangeRecruitAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
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
        nodes: filterArticles(nodes, persona),
        pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
      };
    }
  } catch (err) {
    console.error("[ideaxchange] fetchIdeaxchangeRecruitAfterCursor failed:", err);
  }

  const mock = getMockRecruitMagazineAfterCursor(after);
  return { nodes: filterArticles(mock.nodes, persona), pageInfo: mock.pageInfo };
}

export type IdeaxchangeTagPageData = {
  tagName: string | null;
  tagSlug: string;
  posts: IdeaxchangeListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  endCursor: string | null;
};

/** ideaXchange-tagged Initiative articles — Sales Success vertical. */
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
export const getIdeaxchangeTagPageData = cache(
  async function getIdeaxchangeTagPageData(
    slug: string,
    page: number,
    persona: IdeaxchangePersona = "brokerage",
  ): Promise<IdeaxchangeTagPageData | null> {
    const trimmed = slug.trim();
    if (!trimmed) return null;

    const safePage =
      Number.isFinite(page) && page >= 1
        ? Math.min(Math.floor(page), 1_000_000)
        : 1;

    const pageSize = IDEAXCHANGE_CATEGORY_PAGE_FIRST;

    try {
      const skipOffset = (safePage - 1) * pageSize;

      const { after: afterSkip, ok: skipOk } =
        await cursorAfterSkippingIdeaxchangeTagPosts(
          trimmed,
          skipOffset,
        );

      if (!skipOk && skipOffset > 0) {
        return null;
      }

      const data = await fetchIdeaxchangeTagBySlugResult(
        trimmed,
        pageSize,
        afterSkip,
      );
      const tag = data?.ideaxchangeTag;

      if (!tag?.slug) return null;

      const conn = tag.ideaxchangeArticles;
      const posts = conn?.nodes ?? [];
      

      const totalCount = tag.count ?? posts.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      const personaFilteredPosts = filterArticles(posts, persona);
      const visiblePosts = excludeReservedIdeaxchangeArticles(
        personaFilteredPosts,
      );

      return {
        tagName: tag.name?.trim() ?? null,
        tagSlug: tag.slug.trim(),
        posts: visiblePosts,
        totalCount,
        currentPage: safePage,
        pageSize,
        totalPages,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
        endCursor: conn?.pageInfo?.endCursor ?? null,
      };
    } catch (err) {
      console.error("[ideaxchange] getIdeaxchangeTagPageData failed:", err);
      return null;
    }
  },
);


export async function getIdeaxchangeInitiativeMagazineBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeInitiativeTagBySlugResult(
    IDEAXCHANGE_INITIATIVE_MAGAZINE_FIRST,
    null,
  );
  const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
  const posts = conn?.nodes ?? [];
  if (posts.length > 0) {
    return {
      posts: filterArticles(posts, persona),
      pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
    };
  }

  const mock = getMockInitiativeMagazineBundle();
  return { posts: filterArticles(mock.posts, persona), pageInfo: mock.pageInfo };
}

export async function fetchIdeaxchangeInitiativeAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await fetchIdeaxchangeInitiativeTagBySlugResult(first, after);
  const conn = data?.ideaxchangeTag?.ideaxchangeArticles;
  const nodes = conn?.nodes ?? [];
  if (nodes.length > 0) {
    return {
      nodes: filterArticles(nodes, persona),
      pageInfo: conn?.pageInfo ?? EMPTY_PAGE_INFO,
    };
  }

  const mock = getMockInitiativeMagazineAfterCursor(after);
  return { nodes: filterArticles(mock.nodes, persona), pageInfo: mock.pageInfo };
}

export async function getIdeaxchangeAdsSettings(): Promise<IdeaxchangeAdsSettings | null> {
  try {
    const data = await fetchGraphQL<IdeaxchangeAdsSettingsResult>(
      GET_IDEAXCHANGE_ADS_SETTINGS,
    );
    return data?.ideaxchangeAdsSettings ?? null;
  } catch (err) {
    console.error("[ideaxchange] getIdeaxchangeAdsSettings GraphQL failed:", err);
    return null;
  }
}
