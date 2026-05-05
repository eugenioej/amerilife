import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { AffiliatesHero } from "@/app/components/our-solutions/affiliates/AffiliatesHero";
import { AffiliatesQuoteBand } from "@/app/components/our-solutions/affiliates/AffiliatesQuoteBand";
import { AffiliatesPlatformIcons } from "@/app/components/our-solutions/affiliates/AffiliatesPlatformIcons";
import { AffiliatesGrowthCards } from "@/app/components/our-solutions/affiliates/AffiliatesGrowthCards";
import { AffiliatedCompaniesCarousel } from "@/app/components/our-solutions/affiliates/AffiliatedCompaniesCarousel";
import { buildMainAffiliatesCarouselCategories, fetchAffiliateNodes } from "@/lib/affiliates";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Affiliates | AmeriLife",
  "When you partner with AmeriLife, you join a family of independent companies that make up the industry's most powerful distribution network — all while maintaining the autonomy to run your business that you've worked so hard to build.",
  "/our-solutions/affiliates/"
);

export default async function AffiliatesPage() {
  const affiliateNodes = await fetchAffiliateNodes();
  const carouselCategories = buildMainAffiliatesCarouselCategories(affiliateNodes);

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Solutions" },
          { name: "Affiliates", path: "/our-solutions/affiliates/" },
        ])}
      />
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
              { label: "Our Solutions" },
              { label: "Affiliates" },
            ]}
          />
          <h1 className="text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Affiliates
          </h1>
        </FadeInOnView>
      </div>

      <FadeInOnView direction="up" className="w-full border-t border-[#e8ede8]">
        <AffiliatesHero />
      </FadeInOnView>
      <FadeInOnView direction="up" className="w-full">
        <AffiliatesQuoteBand />
      </FadeInOnView>
      <FadeInOnView direction="up" className="w-full">
        <AffiliatesPlatformIcons />
      </FadeInOnView>
      <FadeInOnView direction="up" className="w-full">
        <AffiliatesGrowthCards />
      </FadeInOnView>
      <FadeInOnView direction="up" className="w-full">
        <AffiliatedCompaniesCarousel categories={carouselCategories} />
      </FadeInOnView>
    </article>
  );
}
