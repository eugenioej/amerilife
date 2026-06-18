import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { ContributorBecomeOne } from "@/app/components/contributors/ContributorBecomeOne";
import { ContributorTeam } from "@/app/components/contributors/ContributorTeam";
import { ContributorDisclaimer } from "@/app/components/contributors/ContributorDisclaimer";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

// ✅ ADD THESE
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_CONTRIBUTORS, type Contributor } from "@/lib/queries";

export const metadata: Metadata = staticPageMetadata(
  "Contributors | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our contributors and how you can become one.",
  "/contributors/"
);

export type GetContributorsResult = {
  contributors: Contributor[];
};

export default async function ContributorPage() {

  // ✅ ADD THIS (fetch + filter)
  const data = await fetchGraphQL<GetContributorsResult>(
  GET_CONTRIBUTORS
);
console.log("CONTRIBUTORS DATA:", data);

  const contributors: Contributor[] = data?.contributors ?? [];

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contributors", path: "/contributors/" },
        ])}
      />

      <FadeInOnView direction="up" className="w-full">
        {/* ✅ PASS CONTRIBUTORS (this was missing) */}
        <ContributorTeam contributors={contributors} />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorBecomeOne />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorDisclaimer />
      </FadeInOnView>
      
    </article>
  );
}