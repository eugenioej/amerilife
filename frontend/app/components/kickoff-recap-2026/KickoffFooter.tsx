import { Link } from "@/app/components/ui/Link";

export function KickoffFooter() {
  return (
    <section className="border-t border-white bg-black py-8 text-white">
      <div className="px-6 text-center">
        <p className="mb-2 text-[14px]">
          Copyright © 2026 AmeriLife Group, LLC. All rights reserved. All
          materials on this page are for INTERNAL USE ONLY.
        </p>

        <div className="flex items-center justify-center gap-2 text-[14px]">
          <Link
            href="/terms-of-use/"
            className="text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </Link>

          <span>|</span>

          <Link
            href="/privacy-statement/"
            className="text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Statement
          </Link>
        </div>
      </div>
    </section>
  );
}