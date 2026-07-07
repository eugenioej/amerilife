import type {
  CarrierDetail,
  CarrierListItem,
  IdeaxchangeCarrierHighlight,
  IdeaxchangeCarrierResource,
} from "@/lib/ideaxchange-carrier-queries";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

const img = IDEAXCHANGE_PLACEHOLDER_IMG;

const DEFAULT_HIGHLIGHTS: IdeaxchangeCarrierHighlight[] = [
  { icon: "megaphone", label: "Brand Recognition" },
  { icon: "shield", label: "Market Stability" },
  { icon: "dollar", label: "Competitive Rates" },
  { icon: "cog", label: "Technology Forward" },
  { icon: "users", label: "Broker-Focused" },
];

const MOCK_RESOURCES: IdeaxchangeCarrierResource[] = [
  { label: "Product Portfolio", fileUrl: img, mimeType: "application/pdf" },
  { label: "State Rate Sheets", fileUrl: img, mimeType: "application/pdf" },
];

function buildCarrier(
  id: string,
  slug: string,
  title: string,
  brandColor: string,
  excerpt: string,
  content: string,
  opts: { hero?: boolean; featured?: boolean; resources?: boolean } = {},
): CarrierDetail {
  return {
    id,
    slug,
    title,
    excerpt,
    content,
    featuredImage: { node: { sourceUrl: img, altText: title } },
    ideaxchangeCarrierFields: {
      isHero: opts.hero ?? false,
      isFeatured: opts.featured ?? false,
      isSpotlight: false,
      brandColor,
      websiteUrl: `https://www.${slug.replace(/-/g, "")}.com`,
      highlights: DEFAULT_HIGHLIGHTS,
      carrierResources: opts.resources === false ? [] : MOCK_RESOURCES,
    },
  };
}

export const MOCK_CARRIERS: CarrierDetail[] = [
  buildCarrier(
    "mock-carrier-ua",
    "united-american",
    "United American",
    "#244260",
    "United American Insurance Company has served Medicare supplement and life insurance markets with broker-focused products and support.",
    "<p>United American Insurance Company delivers Medicare supplement and life insurance solutions designed for independent agents and brokers. With decades of market experience, United American pairs competitive products with responsive underwriting and agent support.</p><h2>LOREM IPSUM DOLOR SIT AMET CONSECTETUR</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>",
    { hero: true, resources: true },
  ),
  buildCarrier(
    "mock-carrier-aetna",
    "aetna",
    "Aetna",
    "#7B2D8E",
    "Aetna brings national brand recognition and a broad portfolio of health and Medicare products to AmeriLife distribution partners.",
    "<p>Aetna is a leading health benefits organization with a strong Medicare Advantage and supplemental product lineup. AmeriLife affiliates benefit from training, marketing support, and competitive compensation on Aetna products.</p>",
    { hero: true },
  ),
  buildCarrier(
    "mock-carrier-moo",
    "mutual-of-omaha",
    "Mutual of Omaha",
    "#0066B3",
    "Mutual of Omaha offers life, Medicare supplement, and ancillary products backed by financial strength and agent-friendly service.",
    "<p>Mutual of Omaha has been a trusted name in insurance for generations. Brokers appreciate straightforward products, competitive rates, and dedicated field support across Medicare and life lines.</p>",
    { hero: true },
  ),
  buildCarrier(
    "mock-carrier-uhc",
    "united-healthcare",
    "United Healthcare",
    "#002677",
    "UnitedHealthcare provides Medicare Advantage and supplemental health products with national scale and local market support.",
    "<p>UnitedHealthcare partners with AmeriLife affiliates to deliver Medicare Advantage and supplemental health solutions with robust technology and enrollment tools.</p>",
    { featured: true },
  ),
  buildCarrier(
    "mock-carrier-aflac",
    "aflac",
    "Aflac",
    "#00A9E0",
    "Aflac supplemental insurance products help agents round out client portfolios with recognizable brand power.",
    "<p>Aflac's supplemental insurance products are among the most recognized in the industry, giving agents a compelling cross-sell opportunity.</p>",
    { featured: true },
  ),
  buildCarrier(
    "mock-carrier-humana",
    "humana",
    "Humana",
    "#78BE20",
    "Humana Medicare Advantage and prescription drug plans are a cornerstone offering for senior-market producers.",
    "<p>Humana remains a leader in Medicare Advantage with strong star ratings and agent resources that support year-round enrollment activity.</p>",
    { featured: true },
  ),
  buildCarrier(
    "mock-carrier-nassau",
    "nassau",
    "Nassau",
    "#1A3A5C",
    "Nassau Life and Annuity provides fixed annuity and life products for retirement-focused producers.",
    "<p>Nassau offers competitive fixed annuity and life products designed for retirement planning conversations with senior clients.</p>",
    { featured: true },
  ),
];

export function getMockCarrierSpotlightBundle(): {
  carriers: CarrierListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} {
  return {
    carriers: MOCK_CARRIERS,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}

export function getMockCarrierBySlug(slug: string): CarrierDetail | null {
  return MOCK_CARRIERS.find((c) => c.slug === slug) ?? null;
}
