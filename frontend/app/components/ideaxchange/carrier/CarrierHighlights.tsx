import {
  Cog,
  DollarSign,
  Megaphone,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IdeaxchangeCarrierHighlight } from "@/lib/ideaxchange-carrier-queries";

type Props = {
  highlights: IdeaxchangeCarrierHighlight[];
};

const ICON_MAP: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  shield: Shield,
  dollar: DollarSign,
  cog: Cog,
  users: Users,
};

export function CarrierHighlights({ highlights }: Props) {
  const visible = highlights.filter((h) => h.label?.trim());
  if (visible.length === 0) return null;

  return (
    <section className="mt-10 border-t border-[var(--color-border)] pt-10" aria-label="Highlights">
      <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
        Highlights
      </h2>
      <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
        {visible.map((item) => {
          const key = item.icon?.trim().toLowerCase() ?? "megaphone";
          const Icon = ICON_MAP[key] ?? Megaphone;
          return (
            <li key={item.label} className="flex flex-col items-center text-center">
              <span
                className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-dark)] text-white"
                aria-hidden
              >
                <Icon className="size-7" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium italic text-[var(--color-brand-dark)]">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
