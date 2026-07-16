import { Link } from "@/app/components/ui/Link";
import { IDEAXCHANGE_CATEGORY_PATH } from "@/lib/ideaxchange-constants";

function categoryPagePath(topicSlug: string, page: number): string {
  if (page <= 1) return `${IDEAXCHANGE_CATEGORY_PATH}${topicSlug}/`;
  return `${IDEAXCHANGE_CATEGORY_PATH}${topicSlug}/?page=${page}`;
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
  topicSlug: string;
  currentPage: number;
  totalPages: number;
};

const btnClass =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border border-[var(--color-border)] px-3 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]";

const navBtnClass =
  "inline-flex min-h-10 items-center justify-center rounded-sm border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-fg)]";

export function IdeaXchangeCategoryPagination({ topicSlug, currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const items = paginationRange(currentPage, totalPages);

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 border-t border-[var(--color-border)] pt-10"
      aria-label="Category pages"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link href={categoryPagePath(topicSlug, currentPage - 1)} variant="button" className={navBtnClass}>
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
                  <Link href={categoryPagePath(topicSlug, item)} variant="button" className={btnClass}>
                    {item}
                  </Link>
                )}
              </li>
            ),
          )}
        </ul>

        {currentPage < totalPages ? (
          <Link href={categoryPagePath(topicSlug, currentPage + 1)} variant="button" className={navBtnClass}>
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
