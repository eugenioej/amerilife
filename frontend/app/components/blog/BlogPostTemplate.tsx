import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { getCategoryPillColor } from "@/lib/category-colors";
import type { PostByUri } from "@/lib/queries";
import { rewriteUploadsInHtml } from "@/lib/wp-media";
import { WpText } from '../ui/WpText';

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
  const proseClasses = [
    "blog-post-body max-w-none min-w-0 text-[var(--color-fg)] [overflow-wrap:anywhere]",
    "[&_p]:mb-4 [&_p]:leading-relaxed [&_p]:[overflow-wrap:anywhere]",
    "[&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_a]:[overflow-wrap:anywhere]",
    "[&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:break-words [&_h2]:text-2xl",
    "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:break-words [&_h3]:text-xl",
    "[&_img]:h-auto [&_img]:max-w-full [&_picture]:block [&_picture]:max-w-full",
    "[&_video]:h-auto [&_video]:max-w-full",
    "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md",
    "[&_figure]:my-6 [&_figure]:max-w-full",
    "[&_svg]:h-auto [&_svg]:max-w-full",
    "[&_table]:w-full [&_table]:table-fixed [&_table]:break-words [&_td]:break-words [&_th]:break-words",
    "[&_pre]:max-w-full [&_pre]:overflow-x-auto",
    "[&_blockquote]:max-w-full",
    "[&_.alignwide]:mx-auto [&_.alignwide]:max-w-full",
    "[&_.alignfull]:mx-0 [&_.alignfull]:max-w-full",
    "[&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:[overflow-wrap:anywhere]",
  ].join(" ");

  return (
    <article className="mx-auto w-full min-w-0 max-w-[min(100%,720px)] px-[var(--container-padding-x)] py-12">
      <SiteBreadcrumb
        className="mb-6 min-w-0"
        items={[
          { label: "Home", href: "/" },
          { label: "Newsroom", href: "/newsroom/" },
          {
            label: categoryName,
            href: `/blog/${categorySlug}/`,
            className: "max-w-[min(100%,12rem)] truncate sm:max-w-[min(100%,16rem)]",
          },
          {
            label: post.title ?? "Article",
            wrapMultiLine: true,
            className: "sm:max-w-[28rem]",
          },
        ]}
      />

      <WpText
        as="h1"
        text={post.title || ''}
        className="mb-4 break-words text-3xl font-bold"
      />

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
        <div className="min-w-0 max-w-full overflow-x-auto">
          <div
            className={proseClasses}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      ) : (
        <p className="text-[var(--color-muted)]">Content coming soon.</p>
      )}
    </article>
  );
}
