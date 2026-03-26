import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { ConnectForm } from "@/app/components/connect/ConnectForm";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Connect With Us | AmeriLife",
  "Connect with a licensed insurance representative. Fill out the form to get more information about AmeriLife products and solutions.",
  "/connect/"
);

export default function ConnectPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Connect With Us
            </li>
          </ol>
        </nav>

        {/* Titles */}
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Connect With Us
        </h1>
        <h2 className="mb-8 text-2xl font-semibold text-[var(--color-fg)]">
          We Appreciate Your Interest
        </h2>

        {/* Intro */}
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          Connect with a licensed insurance representative. Please fill out the form below and
          choose a topic you would like more information about.
        </p>

        {/* Form */}
        <ConnectForm />

        {/* Secondary section - Connect with an Agent */}
        <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--color-fg)]">
            Connect with an Agent
          </h2>
          <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
            Ready to explore your options and get on the path to a healthier and more financially
            secure future? Contact us today and a licensed agent will be in touch to help you get
            started.
          </p>
          <Link
            href="/contact/"
            variant="button"
            className="inline-block rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
