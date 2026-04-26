import { Link } from "@/app/components/ui/Link";

export type SiteBreadcrumbItem = {
  label: string;
  href?: string;
  /** Extra classes on the link or label span (e.g. truncate). */
  className?: string;
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
      className={`text-sm ${inverse ? "text-white/70" : ""} ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const linkClass = inverse
            ? "font-semibold text-white/80 no-underline transition-colors hover:text-white hover:underline"
            : "font-semibold text-[var(--color-breadcrumb-link)] underline decoration-1 underline-offset-2 transition-colors hover:text-[var(--color-breadcrumb-link-hover)]";

          return (
            <li
              key={`${item.href ?? "current"}:${item.label}:${idx}`}
              className="flex items-center"
            >
              {idx > 0 ? (
                <span
                  aria-hidden
                  className={`mx-[3px] select-none text-[10px] font-normal leading-none ${
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
                  className={`${linkClass} ${item.className ?? ""}`.trim()}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
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
