import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { AffiliatesHero } from "@/app/components/our-solutions/affiliates/AffiliatesHero";
import { AffiliatesQuoteBand } from "@/app/components/our-solutions/affiliates/AffiliatesQuoteBand";
import { AffiliatesPlatformIcons } from "@/app/components/our-solutions/affiliates/AffiliatesPlatformIcons";
import { AffiliatesGrowthCards } from "@/app/components/our-solutions/affiliates/AffiliatesGrowthCards";
import { AffiliatedCompaniesCarousel } from "@/app/components/our-solutions/affiliates/AffiliatedCompaniesCarousel";

export const metadata: Metadata = {
  title: "Affiliates | AmeriLife",
  description:
    "When you partner with AmeriLife, you join a family of independent companies that make up the industry's most powerful distribution network — all while maintaining the autonomy to run your business that you've worked so hard to build.",
};

export default function AffiliatesPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24">
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
      </div>

      <AffiliatesHero />
      <AffiliatesQuoteBand />
      <AffiliatesPlatformIcons />
      <AffiliatesGrowthCards />
      <AffiliatedCompaniesCarousel />
    </article>
  );
}
