/**
 * Osztálynevek összefűzése. Szándékosan függőség nélkül: ennyihez nem kell csomag.
 * (A `clsx`/`tailwind-merge`/`cva` csak akkor kerül be, ha a shadcn/ui komponenskészlet
 * megérkezik – lásd docs/dontesek.md D-0005.)
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter((value): value is string | number => Boolean(value)).join(" ");
}
