import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POSTS, type PostsListResult } from "@/lib/queries";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { Link } from "@/app/components/ui/Link";

type PageParams = Promise<{ category: string }>;

// Category slugs from the old amerilife.com URL structure that map to
// "show all posts" rather than filtering by a specific WP taxonomy category.
const LEGACY_CATEGORY_SLUGS = new Set(["announcements", "blog", "partnerships"]);

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
  return {
    title: `${label} | AmeriLife Newsroom`,
    description: `Browse AmeriLife's latest ${label.toLowerCase()} news and announcements.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: PageParams;
}) {
  const { category } = await params;

  // Legacy URL segments (announcements, blog, partnerships) → show all posts.
  // Actual WP category slugs (leadership, mergers-and-acquisitions, etc.) → filter.
  const isLegacy = LEGACY_CATEGORY_SLUGS.has(category);
  const categoryFilter = isLegacy ? undefined : category;

  const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
    first: 48,
    after: null,
    categorySlug: categoryFilter ?? null,
  });

  const posts = data?.posts?.nodes ?? [];

  // For non-legacy slugs that return no results, show 404.
  if (!isLegacy && posts.length === 0) notFound();

  const label = toTitleCase(category);

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <nav className="mb-6 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link
              href="/"
              className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/blog/"
              className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
            >
              Newsroom
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-fg)]" aria-current="page">
            {label}
          </li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          {label}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          {isLegacy
            ? "The latest news, partnerships, and announcements from AmeriLife."
            : `Browse all ${label.toLowerCase()} updates from AmeriLife.`}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">No posts found in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
