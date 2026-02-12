import NextLink from "next/link";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  variant?: "default" | "nav";
};

export function Link({ variant = "default", className = "", ...props }: LinkProps) {
  const variants: Record<string, string> = {
    default:
      "text-[var(--color-link)] hover:text-[var(--color-link-hover)] underline-offset-4 hover:underline",
    nav: "text-white hover:text-white/90 transition-colors",
  };

  return (
    <NextLink
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  );
}
