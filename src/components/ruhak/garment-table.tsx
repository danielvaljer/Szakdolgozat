import Link from "next/link";
import { ConditionBadge, StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garmentTypeName, regionName } from "@/lib/mock/data";
import type { Garment } from "@/lib/mock/types";
import { buildQueryString, type GarmentQuery, type SortKey } from "@/lib/query";
import { cn } from "@/lib/utils";

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
