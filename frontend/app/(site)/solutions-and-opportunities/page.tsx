import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { Globe, GraduationCap, Package, TrendingUp, Award } from "lucide-react";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Solutions & Opportunities | AmeriLife",
  "AmeriLife's consultative approach, broad carrier selection and vast distribution network meet the needs of consumers at all stages of their lives — where they are, how they want to buy, and all within their individual budgets.",
  "/solutions-and-opportunities/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Solutions_Opportunities_HeroA_1420x1144.png`;

const MEANINGS = [
  {
    icon: Globe,
    title: "Expanding Your World",
    description: "Access to a national network of like-minded professionals",
  },
  {
    icon: GraduationCap,
    title: "Powering Your Success",
    description:
      "Seamless onboarding and industry-leading training for marketers and agents",
  },
  {
    icon: Package,
    title: "Expanding Your Portfolio",
    description:
      "A broad suite of customizable, industry-leading products from more than 100 carriers",
  },
  {
    icon: TrendingUp,
    title: "Accelerating Your Business",
    description: "Revenue growth support and enablement of downline M&A ambitions",
  },
  {
    icon: Award,
    title: "Fueling Your Motivation",
    description: "Competitive commissions and incentives to inspire and motivate success",
  },
] as const;

const LEVERAGE_OPTIONS = [
  {
    title: "Carrier Partners",
    description:
      "A distributor with best-in-class product development and go-to-market expertise.",
    href: "/our-solutions/carriers/",
  },
  {
    title: "Affiliates",
    description: "An ally to help your business stand out from the rest.",
    href: "/our-solutions/affiliates/",
  },
  {
    title: "Agents & Advisors",
    description: "A partner to arm you with the diverse solutions today's market demands.",
    href: "/our-solutions/agents-and-advisors/",
  },
  {
    title: "Consumers",
    description: "An advocate to deliver the right solutions customized for you.",
    href: "/our-solutions/consumers/",
  },
  {
    title: "Employees",
    description: "A work environment where opportunities for growth are endless.",
    href: "/our-solutions/employees/",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export default function SolutionsOpportunitiesPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions & Opportunities", path: "/solutions-and-opportunities/" },
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
              { label: "Solutions & Opportunities" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Solutions & Opportunities
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero: Where Opportunities Abound - 2-col */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-white px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            Where Opportunities
            <br />
            Abound
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife&apos;s consultative approach, broad carrier selection and vast distribution
            network meet the needs of consumers at all stages of their lives — where they are, how
            they want to buy, and all within their individual budgets.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            But our solutions are more than our portfolio of health, life, annuities and retirement
            planning products. They represent AmeriLife&apos;s ongoing commitment to delivering
            opportunities for our stakeholders to make a difference and carve their own path.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife solutions and opportunities"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Our solutions and opportunities mean - 5 cards with icons */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Our solutions and opportunities mean:
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MEANINGS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 sm:p-10"
                >
                  <div className="mb-4">
                    <Icon {...iconProps} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)]">
                    {item.title}
                  </h3>
                  <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leveraging Our Solutions & Opportunity for You - 5 link cards */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Leveraging Our Solutions & Opportunity for You
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LEVERAGE_OPTIONS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                variant="button"
                className="group flex flex-col rounded-lg bg-[#e2e5ed] p-8 transition-colors hover:bg-[#d5d9e8] sm:p-10"
              >
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)] group-hover:text-[var(--color-brand-primary)]">
                  {item.title}
                </h3>
                <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-primary)]">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
