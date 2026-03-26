import type { Metadata } from "next";
import { FaqNewsroomSection } from "@/app/components/faq/FaqNewsroomSection";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Frequently Asked Questions | AmeriLife",
  "Find answers to common questions about partnering with AmeriLife, becoming an agent, and our insurance and financial solutions.",
  "/faq/"
);

export default function FaqPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h1 className="mb-12 text-center text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <FaqNewsroomSection />
      </div>
    </section>
  );
}
