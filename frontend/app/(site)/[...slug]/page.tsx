import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_NODE_BY_URI, type PageWithSeo } from "@/lib/queries";
import { yoastSeoToMetadata } from "@/lib/seo";
import { rewriteUploadsInHtml } from "@/lib/wp-media";
import { getLocationBySlug, getAgentBySlug } from "@/lib/locations-data";
import { LocationPageTemplate } from "@/app/components/locations/LocationPageTemplate";
import { AgentDetailTemplate } from "@/app/components/locations/AgentDetailTemplate";

type PageParams = Promise<{ slug: string[] }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;

  // Agent detail pages: /location-slug/agent-slug/
  if (slug.length === 2) {
    const result = getAgentBySlug(slug[0], slug[1]);
    if (result) {
      return {
        title: `${result.agent.name} | AmeriLife Agent`,
        description: `${result.agent.name} is a licensed AmeriLife agent in ${result.agent.city}, ${result.agent.state}. Connect today for Medicare, health insurance, life insurance, and retirement solutions.`,
      };
    }
  }

  // Location pages: use our own metadata
  if (slug.length === 1) {
    const location = getLocationBySlug(slug[0]);
    if (location) {
      return {
        title: `${location.officeName} | AmeriLife`,
        description: `${location.officeName} - ${location.address.city}, ${location.address.state}. Connect with an AmeriLife agent for insurance and retirement solutions.`,
      };
    }
  }

  // WordPress pages
  const uri = "/" + slug.join("/") + "/";
  const data = await fetchGraphQL<{ nodeByUri?: PageWithSeo | null }>(
    GET_NODE_BY_URI,
    { uri }
  );
  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Page") return {};
  const page = node as PageWithSeo;
  if (page.seo) {
    return yoastSeoToMetadata(page.seo, page.title ?? "Page");
  }
  return {
    title: `${page.title ?? "Page"} | AmeriLife`,
  };
}

export default async function SlugPage({ params }: { params: PageParams }) {
  const { slug } = await params;

  // Agent detail pages: /location-slug/agent-slug/
  if (slug.length === 2) {
    const result = getAgentBySlug(slug[0], slug[1]);
    if (result) {
      return <AgentDetailTemplate agent={result.agent} location={result.location} />;
    }
  }

  // Location pages: render our custom template
  if (slug.length === 1) {
    const location = getLocationBySlug(slug[0]);
    if (location) {
      return <LocationPageTemplate location={location} />;
    }
  }

  // WordPress pages
  const uri = "/" + slug.join("/") + "/";

  const data = await fetchGraphQL<{ nodeByUri?: PageWithSeo | null }>(
    GET_NODE_BY_URI,
    { uri }
  );

  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Page") {
    notFound();
  }

  const page = node as PageWithSeo;
  const html = page.content ? rewriteUploadsInHtml(page.content) : "";

  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)]">
        {page.title}
      </h1>
      {html ? (
        <div
          className="max-w-none text-[var(--color-fg)] [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-[var(--color-muted)]">Content coming soon.</p>
      )}
    </article>
  );
}
