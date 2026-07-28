import { notFound, permanentRedirect } from "next/navigation";
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

function normalizePath(path: string) {
  if (!path) return "/";

  return path.length > 1 && path.endsWith("/")
    ? path.slice(0, -1)
    : path;
}

function getPrimaryCategorySlug(post: PostByUri, fallbackCategory: string) {
  return post.categories?.nodes?.[0]?.slug || fallbackCategory;
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

  return staticPageMetadata(title, description, `/newsroom/${category}/${slug}/`);
}

export default async function NewsroomPostPage({
  params,
}: {
  params: PageParams;
}) {
  const { category, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const currentPath = normalizePath(`/newsroom/${category}/${slug}`);

  const canonicalCategorySlug = getPrimaryCategorySlug(post, category);
  
  const canonicalPath = normalizePath(
    `/newsroom/${canonicalCategorySlug}/${slug}`
  );

  /**
   * This protects the new newsroom URLs too.
   *
   * Example:
   * /newsroom/awards/post-slug
   *
   * If WordPress now says the post's category is company-news,
   * this redirects to:
   *
   * /newsroom/company-news/post-slug
   */
  if (canonicalPath !== currentPath) {
    permanentRedirect(canonicalPath);
  }

  const site = getSiteUrl().replace(/\/$/, "");
  const articleUrl = `${site}${canonicalPath}/`;

  const categoryLabel =
    post.categories?.nodes?.[0]?.name?.trim() || category.replace(/-/g, " ");

  return (
    <>
      <JsonLd
        schema={articleJsonLd(post, {
          url: articleUrl,
          categoryLabel,
        })}
      />
      <BlogPostTemplate post={post} categorySlug={canonicalCategorySlug} />
    </>
  );
}