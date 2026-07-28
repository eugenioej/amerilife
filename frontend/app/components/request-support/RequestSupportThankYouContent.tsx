import Image from "next/image";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { SiteBreadcrumbItem } from "@/app/components/layout/SiteBreadcrumb";

export type BreadcrumbItem = SiteBreadcrumbItem;

type Props = {
  breadcrumb?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  image: { src: string; alt: string; priority?: boolean };
  messageTitle: string;
  message: React.ReactNode;
};

export function RequestSupportThankYouContent({
  breadcrumb,
  title,
  subtitle,
  image,
  messageTitle,
  message,
}: Props) {
  return (
    <section className="bg-white py-16 sm:py-42">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {breadcrumb?.length ? (
          <SiteBreadcrumb items={breadcrumb} className="mb-8" />
        ) : null}

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:mb-10 sm:text-4xl">
          {messageTitle}
        </h1>

        <div>
          <div className="text-base leading-relaxed text-[var(--color-fg)]">
            {message}
          </div>
        </div>
      </div>
    </section>
  );
}
