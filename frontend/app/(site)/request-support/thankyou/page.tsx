import type { Metadata } from "next";
import { RequestSupportThankYouContent } from "@/app/components/request-support/RequestSupportThankYouContent"
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "AmeriLife Request Support Thank You Page",
    "AmeriLife Request Support Thank You Page",
    "/thankyou/"
  ),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <RequestSupportThankYouContent
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Thank You" }]}
      title="Thank You"
      image={{
        src: WP_IMAGE_SOURCES.thankYouHero,
        alt: "Thank You",
        priority: true,
      }}
      messageTitle="Thank you for contacting AmeriLife Marketing Support"
      message={
        <>
          <p className="mb-4">
            A member of our team will contact you soon. If you need immediate assistance please contact your Marketing professional directly.
          </p>
          <p>
            Please feel free to check out the{" "}
            <Link
              href="/about/news/"
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
