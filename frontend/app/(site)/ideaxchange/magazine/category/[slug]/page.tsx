import { redirect } from "next/navigation";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";

type PageParams = Promise<{ slug: string }>;

/** Legacy magazine category URLs — redirect to the unified home feed. */
export default async function IdeaxchangeCategoryRedirect({ params }: { params: PageParams }) {
  const { slug } = await params;
  await requireIdeaxchangeAuth(`/ideaxchange/magazine/category/${slug}/`);
  redirect(IDEAXCHANGE_HOME_FEED_PATH);
}
