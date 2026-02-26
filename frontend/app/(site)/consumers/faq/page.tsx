import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { FaqNewsroomSection } from "@/app/components/faq/FaqNewsroomSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions for Consumers | AmeriLife",
  description:
    "Find answers to common questions about insurance for individuals and families. AmeriLife offers life, health, Medicare and financial solutions.",
};

export default function ConsumersFaqPage() {
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
            <li>
              <Link
                href="/our-solutions/consumers/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Insurance for Individuals and Families
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Frequently Asked Questions
            </li>
          </ol>
        </nav>

        <h1 className="mb-12 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <FaqNewsroomSection />
      </div>
    </section>
  );
}
