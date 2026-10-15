import Link from "next/link";
import { GarmentFilters } from "@/components/ruhak/garment-filters";
import { GarmentTable } from "@/components/ruhak/garment-table";
import { PaginationBar } from "@/components/ruhak/pagination-bar";
import { QuickFilter } from "@/components/ruhak/quick-filter";
import { buttonClass } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garments, garmentTypeName, regionName } from "@/lib/mock/data";
import {
  filterGarments,
  paginate,
  parseGarmentQuery,
  sortGarments,
  stockCounts,
  type RawSearchParams,
} from "@/lib/query";

/**
 * A ruhaállomány listája. A szűrés, rendezés és lapozás mind az URL-ben van,
 * a nehéz rész pedig szerveroldalon fut (később ezt az adatbázis végzi).
 */
export default async function GarmentsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parseGarmentQuery(await searchParams);
  const context = { typeName: garmentTypeName, regionName };
  const filtered = filterGarments(garments, query, context);
  const sorted = sortGarments(filtered, query.sort, query.direction);
  const result = paginate(sorted, query.page, query.perPage);
  const counts = stockCounts(garments, query, context);

  return (
    <>
      <PageHeader
        title={t.garments.title}
        description={`${formatNumber(result.total)} ${t.common.results}`}
        action={
          <Link href="/ruhak/uj" className={buttonClass("primary", "md", "gap-1.5")}>
            <IconPlus width={18} height={18} />
            {t.garments.newTitle}
          </Link>
        }
      />

      <QuickFilter query={query} counts={counts} />

      <GarmentFilters query={query} />

      <div className="mt-3">
        <GarmentTable rows={result.rows} query={query} />
      </div>

      <PaginationBar
        query={query}
        total={result.total}
        page={result.page}
        pageCount={result.pageCount}
      />
    </>
  );
}
