import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife Offices | AmeriLife",
  "Explore career opportunities with AmeriLife. Join our team as an employee or become a career agent.",
  "/career/"
);

export default function CareerPage() {
  return (
    <article className="bg-white">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16">
        <nav className="mb-6 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              AmeriLife Offices
            </li>
          </ol>
        </nav>
        <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          AmeriLife Offices
        </h1>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-[#f7f8f9] p-6">
            <h2 className="mb-3 text-xl font-bold text-[var(--color-brand-primary)]">
              Career Agents
            </h2>
            <p className="mb-4 text-base leading-relaxed text-[var(--color-fg)]">
              Your career starts here. Become an AmeriLife agent and help people live longer,
              healthier lives with industry-leading products and support.
            </p>
            <Link
              href="/career/agents/"
              variant="button"
              className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
            >
              View Career Agents
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[#f7f8f9] p-6">
            <h2 className="mb-3 text-xl font-bold text-[var(--color-brand-primary)]">
              Join Our Team
            </h2>
            <p className="mb-4 text-base leading-relaxed text-[var(--color-fg)]">
              Explore career opportunities for employees and sales agents at AmeriLife.
            </p>
            <Link
              href="/join-our-team/"
              variant="button"
              className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white no-underline"
            >
              Join Our Team
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
