import { notFound } from "next/navigation";
import { CompanyPageTemplate } from "@/app/components/ideaxchange/recruiting/CompanyPageTemplate";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { getCompanyBySlug } from "@/lib/ideaxchange-recruiting-data";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { privatePageMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};

  const title = `${company.title ?? "Company"} | ideaXchange`;
  const description =
    formatInsightExcerptPlain(company.excerpt).slice(0, 320) ||
    `Learn about ${company.title ?? "this affiliate company"} on AmeriLife ideaXchange.`;
  return privatePageMetadata(title, description);
}

export default async function CompanyPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  await requireIdeaxchangeAuth(`/ideaxchange/recruiting-hub/company/${slug}/`);

  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  return <CompanyPageTemplate company={company} />;
}
