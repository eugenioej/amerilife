import { Link } from "@/app/components/ui/Link";
import type { PostsListItem } from "@/lib/queries";

type Props = {
  post: PostsListItem;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

export function NewsroomArticleRow({ post }: Props) {
  const category = post.categories?.nodes?.[0];
  const categorySlug = category?.slug ?? "announcements";
  const href = `/newsroom/${categorySlug}/${post.slug}/`;

  return (
    <article className="border-b border-[var(--color-border)] py-6 last:border-b-0">
      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-muted)]">
        {category && (
          <span className="font-semibold uppercase tracking-wide text-[var(--color-brand-primary)]">
            {category.name}
          </span>
        )}
        {post.date && (
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        )}
      </div>
      <h3 className="mb-2 text-base font-bold leading-snug text-[var(--color-brand-dark)]">
        <Link href={href} variant="button" className="hover:no-underline">
          {post.title}
        </Link>
      </h3>
      <Link
        href={href}
        variant="button"
        className="text-sm font-semibold text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-primary-hover)]"
      >
        Read Article
      </Link>
    </article>
  );
}
