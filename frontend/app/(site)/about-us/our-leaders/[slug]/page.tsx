import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeaderDetailTemplate } from "@/app/components/about-us/leaders/LeaderDetailTemplate";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_LEADERS,
  GET_LEADER_BY_SLUG,
  type LeadersQueryResult,
  type LeaderBySlugResult,
  type LeaderListItem,
} from "@/lib/queries";
import { yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

/** Allow new leader slugs from WordPress without a rebuild. */
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const data = await fetchGraphQL<LeadersQueryResult>(GET_LEADERS);
    const nodes = data.leaders?.nodes ?? [];
    return nodes
      .filter((n): n is LeaderListItem & { slug: string } => Boolean(n.slug))
      .map((n) => ({ slug: n.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchGraphQL<LeaderBySlugResult>(GET_LEADER_BY_SLUG, { slug });
    const leader = data.leader;
    if (!leader) {
      return { title: "Leader | AmeriLife" };
    }
    const fallback = leader.title ?? "Leader";
    if (leader.seo) {
      return yoastSeoToMetadata(leader.seo, fallback);
    }
    return { title: `${fallback} | AmeriLife` };
  } catch {
    return { title: "Leader | AmeriLife" };
  }
}

export default async function LeaderPage({ params }: { params: PageParams }) {
  const { slug } = await params;

  let leaderData: LeaderBySlugResult;
  let listData: LeadersQueryResult;
  try {
    [leaderData, listData] = await Promise.all([
      fetchGraphQL<LeaderBySlugResult>(GET_LEADER_BY_SLUG, { slug }),
      fetchGraphQL<LeadersQueryResult>(GET_LEADERS),
    ]);
  } catch {
    notFound();
  }

  const leader = leaderData.leader;
  if (!leader) {
    notFound();
  }

  const allLeaders = listData.leaders?.nodes ?? [];

  return (
    <LeaderDetailTemplate leader={leader} allLeaders={allLeaders} />
  );
}
