
import { notFound, permanentRedirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POST_BY_SLUG, type PostByUri } from "@/lib/queries";

type PageParams = Promise<{ category: string; slug: string }>;

type PostBySlugResult = { post?: PostByUri | null };
console.log("BLOG REDIRECT ROUTE HIT");

async function getPost(slug: string): Promise<PostByUri | null> {
  const data = await fetchGraphQL<PostBySlugResult>(GET_POST_BY_SLUG, { slug });
  const post = data?.post;

  if (!post || post.__typename !== "Post") return null;

  return post as PostByUri;
}

function getPrimaryCategorySlug(post: PostByUri, fallbackCategory: string) {
  return post.categories?.nodes?.[0]?.slug || fallbackCategory;
}

export default async function LegacyBlogPostRedirectPage({
  params,
}: {
  params: PageParams;
}) {
  const { category, slug } = await params;

  /**
   * Fetch by slug only.
   * The old category in the URL does not matter.
   */
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const canonicalCategorySlug = getPrimaryCategorySlug(post, category);

  permanentRedirect(`/newsroom/${canonicalCategorySlug}/${slug}`);
}