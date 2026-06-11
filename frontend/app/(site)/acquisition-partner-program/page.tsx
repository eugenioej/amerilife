import type { Metadata } from "next";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { AnnouncementsCarousel } from "@/app/components/blog/AnnouncementsCarousel";
import { AcquisitionPartnerHero } from "@/app/components/acquisition-partner-program/AcquisitionPartnerHero";
import { AcquisitionPartnerApproach } from "@/app/components/acquisition-partner-program/AcquisitionPartnerApproach";
import { AcquisitionPartnerTeam } from "@/app/components/acquisition-partner-program/AcquisitionPartnerTeam";
import { AcquisitionPartnerCulture } from "@/app/components/acquisition-partner-program/AcquisitionPartnerCulture";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  CONTACT_US_FORM_ID,
  fetchGravityForm,
} from "@/lib/gf-client";
import { GET_POSTS, type PostsListItem, type PostsListResult } from "@/lib/queries";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Acquisition Partner Program | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our acquisition partner program, corporate development team, and unique partnership approach.",
  "/acquisition-partner-program/"
);

const ANNOUNCEMENTS_COUNT = 3;

export default async function AcquisitionPartnerProgramPage() {
  let contactForm = null;
  try {
    contactForm = await fetchGravityForm(CONTACT_US_FORM_ID);
  } catch {
    contactForm = null;
  }

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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
                Learn more about{" "}
                <span className="text-[var(--color-brand-primary)]">partnering with AmeriLife</span>
              </h2>
              <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
                Complete the form below and a member of our Corporate Development team will reach
                out to you to learn more about your company, your goals and to walk through details
                of our partnership program:
              </p>
              <p className="text-base leading-relaxed text-[var(--color-fg)]">
                At AmeriLife, our mission is to provide your agents and advisors with the health and
                wealth solutions they need to deliver peace of mind and help their clients live
                longer, healthier lives.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-xl font-bold text-[var(--color-fg)]">
                Request an Exploratory Discussion Today!
              </h3>
              {contactForm ? (
                <GravityForm form={contactForm} />
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  The contact form is temporarily unavailable. Please call{" "}
                  <a
                    href="tel:+18004587112"
                    className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                  >
                    (800) 458-7112
                  </a>{" "}
                  or try again later.
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <AcquisitionPartnerApproach />
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
