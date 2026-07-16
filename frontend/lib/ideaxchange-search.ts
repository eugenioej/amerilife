/**
 * ideaXchange local search — batch-fetch CPTs and rank by title/body/topics.
 * Mirrors Insights/agencies local search; does not fall back to public Insights.
 */
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_IDEAXCHANGE_ARTICLES_SEARCH_BATCH,
  type IdeaxchangeArticleSearchNode,
  type IdeaxchangeArticlesSearchBatchResult,
} from "@/lib/ideaxchange-queries";
import {
  GET_CASE_STUDIES_SEARCH_BATCH,
  GET_COMPANIES_SEARCH_BATCH,
  type CaseStudiesSearchBatchResult,
  type CaseStudySearchNode,
  type CompaniesConnectionResult,
  type IdeaxchangeCompanySummary,
} from "@/lib/ideaxchange-recruiting-queries";
import {
  GET_CARRIERS_SEARCH_BATCH,
  type CarrierSearchNode,
  type CarriersSearchBatchResult,
} from "@/lib/ideaxchange-carrier-queries";
import { getMockCompaniesList, getMockRecruitingHubBundle } from "@/lib/ideaxchange-recruiting-mock-data";
import { getMockCarrierSpotlightBundle } from "@/lib/ideaxchange-carrier-mock-data";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { filterItemsByPersonaVisibility } from "@/lib/ideaxchange-visibility";
import {
  IDEAXCHANGE_ARTICLE_PATH,
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
} from "@/lib/ideaxchange-constants";

const BATCH = 100;
const MAX_BATCHES = 40;

export type IdeaxchangeContentSearchHit = {
  id: string;
  slug: string;
  title: string;
  date?: string | null;
  excerpt?: string | null;
  href: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(s: string): string {
  return normalizeText(s).replace(/\s+/g, "");
}

function splitQueryTokens(raw: string): string[] {
  return normalizeText(raw)
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function tokenMatchesHaystack(token: string, haystack: string): boolean {
  if (token.length < 2) return false;
  const words = haystack.split(/\s+/).filter(Boolean);
  return words.some((word) => word === token || word.includes(token) || token.includes(word));
}

function phraseMatchesQuery(rawQuery: string, haystack: string): boolean {
  const phrase = normalizeText(rawQuery);
  if (!phrase) return false;
  if (haystack.includes(phrase)) return true;
  const compactQuery = compactText(rawQuery);
  return compactQuery.length >= 4 && compactText(haystack).includes(compactQuery);
}

function rankTokens(rawQuery: string, tokens: string[], titleNorm: string, haystack: string): number {
  let score = 0;
  if (phraseMatchesQuery(rawQuery, titleNorm)) score += 100;
  else if (phraseMatchesQuery(rawQuery, haystack)) score += 60;

  for (const token of tokens) {
    if (tokenMatchesHaystack(token, titleNorm)) score += 25;
    else if (tokenMatchesHaystack(token, haystack)) score += 10;
  }
  return score;
}

function scoreAndRank<T extends { title?: string | null; slug?: string | null }>(
  rawQuery: string,
  tokens: string[],
  nodes: T[],
  buildHaystack: (node: T) => string,
  limit: number,
): T[] {
  const scored: { node: T; score: number }[] = [];

  for (const node of nodes) {
    if (!node.slug) continue;
    const haystack = buildHaystack(node);
    if (!haystack) continue;
    const phraseMatch = phraseMatchesQuery(rawQuery, haystack);
    const allMatch = tokens.every((t) => tokenMatchesHaystack(t, haystack));
    if (!phraseMatch && !allMatch) continue;
    const titleNorm = normalizeText(node.title ?? "");
    scored.push({
      node,
      score: rankTokens(rawQuery, tokens, titleNorm, haystack),
    });
  }

  scored.sort((a, b) => {
    const d = b.score - a.score;
    if (d !== 0) return d;
    return (a.node.title ?? "").localeCompare(b.node.title ?? "", undefined, {
      sensitivity: "base",
    });
  });

  return scored.slice(0, limit).map((s) => s.node);
}

async function paginateConnection<T>(
  fetchPage: (
    first: number,
    after: string | null,
  ) => Promise<{
    nodes: T[];
    hasNextPage: boolean;
    endCursor: string | null;
  }>,
): Promise<T[]> {
  const out: T[] = [];
  let after: string | null = null;

  for (let i = 0; i < MAX_BATCHES; i++) {
    const page = await fetchPage(BATCH, after);
    out.push(...page.nodes);
    if (!page.hasNextPage || !page.endCursor || page.nodes.length === 0) break;
    after = page.endCursor;
  }

  return out;
}

async function fetchAllArticleSearchNodes(): Promise<IdeaxchangeArticleSearchNode[]> {
  return paginateConnection(async (first, after) => {
    const data = await fetchGraphQL<IdeaxchangeArticlesSearchBatchResult>(
      GET_IDEAXCHANGE_ARTICLES_SEARCH_BATCH,
      { first, after },
    );
    const conn = data?.ideaxchangeArticles;
    return {
      nodes: conn?.nodes ?? [],
      hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      endCursor: conn?.pageInfo?.endCursor ?? null,
    };
  });
}

async function fetchAllCaseStudySearchNodes(): Promise<CaseStudySearchNode[]> {
  try {
    const nodes = await paginateConnection(async (first, after) => {
      const data = await fetchGraphQL<CaseStudiesSearchBatchResult>(
        GET_CASE_STUDIES_SEARCH_BATCH,
        { first, after },
      );
      const conn = data?.ideaxchangeCaseStudies;
      return {
        nodes: conn?.nodes ?? [],
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
        endCursor: conn?.pageInfo?.endCursor ?? null,
      };
    });
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.error("[ideaxchange-search] fetch case studies failed:", err);
  }

  return getMockRecruitingHubBundle().posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    content: null,
    ideaxchangeCaseStudyFields: p.ideaxchangeCaseStudyFields
      ? {
          targetAudience: p.ideaxchangeCaseStudyFields.targetAudience,
          campaignOverview: p.ideaxchangeCaseStudyFields.campaignOverview,
          campaignResults: p.ideaxchangeCaseStudyFields.campaignResults,
          visibility: p.ideaxchangeCaseStudyFields.visibility,
        }
      : null,
    caseStudyCompany: p.caseStudyCompany
      ? { title: p.caseStudyCompany.title, slug: p.caseStudyCompany.slug }
      : null,
  }));
}

