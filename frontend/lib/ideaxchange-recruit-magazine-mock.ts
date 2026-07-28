import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

const img = IDEAXCHANGE_PLACEHOLDER_IMG;

function recruitPost(
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
    ideaxchangeTopics: { nodes: [{ name: "Recruit", slug: "recruit" }] },
    ideaxchangeFields: {
      isSpotlight: opts.spotlight ?? false,
      isFeatured: opts.featured ?? false,
    },
    featuredImage: { node: { sourceUrl: img, altText: "" } },
  };
}

/** Demo posts shown when no magazine articles are tagged Recruit in WordPress. */
export const MOCK_RECRUIT_MAGAZINE_POSTS: IdeaxchangeListItem[] = [
  recruitPost(
    "mock-recruit-1",
    "boosting-productivity-recruitment-certifications",
    "Boosting Productivity through Strategic Recruitment and Industry Certifications",
    "2025-12-15T12:00:00",
    "Discover how strategic recruitment and industry certifications can boost productivity and drive business growth.",
    { spotlight: true, featured: true },
  ),
  recruitPost(
    "mock-recruit-2",
    "linkedin-for-recruiting",
    "LinkedIn for Recruiting: Building Your Agent Pipeline",
    "2025-12-01T12:00:00",
    "Practical LinkedIn tactics for agency leaders who want consistent inbound recruiting conversations.",
    { featured: true },
  ),
  recruitPost(
    "mock-recruit-3",
    "facebook-ads-101-recruiting",
    "Facebook Ads 101 for Recruiting",
    "2025-11-20T12:00:00",
    "A starter guide to audience targeting, creative, and budget expectations for agent recruiting ads.",
    { featured: true },
  ),
  recruitPost(
    "mock-recruit-4",
    "reading-your-ad-results-recruiting",
    "Reading Your Ad Results",
    "2025-11-05T12:00:00",
    "How to interpret cost-per-lead, conversion rates, and interview show rates from recruiting campaigns.",
    { featured: true },
  ),
  recruitPost(
    "mock-recruit-5",
    "recruiting-event-campaign-playbook",
    "Recruiting Event Campaign Playbook",
    "2025-10-20T12:00:00",
    "Run high-energy recruiting events with pre-event nurture, day-of scripts, and follow-up sequences.",
  ),
  recruitPost(
    "mock-recruit-6",
    "how-much-to-spend-recruiting",
    "How Much to Spend & Setting Expectations",
    "2025-10-01T12:00:00",
    "Benchmark spend ranges and realistic timelines for building a productive recruiting funnel.",
  ),
  recruitPost(
    "mock-recruit-7",
    "setting-up-your-first-ad-campaign",
    "Setting Up Your First Ad Campaign",
    "2025-09-15T12:00:00",
    "Step-by-step setup for audiences, creative, tracking, and budget on your first recruiting ads.",
  ),
  recruitPost(
    "mock-recruit-8",
    "indeed-speed-dating-events",
    "Indeed Speed Dating Events That Fill Seats Fast",
    "2025-09-01T12:00:00",
    "How structured virtual events shorten hiring cycles and improve candidate quality.",
  ),
  recruitPost(
    "mock-recruit-9",
    "campus-handshake-recruiting",
    "Campus Handshake Recruiting for Early-Career Agents",
    "2025-08-18T12:00:00",
    "Partner with career platforms to reach graduates interested in financial services careers.",
  ),
  recruitPost(
    "mock-recruit-10",
    "calendly-recruiting-funnel",
    "Calendly Recruiting Funnels From Click to Interview",
    "2025-08-05T12:00:00",
    "Automate scheduling and reminders so digital leads become booked conversations.",
  ),
  recruitPost(
    "mock-recruit-11",
    "nonlicensed-recruit-messaging",
    "Nonlicensed Recruit Messaging That Converts",
    "2025-07-22T12:00:00",
    "Talk tracks for candidates who need licensing support and a clear path to production.",
  ),
  recruitPost(
    "mock-recruit-12",
    "webinar-recruiting-at-scale",
    "Webinar Recruiting at Scale",
    "2025-07-08T12:00:00",
    "Registration ads, reminder cadences, and post-webinar follow-up that books interviews.",
  ),
  recruitPost(
    "mock-recruit-13",
    "referral-recruiting-programs",
    "Referral Recruiting Programs That Actually Work",
    "2025-06-25T12:00:00",
    "Incentives, tracking, and recognition systems for agent-to-agent referrals.",
  ),
  recruitPost(
    "mock-recruit-14",
    "interview-scripts-that-close",
    "Interview Scripts That Close More Candidates",
    "2025-06-10T12:00:00",
    "Structured questions and closing language for first and second-round recruiting calls.",
  ),
  recruitPost(
    "mock-recruit-15",
    "onboarding-first-30-days",
    "Onboarding: The First 30 Days After a Hire",
    "2025-05-28T12:00:00",
    "Checklists and touchpoints that improve retention through licensing and first appointments.",
  ),
  recruitPost(
    "mock-recruit-16",
    "recruiting-email-nurture",
    "Recruiting Email Nurture Sequences",
    "2025-05-12T12:00:00",
    "Five-email flows that keep warm leads engaged between ad click and scheduled interview.",
  ),
  recruitPost(
    "mock-recruit-17",
    "team-leader-recruiting-kpis",
    "Recruiting KPIs Every Team Leader Should Track",
    "2025-04-30T12:00:00",
    "CPL, show rate, licensing conversion, and 90-day production as a recruiting scorecard.",
  ),
  recruitPost(
    "mock-recruit-18",
    "local-event-recruiting-tactics",
    "Local Event Recruiting Tactics",
    "2025-04-15T12:00:00",
    "Community events, chamber partnerships, and follow-up that builds a local agent pipeline.",
  ),
];

export function getMockRecruitMagazineBundle(): {
  posts: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  return {
    posts: MOCK_RECRUIT_MAGAZINE_POSTS,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}

export function getMockRecruitMagazineAfterCursor(
  after: string,
): {
  nodes: IdeaxchangeListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  const idx = MOCK_RECRUIT_MAGAZINE_POSTS.findIndex((p) => p.id === after);
  if (idx < 0) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
  const nodes = MOCK_RECRUIT_MAGAZINE_POSTS.slice(idx + 1, idx + 7);
  const last = nodes[nodes.length - 1];
  const hasNext = idx + 7 < MOCK_RECRUIT_MAGAZINE_POSTS.length - 1;
  return {
    nodes,
    pageInfo: {
      hasNextPage: hasNext,
      endCursor: hasNext && last?.id ? last.id : null,
    },
  };
}
