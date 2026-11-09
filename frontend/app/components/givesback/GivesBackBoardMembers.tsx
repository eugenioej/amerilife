import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";
import GivesBackBoardMemberCard from "@/app/components/givesback/GivesBackBoardMemberCard";

const boardMembers = [
  {
    name: "John Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_464874339-scaled.jpeg",
  },
  {
    name: "Jane Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_480057743-scaled.jpeg",
  },
  {
    name: "Jane Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_583419866.jpeg",
  },
  {
    name: "John Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_243124072-scaled.jpeg",
  },
  {
    name: "John Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_464874339-scaled.jpeg",
  },
  {
    name: "Jane Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_480057743-scaled.jpeg",
  },
  {
    name: "Jane Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_583419866.jpeg",
  },
  {
    name: "John Doe",
    title: "TITLE OR RELEVANT INFORMATION",
    image: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AdobeStock_243124072-scaled.jpeg",
  },
];

export default function GivesBackBoardMembers() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <GivesBackSectionContainer>
        <div className="mx-auto max-w-[700px] text-center">
          <h2 className="mb-4 text-[36px] leading-[1.25] font-semibold lg:text-[48px] text-center text-[var(--color-brand-dark)]">
            Our Board
          </h2>

          <p className="mt-6 text-[18px] leading-[1.8] text-[#25476A]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
          {boardMembers.map((member, index) => (
            <GivesBackBoardMemberCard
              key={index}
              name={member.name}
              title={member.title}
              image={member.image}
            />
          ))}
        </div>
      </GivesBackSectionContainer>
    </section>
  );
}