async function fetchAllCompanySearchNodes(): Promise<IdeaxchangeCompanySummary[]> {
  try {
    const nodes = await paginateConnection(async (first, after) => {
      const data = await fetchGraphQL<CompaniesConnectionResult>(GET_COMPANIES_SEARCH_BATCH, {
        first,
        after,
      });
      const conn = data?.ideaxchangeCompanies;
      return {
        nodes: conn?.nodes ?? [],
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
        endCursor: conn?.pageInfo?.endCursor ?? null,
      };
    });
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.error("[ideaxchange-search] fetch companies failed:", err);
  }
  return getMockCompaniesList();
}

async function fetchAllCarrierSearchNodes(): Promise<CarrierSearchNode[]> {
  try {
    const nodes = await paginateConnection(async (first, after) => {
      const data = await fetchGraphQL<CarriersSearchBatchResult>(GET_CARRIERS_SEARCH_BATCH, {
        first,
        after,
      });
      const conn = data?.ideaxchangeCarriers;
      return {
        nodes: conn?.nodes ?? [],
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
        endCursor: conn?.pageInfo?.endCursor ?? null,
      };
    });
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.error("[ideaxchange-search] fetch carriers failed:", err);
  }
  return getMockCarrierSpotlightBundle().carriers.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    excerpt: c.excerpt,
    content: null,
    ideaxchangeCarrierFields: c.ideaxchangeCarrierFields
      ? {
          visibility: c.ideaxchangeCarrierFields.visibility,
          highlights: c.ideaxchangeCarrierFields.highlights,
        }
      : null,
  }));
}

function articleHaystack(node: IdeaxchangeArticleSearchNode): string {
  const contentPlain = node.content ? stripHtml(node.content) : "";
  const excerptPlain = node.excerpt ? stripHtml(node.excerpt) : "";
  const slugWords = (node.slug ?? "").replace(/-/g, " ");
  const topics = (node.ideaxchangeTopics?.nodes ?? [])
    .flatMap((t) => [t.name, t.slug])
    .filter(Boolean)
    .join(" ");
  return normalizeText(
    [node.title, slugWords, excerptPlain, contentPlain, topics].filter(Boolean).join(" "),
  );
}

