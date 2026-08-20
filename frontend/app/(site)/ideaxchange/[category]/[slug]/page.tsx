import { notFound, redirect } from "next/navigation";
import { IdeaXchangePostTemplate } from "@/app/components/ideaxchange/magazine/IdeaXchangePostTemplate";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeArticleBySlug,
  getIdeaxchangeList,
} from "@/lib/ideaxchange-data";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { getSiteUrl, privatePageMetadata, yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{
  category: string;
  slug: string;
}>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getIdeaxchangeArticleBySlug(slug);
  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "ideaXchange");
  }

  const title = `${post.title ?? "Article"} | ideaXchange`;
  const description =
    formatInsightExcerptPlain(post.excerpt).slice(0, 320) ||
    `Read ${post.title ?? "this article"} on AmeriLife ideaXchange.`;

  return privatePageMetadata(title, description);
}

export default async function IdeaxchangeArticlePage({
  params,
}: {
  params: PageParams;
}) {
  const { category, slug } = await params;
  const articlePath = `/ideaxchange/${category}/${slug}/`;

  const auth = await requireIdeaxchangeAuth(articlePath);
  const devView = await getIdeaxchangeDevViewMode();

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  const [post, allPosts, ideaxchangeAds] = await Promise.all([
      getIdeaxchangeArticleBySlug(slug, effectivePersona),
      getIdeaxchangeList(effectivePersona),
      getIdeaxchangeAdsSettings(),
    ]);

    if (!post) notFound();

  const canonicalCategory = post.ideaxchangeTopics?.nodes?.[0]?.slug?.trim();

  if (
    canonicalCategory &&
    canonicalCategory !== category
  ) {
    redirect(
      `/ideaxchange/${canonicalCategory}/${slug}/`
    );
  }

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
  );

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}${articlePath}`;
  const relatedPosts = allPosts.filter((p) => p.slug && p.slug !== slug);

  return (
    <IdeaXchangePostTemplate
      key={`ideaxchange-post-${slug}`}
      post={post}
      relatedPosts={relatedPosts}
      shareUrl={articleUrl}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}