import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_INSIGHTS_SEARCH_BATCH,
  type InsightSearchBatchNode,
  type InsightSearchNode,
  type InsightsSearchBatchResult,
} from "@/lib/queries";

const BATCH = 100;
const MAX_BATCHES = 40;

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

export function buildInsightSearchHaystack(node: InsightSearchBatchNode): string {
  const contentPlain = node.content ? stripHtml(node.content) : "";
  const excerptPlain = node.excerpt ? stripHtml(node.excerpt) : "";
  const slugWords = (node.slug ?? "").replace(/-/g, " ");
  const topics = (node.insightTopics?.nodes ?? [])
    .flatMap((t) => [t.name, t.slug])
    .filter(Boolean)
    .join(" ");

  return normalizeText(
    [node.title, slugWords, excerptPlain, contentPlain, topics].filter(Boolean).join(" "),
  );
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

async function fetchAllInsightSearchNodes(): Promise<InsightSearchBatchNode[]> {
  const out: InsightSearchBatchNode[] = [];
  let after: string | null = null;

  for (let i = 0; i < MAX_BATCHES; i++) {
    const data: InsightsSearchBatchResult = await fetchGraphQL<InsightsSearchBatchResult>(
      GET_INSIGHTS_SEARCH_BATCH,
      { first: BATCH, after },
    );
    const conn = data.insights;
    const nodes = conn?.nodes ?? [];
    out.push(...nodes);
    const hasNext = conn?.pageInfo?.hasNextPage ?? false;
    after = conn?.pageInfo?.endCursor ?? null;
    if (!hasNext || !after || nodes.length === 0) break;
  }

  return out;
}

function toSearchNode(node: InsightSearchBatchNode): InsightSearchNode {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    date: node.date,
    excerpt: node.excerpt,

    insightTopics: node.insightTopics,
  };
}

/**
 * Match Insights by title, slug, excerpt, body, and topic names — not only WP full-text search.
 */
export async function searchInsightsLocal(
  rawQuery: string,
  limit = 20,
): Promise<InsightSearchNode[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const nodes = await fetchAllInsightSearchNodes();
    const scored: { node: InsightSearchBatchNode; score: number }[] = [];

    for (const node of nodes) {
      if (!node.slug) continue;
      const haystack = buildInsightSearchHaystack(node);
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

    return scored.slice(0, limit).map((s) => toSearchNode(s.node));
  } catch {
    return [];
  }
}
