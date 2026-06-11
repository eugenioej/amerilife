import Image from "next/image";
import type { TeamMember } from "./constants";

type Props = {
  member: TeamMember;
};

export function AcquisitionPartnerTeamCard({ member }: Props) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="relative mb-4 h-[220px] w-[220px] overflow-hidden rounded-full bg-[#e2e5ed] sm:h-[240px] sm:w-[240px]">
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="240px"
        />
      </div>
      <h3 className="mb-1 text-xl font-bold text-[var(--color-fg)]">{member.name}</h3>
      <p className="text-base text-[var(--color-muted)]">{member.title}</p>
    </article>
  );
}
