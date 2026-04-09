"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "@/app/components/ui/ChevronDownIcon";
import {
  BLOG_ALL_POSTS_HREF,
  LEGACY_CATEGORY_SLUGS,
} from "@/lib/blog-legacy-category-slugs";

export type BlogCategoryOption = {
  name: string;
  slug: string;
  count?: number | null;
};

type Props = {
  categories: BlogCategoryOption[];
};

function buildListingHref(path: string, q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return path;
  const params = new URLSearchParams();
  params.set("q", trimmed);
  return `${path}?${params.toString()}`;
}

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function BlogListingToolbar({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const sorted = [...categories].filter((c) => c.slug).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const isAll = pathname === "/blog" || pathname === "/blog/";
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  const activeSlug = match?.[1] ?? null;

  const isLegacyAllPosts =
    activeSlug != null && LEGACY_CATEGORY_SLUGS.has(activeSlug);
  const selectValue =
    isAll || isLegacyAllPosts ? "all" : activeSlug ?? "all";
  const slugMissingFromList =
    Boolean(activeSlug) &&
    !isAll &&
    !isLegacyAllPosts &&
    !sorted.some((c) => c.slug === activeSlug);

  const selectId = "blog-category-select";

  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
      <div className="relative w-full min-w-0 sm:max-w-xs">
        <label htmlFor={selectId} className="sr-only">
          Category
        </label>
        <select
          id={selectId}
          value={selectValue}
          onChange={(e) => {
            const v = e.target.value;
            const path =
              v === "all" ? BLOG_ALL_POSTS_HREF : `/blog/${v}`;
            router.push(buildListingHref(path, q));
          }}
          className="w-full cursor-pointer appearance-none rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-[var(--color-fg)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {slugMissingFromList && activeSlug ? (
            <option value={activeSlug}>{slugToLabel(activeSlug)}</option>
          ) : null}
          {sorted.map((cat) => {
            const slug = cat.slug!;
            return (
              <option key={slug} value={slug}>
                {cat.name}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          size={18}
        />
      </div>

      <form
        action={pathname || BLOG_ALL_POSTS_HREF}
        method="get"
        className="flex w-full min-w-0 flex-1 gap-2 sm:max-w-md lg:max-w-lg"
        role="search"
        aria-label="Search posts"
      >
        <label htmlFor="blog-search-q" className="sr-only">
          Search posts
        </label>
        <input
          id="blog-search-q"
          key={`q-${q}`}
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search posts…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>
    </div>
  );
}
