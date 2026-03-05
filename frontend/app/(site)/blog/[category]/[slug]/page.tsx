import { notFound } from "next/navigation";
import { BlogPostTemplate } from "@/app/components/blog/BlogPostTemplate";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POST_BY_URI, type PostByUri } from "@/lib/queries";
import { yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const uri = `/blog/${category}/${slug}/`;

  const data = await fetchGraphQL<{ nodeByUri?: PostByUri | null }>(
    GET_POST_BY_URI,
    { uri }
  );
  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Post") return {};

  const post = node as PostByUri;
  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Article");
  }
  return {
    title: `${post.title ?? "Article"} | AmeriLife`,
  };
}

export default async function BlogPostPage({ params }: { params: PageParams }) {
  const { category, slug } = await params;
  const uri = `/blog/${category}/${slug}/`;

  const data = await fetchGraphQL<{ nodeByUri?: PostByUri | null }>(
    GET_POST_BY_URI,
    { uri }
  );

  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Post") {
    notFound();
  }

  const post = node as PostByUri;

  return (
    <BlogPostTemplate post={post} categorySlug={category} />
  );
}
