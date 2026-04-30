"use client";

import { FaqAccordion } from "../faq/FaqAccordion";

export function FaqSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-12 text-center text-3xl font-medium text-[var(--color-fg)] sm:text-4xl xl:text-5xl">
          Questions? We&apos;ve Got Answers.
        </h2>
        <FaqAccordion defaultOpenIndex={0} />
      </div>
    </section>
  );
}
