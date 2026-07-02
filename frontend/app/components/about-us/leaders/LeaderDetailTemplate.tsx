import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { LeaderDetail, LeaderListItem } from "@/lib/queries";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { LeadersGrid } from "./LeadersGrid";

type LeaderDetailTemplateProps = {
  leader: LeaderDetail;
  /** All leaders in display order (for grid below; current excluded in grid). */
  allLeaders: LeaderListItem[];
};

export function LeaderDetailTemplate({ leader, allLeaders }: LeaderDetailTemplateProps) {
  const name = leader.title ?? "Leader";
  const jobTitle = leader.leaderFields?.jobTitle ?? "";
  const linkedinUrl = leader.leaderFields?.linkedinUrl ?? "";
  const photoUrl = leader.featuredImage?.node?.sourceUrl;
  const slug = leader.slug ?? "";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const html = leader.content ? rewriteUploadsInHtml(leader.content) : "";

  return (
    <article className="bg-white">
      {/* Breadcrumb */}
      <FadeInOnView direction="fade" threshold={0} className="bg-white py-3 sm:py-5">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <SiteBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About Us" },
              { label: "Our Leaders", href: "/about-us/our-leaders/" },
              { label: name },
            ]}
          />
        </div>
      </FadeInOnView>

      {/* Hero: photo left, name + bio + LinkedIn right (same section) */}
      <FadeInOnView direction="up" className="bg-[var(--color-brand-primary)] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
            <div className="relative mx-auto h-[240px] w-[240px] shrink-0 overflow-hidden rounded-xl bg-[rgba(0,0,0,0.15)] sm:mx-0 sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]">
              {photoUrl ? (
                <Image
                  src={rewriteUploadsUrl(photoUrl)}
                  alt={leader.featuredImage?.node?.altText ?? `${name} — AmeriLife`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 340px"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/60 sm:text-6xl"
                  aria-hidden
                >
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {name}
              </h1>
              {jobTitle ? (
                <p className="mb-5 text-base font-medium text-white/90 sm:text-lg">{jobTitle}</p>
              ) : null}

              {html ? (
                <div
                  className="mb-6 max-w-none text-base leading-relaxed text-white/95 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:decoration-white/70 [&_a:hover]:decoration-white [&_em]:text-white/95 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:text-white [&_li]:mb-1 [&_strong]:text-white [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="mb-6 text-white/80">Bio coming soon.</p>
              )}

              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-cta inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm transition-colors hover:bg-white/95 no-underline"
                  aria-label={`View ${name} on LinkedIn (opens in a new tab)`}
                >
                  view linkedin
                  <ExternalLink size={16} aria-hidden className="shrink-0" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </FadeInOnView>

      {/* More leaders */}
      <FadeInOnView
        direction="up"
        className="border-t border-[#e8ede8] bg-[#F6F8F6] py-12 sm:py-16"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-8 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Our Leaders
          </h2>
          <LeadersGrid leaders={allLeaders} excludeSlug={slug} />
        </div>
      </FadeInOnView>
    </article>
  );
}
