import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import ContributorForm from "@/app/components/contributors/ContributorForm";
import { ContributorTeam } from "@/app/components/contributors/ContributorTeam";
import { ContributorDisclaimer } from "@/app/components/contributors/ContributorDisclaimer";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Become A Contributor | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our contributors and how you can become one.",
  "/contributors/"
);

export default async function BecomeAContributorPage() {

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Become A Contributor", path: "/become-a-contributor/" },
        ])}
      />

      <FadeInOnView direction="up" className="w-full">
        <ContributorForm />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorTeam />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorDisclaimer />
      </FadeInOnView>
      
    </article>
  );
}
