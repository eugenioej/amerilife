import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { BrokerContactForm } from "@/app/components/broker-contact-page/BrokerContactForm";

export const metadata: Metadata = {
  title: "Independent Partner Contact Us | AmeriLife",
  description:
    "Contact AmeriLife about brokerage partnerships. Discuss carrier solutions, asset management, leads, training, and more. For broker use only.",
};

export default function BrokerContactPage() {
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
              Independent Partner Contact Us
            </li>
          </ol>
        </nav>

        {/* Titles */}
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Independent Partner Contact Us
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-[var(--color-fg)]">
          We Appreciate Your Interest
        </h2>
        <h3 className="mb-2 text-lg font-medium text-[var(--color-fg)]">
          Let's start a conversation about growing your business and making people's lives better
        </h3>
        <p className="mb-12 text-base font-medium text-[var(--color-fg)]">
          Together we can do great things
        </p>

        {/* Form */}
        <BrokerContactForm />

        {/* Footer note */}
        <p className="mx-auto mt-12 max-w-2xl text-sm text-[var(--color-muted)]">
          This does not constitute an offer to purchase. For broker use only; not for use with
          consumers.
        </p>
      </div>
    </section>
  );
}
