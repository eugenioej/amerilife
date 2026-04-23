import type { InsightListItem } from "@/lib/queries";

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatBylineDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function topicLabel(post: InsightListItem): string {
  const name = post.insightTopics?.nodes?.[0]?.name?.trim();
  return name ? name.toUpperCase() : "INSIGHT";
}

export function insightHref(slug: string | null | undefined): string {
  if (!slug) return "/insights/";
  return `/insights/${slug}/`;
}
