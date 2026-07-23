import Image from "next/image";
import Link from "next/link";

const amerilifeBlueLogo =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/PNG-Logo-AmeriLife-Logo-BLUE-1.png";

export default function RequestSupportHeader() {
  return (
    <div className="request-support-local-header sticky top-0 z-50 border-b border-[#e8ede8] bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center px-6 py-5">
        <Link
                href="/"
                className=""
              >
        <Image
                src={amerilifeBlueLogo}
                alt="AmeriLife"
                width={220}
                height={125}
                className="h-auto w-full max-w-[220px]"
                unoptimized
              />
        </Link>
      </div>
    </div>
  );
}