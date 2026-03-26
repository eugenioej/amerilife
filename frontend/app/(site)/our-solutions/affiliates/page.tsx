import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { AffiliatesHero } from "@/app/components/our-solutions/affiliates/AffiliatesHero";
import { AffiliatesQuoteBand } from "@/app/components/our-solutions/affiliates/AffiliatesQuoteBand";
import { AffiliatesPlatformIcons } from "@/app/components/our-solutions/affiliates/AffiliatesPlatformIcons";
import { AffiliatesGrowthCards } from "@/app/components/our-solutions/affiliates/AffiliatesGrowthCards";
import { AffiliatedCompaniesCarousel } from "@/app/components/our-solutions/affiliates/AffiliatedCompaniesCarousel";
import { buildMainAffiliatesCarouselCategories, fetchAffiliateNodes } from "@/lib/affiliates";
import { staticPageMetadata } from "@/lib/seo";

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
      {/* Breadcrumb + Title - contained */}
      <FadeInOnView
        direction="fade"
        threshold={0}
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24"
      >
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/our-solutions/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Our Solutions
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Affiliates
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Affiliates
        </h1>
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
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
