"use client";

import { Link } from "@/app/components/ui/Link";
import { getCategoryPillColor } from "@/lib/category-colors";
import type { PostsListItem } from "@/lib/queries";
import { WpText } from "../ui/WpText";

type Props = {
  post: PostsListItem;
  /** Hide the category pill (e.g. when all cards in a grid are the same category) */
  hideCategoryPill?: boolean;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

export function BlogPostCard({ post, hideCategoryPill = false }: Props) {
  const category = post.categories?.nodes?.[0];
  const categorySlug = category?.slug ?? "announcements";
  const href = `/newsroom/${categorySlug}/${post.slug}/`;

  const excerpt = post.excerpt
    ? stripHtml(post.excerpt).slice(0, 160)
    : null;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        {category && !hideCategoryPill && (
          <Link
            href={`/blog/${categorySlug}/`}
            variant="button"
            className="mb-3 inline-block self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: getCategoryPillColor(categorySlug) }}
          >
            {category.name}
          </Link>
        )}

        <h2 className="mb-2 break-words text-base font-bold leading-snug text-[var(--color-brand-dark)]">
          <Link
            href={href}
            variant="button"
            className="text-[var(--color-brand-dark)] transition-colors hover:text-[var(--color-brand-dark)]"
          >
            <WpText text={post.title || ''} />
          </Link>
        </h2>

        {excerpt && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          {post.date && (
            <span className="text-xs text-[var(--color-muted)]">
              {formatDate(post.date)}
            </span>
          )}
          <Link
            href={href}
            className="text-xs font-semibold text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-primary-hover)]"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
