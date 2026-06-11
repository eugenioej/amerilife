import Image from "next/image";
import { IDEAXCHANGE_LOGO_SRC } from "@/lib/ideaxchange-nav";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type IdeaXchangeLogoProps = {
  className?: string;
  /** Card = image logo on login; inline = text wordmark */
  size?: "card" | "inline";
};

export function IdeaXchangeLogo({ className = "", size = "card" }: IdeaXchangeLogoProps) {
  if (size === "card") {
    return (
      <div className={`flex justify-center ${className}`}>
        <Image
          src={rewriteUploadsUrl(IDEAXCHANGE_LOGO_SRC)}
          alt="AmeriLife ideaXchange"
          width={512}
          height={220}
          className="h-auto w-full max-w-[min(100%,280px)] object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <span
      className={`whitespace-nowrap font-semibold text-[var(--color-brand-dark)] ${className}`}
    >
      ideaXchange
    </span>
  );
}

/** Inline “ideaXchange” for headings */
export function IdeaXchangeWordmark({ className = "" }: { className?: string }) {
  return <span className={`whitespace-nowrap ${className}`}>ideaXchange</span>;
}
