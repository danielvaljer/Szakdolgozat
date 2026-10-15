import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { buildQueryString, type GarmentQuery, type StockCounts } from "@/lib/query";
import { cn } from "@/lib/utils";

const options: readonly { value: "" | "raktar" | "kiadva"; label: string }[] = [
  { value: "", label: t.garments.stockAll },
  { value: "raktar", label: t.garments.inStock },
  { value: "kiadva", label: t.garments.outOfStock },
];

/**
 * Gyors szűrő: egyetlen kattintás a raktárban lévő és a kiadott ruhák között.
 * Linkek, nem űrlap – így azonnal működik, JavaScript nélkül is, és a link megosztható.
 */
export function QuickFilter({ query, counts }: { query: GarmentQuery; counts: StockCounts }) {
  function countFor(value: string): number {
    if (value === "raktar") return counts.inStock;
    if (value === "kiadva") return counts.out;
    return counts.all;
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {t.garments.stockFilter}
      </span>
      <div
        className="inline-flex rounded-sm border border-line bg-surface p-0.5"
        role="group"
        aria-label={t.garments.stockFilter}
      >
        {options.map((option) => {
          const active = query.stock === option.value;
          return (
            <Link
              key={option.value || "mind"}
              href={`/ruhak${buildQueryString(query, { stock: option.value, page: 1 })}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-accent text-on-accent"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              {option.label}
              <span className={cn("text-xs tabular-nums", active ? "text-on-accent/80" : "text-ink-muted")}>
                {formatNumber(countFor(option.value))}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
