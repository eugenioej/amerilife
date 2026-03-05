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
  date?: string | null;
  excerpt?: string | null;
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
  }
`;
