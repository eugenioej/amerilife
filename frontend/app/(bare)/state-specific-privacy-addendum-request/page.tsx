import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Link as UiLink } from "@/app/components/ui/Link";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { PRIVACY_ADDENDUM_REQUEST_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = {
  title: "State Specific Privacy Addendum Request | AmeriLife",
  description:
    "Submit a request regarding your personal information under the California and Virginia privacy laws.",
};

const HEADER_LOGO_SRC = rewriteUploadsUrl(
  "https://amerilife.com/wp-content/uploads/2022/01/amerilife.svg",
);

const FOOTER_BG = "rgb(0, 55, 103)";

const footerLinkClass =
  "font-medium text-white underline decoration-1 underline-offset-2 transition-colors hover:text-white/85";

export default async function StateSpecificPrivacyAddendumRequestPage() {
  let privacyForm = null;
  try {
    privacyForm = await fetchGravityForm(PRIVACY_ADDENDUM_REQUEST_FORM_ID);
  } catch {
    privacyForm = null;
  }

  const copyrightYear = new Date().getFullYear();

  return (
    <>
    <article className="mx-auto w-full max-w-[720px] px-[var(--container-padding-x)] py-12 lg:py-16 text-[var(--color-fg)]">
      <div className="mb-8">
        <UiLink href="/" variant="button" className="inline-block outline-offset-4" aria-label="AmeriLife Home">
          <Image
            src={HEADER_LOGO_SRC}
            alt=""
            width={140}
            height={40}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </UiLink>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
        State Specific Privacy Addendum Request
      </h1>

      <p className="mb-10 text-base leading-relaxed text-[var(--color-fg)]">
        <strong>Welcome!</strong> Please complete this form to submit a request and we will respond as
        soon as possible.
      </p>

      {privacyForm ? (
        <GravityForm form={privacyForm} />
      ) : (
        <p className="text-sm text-[var(--color-muted)]">
          The form is temporarily unavailable. Please try again later or{" "}
          <UiLink href="/contact/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
            contact us
          </UiLink>
          .
        </p>
      )}
    </article>

    <footer
      className="mt-12 w-full px-[var(--container-padding-x)] py-10 text-sm leading-relaxed text-white sm:text-base"
      style={{ backgroundColor: FOOTER_BG }}
    >
      <div className="mx-auto max-w-[720px] space-y-4">
        <p>AmeriLife, © {copyrightYear}</p>
        <p>Not affiliated with the U. S. government or federal Medicare program.</p>
        <p>
          We do not offer every plan available in your area. Any information we provide is limited to
          those plans we do offer in your area. Please contact{" "}
          <a
            href="https://www.medicare.gov"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            Medicare.gov
          </a>{" "}
          or{" "}
          <a href="tel:1-800-633-4227" className={footerLinkClass}>
            1-800-MEDICARE
          </a>{" "}
          to get information on all of your options.
        </p>
        <p className="pt-1">
          <Link href="/terms/" className={footerLinkClass}>
            Terms of Use
          </Link>
          <span className="text-white/50" aria-hidden>
            {" "}
            |{" "}
          </span>
          <Link href="/privacy-policy/" className={footerLinkClass}>
            Privacy Statement
          </Link>
        </p>
      </div>
    </footer>
    </>
  );
}
