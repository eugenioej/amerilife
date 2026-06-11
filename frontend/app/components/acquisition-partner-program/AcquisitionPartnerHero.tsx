import Image from "next/image";
import { HERO_IMAGE } from "./constants";

export function AcquisitionPartnerHero() {
  return (
    <section className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[420px]">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#2b87da]/90 via-[#003767]/80 to-[#003767]/60"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[280px] max-w-[var(--container-max)] items-center px-[var(--container-padding-x)] py-16 sm:min-h-[360px] lg:min-h-[420px]">
        <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Your Partner of Choice to Accelerate Growth
        </h2>
      </div>
    </section>
  );
}
