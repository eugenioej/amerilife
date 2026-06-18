import { ContributorTeamCard } from "./ContributorTeamCard";
import type { Contributor } from "@/lib/queries";
import Link from "next/link";

type Props = {
  contributors: Contributor[];
};

export function ContributorFeaturedTeam({ contributors = [] }: Props) {
  const featured = contributors
    .filter((c) => c.userFields?.featured)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h1 className="mb-4 text-center text-4xl font-bold text-[var(--color-fg)] sm:text-5xl">
          Featured Contributors
        </h1>

        <div className="mx-auto my-6 h-px w-150 bg-gray-300/75 mt-10 mb-20" />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((member) => (
            <ContributorTeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        <Link
          href="/contributors/"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-12 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:opacity-90"
        >
          View All
        </Link>
      </div>
    </section>
  );
}