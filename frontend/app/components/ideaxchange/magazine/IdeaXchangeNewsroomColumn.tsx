"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  ideaxchangeFeaturedImageSrc,
} from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { IdeaXchangeTopicBadge } from "./IdeaXchangeTopicBadge";
import {
  formatInsightExcerptPlain,
  formatBylineDate,
  ideaxchangeArticleHref,
  INSIGHT_IMG_QUALITY,
} from "./ideaxchange-utils";

type Props = {
  initialPosts: IdeaxchangeListItem[];
  /** Remaining posts from the same GraphQL page as initialPosts — appended on first “Load more” without an extra request. */
  deferredBatchPosts: IdeaxchangeListItem[];
  /** Cursor after the initial magazine GraphQL page — load more continues chronologically after it. */
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
  /** When set, “Load more” requests the next page of this topic only. */
  topicSlug?: string;
  /** When set, “Load more” requests the next page of magazine posts with this tag (e.g. sales). */
  tagSlug?: string;
  /**
   * Fallback badge when the post has no topic (e.g. RECRUIT / SALES on pillar pages).
   * Real topics always win and link to the category archive.
   */
  badgeLabel?: string;
  /** Href for `badgeLabel` when there is no topic (e.g. pillar hub path). */
  badgeHref?: string;
  /** Base path for article singles (e.g. /ideaxchange/sales-success/). Defaults to magazine. */
  articleBasePath?: string;
  /** When false, hides infinite “Load more” (e.g. category archives use numbered pages). Default true. */
  enableLoadMore?: boolean;
  /**
   * After the user clicks “Load more” once, show a link into numbered pagination
   * (e.g. `/ideaxchange/home/?page=2`).
   */
  paginationHref?: string;
};

function articleHrefForBase(
  post: IdeaxchangeListItem,
  articleBasePath?: string,
): string {
  if (!articleBasePath) {
    return ideaxchangeArticleHref(post);
  }
  const base = articleBasePath.replace(/\/+$/, "");
  const slug = post.slug?.trim();
  if (!slug) {
    return `${base}/`;
  }
  return `${base}/${slug}/`;
}

const browseByPageBtnClass =
  "motion-cta inline-flex cursor-pointer items-center justify-center rounded-[var(--radius-full)] border-2 border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 no-underline hover:no-underline";

export function IdeaXchangeNewsroomColumn({
  initialPosts,
  deferredBatchPosts,
  initialEndCursor,
  initialHasNextPage,
  topicSlug,
  tagSlug,
  badgeLabel,
  badgeHref,
  articleBasePath,
  enableLoadMore = true,
  paginationHref,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deferredRest, setDeferredRest] = useState(deferredBatchPosts);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Numbered category pages navigate client-side; reset local list when the server feed changes.
  useEffect(() => {
    if (enableLoadMore) return;
    setPosts(initialPosts);
    setDeferredRest(deferredBatchPosts);
    setEndCursor(initialEndCursor);
    setHasNextPage(initialHasNextPage);
    setLoading(false);
    setError(null);
  }, [
    enableLoadMore,
    initialPosts,
    deferredBatchPosts,
    initialEndCursor,
    initialHasNextPage,
  ]);

  const loadMore = useCallback(async () => {
    if (!enableLoadMore) return;

    if (loading) return;

    if (deferredRest.length > 0) {
      setPosts((prev) => [...prev, ...deferredRest]);
      setDeferredRest([]);
      setHasLoadedMore(true);
      return;
    }

    if (!endCursor) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideaxchange/load-more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          after: endCursor,
          ...(topicSlug ? { topicSlug } : {}),
          ...(tagSlug ? { tagSlug } : {}),
        }),
      });
      const json = (await res.json()) as {
        nodes?: IdeaxchangeListItem[];
        pageInfo?: {
          hasNextPage?: boolean;
          endCursor?: string | null;
        };
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || res.statusText);
      }

      const nextNodes = json.nodes ?? [];
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const appended = nextNodes.filter((n) => n.id && !seen.has(n.id));
        return [...prev, ...appended];
      });

      const pi = json.pageInfo;
      setHasNextPage(pi?.hasNextPage ?? false);
      setEndCursor(pi?.endCursor ?? null);
      setHasLoadedMore(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more.");
    } finally {
      setLoading(false);
    }
  }, [deferredRest, endCursor, enableLoadMore, loading, tagSlug, topicSlug]);

  const showLoadMore =
    enableLoadMore &&
    (deferredRest.length > 0 || (hasNextPage && Boolean(endCursor)));

  const showBrowseByPage =
    Boolean(paginationHref) && hasLoadedMore && enableLoadMore;

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => {
        const img = ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl);
        const href = articleHrefForBase(post, articleBasePath);
        return (
          <article
            key={post.id}
            className="flex flex-col gap-4 border-b border-[var(--color-border)] py-8 first:pt-0 last:border-b-0 sm:flex-row sm:gap-6"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--color-border)]/30 sm:w-[220px] md:w-[260px]">
              <Link
                href={href}
                variant="button"
                className="absolute inset-0 block"
              >
                <Image
                  src={rewriteUploadsUrl(img)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 220px, 520px"
                  quality={INSIGHT_IMG_QUALITY}
                  priority={index < 2}
                />
              </Link>
              <IdeaXchangeTopicBadge
                post={post}
                className="pointer-events-auto absolute bottom-2 left-2 z-[1] bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                label={badgeLabel}
                fallbackHref={badgeHref}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-snug text-[var(--color-fg)] md:text-xl">
                <Link
                  href={href}
                  variant="button"
                  className="hover:text-[var(--color-brand-primary)]"
                >
                  {post.title}
                </Link>
              </h3>
              {post.date ? (
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {formatBylineDate(post.date)}
                </p>
              ) : null}
              <div className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
                {formatInsightExcerptPlain(post.excerpt) ||
                  "Read the full article for more."}
              </div>
            </div>
          </article>
        );
      })}

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {showLoadMore || showBrowseByPage ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {showLoadMore ? (
            <Button
              type="button"
              variant="secondary"
              onClick={loadMore}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Loading…" : "Load more"}
            </Button>
          ) : null}
          {showBrowseByPage && paginationHref ? (
            <Link href={paginationHref} variant="button" className={browseByPageBtnClass}>
              Browse by page
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
