import type { Metadata } from "next";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POSTS, type PostsListResult } from "@/lib/queries";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";

export const metadata: Metadata = {
  title: "Newsroom & Blog | AmeriLife",
  description:
    "Stay up to date with the latest news, announcements, and insights from AmeriLife — America's leading health and wealth distribution company.",
};

export default async function BlogIndexPage() {
  const data = await fetchGraphQL<PostsListResult>(GET_POSTS, {
    first: 24,
    after: null,
  });

  const posts = data?.posts?.nodes ?? [];

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Newsroom
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          The latest announcements, partnerships, and insights from AmeriLife.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">No posts found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
