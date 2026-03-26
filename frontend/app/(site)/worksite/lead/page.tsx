import type { Metadata } from "next";
import Link from "next/link";
import { WorksiteLeadForm } from "@/app/components/worksite/WorksiteLeadForm";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "Employers & Organizations Contact Us | AmeriLife",
    "Contact AmeriLife to learn about worksite benefits for employers and organizations. Connect with an AmeriLife Benefits representative.",
    "/worksite/lead/"
  ),
  robots: { index: false, follow: false },
};

export default function WorksiteLeadPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:no-underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/worksite/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:no-underline"
              >
                Employers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Employers & Organizations Contact Us
            </li>
          </ol>
        </nav>

        {/* Titles */}
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Employers & Organizations Contact Us
        </h1>
        <h2 className="mb-8 text-2xl font-semibold text-[var(--color-fg)]">
          We Appreciate Your Interest in AmeriLife Benefits.
        </h2>

        {/* Intro */}
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          Let&apos;s talk about the possibilities, get started by filling out the form below.
        </p>

        {/* Form */}
        <WorksiteLeadForm />
      </div>
    </section>
  );
}
