import Link from "next/link";
import { ConditionBadge, StatusBadge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { EmptyState } from "@/components/ui/empty-state";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garmentTypeName, regionName } from "@/lib/mock-data";
import type { Garment } from "@/lib/types";
import { buildQueryString, type GarmentQuery, type SortKey } from "@/lib/query";

function SortHeader({
  query,
  sortKey,
  children,
}: {
  query: GarmentQuery;
  sortKey: SortKey;
  children: string;
}) {
  const active = query.sort === sortKey;
  const nextDirection = active && query.direction === "asc" ? "desc" : "asc";
  const href = `/ruhak${buildQueryString(query, { sort: sortKey, direction: nextDirection, page: 1 })}`;

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-1 hover:text-ink", active && "text-ink")}
      title={`${children} – rendezés`}
    >
      {children}
      <span aria-hidden="true" className="text-[10px]">
        {active ? (query.direction === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </Link>
  );
}

/**
 * A lista: asztali gépen sűrű táblázat (rengeteg adat egy képernyőn),
 * mobilon ugyanaz az adat két soros, sűrű listaelemként – nem nagy kártyákként,
 * mert a lényeg a gyors áttekintés és a keresés.
 */
export function GarmentTable({ rows, query }: { rows: readonly Garment[]; query: GarmentQuery }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState clearHref="/ruhak" />
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-md border border-line bg-surface lg:block">
        <Table>
          <THead>
            <Tr>
              <Th>
                <SortHeader query={query} sortKey="code">
                  {t.columns.code}
                </SortHeader>
              </Th>
              <Th>
                <SortHeader query={query} sortKey="type">
                  {t.columns.type}
                </SortHeader>
              </Th>
              <Th>{t.columns.region}</Th>
              <Th>{t.columns.size}</Th>
              <Th>{t.columns.color}</Th>
              <Th>{t.columns.condition}</Th>
              <Th>{t.columns.status}</Th>
              <Th className="text-right">{t.columns.value}</Th>
            </Tr>
          </THead>
          <TBody>
            {rows.map((garment) => (
              <Tr key={garment.inventoryCode} className="hover:bg-surface-muted">
                <Td>
                  <Link
                    href={`/ruhak/${garment.inventoryCode}`}
                    className="font-medium tabular-nums hover:text-accent"
                  >
                    {garment.inventoryCode}
                  </Link>
                </Td>
                <Td>{garmentTypeName(garment.typeCode)}</Td>
                <Td className="text-ink-muted">{regionName(garment.regionSlug)}</Td>
                <Td className="tabular-nums">{garment.size}</Td>
                <Td className="text-ink-muted">{garment.color}</Td>
                <Td>
                  <ConditionBadge condition={garment.condition} />
                </Td>
                <Td>
                  <StatusBadge
                    status={garment.status}
                    loanedTo={garment.loanedTo}
                    dueAt={garment.dueAt}
                  />
                </Td>
                <Td className="text-right tabular-nums">{formatCurrency(garment.value)}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <ul className="overflow-hidden rounded-md border border-line bg-surface lg:hidden">
        {rows.map((garment) => (
          <li key={garment.inventoryCode} className="border-b border-line last:border-b-0">
            <Link
              href={`/ruhak/${garment.inventoryCode}`}
              className="block px-3 py-2.5 hover:bg-surface-muted"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium tabular-nums">{garment.inventoryCode}</span>
                <StatusBadge
                  status={garment.status}
                  loanedTo={garment.loanedTo}
                  dueAt={garment.dueAt}
                />
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">
                {garmentTypeName(garment.typeCode)} · {regionName(garment.regionSlug)} ·{" "}
                {garment.size} · {garment.color}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Lapozás + találati darabszám. A lapozás is LINKEKKEL működik, ezért a lista
 * állapota (szűrők + oldalszám) mindig az URL-ben van – a link megosztható.
 */
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
          className={cn(
            buttonClass("secondary", "sm", "gap-1"),
            atStart && "pointer-events-none opacity-50",
          )}
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
          className={cn(
            buttonClass("secondary", "sm", "gap-1"),
            atEnd && "pointer-events-none opacity-50",
          )}
        >
          <span className="hidden sm:inline">{t.common.next}</span>
          <IconChevronRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}
