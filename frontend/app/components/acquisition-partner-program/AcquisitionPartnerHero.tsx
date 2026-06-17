import { rewriteUploadsUrl } from "@/lib/wp-media";

const BANNER_10 = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/banner-10.png";

export function AcquisitionPartnerHero() {
  return (
      <div
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-10"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-[var(--container-max)] items-center justify-center px-[var(--container-padding-x)]">
          <div/>
      <div className="relative flex min-h-[280px] max-w-[var(--container-max)] items-center px-[var(--container-padding-x)] py-16 sm:min-h-[360px] lg:min-h-[420px]">
        <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl text-center">
          Your Partner of Choice to Accelerate Growth
        </h2>
      </div>
        </div>
      </div>
    );
}
