// lib/queries.ts

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      slug
      content
      seo {
        title
        metaDesc
      }
    }
  }
`;