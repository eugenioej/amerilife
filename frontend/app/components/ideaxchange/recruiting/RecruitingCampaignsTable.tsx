"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import type { CampaignTableRow } from "@/lib/ideaxchange-recruiting-utils";
import { caseStudyHref } from "@/lib/ideaxchange-recruiting-utils";

type Props = {
  rows: CampaignTableRow[];
};

type SortKey = keyof Pick<
  CampaignTableRow,
  "title" | "targetAudience" | "spend" | "results"
>;

type SortDirection = "asc" | "desc";

type SortIconProps = {
  column: SortKey;
  activeColumn: SortKey;
  direction: SortDirection;
};

function SortIcon({
  column,
  activeColumn,
  direction,
}: SortIconProps) {
  if (activeColumn !== column) {
    return <ChevronDown className="ml-1 h-3 w-3 opacity-50" />;
  }

  return direction === "asc" ? (
    <ChevronDown className="ml-1 h-3 w-3" />
  ) : (
    <ChevronUp className="ml-1 h-3 w-3" />
  );
}

export function RecruitingCampaignsTable({ rows }: Props) {

  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aValue = String(a[sortKey] ?? "");
      const bValue = String(b[sortKey] ?? "");
    
      const result = aValue.localeCompare(bValue, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    
      return sortDirection === "asc" ? result : -result;
    });
  }, [rows, sortKey, sortDirection]);

  function handleSort(nextSortKey: SortKey) {
    if (nextSortKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
  
    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-[0_4px_20px_rgba(36,66,96,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[var(--color-brand-dark)] text-white">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider sm:px-6">
                <button
                  type="button"
                  onClick={() => handleSort("title")}
                  className="inline-flex items-center text-left uppercase tracking-wider"
                >
                  Campaign
                    <SortIcon
                      column="title"
                      activeColumn={sortKey}
                      direction={sortDirection}
                    />
                </button>
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider sm:px-6">
                <button
                  type="button"
                  onClick={() => handleSort("targetAudience")}
                  className="inline-flex items-center text-left uppercase tracking-wider"
                >
                  Target Audience{" "}
                <SortIcon
                  column="targetAudience"
                  activeColumn={sortKey}
                  direction={sortDirection}
                />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider sm:px-6">
                <button
                  type="button"
                  onClick={() => handleSort("spend")}
                  className="ml-auto inline-flex items-center text-right uppercase tracking-wider"
                >
                  Spend{" "}
                  <SortIcon
                    column="spend"
                    activeColumn={sortKey}
                    direction={sortDirection}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider sm:px-6">
                <button
                  type="button"
                  onClick={() => handleSort("results")}
                  className="ml-auto inline-flex items-center text-right uppercase tracking-wider"
                >
                  Results{" "}
                <SortIcon
                  column="results"
                  activeColumn={sortKey}
                  direction={sortDirection}
                />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => {
              const href = caseStudyHref(row.slug);
              const overview = row.overview.trim();
              return (
                <tr
                  key={row.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"}
                >
                  <td className="px-4 py-3.5 sm:px-6">
                    <div className="flex items-start gap-2">
                      <Link
                        href={href}
                        variant="button"
                        className="text-left font-semibold text-[var(--color-brand-primary)] hover:underline"
                      >
                        {row.title}
                      </Link>
                      {overview ? (
                        <button
                          type="button"
                          title={overview}
                          aria-label={`Overview: ${row.title}`}
                          className="mt-0.5 shrink-0 text-[var(--color-muted)] hover:text-[var(--color-brand-primary)]"
                        >
                          <Info className="h-4 w-4" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)] sm:px-6">
                    {row.targetAudience}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-[var(--color-brand-dark)] sm:px-6">
                    {row.spend}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-[var(--color-fg)] sm:px-6">
                    {row.results}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
