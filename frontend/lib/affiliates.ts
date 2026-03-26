import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_AFFILIATES,
  type AffiliateListItem,
  type AffiliatesQueryResult,
} from "@/lib/queries";

/** Matches `LogoCarouselLogo` — kept here to avoid importing UI from `lib`. */
export type AffiliateCarouselLogo = {
  src: string;
  alt: string;
  href?: string;
};

/** Must match slugs seeded in `amerilife-affiliates-cpt.php`. */
export const AFFILIATE_CATEGORY_SLUG = {
  medicalLifeHealth: "medical-life-health",
  wealthManagementRetirement: "wealth-management-retirement",
  worksiteDistribution: "worksite-distribution",
  directToConsumer: "direct-to-consumer",
} as const;

/** Order and headings for `/our-solutions/affiliates/` carousel sections. */
export const AFFILIATE_MAIN_PAGE_SECTIONS: ReadonlyArray<{
  slug: string;
  label: string;
}> = [
  {
    slug: AFFILIATE_CATEGORY_SLUG.medicalLifeHealth,
    label: "Medical, Life & Health Market",
  },
  {
    slug: AFFILIATE_CATEGORY_SLUG.wealthManagementRetirement,
    label: "Wealth Management & Retirement Planning Market",
  },
  {
    slug: AFFILIATE_CATEGORY_SLUG.worksiteDistribution,
    label: "Worksite Distribution",
  },
  {
    slug: AFFILIATE_CATEGORY_SLUG.directToConsumer,
    label: "Direct to Consumer",
  },
];

export async function fetchAffiliateNodes(): Promise<AffiliateListItem[]> {
  try {
    const data = await fetchGraphQL<AffiliatesQueryResult>(GET_AFFILIATES);
    return data.affiliates?.nodes ?? [];
  } catch {
    return [];
  }
}

function hasCategorySlug(node: AffiliateListItem, slug: string): boolean {
  const nodes = node.affiliateCategories?.nodes;
  if (!nodes?.length) return false;
  return nodes.some((t) => t?.slug === slug);
}

/** Affiliates assigned to a taxonomy term, ordered by menu order. */
export function affiliatesInCategory(
  nodes: AffiliateListItem[],
  categorySlug: string
): AffiliateListItem[] {
  return nodes
    .filter((n) => hasCategorySlug(n, categorySlug))
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));
}

export function affiliateNodesToCarouselLogos(nodes: AffiliateListItem[]): AffiliateCarouselLogo[] {
  const sorted = [...nodes].sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));
  const out: AffiliateCarouselLogo[] = [];
  for (const n of sorted) {
    const src = n.featuredImage?.node?.sourceUrl;
    if (!src) continue;
    const alt =
      (n.featuredImage?.node?.altText && String(n.featuredImage.node.altText).trim() !== ""
        ? n.featuredImage.node.altText
        : n.title) || "Affiliate logo";
    const href = n.affiliateFields?.websiteUrl?.trim();
    out.push({
      src,
      alt,
      ...(href ? { href } : {}),
    });
  }
  return out;
}

/**
 * Build carousel sections for the main Affiliates marketing page (one band per category).
 */
export function buildMainAffiliatesCarouselCategories(nodes: AffiliateListItem[]) {
  return AFFILIATE_MAIN_PAGE_SECTIONS.map(({ slug, label }) => ({
    label,
    logos: affiliateNodesToCarouselLogos(affiliatesInCategory(nodes, slug)),
  }));
}
