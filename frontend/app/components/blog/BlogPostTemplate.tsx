import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { getCategoryPillColor } from "@/lib/category-colors";
import type { PostByUri } from "@/lib/queries";
import { rewriteUploadsInHtml } from "@/lib/wp-media";

type Props = {
  post: PostByUri;
  categorySlug: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogPostTemplate({ post, categorySlug }: Props) {
  const categoryName = post.categories?.nodes?.[0]?.name ?? "Article";
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const proseClasses =
    "max-w-none text-[var(--color-fg)] [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2";

  return (
    <article className="mx-auto max-w-[720px] px-[var(--container-padding-x)] py-12">
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Newsroom", href: "/newsroom/" },
          { label: categoryName, href: `/blog/${categorySlug}/` },
          { label: post.title ?? "Article" },
        ]}
      />

      <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {post.date && (
          <span className="text-sm text-[var(--color-muted)]">
            {formatDate(post.date)}
          </span>
        )}
        <Link
          href={`/blog/${categorySlug}/`}
          variant="button"
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: getCategoryPillColor(categorySlug) }}
        >
          {categoryName}
        </Link>
      </div>

      {html ? (
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-[var(--color-muted)]">Content coming soon.</p>
      )}
    </article>
  );
}
