"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type Milestone = {
  year: string;
  text: string;
  linkText?: string;
  extLink?: string;
  textEnd?: string;
};

type Props = {
  milestones: Milestone[];
  images: Record<string, string>;
};

export function MilestonesSlider({ milestones, images }: Props) {
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
    const cardWidth = el.querySelector("[data-milestone-card]")?.getBoundingClientRect().width ?? 320;
    const gap = 24;
    const step = cardWidth + gap;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-stretch gap-4 sm:gap-6">
      {/* Nav arrows - left side, stacked vertically, same height as cards */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous milestones"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg)] transition-colors hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next milestones"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg)] transition-colors hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Cards slider */}
      <div
        ref={scrollRef}
        className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Our Milestones carousel"
      >
        <div className="flex snap-x snap-mandatory gap-6 py-2 pb-4 scroll-smooth">
          {milestones.map((m, i) => {
            const imgSrc = images[m.year];
            return (
              <article
                key={i}
                data-milestone-card
                className="flex min-w-[280px] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm sm:min-w-[320px] lg:min-w-[340px]"
              >
                <div className="relative aspect-[746/660] w-full shrink-0 overflow-hidden bg-[#e2e5ed]">
                  {imgSrc ? (
                    <Image
                      src={rewriteUploadsUrl(imgSrc)}
                      alt={`AmeriLife ${m.year}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, 360px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-4xl font-bold text-[var(--color-brand-primary)] opacity-60">
                        {m.year}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h4 className="mb-2 text-lg font-bold text-[var(--color-brand-primary)]">{m.year}</h4>
                  <p className="text-sm leading-relaxed text-[var(--color-fg)]">
                    {m.extLink && m.linkText ? (
                      <>
                        {m.text}
                        <Link
                          href={m.extLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
                        >
                          {m.linkText}
                        </Link>
                        {m.textEnd ?? ""}
                      </>
                    ) : (
                      m.text
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
