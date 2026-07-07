import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

const img = IDEAXCHANGE_PLACEHOLDER_IMG;

function salesPost(
  id: string,
  slug: string,
  title: string,
  date: string,
  excerpt: string,
  opts: { spotlight?: boolean; featured?: boolean } = {},
): IdeaxchangeListItem {
  return {
    id,
    slug,
    title,
    date,
    excerpt: `<p>${excerpt}</p>`,
    ideaxchangeTopics: { nodes: [{ name: "Sales", slug: "sales" }] },
    ideaxchangeFields: {
      isSpotlight: opts.spotlight ?? false,
      isFeatured: opts.featured ?? false,
    },
    featuredImage: { node: { sourceUrl: img, altText: "" } },
  };
}

/** Demo posts shown when no magazine articles are tagged Sales in WordPress. */
export const MOCK_SALES_MAGAZINE_POSTS: IdeaxchangeListItem[] = [
  salesPost(
    "mock-sales-1",
    "increasing-awareness-simplified-issue-life-sales",
    "Increasing Awareness to Boost Simplified-Issue Life Sales",
    "2025-12-15T12:00:00",
    "How distribution partners can reach more consumers with simplified-issue life products and clear education.",
    { spotlight: true, featured: true },
  ),
  salesPost(
    "mock-sales-2",
    "strategies-trust-annuities",
    "5 Strategies to Help Build Trust and Confidence Through Annuities",
    "2025-12-01T12:00:00",
    "Practical approaches to annuity conversations that emphasize clarity, suitability, and long-term outcomes.",
    { featured: true },
  ),
  salesPost(
    "mock-sales-3",
    "reflections-amazing-year-amertilife-growth",
    "Reflections Of An Amazing Year: AmeriLife's Growth And Partnership",
    "2025-11-20T12:00:00",
    "A look back at milestones, partnerships, and the teams driving AmeriLife forward.",
    { featured: true },
  ),
  salesPost(
    "mock-sales-4",
    "power-of-hobbies-productivity",
    "The Power Of Hobbies To Boost Productivity, Creativity, And Connection",
    "2025-11-05T12:00:00",
    "Why personal interests matter for professional performance and team culture.",
    { featured: true },
  ),
  salesPost(
    "mock-sales-5",
    "medicare-advantage-enrollment-strategies",
    "Medicare Advantage Enrollment Strategies for AEP Success",
    "2025-10-20T12:00:00",
    "Tactics for agents and agencies to maximize AEP results with compliant outreach.",
  ),
  salesPost(
    "mock-sales-6",
    "building-distribution-partnerships",
    "Building Stronger Distribution Partnerships in 2026",
    "2025-10-01T12:00:00",
    "How affiliates can deepen carrier relationships and grow production sustainably.",
  ),
  salesPost(
    "mock-sales-7",
    "cross-selling-life-and-health",
    "Cross-Selling Life and Health for Stronger Client Relationships",
    "2025-09-15T12:00:00",
    "Frameworks for introducing complementary products without overwhelming the client conversation.",
  ),
  salesPost(
    "mock-sales-8",
    "aep-prep-checklist-agencies",
    "AEP Prep Checklist for Agency Leaders",
    "2025-09-01T12:00:00",
    "Operational readiness, compliance reminders, and team coaching before enrollment season peaks.",
  ),
  salesPost(
    "mock-sales-9",
    "final-expense-conversation-starters",
    "Final Expense Conversation Starters That Build Trust",
    "2025-08-18T12:00:00",
    "Opening questions and follow-ups that help agents uncover need without pressure.",
  ),
  salesPost(
    "mock-sales-10",
    "wealth-transfer-planning-basics",
    "Wealth Transfer Planning Basics for Distribution Teams",
    "2025-08-05T12:00:00",
    "How to position life and annuity solutions in legacy and income planning discussions.",
  ),
  salesPost(
    "mock-sales-11",
    "digital-leads-to-appointments",
    "Turning Digital Leads Into Booked Appointments",
    "2025-07-22T12:00:00",
    "Speed-to-lead workflows, nurture sequences, and show-rate tactics for online prospects.",
  ),
  salesPost(
    "mock-sales-12",
    "carrier-alignment-best-practices",
    "Carrier Alignment Best Practices for Top Producers",
    "2025-07-08T12:00:00",
    "Building productive carrier relationships that unlock training, co-op, and product access.",
  ),
  salesPost(
    "mock-sales-13",
    "senior-market-retention-playbook",
    "Senior Market Retention Playbook",
    "2025-06-25T12:00:00",
    "Annual reviews, birthday outreach, and referral prompts that protect your book of business.",
  ),
  salesPost(
    "mock-sales-14",
    "compliant-social-selling",
    "Compliant Social Selling for Insurance Professionals",
    "2025-06-10T12:00:00",
    "Content ideas and disclosure habits for LinkedIn and Facebook without regulatory risk.",
  ),
  salesPost(
    "mock-sales-15",
    "team-production-meetings",
    "Running Team Production Meetings That Drive Results",
    "2025-05-28T12:00:00",
    "Agenda templates and KPI reviews that keep agencies focused on measurable growth.",
  ),
  salesPost(
    "mock-sales-16",
    "medicare-supplement-cross-sell",
    "Medicare Supplement Cross-Sell Opportunities",
    "2025-05-12T12:00:00",
    "When and how to introduce Med Sup coverage to existing MA clients ethically and clearly.",
  ),
  salesPost(
    "mock-sales-17",
    "objection-handling-price",
    "Objection Handling: When Prospects Push Back on Price",
    "2025-04-30T12:00:00",
    "Reframe value conversations around protection, income, and peace of mind.",
  ),
  salesPost(
    "mock-sales-18",
    "q4-sales-sprint-planning",
    "Q4 Sales Sprint Planning for Affiliates",
    "2025-04-15T12:00:00",
    "End-of-year push tactics that balance production goals with sustainable client service.",
  ),
];

export function getMockSalesMagazineBundle(): {
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  return {
    posts: MOCK_SALES_MAGAZINE_POSTS,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}

export function getMockSalesMagazineAfterCursor(
  after: string,
): {
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  const idx = MOCK_SALES_MAGAZINE_POSTS.findIndex((p) => p.id === after);
  if (idx < 0) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
  const nodes = MOCK_SALES_MAGAZINE_POSTS.slice(idx + 1, idx + 7);
  const last = nodes[nodes.length - 1];
  const hasNext = idx + 7 < MOCK_SALES_MAGAZINE_POSTS.length - 1;
  return {
    nodes,
    pageInfo: {
      hasNextPage: hasNext,
      endCursor: hasNext && last?.id ? last.id : null,
    },
  };
}
