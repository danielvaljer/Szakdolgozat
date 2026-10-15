/**
 * Formázás egy helyen (AGENTS.md / design 7. pont).
 * Beépített `Intl`-t használunk: nincs dátum- vagy pénzformázó könyvtár.
 * (Lásd docs/dontesek.md D-0001 – elvetett csomagok.)
 */

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("hu-HU");

const currencyFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "HUF",
  maximumFractionDigits: 0,
});

export function formatDate(value: string | null): string {
  if (!value) return "–";
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

/** Hány nap van hátra a megadott dátumig (negatív, ha lejárt). */
export function daysUntil(value: string, reference: Date = new Date()): number {
  const target = new Date(`${value}T00:00:00`);
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export function formatDays(days: number): string {
  if (days === 0) return "ma jár le";
  if (days > 0) return `${days} nap múlva`;
  const overdue = Math.abs(days);
  return `${overdue} napja lejárt`;
}
