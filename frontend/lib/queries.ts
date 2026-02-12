// lib/queries.ts

export const GET_NODE_BY_URI = `
  query GetNodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        id
        title
        slug
        content
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
