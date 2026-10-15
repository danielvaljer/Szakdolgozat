import type {
  Garment,
  GarmentCondition,
  GarmentStatus,
  GarmentType,
  Loan,
  Member,
  Region,
} from "./types";

/**
 * Mintaadatok a felület bemutatásához (amíg az adatbázis réteg el nem készül).
 * A generálás determinisztikus: minden betöltésnél ugyanaz az adat jelenik meg,
 * így a bemutató kiszámítható és a képernyőképek összehasonlíthatók.
 */

export const garmentTypes: readonly GarmentType[] = [
  { code: "ING", name: "Ing" },
  { code: "MEL", name: "Mellény" },
  { code: "PRU", name: "Pruszlik" },
  { code: "SZO", name: "Szoknya" },
  { code: "NAD", name: "Nadrág" },
  { code: "KOT", name: "Kötény" },
  { code: "KEN", name: "Kendő" },
  { code: "CSI", name: "Csizma" },
];

export const regions: readonly Region[] = [
  { slug: "paloc", name: "Palóc" },
  { slug: "matyo", name: "Matyó" },
  { slug: "kalotaszegi", name: "Kalotaszegi" },
  { slug: "szatmari", name: "Szatmári" },
  { slug: "rabakoz", name: "Rábaközi" },
  { slug: "somogyi", name: "Somogyi" },
  { slug: "bukovinai", name: "Bukovinai" },
  { slug: "mezosegi", name: "Mezőségi" },
];

const sizesByType: Record<string, readonly string[]> = {
  ING: ["S", "M", "L", "XL", "XXL"],
  MEL: ["S", "M", "L", "XL"],
  PRU: ["S", "M", "L", "XL"],
  SZO: ["34", "36", "38", "40", "42", "44"],
  NAD: ["34", "36", "38", "40", "42", "44"],
  KOT: ["egységes"],
  KEN: ["egységes"],
  CSI: ["36", "37", "38", "39", "40", "41", "42"],
};

/** A méretszűrő választékához. */
export const allSizes: readonly string[] = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "34",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "44",
  "egységes",
];

const colors: readonly string[] = [
  "Piros",
  "Fehér",
  "Kék",
  "Zöld",
  "Fekete",
  "Bíbor",
  "Arany",
  "Sárga",
];

const conditions: readonly GarmentCondition[] = ["new", "good", "worn", "damaged"];

const lastNames: readonly string[] = [
  "Kovács",
  "Nagy",
  "Tóth",
  "Szabó",
  "Horváth",
  "Varga",
  "Kiss",
  "Molnár",
  "Németh",
  "Farkas",
  "Balogh",
  "Papp",
  "Lakatos",
  "Takács",
  "Juhász",
  "Mészáros",
];

const firstNames: readonly string[] = [
  "Anna",
  "Bence",
  "Csilla",
  "Dóra",
  "Eszter",
  "Ferenc",
  "Gábor",
  "Hanna",
  "Ilona",
  "János",
  "Katalin",
  "László",
  "Márta",
  "Nóra",
  "Orsolya",
  "Péter",
  "Réka",
  "Sándor",
  "Tamás",
  "Zsófia",
];

const noteSamples: readonly string[] = [
  "Kézzel hímzett darab.",
  "Kis folt a szegélyen.",
  "A derékrész szűkítve lett.",
  "Páros darab, csak együtt adható ki.",
  "Régi, de eredeti anyagból.",
];

