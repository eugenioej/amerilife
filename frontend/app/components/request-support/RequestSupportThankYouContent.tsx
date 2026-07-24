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
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {breadcrumb?.length ? (
          <SiteBreadcrumb items={breadcrumb} className="mb-8" />
        ) : null}

        <h1 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:mb-10 sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <h2 className="mb-6 text-3xl font-semibold text-[var(--color-fg)] sm:text-4xl">
            {subtitle}
          </h2>
        ) : null}

        <div className="grid gap-8 md:grid-cols-[minmax(0,min(100%,380px))_1fr] md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-[240px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 380px"
              priority={image.priority}
            />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-[#003768]">
              {messageTitle}
            </h2>
            <div className="text-base leading-relaxed text-[var(--color-fg)]">
              {message}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
