import { notFound } from "next/navigation";
import { SalesSuccessPostTemplate } from "@/app/components/ideaxchange/sales-success/SalesSuccessPostTemplate";
import {
  filterIdeaxchangeAdsSettingsByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeInitiativeArticleBySlug,
  getIdeaxchangeInitiativeMagazineBundle,
} from "@/lib/ideaxchange-data";
import { getMockInitiativeMagazineBundle } from "@/lib/ideaxchange-initiative-magazine-mock";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { getSiteUrl, privatePageMetadata, yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getIdeaxchangeInitiativeArticleBySlug(slug);

  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Sales Success");
  }

  const title = `${post.title ?? "Article"} | Sales Success | ideaXchange`;
  const description =
    formatInsightExcerptPlain(post.excerpt).slice(0, 320) ||
    `Read ${post.title ?? "this article"} on AmeriLife ideaXchange Sales Success.`;

  return privatePageMetadata(title, description);
}

export default async function SalesSuccessArticlePage({
  params,
}: {
  params: PageParams;
}) {
  const { slug } = await params;
  const auth = await requireIdeaxchangeAuth(`${IDEAXCHANGE_SALES_SUCCESS_PATH}${slug}/`);
  const adAudience = getIdeaxchangeAdAudienceFromPersona(auth.persona);

  const [post, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeInitiativeArticleBySlug(slug, auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  if (!post) notFound();

  const visibleIdeaxchangeAds = filterIdeaxchangeAdsSettingsByAudience(
    ideaxchangeAds,
    adAudience,
  );

  const isMockPost = post.id.startsWith("mock-");
  const relatedPosts = isMockPost
    ? getMockInitiativeMagazineBundle().posts.filter((p) => p.slug && p.slug !== slug)
    : (
        await getIdeaxchangeInitiativeMagazineBundle(auth.persona)
      ).posts.filter((p) => p.slug && p.slug !== slug);

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}${IDEAXCHANGE_SALES_SUCCESS_PATH}${slug}/`;

  return (
    <SalesSuccessPostTemplate
      key={`sales-success-post-${slug}`}
      post={post}
      relatedPosts={relatedPosts}
      shareUrl={articleUrl}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}