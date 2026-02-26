import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { LogoCarousel } from "@/app/components/ui/LogoCarousel";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { TrendingUp, Shield, Building2, BarChart3, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Wealth Distribution | AmeriLife",
  description:
    "AmeriLife's Wealth Distribution empowers agents and advisors who demand more out of their independent distribution platforms, with a focus on accumulation and retirement income, protection solutions, and advisory services.",
};

const { toddHeadshot, accumulationImage, protectionImage, advisoryImage } =
  WP_IMAGE_SOURCES.wealthDistribution;

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

const RELATED_NEWS = [
  {
    category: "Leadership",
    date: "01/14/26",
    title: "Todd Buchanan Named President of AmeriLife Wealth",
    href: "https://amerilife.com/blog/announcements/todd-buchanan-named-president-of-amerilife-wealth/",
  },
  {
    category: "Merger & Acquisitions",
    date: "12/18/25",
    title: "American Alliance Marketing Group and AmeriLife's Pinnacle Financial Services Form Strategic Alliance",
    href: "https://amerilife.com/blog/announcements/american-alliance-marketing-group-and-amerilifes-pinnacle-financial-services-form-strategic-alliance/",
  },
  {
    category: "Awards",
    date: "11/13/25",
    title: "AmeriLife Recognized as a 2025 Inc. Power Partner Award Winner for the Third Consecutive Year",
    href: "https://amerilife.com/blog/announcements/amerilife-recognized-as-a-2025-inc-power-partner-award-winner-for-the-third-consecutive-year/",
  },
] as const;

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default function WealthDistributionPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained, left aligned (matches career-agency) */}
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
              Wealth Distribution
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Wealth Distribution
        </h1>
      </div>

      {/* Hero - Left: teal slogan + intro | Right: Todd headshot + white card below */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
                src={rewriteUploadsUrl(toddHeadshot)}
                alt="Todd Buchanan, President, Wealth"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white p-5 shadow-sm">
              <h3 className="mb-0.5 text-xl font-bold text-[var(--color-brand-dark)]">
                Todd Buchanan
              </h3>
              <p className="mb-3 text-base text-[var(--color-muted)]">
                President, Wealth
              </p>
              <Link
                href="https://www.linkedin.com/in/todd-buchanan/"
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

      {/* Dark blue section: Accumulation image left, content + agent benefits (with icons) right - matches career-agency template */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
                <li key={i} className="flex items-start gap-3">
                  <Icon {...iconProps} />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Dark blue section: Protection content left, image right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
      </div>

      {/* Dark blue section: Advisory image left, content right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
      </div>

      {/* Wealth Management & Retirement Planning Market - logo carousel */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Wealth Management & Retirement Planning Market
          </h2>
          <LogoCarousel
            logos={WP_IMAGE_SOURCES.affiliates.affiliateLogos.filter((l) =>
              [
                "Allied Elite Financial",
                "Crump",
                "Levinson",
                "Meritage",
                "The Ohlson Group",
                "Peak Financial",
                "SAM",
                "Saybrus",
                "Sterling Bridge",
                "Succession",
                "The Hoffman Financial Group",
                "USA Financial",
                "MyLifeWerks",
              ].includes(l.alt)
            )}
          />
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
