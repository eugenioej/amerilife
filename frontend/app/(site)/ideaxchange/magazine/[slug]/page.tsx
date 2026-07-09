import { redirect } from "next/navigation";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_ARTICLE_PATH } from "@/lib/ideaxchange-constants";

type PageParams = Promise<{ slug: string }>;

/** Legacy /ideaxchange/magazine/[slug]/ — redirects to /ideaxchange/article/[slug]/ */
export default async function LegacyMagazineArticleRedirect({ params }: { params: PageParams }) {
  const { slug } = await params;
  await requireIdeaxchangeAuth(`/ideaxchange/magazine/${slug}/`);
  redirect(`${IDEAXCHANGE_ARTICLE_PATH}${slug}/`);
}
