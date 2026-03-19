import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { AgentData } from "@/lib/locations-data";

type AgentCardProps = {
  agent: AgentData;
  locationSlug: string;
};

export function AgentCard({ agent, locationSlug }: AgentCardProps) {
  const locationStr = `${agent.city}, ${agent.state}`;
  const photoUrl = agent.photoUrl;
  const agentHref = `/${locationSlug}/${agent.slug}/`;

  return (
    <article className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-white p-4 sm:gap-6 sm:p-6">
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-[#f7f8f9] sm:w-36 lg:w-40">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${agent.name} - AmeriLife Agent`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 160px"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#e8e9eb] text-3xl font-bold text-[var(--color-muted)]"
            aria-hidden
          >
            {agent.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1 text-lg font-bold text-[var(--color-fg)]">{agent.name}</h3>
        <p className="mb-1 text-sm text-[var(--color-muted)]">
          {agent.role ?? "AmeriLife Agent"}
        </p>
        <p className="mb-4 text-sm text-[var(--color-fg)]">{locationStr}</p>
        <Link
          href={agentHref}
          variant="button"
          className="inline-flex items-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] no-underline"
        >
          More Info
        </Link>
      </div>
    </article>
  );
}
