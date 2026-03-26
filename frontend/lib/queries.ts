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
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
};

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

export const GET_POSTS = `
  query GetPosts($first: Int!, $after: String, $categorySlug: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: $categorySlug, orderby: { field: DATE, order: DESC } }
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
  aboutOffice?: string | null;
  featuresJson?: string | null;
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

export type AgentListItemGql = {
  id: string;
  slug?: string | null;
  title?: string | null;
  menuOrder?: number | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  } | null;
  agentFields?: AgentFieldsGql | null;
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
        aboutOffice
        featuresJson
      }
      officeAgents {
        id
        slug
        title
        menuOrder
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        agentFields {
          role
          city
          state
          agentPhone
          email
          reviewsCount
          areasOfFocus
          agencySlug
        }
      }
    }
  }
`;

export type AgentByAgencySlugResult = {
  agentByAgencyAndSlug?: AgentListItemGql | null;
};

/** Agency + agent in one request for /{agencySlug}/{agentSlug}/ */
export type AgentPageDataResult = {
  agency?: AgencyDetailGql | null;
  agentByAgencyAndSlug?: AgentListItemGql | null;
};

export const GET_AGENT_PAGE_DATA = `
  query GetAgentPageData($agencySlug: ID!, $agentSlug: String!) {
    agency(id: $agencySlug, idType: SLUG) {
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
        aboutOffice
        featuresJson
      }
    }
    agentByAgencyAndSlug(agencySlug: $agencySlug, agentSlug: $agentSlug) {
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
      agentFields {
        role
        city
        state
        agentPhone
        email
        reviewsCount
        areasOfFocus
        agencyId
        agencySlug
      }
    }
  }
`;

export const GET_AGENT_BY_AGENCY_AND_SLUG = `
  query GetAgentByAgencyAndSlug($agencySlug: String!, $agentSlug: String!) {
    agentByAgencyAndSlug(agencySlug: $agencySlug, agentSlug: $agentSlug) {
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
      agentFields {
        role
        city
        state
        agentPhone
        email
        reviewsCount
        areasOfFocus
        agencyId
        agencySlug
      }
    }
  }
`;
