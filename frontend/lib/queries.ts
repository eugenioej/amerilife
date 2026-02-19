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
