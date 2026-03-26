import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = staticPageMetadata(
  "Consumers | AmeriLife",
  "Helping you live a longer, healthier life. AmeriLife offers life and health insurance, annuities, Medicare solutions, and retirement planning from leading carriers — customized for your needs.",
  "/our-solutions/consumers/"
);

/** Canonical paths; rewriteUploadsUrl() serves from headless WP when NEXT_PUBLIC_USE_LIVE_IMAGES is not "1". */
const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Consumers_Hero_1420x1144.png`;
const BANNER_10 = `${UPLOADS}/2021/12/banner-10.png`;
const BANNER_3 = `${UPLOADS}/2021/12/banner-3.png`;

const PRODUCT_CATEGORIES = [
  {
    title: "Medicare",
    items: [
      {
        title: "Medicare Advantage Plans",
        description:
          "Medicare Advantage Plans, also known as Part C or \"MA\" plans, are typically HMOs that provide more robust coverage — including services outside of traditional service areas — that traditional Medicare doesn't cover.",
      },
      {
        title: "Medicare Supplement Plans",
        description:
          "Commonly referred to as \"Medigap\" plans, Medicare Supplement Plans help pay for Medicare Part A or Part B expenses not covered by traditional Medicare.",
      },
      {
        title: "Medicare Part D Prescription Drug Plans",
        description:
          "Part D is Medicare drug coverage that helps cover the costs of prescription drugs, and in some cases, lower or protect against higher costs.",
      },
    ],
  },
  {
    title: "Annuities",
    items: [
      {
        title: "Fixed Indexed Annuities",
        description:
          "Fixed indexed annuities are fixed annuities that are typically tied to a stock market index and guarantee fixed payments over time.",
      },
      {
        title: "Deferred Annuities",
        description:
          "Deferred annuities, which are typically purchased to supplement retirement income, offer tax-advantaged growth and savings with the ability to receive income payments guaranteed for life, if desired.",
      },
    ],
  },
  {
    title: "Life Insurance",
    items: [
      {
        title: "Whole Life Insurance",
        description:
          "Commonly referred to as ordinary life insurance, whole life insurance accrues cash value tax-deferred while it grows. Unlike term life insurance, whole life insurance does not have an expiration date.",
      },
      {
        title: "Term Life Insurance",
        description:
          "The most affordable form of life insurance, term life insurance provides coverage for a specific period of time. Unlike whole life insurance, term life insurance does not build cash value or pay a death benefit once the policy term has expired.",
      },
      {
        title: "Indexed Universal Life Insurance",
        description:
          "Indexed Universal Life Insurance has both whole life and savings elements. It is intended to ease the financial burden on families by serving as a financial safety net.",
      },
    ],
  },
  {
    title: "Voluntary Health Insurance",
    items: [
      {
        title: "Major Medical Coverage",
        description:
          "Traditional health insurance plans for individuals and families, with or without a workplace or group insurance option.",
      },
      {
        title: "Dental Coverage",
        description:
          "Coverage for annual exams and cleanings, with options to include additional coverage for services such as orthodontics.",
      },
      {
        title: "Vision Coverage",
        description:
          "Coverage for annual exams, prescription glasses and contacts, cataract surgery, and discounts on services such as LASIK vision correction.",
      },
      {
        title: "Hearing Coverage",
        description:
          "Coverage for exams, evaluations and treatments for hearing loss; some plans may offer coverage for hearing aid solutions.",
      },
      {
        title: "Hospital Indemnity Coverage",
        description:
          "Coverage for select costs incurred during a hospital stay or following an accident typically not covered by traditional health insurance.",
      },
      {
        title: "Critical Illness Coverage",
        description:
          "Critical illness coverage supplements a traditional health insurance plan by paying a lump sum benefit in the event of a covered illness. It may also cover clinical trials, transportation expenses, mortgage or rent payments, and other unexpected costs.",
      },
      {
        title: "Cancer Coverage",
        description:
          "Coverage for select costs associated with cancer care not typically covered by traditional health insurance.",
      },
    ],
  },
  {
    title: "Care Coverage",
    items: [
      {
        title: "Short-Term Care Coverage",
        description:
          "Short-term care coverage typically covers home care, assisted living, and nursing home care for up to 12 months.",
      },
      {
        title: "Long-Term Care Coverage",
        description:
          "Similar to short-term care, long-term care or LTC provides a broad and longer range of care for daily living, and often pays for services not covered by Medicare or traditional health insurance.",
      },
    ],
  },
] as const;

export default function ConsumersPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained */}
      <FadeInOnView
        direction="fade"
        threshold={0}
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24"
      >
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/our-solutions/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Our Solutions
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Consumers
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Consumers
        </h1>
      </FadeInOnView>

      {/* Hero: Helping You Live a Longer, Healthier Life - 2-col: gray left, image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Helping You Live a
            <br />
            Longer, Healthier Life
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            For more than 50 years, AmeriLife has helped people prepare for some of life&apos;s most
            important moments — from marriage to welcoming children (and grandchildren) to retirement
            and legacy planning.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            We don&apos;t just offer life and health insurance, annuities and retirement planning
            solutions — we deliver peace of mind and the opportunity to secure your legacy and the
            future of your loved ones. When you connect with AmeriLife, you gain a partner that will
            listen to you, help you explore your options, and create a plan to meet your current and
            future needs, no matter the life you dare to imagine.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife consumers - family and financial wellness"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Mike Vietri quote - banner with background image */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <blockquote className="mb-6 text-xl leading-relaxed text-white sm:text-2xl">
            Customers today shouldn&apos;t simply be sold to. We believe that it&apos;s our mission to
            be honest and trusted advisors to our clients; to educate them, be a resource for them,
            and an advocate for their unique needs.
          </blockquote>
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            Mike Vietri
          </h2>
          <p className="mb-0 text-base font-medium text-white/90">
            Executive Vice President, Distribution
          </p>
        </div>
      </FadeInOnView>

      {/* Products with Your Total Financial Wellness In Mind */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-6 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Products with Your Total Financial Wellness In Mind
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife offers a wealth of financial solutions from leading carriers to fit every
            budget. Solutions are customized for your needs and easy to obtain — from application to
            policy issue to leveraging their benefits when you need them most.
          </p>

          {/* Product categories - desktop: multi-column grid */}
          <div className="space-y-12">
            {PRODUCT_CATEGORIES.map((category, catIndex) => (
              <FadeInOnView
                key={catIndex}
                direction="up"
                delay={catIndex * 80}
                className="block"
              >
                <section>
                  <h3 className="mb-8 text-xl font-bold text-[var(--color-brand-primary)] sm:text-2xl">
                    {category.title}
                  </h3>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item, itemIndex) => (
                      <FadeInOnView
                        key={itemIndex}
                        direction="up"
                        delay={itemIndex * 40}
                        className="flex flex-col rounded-lg bg-[#e2e5ed] p-6 sm:p-8"
                      >
                        <h4 className="mb-4 text-lg font-bold text-[var(--color-fg)]">
                          {item.title}
                        </h4>
                        <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                          {item.description}
                        </p>
                      </FadeInOnView>
                    ))}
                  </div>
                </section>
              </FadeInOnView>
            ))}
          </div>
        </div>
      </div>

      {/* Connect with an Agent - CTA */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_3)})` }}
      >
        <div className="absolute inset-0 bg-white/70" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Connect with an Agent
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            Ready to explore your options and get on the path to a healthier and more financially
            secure future? Contact us today and a licensed agent will be in touch to help you get
            started.
          </p>
          <Link
            href="/connect/"
            variant="button"
            className="motion-cta inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
          >
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeInOnView>
    </article>
  );
}
