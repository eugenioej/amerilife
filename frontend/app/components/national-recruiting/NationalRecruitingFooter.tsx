import Image from "next/image";
import Link from "next/link";

const amerilifeWhiteLogo =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp";

export default function Footer() {
  return (
    <div className="request-support-local-footer bg-[#244260] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between items-center">
          <Link
                href="/"
                className=""
              >
              <Image
                src={amerilifeWhiteLogo}
                alt="AmeriLife"
                width={220}
                height={125}
                className="h-auto w-full max-w-[220px]"
                unoptimized
              />
            </Link>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              <Link
                href="/privacy-policy"
                className="text-white hover:text-white/90 transition-colors no-underline hover:no-underline text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                href="/terms "
                className="text-white hover:text-white/90 transition-colors no-underline hover:no-underline text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-center pb-10">
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center">
            <Link
              href="https://share.hsforms.com/1IP0WmS3AS8GpLurK4fuixAdwcnz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/90 transition-colors no-underline hover:no-underline text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Internal Creative Request
            </Link>

            <span className="text-slate-500">|</span>

            <Link
              href="https://share.hsforms.com/15RNYwmMYR0eeJbvxHWPacAdwcnz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/90 transition-colors no-underline hover:no-underline text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              AL Career Only Request
            </Link>

            <span className="text-slate-500">|</span>

            <Link
              href="https://share.hsforms.com/1yYT8FJrITVWbh3lrHu9S5Qdwcnz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/90 transition-colors no-underline hover:no-underline text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              IT Domain Acquisition
            </Link>
          </div>
        </div>
    </div>
  );
}