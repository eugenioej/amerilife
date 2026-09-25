import { fetchGraphQL } from "@/lib/wp-client";

import {
  GET_SPONSORS,
  type SponsorsQueryResult,
  type SponsorListItem,
} from "@/lib/queries";

export async function fetchSponsorNodes(): Promise<SponsorListItem[]> {
  try {
    const data = await fetchGraphQL<SponsorsQueryResult>(GET_SPONSORS);

    return data.givesBackSponsors?.nodes ?? [];
  } catch {
    return [];
  }
}

function hasTier(
  sponsor: SponsorListItem,
  slug: string
): boolean {
  return (
    sponsor.givesBackSponsorTiers?.nodes?.some(
      (tier) => tier?.slug === slug
    ) ?? false
  );
}

export function sponsorsInTier(
  sponsors: SponsorListItem[],
  tierSlug: string
): SponsorListItem[] {
  return sponsors
    .filter((sponsor) => hasTier(sponsor, tierSlug))
    .sort(
      (a, b) =>
        (a.menuOrder ?? 0) - (b.menuOrder ?? 0)
    );
}