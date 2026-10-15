import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { buildQueryString, type GarmentQuery } from "@/lib/query";
import { cn } from "@/lib/utils";

export interface PaginationBarProps {
  query: GarmentQuery;
  total: number;
  page: number;
  pageCount: number;
}

export function PaginationBar({ query, total, page, pageCount }: PaginationBarProps) {
  const previousHref = `/ruhak${buildQueryString(query, { page: Math.max(1, page - 1) })}`;
  const nextHref = `/ruhak${buildQueryString(query, { page: Math.min(pageCount, page + 1) })}`;
  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
      <p>
        <span className="font-medium tabular-nums text-ink">{formatNumber(total)}</span>{" "}
        {t.common.results}
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={previousHref}
          aria-disabled={atStart}
          className={cn(buttonClass("secondary", "sm", "gap-1"), atStart && "pointer-events-none opacity-50")}
        >
          <IconChevronLeft width={16} height={16} />
          <span className="hidden sm:inline">{t.common.previous}</span>
        </Link>

        <span className="tabular-nums">
          {page} {t.common.of} {pageCount}
        </span>

        <Link
          href={nextHref}
          aria-disabled={atEnd}
          className={cn(buttonClass("secondary", "sm", "gap-1"), atEnd && "pointer-events-none opacity-50")}
        >
          <span className="hidden sm:inline">{t.common.next}</span>
          <IconChevronRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}
