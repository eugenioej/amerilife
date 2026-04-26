import type { Metadata } from "next";
import { ThankYouPageContent } from "@/app/components/thank-you/ThankYouPageContent";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "Thank You | AmeriLife",
    "Thank you for contacting AmeriLife. We have received your inquiry and will respond as quickly as possible.",
    "/about/affiliates/thank-you/"
  ),
  robots: { index: false, follow: false },
};

export default function AffiliatesThankYouPage() {
  return (
    <ThankYouPageContent
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "About AmeriLife", href: "/about/" },
        { label: "Our Affiliates", href: "/our-solutions/affiliates/" },
        { label: "Thank You" },
      ]}
      title="Thank You"
      subtitle="We appreciate your interest!"
      image={{
        src: WP_IMAGE_SOURCES.thankYouHero,
        alt: "AmeriLife team members",
        priority: true,
      }}
      messageTitle="Thank you for contacting AmeriLife."
      message={
        <p>
          We have received your inquiry and will respond as quickly as possible. Please feel free to
          check out the{" "}
          <Link
            href="/newsroom/"
            className="text-[var(--color-link)] underline transition-colors hover:text-[var(--color-link-hover)]"
          >
            latest things happening at amerilife
          </Link>
          .
        </p>
      }
    />
  );
}
