import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { ContributorReadMoreArticles } from "@/app/components/contributors/ContributorReadMore";
import { ContributorBecomeOne } from "@/app/components/contributors/ContributorBecomeOne";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";

import { fetchGraphQL } from "@/lib/wp-client";
import { GET_CONTRIBUTORS, type Contributor } from "@/lib/queries";

// ✅ ADD THIS
import { cache } from "react";

// ✅ ADD THIS (dedupes requests)
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
        <div className="w-full md:w-[260px] flex-shrink-0">
          <Image
            src={fields?.headshot || "/images/default-avatar.png"}
            alt={contributor.name || ""}
            width={260}
            height={260}
            className="rounded-lg object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[var(--color-fg)] mb-3">
            {contributor.name}
          </h1>

          <p className="text-lg leading-relaxed text-black mt-4">
            <span className="underline">{contributor.name}</span>{" "}
            is the{" "}
            <span className="underline">
              {fields?.jobTitle || "Contributor"}
            </span>{" "}
            at{" "}
            {fields?.company ? (
              <span className="underline">{fields.company}</span>
            ) : (
              "AmeriLife"
            )}
            , an{" "}
            <a
              href="https://amerilife.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-brand-primary)]"
            >
              AmeriLife
            </a>{" "}
            company.
          </p>

          {/* LinkedIn */}
          {fields?.linkedin && (
            <a
              href={fields.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-brand-primary)] font-medium mt-4"
            >
              LinkedIn
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