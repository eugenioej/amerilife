import { CORP_DEV_TEAM } from "./constants";
import { ContributorTeamCard } from "./ContributorTeamCard";

export function ContributorTeam() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h1 className="mb-4 text-center text-4xl font-bold text-[var(--color-fg)] sm:text-5xl">
          Contributors
        </h1>
        <div className="mx-auto my-6 h-px w-125 bg-gray-300/75 mt-10 mb-20" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {CORP_DEV_TEAM.map((member) => (
            <ContributorTeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
