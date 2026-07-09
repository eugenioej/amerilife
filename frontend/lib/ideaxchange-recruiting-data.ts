import { cache } from "react";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_CASE_STUDIES,
  GET_CASE_STUDY_BY_SLUG,
  GET_COMPANY_BY_SLUG,
  type CaseStudiesConnectionResult,
  type CaseStudyBySlugResult,
  type CaseStudyDetail,
  type CaseStudyListItem,
  type CompanyBySlugResult,
  type IdeaxchangeCompanySummary,
} from "@/lib/ideaxchange-recruiting-queries";
import {
  getMockCaseStudyBySlug,
  getMockCompanyBySlug,
  getMockRecruitingHubBundle,
} from "@/lib/ideaxchange-recruiting-mock-data";
import {
  RECRUITING_HUB_FIRST,
  RECRUITING_LOAD_MORE_FIRST,
} from "@/lib/ideaxchange-recruiting-utils";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import {
  filterItemsByPersonaVisibility,
  isItemVisibleToPersona,
} from "@/lib/ideaxchange-visibility";

async function fetchCaseStudiesConnection(
  first: number,
  after?: string | null,
): Promise<{
  nodes: CaseStudyListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const useMockFallback = !after;

  try {
    const data = await fetchGraphQL<CaseStudiesConnectionResult>(GET_CASE_STUDIES, {
      first,
      after: after ?? null,
    });
    const conn = data?.ideaxchangeCaseStudies;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: {
          hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
          endCursor: conn?.pageInfo?.endCursor ?? null,
        },
      };
    }
  } catch (err) {
    console.error("[recruiting] fetchCaseStudiesConnection failed:", err);
  }

  if (useMockFallback) {
    const mock = getMockRecruitingHubBundle();
    return { nodes: mock.posts.slice(0, first), pageInfo: mock.pageInfo };
  }

  return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getCaseStudiesList(
  persona: IdeaxchangePersona = "brokerage",
): Promise<CaseStudyListItem[]> {
  const { nodes } = await fetchCaseStudiesConnection(100);
  return filterItemsByPersonaVisibility(nodes, persona);
}

export async function getRecruitingHubBundle(
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  posts: CaseStudyListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { nodes, pageInfo } = await fetchCaseStudiesConnection(
    RECRUITING_HUB_FIRST,
    null,
  );
  return { posts: filterItemsByPersonaVisibility(nodes, persona), pageInfo };
}

export async function fetchCaseStudiesAfterCursor(
  after: string,
  first = RECRUITING_LOAD_MORE_FIRST,
  persona: IdeaxchangePersona = "brokerage",
): Promise<{
  nodes: CaseStudyListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const result = await fetchCaseStudiesConnection(first, after);
  if (result.nodes.length > 0) {
    return {
      nodes: filterItemsByPersonaVisibility(result.nodes, persona),
      pageInfo: result.pageInfo,
    };
  }
  return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getCaseStudyBySlug(
  slug: string,
  persona?: IdeaxchangePersona,
): Promise<CaseStudyDetail | null> {
  try {
    const data = await fetchGraphQL<CaseStudyBySlugResult>(GET_CASE_STUDY_BY_SLUG, {
      slug,
    });
    const post = data?.ideaxchangeCaseStudy;
    if (post) {
      if (persona && !isItemVisibleToPersona(post, persona)) return null;
      return post;
    }
  } catch (err) {
    console.error("[recruiting] getCaseStudyBySlug failed:", err);
  }
  const mock = getMockCaseStudyBySlug(slug);
  if (mock && persona && !isItemVisibleToPersona(mock, persona)) return null;
  return mock;
}

export const getCompanyBySlug = cache(async function getCompanyBySlug(
  slug: string,
  persona?: IdeaxchangePersona,
): Promise<IdeaxchangeCompanySummary | null> {
  try {
    const data = await fetchGraphQL<CompanyBySlugResult>(GET_COMPANY_BY_SLUG, { slug });
    const company = data?.ideaxchangeCompany;
    if (company) {
      if (persona && !isItemVisibleToPersona(company, persona)) return null;
      return company;
    }
  } catch (err) {
    console.error("[recruiting] getCompanyBySlug failed:", err);
  }
  const mock = getMockCompanyBySlug(slug);
  if (mock && persona && !isItemVisibleToPersona(mock, persona)) return null;
  return mock;
});
