/**
 * Structured data for agency location pages.
 * Used by LocationPageTemplate when rendering location pages.
 */

export type AgentData = {
  slug: string;
  name: string;
  role?: string;
  city: string;
  state: string;
  reviewsCount?: number;
  photoUrl?: string;
  /** Short bio shown on the agent card and detail page. */
  bio?: string;
  email?: string;
  phone?: string;
  areasOfFocus?: string[];
};

/** Shown on every agent profile in addition to any CMS “title” (`role`). */
export const LICENSED_INSURANCE_AGENT_LABEL = "Licensed Insurance Agent";

/** Optional job title from CMS; omitted when empty or identical to the licensed line. */
export function agentJobTitleLine(agent: AgentData): string | null {
  const r = agent.role?.trim();
  if (!r) return null;
  if (r.toLowerCase() === LICENSED_INSURANCE_AGENT_LABEL.toLowerCase()) return null;
  return r;
}

export type FeatureBlock = {
  heading: string;
  body: string;
  /** Icon key for FeaturesGrid: medicare | health | life | annuity */
  icon?: "medicare" | "health" | "life" | "annuity";
};

export type LocationData = {
  slug: string;
  officeName: string;
  phone: string;
  /** Optional office building image for the hero (left column). */
  officeImageUrl?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  hours: string;
  agents: AgentData[];
  features: FeatureBlock[];
  /** Google Maps search URL from CMS (import); used to align map embed with stored address. */
  mapSearchUrl?: string;
  /** Gravity Forms form ID on headless WP (Connect with an Agent). */
  gravityFormId?: number;
};

const POLK_FEATURES: FeatureBlock[] = [
  {
    heading: "Medicare Plans",
    body: "Navigate your Medicare options with confidence through comprehensive plan choices designed to support your health and wellbeing.",
    icon: "medicare",
  },
  {
    heading: "Voluntary Health Insurance Plans",
    body: "Enhance your coverage with supplemental plans that help protect you from unexpected healthcare expenses and life's surprises.",
    icon: "health",
  },
  {
    heading: "Life Insurance Plans",
    body: "Protect what matters most with life insurance solutions that provide financial security and peace of mind for you and your loved ones.",
    icon: "life",
  },
  {
    heading: "Annuities",
    body: "Strengthen your retirement strategy with annuity options that offer guaranteed income, safeguard your savings, and help build long-term stability.",
    icon: "annuity",
  },
];

const DEFAULT_AREAS_OF_FOCUS = [
  "Medicare Advantage",
  "Part D Prescription Drugs",
  "Medicare Supplement Insurance",
];

const LOCATIONS: Record<string, LocationData> = {
  "polk-county": {
    slug: "polk-county",
    officeName: "AmeriLife of Polk County, LLC",
    phone: "(863) 291-4111",
    officeImageUrl:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2023/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png",
    address: {
      line1: "6322 Cypress Gardens Blvd.",
      city: "Winter Haven",
      state: "FL",
      zip: "33884",
    },
    hours: "Monday-Friday\n8am-5pm",
    agents: [
      {
        slug: "ryan-atkins",
        name: "Ryan Atkins",
        role: "Licensed Insurance Agent",
        city: "Winter Haven",
        state: "FL",
        reviewsCount: 375,
        bio: "Ryan Atkins is a licensed insurance agent serving the Winter Haven area. He specializes in Medicare and retirement solutions, helping clients navigate their options with clarity and confidence.",
        areasOfFocus: DEFAULT_AREAS_OF_FOCUS,
      },
      {
        slug: "agatha-constanza",
        name: "Agatha Constanza",
        role: "Licensed Insurance Agent",
        city: "Winter Haven",
        state: "FL",
        reviewsCount: 375,
        bio: "Agatha Constanza is a dedicated licensed insurance agent committed to helping individuals and families find the right insurance and retirement plans. She brings compassion and expertise to every client interaction.",
        areasOfFocus: DEFAULT_AREAS_OF_FOCUS,
      },
      {
        slug: "william-primus",
        name: "William Primus",
        role: "Licensed Insurance Agent",
        city: "Winter Haven",
        state: "FL",
        reviewsCount: 375,
        bio: "William Primus has years of experience helping Polk County residents understand their Medicare and health insurance options. His personalized approach ensures every client finds the coverage that fits their needs.",
        areasOfFocus: DEFAULT_AREAS_OF_FOCUS,
      },
      {
        slug: "timothy-reynolds",
        name: "Timothy Reynolds",
        role: "Licensed Insurance Agent",
        city: "Winter Haven",
        state: "FL",
        reviewsCount: 375,
        bio: "Timothy Reynolds is passionate about helping retirees and pre-retirees plan for a secure financial future. He offers comprehensive guidance on Medicare, life insurance, and annuity products.",
        areasOfFocus: DEFAULT_AREAS_OF_FOCUS,
      },
    ],
    features: POLK_FEATURES,
    gravityFormId: 31,
  },
};

export function getLocationBySlug(slug: string): LocationData | null {
  const normalized = slug.toLowerCase().replace(/\s+/g, "-");
  return LOCATIONS[normalized] ?? null;
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(LOCATIONS);
}

export type AgentWithLocation = {
  agent: AgentData;
  location: LocationData;
};

export function getAgentBySlug(
  locationSlug: string,
  agentSlug: string,
): AgentWithLocation | null {
  const location = getLocationBySlug(locationSlug);
  if (!location) return null;
  const agent = location.agents.find((a) => a.slug === agentSlug) ?? null;
  if (!agent) return null;
  return { agent, location };
}
