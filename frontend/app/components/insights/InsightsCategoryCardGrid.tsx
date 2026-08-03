// app/components/insights/InsightsCategoryCardGrid.tsx

import type { InsightListItem } from "@/lib/queries";
import { InsightsCategoryCard } from "./InsightsCategoryCard";

type Props = {
  posts: InsightListItem[];
};

export function InsightsCategoryCardGrid({ posts }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <InsightsCategoryCard key={post.id} post={post} />
      ))}
    </div>
  );
}