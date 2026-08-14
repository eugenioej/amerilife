import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/app/components/ideaxchange/recruiting/CaseStudyTemplate";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  getCaseStudiesList,
  getCaseStudyBySlug,
} from "@/lib/ideaxchange-recruiting-data";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { privatePageMetadata, yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getCaseStudyBySlug(slug);
  if (!post) return {};

  if (post.seo) {
    return yoastSeoToMetadata(post.seo, post.title ?? "Case study");
  }
  const title = `${post.title ?? "Case study"} | Recruiting Hub`;
  const description =
    formatInsightExcerptPlain(post.excerpt).slice(0, 320) ||
    `Read ${post.title ?? "this case study"} on AmeriLife ideaXchange Recruiting Hub.`;
  return privatePageMetadata(title, description);
}

export default async function CaseStudyPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const auth = await requireIdeaxchangeAuth(`/ideaxchange/recruiting-hub/${slug}/`);

  const [post, allPosts] = await Promise.all([
    getCaseStudyBySlug(slug, auth.persona),
    getCaseStudiesList(auth.persona),
  ]);

  if (!post) notFound();

  const relatedPosts = allPosts.filter((p) => p.slug && p.slug !== slug);

  return (
    <div className="mx-auto max-w-[var(--container-max)]  py-8 md:py-10 case-studies">
      <CaseStudyTemplate post={post} relatedPosts={relatedPosts} />
    </div>
  );
}
