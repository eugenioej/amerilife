import type {
  CaseStudyDetail,
  CaseStudyListItem,
  IdeaxchangeCompanySummary,
} from "@/lib/ideaxchange-recruiting-queries";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

const img = IDEAXCHANGE_PLACEHOLDER_IMG;

const MOCK_COMPANIES: Record<string, IdeaxchangeCompanySummary> = {
  orca: {
    id: "mock-company-orca",
    slug: "orca",
    title: "ORCA",
    excerpt:
      "ORCA Life was created out of respect for family, their loved ones and the responsibilities we are all given with the gift of life.",
    content:
      "<p>ORCA Life was created out of respect. Respect for family, their loved ones and the responsibilities we are all given with the gift of life. ORCA partners with AmeriLife affiliates to deliver meaningful protection solutions nationwide.</p>",
    featuredImage: { node: { sourceUrl: img, altText: "ORCA" } },
    ideaxchangeCompanyFields: {
      websiteUrl: "https://orca.life",
      learnMoreUrl: "https://orca.life",
    },
  },
  msb: {
    id: "mock-company-msb",
    slug: "msb",
    title: "MSB — Maximum Senior Benefits",
    excerpt:
      "Maximum Senior Benefits is an AmeriLife company focused on senior market recruiting and distribution.",
    content:
      "<p>Maximum Senior Benefits (MSB) is an AmeriLife company serving the senior market with innovative recruiting campaigns and agent development programs.</p>",
    featuredImage: { node: { sourceUrl: img, altText: "MSB" } },
    ideaxchangeCompanyFields: {
      websiteUrl: "https://www.maximumseniorbenefits.com/",
      learnMoreUrl: "https://www.maximumseniorbenefits.com/",
    },
  },
  "eric-brennan": {
    id: "mock-company-eric-brennan",
    slug: "eric-brennan",
    title: "Eric Brennan",
    excerpt: "Leadership welcome message for ideaXchange Recruiting Hub.",
    content:
      "<p>Welcome from Eric Brennan — executive perspective on recruiting excellence across the AmeriLife distribution network.</p>",
    featuredImage: { node: { sourceUrl: img, altText: "Eric Brennan" } },
    ideaxchangeCompanyFields: {
      websiteUrl: "https://amerilife.com/",
      learnMoreUrl: "https://amerilife.com/join-our-team/",
    },
  },
};

function company(slug: keyof typeof MOCK_COMPANIES) {
  return MOCK_COMPANIES[slug];
}

const MOCK_CAMPAIGN_ASSETS = [
  { label: "Call Scripts", fileUrl: img, mimeType: "application/pdf" },
  { label: "Interview Questions", fileUrl: img, mimeType: "application/pdf" },
  { label: "Email Templates", fileUrl: img, mimeType: "application/pdf" },
];

type TableStats = {
  targetAudience?: string;
  campaignSpend?: string;
  campaignResults?: string;
  campaignOverview?: string;
};

function buildCaseStudy(
  id: string,
  slug: string,
  title: string,
  companySlug: keyof typeof MOCK_COMPANIES,
  excerpt: string,
  content: string,
  date: string,
  opts: {
    featured?: boolean;
    spotlight?: boolean;
    assets?: boolean;
    table?: TableStats;
  } = {},
): CaseStudyDetail {
  return {
    id,
    slug,
    title,
    excerpt,
    content,
    date,
    featuredImage: { node: { sourceUrl: img, altText: title } },
    ideaxchangeCaseStudyFields: {
      isFeatured: opts.featured ?? false,
      isSpotlight: opts.spotlight ?? false,
      marketingCtaUrl: "/connect/",
      campaignAssets: opts.assets ? MOCK_CAMPAIGN_ASSETS : [],
      targetAudience: opts.table?.targetAudience ?? null,
      campaignSpend: opts.table?.campaignSpend ?? null,
      campaignResults: opts.table?.campaignResults ?? null,
      campaignOverview: opts.table?.campaignOverview ?? null,
    },
    caseStudyCompany: company(companySlug),
  };
}

