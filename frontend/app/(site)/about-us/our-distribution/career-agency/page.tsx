import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { relatedNewsToPost } from "@/lib/related-news";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  title: "Career Agency | AmeriLife",
  description:
    "As more Americans look to insurance and retirement solutions to protect their families, AmeriLife's agents are on the front lines. We're committed to helping independent agents develop and grow with training, incentives, and industry-leading products.",
};

const { frankHeadshot, groupImage, familyImage } = WP_IMAGE_SOURCES.careerAgency;

const RESOURCES = [
  "New agent training and ongoing professional development",
  "Weekly incentives, sales bonuses and much more",
  "A diverse portfolio of products, with exclusive, industry-leading commission levels",
  "A robust lead generation and sales support platform",
  "Access to proprietary products developed by the Product Development Group (PDG) with the newest features and competitive pricing",
  "State-of-the-art sales enablement technology",
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
    date: "05/02/24",
    title: "AmeriLife Names Juan Carlos Moreno National Sales Director for ACA",
    href: "https://amerilife.com/blog/announcements/amerilife-names-juan-carlos-moreno-national-sales-director-for-aca/",
  },
  {
    category: "Leadership",
    date: "01/08/24",
    title: "AmeriLife Names Gideon Moore Chief Legal Officer",
    href: "https://amerilife.com/blog/announcements/amerilife-names-gideon-moore-chief-legal-officer/",
  },
] as const;

/** Dark blue background for content panels */
const DARK_PANEL_BG = "rgb(36, 66, 96)";

export default function CareerAgencyPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained, left aligned (matches agents-and-advisors) */}
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
              Career Agency
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Career Agency
        </h1>
      </div>

      {/* Hero - Left: teal slogan + intro | Right: Frank headshot + white card below */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--color-brand-primary)] sm:text-3xl">
            Helping People
            <br />
            Prepare for Life —
            <br />
            Together as One
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            As more Americans look to insurance and retirement solutions to protect their families,
            AmeriLife&apos;s agents are on the front lines, educating and empowering them to live
            longer, healthier lives. At AmeriLife, we&apos;re committed to helping these independent
            agents develop and grow.
          </p>
        </div>
        <div className="flex flex-col items-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <div className="w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-[#e8ebe8]">
              <Image
                src={rewriteUploadsUrl(frankHeadshot)}
                alt="Frank Tebyani, President, Career Agency"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            {/* White card below headshot - per original */}
            <div className="rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white p-5 shadow-sm">
              <h3 className="mb-0.5 text-xl font-bold text-[var(--color-brand-dark)]">
                Frank Tebyani
              </h3>
              <p className="mb-3 text-base text-[var(--color-muted)]">
                President, Career Agency
              </p>
              <Link
                href="https://www.linkedin.com/in/frank-tebyani-84251546/"
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

      {/* Dark blue section: Group photo left, Since 1971 + bullets right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(groupImage)}
            alt="AmeriLife agents at seminar"
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
          <p className="mb-6 max-w-xl text-base leading-relaxed text-white">
            Since 1971, AmeriLife has opened 50 career agency locations, with more than 800 agents
            serving nearly 300,000 clients. With offices in 12 states and further expansion on the
            horizon, AmeriLife provides our agents with valuable resources like:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-white">
            {RESOURCES.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dark blue section: Closing + CTA left, Family photo right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ backgroundColor: DARK_PANEL_BG }}
        >
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white">
            Our agents collaborate with their clients to learn their stories and find the right
            insurance and retirement solutions to meet life&apos;s challenges — together.
          </p>
          <Link
            href="https://amerilife.avature.net/careers"
            target="_blank"
            rel="noopener noreferrer"
            variant="button"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            VIEW AGENT OPPORTUNITIES
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(familyImage)}
            alt="Agent meeting with family clients"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </div>

      {/* Related News - off-white bg (matches agents-and-advisors solutions section) */}
      <section className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Related News
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED_NEWS.map((item, i) => (
              <BlogPostCard
                key={i}
                post={relatedNewsToPost(item, i)}
                hideCategoryPill={RELATED_NEWS.every((x) => x.category === RELATED_NEWS[0].category)}
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/newsroom/"
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
