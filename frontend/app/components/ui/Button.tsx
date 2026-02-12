"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--color-brand-primary)] text-white border-2 border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] hover:border-[var(--color-brand-primary-hover)]",
    secondary:
      "bg-white text-[var(--color-brand-primary)] border-2 border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] hover:border-[var(--color-brand-primary-hover)]",
    ghost: "bg-transparent text-[var(--color-fg)] hover:bg-black/5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-[var(--radius-full)] px-5 py-2.5 text-sm font-bold uppercase tracking-[var(--tracking-normal)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 disabled:opacity-50 no-underline hover:no-underline ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
