import { Link } from "@/app/components/ui/Link";
import type { PostsListItem } from "@/lib/queries";

type Props = {
  post: PostsListItem;
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

export function BlogPostCard({ post }: Props) {
  const category = post.categories?.nodes?.[0];
  const categorySlug = category?.slug ?? "announcements";
  const href = `/blog/${categorySlug}/${post.slug}/`;

  const excerpt = post.excerpt
    ? stripHtml(post.excerpt).slice(0, 160)
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <Link
            href={`/blog/${categorySlug}/`}
            className="mb-3 inline-block self-start rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-80"
          >
            {category.name}
          </Link>
        )}

        <h2 className="mb-2 text-base font-bold leading-snug text-[var(--color-brand-dark)]">
          <Link
            href={href}
            variant="button"
            className="text-[var(--color-brand-dark)] transition-colors hover:text-[var(--color-brand-dark)]"
          >
            {post.title}
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
