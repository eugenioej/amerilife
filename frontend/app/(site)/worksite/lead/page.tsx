import type { Metadata } from "next";
import { Link as UiLink } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { WORKSITE_LEAD_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "Employers & Organizations Contact Us | AmeriLife",
    "Contact AmeriLife to learn about worksite benefits for employers and organizations. Connect with an AmeriLife Benefits representative.",
    "/worksite/lead/"
  ),
  robots: { index: false, follow: false },
};

export default async function WorksiteLeadPage() {
  let worksiteLeadForm = null;
  try {
    worksiteLeadForm = await fetchGravityForm(WORKSITE_LEAD_FORM_ID);
  } catch {
    worksiteLeadForm = null;
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[720px] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Employers", href: "/worksite/" },
            { label: "Employers & Organizations Contact Us" },
          ]}
        />

        <h1 className="mb-6 text-3xl font-bold leading-tight text-[var(--color-fg)] sm:text-4xl">
          Employers & Organizations
          <br />
          Contact Us
        </h1>
        <h2 className="mb-4 text-3xl font-semibold leading-snug text-[var(--color-fg)]">
          We Appreciate Your Interest in AmeriLife Benefits.
        </h2>
        <div
          className="mb-8 h-[3px] w-[125px] max-w-full shrink-0 bg-[#94c83d]"
          aria-hidden
        />

        <p className="mb-10 text-base leading-relaxed text-[var(--color-fg)]">
          Let&apos;s talk about the possibilities, get started by filling out the form below.
        </p>

        <div className="rounded-lg bg-[#f7f8f9] p-6 sm:p-8">
          {worksiteLeadForm ? (
            <GravityForm form={worksiteLeadForm} />
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
