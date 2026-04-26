"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef } from "react";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type Props = {
  /** Headless WP upload URLs (passed through `rewriteUploadsUrl` for each slide). */
  imageSrcs: readonly string[];
  /** Short label for screen readers. */
  ariaLabel?: string;
};

const BTN =
  "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12";

const REPEAT = 3;
const EDGE = 24;

function tripleSlides(srcs: readonly string[]) {
  return [...srcs, ...srcs, ...srcs];
}

export function GivesBackPhotoSlideshow({
  imageSrcs,
  ariaLabel = "Community impact photos",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isJumping = useRef(false);
  const canLoop = imageSrcs.length > 1;
  const slides = canLoop ? tripleSlides(imageSrcs) : [...imageSrcs];

  const getSetWidth = useCallback((): number => {
    const track = trackRef.current;
    if (!track || !canLoop) return 0;
    return track.scrollWidth / REPEAT;
  }, [canLoop]);

  const recenter = useCallback(() => {
    const el = scrollRef.current;
    const w = getSetWidth();
    if (!el || w < 1) return;
    isJumping.current = true;
    el.scrollLeft = w;
    requestAnimationFrame(() => {
      isJumping.current = false;
    });
  }, [getSetWidth]);

  useLayoutEffect(() => {
    if (!canLoop) return;
    const el = scrollRef.current;
    if (!el) return;
    if (getSetWidth() < 1) return;
    isJumping.current = true;
    el.scrollLeft = getSetWidth();
    requestAnimationFrame(() => {
      isJumping.current = false;
    });
  }, [canLoop, getSetWidth, imageSrcs.length]);

  useLayoutEffect(() => {
    if (!canLoop) return;
    const track = trackRef.current;
    if (!track) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        recenter();
      }, 100);
    });
    ro.observe(track);
    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, [canLoop, recenter, imageSrcs.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || isJumping.current || !canLoop) return;
    const w = getSetWidth();
    if (w < 1) return;
    const x = el.scrollLeft;
    if (x >= 2 * w - EDGE) {
      isJumping.current = true;
      el.scrollLeft = x - w;
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    } else if (x <= EDGE) {
      isJumping.current = true;
      el.scrollLeft = x + w;
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    }
  };

  const getOneSlideStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const a = track.children[0] as HTMLElement;
    const b = track.children[1] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el || !canLoop) return;
    const step = getOneSlideStep();
    if (step < 1) return;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2 py-2 sm:gap-4 sm:py-3">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canLoop}
        aria-label="Previous photos"
        className={BTN}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] px-1 py-2 sm:px-2 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
      >
        <div
          ref={trackRef}
          className="flex items-stretch gap-3 sm:gap-4 md:gap-5"
        >
          {slides.map((src, i) => {
            const n = imageSrcs.length;
            const photoIndex = (i % n) + 1;
            return (
              <div
                key={`${i}-${String(src).slice(-40)}`}
                className="relative h-[200px] w-[min(100%,400px)] shrink-0 overflow-hidden bg-[#e8eaed] sm:h-[240px] sm:w-[400px]"
              >
                <Image
                  src={rewriteUploadsUrl(src)}
                  alt={`Community event photo ${photoIndex} of ${n}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, 400px"
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canLoop}
        aria-label="Next photos"
        className={BTN}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
