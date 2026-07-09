import { notFound } from "next/navigation";
import { IdeaXchangePostTemplate } from "@/app/components/ideaxchange/magazine/IdeaXchangePostTemplate";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_ARTICLE_PATH } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeArticleBySlug,
  getIdeaxchangeList,
} from "@/lib/ideaxchange-data";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { getSiteUrl, privatePageMetadata, yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

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

export default async function IdeaxchangeArticlePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const articlePath = `${IDEAXCHANGE_ARTICLE_PATH}${slug}/`;
  const auth = await requireIdeaxchangeAuth(articlePath);

  const [post, allPosts] = await Promise.all([
    getIdeaxchangeArticleBySlug(slug, auth.persona),
    getIdeaxchangeList(auth.persona),
  ]);

  if (!post) notFound();

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}${articlePath}`;
  const relatedPosts = allPosts.filter((p) => p.slug && p.slug !== slug);

  return (
    <IdeaXchangePostTemplate
      key={`ideaxchange-post-${slug}`}
      post={post}
      relatedPosts={relatedPosts}
      shareUrl={articleUrl}
    />
  );
}
