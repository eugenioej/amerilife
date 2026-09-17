import Image from "next/image";
import Link from "next/link";

import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

export default function GivesBackHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AGB-LeafBackground-Gradient-scaled.jpg"
          alt=""
          fill
          priority
          className="object-cover rotate-180"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(18,49,79,0.42)]" />

      <div className="relative z-10">
        <GivesBackSectionContainer>
          <div className="grid min-h-[640px] items-center gap-12 py-12 lg:grid-cols-[460px_1fr] lg:gap-48">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/Rectangle-2-1-e1789671162921.png"
                alt="AmeriLife Gives Back Foundation"
                width={430}
                height={430}
                priority
                className="h-auto w-full max-w-[280px] lg:max-w-[430px]"
              />
            </div>

            {/* Content */}
            <div className="mx-auto max-w-[700px] text-center text-white lg:mx-0 lg:max-w-none lg:text-left">
              <h1 className="mb-6 text-[36px] leading-[1.25] font-semibold lg:text-[48px]">
                Giving Back
                <br />
                to the Community
              </h1>

              <p className="mb-8 text-[18px] leading-[1.8] font-semibold text-white">
                As a values-driven company, giving back is in AmeriLife&apos;s DNA and has been an important part of who we are for more than 50 years. Founded in 2022, the AmeriLife Gives Back Foundation honors our company&apos;s legacy of giving while helping to connect its growing business, philanthropic and volunteer endeavors.
              </p>

              <p className="mb-10 text-[18px] leading-[1.8] font-semibold text-white">
                The foundation – through donations of time, money and other resources – focuses on causes that enable the senior community to aid in AmeriLife&apos;s commitment to helping people live longer, healthier lives.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link
                 className="inline-flex h-[72px] w-[280px] items-center justify-center rounded-[8px] bg-[var(--color-brand-dark)] text-[18px] tracking-wide font-bold text-white shadow-lg transition-colors hover:bg-[#1d3650]"
                 href="#"
                >
                  MAKE A DONATION
                </Link>
              </div>
            </div>
          </div>
        </GivesBackSectionContainer>
      </div>
    </section>
  );
}