import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import NationalRecruitingHeader from "@/app/components/national-recruiting/NationalRecruitingHeader";
import { NationalRecruitingThankYouContent } from "@/app/components/national-recruiting/NationalRecruitingThankYouContent";
import NationalRecruitingFooter from "@/app/components/national-recruiting/NationalRecruitingFooter";


export const metadata: Metadata = {
  ...staticPageMetadata(
    "National Recruiting Thank You Page",
    "National Recruiting Thank You Page",
    "/thankyou/"
  ),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="request-support-page min-h-screen bg-white">
      <NationalRecruitingHeader />
      <NationalRecruitingThankYouContent
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
      <NationalRecruitingFooter />
    </div>
  );
}
