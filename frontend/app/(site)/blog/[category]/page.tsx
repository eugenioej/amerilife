import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { LEGACY_CATEGORY_SLUGS } from "@/lib/blog-legacy-category-slugs";
import { staticPageMetadata } from "@/lib/seo";

const PAGE_SIZE = 12;

type PageParams = Promise<{ category: string }>;
type SearchParams = Promise<{ stack?: string; q?: string }>;

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { category } = await params;
  const label = toTitleCase(category);
  const title = `${label} | AmeriLife Newsroom`;
  const description = `Browse AmeriLife's latest ${label.toLowerCase()} news and announcements.`;
  return staticPageMetadata(title, description, `/newsroom/${category}/`);
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { category } = await params;
  const { stack = "", q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";
  const search = q.length > 0 ? q : null;

  // Legacy URL segments (announcements, blog, partnerships) → show all posts.
  // Actual WP category slugs (leadership, mergers-and-acquisitions, etc.) → filter.
  const isLegacy = LEGACY_CATEGORY_SLUGS.has(category);
  const categoryFilter = isLegacy ? undefined : category;

  const cursors = stack ? stack.split(",") : [];
  const after = cursors[cursors.length - 1] ?? null;
  const page = cursors.length + 1;

  const [categoriesData, data] = await Promise.all([
    fetchGraphQL<BlogCategoriesResult>(GET_BLOG_CATEGORIES, { first: 100 }),
    fetchGraphQL<PostsListResult>(GET_POSTS, {
      first: PAGE_SIZE,
      after,
      categorySlug: categoryFilter ?? null,
      search,
    }),
  ]);

  const knownSlugs = new Set(
    (categoriesData?.categories?.nodes ?? [])
      .map((n) => n?.slug?.toLowerCase())
      .filter((s): s is string => Boolean(s)),
  );
  if (!isLegacy && !knownSlugs.has(category.toLowerCase())) notFound();

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

  const label = toTitleCase(category);

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Newsroom", href: "/newsroom/" },
          { label },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          {label}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          {isLegacy
            ? "The latest news, partnerships, and announcements from AmeriLife."
            : `Browse all ${label.toLowerCase()} updates from AmeriLife.`}
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
        <p className="text-[var(--color-muted)]">No posts found in this category.</p>
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
        basePath={`/news/${category}`}
        page={page}
        searchQuery={q || null}
      />
    </section>
  );
}
