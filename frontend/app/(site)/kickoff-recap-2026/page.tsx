import type { Metadata } from "next";

import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import Link from "next/link";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

import { KickoffAccordion } from "@/app/components/kickoff-recap-2026/KickoffAccordion";
import { KickoffSectionBanner } from "@/app/components/kickoff-recap-2026/KickoffSectionBanner";
import { KickoffVideo } from "@/app/components/kickoff-recap-2026/KickoffVideo";
import { KickoffHero } from "@/app/components/kickoff-recap-2026/KickoffHero";
import { PasswordGate } from "@/app/components/kickoff-recap-2026/PasswordGate";
import { KickoffFooter } from "@/app/components/kickoff-recap-2026/KickoffFooter";

export const metadata: Metadata = staticPageMetadata(
  "Kickoff Recap 2026 | AmeriLife",
  "Recap highlights, resources, videos, galleries, and incentive information from AmeriLife's 2026 Kickoff Conference.",
  "/kickoff-recap-2026/"
);

export default function KickoffRecapPage() {
  return (
    <PasswordGate>
    <article>
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Kickoff Recap 2026", path: "/kickoff-recap-2026/" },
        ])}
      />

      <KickoffHero />

      <section className="mx-auto max-w-[1000px] px-6 py-16">
        <FadeInOnView direction="up">
          <h2 className="mb-6 text-center text-5xl font-semibold text-[#244260]">
            Thank You!
          </h2>

          <p className="mx-auto mb-16 max-w-4xl text-center text-lg">
            That&apos;s a wrap on AmeriLife&apos;s 2026 National Kickoff Conference.
            Thank you to everyone who joined us in Tampa, Florida. We hope
            you now feel inspired and energized to navigate what 2026 has
            in store.
          </p>

          <KickoffSectionBanner title="Photo Galleries" />

          <div className="mb-10 text-center">
            <p className="italic">
              Password for Photo Galleries (password is case-sensitive):
              AmeriLife
            </p>
          </div>

          <div className="mb-10 grid gap-12">
            <div className="text-center">
              <h3 className="mb-4 text-xl font-bold text-[#244260]">
                Friday, January 23rd
              </h3>

              <ul className="space-y-1 text-md">
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"

                    href="https://urldefense.com/v3/__https:/www.caradehartlewis.com/p264101596__;!!BgIKVS048w!t4aTcKb4csuiOhVJgzXcFetocuZEirupiiVo5dkWIJVDUqMQEI8P16jV0u8QgF--dZFPf7Pr2TO0azEc$"

                    className="text-[#4a6382] underline"
                  >
                    General Photos &amp; Expo Hall
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://adobe.ly/4rDz2ym"
                    className="text-[#4a6382] underline"
                  >
                    Trailblazers Craft Dinner Cruise
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p394109001"
                    className="text-[#4a6382] underline"
                  >
                    Corporate General Session
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://adobe.ly/4qw6C8w"
                    className="text-[#4a6382] underline"
                  >
                    Wealth Distribution Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p437738799"
                    className="text-[#4a6382] underline"
                  >
                    Health Distribution Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p747323461"
                    className="text-[#4a6382] underline"
                  >
                    Health Distribution Sessions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-xl font-bold text-[#244260]">
                Saturday, January 24th
              </h3>

              <ul className="space-y-1 text-md">
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p302939856"
                    className="text-[#4a6382] underline"
                  >
                    Corporate General Session
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p439577265"
                    className="text-[#4a6382] underline"
                  >
                    Wealth Distribution Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p111881723"
                    className="text-[#4a6382] underline"
                  >
                    Health Distribution Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p139001855"
                    className="text-[#4a6382] underline"
                  >
                    Career Agency Distribution Session
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://urldefense.com/v3/__https:/www.caradehartlewis.com/p435305056__;!!BgIKVS048w!t4aTcKb4csuiOhVJgzXcFetocuZEirupiiVo5dkWIJVDUqMQEI8P16jV0u8QgF--dZFPf7Pr2Tg5s9en$"
                    className="text-[#4a6382] underline"
                  >
                    VIP Hall of Fame Reception
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p417447751"
                    className="text-[#4a6382] underline"
                  >
                    Health & Wealth Emerald Escape Awards Gala
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https:/www.caradehartlewis.com/p31701189__;!!BgIKVS048w!vLSmdvXiphd8eodk_ofOLVnv-5D4YS_kmjRCzZrMbilYJbED0JnAcwXo1dLoVRZgPFlx7uC89zLsweCH$"
                    className="text-[#4a6382] underline"
                  >
                    Career Agency Emerald Escape Awards Gala
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.caradehartlewis.com/p518195667"
                    className="text-[#4a6382] underline"
                  >
                    Enchanted Afterglow Party
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-10 grid gap-10 md:grid-cols-2">
            <div>
              <KickoffSectionBanner title="Day 1 Recap" />

              <KickoffAccordion title="Health & Wealth Distribution Presentations">
                <div className="text-center">
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/2026-Kickoff-Conference-Friday-Health-General-Session1-1.pdf"
                      >
                        Health General Session
                      </Link>
                    </div>

                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/2026-Kickoff-Conference-Friday-Wealth-General-Session-1.pdf"
                        className="font-semibold text-[#244260] underline"
                      >
                        Wealth General Session
                      </Link>
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-medium text-black">
                    Password to view these presentations provided to AmeriLife agents and
                    affiliates.
                  </p>
                </div>
              </KickoffAccordion>

              <KickoffAccordion title="Career Agency Distribution Presentations">
                <div className="text-center">
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/2026-Kickoff-Conference-Friday-Career-General-Session-protected.pdf"
                      >
                        Career Agency General Session
                      </Link>
                    </div>

                  </div>

                  <p className="mt-6 text-sm font-medium text-black">
                    Password to view these presentations provided to AmeriLife agents and
                    affiliates.
                  </p>
                </div>
              </KickoffAccordion>

              <KickoffAccordion title="Corporate General Session">
                <div className="text-center">
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/Corporate-General-Session-Friday.pdf"
                      >
                        Friday General Session
                      </Link>
                    </div>

                  </div>

                  <p className="mt-6 text-sm font-medium text-black">
                    Password to view these presentations provided to AmeriLife agents and
                    affiliates.
                  </p>
                </div>
              </KickoffAccordion>
            </div>

            <div>
              <KickoffSectionBanner title="Day 2 Recap" />

              <KickoffAccordion title="Health & Wealth Distribution Presentations">
                <div className="text-center">
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/2026-Kickoff-Conference-Saturday-Wealth-General-Session.pdf"
                      >
                        Health General Session
                      </Link>
                    </div>

                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://uatamerilife.wpengine.com/wp-content/uploads/2026/02/2026-Kickoff-Conferece-Saturday-Health-Sales-Breakout-1.pdf"
                        className="font-semibold text-[#244260] underline"
                      >
                        Wealth General Session
                      </Link>
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-medium text-black">
                    Password to view these presentations provided to AmeriLife agents and
                    affiliates.
                  </p>
                </div>
              </KickoffAccordion>

              <KickoffAccordion title="Career Agency Distribution Presentations">
                <div className="text-center">
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="mr-2">01/23/2026</span>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/2026-Kickoff-Conference-Saturday-Career-General-Session-protected-copy.pdf"
                      >
                        Career Agency General Session
                      </Link>
                    </div>

                  </div>

                  <p className="mt-6 text-sm font-medium text-black">
                    Password to view these presentations provided to AmeriLife agents and
                    affiliates.
                  </p>
                </div>
              </KickoffAccordion>

            </div>
          </div>

          <KickoffSectionBanner title="Guest Speakers" />
          <h3 className="mb-4 text-xl font-bold text-[#244260] text-center">Coming soon!</h3>
          <div className="mb-16 text-center">
            <p className="italic">
              Password to view these presentations provided to AmeriLife agents and affiliates.
            </p>
          </div>

          <KickoffSectionBanner title="2026 Incentives" />

          <div className="mt-12">
            <KickoffVideo
              title="AmeriLife | 2026 Best In Class"
              videoId="1159799937"
            />

            <KickoffVideo
              title="AmeriLife | Career Agency Incentive Trip"
              videoId="1159801692"
            />

            <KickoffVideo
              title="AmeriLife | Health | Circle of Excellence"
              videoId="1165367567"
            />
          </div>

          <div className="mt-20">
            <h3 className="mb-8 text-center text-xl font-semibold">
              Check out the IdeaXchange each month for current incentives
              and standings.
            </h3>

            <KickoffAccordion title="Career Agency">
              <div>
                  <div className="space-y-3 text-lg">
                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/BiC2026-Career-102325-CG/"
                      >
                        2026 Best in Class Qualifications
                      </Link>
                    </div>

                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/Vegas26-CareerTrip-Poster-011626-CG/"
                      >
                        Career Agency Incentive Trip Qualifications
                      </Link>
                    </div>

                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/Kickoff27-Poster-021126-CG/"
                      >
                        2027 Career Kickoff Qualifications
                      </Link>
                    </div>
                  </div>

                </div>
            </KickoffAccordion>

            <KickoffAccordion title="Health & Wealth Distribution">
              <div>
                  <div className="space-y-3 text-lg">
                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/BiC2026-Wealth-ComingSoon-011626-CG/"
                      >
                        2026 Best in Class Qualifications – Wealth
                      </Link>
                    </div>

                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/BiC2026-Health-010526-CG/"
                      >
                        2026 Best in Class Qualifications – Health
                      </Link>
                    </div>

                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/CoE26-Poster-011326-CG/"
                      >
                        Circle of Excellence – Health
                      </Link>
                    </div>

                    <div>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#244260] underline"
                        href="https://online.fliphtml5.com/rayey/Kickoff27-Brokerage-Poster-020226-CG/"
                      >
                        2027 Kickoff Qualifications – Health & Wealth
                      </Link>
                    </div>

                  </div>

                </div>
            </KickoffAccordion>
          </div>
        </FadeInOnView>
      </section>
      <KickoffFooter/>
    </article>
    </PasswordGate>
  );
}