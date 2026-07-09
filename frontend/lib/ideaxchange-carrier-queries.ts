/** Carrier Spotlight — carrier profiles and resources. */

export type IdeaxchangeCarrierResource = {
  label?: string | null;
  fileUrl?: string | null;
  mimeType?: string | null;
};

export type IdeaxchangeCarrierHighlight = {
  icon?: string | null;
  label?: string | null;
};

export type CarrierListItem = {
  id: string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
  ideaxchangeCarrierFields?: {
    isSpotlight?: boolean | null;
    isFeatured?: boolean | null;
    isHero?: boolean | null;
    brandColor?: string | null;
    websiteUrl?: string | null;
    visibility?: string | null;
    highlights?: IdeaxchangeCarrierHighlight[] | null;
    carrierResources?: IdeaxchangeCarrierResource[] | null;
  } | null;
};

export type CarrierDetail = CarrierListItem & {
  content?: string | null;
  seo?: {
    title?: string | null;
    metaDesc?: string | null;
    canonical?: string | null;
    opengraphTitle?: string | null;
    opengraphDescription?: string | null;
  } | null;
};

export type CarriersConnectionResult = {
  ideaxchangeCarriers?: {
    nodes: CarrierListItem[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
    };
  };
};

export type CarrierBySlugResult = {
  ideaxchangeCarrier?: CarrierDetail | null;
};

const CARRIER_LIST_FIELDS = `
  id
  slug
  title
  excerpt
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  ideaxchangeCarrierFields {
    isSpotlight
    isFeatured
    isHero
    brandColor
    websiteUrl
    visibility
  }
`;

export const GET_CARRIERS = `
  query GetCarriers($first: Int!, $after: String) {
    ideaxchangeCarriers(
      first: $first
      after: $after
      where: { orderby: { field: MENU_ORDER, order: ASC }, status: PUBLISH }
    ) {
      nodes {
        ${CARRIER_LIST_FIELDS}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CARRIER_BY_SLUG = `
  query GetCarrierBySlug($slug: ID!) {
    ideaxchangeCarrier(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      ideaxchangeCarrierFields {
        isSpotlight
        isFeatured
        isHero
        brandColor
        websiteUrl
        visibility
        highlights {
          icon
          label
        }
        carrierResources {
          label
          fileUrl
          mimeType
        }
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
      }
    }
  }
`;
