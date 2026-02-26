import { Link } from "@/app/components/ui/Link";

const SUGGESTED_LINKS = {
  "About Us": [
    { label: "Who We Are", href: "/about-us/who-we-are/" },
    { label: "Our Leaders", href: "/about-us/our-leaders/" },
    { label: "Our Distribution", href: "/about-us/our-distribution/" },
    { label: "AmeriLife Gives Back Foundation", href: "/givesback/" },
  ],
  "Our Solutions": [
    { label: "For Affiliates", href: "/our-solutions/affiliates/" },
    { label: "For Agents & Advisors", href: "/our-solutions/agents-and-advisors/" },
    { label: "For Carrier Partners", href: "/our-solutions/carriers/" },
    { label: "For Consumers", href: "/our-solutions/consumers/" },
    { label: "For Our Employees", href: "/our-solutions/employees/" },
    {
      label: "For Future Partners",
      sublabel: "Acquisition Partner Program",
      href: "/acquisition-partner-program/",
    },
  ],
  "Additional Resources": [
    { label: "Newsroom", href: "/newsroom/" },
    { label: "Join Our Team", href: "/join-our-team/" },
    { label: "Search", href: "/search/" },
  ],
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 lg:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-brand-dark)] sm:text-5xl">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-[var(--color-fg)]">
          Content Unavailable
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
          The page you're looking for is no longer available. But you're still in the
          right place—AmeriLife connects people, partners, and communities with the
          insurance and retirement solutions that matter most.
        </p>
        <p className="mt-6 text-base text-[var(--color-fg)]">
          Please use the links below to continue exploring our most visited pages.
        </p>
      </div>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(SUGGESTED_LINKS).map(([heading, items]) => (
          <section key={heading}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
              {heading}
            </h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.href + (item.label || "")}>
                  <Link
                    href={item.href}
                    variant="default"
                    className="inline-flex flex-col text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
                  >
                    {item.label}
                    {"sublabel" in item && item.sublabel && (
                      <span className="text-sm text-[var(--color-muted)]">
                        {item.sublabel}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/"
          variant="button"
          className="inline-flex items-center rounded-md bg-[var(--color-brand-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
