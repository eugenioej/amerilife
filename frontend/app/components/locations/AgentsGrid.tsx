import { AgentCard } from "./AgentCard";
import type { AgentData } from "@/lib/locations-data";

type AgentsGridProps = {
  agents: AgentData[];
  locationSlug: string;
};

export function AgentsGrid({ agents, locationSlug }: AgentsGridProps) {
  if (agents.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-8 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Our Agents
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {agents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} locationSlug={locationSlug} />
          ))}
        </div>
      </div>
    </section>
  );
}
