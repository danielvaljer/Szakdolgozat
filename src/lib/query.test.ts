import { describe, expect, it } from "vitest";
import type { Garment } from "./types";
import {
  buildQueryString,
  defaultGarmentQuery,
  filterGarments,
  fold,
  paginate,
  parseGarmentQuery,
  sortGarments,
  stockCounts,
} from "./query";

/**
 * A lista logikájának egységtesztjei (októberi követelmény: az adatkezelési logika tesztelése).
 * Adatbázis és felület nélkül futnak, mert a keresés/szűrés/rendezés tiszta függvény.
 */

function garment(partial: Partial<Garment> & { inventoryCode: string }): Garment {
  return {
    typeCode: "ING",
    regionSlug: "paloc",
    size: "M",
    color: "Piros",
    condition: "good",
    status: "available",
    loanedTo: null,
    dueAt: null,
    createdAt: "2026-01-01",
    value: 20_000,
    notes: null,
    ...partial,
  };
}

const sample: readonly Garment[] = [
  garment({ inventoryCode: "ING-0001" }),
  garment({
    inventoryCode: "MEL-0002",
    typeCode: "MEL",
    size: "L",
    status: "loaned",
    loanedTo: "Kovács Anna",
    dueAt: "2026-11-01",
  }),
  garment({
    inventoryCode: "SZO-0003",
    typeCode: "SZO",
    regionSlug: "matyo",
    size: "38",
    status: "overdue",
    dueAt: "2026-10-01",
  }),
  garment({
    inventoryCode: "CSI-0004",
    typeCode: "CSI",
    size: "40",
    notes: "Kézzel hímzett darab.",
  }),
];

describe("parseGarmentQuery", () => {
  it("üres paraméterekből az alapértéket adja", () => {
    expect(parseGarmentQuery({})).toEqual(defaultGarmentQuery);
  });

  it("érvénytelen értékeket az alapértékre esik vissza (nem hibázik el)", () => {
    const query = parseGarmentQuery({ oldal: "-3", sor: "999", rendez: "izé", irany: "fura" });
    expect(query.page).toBe(1);
    expect(query.perPage).toBe(25);
    expect(query.sort).toBe("code");
    expect(query.direction).toBe("asc");
  });

  it("az érvényes értékeket átveszi", () => {
    const query = parseGarmentQuery({ oldal: "3", sor: "50", rendez: "due", irany: "csokkeno", q: "  ing  " });
    expect(query.page).toBe(3);
    expect(query.perPage).toBe(50);
    expect(query.sort).toBe("due");
    expect(query.direction).toBe("desc");
    expect(query.search).toBe("ing");
  });

  it("a tömbös paraméter első értékét használja", () => {
    expect(parseGarmentQuery({ tipus: ["MEL", "SZO"] }).typeCode).toBe("MEL");
  });
});

describe("fold és keresés", () => {
  it("az ékezeteket eltünteti", () => {
    expect(fold("Mellény")).toBe("melleny");
  });

  it("ékezet nélkül beírt keresés is talál (a típus megjelenített nevét is keresi)", () => {
    const context = {
      typeName: (code: string) => (code === "MEL" ? "Mellény" : code),
      regionName: (slug: string) => slug,
    };
    const rows = filterGarments(sample, { ...defaultGarmentQuery, search: "melleny" }, context);
    expect(rows.map((row) => row.inventoryCode)).toEqual(["MEL-0002"]);
  });

  it("a megjegyzésben és a kiadott tag nevében is keres", () => {
    expect(filterGarments(sample, { ...defaultGarmentQuery, search: "hímzett" })).toHaveLength(1);
    expect(filterGarments(sample, { ...defaultGarmentQuery, search: "kovács" })).toHaveLength(1);
  });
});

describe("filterGarments", () => {
  it("státuszra és típusra szűr", () => {
    expect(filterGarments(sample, { ...defaultGarmentQuery, status: "available" })).toHaveLength(2);
    expect(filterGarments(sample, { ...defaultGarmentQuery, typeCode: "SZO" })).toHaveLength(1);
  });

  it("a szűrők együtt érvényesülnek", () => {
    const rows = filterGarments(sample, { ...defaultGarmentQuery, typeCode: "SZO", size: "38" });
    expect(rows).toHaveLength(1);
    expect(filterGarments(sample, { ...defaultGarmentQuery, typeCode: "SZO", size: "40" })).toHaveLength(0);
  });
});

