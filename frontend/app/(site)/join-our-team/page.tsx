import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { VideoWithPlaceholder } from "@/app/components/join-our-team/VideoWithPlaceholder";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = staticPageMetadata(
  "Join Our Team | AmeriLife",
  "As part of the AmeriLife team, you have the ability to positively impact the lives of Americans nationwide. Explore career opportunities for employees and sales agents.",
  "/join-our-team/"
);

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Join_Our_Team_Hero_1420x1144.png`;
const EMPLOYEES_IMAGE = `${UPLOADS}/2022/01/JoinTeam_CorpB_1420x1144.png`;
const AGENTS_VIDEO_PREVIEW = `${UPLOADS}/2022/01/Join_Agent_VideoPreview.png`;
const SALES_AGENTS_VIDEO_ID = "XPmV6iFo3Hk";

const EMPLOYEE_DUTIES = [
  "New business processing",
  "Claims and underwriting",
  "Internal wholesale marketing",
  "Corporate communications, administration, operations, accounting, legal and compliance, human resources, call center and IT",
] as const;

const EMPLOYEE_PERKS = [
  "Health, dental and vision coverage",
  "Retirement planning and 401(k)",
  "No-cost training courses and certifications",
  "Wellness Rewards and resources",
  "Monthly recognition programs for outstanding performance",
  "Seasonal paid volunteer opportunities with AmeriLife-supported nonprofit organizations",
] as const;

const AGENT_BENEFITS = [
  "Assistance with the state insurance exam (for qualified candidates)",
  "New agent and ongoing career development training",
  "High-quality leads and lead distribution platforms",
  "Industry-leading financial analysis sales tools",
  "A culture of promotion from within",
  "Opportunities for weekly incentives, sales bonuses and more",
] as const;

const EMPLOYEE_CAREERS_URL = "https://amerilife.wd5.myworkdayjobs.com/External";
const AGENT_CAREERS_URL = "https://amerilife.avature.net/careers";

export default function JoinOurTeamPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Join Our Team", path: "/join-our-team/" },
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
            items={[{ label: "Home", href: "/" }, { label: "Join Our Team" }]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Join Our Team
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero: Work Where Your Work Matters - 2-col: gray left, image right */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Work Where
            <br />
            Your Work Matters
          </h2>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            As part of the AmeriLife team, you have the ability to positively impact the lives of
            Americans nationwide — every single day. AmeriLife strives to provide a satisfying career
            path, as well as opportunities for professional development and personal growth.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Whether you&apos;re looking for a career as an AmeriLife employee or a contracted agent at
            one of our AmeriLife agency offices, we offer lucrative and exciting options for
            professionals no matter their career stage or ambitions.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="Join AmeriLife team"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* AmeriLife Employees - 2-col: image LEFT, text RIGHT (blue → green gradient, light text) */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 aspect-[1420/1144] w-full overflow-hidden bg-[#002a52] lg:order-1 lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(EMPLOYEES_IMAGE)}
            alt="AmeriLife corporate employees"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div
          className="order-1 flex flex-col justify-center bg-[linear-gradient(105deg,#002a52_0%,#003a74_28%,#0d4a7a_58%,#2d7a72_86%,#67c084_100%)] px-[var(--container-padding-x)] py-12 lg:order-2 lg:min-h-[400px] lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
        >
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            AmeriLife Employees
          </h2>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-white/95">
            Employees at AmeriLife&apos;s corporate headquarters, agency offices and remote locations
            across the country fulfill a variety of important duties, including:
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-white/95">
            {EMPLOYEE_DUTIES.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-white/95">
            At AmeriLife, we strive to create a culture where employees feel heard, cared for and
            connected. We celebrate our successes and offer our full-time employees paid time off to
            volunteer for community and charitable organizations to support their desire to promote
            change and progress in their communities.
          </p>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-white/95">
            Our full-time corporate employees enjoy a number of perks and benefits, such as:
          </p>
          <ul className="mb-8 list-disc space-y-2 pl-6 text-base leading-relaxed text-white/95">
            {EMPLOYEE_PERKS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <a
            href={EMPLOYEE_CAREERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-0 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm transition-colors hover:bg-white/90 hover:text-[var(--color-brand-primary-hover)] no-underline"
          >
            View Employee Openings
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Sales Agents - 2-col: text left, VIDEO right (footer blue, light-text) */}
      <div className="grid min-h-0 w-full grid-cols-1 bg-[var(--color-footer-bg)] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Sales Agents
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-white/95">
            AmeriLife agents are independent contractors who get to be their own boss while helping
            clients choose solutions to protect themselves and their loved ones. AmeriLife is
            committed to the success of its sales force by providing its agents with:
          </p>
          <ul className="mb-8 list-disc space-y-2 pl-6 text-base leading-relaxed text-white/95">
            {AGENT_BENEFITS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <a
            href={AGENT_CAREERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-0 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm transition-colors hover:bg-white/90 hover:text-[var(--color-brand-primary-hover)] no-underline"
          >
            View Agent Openings
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <VideoWithPlaceholder
          previewImage={AGENTS_VIDEO_PREVIEW}
          videoId={SALES_AGENTS_VIDEO_ID}
          videoTitle="AmeriLife Sales Agents"
        />
      </div>

      {/* Learn More About AmeriLife - centered, wider copy */}
      <div className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[min(100%,90rem)] px-[var(--container-padding-x)] text-center">
          <h2 className="mx-auto mb-6 max-w-5xl text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Learn More About AmeriLife
          </h2>
          <p className="mx-auto mb-8 max-w-5xl text-base leading-relaxed text-[var(--color-fg)]">
            For more than 50 years, AmeriLife has lived its values — helping people live longer,
            healthier and more secure lives. As you consider opportunities with AmeriLife, we invite
            you to click below to learn more about our company.
          </p>
          <Link
            href="/about-us/who-we-are/"
            variant="button"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-0 bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
          >
            Read Our Story
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
