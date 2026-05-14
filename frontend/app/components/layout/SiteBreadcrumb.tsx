import { Link } from "@/app/components/ui/Link";

export type SiteBreadcrumbItem = {
  label: string;
  href?: string;
  /** Extra classes on the link or label span (e.g. truncate). */
  className?: string;
  /**
   * Last crumb only: use wrapping instead of single-line ellipsis
   * (e.g. very long newsroom article titles on narrow viewports).
   */
  wrapMultiLine?: boolean;
};

type Props = {
  items: SiteBreadcrumbItem[];
  className?: string;
  /** For dark hero bands (e.g. find-an-agent); uses light text instead of navy/teal. */
  variant?: "default" | "inverse";
};

export function SiteBreadcrumb({
  items,
  className = "",
  variant = "default",
}: Props) {
  if (!items.length) return null;

  const inverse = variant === "inverse";

  return (
    <nav
      className={[
        "w-full min-w-0 max-w-full text-sm",
        inverse ? "text-white/70" : null,
        className || null,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const linkClass = inverse
            ? "font-semibold text-white/80 no-underline transition-colors hover:text-white hover:underline"
            : "font-semibold text-[var(--color-breadcrumb-link)] underline decoration-1 underline-offset-2 transition-colors hover:text-[var(--color-breadcrumb-link-hover)]";

          /** Last crumb: full-width row below `sm` so long titles / ellipsis behave on narrow viewports. */
          const liRow = isLast
            ? "w-full min-w-0 shrink-0 sm:w-auto sm:max-w-full"
            : "min-w-0 max-w-full";

          const currentBox = isLast
            ? item.wrapMultiLine
              ? "min-w-0 flex-1 whitespace-normal break-words sm:inline-block sm:flex-none sm:min-w-0 sm:max-w-full"
              : "min-w-0 flex-1 truncate sm:inline-block sm:flex-none sm:min-w-0 sm:max-w-full"
            : "inline-block min-w-0 max-w-full";

          return (
            <li key={`${item.href ?? "current"}:${item.label}:${idx}`} className={`flex items-center ${liRow}`.trim()}>
              {idx > 0 ? (
                <span
                  aria-hidden
                  className={`mx-[3px] shrink-0 select-none text-[10px] font-normal leading-none ${
                    inverse ? "text-white/50" : "text-[var(--color-breadcrumb-separator)]"
                  }`}
                >
                  &gt;
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  variant="button"
                  className={`inline-block min-w-0 max-w-full ${linkClass} ${item.className ?? ""}`.trim()}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${currentBox} ${
                    isLast
                      ? inverse
                        ? "font-normal text-white/60"
                        : "font-normal text-[var(--color-breadcrumb-current)]"
                      : inverse
                        ? "font-semibold text-white/80"
                        : "font-semibold text-[var(--color-breadcrumb-current)]"
                  } ${item.className ?? ""}`.trim()}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
