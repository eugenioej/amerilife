import { Link } from "@/app/components/ui/Link";

function archivePagePath(
  basePath: string,
  page: number,
  includePageOneQuery: boolean,
): string {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  if (page <= 1 && !includePageOneQuery) return base;
  return `${base}?page=${Math.max(1, page)}`;
}

function paginationRange(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "gap")[] = [];
  const want = new Set<number>([1, total, current, current - 1, current + 1]);
  const nums = [...want].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  let prev = 0;
  for (const n of nums) {
    if (prev && n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  }
  return out;
}

type Props = {
  /** Listing base path, e.g. `/ideaxchange/home/` or `/ideaxchange/magazine/category/company-news/`. */
  basePath: string;
  currentPage: number;
  totalPages: number;
  ariaLabel?: string;
  /**
   * When true, page 1 links include `?page=1` (needed for home archive so it does not
   * collide with the magazine feed at the bare base path).
   */
  includePageOneQuery?: boolean;
};

const btnClass =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border border-[var(--color-border)] px-3 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]";

const navBtnClass =
  "inline-flex min-h-10 items-center justify-center rounded-sm border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-fg)]";

export function IdeaXchangePagination({
  basePath,
  currentPage,
  totalPages,
  ariaLabel = "Article pages",
  includePageOneQuery = false,
}: Props) {
  if (totalPages <= 1) return null;

  const items = paginationRange(currentPage, totalPages);

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 border-t border-[var(--color-border)] pt-10"
      aria-label={ariaLabel}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={archivePagePath(basePath, currentPage - 1, includePageOneQuery)}
            variant="button"
            className={navBtnClass}
          >
            Previous
          </Link>
        ) : (
          <span className={navBtnClass} aria-disabled="true">
            Previous
          </span>
        )}

        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          {items.map((item, i) =>
            item === "gap" ? (
              <li key={`gap-${i}`} className="px-1 text-sm text-[var(--color-muted)]" aria-hidden>
                …
              </li>
            ) : (
              <li key={item}>
                {item === currentPage ? (
                  <span
                    className={`${btnClass} border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]`}
                    aria-current="page"
                  >
                    {item}
                  </span>
                ) : (
                  <Link
                    href={archivePagePath(basePath, item, includePageOneQuery)}
                    variant="button"
                    className={btnClass}
                  >
                    {item}
                  </Link>
                )}
              </li>
            ),
          )}
        </ul>

        {currentPage < totalPages ? (
          <Link
            href={archivePagePath(basePath, currentPage + 1, includePageOneQuery)}
            variant="button"
            className={navBtnClass}
          >
            Next
          </Link>
        ) : (
          <span className={navBtnClass} aria-disabled="true">
            Next
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
}
