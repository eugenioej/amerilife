import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { AnnouncementsCarousel } from "@/app/components/blog/AnnouncementsCarousel";
import { AcquisitionPartnerHero } from "@/app/components/acquisition-partner-program/AcquisitionPartnerHero";
import { AcquisitionPartnerApproach } from "@/app/components/acquisition-partner-program/AcquisitionPartnerApproach";
import { AcquisitionPartnerTeam } from "@/app/components/acquisition-partner-program/AcquisitionPartnerTeam";
import { AcquisitionPartnerCulture } from "@/app/components/acquisition-partner-program/AcquisitionPartnerCulture";
import { AcquisitionPartnerForm } from "@/app/components/acquisition-partner-program/AcquisitionPartnerForm";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POSTS, type PostsListItem, type PostsListResult } from "@/lib/queries";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { Star } from "lucide-react";

export const metadata: Metadata = staticPageMetadata(
  "Acquisition Partner Program | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our acquisition partner program, corporate development team, and unique partnership approach.",
  "/acquisition-partner-program/"
);

const ANNOUNCEMENTS_COUNT = 3;

export default async function AcquisitionPartnerProgramPage() {

  let announcements: PostsListItem[] = [];
  try {
    const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
      first: ANNOUNCEMENTS_COUNT,
      after: null,
      categorySlug: "mergers-and-acquisitions",
    });
    announcements = data?.posts?.nodes ?? [];
  } catch {
    announcements = [];
  }

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Solutions", path: "/our-solutions/" },
          {
            name: "Acquisition Partner Program",
            path: "/acquisition-partner-program/",
          },
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
            items={[
              { label: "Home", href: "/" },
              { label: "Our Solutions", href: "/our-solutions/" },
              { label: "Acquisition Partner Program" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Acquisition Partner Program
          </h1>
        </FadeInOnView>
      </div>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerHero />
      </FadeInOnView>

      {announcements.length > 0 ? (
        <FadeInOnView direction="up" className="w-full bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
              Recent AmeriLife Partnership Announcements
            </h2>
            <AnnouncementsCarousel
              posts={announcements}
              seeAllHref="/blog/mergers-and-acquisitions/"
            />
          </div>
        </FadeInOnView>
      ) : null}

      <FadeInOnView direction="up" className="w-full bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
              Learn more about{" "}
              <span className="text-[var(--color-brand-primary)]">
                partnering with AmeriLife
              </span>
            </h2>

            <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
              Complete the form below and a member of our Corporate Development team
              will reach out to you to learn more about your company, your goals and to
              walk through details of our partnership program:
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href="#acquisitionPartnerForm"
                className="group inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1f3a4d] hover:bg-[#1a3140] transition"
              >
                <svg
                  className="w-6 h-6 text-white transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerForm/>
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerApproach />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full bg-white py-10 sm:py-10">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="flex justify-center">
            <Star className="w-8 h-8 text-[var(--color-brand-primary)] fill-[var(--color-brand-primary)] mb-2" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              At AmeriLife, our mission is to provide your agents and advisors with
              the health and wealth solutions they need to deliver peace of mind and
              help their clients live longer, healthier lives.
            </p>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerTeam />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerCulture />
      </FadeInOnView>
    </article>
  );
}
