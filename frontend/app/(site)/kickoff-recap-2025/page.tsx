import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { KickoffAccordion } from "@/app/components/kickoff-recap/KickoffAccordion";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Kickoff Recap 2025 | AmeriLife",
  "That's a wrap on AmeriLife's 2025 National Kickoff Conference. Thank you to everyone who joined us in Tampa, Florida.",
  "/kickoff-recap-2025/"
);

const IMG = WP_IMAGE_SOURCES.kickoffRecap2025;

const GALLERY_LINKS = {
  wed: { label: "AEP Leadership – Commander's Club Incentive Reception", href: "https://www.caradehartlewis.com/p908512950" },
  thu: { label: "Corporate Development Appreciation Reception", href: "https://www.caradehartlewis.com/p1063051021" },
  fri: [
    { label: "General Photos & Expo Hall", href: "https://www.caradehartlewis.com/p760906138" },
    { label: "Corporate General Session", href: "https://www.caradehartlewis.com/p1019597891" },
    { label: "Celestial Social Reception", href: "https://www.caradehartlewis.com/p284350429" },
  ],
  sat: [
    { label: "Wealth Distribution Sessions", href: "https://www.caradehartlewis.com/p694262609" },
    { label: "Health Distribution Sessions", href: "https://www.caradehartlewis.com/p761929957" },
    { label: "Career Agency Distribution Session", href: "https://www.caradehartlewis.com/p1069872865" },
    { label: "VIP Hall of Fame Reception", href: "https://www.caradehartlewis.com/p860996829" },
    { label: "Health & Wealth Awards Gala", href: "https://www.caradehartlewis.com/p1062464535" },
    { label: "Career Agency Awards Gala", href: "https://www.caradehartlewis.com/p28575898" },
    { label: "After Glow Party", href: "https://www.caradehartlewis.com/p445142575" },
  ],
} as const;

