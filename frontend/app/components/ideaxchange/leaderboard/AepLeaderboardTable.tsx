"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { LeaderboardRow } from "@/lib/ideaxchange-leaderboard-data";
import { formatLeaderboardUpdatedDate } from "@/lib/ideaxchange-leaderboard-format";
import {
  DEFAULT_LEADERBOARD_SORT,
  LEADERBOARD_SORT_LABELS,
  nextLeaderboardSort,
  sortLeaderboardRows,
  type LeaderboardSortColumn,
  type LeaderboardSortState,
} from "@/lib/ideaxchange-leaderboard-sort";
import { Button } from "@/app/components/ui/Button";
import { ChevronDownIcon } from "@/app/components/ui/ChevronDownIcon";

const INITIAL_VISIBLE_ROWS = 10;

const DEFAULT_AEP_SORT: LeaderboardSortState = {
  column: "currentYearNewSales",
  direction: "desc",
};

type Props = {
  id?: string;
  title: string;
  rows: LeaderboardRow[];
  lastUpdated?: string | null;
};

type SortableHeaderProps = {
  column: LeaderboardSortColumn;
  label: ReactNode;
  align?: "left" | "right" | "center";
  sort: LeaderboardSortState;
  onSort: (column: LeaderboardSortColumn) => void;
  className?: string;
  tooltip?: {
    description: string;
    formula?: string;
  };
};

type HeaderTooltipProps = {
  title: string;
  description: string;
  formula?: string;
};

