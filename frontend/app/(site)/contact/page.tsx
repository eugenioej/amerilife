import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { CONTACT_US_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Contact Us | AmeriLife",
  "Contact AmeriLife. Choose a topic to connect with an AmeriLife representative.",
  "/contact/"
);

export default async function ContactPage() {
  let contactForm = null;
  try {
    contactForm = await fetchGravityForm(CONTACT_US_FORM_ID);
  } catch {
    contactForm = null;
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
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
            <li className="text-[var(--color-fg)]" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">Contact Us</h1>
        <hr className="mb-10 border-[var(--color-brand-primary)]" />

        <p className="mb-10 max-w-3xl text-base leading-relaxed text-[var(--color-fg)]">
          Thank you for your interest in AmeriLife. Please indicate the topic you would like more
          information about or would like to discuss with an AmeriLife representative.
        </p>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1 rounded-lg bg-[#f7f8f9] p-6 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)]">
              Connect with an AmeriLife representative
            </h2>
            {contactForm ? (
              <GravityForm form={contactForm} />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                The contact form is temporarily unavailable. Please call{" "}
                <a
                  href="tel:+18004587112"
                  className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                >
                  (800) 458-7112
                </a>{" "}
                or try again later.
              </p>
            )}
          </div>

          <div className="shrink-0 space-y-2 text-base text-[var(--color-fg)] sm:w-[280px]">
            <p className="font-semibold">AmeriLife</p>
            <p>2650 McCormick Drive</p>
            <p>Clearwater, FL 33759</p>
            <p>
              <span className="font-semibold">Toll Free:</span>{" "}
              <a
                className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                href="tel:+18004587112"
              >
                (800) 458-7112
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

