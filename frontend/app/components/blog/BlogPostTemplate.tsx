import { Link } from "@/app/components/ui/Link";
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
  const authorName = post.author?.node?.name ?? "AmeriLife";
  const image = post.featuredImage?.node;
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const proseClasses =
    "max-w-none text-[var(--color-fg)] [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2";

  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <nav
        className="mb-6 text-sm text-[var(--color-muted)]"
        aria-label="Breadcrumb"
      >
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
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/blog/${categorySlug}/`}
              className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
            >
              {categoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-fg)]" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
        {post.title}
      </h1>

      <p className="mb-8 text-sm text-[var(--color-muted)]">
        {post.date && formatDate(post.date)}
        {post.date && " · "}
        <span>{categoryName}</span>
        {" · "}
        By {authorName}
      </p>

      {image?.sourceUrl && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={image.sourceUrl}
            alt={image.altText ?? post.title ?? ""}
            className="w-full object-cover"
          />
        </div>
      )}

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
