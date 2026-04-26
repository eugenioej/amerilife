import { fetchGraphQL, isWpGraphqlConfigured } from "@/lib/wp-client";
import { GET_POSTS, type PostsListItem, type PostsListResult } from "@/lib/queries";

const FAQ_NEWSROOM_POST_COUNT = 12;

/** Latest newsroom posts for FAQ sidebars/lists (matches `/blog/announcements/` unfiltered listing). */
export async function getFaqNewsroomPosts(): Promise<PostsListItem[]> {
  if (!isWpGraphqlConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[faq-newsroom] NEXT_PUBLIC_GRAPHQL_ENDPOINT / NEXT_PUBLIC_WORDPRESS_URL not set — skipping post list",
      );
    }
    return [];
  }

  const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
    first: FAQ_NEWSROOM_POST_COUNT,
    after: null,
    categorySlug: null,
    search: null,
  });
  return data?.posts?.nodes ?? [];
}
