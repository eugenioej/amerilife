import { ReactNode } from "react";

type GivesBackSectionContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function GivesBackSectionContainer({
  children,
  className = "",
}: GivesBackSectionContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[min(100%,90rem)] px-[var(--container-padding-x)] ${className}`}
    >
      {children}
    </div>
  );
}