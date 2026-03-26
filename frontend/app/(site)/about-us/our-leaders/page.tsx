import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { LeadersBackedBySection } from "@/app/components/about-us/leaders/LeadersBackedBySection";
import { LeadersGrid } from "@/app/components/about-us/leaders/LeadersGrid";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_LEADERS, type LeadersQueryResult } from "@/lib/queries";
import { staticPageMetadata } from "@/lib/seo";

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

  return (
    <article className="bg-white">
      <FadeInOnView
        direction="fade"
        threshold={0}
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 sm:py-16"
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
                href="/about-us/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                About Us
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Our Leaders
            </li>
          </ol>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">Our Leaders</h1>

        <div className="mb-12 max-w-3xl space-y-4 text-base leading-relaxed text-[var(--color-fg)]">
          <p>
            Ameri{"\u00a0"}Life values our executive team&apos;s wealth of industry expertise as
            veterans of some of the nation&apos;s most notable insurance companies — including Met
            {"\u00a0"}Life, Bankers{"\u00a0"}Life and Transamerica.
          </p>
          <p>
            Our leaders are committed to a culture of ethics and integrity, creating top-down
            accountability and driving Ameri{"\u00a0"}Life&apos;s mission to help people and businesses
            achieve financial security and a better way of life.
          </p>
        </div>

        <LeadersGrid leaders={nodes} />
      </FadeInOnView>

      <LeadersBackedBySection />
    </article>
  );
}
