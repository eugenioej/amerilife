import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { LogoCarousel } from "@/app/components/ui/LogoCarousel";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_LEADER_BY_SLUG,
  GET_POSTS,
  type LeaderBySlugResult,
  type PostsListResult,
} from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import {
  AFFILIATE_CATEGORY_SLUG,
  affiliateNodesToCarouselLogos,
  affiliatesInCategory,
  fetchAffiliateNodes,
} from "@/lib/affiliates";
import { TrendingUp, Shield, Building2, BarChart3, Users, Award } from "lucide-react";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Wealth Distribution | AmeriLife",
  "AmeriLife's Wealth Distribution empowers agents and advisors who demand more out of their independent distribution platforms, with a focus on accumulation and retirement income, protection solutions, and advisory services.",
  "/about-us/our-distribution/wealth-distribution/"
);

const { toddHeadshot, accumulationImage, protectionImage, advisoryImage } =
  WP_IMAGE_SOURCES.wealthDistribution;

/** Leader CPT slug — matches `import-leaders.mjs` (Todd Buchanan). */
const WEALTH_DISTRIBUTION_LEADER_SLUG = "todd-buchanan";

async function getWealthDistributionLeader() {
  try {
    const data = await fetchGraphQL<LeaderBySlugResult>(GET_LEADER_BY_SLUG, {
      slug: WEALTH_DISTRIBUTION_LEADER_SLUG,
    });
    return data.leader ?? null;
  } catch {
    return null;
  }
}

async function getRelatedNewsPosts() {
  try {
    const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
      first: 3,
      after: null,
    });
    return data?.posts?.nodes ?? [];
  } catch {
    return [];
  }
}

/** Agent & advisor benefits with icons - mirrors career-agency RESOURCES pattern */
const AGENT_BENEFITS = [
  {
    icon: TrendingUp,
    text: "Best-in-class annuity products from more than 70 top carriers",
  },
  {
    icon: Shield,
    text: "Industry-leading protection products from more than 50 carriers",
  },
  {
    icon: Building2,
    text: "Nationwide reach of 20+ annuities-focused affiliated companies, including TruChoice Financial Group",
  },
  {
    icon: BarChart3,
    text: "Institutional and wholesaler support through Saybrus Partners",
  },
  {
    icon: Users,
    text: "Network of 1,000+ advisors in all 50 states with over $8 billion in assets under management",
  },
  {
    icon: Award,
    text: "Asset management platform, training, and back office support through Brookstone Capital Management",
  },
] as const;

