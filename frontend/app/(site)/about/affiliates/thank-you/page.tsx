import type { Metadata } from "next";
import { ThankYouPageContent } from "@/app/components/thank-you/ThankYouPageContent";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";

// Image on headless: /wp-content/uploads/2017/10/Thank-You-IMG.jpg
const THANK_YOU_IMAGE_URL = rewriteUploadsUrl(
  "https://amerilife.com/wp-content/uploads/2017/10/Thank-You-IMG.jpg"
);

export const metadata: Metadata = {
  title: "Thank You | AmeriLife",
  description:
    "Thank you for contacting AmeriLife. We have received your inquiry and will respond as quickly as possible.",
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
        src: THANK_YOU_IMAGE_URL,
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
      ctas={[
        { label: "Back to Home", href: "/", variant: "primary" },
        { label: "Visit Newsroom", href: "/newsroom/", variant: "secondary" },
      ]}
    />
  );
}
