import { Link } from "@/app/components/ui/Link";

type Props = {
  hasNextPage: boolean;
  endCursor: string | null;
  /** Cursor stack encoded as a comma-separated string (URL param "stack"). */
  stack: string;
  /** Base path for the listing, e.g. "/blog" or "/blog/announcements". */
  basePath: string;
  page: number;
};

/**
 * Cursor-stack pagination for WPGraphQL cursor-based pagination.
 *
 * URL strategy:
 *   Page 1: /blog
 *   Page 2: /blog?stack=<c1>          (after = c1)
 *   Page 3: /blog?stack=<c1>,<c2>     (after = c2)
 *
 * Going back removes the last cursor from the stack.
 */
export function BlogPagination({
  hasNextPage,
  endCursor,
  stack,
  basePath,
  page,
}: Props) {
  if (page === 1 && !hasNextPage) return null;

  const cursors = stack ? stack.split(",") : [];

  // Previous page URL: remove last cursor from stack
  const prevCursors = cursors.slice(0, -1);
  const prevUrl =
    prevCursors.length > 0
      ? `${basePath}?stack=${prevCursors.join(",")}`
      : basePath;

  // Next page URL: append current endCursor to stack
  const nextCursors = endCursor ? [...cursors, endCursor] : cursors;
  const nextUrl = `${basePath}?stack=${nextCursors.join(",")}`;

  const btnBase =
    "inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors";
  const active =
    "border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90";
  const inactive =
    "border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-gray-50";
  const disabled =
    "border-[var(--color-border)] bg-white text-[var(--color-muted)] cursor-not-allowed opacity-50 pointer-events-none";

  return (
    <nav
      className="mt-12 flex items-center justify-between border-t border-[var(--color-border)] pt-8"
      aria-label="Pagination"
    >
      <span className="text-sm text-[var(--color-muted)]">Page {page}</span>

      <div className="flex gap-3">
        {page > 1 ? (
          <Link href={prevUrl} variant="button" className={`${btnBase} ${inactive}`}>
            ← Previous
          </Link>
        ) : (
          <span className={`${btnBase} ${disabled}`}>← Previous</span>
        )}

        <span className={`${btnBase} ${active}`}>{page}</span>

        {hasNextPage && endCursor ? (
          <Link href={nextUrl} variant="button" className={`${btnBase} ${inactive}`}>
            Next →
          </Link>
        ) : (
          <span className={`${btnBase} ${disabled}`}>Next →</span>
        )}
      </div>
    </nav>
  );
}
