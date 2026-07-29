import type { IdeaxchangeDetail, IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

const img = IDEAXCHANGE_PLACEHOLDER_IMG;

function initiativePost(
  id: string,
  slug: string,
  title: string,
  date: string,
  excerpt: string,
  content: string,
  opts: { spotlight?: boolean; featured?: boolean } = {},
): IdeaxchangeDetail {
  return {
    id,
    slug,
    title,
    date,
    excerpt: `<p>${excerpt}</p>`,
    content: `<p>${content}</p>`,
    ideaxchangeTopics: { nodes: [{ name: "Company News", slug: "company-news" }] },
    ideaxchangeTags: { nodes: [{ name: "Initiative", slug: "initiative" }] },
    ideaxchangeFields: {
      isSpotlight: opts.spotlight ?? false,
      isFeatured: opts.featured ?? false,
    },
    featuredImage: { node: { sourceUrl: img, altText: "" } },
  };
}

/** Demo posts shown when no magazine articles are tagged Initiative in WordPress. */
export const MOCK_INITIATIVE_MAGAZINE_POSTS: IdeaxchangeDetail[] = [
  initiativePost(
    "mock-initiative-1",
    "amerilife-best-in-class-2026",
    "AmeriLife Best in Class 2026",
    "2025-12-01T12:00:00",
    "Say bonjour to the French Riviera! Contest period January 1 – December 31, 2026.",
    "Join AmeriLife associates competing for recognition and an unforgettable incentive trip to the French Riviera, April 27 – May 2, 2027. The contest period runs January 1 through December 31, 2026.",
    { spotlight: true, featured: true },
  ),
  initiativePost(
    "mock-initiative-2",
    "health-best-in-class-standings",
    "Health Best in Class 2026 Standings",
    "2025-11-15T12:00:00",
    "View current standings for Health Distribution associates during the November 1, 2025 – October 31, 2026 contest period.",
    "Track top Health Sales Associates, marketing codes, commissions, and year-over-year growth throughout the contest period.",
    { featured: true },
  ),
  initiativePost(
    "mock-initiative-3",
    "wealth-best-in-class-standings",
    "Wealth Best in Class 2026 Standings",
    "2025-11-10T12:00:00",
    "Track Wealth Distribution performance and year-over-year commission growth throughout the contest.",
    "Current standings for Wealth Distribution associates competing in Best in Class 2026.",
    { featured: true },
  ),
  initiativePost(
    "mock-initiative-4",
    "best-in-class-qualification-guide",
    "Best in Class Qualification Guide",
    "2025-10-20T12:00:00",
    "How associates qualify for incentive trips, recognition tiers, and year-end awards.",
    "Eligibility requirements, production thresholds, and how marketing codes affect qualification.",
  ),
  initiativePost(
    "mock-initiative-5",
    "contest-period-faq",
    "Contest Period FAQ",
    "2025-10-01T12:00:00",
    "Answers to common questions about eligibility, marketing codes, and commission calculations.",
    "Frequently asked questions about the Best in Class contest period and standings.",
  ),
  initiativePost(
    "mock-initiative-6",
    "spring-incentive-trip-preview",
    "Spring Incentive Trip Preview",
    "2025-09-15T12:00:00",
    "A preview of upcoming incentive travel destinations and qualification milestones.",
    "Preview destinations, travel dates, and qualification milestones for upcoming incentive trips.",
  ),
  initiativePost(
    "mock-initiative-7",
    "yoy-growth-strategies",
    "YoY Growth Strategies for Top Producers",
    "2025-09-01T12:00:00",
    "Tactics from past Best in Class winners for sustaining year-over-year commission growth.",
    "Production habits and client engagement strategies from past Best in Class winners.",
  ),
  initiativePost(
    "mock-initiative-8",
    "marketing-code-best-practices",
    "Marketing Code Best Practices",
    "2025-08-18T12:00:00",
    "Ensure your production is attributed correctly during the contest period.",
    "How to verify marketing codes and avoid attribution issues during the contest.",
  ),
];

export function getMockInitiativeArticleBySlug(slug: string): IdeaxchangeDetail | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  return MOCK_INITIATIVE_MAGAZINE_POSTS.find((p) => p.slug === trimmed) ?? null;
}

export function getMockInitiativeMagazineBundle(): {
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  return {
    posts: MOCK_INITIATIVE_MAGAZINE_POSTS,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}

export function getMockInitiativeMagazineAfterCursor(after: string): {
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  const idx = MOCK_INITIATIVE_MAGAZINE_POSTS.findIndex((p) => p.id === after);
  if (idx < 0) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
  const nodes = MOCK_INITIATIVE_MAGAZINE_POSTS.slice(idx + 1, idx + 7);
  const last = nodes[nodes.length - 1];
  const hasNext = idx + 7 < MOCK_INITIATIVE_MAGAZINE_POSTS.length - 1;
  return {
    nodes,
    pageInfo: {
      hasNextPage: hasNext,
      endCursor: hasNext && last?.id ? last.id : null,
    },
  };
}