export const MOCK_CASE_STUDIES: CaseStudyDetail[] = [
  buildCaseStudy(
    "mock-cs-1",
    "welcome-from-eric-brennan",
    "Welcome from Eric Brennan",
    "eric-brennan",
    "A welcome message to the AmeriLife recruiting community.",
    "<p>Welcome to the Recruiting Hub. Here you will find proven campaigns, playbooks, and success stories from across our affiliate network.</p><h2>THE OPPORTUNITY IN TODAY'S ENVIRONMENT</h2><p>Recruiting top talent requires consistency, speed, and the right tools. Use the campaigns below to accelerate your pipeline.</p>",
    "2025-12-01T10:00:00",
    { featured: true },
  ),
  buildCaseStudy(
    "mock-cs-2",
    "orca-indeed-speed-dating",
    "ORCA Indeed Speed Dating",
    "orca",
    "How ORCA used Indeed speed-dating events to fill agent seats faster.",
    "<p>ORCA launched a speed-dating style recruiting event on Indeed that shortened time-to-hire and improved candidate quality.</p>",
    "2025-12-15T10:00:00",
    {
      featured: true,
      spotlight: true,
      assets: true,
      table: {
        targetAudience: "Active job seekers on Indeed",
        campaignSpend: "$3,500",
        campaignResults: "Data",
        campaignOverview: "Speed-dating style Indeed events that shortened time-to-hire.",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-3",
    "msb-college-handshake",
    "MSB College Handshake",
    "msb",
    "MSB partnered with campus career platforms to reach early-career recruits.",
    "<p>Maximum Senior Benefits activated Handshake and campus events to build a pipeline of career-minded agents.</p>",
    "2025-11-20T10:00:00",
    {
      featured: true,
      assets: true,
      table: {
        targetAudience: "College seniors and recent graduates",
        campaignSpend: "$2,800",
        campaignResults: "Data 1",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-4",
    "mcc-recruiting-effort",
    "MCC Recruiting Effort",
    "msb",
    "Multi-channel outreach for Medicare-focused recruiting teams.",
    "<p>MCC recruiting effort combining digital ads, referrals, and event follow-up.</p>",
    "2025-11-05T10:00:00",
    {
      table: {
        targetAudience: "Licensed and pre-licensed health agents",
        campaignSpend: "$2,200",
        campaignResults: "Data 2",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-5",
    "accupoint-list-and-appending",
    "Accupoint List and Appending",
    "orca",
    "List acquisition and data appending for targeted recruiting outreach.",
    "<p>Accupoint list build and append workflow for precision recruiting lists.</p>",
    "2025-10-28T10:00:00",
    {
      table: {
        targetAudience: "Prospective agents in target geographies",
        campaignSpend: "$1,500",
        campaignResults: "Data 3",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-6",
    "axonic-campaign",
    "Axonic Campaign",
    "orca",
    "Digital-first outreach templates for annuity recruiting.",
    "<p>Axonic campaign assets and messaging frameworks for digital recruiting funnels.</p>",
    "2025-10-10T10:00:00",
    {
      featured: true,
      table: {
        targetAudience: "Annuity-interested career changers",
        campaignSpend: "$2,000",
        campaignResults: "Data 4",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-7",
    "recruitment-to-calendly",
    "Recruitment to Calendly",
    "msb",
    "Convert inbound interest into booked interviews with Calendly automation.",
    "<p>A step-by-step flow from ad click to scheduled interview using Calendly and email nurture sequences.</p>",
    "2025-09-05T10:00:00",
    {
      table: {
        targetAudience: "Inbound digital leads",
        campaignSpend: "$950",
        campaignResults: "Data 5",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-8",
    "devoted-campaign",
    "Devoted Campaign",
    "orca",
    "Carrier-aligned recruiting messaging for Medicare Advantage teams.",
    "<p>Devoted campaign creative and talk tracks for building trust with experienced health agents.</p>",
    "2025-08-18T10:00:00",
    {
      table: {
        targetAudience: "Medicare Advantage experienced agents",
        campaignSpend: "$1,800",
        campaignResults: "Data 6",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-9",
    "quality-leads-fed-campaign",
    "Quality Leads FED Campaign",
    "msb",
    "Federal employee outreach for quality lead generation.",
    "<p>Quality Leads FED campaign playbook for federal employee segments.</p>",
    "2025-08-01T10:00:00",
    {
      table: {
        targetAudience: "Federal employees nearing retirement",
        campaignSpend: "$2,400",
        campaignResults: "Data 7",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-10",
    "med-sup-campaign",
    "Med Sup Campaign",
    "msb",
    "Medicare Supplement recruiting scripts and team onboarding checklist.",
    "<p>Med Sup campaign resources for team leaders scaling senior-market recruiting.</p>",
    "2025-07-22T10:00:00",
    {
      table: {
        targetAudience: "Senior-market recruiting managers",
        campaignSpend: "$1,200",
        campaignResults: "Data 8",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-11",
    "webinar-campaign",
    "Webinar Campaign",
    "orca",
    "Webinar funnel for recruiting interested agents at scale.",
    "<p>Webinar campaign structure with registration ads, reminders, and follow-up sequences.</p>",
    "2025-07-10T10:00:00",
    {
      table: {
        targetAudience: "Remote and hybrid job seekers",
        campaignSpend: "$1,650",
        campaignResults: "Data 9",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-12",
    "nonlicensed-campaign",
    "Nonlicensed Campaign",
    "msb",
    "Recruiting pipeline for candidates without active licenses.",
    "<p>Nonlicensed campaign with licensing support messaging and onboarding paths.</p>",
    "2025-06-25T10:00:00",
    {
      table: {
        targetAudience: "Career changers without licenses",
        campaignSpend: "$900",
        campaignResults: "Data 10",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-13",
    "recruiting-event-campaign",
    "Recruiting Event Campaign",
    "orca",
    "In-person recruiting event promotion and follow-up.",
    "<p>Recruiting event campaign with pre-event nurture and day-of scripts.</p>",
    "2025-06-12T10:00:00",
    {
      table: {
        targetAudience: "Local agent candidates",
        campaignSpend: "$750",
        campaignResults: "Data 11",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-14",
    "facebook-ads-101",
    "Facebook Ads 101",
    "msb",
    "Starter guide to Facebook recruiting ads.",
    "<p>Facebook Ads 101 for agency leaders launching their first recruiting campaigns.</p>",
    "2025-05-30T10:00:00",
    {
      table: {
        targetAudience: "New recruiting marketers",
        campaignSpend: "$500",
        campaignResults: "Data 12",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-15",
    "setting-up-your-first-ad-campaign",
    "Setting Up Your first Ad Campaign",
    "orca",
    "Step-by-step first ad campaign setup for recruiting.",
    "<p>Setting up your first ad campaign with audiences, creative, and tracking.</p>",
    "2025-05-15T10:00:00",
    {
      table: {
        targetAudience: "Agency owners new to paid media",
        campaignSpend: "$400",
        campaignResults: "Data 13",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-16",
    "how-much-to-spend-setting-expectation",
    "How Much to Spend & Setting Expectation",
    "msb",
    "Budget benchmarks and realistic recruiting timelines.",
    "<p>How much to spend and setting expectations for recruiting ROI.</p>",
    "2025-05-01T10:00:00",
    {
      table: {
        targetAudience: "Distribution leaders planning budgets",
        campaignSpend: "$250",
        campaignResults: "Data 14",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-17",
    "reading-your-ad-results",
    "Reading Your Ad Results",
    "orca",
    "Interpret recruiting ad metrics and optimize performance.",
    "<p>Reading your ad results: CPL, conversion rates, and interview show rates.</p>",
    "2025-04-20T10:00:00",
    {
      table: {
        targetAudience: "Marketing and recruiting ops teams",
        campaignSpend: "$350",
        campaignResults: "Data 15",
      },
    },
  ),
  buildCaseStudy(
    "mock-cs-18",
    "linkedin-for-recruiting",
    "LinkedIn for Recruiting",
    "msb",
    "LinkedIn outreach and content strategies for agent recruiting.",
    "<p>LinkedIn for recruiting: profile optimization, InMail sequences, and content cadence.</p>",
    "2025-04-05T10:00:00",
    {
      table: {
        targetAudience: "Professional network prospects",
        campaignSpend: "$600",
        campaignResults: "Data 16",
      },
    },
  ),
];

export function getMockCaseStudiesList(): CaseStudyListItem[] {
  return MOCK_CASE_STUDIES;
}

export function getMockRecruitingHubBundle(): {
  posts: CaseStudyListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  return {
    posts: MOCK_CASE_STUDIES,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}

export function getMockCaseStudyBySlug(slug: string): CaseStudyDetail | null {
  return MOCK_CASE_STUDIES.find((p) => p.slug === slug) ?? null;
}

export function getMockCompanyBySlug(slug: string): IdeaxchangeCompanySummary | null {
  return MOCK_COMPANIES[slug] ?? null;
}

export function getMockCompaniesList(): IdeaxchangeCompanySummary[] {
  return Object.values(MOCK_COMPANIES);
}
