import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Expectations When You Join Our Team | AmeriLife",
  "Join #TeamAmeriLife! Offer insurance and retirement solutions to provide peace of mind and help people live longer healthier lives.",
  "/expectations-when-you-join-our-team/"
);

const { icons: ICONS } = WP_IMAGE_SOURCES.expectationsJoinTeam;

const CAREERS_URL = "https://amerilife.avature.net/careers";
const PHONE = "1-888-479-4376";

const BANNER_IMAGE =
  "https://amerilife.com/wp-content/uploads/2020/06/Banner-alt-career-4.5-scaled.jpg";

/** "JOIN OUR TEAM" banner image – links to careers */
const JoinOurTeamHeader = () => (
  <a
    href={CAREERS_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 inline-block no-underline transition-opacity hover:opacity-90"
    aria-label="Join Our Team – view careers"
  >
    <Image
      src={rewriteUploadsUrl(BANNER_IMAGE)}
      alt="Join Our Team"
      width={715}
      height={153}
      className="h-auto w-full max-w-[715px]"
      unoptimized
    />
  </a>
);

const JoinTeamButton = () => (
  <a
    href={CAREERS_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
  >
    Join the Team!
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </a>
);

const SERVICES = [
  {
    title: "Training Support",
    icon: ICONS.training,
    description:
      "Our agent training program – AmeriLife University – begins with a four-day orientation course during which new and experienced agents learn how we do business. It takes place monthly virtually.",
  },
  {
    title: "Agent Support",
    icon: ICONS.agentSupport,
    description:
      "Agents have access to quoting tools and can process client applications, review lead distribution, make appointments, look at product portfolios, check email, and more. Whether you are working from the office or out visiting clients, the important resources you need are at your fingertips.",
  },
  {
    title: "The First 90 Days",
    icon: ICONS.first90,
    description:
      "During your first three months, achieving measurable sales success should be your priority. We will provide the training and tools you need to reach your goals, while you put forth the effort – and demonstrate your leadership potential.",
  },
  {
    title: "Products We Sell",
    icon: ICONS.products,
    description:
      "Having access to such a wide variety of products makes it easier for you to build a solid financial foundation for your clients, and help them achieve a sense of security and the quality of life they deserve.",
  },
] as const;

export default function ExpectationsWhenYouJoinOurTeamPage() {
  return (
    <article className="bg-white">
      {/* Hero: Logo + Phone + JOIN OUR TEAM */}
      <div className="flex flex-col justify-center bg-white px-[var(--container-padding-x)] py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[var(--container-max)]">
          <nav className="mb-6 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--color-fg)]" aria-current="page">
                Expectations When You Join Our Team
              </li>
            </ol>
          </nav>
          {/* Header: Logo + Phone row, then JOIN OUR TEAM */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <Link href="/" variant="button" className="shrink-0" aria-label="AmeriLife Home">
              <Image
                src={rewriteUploadsUrl("https://amerilife.com/wp-content/uploads/2022/01/amerilife.svg")}
                alt="AmeriLife"
                width={140}
                height={40}
                className="h-9 w-auto lg:h-10"
              />
            </Link>
            <a
              href={`tel:+1${PHONE.replace(/-/g, "")}`}
              className="text-base font-semibold text-[#428BCA] no-underline hover:underline sm:text-lg"
            >
              {PHONE}
            </a>
          </div>
          <JoinOurTeamHeader />
        </div>
      </div>

      {/* Content: AmeriLife will help you get off to a strong start + Wide range of products */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16">
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-brand-primary)] sm:text-3xl">
          AmeriLife will help you get off to a strong start.
        </h2>
        <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          It all begins with our recruiting and onboarding team, who will walk you through the
          hiring and orientation process and answer any questions you may have along the way.
        </p>
        <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          From there, Career staff will assist you with contracting, licensing, and fingerprinting
          and technology setup.
        </p>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          Then you will begin the training process.
        </p>
        <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          Once in the field, more experienced AmeriLife agents will guide you during your first 90
          days. You can also look forward to continuing opportunities to learn and expand your
          knowledge base.
        </p>

        <h2 className="mb-6 mt-12 text-2xl font-bold text-[var(--color-brand-primary)] sm:text-3xl">
          Wide range of products
        </h2>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
          With our broad carrier selection and vast distribution network, you will be able to
          provide consumers with insurance products to meet their needs at all stages of their
          lives.
        </p>

        <JoinTeamButton />
      </div>

      {/* Here are some of the services we offer */}
      <div className="border-t border-[var(--color-border)] bg-[#f7f8f9] py-16 lg:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-brand-primary)] sm:text-3xl">
            Here are some of the services we offer:
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ title, icon, description }, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border border-[var(--color-border)] bg-white p-6 shadow-sm"
              >
                <a
                  href={CAREERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 flex flex-col items-center text-center"
                >
                  <Image
                    src={rewriteUploadsUrl(icon)}
                    alt=""
                    width={100}
                    height={100}
                    className="h-20 w-20 object-contain lg:h-24 lg:w-24"
                    unoptimized
                  />
                  <h3 className="mt-4 text-lg font-bold text-[var(--color-fg)]">{title}</h3>
                </a>
                <p className="text-sm leading-relaxed text-[var(--color-fg)]">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <JoinTeamButton />
          </div>
        </div>
      </div>
    </article>
  );
}
