import Image from "next/image";
import NextLink from "next/link";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
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
      className="flex h-full w-full max-w-[275px] items-stretch max-[550px]:max-w-[92%]"
    >
      <NextLink
        href={href}
        className="group relative flex h-full w-full flex-col bg-white text-left no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#3FA590] focus-visible:ring-offset-2 max-[550px]:h-[160px] max-[550px]:max-w-full max-[550px]:flex-row max-[550px]:flex-wrap"
        aria-label={`${name}, read bio`}
      >
        <div className="relative h-[275px] w-full shrink-0 overflow-hidden bg-[#ccc] max-[550px]:h-full max-[550px]:w-[143px]">
          {photoUrl ? (
            <Image
              src={rewriteUploadsUrl(photoUrl)}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 550px) 143px, 275px"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-[#ccc] text-4xl font-bold text-[#244260]/50"
              aria-hidden
            >
              {initials}
            </div>
          )}
        </div>

        <div className="relative z-[1] min-h-0 flex-1 px-5 pb-[75px] pt-9 max-[550px]:w-[calc(100%-143px)] max-[550px]:px-6 max-[550px]:pb-6 max-[550px]:pt-[30px]">
          <h3 className="mb-2.5 line-clamp-2 text-xl font-bold capitalize leading-tight text-[#244260] max-[550px]:line-clamp-1 max-[550px]:text-[22px]">
            {name}
          </h3>
          {jobTitle ? (
            <p className="line-clamp-3 text-base font-normal leading-normal text-[#244260] max-[550px]:line-clamp-1">
              {jobTitle}
            </p>
          ) : null}
        </div>

        <span
          className="absolute bottom-[25px] left-5 z-[2] text-lg font-bold uppercase leading-7 tracking-[0.06em] text-[#3FA590] transition-colors duration-200 max-[550px]:left-[26px] group-hover:text-[#008066]"
          aria-hidden
        >
          Read Bio
        </span>
      </NextLink>
    </FadeInOnView>
  );
}