/** Fix viszonyítási dátum – ettől determinisztikus a generálás. */
const REFERENCE_DATE = Date.UTC(2026, 9, 14, 9, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

function makeRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

function pick<T>(random: () => number, list: readonly T[]): T {
  return list[Math.floor(random() * list.length)];
}

function isoDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export const members: readonly Member[] = (() => {
  const random = makeRandom(2026);
  const list: Member[] = [];

  for (let index = 0; index < 28; index += 1) {
    const name = `${pick(random, lastNames)} ${pick(random, firstNames)}`;
    const slug = name.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
    list.push({
      id: `M-${String(index + 1).padStart(4, "0")}`,
      name,
      email: `${slug}@example.hu`,
      phone: `+36 30 ${String(1000000 + Math.floor(random() * 8999999)).slice(0, 7)}`,
      active: random() < 0.88,
      memberSince: isoDate(REFERENCE_DATE - Math.floor(300 + random() * 2500) * DAY),
    });
  }

  return list;
})();

function rollStatus(random: () => number): GarmentStatus {
  const value = random();
  if (value < 0.66) return "available";
  if (value < 0.86) return "loaned";
  if (value < 0.92) return "overdue";
  if (value < 0.98) return "repair";
  return "lost";
}

export const garments: readonly Garment[] = (() => {
  const random = makeRandom(1965);
  const counters = new Map<string, number>();
  const list: Garment[] = [];

  for (let index = 0; index < 180; index += 1) {
    const type = pick(random, garmentTypes);
    const sequence = (counters.get(type.code) ?? 0) + 1;
    counters.set(type.code, sequence);

    const status = rollStatus(random);
    const isLoaned = status === "loaned" || status === "overdue";
    /* A kiadás alapesetben határozatlan idejű: csak a kiadottak egy részének van határideje. */
    const openEnded = status === "loaned" && random() < 0.3;
    const dueOffset =
      status === "loaned" ? Math.floor(random() * 21) + 2 : -(Math.floor(random() * 9) + 1);

    list.push({
      inventoryCode: `${type.code}-${String(sequence).padStart(4, "0")}`,
      typeCode: type.code,
      regionSlug: pick(random, regions).slug,
      size: pick(random, sizesByType[type.code] ?? ["egységes"]),
      color: pick(random, colors),
      condition: pick(random, conditions),
      status,
      loanedTo: isLoaned ? pick(random, members).name : null,
      dueAt: isLoaned && !openEnded ? isoDate(REFERENCE_DATE + dueOffset * DAY) : null,
      createdAt: isoDate(REFERENCE_DATE - Math.floor(10 + random() * 1200) * DAY),
      value: (Math.floor(random() * 170) + 16) * 500,
      notes: random() < 0.35 ? pick(random, noteSamples) : null,
    });
  }

  return [...list].sort((left, right) => left.inventoryCode.localeCompare(right.inventoryCode));
})();

/** Kiadási előzmények – az áttekintéshez és a ruha adatlapjához. */
export const loans: readonly Loan[] = garments
  .filter((garment) => garment.status === "loaned" || garment.status === "overdue")
  .map((garment, index) => {
    const member = members[index % members.length];
    const due = garment.dueAt;
    const dueMs = due ? new Date(`${due}T00:00:00Z`).getTime() : REFERENCE_DATE;
    return {
      id: `L-${String(index + 1).padStart(4, "0")}`,
      inventoryCode: garment.inventoryCode,
      memberId: member.id,
      memberName: garment.loanedTo ?? member.name,
      loanedAt: isoDate(dueMs - 14 * DAY),
      returnedAt: null,
      dueAt: due,
    };
  });

export function garmentTypeName(code: string): string {
  return garmentTypes.find((type) => type.code === code)?.name ?? code;
}

export function regionName(slug: string): string {
  return regions.find((region) => region.slug === slug)?.name ?? slug;
}

export interface GarmentStats {
  total: number;
  available: number;
  loaned: number;
  overdue: number;
  repair: number;
}

export function garmentStats(items: readonly Garment[]): GarmentStats {
  return {
    total: items.length,
    available: items.filter((item) => item.status === "available").length,
    loaned: items.filter((item) => item.status === "loaned").length,
    overdue: items.filter((item) => item.status === "overdue").length,
    repair: items.filter((item) => item.status === "repair").length,
  };
}

/** A legközelebbi határidők elöl; a határozatlan idejű kiadások a végén. */
export function recentLoans(limit: number): readonly Loan[] {
  return [...loans]
    .sort((left, right) =>
      (left.dueAt ?? "9999-12-31").localeCompare(right.dueAt ?? "9999-12-31"),
    )
    .slice(0, limit);
}

export function loansForGarment(inventoryCode: string): readonly Loan[] {
  return loans.filter((loan) => loan.inventoryCode === inventoryCode);
}

export function garmentsForMember(memberId: string): readonly Garment[] {
  const member = members.find((item) => item.id === memberId);
  if (!member) return [];
  return garments.filter((garment) => garment.loanedTo === member.name);
}

export function findGarment(inventoryCode: string): Garment | undefined {
  return garments.find((garment) => garment.inventoryCode === inventoryCode);
}

