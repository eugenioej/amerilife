import Image from "next/image";

type GivesBackBoardMemberCardProps = {
  name: string;
  title: string;
  image: string;
};

export default function GivesBackBoardMemberCard({
  name,
  title,
  image,
}: GivesBackBoardMemberCardProps) {
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-tl-[48px] rounded-br-[48px]">
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mt-3 mb-2 text-[20px] font-bold leading-[1.2] text-[var(--color-brand-primary)]">
        {name}
      </h3>

      <p className="mt-1 text-[14px] font-bold uppercase tracking-[0.06em] text-[var(--color-brand-dark)]">
        {title}
      </p>
    </div>
  );
}