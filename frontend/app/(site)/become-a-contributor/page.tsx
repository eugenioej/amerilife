import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import ContributorForm from "@/app/components/contributors/ContributorForm";
import { ContributorFeaturedTeam } from "@/app/components/contributors/ContributorFeaturedTeam";
import { ContributorDisclaimer } from "@/app/components/contributors/ContributorDisclaimer";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

import { fetchGraphQL } from "@/lib/wp-client";
import { GET_CONTRIBUTORS, type Contributor } from "@/lib/queries";

export const metadata: Metadata = staticPageMetadata(
  "Become A Contributor | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our contributors and how you can become one.",
  "/contributors/"
);

export default async function BecomeAContributorPage() {

  // ✅ ADD THIS
  const data = await fetchGraphQL<{ contributors: Contributor[] }>(
    GET_CONTRIBUTORS
  );

  const contributors = data?.contributors ?? [];

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
        {/* ✅ PASS DATA */}
        <ContributorFeaturedTeam contributors={contributors} />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorDisclaimer />
      </FadeInOnView>
      
    </article>
  );
}