const iconProps = {
  size: 20,
  strokeWidth: 2,
  className: " shrink-0 text-white",
  "aria-hidden": true as const,
};

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default async function WealthDistributionPage() {
  const [leader, relatedPosts, affiliateNodes] = await Promise.all([
    getWealthDistributionLeader(),
    getRelatedNewsPosts(),
    fetchAffiliateNodes(),
  ]);

  const wealthAffiliateLogos = affiliateNodesToCarouselLogos(
    affiliatesInCategory(affiliateNodes, AFFILIATE_CATEGORY_SLUG.wealthManagementRetirement)
  );

  const headshotSrc = leader?.featuredImage?.node?.sourceUrl
    ? rewriteUploadsUrl(leader.featuredImage.node.sourceUrl)
    : rewriteUploadsUrl(toddHeadshot);
  const leaderName = leader?.title?.trim() || "Todd Buchanan";
  const leaderTitle = leader?.leaderFields?.jobTitle?.trim() || "President, Wealth";
  const linkedinUrl =
    leader?.leaderFields?.linkedinUrl?.trim() || "https://www.linkedin.com/in/todd-buchanan/";
  const headshotAlt =
    leader?.featuredImage?.node?.altText?.trim() || `${leaderName} — ${leaderTitle}`;

  const firstCategorySlug = relatedPosts[0]?.categories?.nodes?.[0]?.slug;
  const hideCategoryPill =
    relatedPosts.length > 0 &&
    firstCategorySlug != null &&
    relatedPosts.every((p) => p.categories?.nodes?.[0]?.slug === firstCategorySlug);

  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained, left aligned (matches career-agency) */}
      <FadeInOnView
        direction="fade"
        threshold={0}
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24"
      >
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/about-us/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                About Us
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/about-us/our-distribution/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Our Distribution
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Wealth Distribution
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Wealth Distribution
        </h1>
      </FadeInOnView>

      {/* Hero - Left: teal slogan + intro | Right: Todd headshot + white card below */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl">
            A Future-Proofed
            <br />
            Platform for Agents
            <br />
            & Financial Advisors
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife&apos;s Wealth Distribution empowers agents and advisors who demand more out of
            their independent distribution platforms, aiming to be their partner of choice to make
            sure their clients – no matter their stages of life – never outgrow them.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            With a focus on Accumulation and Retirement Income, Protection Solutions and Advisory
            Services, AmeriLife&apos;s Wealth Distribution is powered by the industry&apos;s foremost
            financial services companies who, together, offer best-in-class, customizable services and
            support to grow and sustain the next generation of wealth firms and their professionals.
          </p>
        </div>
        <div className="flex flex-col items-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <div className="w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-[#e8ebe8]">
              <Image
                src={headshotSrc}
                alt={headshotAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white p-5 shadow-sm">
              <h3 className="mb-0.5 text-xl font-bold text-[var(--color-brand-dark)]">
                {leaderName}
              </h3>
              <p className="mb-3 text-base text-[var(--color-muted)]">{leaderTitle}</p>
              {linkedinUrl ? (
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-[var(--color-brand-primary)] underline underline-offset-2 transition-colors hover:text-[var(--color-brand-primary-hover)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  View LinkedIn
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </FadeInOnView>

      {/* Dark blue section: Accumulation image left, content + agent benefits (with icons) right - matches career-agency template */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(accumulationImage)}
            alt="AmeriLife Wealth accumulation and retirement"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">
            Accumulation & Retirement Income for a More Secure Future
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-white">
            Retiring well has never been more challenging, which is why today&apos;s agents and
            advisors are looking for ways to break through and deliver more for their
            clients&apos; retirements.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white">
            From the institutional and wholesaler support power of{" "}
            <Link href="https://www.saybruspartners.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/90">
              Saybrus Partners
            </Link>
            {" "}to the nationwide reach of more than 20 annuities-focused affiliated companies — including one of the industry&apos;s largest FMO&apos;s in{" "}
            <Link href="https://www.truchoicefinancial.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/90">
              TruChoice Financial Group
            </Link>
            {" "}— AmeriLife Wealth delivers a holistic strategy that breaks the mold of traditional distribution models and sets new standards for excellence. And with best-in-class annuity products from more than 70 top carriers, the right financial strategies are within reach.
          </p>
          <p className="mb-6 mt-8 max-w-xl text-base leading-relaxed text-white">
            AmeriLife Wealth provides agents and advisors with valuable resources like:
          </p>
          <ul className="space-y-2 pl-0 list-none text-base leading-relaxed text-white">
            {AGENT_BENEFITS.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i}>
                  <FadeInOnView
                    direction="up"
                    delay={i * 70}
                    className="flex items-start gap-3"
                  >
                    <Icon {...iconProps} />
                    <span>{item.text}</span>
                  </FadeInOnView>
                </li>
              );
            })}
          </ul>
        </div>
      </FadeInOnView>

      {/* Dark blue section: Protection content left, image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">
            Protection Solutions That Deliver Peace of Mind
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-white">
            AmeriLife Wealth is at the forefront of delivering solutions that help agents and advisors
            help their clients stay ahead of the curve as global trends continue to dramatically
            reshape the life insurance market.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white">
            Armed with industry-leading products from more than 50 carriers, and alongside partners
            such as{" "}
            <Link href="https://marketing.crump.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/90">
              Crump Life Insurance Services
            </Link>
            ,{" "}
            <Link href="https://successioncapital.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/90">
              Succession Capital Alliance
            </Link>
            , and others, we&apos;re focused on redefining what it means to deliver choice and security for modern times.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(protectionImage)}
            alt="AmeriLife Wealth protection solutions"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </FadeInOnView>

      {/* Dark blue section: Advisory image left, content right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(advisoryImage)}
            alt="AmeriLife Wealth advisory services"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">
            Advisory Services to Accelerate Your Independence
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-white">
            With a network of more than 1,000 advisors in all 50 states and over $8 billion in
            assets under management, AmeriLife&apos;s Wealth Advisory Services offers the tools and
            resources to support, sustain and accelerate the businesses of independent wealth
            advisors and IARs.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white">
            These services are spearheaded by our affiliate{" "}
            <Link href="https://www.brookstonecm.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/90">
              Brookstone Capital Management
            </Link>
            , one of the industry&apos;s largest and most respected RIAs. Brookstone offers a one-of-a-kind asset management platform that, along with best-in-class training programs, back office support and other critical services, contributed to the company being named one of the fastest growing RIAs by Financial Advisor magazine.
          </p>
        </div>
      </FadeInOnView>

      {/* Affiliated Companies — Affiliate CPT `wealth-management-retirement` (`amerilife-affiliates-cpt.php`) */}
      <FadeInOnView direction="up" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Affiliated Companies
          </h2>
          <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Wealth Management & Retirement Planning Market
          </h3>
          <LogoCarousel logos={wealthAffiliateLogos} />
        </div>
      </FadeInOnView>

      {/* Related News — latest Posts from WordPress */}
      <FadeInOnView direction="up" className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Related News
          </h2>
          {relatedPosts.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    hideCategoryPill={hideCategoryPill}
                  />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/newsroom/"
                  variant="button"
                  className="motion-cta inline-flex items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
                >
                  SEE ALL
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-[var(--color-muted)]">
              No recent posts are available right now. Visit our{" "}
              <Link href="/newsroom/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
                Newsroom
              </Link>{" "}
              for updates.
            </p>
          )}
        </div>
      </FadeInOnView>
    </article>
  );
}
