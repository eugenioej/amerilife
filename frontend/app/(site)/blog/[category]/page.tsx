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
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { LEGACY_CATEGORY_SLUGS } from "@/lib/blog-legacy-category-slugs";
import { staticPageMetadata } from "@/lib/seo";

const PAGE_SIZE = 12;
const LISTING_FETCH_LIMIT = 100;

type PageParams = Promise<{ category: string }>;
type SearchParams = Promise<{
  page?: string | string[];
  q?: string | string[];
}>;

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
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
const sp = await searchParams;
const currentPage = parseListingPage(sp);
const q = parseSearchQuery(sp);
const search = q.length > 0 ? q : null;

// Legacy URL segments (announcements, blog, partnerships) → show all posts.
// Actual WP category slugs (leadership, mergers-and-acquisitions, etc.) → filter.
const isLegacy = LEGACY_CATEGORY_SLUGS.has(category);
const categoryFilter = isLegacy ? undefined : category;

  const [categoriesData, data] = await Promise.all([
    fetchGraphQL<BlogCategoriesResult>(GET_BLOG_CATEGORIES, { first: 100 }),
    fetchGraphQL<PostsListResult>(GET_POSTS, {
  first: LISTING_FETCH_LIMIT,
  after: null,
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

  const allPosts = data?.posts?.nodes ?? [];
const totalCount = allPosts.length;
const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);

const safeCurrentPage = Math.min(currentPage, totalPages);
const start = (safeCurrentPage - 1) * PAGE_SIZE;
const posts = allPosts.slice(start, start + PAGE_SIZE);

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
  basePath={`/news/${category}/`}
  currentPage={safeCurrentPage}
  totalPages={totalPages}
  searchQuery={q || null}
/>
    </section>
  );
}
