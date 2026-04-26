import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { KickoffAccordion } from "@/app/components/kickoff-recap/KickoffAccordion";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Kickoff Recap 2025 | AmeriLife",
  "That's a wrap on AmeriLife's 2025 National Kickoff Conference. Thank you to everyone who joined us in Tampa, Florida.",
  "/kickoff-recap-2025/"
);

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

const KICKOFF_CONTENT =
  "mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]";

const KICKOFF_UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2025/02";

/** Headless WP asset URLs (order after hero: galleries → event photo → section banners). */
const KICKOFF_IMAGES = {
  hero: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-Header-012825-CG-1-e1738097748658.png`,
  photoGalleries: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-01-PhotoGalleries-122424-CG.png`,
  eventPhoto: `${KICKOFF_UPLOADS}/0118-1024x684-1.jpg`,
  day1Recap: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-02-Day1Recap-122424-CG-1280x381.png`,
  day2Recap: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-04-Day2Recap-122424-CG.png`,
  guestSpeakers: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-03-GuestSpeakers-122424-CG.png`,
  incentives: `${KICKOFF_UPLOADS}/Kickoff2025-LandingPage-05-2025Incentives-122424-CG.png`,
} as const;

export default function KickoffRecap2025Page() {
  return (
    <article className="bg-white w-full min-w-0 text-center text-black">
      <div className="w-full">
        <Image
          src={rewriteUploadsUrl(KICKOFF_IMAGES.hero)}
          alt="2025 National Kickoff Conference"
          width={1750}
          height={400}
          className="h-auto w-full"
          priority
          unoptimized
        />
      </div>

      <div className={`${KICKOFF_CONTENT} pt-12`}>
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Thank You!</h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed">
            That&apos;s a wrap on AmeriLife&apos;s 2025 National Kickoff Conference. Thank you to everyone who
            joined us in Tampa, Florida. We hope you now feel inspired and energized to navigate the
            &quot;Infinite Horizons&quot; into 2025 and beyond.
          </p>
        </section>
      </div>

      {/* Photo Galleries banner */}
      <div className={`${KICKOFF_CONTENT} mb-12`}>
        <Image
          src={rewriteUploadsUrl(KICKOFF_IMAGES.photoGalleries)}
          alt="Photo Galleries"
          width={1750}
          height={381}
          className="h-auto w-full"
          unoptimized
        />
      </div>

      <div className={KICKOFF_CONTENT}>
        <section className="mb-12">
          <p className="mb-8 text-base font-semibold leading-relaxed">
            Password for Photo Galleries: AmeriLife
          </p>

          <h3 className="mb-4 text-xl font-bold">Wednesday, January 15th</h3>
          <ul className="mb-10 list-none space-y-2 pl-0">
            <li>
              <a
                href={GALLERY_LINKS.wed.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-2 hover:opacity-80"
              >
                {GALLERY_LINKS.wed.label}
              </a>
            </li>
          </ul>

          <h3 className="mb-4 text-xl font-bold">Thursday, January 16th</h3>
          <ul className="mb-10 list-none space-y-2 pl-0">
            <li>
              <a
                href={GALLERY_LINKS.thu.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-2 hover:opacity-80"
              >
                {GALLERY_LINKS.thu.label}
              </a>
            </li>
          </ul>

          <h3 className="mb-4 text-xl font-bold">Friday, January 17th</h3>
          <ul className="mb-8 list-none space-y-4 pl-0">
            {GALLERY_LINKS.fri.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 hover:opacity-80"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed">
            <p>
              We had some surprise guests at the Celestial Social Reception – two Storm Troopers
              straight from a galaxy far, far away!
            </p>
            <p>
              The 501st Legion is an international costuming organization dedicated to celebrating
              STAR WARS through the creation and use of quality costumes that portray the villainous,
              morally ambiguous, or non-partisan characters from the STAR WARS universe. AmeriLife made
              a $1,000 donation to the Starlight Children&apos;s Foundation in honor of the FL 501st Legion.
            </p>
          </div>
        </section>
      </div>

      <div className={`${KICKOFF_CONTENT} mb-12`}>
        <Image
          src={rewriteUploadsUrl(KICKOFF_IMAGES.eventPhoto)}
          alt="2025 National Kickoff Conference"
          width={1024}
          height={684}
          className="h-auto w-full"
          unoptimized
        />
      </div>

      <div className={KICKOFF_CONTENT}>
        <section className="mb-16">
          <h3 className="mb-4 text-xl font-bold">Saturday, January 18th</h3>
          <ul className="list-none space-y-2 pl-0">
            {GALLERY_LINKS.sat.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 hover:opacity-80"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Day 1 & Day 2 Recap — two columns on md+ */}
      <div className={`${KICKOFF_CONTENT} mb-12`}>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-8 lg:gap-10">
          <section>
            <div className="mb-6">
              <Image
                src={rewriteUploadsUrl(KICKOFF_IMAGES.day1Recap)}
                alt="Day 1 Recap"
                width={1280}
                height={381}
                className="h-auto w-full"
                unoptimized
              />
            </div>
            <h3 className="mb-6 text-2xl font-bold text-black">Friday, January 17th</h3>
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
                        Password to view these presentations provided to AmeriLife agents and affiliates.
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </section>

          <section>
            <div className="mb-6">
              <Image
                src={rewriteUploadsUrl(KICKOFF_IMAGES.day2Recap)}
                alt="Day 2 Recap"
                width={1280}
                height={381}
                className="h-auto w-full"
                unoptimized
              />
            </div>
            <h3 className="mb-6 text-2xl font-bold text-black">Saturday, January 18th</h3>
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
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
                              className="text-black underline hover:opacity-80"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-black/75">
                        Password to view these presentations provided to AmeriLife agents and affiliates.
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </section>
        </div>
      </div>

      {/* Guest Speakers */}
      <div className={`${KICKOFF_CONTENT} mb-12`}>
        <Image
          src={rewriteUploadsUrl(KICKOFF_IMAGES.guestSpeakers)}
          alt="Guest Speakers"
          width={1280}
          height={381}
          className="h-auto w-full"
          unoptimized
        />
      </div>
      <div className={KICKOFF_CONTENT}>
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-black">
            <Link
              href="https://donyaeger.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline hover:opacity-80"
            >
              Don Yaeger – Keynote Speaker
            </Link>
          </h2>
          <p className="mx-auto mb-4 max-w-3xl text-black">
            Following his speech, Don Yaeger sold his book &apos;Greatness&apos; for a $5 donation to the AmeriLife Gives Back Foundation. We raised over $2,600 in donations, thanks to all who donated! For more information on the AmeriLife Gives Back Foundation or to donate, click{" "}
            <Link href="/givesback" className="text-black underline hover:opacity-80">
              here
            </Link>
            .
          </p>
          <p className="text-sm text-black/75">
            Password to view these presentations provided to AmeriLife agents and affiliates.
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href={rewriteUploadsUrl(SATURDAY_PRESENTATIONS[11].href)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:opacity-80"
              >
                Don Yaeger – Keynote Speaker (PDF)
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {/* 2025 Incentives */}
      <div className={`${KICKOFF_CONTENT} mb-12`}>
        <Image
          src={rewriteUploadsUrl(KICKOFF_IMAGES.incentives)}
          alt="2025 Incentives"
          width={1280}
          height={381}
          className="h-auto w-full"
          unoptimized
        />
      </div>
      <div className={`${KICKOFF_CONTENT} pb-12`}>
        <section className="mb-16">
          <h2 className="mx-auto mb-6 max-w-3xl text-xl font-semibold text-black">
            Check out the ideaXchange each month for current incentives and standings!
          </h2>
          <KickoffAccordion
            items={[
              {
                title: "Health Distribution",
                content: (
                  <ul className="space-y-2 text-black">
                    {INCENTIVE_LINKS.health.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline hover:opacity-80"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-black/75">
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
                  <ul className="space-y-2 text-black">
                    {INCENTIVE_LINKS.wealth.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline hover:opacity-80"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-black/75">
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
                  <ul className="space-y-2 text-black">
                    {INCENTIVE_LINKS.career.map((item, i) => (
                      <li key={i}>
                        {"href" in item ? (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline hover:opacity-80"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span>
                            <strong>{item.label}</strong>
                            {"comingSoon" in item && (
                              <span className="ml-2 text-sm italic text-black/75">
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

      <footer className="mt-12 w-full bg-black text-white">
        <div className={`${KICKOFF_CONTENT} py-10`}>
          <p className="text-sm leading-relaxed">
            Copyright © {new Date().getFullYear()} AmeriLife Group, LLC. All rights reserved. All materials
            on this page are for INTERNAL USE ONLY.
          </p>
          <p className="mt-4 text-sm">
            <Link href="/terms/" className="text-white underline underline-offset-2 hover:opacity-80">
              Terms of Use
            </Link>
            {" | "}
            <Link href="/privacy-policy/" className="text-white underline underline-offset-2 hover:opacity-80">
              Privacy Statement
            </Link>
          </p>
        </div>
      </footer>
    </article>
  );
}
