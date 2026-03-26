import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = staticPageMetadata(
  "Employees | AmeriLife",
  "When you work for AmeriLife, you're joining a company with a purpose — to help people live longer, healthier and more secure lives. Explore our culture, benefits, and career opportunities.",
  "/our-solutions/employees/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Employees_Hero_1420x1144.png`;
const BANNER_10 = `${UPLOADS}/2021/12/banner-10.png`;
const BANNER_3 = `${UPLOADS}/2021/12/banner-3.png`;
const LIFE_EMPLOYEE_IMAGE = `${UPLOADS}/2022/01/Employees_CorpProHero_a_1420x1144.png`;
const TOTAL_REWARDS_IMAGE = `${UPLOADS}/2021/11/ARC_HeroIMG.png`;

const LIFE_BENEFITS = [
  "Competitive compensation and discretionary bonus programs (for eligible positions)",
  "Market-leading benefits, including major medical, dental, vision, retirement planning and 401(k) plans",
  "Generous paid time off (PTO), including paid maternity benefits",
  "Wellness Rewards and resources",
  "Volunteer opportunities and seasonal events",
] as const;

const TOTAL_REWARDS = [
  { title: "Compensation", description: "Empowering your earning potential" },
  { title: "Wellbeing", description: <>Acknowledging that you work to <em>live</em>, not live to work</> },
  { title: "Benefits", description: "Providing solutions to secure your total health and financial future" },
  { title: "Development", description: "Putting you on a path towards growth and advancement" },
] as const;

const CAREERS_URL = "https://amerilife.wd5.myworkdayjobs.com/External";

export default function EmployeesPage() {
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
              Employees
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Employees
        </h1>
      </FadeInOnView>

      {/* Hero: A Career Built with You in Mind - 2-col: gray left, image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            A Career Built with
            <br />
            You in Mind
          </h2>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            When you work for AmeriLife, you&apos;re joining a company with a purpose — to help people live longer, healthier and more secure lives. It&apos;s that purpose and commitment to service that fuels AmeriLife&apos;s culture and drives us toward the goal of being the best place to work.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife employees in front of company building"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Kiersten Burstiner quote - full-bleed banner with background image, light text */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <blockquote className="mb-6 text-xl leading-relaxed text-white sm:text-2xl">
            AmeriLife&apos;s employees are the heartbeat of the company, and our culture is what makes us stand out from the rest. I&apos;m incredibly proud of our inside-out, &apos;people-first&apos; approach, and it&apos;s a privilege to work with like-minded colleagues who make this job so rewarding.
          </blockquote>
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            Kiersten Burstiner
          </h2>
          <p className="mb-0 text-base font-medium text-white/90">
            Chief Human Resources Officer, AmeriLife
          </p>
        </div>
      </FadeInOnView>

      {/* Life as an AmeriLife Employee - 2-col: image LEFT, text RIGHT (intercalated) */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 aspect-[1420/1144] w-full overflow-hidden lg:order-1 lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(LIFE_EMPLOYEE_IMAGE)}
            alt="AmeriLife employees"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:order-2 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Life as an AmeriLife Employee
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife employees enjoy access to many benefits that provide opportunities for professional development and personal wellbeing and enrichment:
          </p>
          <ul className="list-disc space-y-3 pl-6 text-base leading-relaxed text-[var(--color-fg)]">
            {LIFE_BENEFITS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </FadeInOnView>

      {/* Total Rewards - 2-col: text left, image right */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Total Rewards
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            We believe that your work experience and the company&apos;s performance are inseparable. That&apos;s why AmeriLife&apos;s Total Rewards program was designed to keep you inspired, productive and committed to your career and our collective business goals.
          </p>
          <ul className="mb-10 list-none space-y-4 pl-0">
            {TOTAL_REWARDS.map((item, i) => (
              <li key={i} className="text-base leading-relaxed text-[var(--color-fg)]">
                <strong>{item.title}</strong>: {item.description}
              </li>
            ))}
          </ul>
          <a
            href={CAREERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-cta inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white no-underline"
          >
            View Employee Openings
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f7f8f9] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(TOTAL_REWARDS_IMAGE)}
            alt="AmeriLife workplace"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </FadeInOnView>

      {/* Giving Back to Our Community - lighter bg, dark text */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 text-center lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_3)})` }}
      >
        <div className="absolute inset-0 bg-white/70" aria-hidden />
        <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Giving Back to Our Community
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            A great way to see AmeriLife&apos;s values in action is through the generosity of its employees. In addition to our corporate support of non-profit organizations throughout the country and Greater Tampa Bay area, our employees also receive up to two days of &quot;VTO&quot; (Volunteer Time Off) to donate their time to an organization of their choosing. It&apos;s just one more way we nurture a culture of service at AmeriLife.
          </p>
          <Link
            href="/about-us/community-involvement/"
            variant="button"
            className="motion-cta inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
          >
            Our Community Impact
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeInOnView>
    </article>
  );
}
