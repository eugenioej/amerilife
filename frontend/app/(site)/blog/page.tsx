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
  "/newsroom/"
);

const PAGE_SIZE = 12;
const LISTING_FETCH_LIMIT = 100;

function parseListingPage(sp: { page?: string | string[] }): number {
  const raw = sp.page;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = s ? parseInt(s, 10) : 1;

  if (!Number.isFinite(n) || n < 1) return 1;

  return Math.floor(n);
}

function parseSearchQuery(sp: { q?: string | string[] }): string {
  const raw = sp.q;
  const value = Array.isArray(raw) ? raw[0] : raw;

  return value?.trim() ?? "";
}

type SearchParams = Promise<{
  page?: string | string[];
  q?: string | string[];
}>;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
const currentPage = parseListingPage(sp);
const q = parseSearchQuery(sp);
const search = q.length > 0 ? q : null;

  const [data, categoriesData] = await Promise.all([
    fetchGraphQL<PostsListResult>(GET_POSTS, {
  first: LISTING_FETCH_LIMIT,
  after: null,
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

  const allPosts = data?.posts?.nodes ?? [];
const totalCount = allPosts.length;
const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);

const safeCurrentPage = Math.min(currentPage, totalPages);
const start = (safeCurrentPage - 1) * PAGE_SIZE;
const posts = allPosts.slice(start, start + PAGE_SIZE);

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
  basePath={BLOG_ALL_POSTS_HREF}
  currentPage={safeCurrentPage}
  totalPages={totalPages}
  searchQuery={q || null}
/>
    </section>
  );
}
