import NextLink from "next/link";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  variant?: "default" | "nav" | "button";
};

function isExternal(href: React.ComponentProps<typeof NextLink>["href"]): boolean {
  if (typeof href !== "string") return false;
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
}

export function Link({ variant = "default", className = "", href, target, rel, ...props }: LinkProps) {
  const variants: Record<string, string> = {
    default:
      "text-[var(--color-link)] hover:text-[var(--color-link-hover)] underline-offset-4 hover:underline",
    nav: "text-white hover:text-white/90 transition-colors no-underline hover:no-underline",
    button: "no-underline hover:no-underline",
  };

  const external = isExternal(href);
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = rel ?? (external ? "noopener noreferrer" : undefined);

  return (
    <NextLink
      href={href}
      className={`${variants[variant]} ${className}`}
      target={resolvedTarget}
      rel={resolvedRel}
      {...props}
    />
  );
}
