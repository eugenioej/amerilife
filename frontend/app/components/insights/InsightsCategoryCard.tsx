// app/components/insights/InsightsCategoryCard.tsx

import { Link } from "@/app/components/ui/Link";
import type { InsightListItem } from "@/lib/queries";
import { InsightTopicBadge } from "./InsightTopicBadge";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  insightHref,
} from "./insights-utils";

type Props = {
  post: InsightListItem;
};

export function InsightsCategoryCard({ post }: Props) {
  const topicSlug = post.insightTopics?.nodes?.[0]?.slug;
  const href = insightHref(post.slug, topicSlug);
  const excerpt =
    formatInsightExcerptPlain(post.excerpt) || "Read the full article for more.";

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md">
        <div className="flex flex-1 flex-col p-5">
            <div className="mb-4">
              <InsightTopicBadge
                post={post}
                className="inline-flex rounded-full bg-[var(--color-brand-primary)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              />
            </div>
        
            <h2 className="mb-2 break-words text-base font-bold leading-snug text-[var(--color-brand-dark)]">
              <Link
                href={href}
                variant="button"
                className="text-[var(--color-brand-dark)] transition-colors hover:text-[var(--color-brand-dark)]"
              >
                {post.title}
              </Link>
            </h2>
        
            {excerpt && (
              <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-3">
                {excerpt}
              </p>
            )}
        
            <div className="mt-auto flex items-center justify-between">
              
              {post.date && (
                <span className="text-xs text-[var(--color-muted)]">
                  {formatBylineDate(post.date)}
                </span>
              )}
        
              <Link
                href={href}
                className="text-xs font-semibold text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-primary-hover)]"
              >
                Read more →
              </Link>
            </div>
      </div>
    </article>
  );
}