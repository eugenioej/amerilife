"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { INSIGHT_IMG_QUALITY } from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { salesSuccessHref } from "./sales-success-utils";

type Props = {
  posts: IdeaxchangeListItem[];
};

export function SalesSuccessFeaturedHero({ posts }: Props) {
  const slides = posts.filter(
    (post) =>
      post.heroLandscapeImage?.sourceUrl &&
      post.heroMobileImage?.sourceUrl,
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) {
    return null;
  }

  function goToPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  }

  function goToNext() {
    setActiveIndex((currentIndex) =>
      currentIndex === slides.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[75vh] w-full overflow-hidden md:min-h-[56vh]">
  <div className="flex min-h-[75vh] w-full transition-transform duration-500 ease-in-out md:min-h-[56vh]" style={{ transform: `translateX(-${activeIndex * 100}% `}}>
        {slides.map((post) => {
          const desktopImg = ideaxchangeFeaturedImageSrc(
            post.heroLandscapeImage?.sourceUrl,
          );

          const mobileImg = ideaxchangeFeaturedImageSrc(
            post.heroMobileImage?.sourceUrl,
          );

          const href = salesSuccessHref(post.slug);
          
            return (
            <div 
              key={post.id ?? post.slug} 
              className="relative min-h-[75vh] w-full shrink-0 md:min-h-[56vh]"
            >
            <Link
              href={href}
              variant="button"
              className="group relative block min-h-[75vh] w-full overflow-hidden md:min-h-[56vh]"
            >
              <Image
                src={rewriteUploadsUrl(mobileImg)}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] md:hidden"
                sizes="100vw"
                quality={INSIGHT_IMG_QUALITY}
                priority
              />

              <Image
                src={rewriteUploadsUrl(desktopImg)}
                alt=""
                fill
                className="hidden object-cover transition-transform duration-500 group-hover:scale-[1.02] md:block"
                sizes="100vw"
                quality={INSIGHT_IMG_QUALITY}
                priority
              />
            </Link>
            </div>
            );
        })}
      </div>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm transition hover:bg-white/20 focus:outline-none"
          >
            <span aria-hidden className="flex h-full w-full items-center justify-center pb-1 text-3xl leading-none">‹</span>
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm transition hover:bg-white/20 focus:outline-none"
          >
            <span aria-hidden className="flex h-full w-full items-center justify-center pb-1 text-3xl leading-none">›</span>
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 cursor-pointer">
            {slides.map((post, index) => (
              <button
                key={post.id ?? post.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
                  index === activeIndex
                    ? "bg-white"
                    : "bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to incentive ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
