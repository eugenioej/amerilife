import type { Metadata } from "next";
import { IdeaXchangeMagazinePage } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazinePage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { getIdeaxchangeMagazineBundle } from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "ideaXchange | AmeriLife",
  "Internal ideaXchange magazine for AmeriLife employees and affiliates.",
);

export default async function IdeaxchangeMagazineIndexPage() {
  await requireIdeaxchangeAuth("/ideaxchange/magazine/");

  const { posts, pageInfo } = await getIdeaxchangeMagazineBundle();

  return <IdeaXchangeMagazinePage posts={posts} listPageInfo={pageInfo} />;
}
