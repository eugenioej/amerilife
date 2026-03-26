import type { Metadata } from "next";
import { fetchGraphQL } from "@/lib/wp-client";
import { getSiteUrl } from "@/lib/seo";
import {
  GET_AGENCIES,
  GET_AGENCY_BY_SLUG,
  GET_AGENT_PAGE_DATA,
  type AgencyDetailGql,
  type AgenciesListResult,
  type AgencyBySlugResult,
  type AgentListItemGql,
  type AgentPageDataResult,
} from "@/lib/queries";
import type { AgentData, FeatureBlock, LocationData } from "@/lib/locations-data";

function isFeatureIcon(k: string): k is NonNullable<FeatureBlock["icon"]> {
  return k === "medicare" || k === "health" || k === "life" || k === "annuity";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse `features_json` from WordPress into FeatureBlock rows. */
export function parseFeaturesJson(raw: string | null | undefined): FeatureBlock[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: FeatureBlock[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const heading = typeof r.heading === "string" ? r.heading : "";
      const body = typeof r.body === "string" ? r.body : "";
      const iconRaw = typeof r.icon === "string" ? r.icon : "";
      const icon: FeatureBlock["icon"] | undefined = isFeatureIcon(iconRaw)
        ? iconRaw
        : undefined;
      if (!heading && !body) continue;
      out.push({ heading, body, ...(icon ? { icon } : {}) });
    }
    return out;
  } catch {
    return [];
  }
}

function agentNodeToAgentData(node: AgentListItemGql): AgentData {
  const f = node.agentFields;
  const title = node.title?.trim() || "Agent";
  const areas =
    f?.areasOfFocus
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? undefined;
  const bio = node.content ? stripHtml(node.content) : undefined;
  return {
    slug: node.slug ?? "",
    name: title,
    role: f?.role ?? undefined,
    city: f?.city ?? "",
    state: f?.state ?? "",
    reviewsCount: f?.reviewsCount ?? undefined,
    photoUrl: node.featuredImage?.node?.sourceUrl ?? undefined,
    bio: bio || undefined,
    email: f?.email ?? undefined,
    phone: f?.agentPhone ?? undefined,
    areasOfFocus: areas,
  };
}

/**
 * Map GraphQL agency + nested agents to LocationData for location templates.
 */
export function agencyGraphqlToLocationData(agency: AgencyDetailGql): LocationData {
  const af = agency.agencyFields;
  const agents = (agency.officeAgents ?? [])
    .filter(Boolean)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0))
    .map(agentNodeToAgentData);

  const about =
    af?.aboutOffice?.trim() ||
    (agency.content ? stripHtml(agency.content) : "") ||
    "";

  const features = parseFeaturesJson(af?.featuresJson);

  return {
    slug: agency.slug ?? "",
    officeName: agency.title ?? "",
    phone: af?.phone ?? "",
    officeImageUrl: agency.featuredImage?.node?.sourceUrl ?? undefined,
    address: {
      line1: af?.addressLine1 ?? "",
      line2: af?.addressLine2 ?? undefined,
      city: af?.addressCity ?? "",
      state: af?.addressState ?? "",
      zip: af?.addressZip ?? "",
    },
    hours: af?.hours ?? "",
    aboutOffice: about,
    agents,
    features: features.length > 0 ? features : [],
  };
}

export async function fetchAgencyBySlug(slug: string): Promise<LocationData | null> {
  try {
    const data = await fetchGraphQL<AgencyBySlugResult>(GET_AGENCY_BY_SLUG, { slug });
    const a = data.agency;
    if (!a?.slug) return null;
    return agencyGraphqlToLocationData(a);
  } catch {
    return null;
  }
}

export async function fetchAgentWithLocation(
  agencySlug: string,
  agentSlug: string
): Promise<{ agent: AgentData; location: LocationData } | null> {
  try {
    const data = await fetchGraphQL<AgentPageDataResult>(GET_AGENT_PAGE_DATA, {
      agencySlug,
      agentSlug,
    });
    if (!data.agency?.slug || !data.agentByAgencyAndSlug?.slug) return null;
    const location = agencyGraphqlToLocationData({
      ...data.agency,
      officeAgents: [],
    });
    const agent = agentNodeToAgentData(data.agentByAgencyAndSlug);
    return { agent, location };
  } catch {
    return null;
  }
}

export async function fetchAllAgencySlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<AgenciesListResult>(GET_AGENCIES);
    const nodes = data.agencies?.nodes ?? [];
    return nodes.map((n) => n.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

/** Build metadata for a location page from GraphQL (optional). */
export function agencyLocationMetadata(location: LocationData): Metadata {
  const site = getSiteUrl();
  const path = `/${location.slug}/`;
  const url = new URL(path, site).toString();
  const title = `${location.officeName} | AmeriLife`;
  const description = `${location.officeName} - ${location.address.city}, ${location.address.state}. Connect with an AmeriLife agent for insurance and retirement solutions.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "AmeriLife",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Build metadata for agent detail from GraphQL data. */
export function agentDetailMetadata(agent: AgentData, location: LocationData): Metadata {
  const site = getSiteUrl();
  const path = `/${location.slug}/${agent.slug}/`;
  const url = new URL(path, site).toString();
  const title = `${agent.name} | AmeriLife Agent`;
  const description = `${agent.name} is a licensed AmeriLife agent in ${agent.city}, ${agent.state}. Connect today for Medicare, health insurance, life insurance, and retirement solutions.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "AmeriLife",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
