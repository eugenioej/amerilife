import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import type { LeaderListItem } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type LeaderCardProps = {
  leader: LeaderListItem;
  /** Index for staggered scroll reveal in grids. */
  revealIndex?: number;
};

export function LeaderCard({ leader, revealIndex = 0 }: LeaderCardProps) {
  const name = leader.title ?? "Leader";
  const jobTitle = leader.leaderFields?.jobTitle ?? "";
  const photoUrl = leader.featuredImage?.node?.sourceUrl;
  const slug = leader.slug;
  const href = slug ? `/about-us/our-leaders/${slug}/` : "/about-us/our-leaders/";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <FadeInOnView
      direction="up"
      delay={revealIndex * 100}
      className="flex h-full w-full items-stretch"
    >
      <article className="flex h-full w-full flex-col items-center rounded-lg border border-[var(--color-border)] bg-white p-6 text-center sm:p-8">
      <div className="relative mb-6 aspect-square w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl bg-[#f7f8f9] sm:max-w-[300px]">
        {photoUrl ? (
          <Image
            src={rewriteUploadsUrl(photoUrl)}
            alt={leader.featuredImage?.node?.altText ?? `${name} — AmeriLife leader`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#e8e9eb] text-4xl font-bold text-[var(--color-muted)]"
            aria-hidden
          >
            {initials}
          </div>
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold text-[var(--color-fg)]">{name}</h3>
      {jobTitle ? (
        <p className="mb-6 text-sm leading-relaxed text-[var(--color-muted)]">{jobTitle}</p>
      ) : (
        <div className="mb-6" />
      )}
      <Link
        href={href}
        variant="button"
        className="motion-cta inline-flex items-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
      >
        Read Bio
      </Link>
      </article>
    </FadeInOnView>
  );
}
