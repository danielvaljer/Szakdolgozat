"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { IconClose, IconSearch } from "@/components/ui/icons";
import { t } from "@/lib/i18n/hu";
import { allSizes, garmentTypes, regions } from "@/lib/mock/data";
import { hasActiveFilters, PER_PAGE_OPTIONS, type GarmentQuery } from "@/lib/query";

/**
 * Szűrősáv. A szűrők az URL-ben élnek, ezért ez egy egyszerű GET űrlap:
 * JavaScript nélkül is működik, JavaScripttel a legördülők azonnal alkalmazódnak.
 * Négy szűrő látszik, a többi a „Szűrők +” panelben (design 6. pont).
 */
export function GarmentFilters({ query }: { query: GarmentQuery }) {
  function submitOnChange(event: ChangeEvent<HTMLSelectElement>) {
    event.currentTarget.form?.requestSubmit();
  }

  const statusOptions: readonly [string, string][] = [
    ["available", t.status.available],
    ["loaned", t.status.loaned],
    ["overdue", t.status.overdue],
    ["repair", t.status.repair],
    ["lost", t.status.lost],
  ];

  const conditionOptions: readonly [string, string][] = [
    ["new", t.condition.new],
    ["good", t.condition.good],
    ["worn", t.condition.worn],
    ["damaged", t.condition.damaged],
  ];

  return (
    <form action="/ruhak" method="get" className="rounded-md border border-line bg-surface p-3">
      <input type="hidden" name="rendez" value={query.sort} />
      <input type="hidden" name="irany" value={query.direction} />
      {query.stock ? <input type="hidden" name="keszlet" value={query.stock} /> : null}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[220px] flex-1">
          <Label htmlFor="q">{t.common.search}</Label>
          <div className="relative">
            <IconSearch
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
              width={16}
              height={16}
            />
            <Input
              id="q"
              name="q"
              defaultValue={query.search}
              placeholder={t.common.searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-[150px]">
          <Label htmlFor="tipus">{t.columns.type}</Label>
          <Select id="tipus" name="tipus" defaultValue={query.typeCode} onChange={submitOnChange}>
            <option value="">{t.common.all}</option>
            {garmentTypes.map((type) => (
              <option key={type.code} value={type.code}>
                {type.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-[150px]">
          <Label htmlFor="tajegyseg">{t.columns.region}</Label>
          <Select id="tajegyseg" name="tajegyseg" defaultValue={query.regionSlug} onChange={submitOnChange}>
            <option value="">{t.common.all}</option>
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {region.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-[150px]">
          <Label htmlFor="statusz">{t.columns.status}</Label>
          <Select id="statusz" name="statusz" defaultValue={query.status} onChange={submitOnChange}>
            <option value="">{t.common.all}</option>
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <details className="w-full lg:w-auto">
          <summary className="cursor-pointer select-none rounded-sm px-2 py-2 text-sm text-ink-muted hover:text-ink">
            {t.common.filters} +
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="w-[130px]">
              <Label htmlFor="meret">{t.columns.size}</Label>
              <Select id="meret" name="meret" defaultValue={query.size} onChange={submitOnChange}>
                <option value="">{t.common.all}</option>
                {allSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-[130px]">
              <Label htmlFor="allapot">{t.columns.condition}</Label>
              <Select id="allapot" name="allapot" defaultValue={query.condition} onChange={submitOnChange}>
                <option value="">{t.common.all}</option>
                {conditionOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-[130px]">
              <Label htmlFor="sor">{t.common.rowsPerPage}</Label>
              <Select id="sor" name="sor" defaultValue={String(query.perPage)} onChange={submitOnChange}>
                {PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={String(option)}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </details>

        <div className="flex items-center gap-2">
          <button type="submit" className={buttonClass("secondary")}>
            {t.common.filters}
          </button>
          {hasActiveFilters(query) ? (
            <Link href="/ruhak" className={buttonClass("ghost", "md", "gap-1.5")}>
              <IconClose width={16} height={16} />
              {t.common.clearFilters}
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
