import type { Metadata } from "next";
import { Link as UiLink } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

/** Gravity Forms form ID for the Existing Agents contact page. */
const EXISTING_LEAD_FORM_ID = 11;

export const metadata: Metadata = {
  ...staticPageMetadata(
    "Existing Agents Contact Us | AmeriLife",
    "Licensed agents: Contact AmeriLife to learn about partnering opportunities and contracting with an AmeriLife affiliated insurance marketing organization.",
    "/existinglead/"
  ),
  robots: { index: false, follow: false },
};

export default async function ExistingLeadPage() {
  let existingLeadForm = null;
  try {
    existingLeadForm = await fetchGravityForm(EXISTING_LEAD_FORM_ID);
  } catch {
    existingLeadForm = null;
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[720px] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Existing Agents Contact Us" },
          ]}
        />

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Existing Agents Contact Us
        </h1>
        <h2 className="mb-8 text-2xl font-semibold text-[var(--color-fg)]">
          Licensed Agents
        </h2>

        <div className="mb-10">
          <p className="mb-4 text-base leading-relaxed text-[var(--color-fg)]">
            Thank you for your interest in AmeriLife.
          </p>
          <p className="text-base leading-relaxed text-[var(--color-fg)]">
            Let&apos;s talk about the possibilities, get started by filling out the form below.
          </p>
        </div>

        <div className="rounded-lg bg-[#f7f8f9] p-6 sm:p-8">
          {existingLeadForm ? (
            <GravityForm form={existingLeadForm} />
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              The contact form is temporarily unavailable. Please try again later or{" "}
              <UiLink href="/contact/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
                contact us
              </UiLink>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
