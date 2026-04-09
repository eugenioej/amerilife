import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_BLOG_CATEGORIES,
  GET_POSTS,
  type BlogCategoriesResult,
  type PostsListResult,
} from "@/lib/queries";
import { BlogListingToolbar } from "@/app/components/blog/BlogListingToolbar";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { BlogPagination } from "@/app/components/blog/BlogPagination";
import { BLOG_ALL_POSTS_HREF } from "@/lib/blog-legacy-category-slugs";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Newsroom & Blog | AmeriLife",
  "Stay up to date with the latest news, announcements, and insights from AmeriLife — America's leading health and wealth distribution company.",
  "/blog/"
);

const PAGE_SIZE = 12;

type SearchParams = Promise<{ stack?: string; q?: string }>;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { stack = "", q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";
  const search = q.length > 0 ? q : null;

  // Derive the `after` cursor: last item in the cursor stack.
  const cursors = stack ? stack.split(",") : [];
  const after = cursors[cursors.length - 1] ?? null;
  const page = cursors.length + 1;

  const [data, categoriesData] = await Promise.all([
    fetchGraphQL<PostsListResult>(GET_POSTS, {
      first: PAGE_SIZE,
      after,
      categorySlug: null,
      search,
    }),
    fetchGraphQL<BlogCategoriesResult>(GET_BLOG_CATEGORIES, { first: 100 }),
  ]);

  const categoryOptions =
    categoriesData?.categories?.nodes
      ?.filter((n): n is { name: string; slug: string; count?: number | null } =>
        Boolean(n?.slug && n?.name),
      )
      .map((n) => ({
        name: n.name,
        slug: n.slug,
        count: n.count,
      })) ?? [];

  const posts = data?.posts?.nodes ?? [];
  const pageInfo = data?.posts?.pageInfo;

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Newsroom
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          The latest announcements, partnerships, and insights from AmeriLife.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            className="mb-10 h-14 animate-pulse rounded-lg bg-[var(--color-border)]/40"
            aria-hidden
          />
        }
      >
        <BlogListingToolbar categories={categoryOptions} />
      </Suspense>

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
        basePath={BLOG_ALL_POSTS_HREF}
        page={page}
        searchQuery={q || null}
      />
    </section>
  );
}
