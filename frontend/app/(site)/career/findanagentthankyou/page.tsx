import type { Metadata } from "next";
import { ThankYouPageContent } from "@/app/components/thank-you/ThankYouPageContent";
import { staticPageMetadata } from "@/lib/seo";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "Thank You – Find an Agent | AmeriLife",
    "Thank you for your interest in finding an agent. A company representative will be in touch shortly.",
    "/career/findanagentthankyou/"
  ),
  robots: { index: false, follow: false },
};

export default function FindAnAgentThankYouPage() {
  return (
    <ThankYouPageContent
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "AmeriLife Offices", href: "/career/" },
        { label: "Thank You – Find an Agent" },
      ]}
      title="Thank You – Find an Agent"
      subtitle="Thank you!"
      image={{
        src: WP_IMAGE_SOURCES.thankYouHero,
        alt: "AmeriLife team members",
        priority: true,
      }}
      messageTitle="We appreciate your interest"
      message={
        <p>A company representative will be in touch.</p>
      }
    />
  );
}
