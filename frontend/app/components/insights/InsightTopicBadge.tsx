import { Link } from "@/app/components/ui/Link";
import type { InsightListItem } from "@/lib/queries";
import { insightCategoryHref, topicLabel } from "./insights-utils";

type Props = {
  post: Pick<InsightListItem, "insightTopics">;
  className: string;
};

const badgeLayout = "inline-block w-fit max-w-full self-start";

export function InsightTopicBadge({ post, className }: Props) {
  const slug = post.insightTopics?.nodes?.[0]?.slug?.trim();
  const label = topicLabel(post);
  const merged = `${badgeLayout} ${className}`.trim();
  if (slug) {
    return (
      <Link href={insightCategoryHref(slug)} variant="button" className={merged}>
        {label}
      </Link>
    );
  }
  return <span className={merged}>{label}</span>;
}