describe("sortGarments", () => {
  it("azonosító szerint növekvő és csökkenő sorrendben", () => {
    expect(sortGarments(sample, "code", "asc").map((row) => row.inventoryCode)).toEqual([
      "CSI-0004",
      "ING-0001",
      "MEL-0002",
      "SZO-0003",
    ]);
    expect(sortGarments(sample, "code", "desc")[0]?.inventoryCode).toBe("SZO-0003");
  });

  it("határidő szerint a kiadott ruhák elöl vannak", () => {
    const sorted = sortGarments(sample, "due", "asc");
    expect(sorted[0]?.inventoryCode).toBe("SZO-0003");
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 60 }, (_, index) => index);

  it("kiszámolja a lapokat és a szeletet", () => {
    const page = paginate(items, 2, 25);
    expect(page.total).toBe(60);
    expect(page.pageCount).toBe(3);
    expect(page.rows).toHaveLength(25);
    expect(page.rows[0]).toBe(25);
  });

  it("a túl nagy és túl kicsi oldalszámot a lehetséges tartományba hozza", () => {
    expect(paginate(items, 99, 25).page).toBe(3);
    expect(paginate(items, 0, 25).page).toBe(1);
  });
});

describe("buildQueryString", () => {
  it("az alapértékeket nem teszi az URL-be", () => {
    expect(buildQueryString(defaultGarmentQuery)).toBe("");
  });

  it("csak a megadott értékeket tartalmazza", () => {
    const value = buildQueryString(defaultGarmentQuery, { search: "ing", status: "loaned", page: 2 });
    expect(value).toBe("?q=ing&statusz=loaned&oldal=2");
  });
});

describe("készlet szerinti gyors szűrés", () => {
  it("szétválasztja a raktárban lévő és a kiadott ruhákat", () => {
    expect(filterGarments(sample, { ...defaultGarmentQuery, stock: "raktar" })).toHaveLength(2);

    const out = filterGarments(sample, { ...defaultGarmentQuery, stock: "kiadva" });
    expect(out.map((row) => row.inventoryCode)).toEqual(["MEL-0002", "SZO-0003"]);
  });

  it("a kiadottak közé a lejárt ruha is beletartozik", () => {
    const out = filterGarments(sample, { ...defaultGarmentQuery, stock: "kiadva" });
    expect(out.some((row) => row.status === "overdue")).toBe(true);
  });

  it("a darabszámok a többi szűrőt is figyelembe veszik", () => {
    expect(stockCounts(sample, defaultGarmentQuery)).toEqual({ all: 4, inStock: 2, out: 2 });

    const onlySkirt = stockCounts(sample, { ...defaultGarmentQuery, typeCode: "SZO" });
    expect(onlySkirt).toEqual({ all: 1, inStock: 0, out: 1 });
  });

  it("a készlet-szűrő bekerül az URL-be, és az érvénytelen érték nem", () => {
    expect(buildQueryString(defaultGarmentQuery, { stock: "kiadva" })).toBe("?keszlet=kiadva");
    expect(parseGarmentQuery({ keszlet: "mind" }).stock).toBe("");
  });
});

describe("határozatlan kiadási határidő", () => {
  const rows = [
    garment({ inventoryCode: "A-1", status: "loaned", dueAt: null }),
    garment({ inventoryCode: "B-2", status: "loaned", dueAt: "2026-11-01" }),
  ];

  it("rendezésnél a határidő nélküli ruha kerül a végére", () => {
    expect(sortGarments(rows, "due", "asc").map((row) => row.inventoryCode)).toEqual([
      "B-2",
      "A-1",
    ]);
  });

  it("a határidő nélküli kiadás is a kiadottak között van", () => {
    const out = filterGarments(rows, { ...defaultGarmentQuery, stock: "kiadva" });
    expect(out).toHaveLength(2);
  });
});
