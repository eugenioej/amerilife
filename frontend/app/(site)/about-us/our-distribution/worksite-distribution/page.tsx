import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_LEADER_BY_SLUG,
  GET_POSTS,
  type LeaderBySlugResult,
  type PostsListResult,
} from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Worksite Distribution | AmeriLife",
  "AmeriLife Benefits helps employers turn their employee benefits program into a competitive advantage with customized benefit solutions, communications and administrative services.",
  "/about-us/our-distribution/worksite-distribution/"
);

const { barbaraHeadshot, heroImage1, heroImage2 } = WP_IMAGE_SOURCES.worksiteDistribution;

/** Leader CPT slug — must match WordPress when the leader is published. */
const WORKSITE_DISTRIBUTION_LEADER_SLUG = "barbara-stewart";

async function getWorksiteDistributionLeader() {
  try {
    const data = await fetchGraphQL<LeaderBySlugResult>(GET_LEADER_BY_SLUG, {
      slug: WORKSITE_DISTRIBUTION_LEADER_SLUG,
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

const GROUP_BENEFITS_OPTIONS = [
  "Critical Illness/Accident",
  "Hospital Indemnity",
  "Disability",
  "Life & LTC Insurance",
  "GAP & MEC Plans",
  "Dental/Vision",
  "FSA, HSA & HRA Plans",
  "Executive Benefits",
  "Part-Time Employee Benefits",
  "ID Theft & Legal Services",
  "Pet Insurance",
  "403(b)/457 Plans and more",
] as const;

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default async function WorksiteDistributionPage() {
  const [leader, relatedPosts] = await Promise.all([
    getWorksiteDistributionLeader(),
    getRelatedNewsPosts(),
  ]);

  const headshotSrc = leader?.featuredImage?.node?.sourceUrl
    ? rewriteUploadsUrl(leader.featuredImage.node.sourceUrl)
    : rewriteUploadsUrl(barbaraHeadshot);
  const leaderName = leader?.title?.trim() || "Barbara Stewart";
  const leaderTitle =
    leader?.leaderFields?.jobTitle?.trim() || "President, AmeriLife Benefits";
  const linkedinUrl =
    leader?.leaderFields?.linkedinUrl?.trim() ||
    "https://www.linkedin.com/in/barbara-stewart-3b478555/";
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
          { name: "Worksite Distribution", path: "/about-us/our-distribution/worksite-distribution/" },
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
              { label: "Worksite Distribution" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Worksite Distribution
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero - Left: slogan + intro | Right: Barbara headshot + card */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            Bringing the Focus
            <br />
            Back to Work
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife Benefits – AmeriLife&apos;s industry-leading employee benefits distribution
            group – helps employers turn their employee benefits program into a competitive
            advantage.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Customized benefit solutions, communications and administrative services help employees
            offset healthcare costs and live more securely, while enabling benefit enrollment,
            eligibility, premium administration and data and technology processes to work as they
            should — without pain to employers.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            To learn more about AmeriLife Benefits, visit{" "}
            <Link
              href="https://www.amerilifebenefits.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-primary-hover)]"
            >
              www.amerilifebenefits.com
            </Link>
            .
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

      {/* Dark blue section: Hero image left, Group Benefits Options right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(heroImage1)}
            alt="AmeriLife Worksite distribution"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div
          className="flex h-full min-h-0 flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <div className="mx-auto w-full max-w-xl text-left">
            <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">
              Group Benefits Options Include:
            </h3>
            <ul className="mb-8 flex list-none flex-col gap-2 pl-0">
              {GROUP_BENEFITS_OPTIONS.map((item, i) => (
                <li key={i}>
                  <FadeInOnView
                    direction="up"
                    delay={i * 50}
                    className="flex items-center gap-2 text-base leading-relaxed text-white"
                  >
                    <span className="text-[var(--color-brand-primary)]">•</span>
                    {item}
                  </FadeInOnView>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeInOnView>

      {/* Dark blue section: Partner content left, image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <p className="max-w-xl text-base leading-relaxed text-white">
            AmeriLife Benefits partners with leading medical brokers across the country — serving
            more than 1,000 groups and 110,000 worksite certificate billings every month — and
            offers a wide range of worksite products and services made available through its
            affiliates Benefits Direct, Blue Chip Benefits, Taylor & Sons Insurance, and National
            Insurance Marketing Brokers.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(heroImage2)}
            alt="AmeriLife Worksite benefits"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
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
