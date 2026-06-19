import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { ContributorReadMoreArticles } from "@/app/components/contributors/ContributorReadMore";
import { ContributorBecomeOne } from "@/app/components/contributors/ContributorBecomeOne";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";

import { fetchGraphQL } from "@/lib/wp-client";
import { GET_CONTRIBUTORS, type Contributor } from "@/lib/queries";

import { cache } from "react";

const getContributors = cache(async () => {
  return fetchGraphQL<{ contributors: Contributor[] }>(GET_CONTRIBUTORS);
});

export const metadata: Metadata = staticPageMetadata(
  "Contributor | AmeriLife",
  "Partner with AmeriLife to accelerate growth. Learn about our contributors and how you can become one.",
  "/contributors/"
);

export default async function ContributorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ✅ USE CACHED FETCH
  const data = await getContributors();

  const contributors = data?.contributors ?? [];

  const contributor = contributors.find((c) => c.slug === slug);

  if (!contributor) {
    return <p className="p-10">Contributor not found</p>;
  }

  const fields = contributor.userFields;

  // const socialLinks = [
  //   { label: "Company Website", value: fields?.companyWebsite },
  //   { label: "Website", value: fields?.website },
  //   { label: "LinkedIn", value: fields?.linkedin },
  //   { label: "Facebook", value: fields?.facebook },
  //   { label: "Instagram", value: fields?.instagram },
  //   { label: "X", value: fields?.twitter ? `https://x.com/${fields.twitter}` : undefined },
  //   { label: "YouTube", value: fields?.youtube },
  //   { label: "Pinterest", value: fields?.pinterest },
  //   { label: "SoundCloud", value: fields?.soundcloud },
  //   { label: "Tumblr", value: fields?.tumblr },
  //   { label: "Wikipedia", value: fields?.wikipedia },
  // ];

  // const filteredLinks: { label: string; value: string }[] = socialLinks.filter(
  //   (link): link is { label: string; value: string } =>
  //     typeof link.value === "string" && link.value.length > 0
  // );

  return (
    <article className="py-16">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contributors", path: "/contributors/" },
        ])}
      />

      <div className="mx-auto max-w-5xl bg-white p-8 flex flex-col md:flex-row gap-8">
        {/* IMAGE */}
        <div className="w-full md:w-[300px] flex-shrink-0">
          <Image
            src={fields?.headshot || "/images/default-avatar.png"}
            alt={contributor.name || ""}
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[var(--color-fg)] mb-3">
            {contributor.name}
          </h1>
              
          <p className="text-lg leading-relaxed text-black mt-4 font-semibold">
          {/* NAME */}
          {fields?.linkedin ? (
            <a
              href={fields.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-brand-primary)] font-semibold"
            >
              {contributor.name}
            </a>
          ) : (
            <span>{contributor.name}</span>
          )}{" "}
        
          is the{" "}
        
          {/* JOB TITLE */}
          <span>{fields?.jobTitle || "Contributor"}</span>{" "}
        
          at{" "}
        
          {/* COMPANY */}
          {fields?.company ? (
            fields?.companyWebsite ? (
              <a
                href={fields.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--color-brand-primary)] font-semibold"
              >
                {fields.company}
              </a>
            ) : (
              <span>{fields.company}</span>
            )
          ) : (
            "AmeriLife"
          )}
          , an{" "}
        
          {/* AMERILIFE LINK (unchanged) */}
          <a
            href="https://amerilife.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-brand-primary)] font-semibold"
          >
            AmeriLife
          </a>{" "}
          company.
        </p>

        {/* BIO */}
        {fields?.bio && (
          <div className="mt-2 space-y-4 text-sm leading-relaxed text-black">
            {fields.bio.split("\n").map((paragraph, i) => {
              if (!paragraph.trim()) return null;
            
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
        )}
        
        {/* LINKEDIN IMAGE */}
        {fields?.linkedin && (
          <a
            href={fields.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-10"
          >
            <Image
              src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/06/Linkedin-grey-300x86-1.png"
              alt="LinkedIn"
              width={150}
              height={50}
            />
          </a>
        )}

        </div>
      </div>

      <FadeInOnView direction="up" className="w-full">
        <ContributorReadMoreArticles />
      </FadeInOnView>

      <FadeInOnView direction="up" className="w-full">
        <ContributorBecomeOne />
      </FadeInOnView>
    </article>
  );
}