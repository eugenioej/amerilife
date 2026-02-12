import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_NODE_BY_URI } from "@/lib/queries";

type PageParams = Promise<{ slug: string[] }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const uri = "/" + slug.join("/") + "/";
  const data = await fetchGraphQL<{
    nodeByUri?: { __typename: string; title?: string } | null;
  }>(GET_NODE_BY_URI, { uri });
  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Page") return {};
  return {
    title: `${(node as { title?: string }).title} | AmeriLife`,
  };
}

export default async function SlugPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const uri = "/" + slug.join("/") + "/";

  const data = await fetchGraphQL<{
    nodeByUri?:
      | { __typename: string; title?: string; slug?: string; content?: string }
      | null;
  }>(GET_NODE_BY_URI, { uri });

  const node = data?.nodeByUri;
  if (!node || node.__typename !== "Page") {
    notFound();
  }

  const page = node as { title?: string; slug?: string; content?: string };

  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)]">
        {page.title}
      </h1>
      {page.content ? (
        <div
          className="max-w-none text-[var(--color-fg)] [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-[var(--color-muted)]">Content coming soon.</p>
      )}
    </article>
  );
}
