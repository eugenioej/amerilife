import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { ideaxchangeCategoryHref, topicLabel } from "./ideaxchange-utils";

type Props = {
  post: Pick<IdeaxchangeListItem, "ideaxchangeTopics">;
  className: string;
};

const badgeLayout = "inline-block w-fit max-w-full self-start";

export function IdeaXchangeTopicBadge({ post, className }: Props) {
  const slug = post.ideaxchangeTopics?.nodes?.[0]?.slug?.trim();
  const label = topicLabel(post);
  const merged = `${badgeLayout} ${className}`.trim();
  if (slug) {
    return (
      <Link href={ideaxchangeCategoryHref(slug)} variant="button" className={merged}>
        {label}
      </Link>
    );
  }
  return <span className={merged}>{label}</span>;
}
