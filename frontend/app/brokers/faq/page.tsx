import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { BrokersFaqAccordion } from "@/app/components/brokers-faq/BrokersFaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions About AmeriLife | AmeriLife",
  description:
    "Find answers to common questions about independent insurance agents, what AmeriLife can do for your business, and our distribution network.",
};

export default function BrokersFaqPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/broker-contact-page/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Brokers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Frequently Asked Questions
            </li>
          </ol>
        </nav>

        {/* Title */}
        <h1 className="mb-12 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Frequently Asked Questions
        </h1>

        {/* Accent line */}
        <div
          className="mb-12 h-1 w-24"
          style={{ background: "var(--color-brand-primary)" }}
        />

        {/* FAQ Accordion */}
        <BrokersFaqAccordion />
      </div>
    </section>
  );
}
