import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { resolveIdeaxchangeBadge } from "./ideaxchange-utils";

type Props = {
  post: Pick<IdeaxchangeListItem, "ideaxchangeTopics" | "ideaxchangeTags">;
  className: string;
  /**
   * Fallback when the post has no topic (e.g. pillar pages).
   * Does not override a real topic — topics always win and link to the category archive.
   */
  label?: string;
  /** Href used with `label` when there is no topic (e.g. Recruiting Hub path). */
  fallbackHref?: string;
};

const badgeLayout = "inline-block w-fit max-w-full self-start";

export function IdeaXchangeTopicBadge({
  post,
  className,
  label: fallbackLabel,
  fallbackHref,
}: Props) {
  const { label, href } = resolveIdeaxchangeBadge(post, {
    label: fallbackLabel,
    href: fallbackHref,
  });
  const merged = `${badgeLayout} ${className}`.trim();
  if (href) {
    return (
      <Link href={href} variant="button" className={merged}>
        {label}
      </Link>
    );
  }
  return <span className={merged}>{label}</span>;
}
