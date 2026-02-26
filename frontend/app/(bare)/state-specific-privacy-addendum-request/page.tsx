import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyAddendumRequestForm } from "@/app/components/legal/PrivacyAddendumRequestForm";

export const metadata: Metadata = {
  title: "State Specific Privacy Addendum Request | AmeriLife",
  description:
    "Submit a request regarding your personal information under the California and Virginia privacy laws.",
};

export default function StateSpecificPrivacyAddendumRequestPage() {
  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16 text-[var(--color-fg)]">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)]">AmeriLife</h1>
      <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)]">
        State Specific Privacy Addendum Request
      </h2>

      <p className="mb-10 text-base leading-relaxed text-[var(--color-fg)]">
        <strong>Welcome!</strong> Please complete this form to submit a request and we will respond as
        soon as possible.
      </p>

      <PrivacyAddendumRequestForm />

      <div className="mt-16 border-t border-[var(--color-border)] pt-10">
        <p className="text-base">AmeriLife, ©2023</p>
        <p className="mt-2 text-sm">Not affiliated with the U. S. government or federal Medicare program.</p>
        <p className="mt-4 text-base">
          We do not offer every plan available in your area. Any information we provide is limited to
          those plans we do offer in your area. Please contact{" "}
          <a
            href="https://www.medicare.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
          >
            Medicare.gov
          </a>{" "}
          or{" "}
          <a
            href="tel:1-800-633-4227"
            className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
          >
            1-800-MEDICARE
          </a>{" "}
          to get information on all of your options.
        </p>
        <p className="mt-4">
          <Link href="/terms/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
            Terms of Use
          </Link>{" "}
          |{" "}
          <Link href="/privacy/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
            Privacy Statement
          </Link>
        </p>
      </div>
    </article>
  );
}
