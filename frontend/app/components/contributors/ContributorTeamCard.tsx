import Image from "next/image";
import type { TeamMember } from "./constants";

type Props = {
  member: TeamMember;
};

export function ContributorTeamCard({ member }: Props) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="relative mb-4 h-[200px] w-[200px] overflow-hidden rounded-full bg-[#e2e5ed] sm:h-[200px] sm:w-[200px]">
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="200px"
        />
      </div>
      <h3 className="mb-1 text-xl font-bold text-[var(--color-link)]">{member.name}</h3>
    </article>
  );
}