function HeaderTooltip({
  title,
  description,
  formula,
}: HeaderTooltipProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    arrowLeft: 0,
  });

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const tooltipWidth = Math.min(320, window.innerWidth - 24);
    const screenPadding = 12;

    // Start by centering tooltip under icon
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Keep tooltip inside left side of viewport
    left = Math.max(screenPadding, left);

    // Keep tooltip inside right side of viewport
    left = Math.min(
      left,
      window.innerWidth - tooltipWidth - screenPadding
    );

    // Position arrow over the icon
    const iconCenter = rect.left + rect.width / 2;
    const arrowLeft = iconCenter - left;

    setPosition({
      top: rect.bottom + 10,
      left,
      arrowLeft,
    });
  };

  const showTooltip = () => {
    updatePosition();
    setOpen(true);
  };

  const hideTooltip = () => {
    setOpen(false);
  };

  const toggleTooltip = () => {
    if (!open) {
      updatePosition();
    }

    setOpen((current) => !current);
  };

  useEffect(() => {
    if (!open) return;

    const reposition = () => updatePosition();

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={(e) => {
          e.stopPropagation();
          toggleTooltip();
        }}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/60 text-[10px] font-bold leading-none text-white/80 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        aria-label={`More information about ${title}`}
        aria-expanded={open}
      >
        i
      </button>

      {open && (
        <div
          role="tooltip"
          className="
            fixed z-[9999]
            w-[min(320px,calc(100vw-24px))]
            rounded-lg
            border border-[#555b96]
            bg-[#202442]
            px-5 py-4
            text-left
            shadow-xl
          "
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <span
            className="
              absolute -top-[7px]
              h-3.5 w-3.5
              -translate-x-1/2 rotate-45
              border-l border-t border-[#555b96]
              bg-[#202442]
            "
            style={{
              left: position.arrowLeft,
            }}
          />

          <span className="block text-sm font-bold tracking-normal text-white">
            {title}
          </span>

          <span className="mt-2 block text-sm font-normal leading-relaxed tracking-normal text-[#d4d6eb]">
            {description}
          </span>

          {formula && (
            <span className="mt-3 block rounded-md bg-[#141832] px-3 py-2 font-mono text-sm font-normal tracking-normal text-[#c7b8ff]">
              {formula}
            </span>
          )}
        </div>
      )}
    </>
  );
}

function SortableHeader({
  column,
  label,
  align = "left",
  sort,
  onSort,
  className = "",
  tooltip,
}: SortableHeaderProps) {
  const active = sort.column === column;
  const alignClass =
    align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "text-left";

      return (
        <th className={`px-4 py-3 sm:px-6 ${className}`} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
          <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onSort(column)}
        className="group inline-flex items-center text-xs font-bold tracking-wider text-white"
      >
        <span>{label}</span>
      </button>
      
      {tooltip && (
        <HeaderTooltip
          title={String(label)}
          description={tooltip.description}
          formula={tooltip.formula}
        />
      )}
    
      <button
        type="button"
        onClick={() => onSort(column)}
        className="group flex items-center"
        aria-label={`Sort by ${LEADERBOARD_SORT_LABELS[column]}`}
      >
        <ChevronDownIcon
          size={14}
          className={`shrink-0 transition-transform ${
            active ? "opacity-100" : "opacity-40"
          } ${
            active && sort.direction === "asc" ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
    </th>
  );
}

export function AepLeaderboardTable({ id, title, rows, lastUpdated }: Props) {
  const [sort, setSort] = useState<LeaderboardSortState>(DEFAULT_AEP_SORT);
  const [showAll, setShowAll] = useState(false);
  const formattedUpdated = formatLeaderboardUpdatedDate(lastUpdated);
  // const showThousandsNote = title !== "Medicare Advantage";
  const sortedRows = useMemo(() => sortLeaderboardRows(rows, sort), [rows, sort]);
  const hasMoreRows = sortedRows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = showAll ? sortedRows : sortedRows.slice(0, INITIAL_VISIBLE_ROWS);
  const hiddenCount = sortedRows.length - INITIAL_VISIBLE_ROWS;

  const handleSort = (column: LeaderboardSortColumn) => {
    setSort((current) => nextLeaderboardSort(current, column));
  };

  const resetSort = () => setSort(DEFAULT_AEP_SORT);

  const sortSummary = `${LEADERBOARD_SORT_LABELS[sort.column]} (${sort.direction === "asc" ? "low → high" : "high → low"})`;

  return (
    <div
      id={id}
      className="scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-[0_4px_20px_rgba(36,66,96,0.06)]"
    >
      <div className="relative flex flex-col gap-3 border-b border-[var(--color-border)] bg-[#0d0f24] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h3 className="text-center text-sm font-bold uppercase tracking-wider text-white sm:text-left">
          {title}
        </h3>

        {/* {showThousandsNote && (
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Numbers are in <span className="lowercase">(000s)</span>
          </div>
        )} */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Sorted by {sortSummary}
          </span>
          {(sort.column !== DEFAULT_AEP_SORT.column ||
            sort.direction !== DEFAULT_AEP_SORT.direction) && (

            <button
              type="button"
              onClick={resetSort}
              className="rounded-sm border border-white/40 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Reset sort
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-[var(--color-border)]">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/10/AEP27-iX-SurgeBanner-101526-EM_Mobile-2-scaled.jpg"
          />
      
          <img
            src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/10/AEP27-iX-SurgeBanner-101526-EM_Desktop-2.jpg"
            alt="AEP 2027 Production Leaderboard"
            className="block w-full h-auto"
          />
        </picture>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#0d0f24] text-white">
              
              <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-white sm:px-6">
                <div className="flex items-center gap-1">
                  <span>Affiliate</span>

                  <HeaderTooltip
                    title="Affiliate"
                    description="The AmeriLife affiliate agency that the sales are attributed to."
                  />
                </div>
              </th>

              <SortableHeader
                column="currentYearNewSales"
                label="CY New Sales"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "Current-year new sales: new Medicare applications submitted in the selected period this year.",
                }}
              />

              <SortableHeader
                column="priorYearNewSales"
                label="PY New Sales"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "Prior-year new sales: new Medicare applications for the same period last year, so you can compare like for like.",
                }}
              />

              <SortableHeader
                column="plan"
                label="Plan"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "The new-sales target (budget) set for the selected period.",
                }}
              />


              <SortableHeader
                column="forecast"
                label="Forecast"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "The latest projected new sales for the selected period, based on current run-rate and pipeline. It’s updated more often than Plan.",
                }}
              />

              <SortableHeader
                column="newSalesVsPriorYear"
                label="NS vs PY"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "Year-over-year growth in new sales. Formula: (CY New Sales − PY New Sales) ÷ PY New Sales. Positive means ahead of last year.",
                }}
              />

              <SortableHeader
                column="percentToPlan"
                label="% Plan"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "Attainment against Plan. Formula: CY New Sales ÷ Plan. 100% means the target was met.",
                }}
              />

              <SortableHeader
                column="percentOfForecast"
                label="% Forecast"
                align="right"
                sort={sort}
                onSort={handleSort}
                tooltip={{
                  description:
                    "Attainment against Forecast. Formula: CY New Sales ÷ Forecast. It shows whether results are tracking to the latest projection.",
                }}
              />
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={`${row.affiliate}-${i}`}
                className={i % 2 === 0 ? "bg-white" : "bg-[rgba(186,181,237,0.15)]"}
              >
                <td className="px-4 py-3.5 font-semibold sm:px-6">
                  {row.affiliate}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.currentYearNewSales || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.priorYearNewSales || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.plan || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.forecast || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.newSalesVsPriorYear || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.percentToPlan || "—"}
                </td>
            
                <td className="px-4 py-3.5 text-right sm:px-6">
                  {row.percentOfForecast || "—"}
                </td>
        
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMoreRows ? (
        <div className="flex justify-center border-t border-[var(--color-border)] bg-[rgba(186,181,237,0.15)] px-4 py-4 sm:px-6">
          <Button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            className="bg-white !text-[#8c298f] !border-[#8c298f] hover:!bg-white hover:!border-[#5f1b61] hover:!text-[#5f1b61]"
          >
            {showAll ? "View less" : `View more (${hiddenCount})`}
          </Button>
        </div>
      ) : null}

      {formattedUpdated ? (
        <div className="border-t border-[var(--color-border)] bg-[rgba(186,181,237,0.15)] px-4 py-3 text-center text-xs text-[var(--color-muted)] sm:px-6 sm:text-right">
          Data last updated on {formattedUpdated}
        </div>
      ) : null}
    </div>
  );
}
