import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";

export const metadata: Metadata = {
  title: "Our Solutions | AmeriLife",
  description:
    "Our solutions represent AmeriLife's ongoing commitment to deliver opportunities for our stakeholders to make a difference and carve their own path.",
};

const ABOUT_US_LINKS = [
  { label: "Who We Are", href: "/about-us/who-we-are/" },
  { label: "Our Leaders", href: "/about-us/our-leaders/" },
  { label: "Our Distribution", href: "/about-us/our-distribution/" },
  { label: "AmeriLife Gives Back Foundation", href: "/givesback/" },
] as const;

const OUR_SOLUTIONS_LINKS = [
  { label: "For Affiliates", href: "/our-solutions/affiliates/" },
  { label: "For Agents & Advisors", href: "/our-solutions/agents-and-advisors/" },
  { label: "For Carrier Partners", href: "/our-solutions/carriers/" },
  { label: "For Consumers", href: "/our-solutions/consumers/" },
  { label: "For Our Employees", href: "/our-solutions/employees/" },
  { label: "For Future Partners", href: "/acquisition-partner-program/", sublabel: "Acquisition Partner Program" },
] as const;

export default function OurSolutionsPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24">
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Our Solutions
            </li>
          </ol>
        </nav>
        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Our Solutions
        </h1>
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          Our solutions represent AmeriLife&apos;s ongoing commitment to deliver
          opportunities for our stakeholders to make a difference and carve
          their own path.
        </p>

        {/* Two-column link sections - match amerilife.com layout */}
        <div className="grid gap-12 sm:grid-cols-2 lg:gap-16">
          <section aria-labelledby="about-us-heading">
            <h2 id="about-us-heading" className="mb-6 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
              About Us
            </h2>
            <ul className="space-y-3">
              {ABOUT_US_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="solutions-heading">
            <h2 id="solutions-heading" className="mb-6 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
              Our Solutions
            </h2>
            <ul className="space-y-3">
              {OUR_SOLUTIONS_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:underline"
                  >
                    {item.label}
                    {item.sublabel != null && (
                      <span className="block text-sm text-[var(--color-muted)] mt-0.5">
                        {item.sublabel}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
