import Link from "next/link";

import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

export default function GivesBackDonateCTA() {
  return (
    <section className="bg-[var(--color-brand-primary)] relative overflow-hidden">

      <div className="relative z-10">
        <GivesBackSectionContainer>
          <div className="py-20 flex justify-center">

            {/* Content */}
            <div className="mx-auto max-w-[900px] text-center text-white lg:mx-0">
              <h2 className="mb-6 text-[28px] uppercase leading-[1.25] font-semibold lg:text-[36px]">
                HELP US GIVE BACK
              </h2>

              <p className="mb-12 text-[18px] leading-[1.8] text-white">
                Click the button below to make a tax-deduction donation to the AmeriLife Gives Back Foundation to help more of America&apos;s seniors — one life at a time
              </p>

              <div className="flex justify-center">
                <Link
                 className="inline-flex h-[72px] w-[280px] items-center justify-center rounded-[8px] bg-[var(--color-brand-dark)] text-[18px] tracking-wide font-bold uppercase text-white shadow-lg transition-colors hover:bg-[#1d3650]"
                 href="#"
                >
                  Make a Donation
                </Link>
              </div>

            </div>
          </div>
        </GivesBackSectionContainer>
      </div>
    </section>
  );
}
