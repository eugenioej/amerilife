import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";

export const metadata: Metadata = {
  title: "Employers | AmeriLife",
  description:
    "AmeriLife worksite benefits for employers and organizations. Connect with an AmeriLife Benefits representative.",
};

export default function WorksitePage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Employers & Organizations
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          AmeriLife offers worksite benefits solutions for employers and organizations. Learn more
          about how we can help your group.
        </p>
        <Link
          href="/worksite/lead/"
          variant="button"
          className="inline-flex items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
