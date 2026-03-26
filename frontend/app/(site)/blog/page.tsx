import type { Metadata } from "next";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POSTS, type PostsListResult } from "@/lib/queries";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { BlogPagination } from "@/app/components/blog/BlogPagination";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Newsroom & Blog | AmeriLife",
  "Stay up to date with the latest news, announcements, and insights from AmeriLife — America's leading health and wealth distribution company.",
  "/blog/"
);

const PAGE_SIZE = 12;

type SearchParams = Promise<{ stack?: string }>;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { stack = "" } = await searchParams;

  // Derive the `after` cursor: last item in the cursor stack.
  const cursors = stack ? stack.split(",") : [];
  const after = cursors[cursors.length - 1] ?? null;
  const page = cursors.length + 1;

  const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
    first: PAGE_SIZE,
    after,
  });

  const posts = data?.posts?.nodes ?? [];
  const pageInfo = data?.posts?.pageInfo;

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Newsroom
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          The latest announcements, partnerships, and insights from AmeriLife.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">No posts found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <BlogPagination
        hasNextPage={pageInfo?.hasNextPage ?? false}
        endCursor={pageInfo?.endCursor ?? null}
        stack={stack}
        basePath="/blog"
        page={page}
      />
    </section>
  );
}
