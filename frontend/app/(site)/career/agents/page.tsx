import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = staticPageMetadata(
  "Career Agents | AmeriLife",
  "Your career starts here. Do you have an outgoing personality and entrepreneurial spirit? AmeriLife provides leads, training, and support to help career agents excel.",
  "/career/agents/"
);

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
const GREY_GEO_BG = `${UPLOADS}/2017/09/greygeo-banner-1920.png`;

/** Hero — headless WP (Join Our Team hero asset, 1420×1144). */
const HERO_IMAGE =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/01/Join_Our_Team_Hero_1420x1144.png";

const AGENT_LEADS = [
  "Direct mail responders",
  "Seminars",
  "Internet campaigns and social media advertising campaigns",
  "Current clients and orphaned (existing) accounts to service",
  "Community events and organization-affiliated sponsorships",
] as const;

const AGENT_BENEFITS = [
  "Assistance with the state insurance exam (for qualified candidates)",
  "Leads – we provide them to agents via:",
  "New agent training",
  "Ongoing training for career development",
  "Industry-leading financial analysis sales tools and lead distribution platforms",
  "Opportunities for weekly incentives, sales bonuses, and more",
  "A culture of promotion from within – the majority of our sales executives started out as AmeriLife agents!",
] as const;

const GET_STARTED_URL = "https://amerilife.avature.net/careers";
const AGENT_PORTAL_URL = "https://amerilifecareers.com/wp-login.php";
const WHAT_TO_EXPECT_URL = "https://amerilife.com/career/agents/process";

export default function CareerAgentsPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - white background */}
      <div className="bg-white px-[var(--container-padding-x)] py-6">
        <div className="mx-auto max-w-[var(--container-max)]">
          <SiteBreadcrumb
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "AmeriLife Offices", href: "/career/" },
              { label: "Career Agents" },
            ]}
          />
          <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
            Career Agents
          </h1>
        </div>
      </div>

      {/* Hero - full-width image with overlay */}
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[200px] w-full overflow-hidden sm:h-[240px] md:h-[280px] lg:h-[320px]">
          <Image
            src={HERO_IMAGE}
            alt="AmeriLife career agents"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Base scrim + bottom-weighted gradient for headline contrast */}
          <div className="absolute inset-0 bg-black/25" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent sm:from-black/40" aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 p-[var(--container-padding-x)] pb-6 sm:pb-8 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))] lg:pb-8">
            <h2 className="max-w-xl text-2xl font-bold leading-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl lg:text-5xl">
              Your career
              <br />
              starts here!
            </h2>
          </div>
        </div>
      </div>

      {/* Content section - grey geo background */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-16 lg:py-24"
        style={{
          backgroundImage: `url(${rewriteUploadsUrl(GREY_GEO_BG)})`,
          backgroundColor: "#e8e9eb",
        }}
      >
        <div className="absolute inset-0 bg-[#e8e9eb]/95" aria-hidden />
        <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Do you have an outgoing personality, an entrepreneurial spirit and a fierce
            motivation to excel?
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            How about a desire to serve people by assisting them with products that can help
            them live longer and healthier lives?
          </p>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            If so, AmeriLife may be the place for you.
          </p>

          <h3 className="mb-6 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
            A chance to advance
          </h3>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            The AmeriLife leadership team is committed to the success of its sales force. Our
            agents can expect:
          </p>
          <ul className="mb-10 list-disc space-y-2 pl-6 text-base leading-relaxed text-[var(--color-fg)]">
            <li>{AGENT_BENEFITS[0]}</li>
            <li>
              {AGENT_BENEFITS[1]}
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {AGENT_LEADS.map((lead, i) => (
                  <li key={i}>{lead}</li>
                ))}
              </ul>
            </li>
            <li>{AGENT_BENEFITS[2]}</li>
            <li>{AGENT_BENEFITS[3]}</li>
            <li>{AGENT_BENEFITS[4]}</li>
            <li>{AGENT_BENEFITS[5]}</li>
            <li>{AGENT_BENEFITS[6]}</li>
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={WHAT_TO_EXPECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white no-underline"
            >
              What to Expect as an Agent
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={GET_STARTED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
            >
              Click Here to Get Started
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href={AGENT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-fg)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-fg)] hover:text-white no-underline"
            >
              Agent Portal Log In
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <p className="mt-8 max-w-2xl text-sm italic text-[var(--color-muted)]">
            This is for agent use only. Not for use with consumers. Career agents are
            independent contractors. Consult AmeriLife Career Agencies for additional details.
          </p>
          <p className="mt-2">
            <a
              href={AGENT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
            >
              Log in to the agent portal
            </a>
          </p>
        </div>
      </section>

      {/* Agent Updates + Final CTA */}
      <section className="bg-[#f7f8f9] py-16 lg:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] text-center">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]">
            Agent Updates
          </h2>
          <h3 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Get started as an agent with AmeriLife today.
          </h3>
          <a
            href={GET_STARTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
          >
            Click Here to Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="mt-8 max-w-xl mx-auto text-sm italic text-[var(--color-muted)]">
            This is for agent use only. Not for use with consumers. Career agents are
            independent contractors. Consult AmeriLife Career Agencies for additional details.
          </p>
          <p className="mt-2">
            <a
              href={AGENT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
            >
              Log in to the agent portal
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
