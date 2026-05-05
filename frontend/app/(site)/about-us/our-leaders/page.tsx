import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { LeadersBackedBySection } from "@/app/components/about-us/leaders/LeadersBackedBySection";
import { LeadersGrid } from "@/app/components/about-us/leaders/LeadersGrid";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_LEADERS, type LeadersQueryResult } from "@/lib/queries";
import { staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const LEADERS_STAR_BG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/star-2.png";

export const metadata: Metadata = staticPageMetadata(
  "Our Leaders | AmeriLife",
  "Meet AmeriLife's executive leadership team — veterans of the nation's most notable insurance companies, committed to ethics, integrity, and helping people achieve financial security.",
  "/about-us/our-leaders/"
);

export default async function OurLeadersPage() {
  let leaders: LeadersQueryResult["leaders"] = null;
  try {
    const data = await fetchGraphQL<LeadersQueryResult>(GET_LEADERS);
    leaders = data.leaders ?? null;
  } catch {
    leaders = null;
  }

  const nodes = leaders?.nodes ?? [];

  const starSrc = rewriteUploadsUrl(LEADERS_STAR_BG);

  return (
    <article>
      <div className="bg-white">
        <FadeInOnView
          direction="fade"
          threshold={0}
          className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 sm:py-12 lg:py-14"
        >
          <SiteBreadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "About Us" },
              { label: "Our Leaders" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Our Leaders
          </h1>
        </FadeInOnView>
      </div>

      <div
        className="border-t border-[#e8ede8] bg-[#F6F8F6] pt-10 pb-12 sm:pt-[65px] sm:pb-16"
        style={{
          backgroundImage: `url(${starSrc})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "100% -9%",
        }}
      >
        <FadeInOnView
          direction="fade"
          threshold={0}
          className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]"
        >
          <div className="mb-12 max-w-3xl space-y-4 text-base leading-[140%] text-[#244260] sm:mb-[75px]">
            <p>
              AmeriLife values our executive team&apos;s wealth of industry expertise as
              veterans of some of the nation&apos;s most notable insurance companies — including
              MetLife, Bankers{"\u00a0"}Life and Transamerica.
            </p>
            <p>
              Our leaders are committed to a culture of ethics and integrity, creating top-down
              accountability and driving AmeriLife&apos;s mission to help people and
              businesses achieve financial security and a better way of life.
            </p>
          </div>

          <LeadersGrid leaders={nodes} />
        </FadeInOnView>
      </div>

      <LeadersBackedBySection />
    </article>
  );
}
