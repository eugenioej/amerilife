/**
 * Temporary: ideaXchange magazine reads from the Insights CPT until
 * ideaxchange_article posts exist in WordPress. Swap back to GraphQL in
 * ideaxchange-queries when the dedicated CPT is populated.
 */
import { cache } from "react";
import type { InsightDetail, InsightListItem } from "@/lib/queries";
import {
  fetchInsightCategoryAfterCursor,
  fetchInsightsAfterCursor,
  getInsightBySlug,
  getInsightCategoryPageData,
  getInsightsList,
  getInsightsMagazineBundle,
  getInsightTopicSlugs,
  INSIGHT_CATEGORY_PAGE_FIRST,
  INSIGHTS_LOAD_MORE_FIRST,
  INSIGHTS_MAGAZINE_FIRST,
} from "@/lib/insights-data";
import type { IdeaxchangeDetail, IdeaxchangeListItem } from "@/lib/ideaxchange-queries";

export const IDEAXCHANGE_MAGAZINE_FIRST = INSIGHTS_MAGAZINE_FIRST;
export const IDEAXCHANGE_CATEGORY_PAGE_FIRST = INSIGHT_CATEGORY_PAGE_FIRST;
export const IDEAXCHANGE_LOAD_MORE_FIRST = INSIGHTS_LOAD_MORE_FIRST;

function mapListItem(post: InsightListItem): IdeaxchangeListItem {
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

function mapDetail(post: InsightDetail): IdeaxchangeDetail {
  return {
    ...mapListItem(post),
    content: post.content,
    seo: post.seo,
  };
}

export async function getIdeaxchangeList(): Promise<IdeaxchangeListItem[]> {
  const posts = await getInsightsList();
  return posts.map(mapListItem);
}

export async function getIdeaxchangeMagazineBundle(): Promise<{
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { posts, pageInfo } = await getInsightsMagazineBundle();
  return { posts: posts.map(mapListItem), pageInfo };
}

export async function fetchIdeaxchangeAfterCursor(
  after: string,
  first = IDEAXCHANGE_LOAD_MORE_FIRST,
): Promise<{
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { nodes, pageInfo } = await fetchInsightsAfterCursor(after, first);
  return { nodes: nodes.map(mapListItem), pageInfo };
}

export async function getIdeaxchangeArticleBySlug(
  slug: string,
): Promise<IdeaxchangeDetail | null> {
  const post = await getInsightBySlug(slug);
  return post ? mapDetail(post) : null;
}

export async function getIdeaxchangeTopicSlugs(): Promise<string[]> {
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

export const getIdeaxchangeCategoryPageData = cache(async function getIdeaxchangeCategoryPageData(
  slug: string,
  page: number,
): Promise<IdeaxchangeCategoryPageData | null> {
  const data = await getInsightCategoryPageData(slug, page);
  if (!data) return null;
  return {
    ...data,
    posts: data.posts.map(mapListItem),
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
  const { nodes, pageInfo } = await fetchInsightCategoryAfterCursor(
    topicSlug,
    after,
    first,
  );
  return { nodes: nodes.map(mapListItem), pageInfo };
}
