import type { YoastSeoData } from "@/lib/queries";
/** ideaXchange CPT — magazine index cards and hero. */
export type IdeaxchangeListItem = {
  id: string;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  ideaxchangeFields?: {
    isSpotlight?: boolean | null;
    /** Magazine “Featured articles” slot — from WP is_featured meta and/or Featured insight_tag (see mu-plugin). */
    isFeatured?: boolean | null;
  } | null;
  ideaxchangeTopics?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
};

export type IdeaxchangeConnectionResult = {
  ideaxchangeArticles?: {
    nodes: IdeaxchangeListItem[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  } | null;
};

export const GET_IDEAXCHANGE_ARTICLES = `
  query GetIdeaxchangeArticles($first: Int!, $after: String) {
    ideaxchangeArticles(
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
        ideaxchangeFields {
          isSpotlight
          isFeatured
        }
        ideaxchangeTopics {
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

/** Same as GetIdeaxchangeArticles but omits isFeatured for older WP mu-plugins. */
export const GET_IDEAXCHANGE_ARTICLES_MINIMAL = `
  query GetIdeaxchangeArticlesMinimal($first: Int!, $after: String) {
    ideaxchangeArticles(
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
        ideaxchangeFields {
          isSpotlight
        }
        ideaxchangeTopics {
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

export type IdeaxchangeDetail = IdeaxchangeListItem & {
  content?: string | null;
  seo?: YoastSeoData | null;
};

export type IdeaxchangeBySlugResult = {
  ideaxchangeArticle?: IdeaxchangeDetail | null;
};

export const GET_IDEAXCHANGE_BY_SLUG = `
  query GetIdeaxchangeBySlug($slug: ID!) {
    ideaxchangeArticle(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      excerpt
      ideaxchangeFields {
        isSpotlight
        isFeatured
      }
      ideaxchangeTopics {
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

export const GET_IDEAXCHANGE_BY_SLUG_MINIMAL = `
  query GetIdeaxchangeBySlugMinimal($slug: ID!) {
    ideaxchangeArticle(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      excerpt
      ideaxchangeFields {
        isSpotlight
      }
      ideaxchangeTopics {
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

/** Topic archive — nested insights connection supports cursor pagination. */
export type IdeaxchangeTopicBySlugResult = {
  ideaxchangeTopic?: {
    id: string;
    name?: string | null;
    slug?: string | null;
    /** Taxonomy term post count (published insights in this topic). */
    count?: number | null;
    ideaxchangeArticles?: {
      nodes: IdeaxchangeListItem[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    } | null;
  } | null;
};

export const GET_IDEAXCHANGE_TOPIC_BY_SLUG = `
  query GetIdeaxchangeTopicBySlug($slug: ID!, $first: Int!, $after: String) {
    ideaxchangeTopic(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      ideaxchangeArticles(
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
          ideaxchangeFields {
            isSpotlight
            isFeatured
          }
          ideaxchangeTopics {
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

export const GET_IDEAXCHANGE_TOPIC_BY_SLUG_MINIMAL = `
  query GetIdeaxchangeTopicBySlugMinimal($slug: ID!, $first: Int!, $after: String) {
    ideaxchangeTopic(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      ideaxchangeArticles(
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
          ideaxchangeFields {
            isSpotlight
          }
          ideaxchangeTopics {
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

export type IdeaxchangeTopicsSlugListResult = {
  ideaxchangeTopics?: {
    nodes: Array<{ slug?: string | null; name?: string | null }>;
  } | null;
};

export const GET_IDEAXCHANGE_TOPIC_SLUGS = `
  query GetIdeaxchangeTopicSlugs($first: Int!) {
    ideaxchangeTopics(first: $first) {
      nodes {
        slug
        name
      }
    }
  }
`;
