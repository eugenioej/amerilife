import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  children: ReactNode;
}

export function KickoffAccordion({ title, children }: Props) {
  return (
    <details className="group mb-2 overflow-hidden rounded-sm border border-[#d7d7d7] bg-white">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-5 font-medium text-[#244260] list-none transition-colors hover:bg-[#f7f7f7]">
        <span>{title}</span>

        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>

      <div className="border-t border-[#e5e5e5] bg-[#fafafa] px-4 py-4 text-sm">
        {children}
      </div>
    </details>
  );
}