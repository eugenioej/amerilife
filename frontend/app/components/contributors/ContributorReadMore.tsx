import Link from "next/link";
import Image from "next/image";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_LATEST_INSIGHTS_BY_TOPICS } from "@/lib/queries";
import type {
  LatestInsightsByTopicsResult,
  InsightListItem,
} from "@/lib/queries";

export async function ContributorReadMoreArticles() {
    
    const data = await fetchGraphQL<LatestInsightsByTopicsResult>(
      GET_LATEST_INSIGHTS_BY_TOPICS
    );

    const allPosts: InsightListItem[] = data?.insights?.nodes ?? [];

    const getFirstByTopic = (topicSlug: string) =>
      allPosts.find((post) =>
        post.insightTopics?.nodes?.some(
          (t) => t.slug === topicSlug
        )
    );

    const posts = [
      getFirstByTopic("wealth"),
      getFirstByTopic("health"),
      getFirstByTopic("life"),
    ].filter((post): post is InsightListItem => Boolean(post));


  return (
    <section className="pb-40 pt-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-16 h-px bg-gray-200" />

        <h2 className="mb-20 text-center text-4xl font-bold text-[var(--color-fg)]">
          Recent Articles
        </h2>

        <div className="space-y-10">
          {posts.map((post: InsightListItem, i: number) => (
            <Link key={i} href={`/insights/${post.slug}`} className="group block">

            <div className="flex flex-col gap-6 md:flex-row">

          {/* IMAGE */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--color-border)]/30 sm:w-[220px] md:w-[260px]">
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title || ""}
              fill
              className="object-cover"
            />
          )}

          {/* TAG (overlay, bottom-left) */}
          {post.insightTopics?.nodes?.[0] && (
            <div className="absolute bottom-2 left-2 bg-[var(--color-brand-primary)] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wider text-white">
              {post.insightTopics.nodes[0].name}
            </div>
          )}
        </div>

      {/* CONTENT */}
      <div className="flex-1">
        <h3 className="text-lg font-bold leading-snug text-[var(--color-fg)] md:text-xl hover:text-[var(--color-brand-primary)]">
          {post.title}
        </h3>

        {/* ✅ FIXED: removed author */}
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
          {post.date
            ? new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>

        <div
          className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: post.excerpt || "",
          }}
        />
      </div>
    </div>

    
      <div className="mt-8 h-px bg-gray-200" />
  </Link>
))}
        </div>
      </div>
    </section>
  );
}