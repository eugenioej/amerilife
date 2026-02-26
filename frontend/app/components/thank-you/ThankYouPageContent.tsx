import Image from "next/image";
import { Link } from "@/app/components/ui/Link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Cta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type Props = {
  breadcrumb?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  image: { src: string; alt: string; priority?: boolean };
  messageTitle: string;
  message: React.ReactNode;
  ctas?: Cta[];
};

function ctaClassName(variant: Cta["variant"]) {
  if (variant === "secondary") {
    return "inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white";
  }
  return "inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]";
}

export function ThankYouPageContent({
  breadcrumb,
  title,
  subtitle,
  image,
  messageTitle,
  message,
  ctas,
}: Props) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {breadcrumb?.length ? (
          <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {breadcrumb.map((item, idx) => {
                const isLast = idx === breadcrumb.length - 1;
                return (
                  <li key={`${item.href ?? "current"}:${item.label}:${idx}`} className="flex items-center gap-x-2">
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-[var(--color-fg)]" : undefined} aria-current={isLast ? "page" : undefined}>
                        {item.label}
                      </span>
                    )}
                    {!isLast && <span aria-hidden="true">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <h2 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
            {subtitle}
          </h2>
        ) : null}

        <div className="mb-8 h-1 w-24" style={{ background: "var(--color-brand-primary)" }} />

        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-auto md:min-h-[280px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={image.priority}
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[var(--color-fg)]">
              {messageTitle}
            </h3>
            <div className="text-base leading-relaxed text-[var(--color-fg)]">
              {message}
            </div>

            {ctas?.length ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {ctas.map((cta) => (
                  <Link
                    key={cta.href + cta.label}
                    href={cta.href}
                    variant="button"
                    className={ctaClassName(cta.variant)}
                  >
                    {cta.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

