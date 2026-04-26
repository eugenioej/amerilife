import { Link } from "@/app/components/ui/Link";
import { stripHtml } from "@/app/components/insights/insights-utils";
import type { PostsListItem } from "@/lib/queries";

type Props = {
  posts: PostsListItem[];
};

function postHref(post: PostsListItem): string | null {
  const slug = post.slug?.trim();
  if (!slug) return null;
  const category = post.categories?.nodes?.[0];
  const categorySlug = category?.slug ?? "announcements";
  return `/blog/${categorySlug}/${slug}/`;
}

export function FaqNewsroomSection({ posts }: Props) {
  const items = posts
    .map((post) => ({ post, href: postHref(post) }))
    .filter((x): x is { post: PostsListItem; href: string } => x.href !== null);

  if (!items.length) return null;

  return (
    <div className="space-y-8">
      {items.map(({ post, href }) => {
        const excerptPlain = post.excerpt ? stripHtml(post.excerpt) : "";
        return (
          <article
            key={post.id}
            className="border-b border-[var(--color-border)] pb-8 last:border-0 last:pb-0"
          >
            <Link href={href} variant="button" className="group block hover:no-underline">
              <h2 className="mb-2 text-lg font-semibold leading-snug text-[var(--color-brand-dark)] transition-colors group-hover:text-[var(--color-brand-primary)]">
                {post.title}
              </h2>
              {excerptPlain ? (
                <p className="text-base leading-relaxed text-[var(--color-muted)]">
                  {excerptPlain}
                </p>
              ) : null}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
