export type ClassValue = string | number | false | null | undefined;

/**
 * Osztálynevek feltételes összefűzése. A `cn` a „class names" rövidítése.
 * Példa: cn("px-2", isActive && "bg-accent") → "px-2 bg-accent" vagy csak "px-2".
 *
 * Miért itt van, és nem a lib/-ben? Mert kizárólag megjelenítő komponensek használják.
 * Ennyihez nem kell csomag (a clsx/tailwind-merge csak akkor kerül be, ha a shadcn/ui
 * komponenskészlet megérkezik – lásd docs/dontesek.md D-0005).
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