const FRIDAY_PRESENTATIONS = [
  { label: "01/17/2025 Health General Session", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Friday-1.17-Health-General-Session.pdf" },
  { label: "01/17/2025 Wealth General Session", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Friday-1.17-Wealth-General-Session.pdf" },
  { label: "01/17/2025 Career General Session", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Friday-1.17-Career-General-Session-.pdf" },
  { label: "Friday General Session", href: "https://uatamerilife.wpengine.com/wp-content/uploads/2025/02/Friday-General-Session-PW.pdf" },
  { label: "Distribution Leadership Roundtable", href: "https://uatamerilife.wpengine.com/wp-content/uploads/2025/02/Distribution-Leadership-Roundtable-Friday-General-Session-PW.pdf" },
] as const;

const SATURDAY_PRESENTATIONS = [
  { label: "01/18/2025 Wealth General Session", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Wealth-General-Session.pdf" },
  { label: "01/18/2025 Health General Session", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Health-General-Session.pdf" },
  { label: "01/18/2025 Health Sales Breakout", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Health-Sales-Breakout.pdf" },
  { label: "01/18/2025 Health Leaders Breakout", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Health-Leaders-Breakout.pdf" },
  { label: "01/18/2025 Bankers Life", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Bankers-Life.pdf" },
  { label: "01/18/2025 Succession Capital Alliance", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Succession-Capital-Alliance.pdf" },
  { label: "01/18/2025 Expanding Horizons in Corporate Development", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Expanding-Horizons-in-Corporate-Development.pdf" },
  { label: "01/18/2025 Expanding Your Influence", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Expanding-Your-Influence.pdf" },
  { label: "01/18/2025 Exploring New Sales Territories", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Exploring-New-Sales-Territories.pdf" },
  { label: "01/18/2025 Marketing for Recruitment & Retention", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Marketing-for-Recruitment-Retention.pdf" },
  { label: "01/18/2025 Rocketing to Stellar Success", href: "https://amerilife.com/wp-content/uploads/2025/02/PW-Saturday-1.18-Rocketing-to-Stellar-Success.pdf" },
  { label: "Don Yaeger – Keynote Speaker", href: "https://uatamerilife.wpengine.com/wp-content/uploads/2025/02/Don-Yaeger-Keynote-Speaker-Friday-General-Session-PW.pdf" },
] as const;

const INCENTIVE_LINKS = {
  health: [
    { label: "2026 Circle of Excellence, Aspen", href: "https://online.fliphtml5.com/rayey/ktvl/" },
    { label: "Health Best in Class 2025 Qualifications", href: "https://online.fliphtml5.com/rayey/baik/" },
    { label: "Health 2026 Kickoff Qualifications", comingSoon: true },
    { label: "Health Peak Performer Awards", comingSoon: true },
  ],
  wealth: [
    { label: "Wealth Best in Class 2025 Qualifications", comingSoon: true },
    { label: "Wealth 2026 Kickoff Qualifications", href: "https://online.fliphtml5.com/rayey/ntfx/" },
    { label: "Wealth Peak Performer Awards", comingSoon: true },
  ],
  career: [
    { label: "Best in Class 2025 Qualifications", href: "https://online.fliphtml5.com/rayey/ekre/" },
    { label: "Career Agency Incentive Trip – Alaskan Cruise Qualifications", href: "https://online.fliphtml5.com/rayey/ajxa/" },
    { label: "Career 2026 Kickoff Qualifications", href: "https://online.fliphtml5.com/rayey/zvoj/" },
    { label: "Career Peak Performer Awards", comingSoon: true },
  ],
} as const;

export default function KickoffRecap2025Page() {
  return (
    <article className="bg-white">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Kickoff Recap 2025
            </li>
          </ol>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          2025 Kickoff Recap
        </h1>

        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2025/02/Kickoff2025-LandingPage-Header-012825-CG-1-e1738097748658.png"
            alt="2025 National Kickoff Conference"
            width={1750}
            height={400}
            className="h-auto w-full"
            unoptimized
          />
        </div>

        {/* Thank You */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-brand-primary)] sm:text-3xl">
            Thank You!
          </h2>
          <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            That&apos;s a wrap on AmeriLife&apos;s 2025 National Kickoff Conference. Thank you to everyone who
            joined us in Tampa, Florida. We hope you now feel inspired and energized to navigate the
            &quot;Infinite Horizons&quot; into 2025 and beyond.
          </p>
          <p className="text-lg font-semibold text-[var(--color-fg)]">
            <em>Password for Photo Galleries: AmeriLife</em>
          </p>
        </section>

        {/* Section banner: Photo Galleries */}
        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src={rewriteUploadsUrl(IMG.photoGalleriesBanner)}
            alt="Photo Galleries"
            width={1750}
            height={381}
            className="h-auto w-full"
            unoptimized
          />
        </div>

        {/* Day-by-day photo galleries */}
        <section className="mb-16">
          <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">Wednesday, January 15th</h3>
          <ul className="mb-8 space-y-2">
            <li>
              <a
                href={GALLERY_LINKS.wed.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
              >
                {GALLERY_LINKS.wed.label}
              </a>
            </li>
          </ul>

          <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">Thursday, January 16th</h3>
          <ul className="mb-8 space-y-2">
            <li>
              <a
                href={GALLERY_LINKS.thu.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
              >
                {GALLERY_LINKS.thu.label}
              </a>
            </li>
          </ul>

          <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">Friday, January 17th</h3>
          <ul className="mb-6 space-y-2">
            {GALLERY_LINKS.fri.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={rewriteUploadsUrl(IMG.stormTroopersImage)}
              alt="Storm Troopers at Celestial Social Reception"
              width={1024}
              height={684}
              className="w-full max-w-md shrink-0 rounded-lg object-cover sm:max-w-xs"
              unoptimized
            />
            <div>
              <p className="mb-2 text-base leading-relaxed text-[var(--color-fg)]">
                We had some surprise guests at the Celestial Social Reception – two Storm Troopers
                straight from a galaxy far, far away!
              </p>
              <p className="text-base leading-relaxed text-[var(--color-fg)]">
                The 501st Legion is an international costuming organization dedicated to celebrating
                STAR WARS through the creation and use of quality costumes that portray the villainous,
                morally ambiguous, or non-partisan characters from the STAR WARS universe. AmeriLife made
                a $1,000 donation to the Starlight Children&apos;s Foundation in honor of the FL 501st Legion.
              </p>
            </div>
          </div>

          <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">Saturday, January 18th</h3>
          <ul className="space-y-2">
            {GALLERY_LINKS.sat.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Day 1 Recap */}
        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src={rewriteUploadsUrl(IMG.day1RecapBanner)}
            alt="Day 1 Recap"
            width={1750}
            height={381}
            className="h-auto w-full"
            unoptimized
          />
        </div>
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)]">
            Friday, January 17th
          </h2>
          <KickoffAccordion
            items={[
              {
                title: "Health & Wealth Distribution Presentations",
                content: (
                  <>
                    <ul className="space-y-2">
                      {FRIDAY_PRESENTATIONS.slice(0, 2).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
              {
                title: "Career Agency Distribution Presentations",
                content: (
                  <>
                    <ul className="space-y-2">
                      {FRIDAY_PRESENTATIONS.slice(2, 3).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
              {
                title: "Corporate General Session",
                content: (
                  <>
                    <ul className="space-y-2">
                      {FRIDAY_PRESENTATIONS.slice(3).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </section>

        {/* Day 2 Recap */}
        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src={rewriteUploadsUrl(IMG.day2RecapBanner)}
            alt="Day 2 Recap"
            width={1750}
            height={381}
            className="h-auto w-full"
            unoptimized
          />
        </div>
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)]">
            Saturday, January 18th
          </h2>
          <KickoffAccordion
            items={[
              {
                title: "Health & Wealth Distribution Presentations",
                content: (
                  <>
                    <ul className="space-y-2">
                      {SATURDAY_PRESENTATIONS.slice(0, 4).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
              {
                title: "Career Agency Distribution Presentations",
                content: (
                  <>
                    <ul className="space-y-2">
                      {SATURDAY_PRESENTATIONS.slice(4, 6).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
              {
                title: "Choose Your Mission Presentations",
                content: (
                  <>
                    <ul className="space-y-2">
                      {SATURDAY_PRESENTATIONS.slice(6, 11).map((p) => (
                        <li key={p.label}>
                          <Link
                            href={rewriteUploadsUrl(p.href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Password to view these presentations provided to AmeriLife agents and affiliates.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </section>

        {/* Guest Speakers */}
        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src={rewriteUploadsUrl(IMG.guestSpeakersBanner)}
            alt="Guest Speakers"
            width={1750}
            height={381}
            className="h-auto w-full"
            unoptimized
          />
        </div>
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)]">
            <Link
              href="https://donyaeger.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-link)] hover:underline"
            >
              Don Yaeger – Keynote Speaker
            </Link>
          </h2>
          <p className="mb-4 text-[var(--color-fg)]">
            Following his speech, Don Yaeger sold his book &apos;Greatness&apos; for a $5 donation to the AmeriLife Gives Back Foundation. We raised over $2,600 in donations, thanks to all who donated! For more information on the AmeriLife Gives Back Foundation or to donate, click{" "}
            <Link href="/givesback" className="text-[var(--color-link)] hover:underline">
              here
            </Link>
            .
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Password to view these presentations provided to AmeriLife agents and affiliates.
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href={rewriteUploadsUrl(SATURDAY_PRESENTATIONS[11].href)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-link)] hover:underline"
              >
                Don Yaeger – Keynote Speaker (PDF)
              </Link>
            </li>
          </ul>
        </section>

        {/* 2025 Incentives */}
        <div className="mb-12 w-full overflow-hidden rounded-lg">
          <Image
            src={rewriteUploadsUrl(IMG.incentivesBanner)}
            alt="2025 Incentives"
            width={1750}
            height={381}
            className="h-auto w-full"
            unoptimized
          />
        </div>
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-[var(--color-fg)]">
            Check out the ideaXchange each month for current incentives and standings!
          </h2>
          <KickoffAccordion
            items={[
              {
                title: "Health Distribution",
                content: (
                  <ul className="space-y-2 text-[var(--color-fg)]">
                    {INCENTIVE_LINKS.health.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-[var(--color-muted)]">
                                Please note, the {item.label.includes("2026") ? "Health 2026 Kickoff Conference" : "Health Peak Performer"} poster is coming soon
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Wealth Distribution",
                content: (
                  <ul className="space-y-2 text-[var(--color-fg)]">
                    {INCENTIVE_LINKS.wealth.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-[var(--color-muted)]">
                                Please note, the {item.label.includes("2025") ? "Wealth 2025 Best in Class" : "Wealth Peak Performer"} poster is coming soon
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Career Agency",
                content: (
                  <ul className="space-y-2 text-[var(--color-fg)]">
                    {INCENTIVE_LINKS.career.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-link)] hover:underline"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-[var(--color-muted)]">
                                Please note, the Career Peak Performer poster is coming soon
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </section>

      </div>
    </article>
  );
}
