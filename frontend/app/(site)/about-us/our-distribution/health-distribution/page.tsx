import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
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
import { Network, Package, Cpu, Megaphone, DollarSign } from "lucide-react";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Health Distribution | AmeriLife",
  "As one of the industry's largest independent distribution networks, AmeriLife Health delivers exceptional customer value through Medicare Advantage, Medicare Supplement, PDP, ACA, ancillary and life insurance sales.",
  "/about-us/our-distribution/health-distribution/"
);

const { scottyHeadshot, heroImage } = WP_IMAGE_SOURCES.healthDistribution;

/** Leader CPT slug — must match WordPress (`import-leaders.mjs` / Leaders admin). */
const HEALTH_DISTRIBUTION_LEADER_SLUG = "scotty-elliott";

async function getHealthDistributionLeader() {
  try {
    const data = await fetchGraphQL<LeaderBySlugResult>(GET_LEADER_BY_SLUG, {
      slug: HEALTH_DISTRIBUTION_LEADER_SLUG,
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

const OUR_OFFERINGS = [
  {
    title: "Medicare & Under 65",
    description:
      "AmeriLife holds contracts with a wide range of top-rated health carriers whose plans provide access to quality healthcare services and peace of mind.",
  },
  {
    title: "Simplified Issue Life",
    description:
      "Policies that require less paperwork and fewer medical exams than traditional life insurance, Simplified Issue Life Insurance is a great option for clients and their agents who want the convenience of purchasing critical, competitive life insurance coverage quickly, easily and affordably.",
  },
  {
    title: "Ancillary Health Insurance",
    description:
      "AmeriLife's deep, holistic portfolio of health products ranges from top critical care plans to cancer insurance, all designed to complement consumers' diverse and constantly evolving health needs.",
  },
  {
    title: "Direct-to-Consumer/Call Center",
    description:
      "Powered by Senior Healthcare Direct, an AmeriLife company, AmeriLife's customizable, call center model represents more than 30 insurance companies serving thousands of Medicare-eligible clients across the U.S.",
  },
] as const;

const AGENT_BENEFITS = [
  {
    icon: Network,
    title: "National Network",
    description: (
      <>
        Network of more than 40{" "}
        <Link href="/our-solutions/affiliates" className="text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-primary-hover)]">
          affiliates
        </Link>
        {" "}with national reach and local expertise
      </>
    ),
  },
  {
    icon: Package,
    title: "Top Carriers",
    description: (
      <>
        High-performing shelf and proprietary products from top{" "}
        <Link href="/our-solutions/carriers" className="text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-primary-hover)]">
          carriers
        </Link>
      </>
    ),
  },
  {
    icon: Cpu,
    title: "Sales Tools",
    description: "Cutting-edge technology and sales enablement tools and resources",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    description: "From digital marketing and design to your own, personal sales leads",
  },
  {
    icon: DollarSign,
    title: "Earnings",
    description: "Competitive compensation and exclusive incentive programs",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

/** Dark blue background for content panels */
/** Our Offerings panel — blue to green (aligned with who-we-are mission band) */
const OFFERINGS_GRADIENT = "linear-gradient(105deg, #003a74 0%, #67c084 100%)";

export default async function HealthDistributionPage() {
  const [leader, relatedPosts, affiliateNodes] = await Promise.all([
    getHealthDistributionLeader(),
    getRelatedNewsPosts(),
    fetchAffiliateNodes(),
  ]);

  const medicalAffiliateLogos = affiliateNodesToCarouselLogos(
    affiliatesInCategory(affiliateNodes, AFFILIATE_CATEGORY_SLUG.medicalLifeHealth)
  );
  const directToConsumerLogos = affiliateNodesToCarouselLogos(
    affiliatesInCategory(affiliateNodes, AFFILIATE_CATEGORY_SLUG.directToConsumer)
  );

  const headshotSrc = leader?.featuredImage?.node?.sourceUrl
    ? rewriteUploadsUrl(leader.featuredImage.node.sourceUrl)
    : rewriteUploadsUrl(scottyHeadshot);
  const leaderName = leader?.title?.trim() || "Scotty Elliott";
  const leaderTitle =
    leader?.leaderFields?.jobTitle?.trim() || "Chief Distribution Officer, Health";
  const linkedinUrl =
    leader?.leaderFields?.linkedinUrl?.trim() ||
    "https://www.linkedin.com/in/scotty-elliott-a3492336/";
  const headshotAlt =
    leader?.featuredImage?.node?.altText?.trim() || `${leaderName} — ${leaderTitle}`;

  const firstCategorySlug = relatedPosts[0]?.categories?.nodes?.[0]?.slug;
  const hideCategoryPill =
    relatedPosts.length > 0 &&
    firstCategorySlug != null &&
    relatedPosts.every((p) => p.categories?.nodes?.[0]?.slug === firstCategorySlug);

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us/" },
          { name: "Our Distribution", path: "/about-us/our-distribution/" },
          { name: "Health Distribution", path: "/about-us/our-distribution/health-distribution/" },
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
              { label: "About Us", href: "/about-us/" },
              { label: "Our Distribution", href: "/about-us/our-distribution/" },
              { label: "Health Distribution" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Health Distribution
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero - Left: slogan + intro | Right: Scotty headshot + card */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            Product Solutions
            <br />
            for Modern Times
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            As one of the industry&apos;s largest independent distribution networks, we work with all
            levels and sizes of agencies to deliver exceptional customer value through Medicare
            Advantage, Medicare Supplement, PDP, ACA, ancillary and life insurance sales.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            With a network of more than 40 high-performing affiliates nationwide – as well as access
            to a growing suite of products from some of the nation&apos;s top carriers – AmeriLife
            Health continues to set the industry standard and provide exciting opportunities for its
            agents.
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

      {/* Blue/green gradient: Our Offerings left, hero image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ background: OFFERINGS_GRADIENT }}
        >
          <h3 className="mb-8 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Our Offerings
          </h3>
          <ul className="space-y-6 list-none pl-0">
            {OUR_OFFERINGS.map((item, i) => (
              <li key={i}>
                <h4 className="mb-2 text-base font-bold text-white">{item.title}</h4>
                <p className="text-base leading-relaxed text-white/95">{item.description}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            variant="button"
            className="motion-cta mt-10 inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            CONTACT US
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(heroImage)}
            alt="AmeriLife Health distribution"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </FadeInOnView>

      {/* Agent Benefits - 5 cards with icons */}
      <section className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-bold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Agent Benefits
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {AGENT_BENEFITS.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeInOnView
                  key={i}
                  direction="up"
                  delay={i * 60}
                  className="flex flex-col items-center rounded-lg border border-[var(--color-border)] bg-white p-6 text-center shadow-sm sm:p-8"
                >
                  <div className="mb-4">
                    <Icon {...iconProps} />
                  </div>
                  <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-[var(--color-fg)] sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </FadeInOnView>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affiliated Companies — Affiliate CPT + `affiliate_category` terms (see `amerilife-affiliates-cpt.php`) */}
      <FadeInOnView direction="up" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-bold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Affiliated Companies
          </h2>
          <div className="space-y-12">
            <div>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-fg)]">
                Medical, Life & Health Market
              </h3>
              <LogoCarousel colorLogos logos={medicalAffiliateLogos} />
            </div>
            <div>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-fg)]">
                Direct to Consumer
              </h3>
              <LogoCarousel colorLogos logos={directToConsumerLogos} />
            </div>
          </div>
        </div>
      </FadeInOnView>

      {/* Related News — latest Posts from WordPress */}
      <FadeInOnView direction="up" className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-bold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
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
