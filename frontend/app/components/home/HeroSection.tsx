import Image from "next/image";

const BANNER_URL = "https://amerilife.com/wp-content/uploads/2021/12/banner-image.png";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-start justify-center overflow-hidden lg:min-h-[100vh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={BANNER_URL}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(86.01deg, rgba(14, 50, 80, 0.85) -74.41%, rgba(0, 58, 116, 0.75) 7.86%, rgba(0, 155, 124, 0.65) 104.48%, rgba(103, 192, 132, 0.5) 142.38%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] pl-[calc(var(--container-padding-x)+2rem)] text-left">
        <h2 className="mb-4 text-xl font-normal tracking-wide text-white/95 sm:text-2xl lg:text-3xl">
          Together As
        </h2>
        <h1 className="mb-8 flex items-baseline justify-start gap-2 text-7xl tracking-tight text-white sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">
          <span style={{ fontWeight: 900 }}>O</span>
          <span className="font-normal">NE</span>
        </h1>
        <p className="max-w-2xl text-left text-xl font-normal leading-relaxed text-white/95 sm:text-2xl lg:text-3xl">
          Delivering insurance and financial solutions to agents and advisors to
          help people live longer, healthier lives.
        </p>
      </div>
    </section>
  );
}
