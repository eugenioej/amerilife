import type { Metadata } from "next";
import Image from "next/image";
import { TrendingUp, Shield, UserCircle, Briefcase } from "lucide-react";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { getByNumberIcon } from "@/app/components/about-us/DistributionIcons";

export const metadata: Metadata = staticPageMetadata(
  "Our Distribution | AmeriLife",
  "AmeriLife's vast marketing and distribution network connects agents and advisors with consumers nationwide. Explore our distribution channels and by the numbers.",
  "/about-us/our-distribution/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";

/** Hero image - from amerilife.com/about-us/our-distribution/ */
const HERO_IMAGE = `${UPLOADS}/2023/04/Distribution-Hero_0230-1024x683-1.jpg`;

/** By the Numbers section - OG uses banner-10.png as background */
const BY_THE_NUMBERS_BG = `${UPLOADS}/2021/12/banner-10.png`;

const BY_THE_NUMBERS = [
  { stat: "400k", label: "Clients served by…" },
  { stat: "300k+", label: "Agents and advisors through..." },
  { stat: "50", label: "Agency locations" },
  { stat: "$7.5 billion", label: "In assets under RIA management and…" },
  { stat: "70", label: "Marketing organizations across the U.S. plus..." },
  { stat: "110k+", label: "Worksite monthly billings across 20 industry sectors" },
] as const;

/** OG uses: icon-finance, icon-integrity, icon-user-tie-solid, icon-briefcase-solid-2 */
const DISTRIBUTION_CHANNELS = [
  {
    title: "Wealth Distribution",
    description:
      "Independent distribution platform with a holistic approach to accumulation and retirement income, income protection and wealth advisory services.",
    href: "/about-us/our-distribution/wealth-distribution/",
    Icon: TrendingUp,
  },
  {
    title: "Health Distribution",
    description:
      "Affiliate network of full-service, simplified issue life and health insurance companies, as well as direct-to-consumer distribution.",
    href: "/about-us/our-distribution/health-distribution/",
    Icon: Shield,
  },
  {
    title: "Career Agency",
    description:
      "Distribution model dedicated to the development and growth for independent AmeriLife agents, providing them with access to competitive products, leads and best-in-class commissions and incentives.",
    href: "/about-us/our-distribution/career-agency/",
    Icon: UserCircle,
  },
  {
    title: "Worksite Distribution",
    description:
      "Customized workforce insurance benefits and adjacent services for companies of all sizes.",
    href: "/about-us/our-distribution/worksite-distribution/",
    Icon: Briefcase,
  },
] as const;

export default function OurDistributionPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us/" },
          { name: "Our Distribution", path: "/about-us/our-distribution/" },
        ])}
      />
      {/* Hero - 2-col: gray bg left with copy, image right (match Who We Are) */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <nav className="mb-6 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
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
              <li className="text-[var(--color-fg)]" aria-current="page">
                Our Distribution
              </li>
            </ol>
          </nav>
          <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
            Our Distribution
          </h1>
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            A Model
            <br />
            of Excellence
          </h2>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife&apos;s vast marketing and distribution network — powered by an industry-leading
            in-field, telesales and hybrid salesforce — is the backbone of our business.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Our distribution allows us to connect agents and advisors with consumers nationwide, and
            our innovative solutions are enhancing lives and setting the standard across the industry.
          </p>
        </div>
        <div className="relative aspect-[746/660] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife distribution network"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
        </div>
      </FadeInOnView>

      {/* By the Numbers - OG uses banner-10.png background */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[400px] overflow-hidden bg-cover bg-center py-16 sm:py-24"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BY_THE_NUMBERS_BG)})` }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            By the Numbers
          </h2>
          {/* First row: 2 columns - Clients served by + Agents and advisors through */}
          <div className="mb-8 grid gap-8 sm:grid-cols-2">
            {[BY_THE_NUMBERS[0], BY_THE_NUMBERS[1]].map((item, i) => {
              const Icon = getByNumberIcon(i);
              return (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm"
                >
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <span className="mb-2 text-4xl font-bold text-white sm:text-5xl">{item.stat}</span>
                  <span className="text-sm text-white/90 sm:text-base">{item.label}</span>
                </div>
              );
            })}
          </div>
          {/* Remaining stats */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BY_THE_NUMBERS.slice(2).map((item, i) => {
              const Icon = getByNumberIcon(i + 2);
              return (
                <div
                  key={i + 2}
                  className="flex flex-col items-center rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm"
                >
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <span className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                    {item.stat}
                  </span>
                  <span className="text-sm text-white/90 sm:text-base">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </FadeInOnView>

      {/* Our Distribution Channels - icon cards (no photos, match OG) */}
      <FadeInOnView direction="up" className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Our Distribution Channels
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {DISTRIBUTION_CHANNELS.map((channel) => {
              const Icon = channel.Icon;
              return (
                <Link
                  key={channel.href}
                  href={channel.href}
                  variant="button"
                  className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[#e2e5ed] p-8 shadow-sm transition-shadow hover:shadow-lg sm:p-10"
                >
                  <div className="mb-4">
                    <Icon
                      size={48}
                      strokeWidth={1.5}
                      className="text-[var(--color-brand-primary)]"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">
                    {channel.title}
                  </h3>
                  <div className="mt-auto flex flex-col gap-4">
                    <p className="text-base leading-relaxed text-[var(--color-fg)]">
                      {channel.description}
                    </p>
                    <span className="text-sm font-semibold text-[var(--color-brand-primary)] transition-colors group-hover:text-[var(--color-brand-primary-hover)]">
                      Read more →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </FadeInOnView>
    </article>
  );
}
