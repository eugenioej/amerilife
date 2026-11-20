import Image from "next/image";

import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

export default function GivesBackGivingTree() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AGB-LeafBackground-Gradient-scaled.jpg"
          alt=""
          fill
          className="object-cover rotate-180"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(18,49,79,0.42)]" />

      <div className="relative z-10">
        <GivesBackSectionContainer>
          <div className="grid min-h-[640px] items-center gap-12 py-12 lg:grid-cols-[600px_1fr] lg:gap-30">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/FTB-February-23-01-e1789763398940.jpg"
                alt="AmeriLife Gives Back Foundation"
                width={430}
                height={430}
                priority
                className="h-auto w-full max-w-[320px] lg:max-w-[600px]"
              />
            </div>

            {/* Content */}
            <div className="mx-auto max-w-[700px] text-center text-white lg:mx-0 lg:max-w-none lg:text-left">
              <h2 className="mb-6 text-[36px] leading-[1.25] font-semibold lg:text-[48px]">
                Our Giving Tree
              </h2>

              <p className="mb-8 text-[18px] leading-[1.8] text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
              </p>

            </div>
          </div>
        </GivesBackSectionContainer>
      </div>
    </section>
  );
}
