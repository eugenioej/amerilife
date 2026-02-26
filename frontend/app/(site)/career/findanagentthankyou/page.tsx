import type { Metadata } from "next";
import { ThankYouPageContent } from "@/app/components/thank-you/ThankYouPageContent";
import { rewriteUploadsUrl } from "@/lib/wp-media";

// Image on WP: /wp-content/uploads/2017/10/Thank-You-IMG.jpg
const THANK_YOU_IMAGE_URL = rewriteUploadsUrl(
  "https://amerilife.com/wp-content/uploads/2017/10/Thank-You-IMG.jpg"
);

export const metadata: Metadata = {
  title: "Thank You – Find an Agent | AmeriLife",
  description:
    "Thank you for your interest in finding an agent. A company representative will be in touch shortly.",
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
        src: THANK_YOU_IMAGE_URL,
        alt: "AmeriLife team members",
        priority: true,
      }}
      messageTitle="We appreciate your interest"
      message={
        <p>A company representative will be in touch.</p>
      }
      ctas={[
        { label: "Back to Career Agents", href: "/career/agents/", variant: "primary" },
        { label: "Back to Home", href: "/", variant: "secondary" },
      ]}
    />
  );
}
