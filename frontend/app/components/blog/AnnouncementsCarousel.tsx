"use client";

import { useState } from "react";
import { Link } from "@/app/components/ui/Link";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import type { PostsListItem } from "@/lib/queries";

const CARDS_PER_PAGE = 3;

type Props = {
  posts: PostsListItem[];
  seeAllHref?: string;
};

export function AnnouncementsCarousel({ posts, seeAllHref = "/blog/announcements/" }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(posts.length / CARDS_PER_PAGE);
  const start = page * CARDS_PER_PAGE;
  const visible = posts.slice(start, start + CARDS_PER_PAGE);
  const hasMore = totalPages > 1;

  const goNext = () => {
    setPage((p) => (p + 1) % totalPages);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        {hasMore && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={goNext}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-opacity hover:opacity-90 sm:h-12 sm:w-12"
              aria-label="Show next 3 announcements"
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
      <div>
        <Link
          href={seeAllHref}
          variant="button"
          className="inline-flex items-center rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
        >
          See all
        </Link>
      </div>
    </div>
  );
}
