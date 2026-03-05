import { notFound } from "next/navigation";
import { BlogPostTemplate } from "@/app/components/blog/BlogPostTemplate";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POST_BY_SLUG, type PostByUri } from "@/lib/queries";
import { yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ category: string; slug: string }>;

type PostBySlugResult = { post?: PostByUri | null };

async function getPost(slug: string): Promise<PostByUri | null> {
  const data = await fetchGraphQL<PostBySlugResult>(GET_POST_BY_SLUG, { slug });
  const post = data?.post;
  if (!post || post.__typename !== "Post") return null;
  return post as PostByUri;
}

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Article");
  }
  return {
    title: `${post.title ?? "Article"} | AmeriLife`,
  };
}

export default async function BlogPostPage({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return <BlogPostTemplate post={post} categorySlug={category} />;
}
