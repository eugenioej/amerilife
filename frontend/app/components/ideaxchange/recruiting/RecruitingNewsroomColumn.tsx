"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Link } from "@/app/components/ui/Link";
import type { CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  caseStudyHref,
  companyLabel,
} from "@/lib/ideaxchange-recruiting-utils";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  INSIGHT_IMG_QUALITY,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";

type Props = {
  initialPosts: CaseStudyListItem[];
  deferredBatchPosts: CaseStudyListItem[];
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
  enableLoadMore?: boolean;
};

export function RecruitingNewsroomColumn({
  initialPosts,
  deferredBatchPosts,
  initialEndCursor,
  initialHasNextPage,
  enableLoadMore = true,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deferredRest, setDeferredRest] = useState(deferredBatchPosts);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!enableLoadMore || loading) return;

    if (deferredRest.length > 0) {
      setPosts((prev) => [...prev, ...deferredRest]);
      setDeferredRest([]);
      return;
    }

    if (!endCursor) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideaxchange/recruiting/load-more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ after: endCursor }),
      });
      const json = (await res.json()) as {
        nodes?: CaseStudyListItem[];
        pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
        error?: string;
      };

      if (!res.ok) throw new Error(json.error || res.statusText);

      const nextNodes = json.nodes ?? [];
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...nextNodes.filter((n) => n.id && !seen.has(n.id))];
      });

      setHasNextPage(json.pageInfo?.hasNextPage ?? false);
      setEndCursor(json.pageInfo?.endCursor ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more.");
    } finally {
      setLoading(false);
    }
  }, [deferredRest, endCursor, enableLoadMore, loading]);

  const showLoadMore =
    enableLoadMore && (deferredRest.length > 0 || (hasNextPage && Boolean(endCursor)));

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => {
        const img = ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl);
        const href = caseStudyHref(post.slug);
        const badge = companyLabel(post);
        return (
          <article
            key={post.id}
            className="flex flex-col gap-4 border-b border-[var(--color-border)] py-8 first:pt-0 last:border-b-0 sm:flex-row sm:gap-6"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--color-border)]/30 sm:w-[220px] md:w-[260px]">
              <Link href={href} variant="button" className="absolute inset-0 block">
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
              <span className="absolute bottom-2 left-2 z-[1] bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                {badge}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-snug text-[var(--color-fg)] md:text-xl">
                <Link href={href} variant="button" className="hover:text-[var(--color-brand-primary)]">
                  {post.title}
                </Link>
              </h3>
              {post.date ? (
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {formatBylineDate(post.date)}
                </p>
              ) : null}
              <div className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
                {formatInsightExcerptPlain(post.excerpt) || "Read the full case study for more."}
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

      {showLoadMore ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="secondary" onClick={loadMore} disabled={loading} aria-busy={loading}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
