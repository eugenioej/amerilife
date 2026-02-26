import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { LogoCarousel } from "@/app/components/ui/LogoCarousel";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { Network, Package, Cpu, Megaphone, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Distribution | AmeriLife",
  description:
    "As one of the industry's largest independent distribution networks, AmeriLife Health delivers exceptional customer value through Medicare Advantage, Medicare Supplement, PDP, ACA, ancillary and life insurance sales.",
};

const { scottyHeadshot, heroImage } = WP_IMAGE_SOURCES.healthDistribution;

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

const RELATED_NEWS = [
  {
    category: "Merger & Acquisitions",
    date: "01/20/26",
    title: "Brian Krantz and Plan Medicare Partner with AmeriLife to Expand White-Glove Medicare Support for Financial Advisors Nationwide",
    href: "https://amerilife.com/blog/announcements/brian-krantz-and-plan-medicare-partner-with-amerilife-to-expand-white-glove-medicare-support-for-financial-advisors-nationwide/",
  },
  {
    category: "Merger & Acquisitions",
    date: "12/18/25",
    title: "American Alliance Marketing Group and AmeriLife's Pinnacle Financial Services Form Strategic Alliance",
    href: "https://amerilife.com/blog/announcements/american-alliance-marketing-group-and-amerilifes-pinnacle-financial-services-form-strategic-alliance/",
  },
  {
    category: "Merger & Acquisitions",
    date: "12/10/25",
    title: "Tyler Insurance Group and AmeriLife's Pinnacle Financial Services Announces Partnership to Scale Mission and Serve More Families",
    href: "https://amerilife.com/blog/announcements/tyler-insurance-group-and-amerilifes-pinnacle-financial-services-announces-partnership-to-scale-mission-and-serve-more-families/",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default function HealthDistributionPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24">
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
              Health Distribution
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Health Distribution
        </h1>
      </div>

      {/* Hero - Left: slogan + intro | Right: Scotty headshot + card */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl">
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
                src={rewriteUploadsUrl(scottyHeadshot)}
                alt="Scotty Elliott, Chief Distribution Officer, Health"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white p-5 shadow-sm">
              <h3 className="mb-0.5 text-xl font-bold text-[var(--color-brand-dark)]">
                Scotty Elliott
              </h3>
              <p className="mb-3 text-base text-[var(--color-muted)]">
                Chief Distribution Officer, Health
              </p>
              <Link
                href="https://www.linkedin.com/in/scotty-elliott-a3492336/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-[var(--color-brand-primary)] underline underline-offset-2 transition-colors hover:text-[var(--color-brand-primary-hover)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                VIEW LINKEDIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dark blue section: Hero image left, Our Offerings right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <h3 className="mb-8 text-xl font-bold text-white sm:text-2xl">
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
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            CONTACT US
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Agent Benefits - 5 cards with icons */}
      <section className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Agent Benefits
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {AGENT_BENEFITS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affiliated Companies - Medical, Life & Health + Direct to Consumer */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Affiliated Companies
          </h2>
          <div className="space-y-12">
            <div>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Medical, Life & Health Market
              </h3>
              <LogoCarousel logos={WP_IMAGE_SOURCES.affiliates.affiliateLogos} />
            </div>
            <div>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Direct to Consumer
              </h3>
              <LogoCarousel
                logos={WP_IMAGE_SOURCES.affiliates.affiliateLogos.filter((l) =>
                  l.alt.toLowerCase().includes("senior")
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      <section className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Related News
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {RELATED_NEWS.map((item, i) => (
              <article
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
                  <span className="rounded bg-[#e67e22] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    {item.category}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">{item.date}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-4 flex-1 text-base font-bold leading-snug text-[var(--color-fg)] sm:text-lg">
                    {item.title}
                  </h3>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-sm font-medium uppercase tracking-wide text-[var(--color-brand-primary)] underline underline-offset-2 transition-colors hover:text-[var(--color-brand-primary-hover)]"
                  >
                    READ ARTICLE
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="https://amerilife.com/newsroom/"
              target="_blank"
              rel="noopener noreferrer"
              variant="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
            >
              SEE ALL
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
