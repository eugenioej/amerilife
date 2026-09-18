import Image from "next/image";

import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

const heroImage =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/st-joseph.jpg";

const communityImages = [
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/FTB-February-23-09-e1789763438997.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/465868566_1146014237534492_4440192696149091911_n.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/FTB-February-23-06-e1789763419233.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/ChristmasInJuly400-8.jpg",
];

export default function GivesBackContentFeatureSection() {
  return (
    <section className="bg-[#f4f4f4] py-24">
      <GivesBackSectionContainer>
        <div className="space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
            <div className="flex min-h-[260px] flex-col justify-center rounded-tl-[120px] rounded-br-[120px] bg-[var(--color-brand-primary)] px-20 py-12 text-white">
              <h2 className="mb-4 text-[36px] leading-[1.25] font-semibold lg:text-[48px]">
                Making an Impact
              </h2>

              <p className="max-w-3xl text-[18px] leading-[1.8] text-white">
                Community partnerships that improve residents&apos; quality of life are part of AmeriLife&apos;s and its affiliated companies&apos; collective commitment to serving the areas where our customers, associates and agents live and work. We&apos;re proud to support local, national and global organizations that make a positive impact on the lives of people and families.
              </p>
            </div>

            <div className="relative min-h-[260px] overflow-hidden">
                <Image
                    src={heroImage}
                    alt="Community partnership event"
                    width={633}
                    height={365}
                /> 
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {communityImages.map((image) => (
              <div
                key={image}
                className="overflow-hidden"
              >
                <Image
                    src={image}
                    alt=""
                    width={270}
                    height={250}
                    className="h-[250px] w-full object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>
      </GivesBackSectionContainer>
    </section>
  );
}