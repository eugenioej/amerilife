import type { Metadata } from "next";
import Link from "next/link";
import { ExistingLeadForm } from "@/app/components/existinglead/ExistingLeadForm";

export const metadata: Metadata = {
  title: "Existing Agents Contact Us | AmeriLife",
  description:
    "Licensed agents: Contact AmeriLife to learn about partnering opportunities and contracting with an AmeriLife affiliated insurance marketing organization.",
};

export default function ExistingLeadPage() {
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
            <li className="text-[var(--color-fg)]" aria-current="page">
              Existing Agents Contact Us
            </li>
          </ol>
        </nav>

        {/* Titles */}
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Existing Agents Contact Us
        </h1>
        <h2 className="mb-8 text-2xl font-semibold text-[var(--color-fg)]">
          Licensed Agents
        </h2>

        {/* Intro */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-base leading-relaxed text-[var(--color-fg)]">
            Thank you for your interest in AmeriLife.
          </p>
          <p className="text-base leading-relaxed text-[var(--color-fg)]">
            Let&apos;s talk about the possibilities, get started by filling out the form below.
          </p>
        </div>

        {/* Form */}
        <ExistingLeadForm />
      </div>
    </section>
  );
}
