import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_INSIGHT_BY_SLUG,
  GET_INSIGHTS,
  type InsightBySlugResult,
  type InsightDetail,
  type InsightListItem,
  type InsightsListResult,
} from "@/lib/queries";
import rawSeed from "../wp/mu-plugins/insights-demo-seed.json";

type InsightSeedRow = {
  slug: string;
  title: string;
  date: string;
  topic: string;
  spotlight: boolean;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_login?: string;
};

const TOPIC_LABELS: Record<string, string> = {
  health: "Health",
  wealth: "Wealth",
  leadership: "Leadership",
  life: "Life",
};

function normalizeDate(isoOrLocal: string): string {
  const t = isoOrLocal.trim();
  if (t.includes("T")) return t;
  return t.replace(" ", "T");
}

/** Fallback when GraphQL has no Insights yet (CPT not deployed) or the request fails. Mirrors `insights-demo-seed.json`. */
export const DEMO_INSIGHTS: InsightDetail[] = (rawSeed as InsightSeedRow[]).map(
  (row, i) => ({
    id: `demo-insight-${i + 1}`,
    slug: row.slug,
    title: row.title,
    date: normalizeDate(row.date),
    excerpt: row.excerpt,
    content: row.content,
    insightFields: { isSpotlight: row.spotlight },
    insightTopics: {
      nodes: [
        {
          name: TOPIC_LABELS[row.topic] ?? row.topic,
          slug: row.topic,
        },
      ],
    },
    author: { node: { name: "AmeriLife Editorial" } },
    featuredImage: {
      node: {
        sourceUrl: row.featured_image_url,
        altText: "",
      },
    },
  }),
);

export async function getInsightsList(): Promise<InsightListItem[]> {
  try {
    const data = await fetchGraphQL<InsightsListResult>(GET_INSIGHTS, {
      first: 100,
    });
    const nodes = data?.insights?.nodes ?? [];
    if (nodes.length > 0) {
      return nodes;
    }
  } catch {
    // CPT missing or GraphQL error — use bundled demo.
  }
  return DEMO_INSIGHTS;
}

export async function getInsightBySlug(slug: string): Promise<InsightDetail | null> {
  try {
    const data = await fetchGraphQL<InsightBySlugResult>(GET_INSIGHT_BY_SLUG, {
      slug,
    });
    if (data?.insight?.slug) {
      return data.insight;
    }
  } catch {
    // fall through
  }
  return DEMO_INSIGHTS.find((p) => p.slug === slug) ?? null;
}
