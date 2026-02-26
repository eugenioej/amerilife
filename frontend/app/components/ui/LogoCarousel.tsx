"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const LOGO_SIZE = { w: 362, h: 214 };

export interface LogoCarouselLogo {
  src: string;
  alt: string;
}

export function LogoCarousel({ logos }: { logos: ReadonlyArray<LogoCarouselLogo> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = 200;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2 sm:gap-4">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Previous logos"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
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
        className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Company logos carousel"
      >
        <div className="flex items-center gap-6 py-4 snap-x snap-mandatory scroll-smooth">
          {logos.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex h-[100px] min-w-[140px] shrink-0 items-center justify-center rounded-lg bg-white p-3 grayscale opacity-80 transition-opacity hover:grayscale-0 hover:opacity-100 snap-start sm:h-[120px] sm:min-w-[200px] sm:p-4"
            >
              <Image
                src={rewriteUploadsUrl(logo.src)}
                alt={logo.alt}
                width={LOGO_SIZE.w}
                height={LOGO_SIZE.h}
                className="h-full w-auto object-contain"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Next logos"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
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
