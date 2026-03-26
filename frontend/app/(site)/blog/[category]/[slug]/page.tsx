import { notFound } from "next/navigation";
import { BlogPostTemplate } from "@/app/components/blog/BlogPostTemplate";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POST_BY_SLUG, type PostByUri } from "@/lib/queries";
import {
  articleJsonLd,
  getSiteUrl,
  staticPageMetadata,
  yoastSeoToMetadata,
} from "@/lib/seo";

type PageParams = Promise<{ category: string; slug: string }>;

type PostBySlugResult = { post?: PostByUri | null };

async function getPost(slug: string): Promise<PostByUri | null> {
  const data = await fetchGraphQL<PostBySlugResult>(GET_POST_BY_SLUG, { slug });
  const post = data?.post;
  if (!post || post.__typename !== "Post") return null;
  return post as PostByUri;
}

export async function generateMetadata({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Article");
  }
  const title = `${post.title ?? "Article"} | AmeriLife`;
  const description = post.excerpt
    ? post.excerpt
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 320)
    : `Read ${post.title ?? "this article"} on AmeriLife Newsroom.`;
  return staticPageMetadata(title, description, `/blog/${category}/${slug}/`);
}

export default async function BlogPostPage({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}/blog/${category}/${slug}/`;
  const categoryLabel =
    post.categories?.nodes?.[0]?.name?.trim() ||
    category.replace(/-/g, " ");

  return (
    <>
      <JsonLd
        schema={articleJsonLd(post, {
          url: articleUrl,
          categoryLabel,
        })}
      />
      <BlogPostTemplate post={post} categorySlug={category} />
    </>
  );
}
