"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type Milestone = {
  year: string;
  text: string;
  image?: string;
  linkText?: string;
  extLink?: string;
  textEnd?: string;
};

type Props = {
  milestones: Milestone[];
};

export function MilestonesSlider({ milestones }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getCards = useCallback((): HTMLElement[] => {
    const el = scrollRef.current;
    if (!el) return [];
    return [...el.querySelectorAll<HTMLElement>("[data-milestone-card]")];
  }, []);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    const ro = new ResizeObserver(updateState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateState);
      ro.disconnect();
    };
  }, [updateState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = getCards();
    if (!cards.length) return;

    const containerRect = el.getBoundingClientRect();
    const slop = 8;

    let nextIdx: number;
    if (direction === "right") {
      const found = cards.findIndex(
        (c) => c.getBoundingClientRect().left > containerRect.left + slop
      );
      nextIdx = found === -1 ? cards.length - 1 : found;
    } else {
      nextIdx = 0;
      for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].getBoundingClientRect().left < containerRect.left - slop) {
          nextIdx = i;
          break;
        }
      }
    }

    const targetLeft =
      el.scrollLeft +
      cards[nextIdx].getBoundingClientRect().left -
      containerRect.left;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Cards strip */}
      <div
        ref={scrollRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Our Milestones carousel"
      >
        <div className="flex snap-x snap-mandatory gap-4 sm:gap-6">
          {milestones.map((m, i) => {
            return (
              <article
                key={i}
                data-milestone-card
                className="w-[280px] shrink-0 snap-start flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm sm:w-[320px] lg:w-[340px]"
              >
                <div className="relative aspect-[746/660] w-full shrink-0 overflow-hidden bg-[#ffffff]">
                  {m.image ? (
                    <Image
                      src={rewriteUploadsUrl(m.image)}
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
                  <h4 className="mb-2 text-lg font-bold text-[var(--color-brand-primary)]">
                    {m.year}
                  </h4>
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

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous milestone"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg)] transition-colors hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next milestone"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg)] transition-colors hover:bg-[#f7f8f9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
    </div>
  );
}
