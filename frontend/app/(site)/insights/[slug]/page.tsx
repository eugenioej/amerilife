import { notFound } from "next/navigation";
import { InsightPostTemplate } from "@/app/components/insights/InsightPostTemplate";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { getInsightBySlug, getInsightsAdsSettings, getInsightsList } from "@/lib/insights-data";
import {
  getSiteUrl,
  insightArticleJsonLd,
  staticPageMetadata,
  yoastSeoToMetadata,
} from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Insight");
  }
  const title = `${post.title ?? "Insight"} | AmeriLife`;
  const description =
    formatInsightExcerptPlain(post.excerpt).slice(0, 320) ||
    `Read ${post.title ?? "this article"} on AmeriLife Insights.`;
  return staticPageMetadata(title, description, `/insights/${slug}/`);
}

export default async function InsightSinglePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const [post, allPosts, insightsAds] = await Promise.all([
    getInsightBySlug(slug),
    getInsightsList(),
    getInsightsAdsSettings(),
  ]);

  if (!post) notFound();

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}/insights/${slug}/`;
  const categoryLabel =
    post.insightTopics?.nodes?.[0]?.name?.trim() || "Insights";

  const relatedPosts = allPosts.filter((p) => p.slug && p.slug !== slug);

  return (
    <>
      <JsonLd
        schema={insightArticleJsonLd(post, {
          url: articleUrl,
          categoryLabel,
        })}
      />
      <InsightPostTemplate
        post={post}
        relatedPosts={relatedPosts}
        shareUrl={articleUrl}
        insightsAds={insightsAds}
      />
    </>
  );
}
