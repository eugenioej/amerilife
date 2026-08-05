/** Recruiting Hub — case studies and company profiles. */

export type IdeaxchangeCampaignAsset = {
  label?: string | null;
  fileUrl?: string | null;
  mimeType?: string | null;
};

export type IdeaxchangeCompanySummary = {
  id: string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
  ideaxchangeCompanyFields?: {
    websiteUrl?: string | null;
    learnMoreUrl?: string | null;
    visibility?: string | null;
  } | null;
};

export type CaseStudyListItem = {
  id: string;
  slug?: string | null;
  title?: string | null;
  ideaxchangeCaseStudyTags?: {
    nodes?: {
      id: string;
      name?: string | null;
      slug?: string | null;
    }[];
  } | null;
  date?: string | null;
  excerpt?: string | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
  ideaxchangeCaseStudyFields?: {
    isSpotlight?: boolean | null;
    isFeatured?: boolean | null;
    isHeroFeatured?: boolean | null;
    isPopup?: boolean | null;
    featuredVideoUrl?: string | null;
    marketingCtaUrl?: string | null;
    targetAudience?: string | null;
    campaignSpend?: string | null;
    campaignResults?: string | null;
    campaignOverview?: string | null;
    contentWithoutResultsHtml?: string | null;
    resultsContentHtml?: string | null;
    visibility?: string | null;
    campaignAssets?: IdeaxchangeCampaignAsset[] | null;
  } | null;
  caseStudyCompany?: IdeaxchangeCompanySummary | null;
};

export type CaseStudyDetail = CaseStudyListItem & {
  content?: string | null;
  seo?: {
    title?: string | null;
    metaDesc?: string | null;
    canonical?: string | null;
    opengraphTitle?: string | null;
    opengraphDescription?: string | null;
  } | null;
};

export type CaseStudiesConnectionResult = {
  ideaxchangeCaseStudies?: {
    nodes: CaseStudyListItem[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
    };
  };
};

export type CaseStudyBySlugResult = {
  ideaxchangeCaseStudy?: CaseStudyDetail | null;
};

export type CompanyBySlugResult = {
  ideaxchangeCompany?: IdeaxchangeCompanySummary | null;
};

export type CompaniesConnectionResult = {
  ideaxchangeCompanies?: {
    nodes: IdeaxchangeCompanySummary[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
    };
  };
};

const CASE_STUDY_LIST_FIELDS = `
  id
  slug
  title
  ideaxchangeCaseStudyTags {
    nodes {
      id
      name
      slug
    }
  }
  date
  excerpt
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  ideaxchangeCaseStudyFields {
    isSpotlight
    isFeatured
    isHeroFeatured
    isPopup
    featuredVideoUrl
    targetAudience
    campaignSpend
    campaignResults
    campaignOverview
    visibility
  }
  caseStudyCompany {
    id
    slug
    title
  }
`;

export const GET_CASE_STUDIES = `
  query GetCaseStudies($first: Int!, $after: String) {
    ideaxchangeCaseStudies(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC }, status: PUBLISH }
    ) {
      nodes {
        ${CASE_STUDY_LIST_FIELDS}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Paginated case studies for server-side search (includes body + campaign fields). */
export type CaseStudySearchNode = {
  id: string;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  ideaxchangeCaseStudyFields?: {
    targetAudience?: string | null;
    campaignOverview?: string | null;
    campaignResults?: string | null;
    visibility?: string | null;
  } | null;
  caseStudyCompany?: {
    title?: string | null;
    slug?: string | null;
  } | null;
};

export type CaseStudiesSearchBatchResult = {
  ideaxchangeCaseStudies?: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: CaseStudySearchNode[];
  };
};

export const GET_CASE_STUDIES_SEARCH_BATCH = `
  query GetCaseStudiesSearchBatch($first: Int!, $after: String) {
    ideaxchangeCaseStudies(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC }, status: PUBLISH }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        title
        date
        excerpt
        content
        ideaxchangeCaseStudyFields {
          targetAudience
          campaignOverview
          campaignResults
          visibility
        }
        caseStudyCompany {
          title
          slug
        }
      }
    }
  }
`;

export const GET_CASE_STUDY_BY_SLUG = `
  query GetCaseStudyBySlug($slug: ID!) {
    ideaxchangeCaseStudy(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      excerpt
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      ideaxchangeCaseStudyFields {
        isSpotlight
        isFeatured
        isHeroFeatured
        isPopup
        featuredVideoUrl
        marketingCtaUrl
        visibility
        contentWithoutResultsHtml
        resultsContentHtml
        campaignAssets {
          label
          fileUrl
          mimeType
        }
      }
      caseStudyCompany {
        id
        slug
        title
        excerpt
        ideaxchangeCompanyFields {
          websiteUrl
          learnMoreUrl
          visibility
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

export const GET_COMPANY_BY_SLUG = `
  query GetCompanyBySlug($slug: ID!) {
    ideaxchangeCompany(id: $slug, idType: SLUG) {
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
      ideaxchangeCompanyFields {
        websiteUrl
        learnMoreUrl
        visibility
      }
    }
  }
`;

/** Paginated companies for server-side search. */
export const GET_COMPANIES_SEARCH_BATCH = `
  query GetCompaniesSearchBatch($first: Int!, $after: String) {
    ideaxchangeCompanies(
      first: $first
      after: $after
      where: { orderby: { field: TITLE, order: ASC }, status: PUBLISH }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        title
        excerpt
        content
        ideaxchangeCompanyFields {
          websiteUrl
          learnMoreUrl
          visibility
        }
      }
    }
  }
`;