function caseStudyHaystack(node: CaseStudySearchNode): string {
  const fields = node.ideaxchangeCaseStudyFields;
  return normalizeText(
    [
      node.title,
      (node.slug ?? "").replace(/-/g, " "),
      node.excerpt ? stripHtml(node.excerpt) : "",
      node.content ? stripHtml(node.content) : "",
      fields?.targetAudience,
      fields?.campaignOverview,
      fields?.campaignResults,
      node.caseStudyCompany?.title,
      node.caseStudyCompany?.slug?.replace(/-/g, " "),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function companyHaystack(node: IdeaxchangeCompanySummary): string {
  return normalizeText(
    [
      node.title,
      (node.slug ?? "").replace(/-/g, " "),
      node.excerpt ? stripHtml(node.excerpt) : "",
      node.content ? stripHtml(node.content) : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function carrierHaystack(node: CarrierSearchNode): string {
  const highlights = (node.ideaxchangeCarrierFields?.highlights ?? [])
    .map((h) => h?.label)
    .filter(Boolean)
    .join(" ");
  return normalizeText(
    [
      node.title,
      (node.slug ?? "").replace(/-/g, " "),
      node.excerpt ? stripHtml(node.excerpt) : "",
      node.content ? stripHtml(node.content) : "",
      highlights,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function toHit(
  node: { id: string; slug?: string | null; title?: string | null; date?: string | null; excerpt?: string | null },
  href: string,
): IdeaxchangeContentSearchHit {
  return {
    id: node.id,
    slug: node.slug!.trim(),
    title: node.title?.trim() || "Untitled",
    date: node.date,
    excerpt: node.excerpt,
    href,
  };
}

export async function searchIdeaxchangeArticlesLocal(
  rawQuery: string,
  persona: IdeaxchangePersona,
  limit = 20,
): Promise<IdeaxchangeContentSearchHit[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const all = await fetchAllArticleSearchNodes();
    const visible = filterItemsByPersonaVisibility(all, persona);
    return scoreAndRank(rawQuery, tokens, visible, articleHaystack, limit).map((node) =>
      toHit(node, `${IDEAXCHANGE_ARTICLE_PATH}${node.slug}/`),
    );
  } catch {
    return [];
  }
}

export async function searchIdeaxchangeCaseStudiesLocal(
  rawQuery: string,
  persona: IdeaxchangePersona,
  limit = 20,
): Promise<IdeaxchangeContentSearchHit[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const all = await fetchAllCaseStudySearchNodes();
    const visible = filterItemsByPersonaVisibility(all, persona);
    return scoreAndRank(rawQuery, tokens, visible, caseStudyHaystack, limit).map((node) =>
      toHit(node, `${IDEAXCHANGE_RECRUITING_HUB_PATH}${node.slug}/`),
    );
  } catch {
    return [];
  }
}

export async function searchIdeaxchangeCompaniesLocal(
  rawQuery: string,
  persona: IdeaxchangePersona,
  limit = 20,
): Promise<IdeaxchangeContentSearchHit[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const all = await fetchAllCompanySearchNodes();
    const visible = filterItemsByPersonaVisibility(all, persona);
    return scoreAndRank(rawQuery, tokens, visible, companyHaystack, limit).map((node) =>
      toHit(node, `${IDEAXCHANGE_RECRUITING_HUB_PATH}company/${node.slug}/`),
    );
  } catch {
    return [];
  }
}

export async function searchIdeaxchangeCarriersLocal(
  rawQuery: string,
  persona: IdeaxchangePersona,
  limit = 20,
): Promise<IdeaxchangeContentSearchHit[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const all = await fetchAllCarrierSearchNodes();
    const visible = filterItemsByPersonaVisibility(all, persona);
    return scoreAndRank(rawQuery, tokens, visible, carrierHaystack, limit).map((node) =>
      toHit(node, `${IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH}${node.slug}/`),
    );
  } catch {
    return [];
  }
}
