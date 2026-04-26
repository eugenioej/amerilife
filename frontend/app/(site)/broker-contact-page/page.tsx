import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

/** Gravity Forms form ID for the Independent Partner (broker) contact page. */
const BROKER_CONTACT_FORM_ID = 30;

export const metadata: Metadata = staticPageMetadata(
  "Independent Partner Contact Us | AmeriLife",
  "Contact AmeriLife about brokerage partnerships. Discuss carrier solutions, asset management, leads, training, and more. For broker use only.",
  "/broker-contact-page/"
);

export default async function BrokerContactPage() {
  let brokerForm = null;
  try {
    brokerForm = await fetchGravityForm(BROKER_CONTACT_FORM_ID);
  } catch {
    brokerForm = null;
  }
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[720px] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Independent Partner Contact Us" },
          ]}
        />

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Independent Partner Contact Us
        </h1>
        <h2 className="mb-4 text-3xl font-semibold leading-snug text-[var(--color-fg)]">
          We Appreciate Your Interest
        </h2>
        <div
          className="mb-8 h-[3px] w-[125px] max-w-full shrink-0 bg-[#94c83d]"
          aria-hidden
        />
        <h3 className="mb-2 text-lg font-medium text-[var(--color-fg)]">
          Let&apos;s start a conversation about growing your business and making people&apos;s lives better
        </h3>
        <p className="mb-10 text-base font-medium text-[var(--color-fg)]">
          Together we can do great things
        </p>

        <div className="rounded-lg bg-[#f7f8f9] p-6 sm:p-8">
          {brokerForm ? (
            <GravityForm form={brokerForm} />
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              The contact form is temporarily unavailable. Please try again later or{" "}
              <Link href="/contact/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
                contact us
              </Link>
              .
            </p>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-sm text-[var(--color-muted)]">
          This does not constitute an offer to purchase. For broker use only; not for use with
          consumers.
        </p>
      </div>
    </section>
  );
}
