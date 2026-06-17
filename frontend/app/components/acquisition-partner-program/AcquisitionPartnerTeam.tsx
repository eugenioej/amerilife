import { CORP_DEV_TEAM } from "./constants";
import { AcquisitionPartnerTeamCard } from "./AcquisitionPartnerTeamCard";

export function AcquisitionPartnerTeam() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Meet Our Team
        </h2>
        
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CORP_DEV_TEAM.map((member) => (
            <AcquisitionPartnerTeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-16">
        <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Questions? We&apos;ve Got Answers.
        </h2>
              
        <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-[var(--color-muted)]">
          Please feel free to contact a member of our <a
               href="mailto:corporatedevelopment@amerilife.com"
               className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline font-bold"
              > Corporate Development Team </a> directly!
        </p>
      </div>
    </section>
  );
}
