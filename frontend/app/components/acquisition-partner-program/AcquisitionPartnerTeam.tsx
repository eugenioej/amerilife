import { CORP_DEV_TEAM } from "./constants";
import { AcquisitionPartnerTeamCard } from "./AcquisitionPartnerTeamCard";

export function AcquisitionPartnerTeam() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Meet Our Team
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-[var(--color-muted)]">
          Please feel free to contact a member of our Corporate Development Team directly!
        </p>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CORP_DEV_TEAM.map((member) => (
            <AcquisitionPartnerTeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
