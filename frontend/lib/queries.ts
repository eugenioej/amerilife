// lib/queries.ts

/** Yoast SEO data exposed via WPGraphQL Yoast SEO Addon. */
export type YoastSeoData = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphUrl?: string | null;
  opengraphImage?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: {
    sourceUrl?: string | null;
  } | null;
};

export type PageWithSeo = {
  __typename: string;
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  seo?: YoastSeoData | null;
};

export const GET_NODE_BY_URI = `
  query GetNodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        id
        title
        slug
        content
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphUrl
          opengraphImage {
            sourceUrl
            altText
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
        }
      }
    }
  }
`;

export type PostByUri = {
  __typename: "Post";
  id: string;
  title?: string | null;
  content?: string | null;
  date?: string | null;
  excerpt?: string | null;
  uri?: string | null;
  seo?: YoastSeoData | null;
  author?: {
    node?: {
      name?: string | null;
    };
  } | null;
  categories?: {
    nodes?: Array<{
      name?: string | null;
      slug?: string | null;
    }>;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
};

export const GET_POST_BY_URI = `
  query GetPostByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Post {
        id
        title
        content
        date
        excerpt
        uri
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphUrl
          opengraphImage {
            sourceUrl
            altText
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      __typename
      id
      title
      content
      date
      excerpt
      uri
      slug
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphImage {
          sourceUrl
          altText
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
      }
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export type PostsListItem = {
  id: string;
  title?: string | null;
  uri?: string | null;
  slug?: string | null;
  date?: string | null;
  excerpt?: string | null;
  categories?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
  tags?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
};

/** Posts tagged "Featured" (name or slug, case-insensitive) sort before others; order among equals preserved. */
export function sortPostsFeaturedFirst(nodes: PostsListItem[]): PostsListItem[] {
  const isFeatured = (p: PostsListItem) =>
    p.tags?.nodes?.some(
      (t) =>
        t.slug?.toLowerCase() === "featured" || t.name?.toLowerCase() === "featured"
    ) ?? false;
  return [...nodes].sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)));
}

export type PostsListResult = {
  posts: {
    nodes: PostsListItem[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

/** Paginated published pages for sitemap (URI paths). */
export type PagesSitemapResult = {
  pages?: {
    nodes: Array<{ uri?: string | null }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  } | null;
};

export const GET_PAGES_SITEMAP = `
  query GetPagesSitemap($first: Int!, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        uri
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Paginated published posts for sitemap. */
export type PostsSitemapResult = {
  posts?: {
    nodes: Array<{ uri?: string | null }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  } | null;
};

export const GET_POSTS_SITEMAP = `
  query GetPostsSitemap($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        uri
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export type AgenciesSitemapResult = {
  agencies?: {
    nodes: Array<{
      slug?: string | null;
      officeAgents?: Array<{ slug?: string | null } | null> | null;
    }>;
  } | null;
};

export const GET_AGENCIES_FOR_SITEMAP = `
  query GetAgenciesForSitemap {
    agencies(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        officeAgents {
          slug
        }
      }
    }
  }
`;

/** Blog category pills / filters — taxonomy list with counts. */
export type BlogCategoriesResult = {
  categories?: {
    nodes: Array<{
      name?: string | null;
      slug?: string | null;
      count?: number | null;
    }>;
  } | null;
};

export const GET_BLOG_CATEGORIES = `
  query GetBlogCategories($first: Int!) {
    categories(first: $first, where: { hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const GET_POSTS = `
  query GetPosts($first: Int!, $after: String, $categorySlug: String, $search: String) {
    posts(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        categoryName: $categorySlug
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        title
        uri
        slug
        date
        excerpt
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_MENUS = `
  query GetMenus {
    menus {
      nodes {
        id
        name
        slug
        menuItems(first: 100) {
          nodes {
            id
            label
            url
            path
            parentId
          }
        }
      }
    }
  }
`;

export const GET_MENU_BY_SLUG = `
  query GetMenuBySlug($slug: String!) {
    menu(id: $slug, idType: SLUG) {
      id
      name
      menuItems(first: 100) {
        nodes {
          id
          label
          url
          path
          parentId
        }
      }
    }
  }
`;

/** Menu items by theme location. Tries PRIMARY then HEADER. */
export const GET_MENU_ITEMS_PRIMARY = `
  query GetMenuItemsPrimary {
    menuItems(where: { location: PRIMARY }, first: 100) {
      nodes {
        id
        label
        url
        path
        parentId
      }
    }
  }
`;

/** Redirects from WPGraphQL Redirection Addon (Redirection plugin). */
export const GET_REDIRECTS = `
  query GetRedirects {
    redirection {
      redirects {
        origin
        target
        type
        matchType
      }
    }
  }
`;

export const GET_MENU_ITEMS_HEADER = `
  query GetMenuItemsHeader {
    menuItems(where: { location: HEADER }, first: 100) {
      nodes {
        id
        label
        url
        path
        parentId
      }
    }
  }
`;

export type SearchResultNode = {
  __typename: string;
  id: string;
  title?: string;
  uri?: string;
  date?: string;
  excerpt?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
};

export type SearchResults = {
  contentNodes: {
    nodes: SearchResultNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

export const SEARCH_CONTENT = `
  query SearchContent($search: String!, $first: Int!, $after: String) {
    contentNodes(
      where: { search: $search, contentTypes: [PAGE, POST] }
      first: $first
      after: $after
    ) {
      nodes {
        __typename
        id
        ... on Page {
          title
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        ... on Post {
          title
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export type PostSearchNode = {
  id: string;
  title?: string | null;
  uri?: string | null;
  slug?: string | null;
  date?: string | null;
  excerpt?: string | null;
  categories?: {
    nodes?: Array<{ slug?: string | null }>;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
};

export type PostsSearchResult = {
  posts: {
    nodes: PostSearchNode[];
  };
};

/** Search only blog posts (WP Post type). Use with static page search for hybrid results. */
export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int!) {
    posts(where: { search: $search }, first: $first) {
      nodes {
        id
        title
        uri
        slug
        date
        excerpt
        categories {
          nodes {
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export type AgencySearchNode = {
  id: string;
  slug?: string | null;
  title?: string | null;
  content?: string | null;
  agencyFields?: {
    addressLine1?: string | null;
    addressLine2?: string | null;
    addressCity?: string | null;
    addressState?: string | null;
    addressZip?: string | null;
    phone?: string | null;
  } | null;
};

/** Paginated agency list for server-side search (WP `search` does not match address meta). */
export type AgenciesSearchBatchResult = {
  agencies?: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: AgencySearchNode[];
  };
};

export const GET_AGENCIES_SEARCH_BATCH = `
  query GetAgenciesSearchBatch($first: Int!, $after: String) {
    agencies(
      first: $first
      after: $after
      where: { orderby: { field: MENU_ORDER, order: ASC } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        title
        content
        agencyFields {
          addressLine1
          addressLine2
          addressCity
          addressState
          addressZip
          phone
        }
      }
    }
  }
`;

export type InsightSearchNode = {
  id: string;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
};

export type InsightsSearchResult = {
  insights?: {
    nodes: InsightSearchNode[];
  };
};

/** Insights CPT — magazine articles (`/insights/[slug]/`). */
export const SEARCH_INSIGHTS = `
  query SearchInsights($search: String!, $first: Int!) {
    insights(where: { search: $search }, first: $first) {
      nodes {
        id
        slug
        title
        date
        excerpt
      }
    }
  }
`;

export type InsightSearchBatchNode = InsightSearchNode & {
  content?: string | null;
  insightTopics?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
};

export type InsightsSearchBatchResult = {
  insights?: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: InsightSearchBatchNode[];
  };
};

/** Paginated insights list for server-side search (WP `search` misses topics and body text). */
export const GET_INSIGHTS_SEARCH_BATCH = `
  query GetInsightsSearchBatch($first: Int!, $after: String) {
    insights(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
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
        insightTopics {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

/**
 * Leader CPT — maps to amerilife.com-style leader pages (e.g. /our-leaders/[slug]/ on legacy site).
 *
 * | On-page (live)              | WordPress              | GraphQL                          |
 * | --------------------------- | ---------------------- | -------------------------------- |
 * | Leader name (H1, breadcrumb)| Post title             | `title`                          |
 * | Role / job title            | Meta `job_title`       | `leaderFields.jobTitle`        |
 * | Headshot                    | Featured image         | `featuredImage.node`           |
 * | Bio paragraphs              | Post body (editor)     | `content` (HTML)               |
 * | LinkedIn (“view linkedin”)  | Meta `linkedin_url`    | `leaderFields.linkedinUrl`     |
 * | Listing order / prev-next | Page attributes order  | `menuOrder` + `GET_LEADERS`    |
 * | URL segment                 | Post slug              | `slug`                         |
 * | Page & sharing SEO        | Yoast (if enabled)     | `seo` on detail query only     |
 */
/** Leader CPT (WPGraphQL) — listing card / grid item. */
export type LeaderListItem = {
  id: string;
  title?: string | null;
  slug?: string | null;
  menuOrder?: number | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
  leaderFields?: {
    jobTitle?: string | null;
    linkedinUrl?: string | null;
  } | null;
};

export type LeadersQueryResult = {
  leaders?: {
    nodes: LeaderListItem[];
  } | null;
};

export const GET_LEADERS = `
  query GetLeaders {
    leaders(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        menuOrder
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        leaderFields {
          jobTitle
          linkedinUrl
        }
      }
    }
  }
`;

/** Full leader for detail page (bio + SEO). */
export type LeaderDetail = {
  id: string;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  menuOrder?: number | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
  leaderFields?: {
    jobTitle?: string | null;
    linkedinUrl?: string | null;
  } | null;
  seo?: YoastSeoData | null;
};

export type LeaderBySlugResult = {
  leader?: LeaderDetail | null;
};

/**
 * Affiliate CPT — logos, optional website link, and one or more category terms per post.
 */
export type AffiliateListItem = {
  id: string;
  title?: string | null;
  menuOrder?: number | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
  affiliateFields?: {
    websiteUrl?: string | null;
  } | null;
  affiliateCategories?: {
    nodes?: Array<{
      name?: string | null;
      slug?: string | null;
    }>;
  } | null;
};

export type AffiliatesQueryResult = {
  affiliates?: {
    nodes: AffiliateListItem[];
  } | null;
};

export const GET_AFFILIATES = `
  query GetAffiliates {
    affiliates(first: 200, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        title
        menuOrder
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        affiliateFields {
          websiteUrl
        }
        affiliateCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_LEADER_BY_SLUG = `
  query GetLeaderBySlug($slug: ID!) {
    leader(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      menuOrder
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      leaderFields {
        jobTitle
        linkedinUrl
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphImage {
          sourceUrl
          altText
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
      }
    }
  }
`;

/**
 * Agency CPT — career office / location pages (e.g. /polk-county/).
 */
export type AgencyFieldsGql = {
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
  hours?: string | null;
  featuresJson?: string | null;
  /** Gravity Forms form ID for “Connect with an Agent” (headless instance). */
  gravityFormId?: number | null;
  /** Google Maps search URL for office location (from import enrichment). */
  mapSearchUrl?: string | null;
  /** Set by MU plugin `amerilife-agency-cpt.php` when `heroImageUrl` is added to queries. */
  heroImageUrl?: string | null;
};

export type AgentFieldsGql = {
  role?: string | null;
  city?: string | null;
  state?: string | null;
  agentPhone?: string | null;
  email?: string | null;
  reviewsCount?: number | null;
  areasOfFocus?: string | null;
  agencyId?: number | null;
  agencySlug?: string | null;
};

/** Flat OfficeAgent type returned by officeAgents and agentByAgencyAndSlug. */
export type AgentListItemGql = {
  slug?: string | null;
  name?: string | null;
  menuOrder?: number | null;
  content?: string | null;
  photoUrl?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  areasOfFocus?: string | null;
  reviewsCount?: number | null;
  agencyId?: number | null;
  agencySlug?: string | null;
};

export type AgencyDetailGql = {
  id: string;
  slug?: string | null;
  title?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
  agencyFields?: AgencyFieldsGql | null;
  officeAgents?: AgentListItemGql[] | null;
};

export type AgencyBySlugResult = {
  agency?: AgencyDetailGql | null;
};

export type AgenciesListResult = {
  agencies?: {
    nodes: Array<{
      id: string;
      slug?: string | null;
      title?: string | null;
    }>;
  } | null;
};

export const GET_AGENCIES = `
  query GetAgencies {
    agencies(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
      }
    }
  }
`;

/** List view for /find-an-agent/ — enough fields for cards + product/zip filters. */
export type AgenciesForFindAgentResult = {
  agencies?: {
    nodes: Array<{
      id: string;
      slug?: string | null;
      title?: string | null;
      featuredImage?: {
        node?: { sourceUrl?: string | null; altText?: string | null };
      } | null;
      agencyFields?: {
        phone?: string | null;
        addressLine1?: string | null;
        addressLine2?: string | null;
        addressCity?: string | null;
        addressState?: string | null;
        addressZip?: string | null;
        hours?: string | null;
        featuresJson?: string | null;
        mapSearchUrl?: string | null;
        heroImageUrl?: string | null;
        gravityFormId?: number | null;
      } | null;
    }>;
  } | null;
};

export const GET_AGENCIES_FOR_FIND_AGENT = `
  query GetAgenciesForFindAgent {
    agencies(first: 200, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        agencyFields {
          phone
          addressLine1
          addressLine2
          addressCity
          addressState
          addressZip
          hours
          featuresJson
          mapSearchUrl
          heroImageUrl
          gravityFormId
        }
      }
    }
  }
`;

export const GET_AGENCY_BY_SLUG = `
  query GetAgencyBySlug($slug: ID!) {
    agency(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      agencyFields {
        phone
        addressLine1
        addressLine2
        addressCity
        addressState
        addressZip
        hours
        featuresJson
        gravityFormId
        mapSearchUrl
        heroImageUrl
      }
      officeAgents {
        slug
        name
        menuOrder
        content
        photoUrl
        role
        email
        phone
        city
        state
        areasOfFocus
        reviewsCount
        agencySlug
      }
    }
  }
`;

export type AgentByAgencySlugResult = {
  agentByAgencyAndSlug?: AgentListItemGql | null;
};

export type AgentPageDataResult = {
  agency?: AgencyDetailGql | null;
  agentByAgencyAndSlug?: AgentListItemGql | null;
};

/** `agency(id:)` expects `ID!`; `agentByAgencyAndSlug(agencySlug:)` expects `String!` — use two variables with the same slug value. */
export const GET_AGENT_PAGE_DATA = `
  query GetAgentPageData($agencyId: ID!, $agencySlug: String!, $agentSlug: String!) {
    agency(id: $agencyId, idType: SLUG) {
      id
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      agencyFields {
        phone
        addressLine1
        addressLine2
        addressCity
        addressState
        addressZip
        hours
        featuresJson
        gravityFormId
        mapSearchUrl
        heroImageUrl
      }
    }
    agentByAgencyAndSlug(agencySlug: $agencySlug, agentSlug: $agentSlug) {
      slug
      name
      content
      menuOrder
      photoUrl
      role
      email
      phone
      city
      state
      areasOfFocus
      reviewsCount
      agencyId
      agencySlug
    }
  }
`;

export const GET_AGENT_BY_AGENCY_AND_SLUG = `
  query GetAgentByAgencyAndSlug($agencySlug: String!, $agentSlug: String!) {
    agentByAgencyAndSlug(agencySlug: $agencySlug, agentSlug: $agentSlug) {
      slug
      name
      content
      menuOrder
      photoUrl
      role
      email
      phone
      city
      state
      areasOfFocus
      reviewsCount
      agencyId
      agencySlug
    }
  }
`;

/** Insights CPT — magazine index cards and hero. */
export type InsightListItem = {
  id: string;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  insightFields?: {
    isSpotlight?: boolean | null;
    /** Magazine “Featured articles” slot — from WP is_featured meta and/or Featured insight_tag (see mu-plugin). */
    isFeatured?: boolean | null;
  } | null;
  insightTopics?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
};

export type InsightsConnectionResult = {
  insights?: {
    nodes: InsightListItem[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  } | null;
};

export const GET_INSIGHTS = `
  query GetInsights($first: Int!, $after: String) {
    insights(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
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
        insightFields {
          isSpotlight
          isFeatured
        }
        insightTopics {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

/** Same as GetInsights but omits isFeatured for older WP mu-plugins. */
export const GET_INSIGHTS_MINIMAL = `
  query GetInsightsMinimal($first: Int!, $after: String) {
    insights(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
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
        insightFields {
          isSpotlight
        }
        insightTopics {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export type InsightDetail = InsightListItem & {
  content?: string | null;
  seo?: YoastSeoData | null;
};

export type InsightBySlugResult = {
  insight?: InsightDetail | null;
};

export const GET_INSIGHT_BY_SLUG = `
  query GetInsightBySlug($slug: ID!) {
    insight(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      excerpt
      insightFields {
        isSpotlight
        isFeatured
      }
      insightTopics {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphImage {
          sourceUrl
          altText
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_INSIGHT_BY_SLUG_MINIMAL = `
  query GetInsightBySlugMinimal($slug: ID!) {
    insight(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      excerpt
      insightFields {
        isSpotlight
      }
      insightTopics {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphImage {
          sourceUrl
          altText
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
      }
    }
  }
`;

export type InsightsAdSlotSetting = {
  imageUrl?: string | null;
  targetUrl?: string | null;
  altText?: string | null;
};

export type InsightsAdsSettings = {
  primaryHorizontal?: InsightsAdSlotSetting | null;
  secondaryHorizontal?: InsightsAdSlotSetting | null;
  sidebarVertical?: InsightsAdSlotSetting | null;
  inArticle?: InsightsAdSlotSetting | null;
};

export type InsightsAdsSettingsResult = {
  insightsAdsSettings?: InsightsAdsSettings | null;
};

export const GET_INSIGHTS_ADS_SETTINGS = `
  query GetInsightsAdsSettings {
    insightsAdsSettings {
      primaryHorizontal {
        imageUrl
        targetUrl
        altText
      }
      secondaryHorizontal {
        imageUrl
        targetUrl
        altText
      }
      sidebarVertical {
        imageUrl
        targetUrl
        altText
      }
      inArticle {
        imageUrl
        targetUrl
        altText
      }
    }
  }
`;

/** Topic archive — nested insights connection supports cursor pagination. */
export type InsightTopicBySlugResult = {
  insightTopic?: {
    id: string;
    name?: string | null;
    slug?: string | null;
    /** Taxonomy term post count (published insights in this topic). */
    count?: number | null;
    insights?: {
      nodes: InsightListItem[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    } | null;
  } | null;
};

export const GET_INSIGHT_TOPIC_BY_SLUG = `
  query GetInsightTopicBySlug($slug: ID!, $first: Int!, $after: String) {
    insightTopic(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      insights(
        first: $first
        after: $after
        where: { orderby: { field: DATE, order: DESC } }
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
          insightFields {
            isSpotlight
            isFeatured
          }
          insightTopics {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export const GET_INSIGHT_TOPIC_BY_SLUG_MINIMAL = `
  query GetInsightTopicBySlugMinimal($slug: ID!, $first: Int!, $after: String) {
    insightTopic(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      insights(
        first: $first
        after: $after
        where: { orderby: { field: DATE, order: DESC } }
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
          insightFields {
            isSpotlight
          }
          insightTopics {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export type InsightTopicsSlugListResult = {
  insightTopics?: {
    nodes: Array<{ slug?: string | null; name?: string | null }>;
  } | null;
};

export const GET_INSIGHT_TOPIC_SLUGS = `
  query GetInsightTopicSlugs($first: Int!) {
    insightTopics(first: $first) {
      nodes {
        slug
        name
      }
    }
  }
`;
