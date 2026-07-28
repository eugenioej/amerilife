import type { Metadata } from "next";
import { ThankYouPageContent } from "@/app/components/thank-you/ThankYouPageContent";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "AmeriLife Contact Us Thank You Page",
    "AmeriLife Contact Us Thank You Page",
    "/thankyou/"
  ),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <ThankYouPageContent
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Thank You" }]}
      title="Thank You"
      subtitle="We appreciate your interest!"
      image={{
        src: WP_IMAGE_SOURCES.thankYouHero,
        alt: "Thank You",
        priority: true,
      }}
      messageTitle="Thank you for contacting AmeriLife"
      message={
        <>
          <p className="mb-4">
            We have received your inquiry and will respond shortly.
          </p>
          <p>
            Please feel free to check out the{" "}
            <Link
              href="/newsroom"
              variant="button"
              className="font-medium text-[#003768] underline transition-colors hover:text-[var(--color-breadcrumb-link-hover)]"
            >
              latest things happening at AmeriLife.
            </Link>
          </p>
        </>
      }
    />
  );
}
