import { notFound, permanentRedirect } from "next/navigation";
import { InsightPostTemplate } from "@/app/components/insights/InsightPostTemplate";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import {
  getCanonicalInsightPath,
  getInsightBySlug,
  getInsightsAdsSettings,
  getInsightsList,
} from "@/lib/insights-data";
import { getFaqNewsroomPosts } from "@/lib/faq-newsroom-posts";
import {
  getSiteUrl,
  insightArticleJsonLd,
  staticPageMetadata,
  yoastSeoToMetadata,
} from "@/lib/seo";

type PageParams = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const post = await getInsightBySlug(slug);

  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Insight");
  }

  const title = `${post.title ?? "Insight"} | AmeriLife`;
  const description =
    formatInsightExcerptPlain(post.excerpt).slice(0, 320) ||
    `Read ${post.title ?? "this article"} on AmeriLife Insights.`;

  const canonicalPath = getCanonicalInsightPath(post);

  return staticPageMetadata(
    title,
    description,
    canonicalPath ?? `/insights/${category}/${slug}/`,
  );
}

export default async function InsightSinglePage({
  params,
}: {
  params: PageParams;
}) {
  const { category, slug } = await params;

  const [post, allPosts, newsroomPosts, insightsAds] = await Promise.all([
    getInsightBySlug(slug),
    getInsightsList(),
    getFaqNewsroomPosts(),
    getInsightsAdsSettings(),
  ]);

  if (!post) notFound();

  const canonicalPath = getCanonicalInsightPath(post);

  if (!canonicalPath) notFound();

  const requestedPath = `/insights/${category}/${slug}/`;

  if (requestedPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}${canonicalPath}`;
  const categoryLabel =
    post.insightTopics?.nodes?.[0]?.name?.trim() || "Insights";

  const relatedPosts = allPosts.filter((p) => p.slug && p.slug !== slug);
  const latestNewsroomPosts = newsroomPosts.slice(0, 5);

  return (
    <>
      <InsightPostTemplate
        key={`insight-post-${slug}`}
        post={post}
        relatedPosts={relatedPosts}
        inTheNewsPosts={latestNewsroomPosts}
        shareUrl={articleUrl}
        insightsAds={insightsAds}
      />
      <JsonLd
        schema={insightArticleJsonLd(post, {
          url: articleUrl,
          categoryLabel,
        })}
      />
    </>
  );
}