import type { Garment } from "./types";

/**
 * A lista keresése, szűrése, rendezése, lapozása.
 * Tiszta függvények: nincs bennük adatbázis és nincs bennük React – ezért egységtesztelhetők.
 * A felület az URL-ből olvassa a feltételeket, így a lista állapota megosztható.
 */

export const PER_PAGE_OPTIONS = [25, 50, 100] as const;

export type SortKey = "code" | "type" | "created" | "due";
export type SortDir = "asc" | "desc";
/** Gyors szűrő: hol van a ruha – a raktárban vagy kiadva. */
export type StockFilter = "" | "raktar" | "kiadva";

export interface GarmentQuery {
  search: string;
  stock: StockFilter;
  typeCode: string;
  regionSlug: string;
  size: string;
  condition: string;
  status: string;
  sort: SortKey;
  direction: SortDir;
  page: number;
  perPage: number;
}

export const defaultGarmentQuery: GarmentQuery = {
  search: "",
  stock: "",
  typeCode: "",
  regionSlug: "",
  size: "",
  condition: "",
  status: "",
  sort: "code",
  direction: "asc",
  page: 1,
  perPage: 25,
};

const SORT_KEYS: readonly SortKey[] = ["code", "type", "created", "due"];

export type RawSearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Az URL-ből olvasott értékek ellenőrzése: érvénytelen érték az alapértékre esik vissza. */
export function parseGarmentQuery(params: RawSearchParams): GarmentQuery {
  const sortRaw = single(params.rendez);
  const dirRaw = single(params.irany);
  const pageRaw = Number.parseInt(single(params.oldal), 10);
  const perPageRaw = Number.parseInt(single(params.sor), 10);

  const stockRaw = single(params.keszlet);
  return {
    search: single(params.q).trim(),
    stock: stockRaw === "raktar" || stockRaw === "kiadva" ? stockRaw : "",
    typeCode: single(params.tipus),
    regionSlug: single(params.tajegyseg),
    size: single(params.meret),
    condition: single(params.allapot),
    status: single(params.statusz),
    sort: SORT_KEYS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : defaultGarmentQuery.sort,
    direction: dirRaw === "csokkeno" ? "desc" : "asc",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    perPage: PER_PAGE_OPTIONS.includes(perPageRaw as (typeof PER_PAGE_OPTIONS)[number])
      ? perPageRaw
      : defaultGarmentQuery.perPage,
  };
}

/**
 * Ékezet- és kisbetű-független keresés: a magyar felhasználó „melleny”-t is beírhat,
 * és a találat megjelenik. (Az adatbázisban ezt a pg_trgm index fogja támogatni.)
 */
export function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function hasActiveFilters(query: GarmentQuery): boolean {
  return Boolean(
    query.search ||
      query.stock ||
      query.typeCode ||
      query.regionSlug ||
      query.size ||
      query.condition ||
      query.status,
  );
}

/**
 * A kereséshez a típus és a tájegység MEGJELENÍTETT nevét is be kell vonni
 * (a felhasználó „mellény”-t ír be, nem „MEL”-t). A neveket nem itt tároljuk:
 * a hívó adja át, így ez a modul adatbázis nélkül is tesztelhető.
 */
export interface SearchContext {
  typeName: (code: string) => string;
  regionName: (slug: string) => string;
}

export const emptySearchContext: SearchContext = {
  typeName: (code) => code,
  regionName: (slug) => slug,
};

export function filterGarments(
  items: readonly Garment[],
  query: GarmentQuery,
  context: SearchContext = emptySearchContext,
): Garment[] {
  const needle = fold(query.search);

  return items.filter((item) => {
    if (query.typeCode && item.typeCode !== query.typeCode) return false;
    if (query.regionSlug && item.regionSlug !== query.regionSlug) return false;
    if (query.size && item.size !== query.size) return false;
    if (query.condition && item.condition !== query.condition) return false;
    if (query.status && item.status !== query.status) return false;
    if (query.stock === "raktar" && item.status !== "available") return false;
    if (query.stock === "kiadva" && item.status !== "loaned" && item.status !== "overdue") {
      return false;
    }

    if (needle) {
      const haystack = fold(
        [
          item.inventoryCode,
          item.typeCode,
          context.typeName(item.typeCode),
          context.regionName(item.regionSlug),
          item.size,
          item.color,
          item.notes ?? "",
          item.loanedTo ?? "",
        ].join(" "),
      );
      if (!haystack.includes(needle)) return false;
    }

    return true;
  });
}

export function sortGarments(
  items: readonly Garment[],
  sort: SortKey,
  direction: SortDir,
): Garment[] {
  const factor = direction === "asc" ? 1 : -1;

  return [...items].sort((left, right) => {
    if (sort === "type") {
      return left.typeCode.localeCompare(right.typeCode) * factor || left.inventoryCode.localeCompare(right.inventoryCode);
    }
    if (sort === "created") {
      return left.createdAt.localeCompare(right.createdAt) * factor;
    }
    if (sort === "due") {
      const leftDue = left.dueAt ?? "9999-12-31";
      const rightDue = right.dueAt ?? "9999-12-31";
      return leftDue.localeCompare(rightDue) * factor;
    }
    return left.inventoryCode.localeCompare(right.inventoryCode) * factor;
  });
}

export interface Page<T> {
  rows: T[];
  total: number;
  pageCount: number;
  page: number;
}

export function paginate<T>(items: readonly T[], page: number, perPage: number): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * perPage;

  return {
    rows: items.slice(start, start + perPage),
    total,
    pageCount,
    page: safePage,
  };
}

/** A szűrőkhöz tartozó link: az alapértékeket nem tesszük bele az URL-be. */
export function buildQueryString(query: GarmentQuery, patch: Partial<GarmentQuery> = {}): string {
  const merged: GarmentQuery = { ...query, ...patch };
  const params = new URLSearchParams();

  if (merged.search) params.set("q", merged.search);
  if (merged.typeCode) params.set("tipus", merged.typeCode);
  if (merged.regionSlug) params.set("tajegyseg", merged.regionSlug);
  if (merged.size) params.set("meret", merged.size);
  if (merged.condition) params.set("allapot", merged.condition);
  if (merged.status) params.set("statusz", merged.status);
  if (merged.stock) params.set("keszlet", merged.stock);
  if (merged.sort !== defaultGarmentQuery.sort) params.set("rendez", merged.sort);
  if (merged.direction !== defaultGarmentQuery.direction) params.set("irany", merged.direction);
  if (merged.page > 1) params.set("oldal", String(merged.page));
  if (merged.perPage !== defaultGarmentQuery.perPage) params.set("sor", String(merged.perPage));

  const value = params.toString();
  return value ? `?${value}` : "";
}

export interface StockCounts {
  all: number;
  inStock: number;
  out: number;
}

/**
 * A gyors szűrő számai: a többi szűrőt (keresés, típus, tájegység, méret, állapot)
 * figyelembe veszi, de a készlet-szűrőt nem – így a felhasználó látja,
 * mennyi ruha van a másik csoportban.
 */
export function stockCounts(
  items: readonly Garment[],
  query: GarmentQuery,
  context: SearchContext = emptySearchContext,
): StockCounts {
  const base = filterGarments(items, { ...query, stock: "", status: "" }, context);

  return {
    all: base.length,
    inStock: base.filter((item) => item.status === "available").length,
    out: base.filter((item) => item.status === "loaned" || item.status === "overdue").length,
  };
}
