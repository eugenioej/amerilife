import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { LogoCarousel } from "@/app/components/ui/LogoCarousel";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  title: "Worksite Distribution | AmeriLife",
  description:
    "AmeriLife Benefits helps employers turn their employee benefits program into a competitive advantage with customized benefit solutions, communications and administrative services.",
};

const { barbaraHeadshot, heroImage1, heroImage2 } = WP_IMAGE_SOURCES.worksiteDistribution;

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

const RELATED_NEWS = [
  {
    category: "Leadership",
    date: "08/13/24",
    title: "AmeriLife Names Michael Tobitsch Executive Vice President and Head of Corporate Development",
    href: "https://amerilife.com/blog/announcements/amerilife-names-michael-tobitsch-executive-vice-president-and-head-of-corporate-development/",
  },
  {
    category: "Leadership",
    date: "01/08/24",
    title: "AmeriLife Names Gideon Moore Chief Legal Officer",
    href: "https://amerilife.com/blog/announcements/amerilife-names-gideon-moore-chief-legal-officer/",
  },
  {
    category: "Gives Back",
    date: "11/09/23",
    title: "AmeriLife Gives Back Foundation Names Honor Flight Network as Inaugural Partner",
    href: "https://amerilife.com/blog/announcements/amerilife-gives-back-foundation-names-honor-flight-network-as-inaugural-partner/",
  },
] as const;

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default function WorksiteDistributionPage() {
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
              Worksite Distribution
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Worksite Distribution
        </h1>
      </div>

      {/* Hero - Left: slogan + intro | Right: Barbara headshot + card */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl">
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
                src={rewriteUploadsUrl(barbaraHeadshot)}
                alt="Barbara Stewart, President, AmeriLife Benefits"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white p-5 shadow-sm">
              <h3 className="mb-0.5 text-xl font-bold text-[var(--color-brand-dark)]">
                Barbara Stewart
              </h3>
              <p className="mb-3 text-base text-[var(--color-muted)]">
                President, AmeriLife Benefits
              </p>
              <Link
                href="https://www.linkedin.com/in/barbara-stewart-3b478555/"
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

      {/* Dark blue section: Hero image left, Group Benefits Options right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">
            Group Benefits Options Include:
          </h3>
          <ul className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {GROUP_BENEFITS_OPTIONS.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-base leading-relaxed text-white">
                <span className="text-[var(--color-brand-primary)]">•</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            variant="button"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            CONTACT US
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Dark blue section: Partner content left, image right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
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
      </div>

      {/* Affiliated Companies - Worksite Distribution */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Affiliated Companies
          </h2>
          <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Worksite Distribution
          </h3>
          <LogoCarousel logos={WP_IMAGE_SOURCES.affiliates.worksiteLogos} />
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
