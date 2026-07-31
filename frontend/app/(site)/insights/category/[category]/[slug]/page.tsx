import { notFound, permanentRedirect } from "next/navigation";
import {
  getCanonicalInsightPath,
  getInsightBySlug,
} from "@/lib/insights-data";

type PageParams = Promise<{
  category: string;
  slug: string;
}>;

export default async function LegacyInsightCategoryArticleRedirectPage({
  params,
}: {
  params: PageParams;
}) {
  const { slug } = await params;

  const post = await getInsightBySlug(slug);
  const canonicalPath = post ? getCanonicalInsightPath(post) : null;

  if (!canonicalPath) {
    notFound();
  }

  permanentRedirect(canonicalPath);
}