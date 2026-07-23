"use client";

import { useLayoutEffect, useState } from "react";
import { Link } from "@/app/components/ui/Link";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import type { PostsListItem } from "@/lib/queries";

function cardsPerPageForWidth(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

type Props = {
  posts: PostsListItem[];
  seeAllHref?: string;
};

export function AnnouncementsCarousel({ posts, seeAllHref = "/newsroom/announcements/" }: Props) {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useLayoutEffect(() => {
    const apply = () => {
      const cpp = cardsPerPageForWidth(window.innerWidth);
      setCardsPerPage(cpp);
      setPage((p) => {
        const tp = Math.max(1, Math.ceil(posts.length / cpp));
        return Math.min(p, tp - 1);
      });
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [posts.length]);

  const totalPages = Math.max(1, Math.ceil(posts.length / cardsPerPage));
  const start = page * cardsPerPage;
  const visible = posts.slice(start, start + cardsPerPage);
  const hasMore = posts.length > 0 && totalPages > 1;

  const goNext = () => {
    setPage((p) => (p + 1) % totalPages);
  };

  const nextLabel =
    cardsPerPage === 1
      ? "Show next announcement"
      : `Show next ${cardsPerPage} announcements`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        {hasMore && (
          <div className="flex shrink-0 items-center justify-center lg:justify-end">
            <button
              type="button"
              onClick={goNext}
              className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-opacity hover:opacity-90 sm:h-12 sm:w-12"
              aria-label={nextLabel}
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
        )}
      </div>
      <div className="flex justify-center sm:justify-start">
        <Link
          href={seeAllHref}
          variant="button"
          className="inline-flex w-full max-w-xs items-center justify-center rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white sm:w-auto sm:max-w-none"
        >
          See all
        </Link>
      </div>
    </div>
  );
}
