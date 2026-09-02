import Image from "next/image";
import Link from "next/link";
import type { Contributor } from "@/lib/queries";

type Props = {
  member: Contributor;
};

export function ContributorTeamCard({ member }: Props) {
  const fields = member.userFields;

  return (
    <Link href={`/contributors/${member.slug ?? ""}`}>
      <div className="cursor-pointer">
        <article className="flex flex-col items-center text-center">

          <div className="relative mb-4 h-[200px] w-[200px] overflow-hidden rounded-full bg-[#e2e5ed]">
            <Image
              src={fields?.headshot || "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/11/cropped-favicon-blue-270x270.jpg"}
              alt={member.name || ""}
              fill
              className="object-cover object-top"
              sizes="200px"
              priority={false}
            />
          </div>

          <h3 className="mb-1 text-xl font-bold text-[var(--color-link)]">
            {member.name}
          </h3>

        </article>
      </div>
    </Link>
  );
}
