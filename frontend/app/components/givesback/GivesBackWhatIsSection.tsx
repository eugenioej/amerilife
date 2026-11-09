import Image from "next/image";
import Link from "next/link";

import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

export default function GivesBackGivingTree() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-brand-dark)]">
      <div className="relative z-10">
        <GivesBackSectionContainer>
          <div className="grid min-h-[640px] items-center gap-12 py-12 lg:grid-cols-[600px_1fr] lg:gap-30">

            {/* Content */}
            <div className="mx-auto max-w-[700px] text-center text-white lg:mx-0 lg:max-w-none lg:text-left">
              <h2 className="mb-6 text-[36px] leading-[1.25] font-semibold lg:text-[48px]">
                What is AmeriLife
                <br />
                 Gives Back?
              </h2>

              <p className="mb-8 text-[18px] leading-[1.8] text-white">
                Community partnerships that improve residents’ quality of life are part of AmeriLife’s commitment to serving the areas where our customers, associates and agents live and work. 
              </p>

              <p className="mb-8 text-[18px] leading-[1.8] text-white">
                 We’re proud to support local, regional and national organizations that make a positive impact on the lives of people and families.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Link
                 className="inline-flex h-[72px] w-[280px] items-center justify-center rounded-[8px] bg-[var(--color-brand-primary)] text-[18px] tracking-wide font-bold uppercase text-white shadow-lg transition-colors hover:bg-[#1d3650]"
                 href="https://youtube.com/playlist?list=PLqhps7bJyvr7rnIQ0p8yrijjpibTLAmDl&si=RbrdfoHIAwQMxMGn"
                 target="_blank"
                 rel="noopener noreferrer"
                >
                  Visit Our Playlist
                </Link>
              </div>

            </div>

            {/* Video */}
            <div className="flex justify-center">
              <div className="w-full overflow-hidden shadow-lg">
                <div className="relative aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/GktWG8mZeMA"
                    title="What is AmeriLife Gives Back?"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer"
                  />
                </div>
              </div>
            </div>

          </div>
        </GivesBackSectionContainer>
      </div>
    </section>
  );
}
